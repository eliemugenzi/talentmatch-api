import { Request, Response } from 'express';
import asyncHandler from 'middlewares/asyncHandler';
import jsonResponse from 'helpers/jsonResponse';
import * as statusCodes from 'constants/statusCodes';
import User from 'models/User';
import AuthHelper from 'helpers/AuthHelper';

export const signUp = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
  const { body } = req;

  let user = await User.findOne({
    where: {
      email: body.email,
    },
  });

  if (user) {
    return jsonResponse({
      res,
      status: statusCodes.CONFLICT,
      message: 'A User with this email address already exists',
    });
  }

  user = await User.create({
    ...body,
    role: 'hr',
  });

  const token = await AuthHelper.generateToken({
    ...user?.get(),
    password: undefined,
  });

  return jsonResponse({
    res,
    status: statusCodes.CREATED,
    message: 'Thank you for registering. Now you can use your new credentials to login',
    data: {
      ...user?.get(),
      token,
    },
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { body } = req;

  const user = await User.findOne({
    where: {
      email: body.email,
    },
  });

  if (!user) {
    return jsonResponse({
      res,
      status: statusCodes.BAD_REQUEST,
      message: 'Email and password dont match',
    });
  }

  if (!AuthHelper.comparePassword(body.password, user.password)) {
    return jsonResponse({
      res,
      status: statusCodes.BAD_REQUEST,
      message: 'Email and password dont match',
    });
  }

  const token = await AuthHelper.generateToken({
    ...user.get(),
    password: undefined,
  });

  return jsonResponse({
    res,
    status: statusCodes.OK,
    data: {
      ...user?.get(),
      token,
    },
  });
});
