import { Router } from 'express';
import { login, signUp } from './auth.controller';
import { signUpRule, loginRule } from './auth.validator';

const router = Router();

router.post('/signup', signUpRule, signUp);
router.post('/login', loginRule, login);

export default router;
