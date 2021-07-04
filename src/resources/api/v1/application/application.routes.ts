import { Router } from 'express';
import checkAuth from 'middlewares/checkAuth';
import { changeStatus, checkApplication, getMany, getOne } from './application.controller';

const router = Router();

router.get('/', checkAuth({ roles: ['hr'] }), getMany);
router.get('/:id', checkAuth({ roles: ['hr'] }), checkApplication, getOne);
router.put(
  '/:id/approve',
  checkAuth({ roles: ['hr'] }),
  checkApplication,
  changeStatus({ status: 'passed' }),
);

router.put(
  '/:id/reject',
  checkAuth({ roles: ['hr'] }),
  checkApplication,
  changeStatus({ status: 'dropped' }),
);

export default router;
