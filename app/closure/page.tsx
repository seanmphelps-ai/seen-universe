'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import NatalIntakeForm from '../../components/NatalIntakeForm';
import NatalChartView from '../../components/NatalChartView';
import type { NatalChartResult } from '../../lib/natalChart';
import {
  compareClosureCharts,
  type ComparativeShadowCard,
  type ClosureCompareOutput,
} from '../../lib/seen/closureCompare';

export default function ClosurePage() {
  const router = useRouter();
  const [personA, setPersonA] = useState<NatalChartResult | null>(null);
  const [personB, setPersonB] = useState<NatalChartResult | null>(null);
  const [comparison, setComparison] = useState<ClosureCompareOutput | null>(null);
  const [selected, setSelected] = useState<ComparativeShadowCard | null>(null);
  const [error, setError] = useState('');

  function runCompare(nextA = personA, nextB = personB) {
    if (!nextA || !nextB) return;
    try {
      const result = compareClosureCharts(nextA, nextB);
      setComparison(result);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Comparison failed.');
    }
  }

  function handleSelect(card: ComparativeShadowCard) {
    if (!comparison) return;
    setSelected(card);
    try {
      sessionStorage.setItem(
        'seen:closure:selection',
        JSON.stringify({ comparison, selected: card }),
      );
    } catch {
      /* storage unavailable */
    }
  }

  return (
    <main className="seenFlowPage">
      <section className="seenFlowShell" aria-labelledby="closure-title">
        <header className="seenFlowHeader">
          <div className="seenProgress">
            <span>Closure & Composure</span>
            <span className="seenProgressValue">
              {!personA ? 'Person A' : !personB ? 'Person B' : selected ? 'Result' : 'Three shadows'}
            </span>
          </div>
          <h1 id="closure-title" className="seenDisplayLarge">Two complete people. One true pattern.</h1>
          <p className="seenFlowIntroduction">
            Each chart is calculated independently with Swiss Ephemeris. Comparison starts only after both fields exist.
          </p>
          <div className="seenDivider" aria-hidden="true" />
          <Link className="seenButtonSecondary" href="/">← Entry</Link>
        </header>

        {!personA && (
          <NatalIntakeForm
            title="Person A"
            onResolved={(chart) => {
              setPersonA(chart);
            }}
          />
        )}

        {personA && !personB && (
          <>
            <p className="seenFieldSupport">{personA.name} is held. Person B stays a separate record.</p>
            <NatalIntakeForm
              title="Person B"
              onResolved={(chart) => {
                setPersonB(chart);
                runCompare(personA, chart);
              }}
            />
          </>
        )}

        {personA && personB && comparison && !selected && (
          <div className="seenShadowGrid">
            <p className="seenFieldSupport">
              Three recognizable comparative shadows from the Western field. Select the one that is true.
            </p>
            {comparison.cards.map((card) => (
              <button
                key={card.id}
                type="button"
                className="seenShadowCard"
                onClick={() => handleSelect(card)}
              >
                <span className="seenLabel">{card.title}</span>
                <p>{card.happened}</p>
                <p className="seenFieldSupport">{card.evidence[0]}</p>
              </button>
            ))}
          </div>
        )}

        {selected && comparison && personA && personB && (
          <div className="seenPanel seenFlowForm">
            <span className="seenLabel">Selected pattern</span>
            <h2 className="seenDisplayLarge" style={{ fontSize: '2rem' }}>{selected.title}</h2>
            <p>{selected.happened}</p>
            <p><strong>Protective adaptation.</strong> {selected.adaptation}</p>
            <p><strong>Cost.</strong> {selected.cost}</p>
            <p><strong>First stabilizing action.</strong> {selected.firstAction}</p>
            <ul className="seenResultList">
              {comparison.unresolved.map((item) => (
                <li className="seenResultRow" key={item}>
                  <span className="seenResultValue">{item}</span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="seenButtonPrimary"
              onClick={() => router.push('/cadence')}
            >
              Begin Cadence
            </button>
            <NatalChartView result={personA} />
            <NatalChartView result={personB} />
          </div>
        )}

        {error && <p className="seenFormError" role="alert">{error}</p>}
      </section>
    </main>
  );
}
