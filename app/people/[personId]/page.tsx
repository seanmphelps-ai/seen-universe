import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import NatalChartView from '../../../components/NatalChartView';
import type { NatalChartResult } from '../../../lib/natalChart';
import { isSupabaseConfigured } from '../../../lib/supabase/config';
import { createClient } from '../../../lib/supabase/server';

export default async function SavedPersonPage({
  params,
}: {
  params: Promise<{ personId: string }>;
}) {
  if (!isSupabaseConfigured()) redirect('/auth?setup=required');
  const { personId } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth');

  const { data: person } = await supabase
    .from('people')
    .select('id,name,birth_date,birth_time,birth_location')
    .eq('owner_id', user.id)
    .eq('id', personId)
    .maybeSingle();
  if (!person) notFound();

  const { data: storedChart } = await supabase
    .from('western_charts')
    .select('id,chart')
    .eq('owner_id', user.id)
    .eq('person_id', personId)
    .maybeSingle();

  const chart = storedChart?.chart as NatalChartResult | undefined;

  return (
    <main className="seenFlowPage">
      <section className="seenFlowShell" aria-labelledby="saved-person-title">
        <header className="seenFlowHeader">
          <span className="seenLabel">Saved person</span>
          <h1 id="saved-person-title" className="seenDisplayLarge">{person.name}</h1>
          <p className="seenFlowIntroduction">
            {person.birth_date}{person.birth_time ? ` · ${person.birth_time}` : ''} — {person.birth_location}
          </p>
          <div className="seenDivider" aria-hidden="true" />
          <Link className="seenButtonSecondary" href="/account">← Saved people</Link>
        </header>

        <div className="seenPanel seenFlowForm">
          {chart ? (
            <>
              <div className="seenField">
                <span className="seenLabel">Stored Western chart</span>
                <p className="seenFieldSupport" data-chart-id={storedChart?.id}>
                  Read from this account. Nothing was recalculated.
                </p>
              </div>
              <NatalChartView result={chart} />
            </>
          ) : (
            <>
              <p className="seenFieldSupport">No Western chart is stored for this person yet.</p>
              <Link className="seenButtonPrimary" href="/chart">Calculate Western chart →</Link>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
