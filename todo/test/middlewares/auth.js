const expect = require('chai').expect;
const sinon = require('sinon');
const HttpStatus = require('http-status-codes');
const httpMocks = require('node-mocks-http');
const jwt = require('jsonwebtoken');
const { authenticate } = require('../../middlewares/auth');

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

    it('should respond fail if the provided token is invalid', () => {
      const req = httpMocks.createRequest({
        headers: { authorization: 'Bearer abc' }
      });
      const res = httpMocks.createResponse();
      const nextSpy = sandbox.spy();
      const statusSpy = sandbox.spy(res, 'status');
      const verifyStub = sandbox
        .stub(jwt, 'verify')
        .callsFake((token, secret, callback) => {
          callback(new Error(), null);
        });

      authenticate(req, res, nextSpy);

      expect(verifyStub.calledOnce).to.be.true;
      expect(verifyStub.calledWith('abc')).to.be.true;
      expect(statusSpy.calledWith(HttpStatus.UNAUTHORIZED)).to.be.true;
      expect(statusSpy.calledOnce).to.be.true;
      expect(nextSpy.notCalled).to.be.true;
    });

    it('should call next() if the provided token is valid', () => {
      const req = httpMocks.createRequest({
        headers: { authorization: 'Bearer abc' }
      });
      const res = httpMocks.createResponse();
      const nextSpy = sandbox.spy();
      const statusSpy = sandbox.spy(res, 'status');
      const verifyStub = sandbox
        .stub(jwt, 'verify')
        .callsFake((token, secret, callback) => {
          callback(null, { username: 'tada' });
        });

      authenticate(req, res, nextSpy);

      expect(verifyStub.calledOnce).to.be.true;
      expect(verifyStub.calledWith('abc')).to.be.true;
      expect(statusSpy.notCalled).to.be.true;
      expect(nextSpy.calledOnce).to.be.true;
      expect(req.username).to.be.equal('tada');
    });
  });
});
