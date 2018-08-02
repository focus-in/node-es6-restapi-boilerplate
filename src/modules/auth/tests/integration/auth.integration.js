/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable arrow-body-style */
const bcrypt = require('bcrypt');
const HttpStatus = require('http-status');
const request = require('supertest');
const { expect } = require('chai');
const sinon = require('sinon');
require('module-alias/register');
const index = require('@root/index'); // eslint-disable-line
const { auth } = require('@configs/config').env; // eslint-disable-line
const { model: User } = require('@modules/user'); // eslint-disable-line
const { model: Auth } = require('@modules/auth'); // eslint-disable-line

describe('Auth API Integration Test', () => {
  // Define the app from server
  let app;
  // Define sandbox for stub data
  let sandbox;
  // Define database user
  let dbUsers;
  // Test user
  let user;
  // Test admin
  // let admin;
  // let adminAuthToken;
  // let userAuthToken;

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
    // sandbos stub data
    sandbox = sinon.createSandbox();
    // existing db users
    dbUsers = {
      admin: {
        firstName: 'dbadmin',
        lastName: 'dbadmin',
        email: 'dbadmin@gmail.com',
        password: passwordHashed,
        phone: 9876543210,
        activeFlag: true,
      },
      user: {
        firstName: 'dbuser',
        lastName: 'dbuser',
        email: 'dbuser@gmail.com',
        password: passwordHashed,
        phone: 9876543211,
      },
    };

    // test user to run the test case
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
    await User.insertMany([dbUsers.admin, dbUsers.user]);
    // get auth tokens for inserted user
    // adminAuthToken = (await Auth.generateTokens(dbUsers.dbadmin)).token;
    // userAuthToken = (await Auth.generateTokens(dbUsers.dbuser)).token;
  });

  /**
   * Empty database after test case
   */
  afterEach(async () => {
    // remove all the existing users
    await User.remove({});
    // restore the sandbox data
    sandbox.restore();
  });

  describe('Signup User POST: /api/v1/auth/signup', () => {
    it('should register a new user when request is ok', () => {
      return request(app)
        .post('/api/v1/auth/signup')
        .send(user)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.CREATED)
        .then((res) => {
          // remove password & check response
          delete user.password;
          expect(res.body).to.include(user);
          expect(res.body.email).is.equal(user.email);
          expect(res.body).to.have.a.property('_id');
          expect(res.body).to.not.have.property(User.secureFields.join(','));
        });
    });

    it('should report mongo error when email exists', () => {
      return request(app)
        .post('/api/v1/auth/signup')
        .send(dbUsers.user)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.CONFLICT)
        .then((res) => {
          expect(res.body.name).is.equal('MongoError');
          expect(res.body.message).is.equal('Validation Error');
          expect(res.body.errors[0].field).to.include('Email');
          expect(res.body.errors[0].messages).to.include('Email already exists');
        });
    });

    it('should report mongo error when phone exists', () => {
      dbUsers.user.email = `unique${dbUsers.user.email}`;
      return request(app)
        .post('/api/v1/auth/signup')
        .send(dbUsers.user)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.CONFLICT)
        .then((res) => {
          expect(res.body.name).is.equal('MongoError');
          expect(res.body.message).is.equal('Validation Error');
          expect(res.body.errors[0].field).to.include('Phone');
          expect(res.body.errors[0].messages).to.include('Phone already exists');
        });
    });

    it('should report validation error when required fields not exists', () => {
      user.firstName = '';
      user.email = '';
      user.phone = '';
      return request(app)
        .post('/api/v1/auth/signup')
        .send(user)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.BAD_REQUEST)
        .then((res) => {
          expect(res.body.name).is.equal('Error');
          expect(res.body.message).is.equal('validation error');
          expect(res.body.errors.length).is.equal(3);
          expect(res.body.errors[0].field).to.include('firstName');
          expect(res.body.errors[0].messages).to.include('"firstName" is not allowed to be empty');
          expect(res.body.errors[1].field).to.include('email');
          expect(res.body.errors[1].messages).to.include('"email" is not allowed to be empty');
          expect(res.body.errors[1].messages).to.include('"email" must be a valid email');
          expect(res.body.errors[2].field).to.include('phone');
          expect(res.body.errors[2].messages).to.include('"phone" must be a number');
        });
    });
  });

  describe('Signin User POST: /api/v1/auth/signin', () => {
    it('should return access token when email & password matches', () => {
      const authUser = {
        email: dbUsers.admin.email,
        password,
      };
      return request(app)
        .post('/api/v1/auth/signin')
        .send(authUser)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.OK)
        .then((res) => {
          // remove password & check response
          delete dbUsers.admin.password;
          expect(res.body.user).to.include(dbUsers.admin);
          expect(res.body.user.email).is.equal(dbUsers.admin.email);
          expect(res.body.token).to.have.a.property('token');
          expect(res.body.token).to.have.a.property('refreshToken');
          expect(res.body.token).to.have.a.property('expiresIn');
        });
    });

    it('should return error when auth user is not active', () => {
      const authUser = {
        email: dbUsers.user.email,
        password,
      };
      return request(app)
        .post('/api/v1/auth/signin')
        .send(authUser)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.UNAUTHORIZED)
        .then((res) => {
          expect(res.body.name).is.equal('Error');
          expect(res.body.message).is.equal('User not active, please check your registered email to activate');
        });
    });

    it('should return error when user pass invalid password', () => {
      const authUser = {
        email: dbUsers.user.email,
        password: 'invalidpassword',
      };
      return request(app)
        .post('/api/v1/auth/signin')
        .send(authUser)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.UNAUTHORIZED)
        .then((res) => {
          expect(res.body.name).is.equal('Error');
          expect(res.body.message).is.equal('Invalid username or password');
        });
    });

    it('should return error when user pass empty email & password', () => {
      const authUser = {
        email: '',
        password: '',
      };
      return request(app)
        .post('/api/v1/auth/signin')
        .send(authUser)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.BAD_REQUEST)
        .then((res) => {
          expect(res.body.name).is.equal('Error');
          expect(res.body.message).is.equal('validation error');
          expect(res.body.errors.length).is.equal(2);
          expect(res.body.errors[0].field).to.include('email');
          expect(res.body.errors[0].messages).to.include('"email" is not allowed to be empty');
          expect(res.body.errors[0].messages).to.include('"email" must be a valid email');
          expect(res.body.errors[1].field).to.include('password');
          expect(res.body.errors[1].messages).to.include('"password" is not allowed to be empty');
        });
    });
  });

  describe('Activate User GET: /api/v1/auth/activate/:token', () => {
    // TODO:
    // it('should return active user when token is valid', () => {
    //   const token = 'active token';
    //   return request(app)
    //     .get(`/api/v1/auth/activate/${token}`)
    //     .expect('Content-Type', /json/)
    //     .expect(HttpStatus.OK)
    //     .then((res) => {
    //       expect(res.body.user.email).is.equal(dbUsers.admin.email);
    //       expect(res.body.token).to.have.a.property('token');
    //       expect(res.body.token).to.have.a.property('refreshToken');
    //       expect(res.body.token).to.have.a.property('expiresIn');
    //     });
    // });

    it('should return bad request error when token is invalid', () => {
      const token = 'invalidtoken'; // TODO:
      return request(app)
        .get(`/api/v1/auth/activate/${token}`)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.BAD_REQUEST)
        .then((res) => {
          expect(res.body.name).is.equal('Error');
          expect(res.body.message).is.equal('Invalid/Expired token, please retry');
        });
    });

    it('should return bad request error when token is expired', () => {
      const token = 'expiredtoken'; // TODO:
      return request(app)
        .get(`/api/v1/auth/activate/${token}`)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.BAD_REQUEST)
        .then((res) => {
          expect(res.body.name).is.equal('Error');
          expect(res.body.message).is.equal('Invalid/Expired token, please retry');
        });
    });

    it('should return 404 error when token is empty', () => {
      const token = '';
      return request(app)
        .get(`/api/v1/auth/activate/${token}`)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body.name).is.equal('Error');
          expect(res.body.message).is.equal('LOL! you got a wrong url');
        });
    });
  });

  describe('Reactivate User POST: /api/v1/auth/reactivate', () => {
    it('should return user details when email is valid & not active', () => {
      return request(app)
        .post('/api/v1/auth/reactivate')
        .send({ email: dbUsers.user.email })
        .expect('Content-Type', /json/)
        .expect(HttpStatus.OK)
        .then((res) => {
          expect(res.body).to.have.a.property('_id');
          expect(res.body.activeFlag).is.equal(false);
          expect(res.body.email).is.equal(dbUsers.user.email);
          expect(res.body).to.not.have.property(User.secureFields.join(','));
        });
    });

    it('should return error message when email is valid & already active', () => {
      return request(app)
        .post('/api/v1/auth/reactivate')
        .send({ email: dbUsers.admin.email })
        .expect('Content-Type', /json/)
        .expect(HttpStatus.BAD_REQUEST)
        .then((res) => {
          expect(res.body).to.have.a.property('errors');
          expect(res.body.name).is.equal('Error');
          expect(res.body.message).is.equal('User is already active, please login');
        });
    });

    it('should return error message when email is invalid', () => {
      return request(app)
        .post('/api/v1/auth/reactivate')
        .send({ email: 'invalid@email.com' })
        .expect('Content-Type', /json/)
        .expect(HttpStatus.BAD_REQUEST)
        .then((res) => {
          expect(res.body).to.have.a.property('errors');
          expect(res.body.name).is.equal('Error');
          expect(res.body.message).is.equal('Email not found to sent activation token');
        });
    });

    it('should return validation error message when email is not set', () => {
      return request(app)
        .post('/api/v1/auth/reactivate')
        .send({ email: '' })
        .expect('Content-Type', /json/)
        .expect(HttpStatus.BAD_REQUEST)
        .then((res) => {
          expect(res.body).to.have.a.property('errors');
          expect(res.body.name).is.equal('Error');
          expect(res.body.message).is.equal('validation error');
          expect(res.body.errors[0].field).to.include('email');
          expect(res.body.errors[0].messages).to.include('"email" is not allowed to be empty');
        });
    });
  });

  // describe('Refresh Auth token POST: /api/v1/auth/refresh', () => {
  //   it('should return user details when email is valid & not active', () => {
  //     return request(app)
  //       .post('/api/v1/auth/refresh')
  //       .send({ email: dbUsers.user.email })
  //       .expect('Content-Type', /json/)
  //       .expect(HttpStatus.OK)
  //       .then((res) => {
  //         expect(res.body).to.have.a.property('_id');
  //         expect(res.body.activeFlag).is.equal(false);
  //         expect(res.body.email).is.equal(dbUsers.user.email);
  //         expect(res.body).to.not.have.property(User.secureFields.join(','));
  //       });
  //   });
  // });
});
