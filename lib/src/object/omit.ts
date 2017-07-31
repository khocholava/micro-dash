import {clone} from '../lang/clone';

/**
 * The opposite of `pick`; this method creates an object composed of the own enumerable string properties of object that are not omitted.
 *
 * Differences from lodash:
 * - `paths` must be direct keys of `object` (they cannot refer to deeper properties)
 */
export function omit<T extends object | null | undefined>(
  object: T, ...paths: Array<keyof T>,
): Partial<T> {
  const obj: any = clone(object) || {};
  for (const path of paths) {
    delete obj[path];
  }
  return obj;
}
