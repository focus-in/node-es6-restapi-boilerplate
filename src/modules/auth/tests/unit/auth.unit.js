/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable arrow-body-style */
const sinon = require('sinon');
const { expect } = require('chai');
const Auth = require('../../models/auth.model');
const AuthHelper = require('../../utils/auth.helper');
require('module-alias/register');
const app = require('@root/src/app'); // eslint-disable-line
const mailer = require('@configs/libs/mailer'); // eslint-disable-line
const messenger = require('@configs/libs/messenger'); // eslint-disable-line
const { model: User } = require('@modules/user'); // eslint-disable-line
const { model: Activity } = require('@modules/activity'); // eslint-disable-line
const { event: SystemEvent } = require('@system'); // eslint-disable-line

describe('Auth Unit Test', () => {
  // Define test variables here
  let sandbox;
  let server;
  const UserMock = sinon.mock(User);
  const AuthMock = sinon.mock(Auth);

  before(async () => {
    // start the app before running test case
    server = await app.start();
    // sandbos stub data
    sandbox = sinon.createSandbox();

    // stub all the required object functions
    sandbox.stub(Auth.prototype, 'save');
    sandbox.stub(Activity.prototype, 'save');
    sandbox.stub(mailer, 'sendMail');
    sandbox.stub(messenger, 'sendSms');
  });

  // beforeEach(() => {

  // });

  afterEach(() => {
    // reset the initial state for all fakes
    sandbox.reset();
  });

  after(() => {
    app.stop(server);
    // restores all fakes
    sandbox.restore();
  });

  describe('Auth Model Unit Test', () => {
    describe('Generate Token', () => {
      // Skipped test case
      it.skip('should return token when valid user object in param', (done) => {
        const expectToken = {
          token: 123,
          refreshToken: 345,
          expiresIn: new Date(),
        };
        AuthMock.expects('generateTokens').yields(null, expectToken);
        Auth.generateTokens(UserMock, (err, result) => {
          AuthMock.verify();
          AuthMock.restore();
          expect(result).is.deep.equal(expectToken);
          done();
        });
      });

      it('should return token when valid user object in param', async () => {
        const token = await Auth.generateTokens(UserMock.object);
        expect(token).to.have.a.property('token');
        expect(token).to.have.a.property('refreshToken');
        expect(token).to.have.a.property('expiresIn');
        expect(token.expiresIn).is.equal('2880');
        expect(Auth.prototype.save.callCount).is.equal(1);
      });
    });
  });

  describe('Auth Activity Event Unit Test', () => {
    describe('SignUp event', () => {
      it('SignUp event should trigger an activity event', () => {
        SystemEvent.emit('signup', UserMock);
        expect(Activity.prototype.save.callCount).is.equal(1);
      });
    });

    describe('SignIn event', () => {
      it('SignIn event should trigger an activity event', () => {
        SystemEvent.emit('signin', UserMock);
        expect(Activity.prototype.save.callCount).is.equal(1);
      });
    });

    describe('oAuth event', () => {
      it('oAuth event should trigger an activity event', () => {
        SystemEvent.emit('oauth', UserMock);
        expect(Activity.prototype.save.callCount).is.equal(1);
      });
    });

    describe('Activate event', () => {
      it('Activate event should trigger an activity event', () => {
        SystemEvent.emit('activate', UserMock);
        expect(Activity.prototype.save.callCount).is.equal(1);
      });
    });

    describe('Reactivate event', () => {
      it('Reactivate event should trigger an activity event', () => {
        SystemEvent.emit('reactivate', UserMock);
        expect(Activity.prototype.save.callCount).is.equal(1);
      });
    });

    describe('Refresh event', () => {
      it('Refresh event should trigger an activity event', () => {
        SystemEvent.emit('refresh', UserMock);
        expect(Activity.prototype.save.callCount).is.equal(1);
      });
    });

    describe('Forgot event', () => {
      it('Forgot event should trigger an activity event', () => {
        SystemEvent.emit('forgot', UserMock);
        expect(Activity.prototype.save.callCount).is.equal(1);
      });
    });

    describe('Reset event', () => {
      it('Reset event should trigger an activity event', () => {
        SystemEvent.emit('reset', UserMock);
        expect(Activity.prototype.save.callCount).is.equal(1);
      });
    });
  });

  describe('Auth Helper Unit Tesst', () => {
    describe('Activation Mail test', () => {
      it('should sent mail to user', () => {
        AuthHelper.activationMail(UserMock);
        expect(mailer.sendMail.callCount).is.equal(1);
      });
    });

    describe('Activation Phone test', () => {
      it('should sent OTP sms to user', () => {
        AuthHelper.activationPhone(UserMock);
        expect(messenger.sendSms.callCount).is.equal(1);
      });
    });

    describe('Activated Mail test', () => {
      it('should sent activated success mail to user', () => {
        AuthHelper.activatedMail(UserMock);
        expect(mailer.sendMail.callCount).is.equal(1);
      });
    });

    describe('Forgot Mail test', () => {
      it('should sent forgot mail with reset token to user', () => {
        AuthHelper.forgotMail(UserMock);
        expect(mailer.sendMail.callCount).is.equal(1);
      });
    });
  });
});

