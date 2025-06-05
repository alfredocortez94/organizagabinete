import { Router } from 'express';

const router = Router();

import authRoutes from './auth';
import usersRoutes from './users';
import visitsRoutes from './visits';

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/visits', visitsRoutes);

router.get('/', (req, res) => {
  res.json({
    success: true,
    data: {},
    message: 'API Organiza Gabinete Online',
    timestamp: new Date().toISOString(),
  });
});

export default router;
