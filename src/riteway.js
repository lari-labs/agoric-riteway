import '@endo/init/pre-bundle-source.js';
import '@agoric/zoe/tools/prepare-test-env.js';
import test from 'ava';

// eslint-disable-next-line no-new-func
const noop = new Function();
const isPromise = (x) => x && typeof x.then === 'function';
const requiredKeys = ['given', 'should', 'actual', 'expected'];
const concatToString = (keys, key, index) => keys + (index ? ', ' : '') + key;

const withRiteway = (TestFunction) => (t) => {
  const assert = (args = {}) => {
    const missing = requiredKeys.filter((k) => !Object.keys(args).includes(k));
    if (missing.length) {
      throw new Error(
        `The following parameters are required by \`assert\`: ${missing.reduce(
          concatToString,
          '',
        )}`,
      );
    }

    const {
      given,
      should,
      actual,
      expected,
      fn = 'deepEqual',
      unitLabel,
    } = args;

    const makeUnitLabel = !unitLabel
      ? ''
      : `code unit:: ${unitLabel}`.concat('\n ----------');

    t[fn](
      actual,
      expected,
      makeUnitLabel.concat('\n', `given ${given}`, '\n', `should ${should}`),
    );
  };

  const end = () => 'test ended.';
  const result = TestFunction(assert, end);

  if (isPromise(result)) return result.then(end);
};

const withTestSuite =
  (testSuite) =>
  (unit = '', TestFunction = noop) =>
    testSuite(unit, withRiteway(TestFunction));

const withAva = withTestSuite(test);

const describe = Object.assign(withAva, {
  is: withTestSuite(test).is,
  throws: withTestSuite(test).throws,
  // before: withTestSuite(test.before)
});

const catchAndReturn = (x) => x.catch((x) => x);
const catchPromise = (x) => (isPromise(x) ? catchAndReturn(x) : x);

const Try = (fn = noop, ...args) => {
  try {
    return catchPromise(fn(...args));
  } catch (err) {
    return err;
  }
};

const countKeys = (obj = {}) => Object.keys(obj).length;

export { describe, Try, countKeys };
