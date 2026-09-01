export type PortalStatus = 'active' | 'weak' | 'dormant' | 'contradictory' | 'insufficient_signal';

export type SourceStepId =
  | 'environment_intake'
  | 'birth_date_astrology'
  | 'wound_shadow_markers'
  | 'attachment_love_markers'
  | 'psychological_lenses';

export type SourceSignal = {
  id: string;
  stepId: SourceStepId;
  source: string;
  summary: string;
  tags: string[];
  confidence: 'low' | 'medium' | 'high';
};

export type PortalDefinition = {
  id: number;
  name: string;
  shadow: string;
};

export type LifeSectionDefinition = {
  id: number;
  name: string;
};

export type PortalExtraction = {
  portalId: number;
  portalName: string;
  sourceStepId: SourceStepId;
  status: PortalStatus;
  trigger?: string;
  pressurePoint?: string;
  reaction?: string;
  cost?: string;
  consequence?: string;
  collapsePattern?: string;
  impactOnSelf?: string;
  impactOnOthers?: string;
  relationalDistortion?: string;
  bodyNervousSystemSignal?: string;
  hiddenCapacity?: string;
  regulationNeed?: string;
  sourceSignalIds: string[];
};

export type ConvergedPortalSignal = {
  portalId: number;
  portalName: string;
  status: PortalStatus;
  activationCount: number;
  activatedBy: SourceStepId[];
  repeatedTags: string[];
  confidence: 'low' | 'medium' | 'high';
  sourceSignalIds: string[];
};

export type LifeSectionRoute = {
  sectionId: number;
  sectionName: string;
  portalIds: number[];
  reason: string;
};

export type SeenEnvironmentRootedPayload = {
  schemaVersion: '1.0.0';
  personId: string;
  sourceSignals: SourceSignal[];
  portalExtractions: PortalExtraction[];
  convergedPortalSignals: ConvergedPortalSignal[];
  lifeSectionRoutes: LifeSectionRoute[];
  jungSovereigntyReady: boolean;
  oracleRenderReady: boolean;
};

export const CORE_64_PORTALS: PortalDefinition[] = [
  { id: 1, name: 'Entropy', shadow: 'pointless, directionless void' },
  { id: 2, name: 'Dislocation', shadow: 'drifting, no roots' },
  { id: 3, name: 'Chaos', shadow: 'everything breaks apart' },
  { id: 4, name: 'Intolerance', shadow: 'mind locked shut' },
  { id: 5, name: 'Impatience', shadow: 'rush destroys flow' },
  { id: 6, name: 'Conflict', shadow: 'peace feels fake' },
  { id: 7, name: 'Division', shadow: 'us vs them forever' },
  { id: 8, name: 'Mediocrity', shadow: 'play small, hate it' },
  { id: 9, name: 'Stubbornness', shadow: "won't bend, snaps" },
  { id: 10, name: 'Self-Sabotage', shadow: 'build then burn' },
  { id: 11, name: 'Fear of Failure', shadow: 'freeze at edge' },
  { id: 12, name: 'Over-Responsibility', shadow: "carry others' weight" },
  { id: 13, name: 'Victimhood', shadow: 'blame the world' },
  { id: 14, name: 'Greed', shadow: 'never enough' },
  { id: 15, name: 'Pride', shadow: "can't admit wrong" },
  { id: 16, name: 'Envy', shadow: 'see their win, feel loss' },
  { id: 17, name: 'Lust', shadow: 'want without love' },
  { id: 18, name: 'Wrath', shadow: 'rage blinds' },
  { id: 19, name: 'Sloth', shadow: 'numb, numb, numb' },
  { id: 20, name: 'Gluttony', shadow: 'fill holes with more' },
  { id: 21, name: 'Biting Through', shadow: 'chew obstacles till jaw locks' },
  { id: 22, name: 'Grace', shadow: 'beauty hides the void' },
  { id: 23, name: 'Splitting Apart', shadow: 'break down, no rebuild' },
  { id: 24, name: 'Return', shadow: 'repeat old pain, call it cycle' },
  { id: 25, name: 'Innocence', shadow: 'naivety turns reckless' },
  { id: 26, name: 'Taming Great', shadow: 'suppress till it explodes' },
  { id: 27, name: 'Nourishment', shadow: 'feed others till empty' },
  { id: 28, name: 'Preponderance Great', shadow: 'weight crushes, no escape' },
  { id: 29, name: 'Abysmal', shadow: 'fall into danger again' },
  { id: 30, name: 'Clinging', shadow: 'obsession burns slow' },
  { id: 31, name: 'Influence', shadow: 'seduce to own' },
  { id: 32, name: 'Duration', shadow: 'endurance turns stagnation' },
  { id: 33, name: 'Retreat', shadow: 'run, call it strategy' },
  { id: 34, name: 'Power Great', shadow: 'force without wisdom' },
  { id: 35, name: 'Progress', shadow: 'advance to burnout' },
  { id: 36, name: 'Darkening Light', shadow: 'light wounded, hidden' },
  { id: 37, name: 'Family', shadow: 'duty as trap' },
  { id: 38, name: 'Opposition', shadow: 'polarity never resolves' },
  { id: 39, name: 'Obstruction', shadow: 'block, blame, repeat' },
  { id: 40, name: 'Deliverance', shadow: 'escape instead of heal' },
  { id: 41, name: 'Decrease', shadow: 'loss as lesson, scarcity' },
  { id: 42, name: 'Increase', shadow: 'growth as excess, greed' },
  { id: 43, name: 'Break-through', shadow: 'resolution as rupture' },
  { id: 44, name: 'Coming to Meet', shadow: 'seductive drain, pattern trap' },
  { id: 45, name: 'Gathering', shadow: 'group power turns exploitation' },
  { id: 46, name: 'Pushing Upward', shadow: 'ambition overreaches' },
  { id: 47, name: 'Oppression', shadow: 'mountain crushes, no air' },
  { id: 48, name: 'Well', shadow: 'depth as danger, isolation' },
  { id: 49, name: 'Revolution', shadow: 'change as chaos' },
  { id: 50, name: 'Cauldron', shadow: 'sacrifice for transformation' },
  { id: 51, name: 'Arousing', shadow: 'shock turns fear' },
  { id: 52, name: 'Keeping Still', shadow: 'repression, frozen' },
  { id: 53, name: 'Development', shadow: 'gradual growth, impatience' },
  { id: 54, name: 'Marrying Maiden', shadow: 'subservience as manipulation' },
  { id: 55, name: 'Abundance', shadow: 'peak becomes decline' },
  { id: 56, name: 'Wanderer', shadow: 'rootless, alienated' },
  { id: 57, name: 'Gentle', shadow: 'penetration turns infiltration' },
  { id: 58, name: 'Joyous', shadow: 'pleasure as addiction' },
  { id: 59, name: 'Dispersion', shadow: 'dissolution, loss' },
  { id: 60, name: 'Limitation', shadow: 'boundaries as prison' },
  { id: 61, name: 'Inner Truth', shadow: 'truth as weapon' },
  { id: 62, name: 'Preponderance Small', shadow: 'detail obsession, pettiness' },
  { id: 63, name: 'After Completion', shadow: 'success as trap' },
  { id: 64, name: 'Before Completion', shadow: 'almost there, never quite' },
];

export const LIFE_45_SECTIONS: LifeSectionDefinition[] = [
  { id: 1, name: 'Money Flow' },
  { id: 2, name: 'Relationships & Family' },
  { id: 3, name: 'Sexuality & Intimacy' },
  { id: 4, name: 'Health & Body Aging' },
  { id: 5, name: 'Emotional Shadow' },
  { id: 6, name: 'Grief & Loss' },
  { id: 7, name: 'Spiritual Crisis' },
  { id: 8, name: 'Joy & Play' },
  { id: 9, name: 'Community Contribution' },
  { id: 10, name: 'Cognitive Aging' },
  { id: 11, name: 'Death & Completion' },
  { id: 12, name: 'Geo-Presence Impact' },
  { id: 13, name: 'Time & Age Activation' },
  { id: 14, name: 'Warning System' },
  { id: 15, name: 'Yoga Intelligence' },
  { id: 16, name: 'Decision Fatigue' },
  { id: 17, name: 'Emotional Trigger Map' },
  { id: 18, name: 'Conflict Playbook' },
  { id: 19, name: 'Attachment & Abandonment' },
  { id: 20, name: 'Nervous System Typology' },
  { id: 21, name: 'Addiction Risk' },
  { id: 22, name: 'Creative Flow' },
  { id: 23, name: 'Sleep Architecture' },
  { id: 24, name: 'Communication Filters' },
  { id: 25, name: 'Longevity Prevention' },
  { id: 26, name: 'Relational ROI' },
  { id: 27, name: 'Shadow Integration' },
  { id: 28, name: 'Failure Recovery' },
  { id: 29, name: 'Success Sabotage' },
  { id: 30, name: 'Power & Humility' },
  { id: 31, name: 'Final Scorecard' },
  { id: 32, name: 'Authority Dynamics' },
  { id: 33, name: 'Wealth Loops' },
  { id: 34, name: 'Health Vitality' },
  { id: 35, name: 'Spiritual Gateways' },
  { id: 36, name: 'Legacy Projections' },
  { id: 37, name: 'Parental Imprint' },
  { id: 38, name: 'Childhood Conditioning' },
  { id: 39, name: 'Sibling Dynamics' },
  { id: 40, name: 'Romantic Patterns' },
  { id: 41, name: 'Friendship Patterns' },
  { id: 42, name: 'Career Sabotage' },
  { id: 43, name: 'Reputation Damage' },
  { id: 44, name: 'Isolation Cycles' },
  { id: 45, name: 'Generational Stain' },
];

const portalRoutingTags: Record<number, string[]> = {
  2: ['place', 'root', 'belonging', 'exile', 'home'],
  6: ['conflict', 'fight', 'relationship', 'rupture'],
  10: ['sabotage', 'success', 'burn', 'destroy'],
  12: ['responsibility', 'parent', 'family', 'carry'],
  18: ['rage', 'anger', 'fight', 'explode'],
  24: ['repeat', 'cycle', 'return', 'old pain'],
  30: ['cling', 'abandonment', 'obsession', 'attachment'],
  33: ['retreat', 'isolation', 'withdraw', 'hide'],
  37: ['family', 'duty', 'home', 'parent'],
  47: ['oppression', 'pressure', 'crush', 'burden'],
  52: ['freeze', 'still', 'repress', 'shutdown'],
  56: ['wander', 'rootless', 'location', 'alienated'],
  60: ['limit', 'boundary', 'prison', 'restriction'],
  61: ['truth', 'weapon', 'inner', 'knowing'],
};

const lifeSectionRoutingTags: Record<number, string[]> = {
  1: ['money', 'resource', 'survival'],
  2: ['family', 'relationship', 'home'],
  3: ['sex', 'intimacy', 'obsession', 'eros'],
  5: ['shadow', 'emotion', 'rage', 'grief'],
  12: ['place', 'location', 'geopresence', 'biome', 'terrain'],
  17: ['trigger', 'reaction', 'explode'],
  18: ['conflict', 'fight', 'rupture'],
  19: ['attachment', 'abandonment', 'cling'],
  20: ['nervous', 'body', 'freeze', 'shutdown'],
  27: ['shadow', 'integration', 'hidden capacity'],
  29: ['sabotage', 'success', 'burn'],
  30: ['power', 'humility', 'pride'],
  37: ['parent', 'family', 'imprint'],
  38: ['childhood', 'conditioning', 'early'],
  40: ['romantic', 'attachment', 'intimacy'],
  42: ['career', 'success', 'authority'],
  43: ['reputation', 'visibility', 'shame'],
  44: ['isolation', 'retreat', 'alienated'],
  45: ['generational', 'ancestral', 'stain'],
};

export function scanAllPortalsForStep(stepId: SourceStepId, signals: SourceSignal[]): PortalExtraction[] {
  return CORE_64_PORTALS.map((portal): PortalExtraction => {
    const matchedSignals = signals.filter((signal) => signal.stepId === stepId && signalMatchesPortal(signal, portal.id));
    const status: PortalStatus = matchedSignals.length >= 2 ? 'active' : matchedSignals.length === 1 ? 'weak' : 'dormant';

    return {
      portalId: portal.id,
      portalName: portal.name,
      sourceStepId: stepId,
      status,
      trigger: status === 'dormant' ? undefined : `Trigger extracted through ${portal.name}: ${portal.shadow}.`,
      pressurePoint: status === 'dormant' ? undefined : portal.shadow,
      reaction: status === 'dormant' ? undefined : 'Reaction remains source-traced; no early blend.',
      cost: status === 'dormant' ? undefined : 'Cost must be routed before Oracle render.',
      consequence: status === 'dormant' ? undefined : 'Consequence requires life-section placement.',
      collapsePattern: status === 'dormant' ? undefined : portal.shadow,
      impactOnSelf: status === 'dormant' ? undefined : 'Self-impact pending section routing.',
      impactOnOthers: status === 'dormant' ? undefined : 'Other-impact pending section routing.',
      relationalDistortion: status === 'dormant' ? undefined : 'Relational distortion remains marked when signal is relational.',
      bodyNervousSystemSignal: status === 'dormant' ? undefined : 'Body/nervous-system signal remains available for section routing.',
      hiddenCapacity: status === 'dormant' ? undefined : 'Hidden capacity is held until Jung/sovereignty step.',
      regulationNeed: status === 'dormant' ? undefined : 'Regulation need required before final render.',
      sourceSignalIds: matchedSignals.map((signal) => signal.id),
    };
  });
}

export function convergePortalActivations(extractions: PortalExtraction[]): ConvergedPortalSignal[] {
  return CORE_64_PORTALS.map((portal) => {
    const activeOrWeak = extractions.filter(
      (extraction) => extraction.portalId === portal.id && ['active', 'weak', 'contradictory'].includes(extraction.status),
    );
    const activatedBy = Array.from(new Set(activeOrWeak.map((extraction) => extraction.sourceStepId)));
    const sourceSignalIds = activeOrWeak.flatMap((extraction) => extraction.sourceSignalIds);
    const activationCount = activatedBy.length;

    const status: PortalStatus = activationCount >= 2 ? 'active' : activationCount === 1 ? 'weak' : 'dormant';
    const confidence: 'low' | 'medium' | 'high' = activationCount >= 3 ? 'high' : activationCount === 2 ? 'medium' : 'low';

    return {
      portalId: portal.id,
      portalName: portal.name,
      status,
      activationCount,
      activatedBy,
      repeatedTags: repeatedTagsForSignals(sourceSignalIds),
      confidence,
      sourceSignalIds,
    };
  }).filter((signal) => signal.status !== 'dormant');
}

export function routeToLifeSections(convergedSignals: ConvergedPortalSignal[], sourceSignals: SourceSignal[]): LifeSectionRoute[] {
  const routes: LifeSectionRoute[] = [];

  for (const section of LIFE_45_SECTIONS) {
    const sectionTags = lifeSectionRoutingTags[section.id] ?? [];
    const matchingPortalIds = convergedSignals
      .filter((portalSignal) => {
        const signalTags = sourceSignals
          .filter((signal) => portalSignal.sourceSignalIds.includes(signal.id))
          .flatMap((signal) => signal.tags);
        return sectionTags.some((tag) => signalTags.includes(tag.toLowerCase()));
      })
      .map((portalSignal) => portalSignal.portalId);

    if (matchingPortalIds.length > 0) {
      routes.push({
        sectionId: section.id,
        sectionName: section.name,
        portalIds: Array.from(new Set(matchingPortalIds)),
        reason: 'Strongest repeated portal signal matched this life-section consequence domain.',
      });
    }
  }

  return routes;
}

export function buildEnvironmentRootedPortalPayload(personId: string, sourceSignals: SourceSignal[]): SeenEnvironmentRootedPayload {
  const orderedSteps: SourceStepId[] = [
    'environment_intake',
    'birth_date_astrology',
    'wound_shadow_markers',
    'attachment_love_markers',
    'psychological_lenses',
  ];

  const portalExtractions = orderedSteps.flatMap((stepId) => scanAllPortalsForStep(stepId, sourceSignals));
  const convergedPortalSignals = convergePortalActivations(portalExtractions);
  const lifeSectionRoutes = routeToLifeSections(convergedPortalSignals, sourceSignals);

  return {
    schemaVersion: '1.0.0',
    personId,
    sourceSignals,
    portalExtractions,
    convergedPortalSignals,
    lifeSectionRoutes,
    jungSovereigntyReady: lifeSectionRoutes.length > 0,
    oracleRenderReady: lifeSectionRoutes.length > 0,
  };
}

function signalMatchesPortal(signal: SourceSignal, portalId: number): boolean {
  const portalTags = portalRoutingTags[portalId] ?? [];
  const normalizedTags = signal.tags.map((tag) => tag.toLowerCase());
  return portalTags.some((portalTag) => normalizedTags.includes(portalTag));
}

function repeatedTagsForSignals(_sourceSignalIds: string[]): string[] {
  // Placeholder until source signal registry is persisted outside this runtime helper.
  // The convergence payload keeps source trails; repeated tag calculation can be expanded when signals are stored globally.
  return [];
}
