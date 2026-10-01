// Wheel: @csessh/sochumenh@0.3.0 (MIT) https://github.com/agentics-vn/sochumenh-npm
// Call: parseDob + the package's numeric calculators (lifePath, expression, and the rest of its calc exports).
// Input: name plus birthDate "YYYY-MM-DD", reformatted to the package's DD-MM-YYYY parseDob.
// Output: { value, karmicDebtHits } from those functions. interpretationsVi is not returned.

import {
  accessibilityAttitude,
  accessibilityCapacity,
  accessibilityMotivation,
  adversityResilience,
  attitude,
  balance,
  birthDay,
  expression,
  expressionChallenge,
  hiddenPassion,
  lifePath,
  maturity,
  maturityCapacity,
  missingNumber,
  parseDob,
  personality,
  personalityChallenge,
  soulChallenge,
  soulUrge,
  thinkingCapacity,
  validateName,
  type DateOfBirth,
} from '@csessh/sochumenh';

export type NumerologyCalcInput = {
  name: string;
  birthDate: string;
};

export type NumerologyNumber = {
  value: number;
  karmicDebtHits: number[];
};

export type NumerologyCalcResult = {
  package: '@csessh/sochumenh';
  version: '0.3.0';
  dob: DateOfBirth;
  nameAccepted: boolean;
  lifePath: NumerologyNumber;
  birthDay: NumerologyNumber;
  attitude: NumerologyNumber;
  expression?: NumerologyNumber;
  soulUrge?: NumerologyNumber;
  personality?: NumerologyNumber;
  expressionChallenge?: NumerologyNumber;
  soulChallenge?: NumerologyNumber;
  personalityChallenge?: NumerologyNumber;
  adversityResilience?: NumerologyNumber;
  thinkingCapacity?: NumerologyNumber;
  maturity?: NumerologyNumber;
  maturityCapacity?: NumerologyNumber;
  hiddenPassion?: NumerologyNumber;
  balance?: NumerologyNumber;
  accessibilityCapacity?: NumerologyNumber;
  accessibilityMotivation?: NumerologyNumber;
  accessibilityAttitude?: NumerologyNumber;
  missingNumber?: string;
};

export function calculateNumerology(input: NumerologyCalcInput): NumerologyCalcResult {
  const date = /^(\d{4})-(\d{2})-(\d{2})$/.exec(input.birthDate);
  if (!date) throw new Error('Numerology requires birthDate YYYY-MM-DD.');
  const dob = parseDob(`${date[3]}-${date[2]}-${date[1]}`);
  if (!dob) throw new Error('Numerology birthDate was rejected by parseDob.');
  const result: NumerologyCalcResult = {
    package: '@csessh/sochumenh',
    version: '0.3.0',
    dob,
    nameAccepted: validateName(input.name),
    lifePath: lifePath(dob),
    birthDay: birthDay(dob),
    attitude: attitude(dob),
  };
  if (!result.nameAccepted) return result;
  const name = input.name;
  return {
    ...result,
    expression: expression(name),
    soulUrge: soulUrge(name),
    personality: personality(name),
    expressionChallenge: expressionChallenge(name),
    soulChallenge: soulChallenge(name),
    personalityChallenge: personalityChallenge(name),
    adversityResilience: adversityResilience(name),
    thinkingCapacity: thinkingCapacity(dob, name),
    maturity: maturity(name, dob),
    maturityCapacity: maturityCapacity(name, dob),
    hiddenPassion: hiddenPassion(name),
    balance: balance(name),
    accessibilityCapacity: accessibilityCapacity(name),
    accessibilityMotivation: accessibilityMotivation(name),
    accessibilityAttitude: accessibilityAttitude(name),
    missingNumber: missingNumber(name),
  };
}
