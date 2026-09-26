export type PersonId = string;

export type ModalityDrop =
  | 'western'
  | 'wound'
  | 'jyotisha'
  | 'hellenistic'
  | 'bazi'
  | 'galactic'
  | 'tzolkin'
  | 'numerology';

export type ProductSurface = 'narrator' | 'screenplay' | 'life_map' | 'love_map';

export type PersonCocoon = {
  id: PersonId;
  name: string;
  onPerson: ModalityDrop[];
};

export type ManualState = {
  people: PersonCocoon[];
  front: PersonId | null;
  lifted: { person: PersonId; modality: ModalityDrop; product: ProductSurface }[];
};

export function emptyManual(): ManualState {
  return { people: [], front: null, lifted: [] };
}

export function pullFront(state: ManualState, id: PersonId): ManualState {
  return { ...state, front: id };
}

export function dropModality(state: ManualState, modality: ModalityDrop): ManualState {
  if (!state.front) return state;
  return {
    ...state,
    people: state.people.map((person) =>
      person.id === state.front && !person.onPerson.includes(modality)
        ? { ...person, onPerson: [...person.onPerson, modality] }
        : person,
    ),
  };
}

export function liftToProduct(
  state: ManualState,
  modality: ModalityDrop,
  product: ProductSurface,
): ManualState {
  if (!state.front) return state;
  const person = state.people.find((row) => row.id === state.front);
  if (!person?.onPerson.includes(modality)) return state;
  return {
    ...state,
    lifted: [...state.lifted, { person: state.front, modality, product }],
  };
}
