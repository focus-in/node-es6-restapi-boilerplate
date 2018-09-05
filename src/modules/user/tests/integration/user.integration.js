/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable arrow-body-style */
const bcrypt = require('bcrypt');
const HttpStatus = require('http-status');
const request = require('supertest');
const { expect } = require('chai');
require('module-alias/register');
const app = require('@root/src/app'); // eslint-disable-line
const { auth } = require('@configs/config').env; // eslint-disable-line
const { model: User } = require('@modules/user'); // eslint-disable-line
const { model: Auth } = require('@modules/auth'); // eslint-disable-line

describe('User API Integration Test', () => {
  // Define the app from server
  let server;
  // Define database user
  let dbUsers;
  // Test user
  let testUser;
  // auth user
  let authUser;
  let authAdmin;
  // Test auth token
  let userToken;
  let adminToken;

  // Define test user password
  const password = 'Test@1234';
  // hash password
  const passwordHashed = bcrypt.hashSync(password, parseInt(auth.secretRound, 10));

  /**
   * Before test run define the app server
   */
  before(async () => {
    server = await app.start();
  });

  /**
   * After test run stop the server connection
   */
  after(() => {
    app.stop(server);
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
        role: 'admin',
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

    // test user to run the test case
    testUser = {
      firstName: 'testuser',
      lastName: 'testuser',
      email: 'testuser@gmail.com',
      password,
      phone: 9876543200,
      gender: 'male',
      birthDate: '1991-05-02T00:00:00.000Z',
      bio: 'test bio',
    };

    // insert the defined user
    await User.insertMany([dbUsers.user, dbUsers.admin]);
    // generate auth token for user
    authUser = await User.findOne({ email: dbUsers.user.email });
    authUser.securedUser(User.secureFields);
    userToken = (await Auth.generateTokens(authUser)).token;
    // generate auth token for admin
    authAdmin = await User.findOne({ email: dbUsers.admin.email });
    authAdmin.securedUser(User.secureFields);
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
      return request(server)
        .get('/api/v1/users?select=*&order=firstName&sort=asc')
        .set('Authorization', `JWT ${adminToken}`)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.OK)
        .then((res) => {
          expect(res.body).to.have.a.property('count');
          expect(res.body).to.have.a.property('users');
          expect(res.body.count).is.equal(2);
          expect(res.body.users).to.be.an('array');
          expect(res.body.users).to.have.lengthOf(2);
          // remove password & check response
          delete dbUsers.admin.password;
          delete dbUsers.user.password;
          expect(res.body.users[0]).to.include(dbUsers.admin);
          expect(res.body.users[1]).to.include(dbUsers.user);
          // response should never have secure fields
          expect(res.body.users[0]).to.not.have.property(User.secureFields.join(','));
          expect(res.body.users[1]).to.not.have.property(User.secureFields.join(','));
        });
    });

    it('should return users list with order & sort when request is ok', () => {
      return request(server)
        .get('/api/v1/users?select=*&order=firstName&sort=desc')
        .set('Authorization', `JWT ${adminToken}`)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.OK)
        .then((res) => {
          expect(res.body).to.have.a.property('count');
          expect(res.body).to.have.a.property('users');
          expect(res.body.count).is.equal(2);
          expect(res.body.users).to.be.an('array');
          expect(res.body.users).to.have.lengthOf(2);
          // remove password & check response
          delete dbUsers.admin.password;
          delete dbUsers.user.password;
          expect(res.body.users[0]).to.include(dbUsers.user);
          expect(res.body.users[1]).to.include(dbUsers.admin);
          // response should never have secure fields
          expect(res.body.users[0]).to.not.have.property(User.secureFields.join(','));
          expect(res.body.users[1]).to.not.have.property(User.secureFields.join(','));
        });
    });

    it('should return users list with limit when limit in query', () => {
      return request(server)
        .get('/api/v1/users?select=*&order=firstName&sort=asc&limit=1')
        .set('Authorization', `JWT ${adminToken}`)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.OK)
        .then((res) => {
          expect(res.body).to.have.a.property('count');
          expect(res.body).to.have.a.property('users');
          expect(res.body.count).is.equal(2); // count will never change for limit request
          expect(res.body.users).to.be.an('array');
          expect(res.body.users).to.have.lengthOf(1);
          // remove password & check response
          delete dbUsers.admin.password;
          expect(res.body.users[0]).to.include(dbUsers.admin);
          // response should never have secure fields
          expect(res.body.users[0]).to.not.have.property(User.secureFields.join(','));
        });
    });

    it('should return users list with filter when filter in query', () => {
      return request(server)
        .get('/api/v1/users?select=*&filter[email]=admin@gmail.com&order=firstName&sort=asc&limit=1')
        .set('Authorization', `JWT ${adminToken}`)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.OK)
        .then((res) => {
          expect(res.body).to.have.a.property('count');
          expect(res.body).to.have.a.property('users');
          expect(res.body.count).is.equal(1); // count will change based on filter
          expect(res.body.users).to.be.an('array');
          expect(res.body.users).to.have.lengthOf(1);
          // remove password & check response
          delete dbUsers.admin.password;
          expect(res.body.users[0]).to.include(dbUsers.admin);
          // response should never have secure fields
          expect(res.body.users[0]).to.not.have.property(User.secureFields.join(','));
        });
    });

    it('should return error when no select in query', () => {
      return request(server)
        .get('/api/v1/users')
        .set('Authorization', `JWT ${adminToken}`)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.BAD_REQUEST)
        .then((res) => {
          expect(res.body).to.have.a.property('errors');
          expect(res.body.name).is.equal('Error');
          expect(res.body.message).is.equal('validation error');
          expect(res.body.errors.length).is.equal(1);
          expect(res.body.errors[0].field).to.include('select');
          expect(res.body.errors[0].messages).to.include('"select" is required');
        });
    });

    it('should return error when user try to access', () => {
      return request(server)
        .get('/api/v1/users?select=*')
        .set('Authorization', `JWT ${userToken}`)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.FORBIDDEN)
        .then((res) => {
          expect(res.body).to.have.a.property('errors');
          expect(res.body.name).is.equal('Error');
          expect(res.body.message).is.equal('Invalid access!');
        });
    });

    it('should return error when invalid token in request', () => {
      return request(server)
        .get('/api/v1/users?select=*')
        .set('Authorization', 'JWT invalidtoken')
        .expect('Content-Type', /json/)
        .expect(HttpStatus.FORBIDDEN)
        .then((res) => {
          expect(res.body).to.have.a.property('errors');
          expect(res.body.name).is.equal('Error');
          expect(res.body.message).is.equal('Invalid authorization');
        });
    });

    it('should return error when no authorization token in header', () => {
      return request(server)
        .get('/api/v1/users?select=*')
        .set('Authorization', '')
        .expect('Content-Type', /json/)
        .expect(HttpStatus.FORBIDDEN)
        .then((res) => {
          expect(res.body).to.have.a.property('errors');
          expect(res.body.name).is.equal('Error');
          expect(res.body.message).is.equal('Invalid authorization');
        });
    });
  });

  describe('Create User POST: /api/v1/users', () => {
    it('should return created user when request is ok', () => {
      return request(server)
        .post('/api/v1/users')
        .send(testUser)
        .set('Authorization', `JWT ${adminToken}`)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.CREATED)
        .then((res) => {
          expect(res.body).to.have.a.property('_id');
          expect(res.body).to.have.a.property('activeFlag');
          expect(res.body.activeFlag).is.equal(false);
          expect(res.body.deleted).is.equal(false);
          // remove password & check in response
          delete testUser.password;
          expect(res.body).to.include(testUser);
          // response should never have secure fields
          expect(res.body).to.not.have.property(User.secureFields.join(','));
        });
    });

    it('should return error when email & phone exist', () => {
      return request(server)
        .post('/api/v1/users')
        .send(dbUsers.user)
        .set('Authorization', `JWT ${adminToken}`)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.CONFLICT)
        .then((res) => {
          expect(res.body).to.have.a.property('errors');
          expect(res.body.name).is.equal('MongoError');
          expect(res.body.message).is.equal('Validation Error');
          expect(res.body.errors.length).is.equal(1);
          expect(res.body.errors[0].field).to.include('Email');
          expect(res.body.errors[0].messages).to.include('Email already exists');
        });
    });

    it('should return error when phone exist', () => {
      dbUsers.user.email = `unique${dbUsers.user.email}`;
      return request(server)
        .post('/api/v1/users')
        .send(dbUsers.user)
        .set('Authorization', `JWT ${adminToken}`)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.CONFLICT)
        .then((res) => {
          expect(res.body).to.have.a.property('errors');
          expect(res.body.name).is.equal('MongoError');
          expect(res.body.message).is.equal('Validation Error');
          expect(res.body.errors.length).is.equal(1);
          expect(res.body.errors[0].field).to.include('Phone');
          expect(res.body.errors[0].messages).to.include('Phone already exists');
        });
    });

    it('should return validation error when data empty in request', () => {
      // empty firstName, email & phone
      testUser.firstName = '';
      testUser.email = '';
      testUser.phone = '';
      return request(server)
        .post('/api/v1/users')
        .send(testUser)
        .set('Authorization', `JWT ${adminToken}`)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.BAD_REQUEST)
        .then((res) => {
          expect(res.body).to.have.a.property('errors');
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

    it('should return error when user try to access', () => {
      return request(server)
        .post('/api/v1/users')
        .send(testUser)
        .set('Authorization', `JWT ${userToken}`)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.FORBIDDEN)
        .then((res) => {
          expect(res.body).to.have.a.property('errors');
          expect(res.body.name).is.equal('Error');
          expect(res.body.message).is.equal('Invalid access!');
        });
    });

    it('should return error when invalid token in request', () => {
      return request(server)
        .post('/api/v1/users')
        .send(testUser)
        .set('Authorization', 'JWT invalidtoken')
        .expect('Content-Type', /json/)
        .expect(HttpStatus.FORBIDDEN)
        .then((res) => {
          expect(res.body).to.have.a.property('errors');
          expect(res.body.name).is.equal('Error');
          expect(res.body.message).is.equal('Invalid authorization');
        });
    });

    it('should return error when no authorization token in header', () => {
      return request(server)
        .post('/api/v1/users')
        .send(testUser)
        .set('Authorization', '')
        .expect('Content-Type', /json/)
        .expect(HttpStatus.FORBIDDEN)
        .then((res) => {
          expect(res.body).to.have.a.property('errors');
          expect(res.body.name).is.equal('Error');
          expect(res.body.message).is.equal('Invalid authorization');
        });
    });
  });

  describe('User Profile GET: /api/v1/users/profile', () => {
    it('should return admin user details when request is ok', () => {
      return request(server)
        .get('/api/v1/users/profile')
        .set('Authorization', `JWT ${adminToken}`)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.OK)
        .then((res) => {
          expect(res.body).to.have.a.property('_id');
          expect(res.body._id.toString()).is.equal(authAdmin._id.toString());
          expect(res.body.firstName).is.equal(authAdmin.firstName);
          expect(res.body.email).is.equal(authAdmin.email);
          expect(res.body.phone).is.equal(authAdmin.phone);
          // response should never have secure fields
          expect(res.body).to.not.have.property(User.secureFields.join(','));
        });
    });

    it('should return user details when request is ok', () => {
      return request(server)
        .get('/api/v1/users/profile')
        .set('Authorization', `JWT ${userToken}`)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.OK)
        .then((res) => {
          expect(res.body).to.have.a.property('_id');
          expect(res.body._id.toString()).is.equal(authUser._id.toString());
          expect(res.body.firstName).is.equal(authUser.firstName);
          expect(res.body.email).is.equal(authUser.email);
          expect(res.body.phone).is.equal(authUser.phone);
          // response should never have secure fields
          expect(res.body).to.not.have.property(User.secureFields.join(','));
        });
    });

    it('should return error when invalid token in request', () => {
      return request(server)
        .get('/api/v1/users/profile')
        .set('Authorization', 'JWT invalidtoken')
        .expect('Content-Type', /json/)
        .expect(HttpStatus.FORBIDDEN)
        .then((res) => {
          expect(res.body).to.have.a.property('errors');
          expect(res.body.name).is.equal('Error');
          expect(res.body.message).is.equal('Invalid authorization');
        });
    });

    it('should return error when no authorization token in header', () => {
      return request(server)
        .get(`/api/v1/users/${authAdmin._id}`)
        .send(testUser)
        .set('Authorization', '')
        .expect('Content-Type', /json/)
        .expect(HttpStatus.FORBIDDEN)
        .then((res) => {
          expect(res.body).to.have.a.property('errors');
          expect(res.body.name).is.equal('Error');
          expect(res.body.message).is.equal('Invalid authorization');
        });
    });
  });

  describe('Get single User GET: /api/v1/users/:id', () => {
    it('should return user when request is ok', () => {
      return request(server)
        .get(`/api/v1/users/${authAdmin._id}`)
        .set('Authorization', `JWT ${adminToken}`)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.OK)
        .then((res) => {
          expect(res.body).to.have.a.property('_id');
          expect(res.body._id.toString()).is.equal(authAdmin._id.toString());
          expect(res.body.firstName).is.equal(authAdmin.firstName);
          expect(res.body.email).is.equal(authAdmin.email);
          expect(res.body.phone).is.equal(authAdmin.phone);
          // response should never have secure fields
          expect(res.body).to.not.have.property(User.secureFields.join(','));
        });
    });

    it('should return cast error when invalid id in request', () => {
      const invalidid = '123123';
      return request(server)
        .get(`/api/v1/users/${invalidid}`)
        .set('Authorization', `JWT ${adminToken}`)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.BAD_REQUEST)
        .then((res) => {
          // console.log(res.body);
          // console.log(res.body.errors);
          // TODO: check this CaseError
          expect(res.body).to.have.a.property('errors');
          expect(res.body.name).is.equal('CastError');
          expect(res.body.message).is.equal('Cast to ObjectId failed for value "123123" at path "_id" for model "User"');
        });
    });

    it('should return error when non exist user id in request', () => {
      const nonexistid = '5b651fb37a27e80fa85678e9';
      return request(server)
        .get(`/api/v1/users/${nonexistid}`)
        .set('Authorization', `JWT ${adminToken}`)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.BAD_REQUEST)
        .then((res) => {
          expect(res.body).to.have.a.property('errors');
          expect(res.body.name).is.equal('Error');
          expect(res.body.message).is.equal('Invalid user');
        });
    });

    it('should return error when user try to access', () => {
      return request(server)
        .get(`/api/v1/users/${authAdmin._id}`)
        .set('Authorization', `JWT ${userToken}`)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.FORBIDDEN)
        .then((res) => {
          expect(res.body).to.have.a.property('errors');
          expect(res.body.name).is.equal('Error');
          expect(res.body.message).is.equal('Invalid access!');
        });
    });

    it('should return error when invalid token in request', () => {
      return request(server)
        .get(`/api/v1/users/${authAdmin._id}`)
        .set('Authorization', 'JWT invalidtoken')
        .expect('Content-Type', /json/)
        .expect(HttpStatus.FORBIDDEN)
        .then((res) => {
          expect(res.body).to.have.a.property('errors');
          expect(res.body.name).is.equal('Error');
          expect(res.body.message).is.equal('Invalid authorization');
        });
    });

    it('should return error when no authorization token in header', () => {
      return request(server)
        .get(`/api/v1/users/${authAdmin._id}`)
        .send(testUser)
        .set('Authorization', '')
        .expect('Content-Type', /json/)
        .expect(HttpStatus.FORBIDDEN)
        .then((res) => {
          expect(res.body).to.have.a.property('errors');
          expect(res.body.name).is.equal('Error');
          expect(res.body.message).is.equal('Invalid authorization');
        });
    });
  });

  describe('UPDATE User PUT: /api/v1/users/:id', () => {
    it('should return updated user when admin request is ok', () => {
      authAdmin.firstName = `${authAdmin.firstName} Updated`;
      authAdmin.email = `updated${authAdmin.email}`;
      return request(server)
        .put(`/api/v1/users/${authAdmin._id}`)
        .send(authAdmin)
        .set('Authorization', `JWT ${adminToken}`)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.OK)
        .then((res) => {
          expect(res.body).to.have.a.property('_id');
          expect(res.body._id.toString()).is.equal(authAdmin._id.toString());
          expect(res.body.firstName).is.equal(authAdmin.firstName);
          expect(res.body.email).is.equal(authAdmin.email);
          expect(res.body.phone).is.equal(authAdmin.phone);
          expect(res.body.role).is.equal(authAdmin.role);
          // response should never have secure fields
          expect(res.body).to.not.have.property(User.secureFields.join(','));
        });
    });

    it('should return updated user when user request is ok', () => {
      authUser.firstName = `${authUser.firstName} Updated`;
      authUser.email = `updated${authUser.email}`;
      return request(server)
        .put(`/api/v1/users/${authUser._id}`)
        .send(authUser)
        .set('Authorization', `JWT ${userToken}`)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.OK)
        .then((res) => {
          expect(res.body).to.have.a.property('_id');
          expect(res.body._id.toString()).is.equal(authUser._id.toString());
          expect(res.body.firstName).is.equal(authUser.firstName);
          expect(res.body.email).is.equal(authUser.email);
          expect(res.body.phone).is.equal(authUser.phone);
          expect(res.body.role).is.equal(authUser.role);
          // response should never have secure fields
          expect(res.body).to.not.have.property(User.secureFields.join(','));
        });
    });

    it('should return non updated user when user try to change role', () => {
      authUser.role = 'admin'; // NOTE: try to change role
      return request(server)
        .put(`/api/v1/users/${authUser._id}`)
        .send(authUser)
        .set('Authorization', `JWT ${userToken}`)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.OK)
        .then((res) => {
          expect(res.body).to.have.a.property('_id');
          expect(res.body._id.toString()).is.equal(authUser._id.toString());
          expect(res.body.firstName).is.equal(authUser.firstName);
          expect(res.body.email).is.equal(authUser.email);
          expect(res.body.phone).is.equal(authUser.phone);
          expect(res.body.role).is.equal('user'); // NOTE: should be same user role
          // response should never have secure fields
          expect(res.body).to.not.have.property(User.secureFields.join(','));
        });
    });

    it('should return updated user when admin try to update other user', () => {
      authUser.firstName = `${authUser.firstName} Updated`;
      authUser.email = `updated${authUser.email}`;
      return request(server)
        .put(`/api/v1/users/${authUser._id}`)
        .send(authUser)
        .set('Authorization', `JWT ${adminToken}`)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.OK)
        .then((res) => {
          expect(res.body).to.have.a.property('_id');
          expect(res.body._id.toString()).is.equal(authUser._id.toString());
          expect(res.body.firstName).is.equal(authUser.firstName);
          expect(res.body.email).is.equal(authUser.email);
          expect(res.body.phone).is.equal(authUser.phone);
          expect(res.body.role).is.equal(authUser.role);
          // response should never have secure fields
          expect(res.body).to.not.have.property(User.secureFields.join(','));
        });
    });

    it('should return error when user try to update other user', () => {
      authAdmin.firstName = `${authAdmin.firstName} Updated`;
      authAdmin.email = `updated${authAdmin.email}`;
      return request(server)
        .put(`/api/v1/users/${authAdmin._id}`)
        .send(authAdmin)
        .set('Authorization', `JWT ${userToken}`)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.FORBIDDEN)
        .then((res) => {
          expect(res.body).to.have.a.property('errors');
          expect(res.body.name).is.equal('Error');
          expect(res.body.message).is.equal('Invalid access');
        });
    });

    it('should return error when try to update email or phone alredy exist', () => {
      authUser.email = authAdmin.email; // try to update another user email
      return request(server)
        .put(`/api/v1/users/${authUser._id}`)
        .send(authUser)
        .set('Authorization', `JWT ${adminToken}`)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.CONFLICT)
        .then((res) => {
          expect(res.body).to.have.a.property('errors');
          expect(res.body.name).is.equal('MongoError');
          expect(res.body.message).is.equal('Validation Error');
          expect(res.body.errors.length).is.equal(1);
          expect(res.body.errors[0].field).to.include('Email');
          expect(res.body.errors[0].messages).to.include('Email already exists');
        });
    });

    it('should return cast error when invalid id in request', () => {
      const invalidid = '123123';
      return request(server)
        .put(`/api/v1/users/${invalidid}`)
        .send(authUser)
        .set('Authorization', `JWT ${adminToken}`)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.BAD_REQUEST)
        .then((res) => {
          // console.log(res.body);
          // console.log(res.body.errors);
          // TODO: check this CaseError
          expect(res.body).to.have.a.property('errors');
          expect(res.body.name).is.equal('CastError');
          expect(res.body.message).is.equal('Cast to ObjectId failed for value "123123" at path "_id" for model "User"');
        });
    });

    it('should return error when non exist user id in request', () => {
      const nonexistid = '5b651fb37a27e80fa85678e9';
      return request(server)
        .put(`/api/v1/users/${nonexistid}`)
        .send(authUser)
        .set('Authorization', `JWT ${adminToken}`)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.BAD_REQUEST)
        .then((res) => {
          expect(res.body).to.have.a.property('errors');
          expect(res.body.name).is.equal('Error');
          expect(res.body.message).is.equal('Invalid user');
        });
    });

    it('should return validation error when data empty in request', () => {
      // empty firstName, email & phone
      authUser.firstName = '';
      authUser.email = '';
      authUser.phone = '';
      return request(server)
        .put(`/api/v1/users/${authUser._id}`)
        .send(authUser)
        .set('Authorization', `JWT ${adminToken}`)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.BAD_REQUEST)
        .then((res) => {
          expect(res.body).to.have.a.property('errors');
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

    it('should return error when invalid token in request', () => {
      return request(server)
        .put(`/api/v1/users/${authUser._id}`)
        .send(authUser)
        .set('Authorization', 'JWT invalidtoken')
        .expect('Content-Type', /json/)
        .expect(HttpStatus.FORBIDDEN)
        .then((res) => {
          expect(res.body).to.have.a.property('errors');
          expect(res.body.name).is.equal('Error');
          expect(res.body.message).is.equal('Invalid authorization');
        });
    });

    it('should return error when no authorization token in header', () => {
      return request(server)
        .put(`/api/v1/users/${authUser._id}`)
        .send(authUser)
        .set('Authorization', '')
        .expect('Content-Type', /json/)
        .expect(HttpStatus.FORBIDDEN)
        .then((res) => {
          expect(res.body).to.have.a.property('errors');
          expect(res.body.name).is.equal('Error');
          expect(res.body.message).is.equal('Invalid authorization');
        });
    });
  });

  describe('Delete User DELETE: /api/v1/users/:id', () => {
    it('should return no content when request is ok', () => {
      return request(server)
        .delete(`/api/v1/users/${authUser._id}`)
        .set('Authorization', `JWT ${adminToken}`)
        .expect(HttpStatus.NO_CONTENT)
        .then((res) => {
          expect(res.body).to.be.deep.equal({});
        });
    });

    it('should return cast error when invalid id in request', () => {
      const invalidid = '123123';
      return request(server)
        .delete(`/api/v1/users/${invalidid}`)
        .set('Authorization', `JWT ${adminToken}`)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.BAD_REQUEST)
        .then((res) => {
          // console.log(res.body);
          // console.log(res.body.errors);
          // TODO: check this CaseError
          expect(res.body).to.have.a.property('errors');
          expect(res.body.name).is.equal('CastError');
          expect(res.body.message).is.equal('Cast to ObjectId failed for value "123123" at path "_id" for model "User"');
        });
    });

    it('should return error when non exist user id in request', () => {
      const nonexistid = '5b651fb37a27e80fa85678e9';
      return request(server)
        .delete(`/api/v1/users/${nonexistid}`)
        .set('Authorization', `JWT ${adminToken}`)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.BAD_REQUEST)
        .then((res) => {
          expect(res.body).to.have.a.property('errors');
          expect(res.body.name).is.equal('Error');
          expect(res.body.message).is.equal('Invalid user');
        });
    });

    it('should return error when user try to access', () => {
      return request(server)
        .delete(`/api/v1/users/${authAdmin._id}`)
        .set('Authorization', `JWT ${userToken}`)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.FORBIDDEN)
        .then((res) => {
          expect(res.body).to.have.a.property('errors');
          expect(res.body.name).is.equal('Error');
          expect(res.body.message).is.equal('Invalid access!');
        });
    });

    it('should return error when invalid token in request', () => {
      return request(server)
        .delete(`/api/v1/users/${authAdmin._id}`)
        .set('Authorization', 'JWT invalidtoken')
        .expect('Content-Type', /json/)
        .expect(HttpStatus.FORBIDDEN)
        .then((res) => {
          expect(res.body).to.have.a.property('errors');
          expect(res.body.name).is.equal('Error');
          expect(res.body.message).is.equal('Invalid authorization');
        });
    });

    it('should return error when no authorization token in header', () => {
      return request(server)
        .delete(`/api/v1/users/${authAdmin._id}`)
        .send(testUser)
        .set('Authorization', '')
        .expect('Content-Type', /json/)
        .expect(HttpStatus.FORBIDDEN)
        .then((res) => {
          expect(res.body).to.have.a.property('errors');
          expect(res.body.name).is.equal('Error');
          expect(res.body.message).is.equal('Invalid authorization');
        });
    });
  });
});
