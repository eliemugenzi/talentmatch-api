import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { Response, NextFunction } from 'express';

import Token from 'models/Token';
import User from 'models/User';
import * as statusCodes from 'constants/statusCodes';
import jsonResponse from 'helpers/jsonResponse';
import asyncHandler from './asyncHandler';
import AuthHelper from 'helpers/AuthHelper';

const { JWT_SECRET_KEY = '' } = process.env;

interface CheckAuth {
  confirmPassword?: boolean;
  roles?: Array<'applicant' | 'hr'>;
}

const checkAuth = ({ roles = [], confirmPassword }: CheckAuth = {}): any =>
  asyncHandler(async (req: any, res: Response, next: NextFunction) => {
    const { authorization = '' } = req.headers;
    const token = authorization.slice(4);

    if (!token) {
      return jsonResponse({
        res,
        status: statusCodes.UNAUTHORIZED,
        code: 'AUT_01',
        message: 'Unauthorized access',
      });
    }

    const foundToken = await Token.findOne({
      where: {
        token,
        status: 'active',
      },
      include: [
        {
          model: User,
          as: 'user',
        },
      ],
    });

    if (!foundToken) {
      return jsonResponse({
        res,
        status: statusCodes.UNAUTHORIZED,
        code: 'AUT_02',
        message: 'Invalid token',
      });
    }

    jwt.verify(token, JWT_SECRET_KEY, async (err: any, decoded: any) => {
      if (err || !decoded) {
        if (err?.name === 'TokenExpiredError') {
          return jsonResponse({
            res,
            status: statusCodes.UNAUTHORIZED,
            code: 'AUT_02',
            message: 'Session Expired',
          });
        }

        return jsonResponse({
          res,
          status: statusCodes.UNAUTHORIZED,
          code: 'AUT_02',
          message: 'Invalid token',
        });
      }

      if (confirmPassword) {
        if (!req.body.password) {
          return jsonResponse({
            res,
            status: statusCodes.BAD_REQUEST,
            message: 'Provide a password',
            errors: [
              {
                path: ['password'],
                message: 'password is required',
              },
            ],
          });
        }

        if (!AuthHelper.comparePassword(req.body.password, decoded.password)) {
          return jsonResponse({
            res,
            status: statusCodes.BAD_REQUEST,
            message: 'Wrong password',
          });
        }
      }

      const foundUser = await User.findByPk(decoded.id);

      if (!foundUser) {
        return jsonResponse({
          res,
          status: statusCodes.UNAUTHORIZED,
          code: 'AUT_03',
          message: 'Unauthorized access',
        });
      }

      if (foundUser.status === 'inactive') {
        return jsonResponse({
          res,
          status: statusCodes.FORBIDDEN,
          message:
            'This account is inactive, please contact emugenzi@exuus.com or elie@aven.io for assistance',
        });
      }

      const userRole = foundUser.role;

      const hasAccess = roles.some((role) => role === userRole);

      if (!hasAccess && roles.length > 0) {
        return jsonResponse({
          res,
          status: statusCodes.FORBIDDEN,
          message: 'You are not allowed to perform this operation',
        });
      }
      req.token = foundToken;
      req.currentUser = foundUser;
      next();
    });
  });

export default checkAuth;
