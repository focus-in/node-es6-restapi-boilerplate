module.exports = (event) => {
  event.on('signup', (user) => {
    event.emit('activity', {
      _userId: user._id,
      activity: 'signup',
      action: {
        id: user._id,
        module: 'auth',
      },
      message: 'User signup',
    });
  });

  event.on('signin', (user) => {
    event.emit('activity', {
      _userId: user._id,
      activity: 'signin',
      action: {
        id: user._id,
        module: 'auth',
      },
      message: 'User signin',
    });
  });

  event.on('oauth', (user) => {
    event.emit('activity', {
      _userId: user._id,
      activity: 'oauth',
      action: {
        id: user._id,
        module: 'auth',
      },
      message: 'User oauth login',
    });
  });

  event.on('activate', (user) => {
    event.emit('activity', {
      _userId: user._id,
      activity: 'activate',
      action: {
        id: user._id,
        module: 'auth',
      },
      message: 'User activated successfully',
    });
  });

  event.on('reactivate', (user) => {
    event.emit('activity', {
      _userId: user._id,
      activity: 'reactivate',
      action: {
        id: user._id,
        module: 'auth',
      },
      message: 'User sent reactivate mail',
    });
  });

  event.on('refresh', (user) => {
    event.emit('activity', {
      _userId: user._id,
      activity: 'refresh',
      action: {
        id: user._id,
        module: 'auth',
      },
      message: 'User auth token refresh',
    });
  });

  event.on('forgot', (user) => {
    event.emit('activity', {
      _userId: user._id,
      activity: 'forgot',
      action: {
        id: user._id,
        module: 'auth',
      },
      message: 'User forgot mail, with reset password sent',
    });
  });

  event.on('reset', (user) => {
    event.emit('activity', {
      _userId: user._id,
      activity: 'reset',
      action: {
        id: user._id,
        module: 'auth',
      },
      message: 'User reset password successfully',
    });
  });
};
