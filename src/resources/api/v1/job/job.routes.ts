import { Router } from 'express';
import checkAuth from 'middlewares/checkAuth';
import { createJob, checkJob, getMany, getOne, applyJob } from './job.controller';
import { applyJobRule, createOneRule } from './job.validator';

const router = Router();

router.post('/', checkAuth({ roles: ['hr'] }), createOneRule, createJob);
router.get('/', getMany);
router.get('/:id', checkJob, getOne);
router.post('/:id/apply', checkJob, applyJobRule, applyJob);

export default router;
