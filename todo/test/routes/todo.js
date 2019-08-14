const request = require('supertest');
const HttpStatus = require('http-status-codes');
const expect = require('chai').expect;
const app = require('../../app');
const ToDo = require('../../models/todo');
const { query, resetDatabase } = require('../utils');
const sinon = require('sinon');
const db = require('../../database/index');
const jwt = require('jsonwebtoken');

const sandbox = sinon.createSandbox();

describe('Todo', () => {
  const username = 'kudo';
  const token = 'token';

  before(() => {
    return resetDatabase().then(() =>
      sinon.stub(jwt, 'verify').callsFake((token, secret, callback) => {
        callback(null, { username: username });
      })
    );
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('GET /todo', () => {
    it('should return empty data', () => {
      return request(app)
        .get('/todo')
        .set('Authorization', 'Bearer ' + token)
        .send()
        .expect(HttpStatus.OK)
        .then(({ body }) => {
          expect(body).to.have.property('data');
          expect(body.data).to.be.empty;
        });
    });

    it('should return the same number of items as the provided limit value', () => {
      return Promise.all(
        Array.from(Array(20), (val, idx) => idx + 1).map(x =>
          ToDo.create(username, x)
        )
      ).then(() =>
        request(app)
          .get('/todo')
          .set('Authorization', 'Bearer ' + token)
          .query({ limit: 5, offset: 0 })
          .send()
          .expect(HttpStatus.OK)
          .then(({ body }) => {
            expect(body.data.length).to.be.equal(5);
          })
      );
    });

    it('should respond internal server error when querying db is not successful', () => {
      const queryStub = sandbox.stub(db, 'query').rejects();

      return request(app)
        .get('/todo')
        .set('Authorization', 'Bearer ' + token)
        .query({ limit: 5, offset: 0 })
        .send()
        .expect(HttpStatus.INTERNAL_SERVER_ERROR)
        .then(() => {
          expect(queryStub.calledOnce).to.be.true;
        });
    });
  });

  describe('POST /todo', () => {
    it('should return fail when title is null', () => {
      return request(app)
        .post('/todo')
        .set('Authorization', 'Bearer ' + token)
        .send()
        .expect(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should return fail when title is empty', () => {
      return request(app)
        .post('/todo')
        .set('Authorization', 'Bearer ' + token)
        .send({ title: '' })
        .expect(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should return success', async () => {
      await request(app)
        .post('/todo')
        .set('Authorization', 'Bearer ' + token)
        .send({ title: 'This is a title' })
        .expect(HttpStatus.CREATED);

      const [rows, fields] = await query(
        "SELECT * FROM todo WHERE title='This is a title'"
      );
      expect(rows.length).to.be.equal(1);
    });

    it('should respond internal server error when querying db is not successful', () => {
      const queryStub = sandbox.stub(db, 'query').rejects();

      return request(app)
        .post('/todo')
        .set('Authorization', 'Bearer ' + token)
        .send({ title: 'This is a title' })
        .expect(HttpStatus.INTERNAL_SERVER_ERROR)
        .then(() => {
          expect(queryStub.calledOnce).to.be.true;
        });
    });
  });

  describe('PUT /todo/:id', () => {
    it('should return fail when title is null', () => {
      return request(app)
        .put('/todo/1')
        .set('Authorization', 'Bearer ' + token)
        .expect(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should return fail when title is empty', () => {
      return request(app)
        .put('/todo/1')
        .set('Authorization', 'Bearer ' + token)
        .send({ title: '' })
        .expect(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should return fail when done is null', () => {
      return request(app)
        .put('/todo/1')
        .set('Authorization', 'Bearer ' + token)
        .send({ title: 'Title' })
        .expect(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should return success', async () => {
      await request(app)
        .put('/todo/1')
        .set('Authorization', 'Bearer ' + token)
        .send({ title: 'Title', done: true })
        .expect(HttpStatus.OK);

      const [rows, fields] = await query('SELECT * FROM todo WHERE id=1');
      expect(rows[0].title).to.be.equal('Title');
      expect(rows[0].done[0]).to.be.equal(1);
    });

    it('should respond internal server error when querying db is not successful', () => {
      const queryStub = sandbox.stub(db, 'query').rejects();

      return request(app)
        .put('/todo/1')
        .set('Authorization', 'Bearer ' + token)
        .send({ title: 'Title', done: true })
        .expect(HttpStatus.INTERNAL_SERVER_ERROR)
        .then(() => {
          expect(queryStub.calledOnce).to.be.true;
        });
    });
  });

  describe('DELETE /todo/:id', () => {
    it('should return success', async () => {
      await request(app)
        .delete('/todo/1')
        .set('Authorization', 'Bearer ' + token)
        .send()
        .expect(HttpStatus.OK);

      const [rows, fields] = await query('SELECT * FROM todo WHERE id=1');
      expect(rows).to.be.empty;
    });

    it('should respond internal server error when querying db is not successful', () => {
      const queryStub = sandbox.stub(db, 'query').rejects();

      return request(app)
        .delete('/todo/1')
        .set('Authorization', 'Bearer ' + token)
        .send()
        .expect(HttpStatus.INTERNAL_SERVER_ERROR)
        .then(() => {
          expect(queryStub.calledOnce).to.be.true;
        });
    });
  });

  after(() => {
    db.end();
  });
});
