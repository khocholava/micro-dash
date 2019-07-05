import { stub } from "sinon";
import { isString } from "../lang";
import { pickBy } from "./pick-by";

describe("pickBy()", () => {
  it("fancily narrows types", () => {
    let pickedFromObject: { b: string };
    pickedFromObject = pickBy({ a: 1, b: "b", c: { d: 3 } }, isString);
    expect(pickedFromObject).toEqual({ b: "b" });
  });

  // lodash's test (and behavior) is the opposite
  it("does not treat sparse arrays as dense", () => {
    const array = [1];
    array[2] = 3;
    const logger = stub();

    pickBy(array, logger);

    expect(logger.args).toEqual([[1, "0"], [3, "2"], [3, "length"]]);
  });

  // lodash's test for `pick`, but not `pickBy`, even though the behavior is the same
  it("should return an empty object when `object` is nullish", () => {
    expect(pickBy(null, () => true)).toEqual({});
    expect(pickBy(undefined, () => false)).toEqual({});
  });

  //
  // stolen from https://github.com/lodash/lodash
  //

  it("should provide correct iteratee arguments", () => {
    const logger = stub();

    pickBy([1, 2, 3], logger);

    expect(logger.args).toEqual([[1, "0"], [2, "1"], [3, "2"], [3, "length"]]);
  });

  it("should ignore added `object` properties", () => {
    const object: any = { a: 1 };
    const spy = jasmine.createSpy().and.callFake(() => {
      object.b = 2;
      return true;
    });

    pickBy(object, spy);

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("should create an object of picked string keyed properties", () => {
    const object = { a: 1, b: 2, c: 3, d: 4 };

    expect(pickBy(object, (_item, key) => key === "a")).toEqual({ a: 1 });
  });

  it("should work with an array `object`", () => {
    const array = [1, 2, 3];
    expect(pickBy(array, (_item, key) => key === "1")).toEqual({ 1: 2 });
  });
});
