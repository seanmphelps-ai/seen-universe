'use client';

import { useEffect, useRef, useState } from 'react';

export type CitySuggestion = {
  label: string;
  city: string;
  region: string | null;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  population: number;
};

type LocationAutocompleteInputProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
  className?: string;
};

const DEBOUNCE_MS = 200;

/**
 * Text input with a city-suggestion dropdown backed by /api/location/suggest.
 * The parent only ever sees plain text via onChange — selecting a suggestion
 * just fills the input with its label, same as typing it out by hand. This
 * keeps the intake form's existing string-based state untouched.
 */
export function LocationAutocompleteInput({
  id,
  value,
  onChange,
  placeholder,
  ariaLabel,
  className,
}: LocationAutocompleteInputProps) {
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestIdRef = useRef(0);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const query = value.trim();
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    const thisRequestId = ++requestIdRef.current;

    debounceRef.current = setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/location/suggest?q=${encodeURIComponent(query)}`,
        );
        if (!response.ok) return;
        const data: { suggestions: CitySuggestion[] } = await response.json();
        if (requestIdRef.current === thisRequestId) {
          setSuggestions(data.suggestions);
          setHighlightedIndex(-1);
        }
      } catch {
        // Network hiccup on a typeahead is not worth surfacing — the
        // user can keep typing their own text either way.
      }
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function selectSuggestion(suggestion: CitySuggestion) {
    onChange(suggestion.label);
    setSuggestions([]);
    setOpen(false);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || suggestions.length === 0) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setHighlightedIndex((index) => (index + 1) % suggestions.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setHighlightedIndex(
        (index) => (index - 1 + suggestions.length) % suggestions.length,
      );
    } else if (event.key === 'Enter' && highlightedIndex >= 0) {
      event.preventDefault();
      selectSuggestion(suggestions[highlightedIndex]);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  }

  const showDropdown = open && suggestions.length > 0;

  return (
    <div ref={containerRef}>
      <input
        id={id}
        className={className}
        type="text"
        autoComplete="off"
        aria-label={ariaLabel}
        aria-expanded={showDropdown}
        aria-autocomplete="list"
        role="combobox"
        placeholder={placeholder}
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
      />

      {showDropdown && (
        <ul className="seenCitySuggestions" role="listbox">
          {suggestions.map((suggestion, index) => (
            <li
              key={`${suggestion.city}-${suggestion.countryCode}-${suggestion.latitude}`}
            >
              <button
                type="button"
                role="option"
                aria-selected={index === highlightedIndex}
                className={
                  index === highlightedIndex
                    ? 'seenCitySuggestion seenCitySuggestionActive'
                    : 'seenCitySuggestion'
                }
                onMouseDown={(event) => {
                  // mousedown (not click) so this fires before the
                  // input's blur handler would otherwise close the
                  // dropdown first.
                  event.preventDefault();
                  selectSuggestion(suggestion);
                }}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                {suggestion.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
