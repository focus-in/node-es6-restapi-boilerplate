const userRoutes = {};

module.exports.init = (router) => {
  /**
   * GET api/v1/status
   */
  router.get('/status', (req, res) => res.send('OK'));

  // User Module Routes
  router.use('/users', userRoutes);

  return router;
};
