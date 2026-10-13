// PROVENANCE: bot=grok session=2026-10-13 task=64 interrogator sub-agents (no scoring)
import { interrogator as p01 } from './portal01';
import { interrogator as p02 } from './portal02';
import { interrogator as p03 } from './portal03';
import { interrogator as p04 } from './portal04';
import { interrogator as p05 } from './portal05';
import { interrogator as p06 } from './portal06';
import { interrogator as p07 } from './portal07';
import { interrogator as p08 } from './portal08';
import { interrogator as p09 } from './portal09';
import { interrogator as p10 } from './portal10';
import { interrogator as p11 } from './portal11';
import { interrogator as p12 } from './portal12';
import { interrogator as p13 } from './portal13';
import { interrogator as p14 } from './portal14';
import { interrogator as p15 } from './portal15';
import { interrogator as p16 } from './portal16';
import { interrogator as p17 } from './portal17';
import { interrogator as p18 } from './portal18';
import { interrogator as p19 } from './portal19';
import { interrogator as p20 } from './portal20';
import { interrogator as p21 } from './portal21';
import { interrogator as p22 } from './portal22';
import { interrogator as p23 } from './portal23';
import { interrogator as p24 } from './portal24';
import { interrogator as p25 } from './portal25';
import { interrogator as p26 } from './portal26';
import { interrogator as p27 } from './portal27';
import { interrogator as p28 } from './portal28';
import { interrogator as p29 } from './portal29';
import { interrogator as p30 } from './portal30';
import { interrogator as p31 } from './portal31';
import { interrogator as p32 } from './portal32';
import { interrogator as p33 } from './portal33';
import { interrogator as p34 } from './portal34';
import { interrogator as p35 } from './portal35';
import { interrogator as p36 } from './portal36';
import { interrogator as p37 } from './portal37';
import { interrogator as p38 } from './portal38';
import { interrogator as p39 } from './portal39';
import { interrogator as p40 } from './portal40';
import { interrogator as p41 } from './portal41';
import { interrogator as p42 } from './portal42';
import { interrogator as p43 } from './portal43';
import { interrogator as p44 } from './portal44';
import { interrogator as p45 } from './portal45';
import { interrogator as p46 } from './portal46';
import { interrogator as p47 } from './portal47';
import { interrogator as p48 } from './portal48';
import { interrogator as p49 } from './portal49';
import { interrogator as p50 } from './portal50';
import { interrogator as p51 } from './portal51';
import { interrogator as p52 } from './portal52';
import { interrogator as p53 } from './portal53';
import { interrogator as p54 } from './portal54';
import { interrogator as p55 } from './portal55';
import { interrogator as p56 } from './portal56';
import { interrogator as p57 } from './portal57';
import { interrogator as p58 } from './portal58';
import { interrogator as p59 } from './portal59';
import { interrogator as p60 } from './portal60';
import { interrogator as p61 } from './portal61';
import { interrogator as p62 } from './portal62';
import { interrogator as p63 } from './portal63';
import { interrogator as p64 } from './portal64';
import type { ChartSignal, Interrogator, InterrogatorResult } from './types';

export type * from './types';

export const INTERROGATORS: readonly Interrogator[] = [p01, p02, p03, p04, p05, p06, p07, p08, p09, p10, p11, p12, p13, p14, p15, p16, p17, p18, p19, p20, p21, p22, p23, p24, p25, p26, p27, p28, p29, p30, p31, p32, p33, p34, p35, p36, p37, p38, p39, p40, p41, p42, p43, p44, p45, p46, p47, p48, p49, p50, p51, p52, p53, p54, p55, p56, p57, p58, p59, p60, p61, p62, p63, p64];

/** Runs every one of the 64 interrogators on the chart. No scoring, no filtering. */
export function runAllInterrogators(chartSignals: ChartSignal[]): InterrogatorResult[] {
  return INTERROGATORS.map((i) => i.run(chartSignals));
}

export { fileIntoSections } from './fileIntoSections';
