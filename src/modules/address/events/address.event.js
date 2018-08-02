module.exports = (event) => {
  event.on('address-create', (address) => {
    event.emit('activity', {
      _userId: address._userId,
      activity: 'create',
      action: {
        id: address._id,
        module: 'address',
      },
      message: 'User created new address',
    });
  });

  event.on('address-update', (address) => {
    event.emit('activity', {
      _userId: address._userId,
      activity: 'update',
      action: {
        id: address._id,
        module: 'address',
      },
      message: 'User updated address',
    });
  });

  event.on('address-delete', (address) => {
    event.emit('activity', {
      _userId: address._userId,
      activity: 'delete',
      action: {
        id: address._id,
        module: 'address',
      },
      message: 'User deleted address',
    });
  });
};
