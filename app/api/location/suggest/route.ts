import { NextResponse } from 'next/server';
import { suggestCities } from '../../../../lib/location/citySuggest';

// Backs the location-intake typeahead (birth / lived / current). Runs the
// bundled city dataset server-side so the ~135k-city list never ships to
// the browser — only the handful of matches for the current keystroke do.
export const runtime = 'nodejs';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') ?? '';

  const suggestions = suggestCities(query);

  return NextResponse.json({ suggestions });
}
