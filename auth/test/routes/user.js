const request = require('supertest');
const app = require('../../app');
const HttpStatus = require('http-status-codes');
const User = require('../../models/user');
const expect = require('chai').expect;
const { resetDatabase } = require('../utils');
const sinon = require('sinon');
const sequelize = require('../../database/sequelize');

const sandbox = sinon.createSandbox();

describe('User', () => {
  before(() => {
    return resetDatabase();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('POST /user', () => {
    it('should respond fail when the username and password are not present', () => {
      return request(app)
        .post('/user')
        .expect(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should respond fail when the username is not present', () => {
      return request(app)
        .post('/user')
        .send({ password: 'abcabc' })
        .expect(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should respond fail when the password is not present', () => {
      return request(app)
        .post('/user')
        .send({ username: 'abcxyz' })
        .expect(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should respond fail when the username or password is not valid', () => {
      return request(app)
        .post('/user')
        .send({ username: 'abc', password: 'abc' })
        .expect(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should respond success', () => {
      return request(app)
        .post('/user')
        .send({ username: 'abcabc', password: 'abc123' })
        .expect(HttpStatus.CREATED);
    });

    it('should respond username conflict', () => {
      return request(app)
        .post('/user')
        .send({ username: 'abcabc', password: 'abc123' })
        .expect(HttpStatus.CONFLICT);
    });

    it('should respond internal server error when querying db is not successful', () => {
      const queryStub = sandbox.stub(User, 'create').rejects();

      return request(app)
        .post('/user')
        .send({ username: 'abcabcabc', password: 'abc123' })
        .expect(HttpStatus.INTERNAL_SERVER_ERROR)
        .then(() => {
          expect(queryStub.calledOnce).to.be.true;
        });
    });
  });

  describe('POST /user/auth', () => {
    it('should respond fail when the username and password are not present', () => {
      return request(app)
        .post('/user/auth')
        .expect(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should respond fail when the username is not present', () => {
      return request(app)
        .post('/user/auth')
        .send({ password: 'abcabc' })
        .expect(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should respond fail when the password is not present', () => {
      return request(app)
        .post('/user/auth')
        .send({ username: 'abcxyz' })
        .expect(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should respond fail when the username or password is not valid', () => {
      return request(app)
        .post('/user/auth')
        .send({ username: 'abc', password: 'abc' })
        .expect(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should respond success', () => {
      return request(app)
        .post('/user/auth')
        .send({ username: 'abcabc', password: 'abc123' })
        .expect(HttpStatus.OK)
        .expect('Content-Type', /json/)
        .then(({ body }) => {
          expect(body).to.have.property('token');
          expect(body.token).to.be.a('string');
          expect(body.token).to.not.equal(null);
          expect(body.token).to.not.equal('');
        });
    });

    it('should respond fail when the password is mismatch', () => {
      return request(app)
        .post('/user/auth')
        .send({ username: 'abcabc', password: 'abc123123' })
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should respond fail when the username does not exist', () => {
      return request(app)
        .post('/user/auth')
        .send({ username: 'abcabc123', password: 'abc123123' })
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should respond internal server error when querying db is not successful', () => {
      const queryStub = sandbox.stub(User, 'authenticate').rejects();

      return request(app)
        .post('/user/auth')
        .send({ username: 'abcabc123', password: 'abc123123' })
        .expect(HttpStatus.INTERNAL_SERVER_ERROR)
        .then(() => {
          expect(queryStub.calledOnce).to.be.true;
        });
    });
  });

  after(() => {
    sequelize.close();
  });
});
