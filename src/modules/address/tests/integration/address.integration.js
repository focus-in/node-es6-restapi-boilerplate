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
const { model: Address } = require('@modules/address'); // eslint-disable-line

describe('Address API Integration Test', () => {
  // Define the app from server
  let server;
  // Define database user & address
  let dbUsers;
  let dbAddress;
  let savedAddress;
  // Test address data
  let testAddress;
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
        _address: [],
        activeFlag: true,
      },
    };

    dbAddress = {
      address1: {
        street: 'test street 1',
        area: 'Indranagar',
        city: 'Bengaluru',
        state: 'Karnataka',
        landmark: 'test landmark 1',
        pincode: 560012,
        lat: 78.345,
        long: 567.456,
        tag: Address.enum.tags[0],
      },
      address2: {
        street: 'test street 2',
        area: 'Thambaram',
        city: 'Chennai',
        state: 'Tamil Nadu',
        landmark: 'test landmark 2',
        pincode: 600034,
        lat: 23.345,
        long: 45.456,
        tag: Address.enum.tags[1],
      },
    };

    // test address to run the test case
    testAddress = {
      street: 'test street',
      area: 'test area',
      city: 'test city',
      state: 'test state',
      landmark: 'test landmark',
      pincode: 560017,
      lat: 123.345,
      long: 345.456,
      tag: Address.enum.tags[0],
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

    // set user for address before save
    dbAddress.address1._userId = authAdmin._id;
    dbAddress.address2._userId = authUser._id;
    // insert the defined user
    savedAddress = await Address.insertMany([dbAddress.address1, dbAddress.address2]);
  });

  /**
   * Empty database after test case
   */
  afterEach(async () => {
    // remove all the existing users
    await User.remove({});
    // remove auth token
    await Auth.remove({});
    // remove test db address
    await Address.remove({});
  });

  describe('LIST Address GET: /api/v1/address', () => {
    it('should return all address list when admin request is ok', () => {
      return request(server)
        .get('/api/v1/address?select=*&order=createdAt&sort=asc')
        .set('Authorization', `JWT ${adminToken}`)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.OK)
        .then((res) => {
          expect(res.body).to.have.a.property('count');
          expect(res.body).to.have.a.property('addresses');
          expect(res.body.count).is.equal(2);
          expect(res.body.addresses).to.be.an('array');
          expect(res.body.addresses).to.have.lengthOf(2);
          // delete user id mongoose ObjectId failes in assert
          delete dbAddress.address1._userId;
          delete dbAddress.address2._userId;
          expect(res.body.addresses[0]).to.include(dbAddress.address1);
          expect(res.body.addresses[1]).to.include(dbAddress.address2);
        });
    });

    it('should return all address list with order & sort when request is ok', () => {
      return request(server)
        .get('/api/v1/address?select=*&order=city&sort=desc')
        .set('Authorization', `JWT ${adminToken}`)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.OK)
        .then((res) => {
          expect(res.body).to.have.a.property('count');
          expect(res.body).to.have.a.property('addresses');
          expect(res.body.count).is.equal(2);
          expect(res.body.addresses).to.be.an('array');
          expect(res.body.addresses).to.have.lengthOf(2);
          // delete user id mongoose ObjectId failes in assert
          delete dbAddress.address1._userId;
          delete dbAddress.address2._userId;
          expect(res.body.addresses[0]).to.include(dbAddress.address2);
          expect(res.body.addresses[1]).to.include(dbAddress.address1);
        });
    });

    it('should return address list with limit when limit in query', () => {
      return request(server)
        .get('/api/v1/address?select=*&order=createdAt&sort=asc&limit=1')
        .set('Authorization', `JWT ${adminToken}`)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.OK)
        .then((res) => {
          expect(res.body).to.have.a.property('count');
          expect(res.body).to.have.a.property('addresses');
          expect(res.body.count).is.equal(2); // count will never change for limit request
          expect(res.body.addresses).to.be.an('array');
          expect(res.body.addresses).to.have.lengthOf(1); // address length update
          // delete user id mongoose ObjectId failes in assert
          delete dbAddress.address1._userId;
          expect(res.body.addresses[0]).to.include(dbAddress.address1);
        });
    });

    it('should return address list with filter when filter in query', () => {
      return request(server)
        .get('/api/v1/address?select=*&filter[city]=Chennai&order=createdAt&sort=asc')
        .set('Authorization', `JWT ${adminToken}`)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.OK)
        .then((res) => {
          expect(res.body).to.have.a.property('count');
          expect(res.body).to.have.a.property('addresses');
          expect(res.body.count).is.equal(1); // count will change based on filter
          expect(res.body.addresses).to.be.an('array');
          expect(res.body.addresses).to.have.lengthOf(1);
          // delete user id mongoose ObjectId failes in assert
          delete dbAddress.address2._userId;
          expect(res.body.addresses[0]).to.include(dbAddress.address2);
        });
    });

    it('should return user address list when user try to access', () => {
      return request(server)
        .get('/api/v1/address?select=*')
        .set('Authorization', `JWT ${userToken}`)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.OK)
        .then((res) => {
          expect(res.body).to.have.a.property('count');
          expect(res.body).to.have.a.property('addresses');
          expect(res.body.count).is.equal(1);
          expect(res.body.addresses).to.be.an('array');
          expect(res.body.addresses).to.have.lengthOf(1);
          // check its only user address
          expect(res.body.addresses[0]._userId.toString()).is.equal(authUser._id.toString());
          // delete user id mongoose ObjectId failes in assert
          delete dbAddress.address2._userId;
          expect(res.body.addresses[0]).to.include(dbAddress.address2);
        });
    });

    it('should return error when no select in query', () => {
      return request(server)
        .get('/api/v1/address')
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

    it('should return error when invalid token in request', () => {
      return request(server)
        .get('/api/v1/address?select=*')
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
        .get('/api/v1/address?select=*')
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

  describe('CREATE Address POST: /api/v1/address', () => {
    it('should return created address when request is ok', () => {
      return request(server)
        .post('/api/v1/address')
        .send(testAddress)
        .set('Authorization', `JWT ${userToken}`)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.CREATED)
        .then((res) => {
          expect(res.body).to.have.a.property('_id');
          expect(res.body).to.have.a.property('_userId');
          expect(res.body._userId.toString()).is.equal(authUser._id.toString());
          expect(res.body).to.include(testAddress);
        });
    });

    it('should return error when area exist for user', () => {
      return request(server)
        .post('/api/v1/address')
        .send(dbAddress.address2)
        .set('Authorization', `JWT ${userToken}`)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.CONFLICT)
        .then((res) => {
          expect(res.body).to.have.a.property('errors');
          expect(res.body.name).is.equal('MongoError');
          expect(res.body.message).is.equal('Validation Error');
          expect(res.body.errors.length).is.equal(1);
          expect(res.body.errors[0].field).to.include('_userId_1_area');
          expect(res.body.errors[0].messages).to.include('_userId_1_area already exists');
        });
    });

    it('should return validation error when data empty in request', () => {
      // empty area, city & pincode
      testAddress.area = '';
      testAddress.city = '';
      testAddress.pincode = '';
      return request(server)
        .post('/api/v1/address')
        .send(testAddress)
        .set('Authorization', `JWT ${userToken}`)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.BAD_REQUEST)
        .then((res) => {
          expect(res.body).to.have.a.property('errors');
          expect(res.body.name).is.equal('Error');
          expect(res.body.message).is.equal('validation error');
          expect(res.body.errors.length).is.equal(3);
          expect(res.body.errors[0].field).to.include('area');
          expect(res.body.errors[0].messages).to.include('"area" is not allowed to be empty');
          expect(res.body.errors[1].field).to.include('city');
          expect(res.body.errors[1].messages).to.include('"city" is not allowed to be empty');
          expect(res.body.errors[2].field).to.include('pincode');
          expect(res.body.errors[2].messages).to.include('"pincode" must be a number');
        });
    });

    it('should return error when invalid token in request', () => {
      return request(server)
        .post('/api/v1/address')
        .send(testAddress)
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
        .post('/api/v1/address')
        .send(testAddress)
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

  describe('GET single Address GET: /api/v1/address/:id', () => {
    it('should return address when admin request', () => {
      return request(server)
        .get(`/api/v1/address/${savedAddress[1]._id}`)
        .set('Authorization', `JWT ${adminToken}`)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.OK)
        .then((res) => {
          expect(res.body).to.have.a.property('_id');
          expect(res.body._id.toString()).is.equal(savedAddress[1]._id.toString());
          expect(res.body._userId.toString()).is.equal(authUser._id.toString());
          expect(res.body.area).is.equal(savedAddress[1].area);
          expect(res.body.city).is.equal(savedAddress[1].city);
          expect(res.body.pincode).is.equal(savedAddress[1].pincode);
        });
    });

    it('should return own address when user request', () => {
      return request(server)
        .get(`/api/v1/address/${savedAddress[1]._id}`)
        .set('Authorization', `JWT ${userToken}`)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.OK)
        .then((res) => {
          expect(res.body).to.have.a.property('_id');
          expect(res.body._id.toString()).is.equal(savedAddress[1]._id.toString());
          expect(res.body._userId.toString()).is.equal(authUser._id.toString());
          expect(res.body.area).is.equal(savedAddress[1].area);
          expect(res.body.city).is.equal(savedAddress[1].city);
          expect(res.body.pincode).is.equal(savedAddress[1].pincode);
        });
    });

    it('should return error when user request other address', () => {
      return request(server)
        .get(`/api/v1/address/${savedAddress[0]._id}`)
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
        .get(`/api/v1/address/${invalidid}`)
        .set('Authorization', `JWT ${userToken}`)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.BAD_REQUEST)
        .then((res) => {
          // console.log(res.body);
          // console.log(res.body.errors);
          // TODO: check this CaseError
          expect(res.body).to.have.a.property('errors');
          expect(res.body.name).is.equal('CastError');
          expect(res.body.message).is.equal('Cast to ObjectId failed for value "123123" at path "_id" for model "Address"');
        });
    });

    it('should return error when non exist user id in request', () => {
      const nonexistid = '5b651fb37a27e80fa85678e9';
      return request(server)
        .get(`/api/v1/address/${nonexistid}`)
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
        .get(`/api/v1/address/${savedAddress[1]._id}`)
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
        .get(`/api/v1/address/${savedAddress[1]._id}`)
        .send(testAddress)
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

  describe('UPDATE Address PUT: /api/v1/address/:id', () => {
    it('should return updated address when admin request is ok', () => {
      savedAddress[1].area = `${savedAddress[1].area} Updated`;
      savedAddress[1].state = `${savedAddress[1].state} updated`;
      return request(server)
        .put(`/api/v1/address/${savedAddress[1]._id}`)
        .send(savedAddress[1])
        .set('Authorization', `JWT ${adminToken}`)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.OK)
        .then((res) => {
          expect(res.body).to.have.a.property('_id');
          expect(res.body._id.toString()).is.equal(savedAddress[1]._id.toString());
          expect(res.body.firstName).is.equal(savedAddress[1].firstName);
          expect(res.body.area).is.equal(savedAddress[1].area);
          expect(res.body.state).is.equal(savedAddress[1].state);
          expect(res.body.pincode).is.equal(savedAddress[1].pincode);
        });
    });

    it('should return updated address when user request is ok', () => {
      savedAddress[1].area = `${savedAddress[1].area} Updated`;
      savedAddress[1].state = `${savedAddress[1].state} updated`;
      return request(server)
        .put(`/api/v1/address/${savedAddress[1]._id}`)
        .send(savedAddress[1])
        .set('Authorization', `JWT ${userToken}`)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.OK)
        .then((res) => {
          expect(res.body).to.have.a.property('_id');
          expect(res.body._id.toString()).is.equal(savedAddress[1]._id.toString());
          expect(res.body.firstName).is.equal(savedAddress[1].firstName);
          expect(res.body.area).is.equal(savedAddress[1].area);
          expect(res.body.state).is.equal(savedAddress[1].state);
          expect(res.body.pincode).is.equal(savedAddress[1].pincode);
        });
    });

    it('should return error when user try to update other address', () => {
      savedAddress[0].area = `${savedAddress[0].area} Updated`;
      savedAddress[0].state = `${savedAddress[0].state} updated`;
      return request(server)
        .put(`/api/v1/address/${savedAddress[0]._id}`)
        .send(savedAddress[0])
        .set('Authorization', `JWT ${userToken}`)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.FORBIDDEN)
        .then((res) => {
          expect(res.body).to.have.a.property('errors');
          expect(res.body.name).is.equal('Error');
          expect(res.body.message).is.equal('Invalid access');
        });
    });

    it('should return error when try to update userId & area alredy exist', async () => {
      testAddress._userId = authUser._id;
      // save the tesetAddress for user
      const address = new Address(testAddress);
      await address.save();
      // update exising address with area
      savedAddress[1].area = testAddress.area;
      savedAddress[1].state = `${savedAddress[1].state} updated`;
      return request(server)
        .put(`/api/v1/address/${savedAddress[1]._id}`)
        .send(savedAddress[1])
        .set('Authorization', `JWT ${userToken}`)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.CONFLICT)
        .then((res) => {
          expect(res.body).to.have.a.property('errors');
          expect(res.body.name).is.equal('MongoError');
          expect(res.body.message).is.equal('Validation Error');
          expect(res.body.errors.length).is.equal(1);
          expect(res.body.errors[0].field).to.include('_userId_1_area');
          expect(res.body.errors[0].messages).to.include('_userId_1_area already exists');
        });
    });

    it('should return cast error when invalid id in request', () => {
      const invalidid = '123123';
      return request(server)
        .put(`/api/v1/address/${invalidid}`)
        .send(savedAddress[1])
        .set('Authorization', `JWT ${userToken}`)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.BAD_REQUEST)
        .then((res) => {
          // console.log(res.body);
          // console.log(res.body.errors);
          // TODO: check this CaseError
          expect(res.body).to.have.a.property('errors');
          expect(res.body.name).is.equal('CastError');
          expect(res.body.message).is.equal('Cast to ObjectId failed for value "123123" at path "_id" for model "Address"');
        });
    });

    it('should return error when non exist address id in request', () => {
      const nonexistid = '5b651fb37a27e80fa85678e9';
      return request(server)
        .put(`/api/v1/address/${nonexistid}`)
        .send(savedAddress[1])
        .set('Authorization', `JWT ${userToken}`)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.BAD_REQUEST)
        .then((res) => {
          expect(res.body).to.have.a.property('errors');
          expect(res.body.name).is.equal('Error');
          expect(res.body.message).is.equal('Invalid id');
        });
    });

    it('should return validation error when data empty in request', () => {
      // empty area, city & pincode
      savedAddress[1].area = '';
      savedAddress[1].city = '';
      savedAddress[1].pincode = '';
      return request(server)
        .put(`/api/v1/address/${savedAddress[1]._id}`)
        .send(savedAddress[1])
        .set('Authorization', `JWT ${userToken}`)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.BAD_REQUEST)
        .then((res) => {
          expect(res.body).to.have.a.property('errors');
          expect(res.body.name).is.equal('Error');
          expect(res.body.message).is.equal('validation error');
          expect(res.body.errors.length).is.equal(3);
          expect(res.body.errors[0].field).to.include('area');
          expect(res.body.errors[0].messages).to.include('"area" is not allowed to be empty');
          expect(res.body.errors[1].field).to.include('city');
          expect(res.body.errors[1].messages).to.include('"city" is not allowed to be empty');
          expect(res.body.errors[2].field).to.include('pincode');
          expect(res.body.errors[2].messages).to.include('"pincode" must be a number');
        });
    });

    it('should return error when invalid token in request', () => {
      return request(server)
        .put(`/api/v1/address/${savedAddress[1]._id}`)
        .send(savedAddress[1])
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
        .put(`/api/v1/address/${savedAddress[1]._id}`)
        .send(savedAddress[1])
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

  describe('DELETE Address DELETE: /api/v1/address/:id', () => {
    it('should return no content when admin request is ok', () => {
      return request(server)
        .delete(`/api/v1/address/${savedAddress[1]._id}`)
        .set('Authorization', `JWT ${adminToken}`)
        .expect(HttpStatus.NO_CONTENT)
        .then((res) => {
          expect(res.body).to.be.deep.equal({});
        });
    });

    it('should return no content when user request is ok', () => {
      return request(server)
        .delete(`/api/v1/address/${savedAddress[1]._id}`)
        .set('Authorization', `JWT ${userToken}`)
        .expect(HttpStatus.NO_CONTENT)
        .then((res) => {
          expect(res.body).to.be.deep.equal({});
        });
    });

    it('should return error when user request other address', () => {
      return request(server)
        .delete(`/api/v1/address/${savedAddress[0]._id}`)
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
        .delete(`/api/v1/address/${invalidid}`)
        .set('Authorization', `JWT ${userToken}`)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.BAD_REQUEST)
        .then((res) => {
          // console.log(res.body);
          // console.log(res.body.errors);
          // TODO: check this CaseError
          expect(res.body).to.have.a.property('errors');
          expect(res.body.name).is.equal('CastError');
          expect(res.body.message).is.equal('Cast to ObjectId failed for value "123123" at path "_id" for model "Address"');
        });
    });

    it('should return error when non exist address id in request', () => {
      const nonexistid = '5b651fb37a27e80fa85678e9';
      return request(server)
        .delete(`/api/v1/address/${nonexistid}`)
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
        .delete(`/api/v1/address/${savedAddress[1]._id}`)
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
        .delete(`/api/v1/address/${savedAddress[1]._id}`)
        .send(testAddress)
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
