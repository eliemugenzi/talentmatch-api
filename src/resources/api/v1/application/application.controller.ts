import { NextFunction, Response } from 'express';
import { Op } from 'sequelize';
import asyncHandler from 'middlewares/asyncHandler';
import jsonResponse from 'helpers/jsonResponse';

import Application from 'models/Application';
import User from 'models/User';
import Job from 'models/Job';
import { NOT_FOUND, OK } from 'constants/statusCodes';

export const getMany = asyncHandler(async (req: any, res: Response) => {
  const {
    query: { page = 1, limit = 10, search },
  } = req;

  const offset = limit * (page - 1);

  const filter: any = {};

  if (search) {
    filter[Op.or] = [];
    filter[Op.or].push({
      title: {
        [Op.iLike]: `%${search}%`,
      },
    });
    filter[Op.or].push({
      description: {
        [Op.iLike]: `%${search}%`,
      },
    });
  }

  const applications = await Application.findAndCountAll({
    include: [
      {
        model: User,
        as: 'user',
        order: [
          ['first_name', 'ASC'],
          ['last_name', 'ASC'],
        ],
        required: true,
      },
      {
        model: Job,
        as: 'job',
        required: true,
        where: {
          ...filter,
        },
      },
    ],
    offset,
    limit,
  });

  const total = applications.count;
  const pages = Math.ceil(total / limit);

  return jsonResponse({
    res,
    status: OK,
    data: applications.rows,
    meta: {
      page,
      pages,
      total,
    },
  });
});

export const checkApplication = asyncHandler(
  async (req: any, res: Response, next: NextFunction): Promise<any> => {
    const { params } = req;

    const foundApplication = await Application.findByPk(params.id, {
      include: [
        {
          model: User,
          as: 'user',
        },
        {
          model: Job,
          as: 'job',
        },
      ],
    });

    if (!foundApplication) {
      return jsonResponse({
        res,
        status: NOT_FOUND,
        message: 'The application you are looking for is not found',
      });
    }

    req.application = foundApplication;

    return next();
  },
);

export const getOne = asyncHandler(async (req: any, res: Response) => {
  const { application } = req;

  return jsonResponse({
    res,
    status: OK,
    data: {
      ...application?.get(),
    },
  });
});

export const changeStatus = ({ status }: { status: 'dropped' | 'passed' }): any =>
  asyncHandler(async (req: any, res: Response): Promise<Response> => {
    const { application } = req;

    await application?.update({
      status,
    });

    return jsonResponse({
      res,
      status: OK,
      message: 'Application has been updated',
      data: {
        ...application?.get(),
      },
    });
  });
