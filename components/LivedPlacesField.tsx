'use client';

import { useRef, type Dispatch, type SetStateAction } from 'react';
import { LocationAutocompleteInput } from './LocationAutocompleteInput';
import { placeFromSuggestion } from '../lib/foundation/intakeDeck';
import {
  emptyLivedPlaceDraft,
  type LivedPlaceDraft,
} from '../lib/foundation/livedExposure';

type LivedPlacesFieldProps = {
  rows: LivedPlaceDraft[];
  onChange: Dispatch<SetStateAction<LivedPlaceDraft[]>>;
};

export default function LivedPlacesField({ rows, onChange }: LivedPlacesFieldProps) {
  const nextId = useRef(rows.length);

  function update(id: string, patch: Partial<LivedPlaceDraft>) {
    onChange((current) => current.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  }

  function addRow() {
    nextId.current += 1;
    const id = String(nextId.current);
    onChange((current) => [...current, emptyLivedPlaceDraft(id)]);
  }

  function removeRow(id: string) {
    onChange((current) => current.filter((row) => row.id !== id));
  }

  return (
    <fieldset className="seenFieldset">
      <legend className="seenLabel">Lived places + years</legend>
      <p className="seenFieldSupport">
        Six months counts. Years required. This writes the card sentence.
        It does not rewrite the sky.
      </p>
      {rows.map((row, index) => (
        <LivedPlaceRow
          key={row.id}
          row={row}
          index={index}
          onChange={(patch) => update(row.id, patch)}
          onRemove={rows.length > 1 ? () => removeRow(row.id) : undefined}
        />
      ))}
      <button className="seenButtonSecondary" type="button" onClick={addRow}>
        Add another place
      </button>
    </fieldset>
  );
}

function LivedPlaceRow({
  row,
  index,
  onChange,
  onRemove,
}: {
  row: LivedPlaceDraft;
  index: number;
  onChange: (patch: Partial<LivedPlaceDraft>) => void;
  onRemove?: () => void;
}) {
  return (
    <div className="seenField">
      <label className="seenLabel" htmlFor={`lived-city-${row.id}`}>
        Place {index + 1}
      </label>
      <div className="seenInputFrame">
        <LocationAutocompleteInput
          id={`lived-city-${row.id}`}
          className="seenInput"
          value={row.query}
          placeholder="Search for a city"
          ariaLabel={`Place ${index + 1}`}
          onChange={(value) => onChange({ query: value })}
          onPlaceSelect={(suggestion) => {
            if (!suggestion) {
              onChange({ city: null });
              return;
            }
            onChange({
              query: suggestion.label,
              city: placeFromSuggestion(suggestion),
            });
          }}
        />
      </div>
      <label className="seenLabel" htmlFor={`lived-start-${row.id}`}>
        From
      </label>
      <div className="seenInputFrame">
        <input
          id={`lived-start-${row.id}`}
          className="seenInput"
          type="month"
          value={row.startMonth}
          onChange={(event) => onChange({ startMonth: event.target.value })}
        />
      </div>
      <label className="seenLabel" htmlFor={`lived-end-${row.id}`}>
        Until
      </label>
      <div className="seenInputFrame">
        <input
          id={`lived-end-${row.id}`}
          className="seenInput"
          type="month"
          value={row.stillThere ? '' : row.endMonth}
          disabled={row.stillThere}
          onChange={(event) => onChange({ endMonth: event.target.value, stillThere: false })}
        />
      </div>
      <label className="seenLabel" htmlFor={`lived-still-${row.id}`}>
        <input
          id={`lived-still-${row.id}`}
          type="checkbox"
          checked={row.stillThere}
          onChange={(event) => onChange({
            stillThere: event.target.checked,
            endMonth: event.target.checked ? '' : row.endMonth,
          })}
        />
        {' '}
        Still there
      </label>
      {onRemove && (
        <button className="seenButtonSecondary" type="button" onClick={onRemove}>
          Remove place
        </button>
      )}
    </div>
  );
}
