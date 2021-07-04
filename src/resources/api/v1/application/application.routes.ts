import { Router } from 'express';
import checkAuth from 'middlewares/checkAuth';
import { getMany } from './application.controller';

const router = Router();

router.get('/', checkAuth({ roles: ['hr'] }), getMany);

export default router;
