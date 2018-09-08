module.exports = (event) => {
  event.on('user-create', (user) => {
    event.emit('activity', {
      _userId: user.createdBy,
      activity: 'create',
      action: {
        id: user._id,
        module: 'User',
      },
      message: 'User created new user',
    });
  });

  event.on('user-update', (user) => {
    event.emit('activity', {
      _userId: user.updatedBy,
      activity: 'update',
      action: {
        id: user._id,
        module: 'User',
      },
      message: 'User updated user',
    });
  });

  event.on('user-delete', (user) => {
    event.emit('activity', {
      _userId: user.deletedBy,
      activity: 'delete',
      action: {
        id: user._id,
        module: 'User',
      },
      message: 'User deleted user',
    });
  });
};
