/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable arrow-body-style */
const bcrypt = require('bcrypt');
const HttpStatus = require('http-status');
const request = require('supertest');
const { expect } = require('chai');
require('module-alias/register');
const app = require('@configs/libs/express').init; // eslint-disable-line
const { auth } = require('@configs/config').env; // eslint-disable-line
const { model: User } = require('@modules/user'); // eslint-disable-line
// const { model: Auth } = require('@modules/auth'); // eslint-disable-line

describe('Users API Integration Test', () => {
  let dbUsers;
  let user;
  let admin;
  // let adminAuthToken;
  // let userAuthToken;

  const password = '123456';
  const passwordHashed = bcrypt.hashSync(password, parseInt(auth.secretRound, 10));
  beforeEach(async () => {
    dbUsers = {
      dbadmin: {
        firstName: 'dbadmin',
        lastName: 'dbadmin',
        email: 'dbadmin@gmail.com',
        password: passwordHashed,
        phone: 9876543210,
      },
      dbuser: {
        firstName: 'dbuser',
        lastName: 'dbuser',
        email: 'dbuser@gmail.com',
        password: passwordHashed,
        phone: 9876543211,
      },
    };

    user = {
      firstName: 'testuser',
      lastName: 'testuser',
      email: 'testuser@gmail.com',
      password,
      phone: 9876543212,
    };

    // remove all the existing users
    await User.remove({});
    // insert the defined user
    await User.insertMany([dbUsers.dbadmin, dbUsers.dbuser]);
    // get auth tokens for inserted user
    // adminAuthToken = (await Auth.generateTokens(dbUsers.dbadmin)).token;
    // userAuthToken = (await Auth.generateTokens(dbUsers.dbuser)).token;
  });


  describe('Create User POST: v1/users', () => {
    it('should create a new user when request is ok', () => {
      return request(app)
        .post('/api/v1/users')
        .send(user)
        .expect(HttpStatus.CREATED)
        .then((res) => {
          delete admin.password;
          expect(res.body).to.include(admin);
        });
    });
  });
});
