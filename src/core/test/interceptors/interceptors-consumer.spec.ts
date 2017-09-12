import * as sinon from 'sinon';
import { expect } from 'chai';
import { Observable } from 'rxjs/Observable';
import { InterceptorsConsumer } from '../../interceptors/interceptors-consumer';
import 'rxjs/add/observable/of';

describe('InterceptorsConsumer', () => {
    let consumer: InterceptorsConsumer;
    let interceptors: any[];
    beforeEach(() => {
        consumer = new InterceptorsConsumer();
        interceptors = [{
          intercept: sinon.stub().returns(Observable.of(true)),
        }, {
          intercept: sinon.stub().returns(Observable.of(true)),
        }];
    });
    describe('intercept', () => {
        describe('when interceptors array is empty', () => {
          let next: sinon.SinonSpy;
          beforeEach(() => {
            next = sinon.spy();
          });
          it('should call next()', async () => {
              await consumer.intercept([], null, { constructor: null }, null, next);
              expect(next.calledOnce).to.be.true;
          });
        });
        describe('when interceptors array is not empty', () => {
          let next: sinon.SinonSpy;
          beforeEach(() => {
            next = sinon.spy();
          });
          it('should call every `intercept` method', async () => {
              await consumer.intercept(interceptors, null, { constructor: null }, null, next);

              expect(interceptors[0].intercept.calledOnce).to.be.true;
              expect(interceptors[1].intercept.calledOnce).to.be.true;
          });
          it('should not call `next` (lazy evaluation)', async () => {
            await consumer.intercept(interceptors, null, { constructor: null }, null, next);
            expect(next.called).to.be.false;
          });
        });
    });
    describe('createContext', () => {
        it('should returns execution context object', () => {
          const instance = { constructor: {}};
          const callback = () => null;
          const context = consumer.createContext(instance, callback);

          expect(context).to.be.eql({
            parent: instance.constructor,
            handler: callback,
          });
        });
    });
});