// PROVENANCE: bot=grok session=2026-10-13 task=64 interrogator sub-agents (no scoring)
import { interrogator as p01 } from './identifying-archetype01';
import { interrogator as p02 } from './identifying-archetype02';
import { interrogator as p03 } from './identifying-archetype03';
import { interrogator as p04 } from './identifying-archetype04';
import { interrogator as p05 } from './identifying-archetype05';
import { interrogator as p06 } from './identifying-archetype06';
import { interrogator as p07 } from './identifying-archetype07';
import { interrogator as p08 } from './identifying-archetype08';
import { interrogator as p09 } from './identifying-archetype09';
import { interrogator as p10 } from './identifying-archetype10';
import { interrogator as p11 } from './identifying-archetype11';
import { interrogator as p12 } from './identifying-archetype12';
import { interrogator as p13 } from './identifying-archetype13';
import { interrogator as p14 } from './identifying-archetype14';
import { interrogator as p15 } from './identifying-archetype15';
import { interrogator as p16 } from './identifying-archetype16';
import { interrogator as p17 } from './identifying-archetype17';
import { interrogator as p18 } from './identifying-archetype18';
import { interrogator as p19 } from './identifying-archetype19';
import { interrogator as p20 } from './identifying-archetype20';
import { interrogator as p21 } from './identifying-archetype21';
import { interrogator as p22 } from './identifying-archetype22';
import { interrogator as p23 } from './identifying-archetype23';
import { interrogator as p24 } from './identifying-archetype24';
import { interrogator as p25 } from './identifying-archetype25';
import { interrogator as p26 } from './identifying-archetype26';
import { interrogator as p27 } from './identifying-archetype27';
import { interrogator as p28 } from './identifying-archetype28';
import { interrogator as p29 } from './identifying-archetype29';
import { interrogator as p30 } from './identifying-archetype30';
import { interrogator as p31 } from './identifying-archetype31';
import { interrogator as p32 } from './identifying-archetype32';
import { interrogator as p33 } from './identifying-archetype33';
import { interrogator as p34 } from './identifying-archetype34';
import { interrogator as p35 } from './identifying-archetype35';
import { interrogator as p36 } from './identifying-archetype36';
import { interrogator as p37 } from './identifying-archetype37';
import { interrogator as p38 } from './identifying-archetype38';
import { interrogator as p39 } from './identifying-archetype39';
import { interrogator as p40 } from './identifying-archetype40';
import { interrogator as p41 } from './identifying-archetype41';
import { interrogator as p42 } from './identifying-archetype42';
import { interrogator as p43 } from './identifying-archetype43';
import { interrogator as p44 } from './identifying-archetype44';
import { interrogator as p45 } from './identifying-archetype45';
import { interrogator as p46 } from './identifying-archetype46';
import { interrogator as p47 } from './identifying-archetype47';
import { interrogator as p48 } from './identifying-archetype48';
import { interrogator as p49 } from './identifying-archetype49';
import { interrogator as p50 } from './identifying-archetype50';
import { interrogator as p51 } from './identifying-archetype51';
import { interrogator as p52 } from './identifying-archetype52';
import { interrogator as p53 } from './identifying-archetype53';
import { interrogator as p54 } from './identifying-archetype54';
import { interrogator as p55 } from './identifying-archetype55';
import { interrogator as p56 } from './identifying-archetype56';
import { interrogator as p57 } from './identifying-archetype57';
import { interrogator as p58 } from './identifying-archetype58';
import { interrogator as p59 } from './identifying-archetype59';
import { interrogator as p60 } from './identifying-archetype60';
import { interrogator as p61 } from './identifying-archetype61';
import { interrogator as p62 } from './identifying-archetype62';
import { interrogator as p63 } from './identifying-archetype63';
import { interrogator as p64 } from './identifying-archetype64';
import type { ChartSignal, Interrogator, InterrogatorResult } from './types';

export type * from './types';

export const INTERROGATORS: readonly Interrogator[] = [p01, p02, p03, p04, p05, p06, p07, p08, p09, p10, p11, p12, p13, p14, p15, p16, p17, p18, p19, p20, p21, p22, p23, p24, p25, p26, p27, p28, p29, p30, p31, p32, p33, p34, p35, p36, p37, p38, p39, p40, p41, p42, p43, p44, p45, p46, p47, p48, p49, p50, p51, p52, p53, p54, p55, p56, p57, p58, p59, p60, p61, p62, p63, p64];

/** Runs every one of the 64 interrogators on the chart. No scoring, no filtering. */
export function runAllInterrogators(chartSignals: ChartSignal[]): InterrogatorResult[] {
  return INTERROGATORS.map((i) => i.run(chartSignals));
}

export { fileIntoSections } from './fileIntoSections';
