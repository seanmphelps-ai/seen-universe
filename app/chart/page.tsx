import { redirect } from 'next/navigation';

/** Older intake door. The visitor deck starts at environmental exposure. */
export default function NatalChartPage() {
  redirect('/foundation/location');
}
