// PROVENANCE: bot=codex session=2026-10-09 task=positive instruction language cleanup

export class IChingCalcBlocked extends Error {
  constructor() {
    super(
      'I Ching calculation requires a cast with a question, method, and six lines. Intake currently collects birth information.',
    );
    this.name = 'IChingCalcBlocked';
  }
}

export function calculateIChing(): never {
  throw new IChingCalcBlocked();
}
