// @ts-check

/* eslint-disable import/order -- https://github.com/endojs/endo/issues/1235 */
import '@endo/init/pre-bundle-source.js';
import '@agoric/zoe/tools/prepare-test-env.js';
import { describe } from '../src/riteway.js';

import path from 'path';

import bundleSource from '@endo/bundle-source';

import { E } from '@endo/eventual-send';
import { makeZoeForTest } from '@agoric/zoe/tools/setup-zoe.js';
import { AmountMath } from '@agoric/ertp';

const filename = new URL(import.meta.url).pathname;
const dirname = path.dirname(filename);

const contractPath = `${dirname}/contract.js`;

describe('zoe - mint payments', async (assert) => {
  const zoe = makeZoeForTest();
  const bundle = await bundleSource(contractPath);
  const installation = E(zoe).install(bundle);

  const { creatorFacet, instance } = await E(zoe).startInstance(installation);

  // Alice makes an invitation for Bob that will give him 1000 tokens
  const invitation = E(creatorFacet).makeInvitation();

  // Bob makes an offer using the invitation
  const seat = E(zoe).offer(invitation);

  const paymentP = E(seat).getPayout('Token');

  // Let's get the tokenIssuer from the contract so we can evaluate
  // what we get as our payout
  const publicFacet = E(zoe).getPublicFacet(instance);
  const tokenIssuer = E(publicFacet).getTokenIssuer();
  const tokenBrand = await E(tokenIssuer).getBrand();

  const tokens1000 = AmountMath.make(tokenBrand, 1000n);
  const tokenPayoutAmount = await E(tokenIssuer).getAmountOf(paymentP);

  assert({
    unitLabel: `Bob's fungible faucet seat`,
    given: `.getPayout('token')`,
    should: 'return an Payment with the correct brand',
    actual: tokenPayoutAmount.brand,
    expected: await E(tokenIssuer).getBrand(),
  });

  assert({
    unitLabel: `Bob's fungible faucet seat`,
    given: `.getPayout('token')`,
    should: 'return a Payment with the correct value',
    actual: tokenPayoutAmount.value,
    expected: 1000n,
  });
});
