export type ValuesIntegrityObservation = {
  statedValue: string;
  behavior: string;
  inconvenience?: string;
  exception?: string;
};

export type ValuesIntegritySignal = {
  statedValue: string;
  preservedUnderPressure: boolean;
  pressure: string | null;
  contradiction: string | null;
  reflection: string;
};

export function evaluateValuesUnderPressure(
  observation: ValuesIntegrityObservation,
): ValuesIntegritySignal {
  const statedValue = observation.statedValue.trim();
  const behavior = observation.behavior.trim();
  const inconvenience = observation.inconvenience?.trim() || null;
  const exception = observation.exception?.trim() || null;

  if (!statedValue) throw new Error('statedValue is required.');
  if (!behavior) throw new Error('behavior is required.');

  const preservedUnderPressure = !exception;
  const pressure = inconvenience;
  const contradiction = exception
    ? `Claims ${statedValue}, but makes an exception when ${exception}.`
    : null;

  const reflection = exception
    ? `The stated value is ${statedValue}. The observed behavior is ${behavior}. Under pressure${
        inconvenience ? ` (${inconvenience})` : ''
      }, an exception appears: ${exception}. What happens to this value when keeping it becomes inconvenient?`
    : `The stated value is ${statedValue}. The observed behavior is ${behavior}. The value remains present under pressure${
        inconvenience ? ` (${inconvenience})` : ''
      }.`;

  return {
    statedValue,
    preservedUnderPressure,
    pressure,
    contradiction,
    reflection,
  };
}
