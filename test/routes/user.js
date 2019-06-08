const dotenv = require('dotenv');
dotenv.config({ path: '.env.test' });

const request = require('supertest');
const app = require('../../app');
const HttpStatus = require('http-status-codes');
const db = require('../../database/index');
const expect = require('chai').expect;
const { resetDatabase } = require('../utils');

describe('User', () => {
  before(() => {
    return resetDatabase();
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
  });

  after(() => {
    db.end();
  });
});
