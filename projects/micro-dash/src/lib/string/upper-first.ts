import { Nil } from '../interfaces';

/**
 * Converts the first character of `string` to upper case.
 *
 * Contribution to minified bundle size, when it is the only function imported:
 * - Lodash: 1,951 bytes
 * - Micro-dash: 63 bytes
 */
// tslint:disable-next-line:variable-name
export function upperFirst(string: string | Nil): string {
  return string ? string.charAt(0).toUpperCase() + string.slice(1) : '';
}
