const expect = require('chai').expect;
const sinon = require('sinon');
const HttpStatus = require('http-status-codes');
const httpMocks = require('node-mocks-http');
const { authenticate } = require('../../middlewares/auth');
const axios = require('axios');

const sandbox = sinon.createSandbox();

describe('Authenticate middleware', () => {
  afterEach(() => {
    sandbox.restore();
  });

  describe('middleware declaration', () => {
    it('should be a function()', () => {
      expect(authenticate).to.be.a('function');
    });

    it('should accept three arguments', () => {
      expect(authenticate.length).to.be.equal(3);
    });
  });

  describe('request handler', () => {
    it('should respond fail if authorization value does not exist in the header', () => {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      const nextSpy = sandbox.spy();
      const statusSpy = sandbox.spy(res, 'status');

      authenticate(req, res, nextSpy);

      expect(statusSpy.calledWith(HttpStatus.UNAUTHORIZED)).to.be.true;
      expect(statusSpy.calledOnce).to.be.true;
      expect(nextSpy.notCalled).to.be.true;
    });

    it('should respond fail if authorization value does not start with Bearer', () => {
      const req = httpMocks.createRequest({
        headers: { authorization: 'Halo' }
      });
      const res = httpMocks.createResponse();
      const nextSpy = sandbox.spy();
      const statusSpy = sandbox.spy(res, 'status');

      authenticate(req, res, nextSpy);

      expect(statusSpy.calledWith(HttpStatus.UNAUTHORIZED)).to.be.true;
      expect(statusSpy.calledOnce).to.be.true;
      expect(nextSpy.notCalled).to.be.true;
    });

    it('should respond fail if the provided token is invalid', done => {
      const req = httpMocks.createRequest({
        headers: { authorization: 'Bearer abc' }
      });
      const res = httpMocks.createResponse();
      const nextSpy = sandbox.spy();
      const statusSpy = sandbox.spy(res, 'sendStatus');
      const postStub = sandbox
        .stub(axios, 'post')
        .rejects({ response: { status: HttpStatus.UNAUTHORIZED } });

      authenticate(req, res, nextSpy);

      setTimeout(() => {
        expect(postStub.calledOnce).to.be.true;
        expect(postStub.args[0][1].token).to.be.equal('abc');
        expect(statusSpy.calledWith(HttpStatus.UNAUTHORIZED)).to.be.true;
        expect(statusSpy.calledOnce).to.be.true;
        expect(nextSpy.notCalled).to.be.true;
        done();
      }, 0);
    });

    it('should call next() if the provided token is valid', done => {
      const req = httpMocks.createRequest({
        headers: { authorization: 'Bearer abc' }
      });
      const res = httpMocks.createResponse();
      const nextSpy = sandbox.spy();
      const statusSpy = sandbox.spy(res, 'status');
      const postStub = sandbox
        .stub(axios, 'post')
        .resolves({ data: { username: 'tada' } });

      authenticate(req, res, nextSpy);

      setTimeout(() => {
        expect(postStub.calledOnce).to.be.true;
        expect(postStub.args[0][1].token).to.be.equal('abc');
        expect(statusSpy.notCalled).to.be.true;
        expect(nextSpy.calledOnce).to.be.true;
        expect(req.username).to.be.equal('tada');
        done();
      }, 0);
    });
  });
});
