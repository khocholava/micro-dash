import { upperFirst } from './upper-first';

describe('upperFirst()', () => {
  //
  // stolen from https://github.com/lodash/lodash
  //

  it('should uppercase only the first character', () => {
    expect(upperFirst('fred')).toBe('Fred');
    expect(upperFirst('Fred')).toBe('Fred');
    expect(upperFirst('FRED')).toBe('FRED');
  });

  it('should return an empty string for empty values', () => {
    expect(upperFirst(null)).toBe('');
    expect(upperFirst(undefined)).toBe('');
    expect(upperFirst('')).toBe('');
  });
});
