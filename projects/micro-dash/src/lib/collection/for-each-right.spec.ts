import { noop } from 'lodash';
import { expectCallsAndReset } from 's-ng-dev-utils';
import { stub } from 'sinon';
import { forEachRight } from './for-each-right';

describe('forEachRight()', () => {
  it('works for null & undefined', () => {
    const spy = jasmine.createSpy();
    forEachRight(null, spy);
    forEachRight(undefined, spy);
    expect(spy).not.toHaveBeenCalled();
  });

  //
  // stolen from https://github.com/lodash/lodash
  //

  it('can exit early when iterating arrays', () => {
    const logger = stub();
    logger.onCall(1).returns(true);
    logger.onCall(2).returns(false);

    forEachRight([1, 2, 3, 4], logger);

    expect(logger.args).toEqual([
      [4, 3],
      [3, 2],
      [2, 1],
    ]);
  });

  it('can exit early when iterating objects', () => {
    const logger = stub();
    logger.onCall(1).returns(true);
    logger.onCall(2).returns(false);

    forEachRight({ a: 1, b: 2, c: 3, d: 4 }, logger);

    expect(logger.args).toEqual([
      [4, 'd'],
      [3, 'c'],
      [2, 'b'],
    ]);
  });

  it('should provide correct iteratee arguments', () => {
    const spy = jasmine.createSpy();
    forEachRight([1, 2, 3], spy);
    expect(spy.calls.first().args).toEqual([3, 2]);
  });

  it('should treat sparse arrays as dense', () => {
    const array = [1];
    array[2] = 3;
    const spy = jasmine.createSpy();

    forEachRight(array, spy);

    expectCallsAndReset(spy, [3, 2], [undefined, 1], [1, 0]);
  });

  it('should not iterate custom properties', () => {
    const array = [1];
    (array as any).a = 1;
    const logger = stub();

    forEachRight(array, logger);

    expect(logger.args).toEqual([[1, 0]]);
  });

  it('iterates over own string keyed properties of objects', () => {
    const object = { a: 1 };
    const spy = jasmine.createSpy();

    forEachRight(object, spy);

    expectCallsAndReset(spy, [1, 'a']);
  });

  it('should return the collection', () => {
    const array = [1, 2, 3];

    expect(forEachRight(array, noop)).toBe(array);
  });

  it('should ignore changes to `length`', () => {
    const array = [1];
    const spy = jasmine.createSpy().and.callFake(() => {
      array.push(2);
      return true;
    });

    forEachRight(array, spy);

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should ignore added `object` properties', () => {
    const object: any = { a: 1 };
    const spy = jasmine.createSpy().and.callFake(() => {
      object.b = 2;
      return true;
    });

    forEachRight(object, spy);

    expect(spy).toHaveBeenCalledTimes(1);
  });
});
