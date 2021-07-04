import 'dotenv/config';
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import useragent from 'express-useragent';
import requestIp from 'request-ip';

import 'models/associations';
import jsonResponse from 'helpers/jsonResponse';
import joiErrors from 'middlewares/joiErrors';
import { OK, NOT_FOUND, SERVER_ERROR } from 'constants/statusCodes';
import routesV1 from 'resources/api/v1';
import 'events/index';
import morgan from 'middlewares/morgan';
// Boot express
const app: Application = express();

app.use(requestIp.mw());
app.use(cors());
app.use(useragent.express());

app.use(morgan);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/v1', routesV1);

app.use(joiErrors());

// Application routing
app.get('/', (req: Request, res: Response) => {
  return jsonResponse({
    status: OK,
    res,
    message: 'Welcome to TalentMatch API',
  });
});

// Catch wrong routes
app.use((req: Request, res: Response) => {
  const error: ResponseError = new Error('Route Not found');
  error.status = NOT_FOUND;
  return jsonResponse({
    res,
    status: error.status,
    message: error.message,
  });
});

// Catch all errors
app.use((error: any, req: Request, res: Response) => {
  const status = error.status || SERVER_ERROR;
  const message = error.message || 'Something went wrong. Please try again';
  return jsonResponse({
    res,
    status,
    message,
  });
});

export default app;
