import { matches } from 'lodash-es';
import { expectCallsAndReset, expectSingleCallAndReset } from 's-ng-dev-utils';
import { find } from './find';

describe('find()', () => {
  //
  // stolen from https://github.com/lodash/lodash
  //

  const objects = [
    { a: 0, b: 0 },
    { a: 1, b: 1 },
    { a: 2, b: 2 },
  ];

  it('should return the found value', () => {
    expect(find(objects, (object) => !!object.a)).toBe(objects[1]);
  });

  it('should return `undefined` if value is not found', () => {
    expect(find(objects, (object) => object.a === 3)).toBe(undefined);
  });

  it('should return `undefined` for empty collections', () => {
    expect(find({}, matches({ a: 3 }))).toBe(undefined);
    expect(find([], matches({ a: 3 }))).toBe(undefined);
    expect(find(false, matches({ a: 3 }))).toBe(undefined);
    expect(find(0, matches({ a: 3 }))).toBe(undefined);
    expect(find('', matches({ a: 3 }))).toBe(undefined);
    expect(find(null, matches({ a: 3 }))).toBe(undefined);
    expect(find(undefined, matches({ a: 3 }))).toBe(undefined);
    expect(find(NaN, matches({ a: 3 }))).toBe(undefined);
  });

  it('should provide correct `predicate` arguments for arrays', () => {
    const spy = jasmine.createSpy();
    find(['a'], spy);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('a', 0);
  });

  it('should work with an object for `collection`', () => {
    expect(find({ a: 1, b: 2, c: 3 }, (n) => n < 3)).toBe(1);
  });

  it('should provide correct `predicate` arguments for objects', () => {
    const spy = jasmine.createSpy();
    find({ a: 1 }, spy);
    expectSingleCallAndReset(spy, 1, 'a');
  });

  it('should work with an array and a positive `fromIndex`', () => {
    const array = [1, 2, 3];
    expect(find(array, (n) => n === 3, 2)).toBe(3);
    expect(find(array, (n) => n === 2, 2)).toBe(undefined);
  });

  it('should work with an array and a `fromIndex` >= `length`', () => {
    const array = [1, 2, 3];
    for (const key of [1, undefined, '']) {
      for (const fromIndex of [4, 6, 2 ** 32, Infinity]) {
        expect(find(array, (n) => Object.is(n, key), fromIndex)).toBe(
          undefined,
        );
      }
    }
  });

  it('should work with an array and coerce `fromIndex` to an integer', () => {
    const array = [1, 2, 3];
    expect(find(array, (n) => n === 1, 0.1)).toBe(1);
    expect(find(array, (n) => n === 1, NaN)).toBe(1);
  });

  it('should work with an array and a negative `fromIndex`', () => {
    const array = [1, 2, 3];
    expect(find(array, (n) => n === 3, -1)).toBe(3);
    expect(find(array, (n) => n === 2, -1)).toBe(undefined);
  });

  it('should work with an array and a negative `fromIndex` <= `-length`', () => {
    const array = [1, 2, 3];
    for (const fromIndex of [-4, -6, -Infinity]) {
      expect(find(array, (n) => n === 1, fromIndex)).toBe(1);
    }
  });

  it('should provide correct iteratee arguments', () => {
    const spy = jasmine.createSpy();
    find([1, 2, 3], spy);
    expect(spy.calls.first().args).toEqual([1, 0]);
  });

  it('should treat sparse arrays as dense', () => {
    const array = [1];
    array[2] = 3;
    const spy = jasmine.createSpy();

    find(array, spy);

    expectCallsAndReset(spy, [1, 0], [undefined, 1], [3, 2]);
  });

  it('should not iterate custom properties of arrays', () => {
    const array = [1];
    (array as any).a = 1;
    const spy = jasmine.createSpy();

    find(array, spy);

    expectCallsAndReset(spy, [1, 0]);
  });

  it('iterates over own string keyed properties of objects', () => {
    const object = { a: 1 };
    const spy = jasmine.createSpy();

    find(object, spy);

    expectCallsAndReset(spy, [1, 'a']);
  });

  it('should ignore changes to `length`', () => {
    const array = [1];
    const spy = jasmine.createSpy().and.callFake(() => {
      array.push(2);
      return false;
    });

    find(array, spy);

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should ignore added `object` properties', () => {
    const object: any = { a: 1 };
    const spy = jasmine.createSpy().and.callFake(() => {
      object.b = 2;
      return false;
    });

    find(object, spy);

    expect(spy).toHaveBeenCalledTimes(1);
  });
});
