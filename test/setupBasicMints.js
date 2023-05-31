import { makeIssuerKit, AmountMath } from '@agoric/ertp';
import { makeScalarMapStore } from '@agoric/store';
import { makeZoeKit } from '@agoric/zoe/src/zoeService/zoe.js';
import { makeFakeVatAdmin } from '@agoric/zoe/tools/fakeVatAdmin.js';

export const setup = () => {
  const istKit = makeIssuerKit('IST');

  const moolaKit = makeIssuerKit('moola');
  const simoleanKit = makeIssuerKit('simoleans');
  const bucksKit = makeIssuerKit('bucks');
  const atomsKit = makeIssuerKit('atoms');
  const allIssuerKits = {
    moola: moolaKit,
    simoleans: simoleanKit,
    bucks: bucksKit,
    atoms: atomsKit,
    ist: istKit,
  };
  /** @type {MapStore<string, Brand<'nat'>>} */
  const brands = makeScalarMapStore('brandName');

  for (const k of Object.getOwnPropertyNames(allIssuerKits)) {
    brands.init(k, allIssuerKits[k].brand);
  }

  const { admin: fakeVatAdmin, vatAdminState } = makeFakeVatAdmin();
  const { zoeService: zoe } = makeZoeKit(fakeVatAdmin);

  /** @type {<K extends AssetKind>(brand: Brand<K>) => (value: any) => Amount<K>} */
  const makeSimpleMake = (brand) => (value) => AmountMath.make(brand, value);

  /** @param {Amount} amount */
  const inspectAmount = (amount = AmountMath.make(bucksKit.brand, 0n)) =>
    amount.value.toString();

  const result = {
    atomsIssuer: atomsKit.issuer,
    atomsBrand: atomsKit.brand,
    atomsKit,
    moolaIssuer: moolaKit.issuer,
    moolaMint: moolaKit.mint,
    moolaKit,
    simoleanIssuer: simoleanKit.issuer,
    simoleanMint: simoleanKit.mint,
    simoleanKit,
    bucksIssuer: bucksKit.issuer,
    bucksMint: bucksKit.mint,
    bucksKit,
    brands,
    moola: makeSimpleMake(moolaKit.brand),
    simoleans: makeSimpleMake(simoleanKit.brand),
    bucks: makeSimpleMake(bucksKit.brand),
    atoms: makeSimpleMake(atomsKit.brand),
    ist: makeSimpleMake(istKit.brand),
    istIssuer: istKit.issuer,
    istBrand: istKit.brand,
    zoe,
    vatAdminState,
    inspectAmount,
  };
  harden(result);
  return result;
};
harden(setup);
