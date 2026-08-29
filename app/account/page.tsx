import Link from 'next/link';
import { redirect } from 'next/navigation';
import { isSupabaseConfigured } from '../../lib/supabase/config';
import { createClient } from '../../lib/supabase/server';
import { createPerson, signOut } from './actions';

type Person = {
  id: string;
  name: string;
  birth_date: string;
  birth_time: string | null;
  birth_location: string;
};

export default async function AccountPage() {
  if (!isSupabaseConfigured()) redirect('/auth?setup=required');
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth');

  const { data, error } = await supabase
    .from('people')
    .select('id,name,birth_date,birth_time,birth_location')
    .eq('owner_id', user.id)
    .order('created_at');
  if (error) throw error;
  const people = (data ?? []) as Person[];

  return (
    <main className="seenFlowPage">
      <section className="seenFlowShell" aria-labelledby="saved-people-title">
        <header className="seenFlowHeader">
          <span className="seenLabel">{user.email}</span>
          <h1 id="saved-people-title" className="seenDisplayLarge">Saved people</h1>
          <p className="seenFlowIntroduction">Every chart and reading stays attached to the person it belongs to.</p>
          <div className="seenDivider" aria-hidden="true" />
        </header>

        <div className="seenPanel seenFlowForm">
          {people.length === 0 ? (
            <p className="seenFieldSupport">Add the first person below or calculate their Western chart.</p>
          ) : (
            <ul className="seenResultList">
              {people.map((person) => (
                <li className="seenResultRow" key={person.id}>
                  <span className="seenResultName">{person.name}</span>
                  <span className="seenResultValue">{person.birth_date}{person.birth_time ? ` · ${person.birth_time}` : ''}<br />{person.birth_location}</span>
                </li>
              ))}
            </ul>
          )}
          <Link className="seenButtonPrimary" href="/chart">Calculate Western chart →</Link>
        </div>

        <form className="seenPanel seenFlowForm" action={createPerson}>
          <span className="seenLabel">Add another person</span>
          <div className="seenInputFrame"><input className="seenInput" name="name" placeholder="Name" required /></div>
          <div className="seenInputFrame"><input className="seenInput" name="birthDate" type="date" required /></div>
          <div className="seenInputFrame"><input className="seenInput" name="birthTime" type="time" /></div>
          <div className="seenInputFrame"><input className="seenInput" name="birthLocation" placeholder="Birth location" required /></div>
          <button className="seenButtonSecondary" type="submit">Save person</button>
        </form>

        <form action={signOut}><button className="seenButtonSecondary" type="submit">Sign out</button></form>
      </section>
    </main>
  );
}
