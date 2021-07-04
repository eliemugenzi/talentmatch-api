import { Router } from 'express';
import checkAuth from 'middlewares/checkAuth';
import { createJob, checkJob, getMany, getOne } from './job.controller';
import { createOneRule } from './job.validator';

const router = Router();

router.post('/', checkAuth({ roles: ['hr'] }), createOneRule, createJob);
router.get('/', getMany);
router.get('/:id', checkJob, getOne);

export default router;
