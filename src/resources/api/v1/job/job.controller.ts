import { Request, Response, NextFunction } from 'express';
import { Op } from 'sequelize';
import asyncHandler from 'middlewares/asyncHandler';
import jsonResponse from 'helpers/jsonResponse';
import * as statusCodes from 'constants/statusCodes';
import Job from 'models/Job';
import Application from 'models/Application';
import User from 'models/User';

export const createJob = asyncHandler(async (req: Request, res: Response) => {
  const { body } = req;

  const job = await Job.create({
    ...body,
  });

  return jsonResponse({
    res,
    status: statusCodes.CREATED,
    message: 'A job has been created',
    data: {
      ...job.get(),
    },
  });
});

export const checkJob = asyncHandler(
  async (req: any, res: Response, next: NextFunction): Promise<any> => {
    const { params } = req;

    const foundJob = await Job.findByPk(params?.id);

    if (!foundJob) {
      return jsonResponse({
        res,
        status: statusCodes.NOT_FOUND,
        message: 'This job is not found',
      });
    }

    req.job = foundJob;

    return next();
  },
);

export const getMany = asyncHandler(async (req: any, res: Response): Promise<any> => {
  const {
    params: { page = 1, limit = 10, search },
  } = req;

  const filter: any = {};

  const offset = limit * (page - 1);

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

  const jobs = await Job.findAndCountAll({
    where: {
      ...filter,
    },
    offset,
    limit,
    order: [['id', 'DESC']],
    include: [
      {
        model: Application,
        as: 'applications',
      },
    ],
  });

  const total = jobs.count;
  const pages = Math.ceil(total / limit);

  return jsonResponse({
    res,
    status: statusCodes.OK,
    data: jobs.rows,
    meta: {
      page,
      pages,
      total,
    },
  });
});

export const getOne = asyncHandler(async (req: any, res: Response): Promise<Response> => {
  const { job } = req;

  return jsonResponse({
    res,
    status: statusCodes.OK,
    data: {
      ...job.get(),
    },
  });
});

export const applyJob = asyncHandler(async (req: any, res: Response) => {
  const { body, job } = req;

  let user = await User.findOne({
    where: {
      email: body.email,
    },
  });

  if (!user) {
    user = await User.create({
      first_name: body.first_name,
      last_name: body.last_name,
      phone_number: body.phone_number,
      password: '123456',
      role: 'applicant',
      email: body.email,
    });
  }

  const application = await Application.create(
    {
      resume_url: body.resume_url,
      user_id: user.id,
      job_id: job.id,
      description: body.description,
    },
    {
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
    },
  );

  return jsonResponse({
    res,
    status: statusCodes.CREATED,
    message:
      'An application has been sent successfully, we will reachout in case we feel you are a great fit.',
    data: {
      ...application.get(),
    },
  });
});
