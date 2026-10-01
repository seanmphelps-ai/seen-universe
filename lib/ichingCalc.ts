// No I Ching calculation package is wired.
// Intake has no cast. The 2026-09-24 modality audit says no birth-date-to-hexagram
// mapping is specified. i-ching@0.3.5 ask() does not replay a question.
// @iching/core is not on npm. sitnin/iching is a native He Luo Li Shu birth addon
// and is not the cast that audit asks for. This function fails closed.

export class IChingCalcBlocked extends Error {
  constructor() {
    super(
      'I Ching hexagram is not calculated. No cast is on intake, and no birth-date hexagram package is called.',
    );
    this.name = 'IChingCalcBlocked';
  }
}

export function calculateIChing(): never {
  throw new IChingCalcBlocked();
}
