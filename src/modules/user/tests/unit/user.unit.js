/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable arrow-body-style */
const chai = require('chai');
const faker = require('faker');
const sinon = require('sinon');
const rewire = require('rewire');
const mongoose = require('mongoose');
const sinonChai = require('sinon-chai');
require('sinon-mongoose');
// const dataDriven = require('data-driven');

const { expect } = chai;
const userController = rewire('../../controllers/user.controller');
const User = require('../../models/user.model');

chai.use(sinonChai);

describe.only('User controller', () => {
  let sandbox;
  let req;
  let res;
  let savedUser;
  let savedAddress;
  // let newUser;

  const generateMongoId = () => {
    return mongoose.Types.ObjectId();
  };

  const generateUser = () => {
    return {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      phone: faker.phone.phoneNumber(),
      gender: faker.name.firstName(),
      birthDate: faker.name.firstName(),
      picture: faker.name.firstName(),
      bio: faker.name.firstName(),
    };
  };

  const generateAddress = () => {
    return {
      _userId: generateMongoId(),
      street: faker.address.streetName(),
      area: faker.address.streetAddress(),
      city: faker.address.city(),
      landmark: faker.address.secondaryAddress(),
      pincode: faker.address.zipCode(),
      lat: faker.address.latitude(),
      lng: faker.address.longitude(),
      tag: 'home',
    };
  };

  before(() => {
    savedUser = generateUser();
    savedUser._id = generateMongoId();
    savedAddress = generateAddress();
    savedAddress._id = generateMongoId();
    req = {
      user: {
        _id: generateMongoId(),
      },
      body: generateUser(),
      query: {
        filter: { deleted: false },
        select: '',
        offset: 0,
        limit: 10,
        sortBy: {},
        populates: [],
      },
    };
    res = {
      send: () => {},
    };
  });

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
    sinon.restore();
  });

  describe('User controller load function', () => {
    it('should return user object if the user id is saved in db', async () => {
      const next = sandbox.spy();
      sandbox.stub(User, 'findById').returns(Promise.resolve(savedUser));

      try {
        await userController.load(req, res, next, savedUser._id);
        expect(User.findById).to.have.been.calledWith(savedUser._id);
        expect(next.called).to.equal(true);
        expect(req.locals).to.have.a.property('user');
        expect(req.locals.user).to.be.equal(savedUser);
      } catch (e) {
        throw new Error(e);
      }
    });

    it('should return error if the user is deleted in db', async () => {
      const next = sandbox.spy();
      // delete the user
      savedUser.deleted = true;
      sandbox.stub(User, 'findById').returns(Promise.resolve(savedUser));

      try {
        await userController.load(req, res, next, savedUser._id);
        expect(User.findById).to.have.been.calledWith(savedUser._id);
        expect(next.called).to.equal(true);
        const err = next.firstCall.args[0];
        expect(err).to.be.instanceof(Error);
        expect(err.message).to.equal('Invalid user');
      } catch (e) {
        throw new Error(e);
      }
    });

    it('should return error if the user is not in db', async () => {
      const next = sandbox.spy();
      // delete the user
      const fakeId = generateMongoId();
      sandbox.stub(User, 'findById').returns(Promise.resolve(null));

      try {
        await userController.load(req, res, next, fakeId);
        expect(User.findById).to.have.been.calledWith(fakeId);
        expect(next.called).to.equal(true);
        const err = next.firstCall.args[0];
        expect(err).to.be.instanceof(Error);
        expect(err.message).to.equal('Invalid user');
      } catch (e) {
        throw new Error(e);
      }
    });
  });

  describe('User controller list function', () => {
    it('should return user list from the db', async () => {
      const next = sandbox.spy();
      const UserMock = sinon.mock(User);
      sandbox.spy(res, 'send');
      sandbox.spy(User, 'populate');
      sandbox.stub(User, 'countDocuments').returns(Promise.resolve(1));
      UserMock.expects('find').withArgs(req.query.filter)
        .chain('select')
        .withArgs(req.query.select)
        .chain('skip')
        .withArgs(req.query.offset)
        .chain('limit')
        .withArgs(req.query.limit)
        .chain('sort')
        .withArgs(req.query.sortBy)
        .chain('exec')
        .resolves([savedUser]);

      try {
        await userController.list(req, res, next);
        expect(User.countDocuments).to.have.been.calledWith(req.query.filter);
        expect(User.populate.called).to.equal(false);
        expect(next.called).to.equal(false);
        expect(res.send.called).to.equal(true);
        expect(res.send).to.have.been.calledWith({ count: 1, users: [savedUser] });
      } catch (e) {
        throw new Error(e);
      }
    });

    it('should return user list with email filter from req query', async () => {
      req.query.filter.email = 'test@gmail.com';
      const next = sandbox.spy();
      const UserMock = sinon.mock(User);
      sandbox.spy(res, 'send');
      sandbox.spy(User, 'populate');
      sandbox.stub(User, 'countDocuments').returns(Promise.resolve(0));
      UserMock.expects('find').withArgs(req.query.filter)
        .chain('select')
        .withArgs(req.query.select)
        .chain('skip')
        .withArgs(req.query.offset)
        .chain('limit')
        .withArgs(req.query.limit)
        .chain('sort')
        .withArgs(req.query.sortBy)
        .chain('exec')
        .resolves([]);

      try {
        await userController.list(req, res, next);
        expect(User.countDocuments).to.have.been.calledWith(req.query.filter);
        expect(req.query.filter.email).to.be.deep.equal({
          $regex: /^test@gmail.com/i,
        });
        expect(User.populate.called).to.equal(false);
        expect(next.called).to.equal(false);
        expect(res.send.called).to.equal(true);
        expect(res.send).to.have.been.calledWith({ count: 0, users: [] });
      } catch (e) {
        throw new Error(e);
      }
    });

    it('should return user list with populate address details in db', async () => {
      req.query.populates = [{ path: '_address', select: '*' }];
      const next = sandbox.spy();
      const UserMock = sinon.mock(User);
      sandbox.spy(res, 'send');
      sandbox.stub(User, 'countDocuments').returns(Promise.resolve(0));
      UserMock.expects('find').withArgs(req.query.filter)
        .chain('select')
        .withArgs(req.query.select)
        .chain('skip')
        .withArgs(req.query.offset)
        .chain('limit')
        .withArgs(req.query.limit)
        .chain('sort')
        .withArgs(req.query.sortBy)
        .chain('exec')
        .resolves([savedUser]);

      UserMock.expects('populate')
        .resolves([savedAddress]);

      savedUser._address = [savedAddress];

      try {
        await userController.list(req, res, next);
        expect(User.countDocuments).to.have.been.calledWith(req.query.filter);
        expect(next.called).to.equal(false);
        expect(res.send.called).to.equal(true);
        expect(res.send).to.have.been.calledWith({ count: 0, users: [savedUser] });
      } catch (e) {
        throw new Error(e);
      }
    });
  });

  describe('User controller profile function', () => {
    it.only('should return user details from req user', async () => {
      const next = sandbox.spy();
      sandbox.spy(res, 'send');
      sandbox.spy(User, 'populate');

      try {
        await userController.list(req, res, next);
        expect(User.countDocuments).to.have.been.calledWith(req.query.filter);
        expect(next.called).to.equal(false);
        expect(User.populate.called).to.equal(false);
        expect(res.send.called).to.equal(true);
        expect(res.send).to.have.been.calledWith({ count: 1, users: [savedUser] });
      } catch (e) {
        throw new Error(e);
      }
    });

    it('should return empty user list if no user in db', async () => {
      const next = sandbox.spy();
      const UserMock = sinon.mock(User);
      sandbox.spy(res, 'send');
      sandbox.stub(User, 'countDocuments').returns(Promise.resolve(0));
      UserMock.expects('find').withArgs(req.query.filter)
        .chain('select')
        .withArgs(req.query.select)
        .chain('skip')
        .withArgs(req.query.offset)
        .chain('limit')
        .withArgs(req.query.limit)
        .chain('sort')
        .withArgs(req.query.sortBy)
        .chain('exec')
        .resolves([]);

      try {
        await userController.list(req, res, next);
        expect(User.countDocuments).to.have.been.calledWith(req.query.filter);
        expect(next.called).to.equal(false);
        expect(res.send.called).to.equal(true);
        expect(res.send).to.have.been.calledWith({ count: 0, users: [] });
      } catch (e) {
        throw new Error(e);
      }
    });

    it('should return user list with populate address details in db', async () => {
      req.populates = [{ path: '_address', select: '*' }];
      const next = sandbox.spy();
      const UserMock = sinon.mock(User);
      sandbox.spy(res, 'send');
      sandbox.stub(User, 'countDocuments').returns(Promise.resolve(0));
      UserMock.expects('find').withArgs(req.query.filter)
        .chain('select')
        .withArgs(req.query.select)
        .chain('skip')
        .withArgs(req.query.offset)
        .chain('limit')
        .withArgs(req.query.limit)
        .chain('sort')
        .withArgs(req.query.sortBy)
        .chain('exec')
        .resolves([savedUser]);

      UserMock.expects('populate')
        .resolves([savedAddress]);

      savedUser._address = [savedAddress];

      try {
        await userController.list(req, res, next);
        expect(User.countDocuments).to.have.been.calledWith(req.query.filter);
        expect(next.called).to.equal(false);
        expect(res.send.called).to.equal(true);
        expect(res.send).to.have.been.calledWith({ count: 0, users: [savedUser] });
      } catch (e) {
        throw new Error(e);
      }
    });
  });
});
