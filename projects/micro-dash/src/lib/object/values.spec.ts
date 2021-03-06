import { values } from './values';

describe('values()', () => {
  it('works for null & undefined', () => {
    expect(values(null)).toEqual([]);
    expect(values(undefined)).toEqual([]);
  });

  it('does not consider `length` for an array', () => {
    expect(values([1, 2, 3]).sort()).toEqual([1, 2, 3]);
  });

  //
  // stolen from https://github.com/lodash/lodash
  //

  it('should get string keyed values of `object`', () => {
    expect(values({ a: 1, b: 2 }).sort()).toEqual([1, 2]);
  });

  it('should work with an object that has a `length` property', () => {
    expect(values({ 0: 'a', 1: 'b', length: 2 }).sort()).toEqual([2, 'a', 'b']);
  });

  it('should not include inherited string keyed property values', () => {
    function Foo(this: any): void {
      this.a = 1;
    }

    Foo.prototype.b = 2;

    expect(values(new (Foo as any)())).toEqual([1]);
  });
});
