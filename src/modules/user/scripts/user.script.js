#!/usr/bin/env node
/* eslint no-console: 0 */
const { prompt } = require('inquirer');
const UserEnum = require('../utils/user.enum');
const User = require('../models/user.model');

module.exports = (program) => {
  program
    .command('user <action> [id]')
    .description('run remote setup commands')
    .action(async (action, id) => {
      try {
        switch (action) {
          case 'create':
            await createUser();
            break;

          case 'find':
            await findUser(id);
            break;

          default:
            break;
        }
      } catch (e) {
        console.log(e.message);
        process.exit(1);
      }
    })
    .on('--help', () => {
      console.log('  User  ');
      console.log('    $ user create    - Create new user object');
      console.log('    $ user find [id] - Find user by id');
      console.log();
    });
};

const createPrompts = [
  {
    type: 'input',
    name: 'firstName',
    message: 'Enter firstname: ',
  },
  {
    type: 'input',
    name: 'lastName',
    message: 'Enter lastname: ',
  },
  {
    type: 'input',
    name: 'email',
    message: 'Enter email address: ',
  },
  {
    type: 'password',
    name: 'password',
    message: 'Enter password: ',
  },
  {
    type: 'input',
    name: 'phone',
    message: 'Enter phone number: ',
  },
  {
    type: 'list',
    name: 'role',
    message: 'Select role: ',
    choices: UserEnum.roles,
  },
  {
    type: 'list',
    name: 'gender',
    message: 'Select Gender: ',
    choices: UserEnum.gender,
  },
  {
    type: 'input',
    name: 'dob',
    message: 'Enter dob (YYYY/MM/DD): ',
  },
];

const createUser = async () => {
  const userObj = await prompt(createPrompts);
  // make the user active & verified if created from script
  userObj.activeFlag = true;
  userObj.verifiedFlag = true;
  const user = new User(userObj);
  await user.save();
  console.log(`user saved successfully ${user.id}`);
};

const findUser = async (id) => {
  if (id) {
    const user = await User.findById(id);
    user.securedUser(User.secureFields);
    console.log(user);
  }
};
