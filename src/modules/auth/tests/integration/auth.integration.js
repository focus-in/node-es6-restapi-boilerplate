/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable arrow-body-style */
const bcrypt = require('bcrypt');
const HttpStatus = require('http-status');
const request = require('supertest');
const { expect, assert } = require('chai');
require('module-alias/register');
const index = require('@root/index'); // eslint-disable-line
const { auth } = require('@configs/config').env; // eslint-disable-line
const { model: User } = require('@modules/user'); // eslint-disable-line
// const { model: Auth } = require('@modules/auth'); // eslint-disable-line

describe('Auth API Integration Test', () => {
  // Define the app from server
  let app;

  let dbUsers;
  let user;
  // let admin;
  // let adminAuthToken;
  // let userAuthToken;

  const password = '123456';
  const passwordHashed = bcrypt.hashSync(password, parseInt(auth.secretRound, 10));

  before(() => {
    index.then((server) => {
      app = server;
    });
  });

  after(() => {
    index.then((server) => {
      server.close();
    });
  });

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


  describe('Signup User POST: v1/auth/signup', () => {
    it('should register a new user when request is ok', () => {
      return request(app)
        .post('/api/v1/auth/signup')
        .send(user)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.CREATED)
        .then((res) => {
          assert(user.email, res.body.email);
          assert(user.phone, res.body.phone);
          // expect(res.body).to.include(user);
          expect(res.body).to.have.a.property('_id');
          // expect(res.body).to.have.a.property('password', 'firstName', 'salt');
        });
    });
  });
});
