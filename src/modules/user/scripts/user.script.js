#!/usr/bin/env node
/* eslint no-console: 0 */

const program = require('commander');
const { prompt } = require('inquirer');

const UserEnum = require('../utils/user.enum');
const UserModel = require('../models/user.model');

// const {
//   addContact,
//   getContact,
//   getContactList,
//   updateContact,
//   deleteContact
// } = require('./logic');

const questions = [
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

program
  .command('User:Create', 'User create actions from terminal')
  .action((action) => {
    if (action === 'user:create') {
      prompt(questions).then((user) => {
        const User = new UserModel(user);
        User.save()
          .then(u => console.log(`user saved successfully ${u.id}`))
          .catch(e => console.error(e));
      });
    }
  });

program
  .command('User:List', 'User list actions from terminal')
  .option('-S, --select', 'User select fields')
  .option('-i, --id', 'User id')
  .option('-e, --email', 'User email')
  .option('-s, --skip', 'User skip records')
  .option('-l, --limit', 'User limit records')
  .action((action) => {
    if (action === 'user:list') {
      console.log(process.argv);
    }
  })
  .on('--help', () => {
    console.log('');
    console.log('user:list');
    console.log(' -S, --select   - User select fields');
    console.log(' -i, --id       - User id');
    console.log(' -e, --email    - User email');
    console.log(' -s, --skip     - User skip records');
    console.log(' -l, --limit    - User limit records');
    console.log('');
  })
  .parse(process.argv);

