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
const { model: Activity } = require('@modules/activity'); // eslint-disable-line

describe('Activity API Integration Test', () => {
  // Define the app from server
  let server;
  // Define database user & activity
  let dbUsers;
  let dbActivity;
  let savedActivity;
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
    // remove test db activity
    await Activity.remove({});
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
        _activity: [],
        activeFlag: true,
      },
    };

    dbActivity = {
      activity1: {
        activity: 'User created',
        action: {
          id: '5b651fb37a27e80fa85678e9',
          module: 'User',
          data: { test: 1 },
        },
        message: 'User created test activity',
      },
      activity2: {
        activity: 'User profile updated',
        action: {
          id: '5b651fb37a27e80fa85678e9',
          module: 'User',
          data: { test: 1 },
        },
        message: 'User updated profile',
      },
      activity3: {
        activity: 'User logged in',
        action: {
          id: '5b651fb37a27e80fa85678e9',
          module: 'Auth',
          data: { test: 1 },
        },
        message: 'User logged in successfully',
      },
      activity4: {
        activity: 'Address created',
        action: {
          id: '5b651fb37a27e80fa85678e9',
          module: 'Address',
          data: { test: 1 },
        },
        message: 'User added new address',
      },
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

    // set user for activity before save
    dbActivity.activity1._userId = authAdmin._id;
    dbActivity.activity2._userId = authUser._id;
    dbActivity.activity3._userId = authUser._id;
    dbActivity.activity4._userId = authUser._id;
    // insert the defined user
    savedActivity = await Activity.insertMany([
      dbActivity.activity1,
      dbActivity.activity2,
      dbActivity.activity3,
      dbActivity.activity4,
    ]);
  });

  /**
   * Empty database after test case
   */
  afterEach(async () => {
    // remove all the existing users
    await User.remove({});
    // remove auth token
    await Auth.remove({});
    // remove test db activity
    await Activity.remove({});
  });

  describe('LIST Activity GET: /api/v1/activities', () => {
    it('should return all activity list when admin request is ok', () => {
      return request(server)
        .get('/api/v1/activities?select=*&order=createdAt&sort=asc')
        .set('Authorization', `JWT ${adminToken}`)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.OK)
        .then((res) => {
          expect(res.body).to.have.a.property('count');
          expect(res.body).to.have.a.property('activities');
          expect(res.body.count).is.equal(4);
          expect(res.body.activities).to.be.an('array');
          expect(res.body.activities).to.have.lengthOf(4);
          // delete user id mongoose ObjectId failes in assert
          delete dbActivity.activity1._userId;
          delete dbActivity.activity2._userId;
          delete dbActivity.activity3._userId;
          delete dbActivity.activity4._userId;
          expect(res.body.activities[0]).to.deep.include(dbActivity.activity1);
          expect(res.body.activities[1]).to.deep.include(dbActivity.activity2);
          expect(res.body.activities[2]).to.deep.include(dbActivity.activity3);
          expect(res.body.activities[3]).to.deep.include(dbActivity.activity4);
        });
    });

    it('should return all activity list with order & sort when request is ok', () => {
      return request(server)
        .get('/api/v1/activities?select=*&order=activity&sort=asc')
        .set('Authorization', `JWT ${adminToken}`)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.OK)
        .then((res) => {
          expect(res.body).to.have.a.property('count');
          expect(res.body).to.have.a.property('activities');
          expect(res.body.count).is.equal(4);
          expect(res.body.activities).to.be.an('array');
          expect(res.body.activities).to.have.lengthOf(4);
          // delete user id mongoose ObjectId failes in assert
          delete dbActivity.activity1._userId;
          delete dbActivity.activity2._userId;
          delete dbActivity.activity3._userId;
          delete dbActivity.activity4._userId;
          expect(res.body.activities[0]).to.deep.include(dbActivity.activity4);
          expect(res.body.activities[1]).to.deep.include(dbActivity.activity1);
          expect(res.body.activities[2]).to.deep.include(dbActivity.activity3);
          expect(res.body.activities[3]).to.deep.include(dbActivity.activity2);
        });
    });

    it('should return activity list with limit when limit in query', () => {
      return request(server)
        .get('/api/v1/activities?select=*&order=activity&sort=desc&limit=1')
        .set('Authorization', `JWT ${adminToken}`)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.OK)
        .then((res) => {
          expect(res.body).to.have.a.property('count');
          expect(res.body).to.have.a.property('activities');
          expect(res.body.count).is.equal(4); // count will never change for limit request
          expect(res.body.activities).to.be.an('array');
          expect(res.body.activities).to.have.lengthOf(1); // activity length update
          // delete user id mongoose ObjectId failes in assert
          delete dbActivity.activity2._userId;
          expect(res.body.activities[0]).to.deep.include(dbActivity.activity2);
        });
    });

    it('should return activity list with filter when filter in query', () => {
      return request(server)
        .get('/api/v1/activities?select=*&filter[action.module]=Address&order=createdAt&sort=asc')
        .set('Authorization', `JWT ${adminToken}`)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.OK)
        .then((res) => {
          expect(res.body).to.have.a.property('count');
          expect(res.body).to.have.a.property('activities');
          expect(res.body.count).is.equal(1); // count will change based on filter
          expect(res.body.activities).to.be.an('array');
          expect(res.body.activities).to.have.lengthOf(1);
          // delete user id mongoose ObjectId failes in assert
          delete dbActivity.activity4._userId;
          expect(res.body.activities[0]).to.deep.include(dbActivity.activity4);
        });
    });

    it('should return user activity list when user try to access', () => {
      return request(server)
        .get('/api/v1/activities?select=*&order=createdAt&sort=asc')
        .set('Authorization', `JWT ${userToken}`)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.OK)
        .then((res) => {
          expect(res.body).to.have.a.property('count');
          expect(res.body).to.have.a.property('activities');
          expect(res.body.count).is.equal(3);
          expect(res.body.activities).to.be.an('array');
          expect(res.body.activities).to.have.lengthOf(3);
          // check its only user activity
          expect(res.body.activities[0]._userId.toString()).is.equal(authUser._id.toString());
          // delete user id mongoose ObjectId failes in assert
          delete dbActivity.activity2._userId;
          delete dbActivity.activity3._userId;
          delete dbActivity.activity4._userId;
          expect(res.body.activities[0]).to.deep.include(dbActivity.activity2);
          expect(res.body.activities[1]).to.deep.include(dbActivity.activity3);
          expect(res.body.activities[2]).to.deep.include(dbActivity.activity4);
        });
    });

    it('should return error when no select in query', () => {
      return request(server)
        .get('/api/v1/activities')
        .set('Authorization', `JWT ${adminToken}`)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.BAD_REQUEST)
        .then((res) => {
          expect(res.body).to.have.a.property('errors');
          expect(res.body.name).is.equal('Error');
          expect(res.body.message).is.equal('validation error');
          expect(res.body.errors.length).is.equal(1);
          expect(res.body.errors[0].field).to.deep.include('select');
          expect(res.body.errors[0].messages).to.deep.include('"select" is required');
        });
    });

    it('should return error when invalid token in request', () => {
      return request(server)
        .get('/api/v1/activities?select=*')
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
        .get('/api/v1/activities?select=*')
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

  describe('GET single Activity GET: /api/v1/activities/:id', () => {
    it('should return activity when admin request', () => {
      return request(server)
        .get(`/api/v1/activities/${savedActivity[1]._id}`)
        .set('Authorization', `JWT ${adminToken}`)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.OK)
        .then((res) => {
          expect(res.body).to.have.a.property('_id');
          expect(res.body._id.toString()).is.equal(savedActivity[1]._id.toString());
          expect(res.body._userId.toString()).is.equal(authUser._id.toString());
          expect(res.body.activity).is.equal(savedActivity[1].activity);
          expect(res.body.message).is.equal(savedActivity[1].message);
        });
    });

    it('should return own activity when user request', () => {
      return request(server)
        .get(`/api/v1/activities/${savedActivity[1]._id}`)
        .set('Authorization', `JWT ${userToken}`)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.OK)
        .then((res) => {
          expect(res.body).to.have.a.property('_id');
          expect(res.body._id.toString()).is.equal(savedActivity[1]._id.toString());
          expect(res.body._userId.toString()).is.equal(authUser._id.toString());
          expect(res.body.activity).is.equal(savedActivity[1].activity);
          expect(res.body.message).is.equal(savedActivity[1].message);
        });
    });

    it('should return error when user request other activity', () => {
      return request(server)
        .get(`/api/v1/activities/${savedActivity[0]._id}`)
        .set('Authorization', `JWT ${userToken}`)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.FORBIDDEN)
        .then((res) => {
          expect(res.body).to.have.a.property('errors');
          expect(res.body.name).is.equal('Error');
          expect(res.body.message).is.equal('Invalid access');
        });
    });

    it('should return cast error when invalid id in request', () => {
      const invalidid = '123123';
      return request(server)
        .get(`/api/v1/activities/${invalidid}`)
        .set('Authorization', `JWT ${userToken}`)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.BAD_REQUEST)
        .then((res) => {
          // console.log(res.body);
          // console.log(res.body.errors);
          // TODO: check this CaseError
          expect(res.body).to.have.a.property('errors');
          expect(res.body.name).is.equal('CastError');
          expect(res.body.message).is.equal('Cast to ObjectId failed for value "123123" at path "_id" for model "Activity"');
        });
    });

    it('should return error when non exist user id in request', () => {
      const nonexistid = '5b651fb37a27e80fa85678e9';
      return request(server)
        .get(`/api/v1/activities/${nonexistid}`)
        .set('Authorization', `JWT ${userToken}`)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.BAD_REQUEST)
        .then((res) => {
          expect(res.body).to.have.a.property('errors');
          expect(res.body.name).is.equal('Error');
          expect(res.body.message).is.equal('Invalid id');
        });
    });

    it('should return error when invalid token in request', () => {
      return request(server)
        .get(`/api/v1/activities/${savedActivity[1]._id}`)
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
        .get(`/api/v1/activities/${savedActivity[1]._id}`)
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

  describe('DELETE Activity DELETE: /api/v1/activities/:id', () => {
    it('should return no content when admin request is ok', () => {
      return request(server)
        .delete(`/api/v1/activities/${savedActivity[1]._id}`)
        .set('Authorization', `JWT ${adminToken}`)
        .expect(HttpStatus.NO_CONTENT)
        .then((res) => {
          expect(res.body).to.be.deep.equal({});
        });
    });

    it('should return error when user request is ok', () => {
      return request(server)
        .delete(`/api/v1/activities/${savedActivity[1]._id}`)
        .set('Authorization', `JWT ${userToken}`)
        .expect(HttpStatus.FORBIDDEN)
        .then((res) => {
          expect(res.body).to.have.a.property('errors');
          expect(res.body.name).is.equal('Error');
          expect(res.body.message).is.equal('Invalid access!');
        });
    });

    it('should return error when user request other activity', () => {
      return request(server)
        .delete(`/api/v1/activities/${savedActivity[0]._id}`)
        .set('Authorization', `JWT ${userToken}`)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.FORBIDDEN)
        .then((res) => {
          expect(res.body).to.have.a.property('errors');
          expect(res.body.name).is.equal('Error');
          expect(res.body.message).is.equal('Invalid access');
        });
    });

    it('should return cast error when invalid id in request', () => {
      const invalidid = '123123';
      return request(server)
        .delete(`/api/v1/activities/${invalidid}`)
        .set('Authorization', `JWT ${userToken}`)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.BAD_REQUEST)
        .then((res) => {
          // console.log(res.body);
          // console.log(res.body.errors);
          // TODO: check this CaseError
          expect(res.body).to.have.a.property('errors');
          expect(res.body.name).is.equal('CastError');
          expect(res.body.message).is.equal('Cast to ObjectId failed for value "123123" at path "_id" for model "Activity"');
        });
    });

    it('should return error when non exist activity id in request', () => {
      const nonexistid = '5b651fb37a27e80fa85678e9';
      return request(server)
        .delete(`/api/v1/activities/${nonexistid}`)
        .set('Authorization', `JWT ${userToken}`)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.BAD_REQUEST)
        .then((res) => {
          expect(res.body).to.have.a.property('errors');
          expect(res.body.name).is.equal('Error');
          expect(res.body.message).is.equal('Invalid id');
        });
    });

    it('should return error when invalid token in request', () => {
      return request(server)
        .delete(`/api/v1/activities/${savedActivity[1]._id}`)
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
        .delete(`/api/v1/activities/${savedActivity[1]._id}`)
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
