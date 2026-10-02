'use client';

import { useMemo, useRef } from 'react';
import { CITIES } from '../lib/cities';
import {
  emptyLivedPlaceDraft,
  type LivedPlaceDraft,
} from '../lib/foundation/livedExposure';

type LivedPlacesFieldProps = {
  rows: LivedPlaceDraft[];
  onChange: (rows: LivedPlaceDraft[]) => void;
};

export default function LivedPlacesField({ rows, onChange }: LivedPlacesFieldProps) {
  const nextId = useRef(rows.length);

  function update(id: string, patch: Partial<LivedPlaceDraft>) {
    onChange(rows.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  }

  function addRow() {
    nextId.current += 1;
    onChange([...rows, emptyLivedPlaceDraft(String(nextId.current))]);
  }

  function removeRow(id: string) {
    onChange(rows.filter((row) => row.id !== id));
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
  const suggestions = useMemo(() => {
    const query = row.query.trim().toLowerCase();
    if (!query || row.city) return [];
    return CITIES.filter(
      (city) =>
        city.name.toLowerCase().includes(query) ||
        city.country.toLowerCase().includes(query),
    ).slice(0, 8);
  }, [row.city, row.query]);

  return (
    <div className="seenField">
      <label className="seenLabel" htmlFor={`lived-city-${row.id}`}>
        Place {index + 1}
      </label>
      <div className="seenInputFrame">
        <input
          id={`lived-city-${row.id}`}
          className="seenInput"
          type="text"
          autoComplete="off"
          placeholder="Search for a city"
          value={row.query}
          onChange={(event) => onChange({ query: event.target.value, city: null })}
        />
      </div>
      {suggestions.length > 0 && (
        <ul className="seenCitySuggestions">
          {suggestions.map((city) => (
            <li key={`${city.name}-${city.country}`}>
              <button
                type="button"
                className="seenCitySuggestion"
                onClick={() => onChange({
                  city,
                  query: `${city.name}, ${city.country}`,
                })}
              >
                {city.name}, {city.country}
              </button>
            </li>
          ))}
        </ul>
      )}
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
