import { isCelebrateError, CelebrateError } from 'celebrate';
import { Response, NextFunction, Request } from 'express';

import { BAD_REQUEST } from 'constants/statusCodes';
import jsonResponse from 'helpers/jsonResponse';

const joiErrors =
  () =>
  (err: CelebrateError, req: Request, res: Response, next: NextFunction): void | Response<any> => {
    if (!isCelebrateError(err)) return next(err);

    const joiError =
      err.details.get('body')?.details[0].message || err.details.get('query')?.details[0].message;

    return jsonResponse({
      res,
      status: BAD_REQUEST,
      message: joiError,
    });
  };

export default joiErrors;
