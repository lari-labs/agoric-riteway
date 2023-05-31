import { describe, countKeys } from '../src/riteway.js';
import { makeZoeKitForTest } from '@agoric/zoe/tools/setup-zoe.js';

describe('makeZoeKitForTest', async (assert) => {
  const testZoeKit = makeZoeKitForTest();
  assert({
    given: 'no arguments',
    should: 'contain the correct number of properties.',
    actual: countKeys(testZoeKit),
    expected: 3,
  });

  assert({
    given: 'no arguments',
    should: 'contain setVatAdminService.',
    actual: !testZoeKit.setVatAdminService === false,
    expected: true,
  });

  assert({
    given: 'no arguments',
    should: 'contain zoeService.',
    actual: !testZoeKit.zoeService === false,
    expected: true,
  });

  assert({
    given: 'no arguments',
    should: 'contain feeMintAccess.',
    actual: !testZoeKit.feeMintAccess === false,
    expected: true,
  });
});
