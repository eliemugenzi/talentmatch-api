import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from 'swagger/v1';
import auth from './auth/auth.routes';

const router = Router();

router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
router.use('/auth', auth);

export default router;
