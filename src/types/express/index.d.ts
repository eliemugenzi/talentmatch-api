import User from 'models/User';
import Job from 'models/Job';

declare namespace Express {
  interface Request {
    job?: Job;
  }
}

interface ResponseError extends Error {
  status?: number;
}
