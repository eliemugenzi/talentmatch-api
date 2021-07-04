import { Response } from 'express';
import { Op } from 'sequelize';
import asyncHandler from 'middlewares/asyncHandler';
import jsonResponse from 'helpers/jsonResponse';

import Application from 'models/Application';
import User from 'models/User';
import Job from 'models/Job';
import { OK } from 'constants/statusCodes';

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
