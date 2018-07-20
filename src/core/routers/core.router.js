const express = require('express');

const router = express.Router();

const AuthRoutes = require('../../modules/auth/routers/auth.router');
const UserRouter = require('../../modules/user/routers/user.router');

/**
 * GET api/v1/status
 */
router.get('/status', (req, res) => res.send('OK'));

// User Module Routes
router.use('/auth', AuthRoutes);
router.use('/user', UserRouter);

module.exports = router;
