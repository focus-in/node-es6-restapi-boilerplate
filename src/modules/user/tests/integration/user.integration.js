/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable arrow-body-style */
const bcrypt = require('bcrypt');
const HttpStatus = require('http-status');
const request = require('supertest');
const { expect } = require('chai');
require('module-alias/register');
const index = require('@root/index'); // eslint-disable-line
const { auth } = require('@configs/config').env; // eslint-disable-line
const { model: User } = require('@modules/user'); // eslint-disable-line
const { model: Auth } = require('@modules/auth'); // eslint-disable-line

describe('User API Integration Test', () => {
  // Define the app from server
  let app;
  // Define database user
  let dbUsers;
  // auth user
  let authUser;
  let authAdmin;
  // Test auth token
  let userToken;
  let adminToken;

  // Define test user password
  const password = '123456';
  // hash password
  const passwordHashed = bcrypt.hashSync(password, parseInt(auth.secretRound, 10));

  /**
   * Before test run define the app server
   */
  before(() => {
    index.then((server) => {
      app = server;
    });
  });

  /**
   * After test run stop the server connection
   */
  after(() => {
    index.then((server) => {
      server.close();
    });
  });

  /**
   * Fill database before each test case
   */
  beforeEach(async () => {
    // existing db users
    dbUsers = {
      admin: {
        firstName: 'Admin',
        lastName: 'Admin',
        email: 'admin@gmail.com',
        password: passwordHashed,
        phone: 9876543210,
        activeFlag: true,
      },
      user: {
        firstName: 'User',
        lastName: 'User',
        email: 'user@gmail.com',
        password: passwordHashed,
        phone: 9876543211,
        activeFlag: true,
      },
    };

    // insert the defined user
    await User.insertMany([dbUsers.user, dbUsers.admin]);
    // generate auth token for user
    authUser = await User.findOne({ email: dbUsers.user.email });
    userToken = (await Auth.generateTokens(authUser)).token;
    // generate auth token for admin
    authAdmin = await User.findOne({ email: dbUsers.admin.email });
    adminToken = (await Auth.generateTokens(authAdmin)).token;
  });

  /**
   * Empty database after test case
   */
  afterEach(async () => {
    // remove all the existing users
    await User.remove({});
    // remove auth token
    await Auth.remove({});
  });

  describe('Users List GET: /api/v1/users', () => {
    it('should return users list when request is ok', () => {
      return request(app)
        .get('/api/v1/users')
        .set('Authorization', adminToken)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.OK)
        .then((res) => {
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.lengthOf(2);
          // remove password & check response
          delete dbUsers.user.password;
          delete dbUsers.admin.password;
          // expect(dbUsers.user).to.be.true;
          // expect(dbUsers.user).to.be.true;
          expect(res.body).to.include(dbUsers.user);
          expect(res.body).to.include(dbUsers.admin);
        });
    });

    it('should return error when user try to access', () => {
      return request(app)
        .get('/api/v1/users')
        .set('Authorization', userToken)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.UNAUTHORIZED)
        .then((res) => {
          expect(res.body).to.have.a.property('errors');
          // expect(res.body.name).is.equal('Error');
          // expect(res.body.message).is.equal('Invalid access');
        });
    });
  });
});
