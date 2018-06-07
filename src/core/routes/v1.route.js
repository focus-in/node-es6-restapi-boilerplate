const express = require('express');
const userRoutes = require('../../modules/user/routes/user.route');

const router = express.Router();

/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.send('OK'));

/**
 * GET v1/docs
 */
router.use('/docs', express.static('docs'));

/**
 * User module routers
 */
router.use('/users', userRoutes);

module.exports = router;
