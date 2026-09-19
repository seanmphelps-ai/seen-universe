'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { NatalChartInput, NatalChartResult } from '../../../lib/natalChart';
import type { RectificationScenarioResponse } from '../../../lib/rectification/schema';

type StoredBirth = {
  name: string;
  birthDate: string;
  city: {
    name: string;
    country: string;
    latitude: number;
    longitude: number;
  };
  livedStack?: string;
};

type Candidate = {
  minutes: number;
  chart: NatalChartResult;
};

type Ratings = Record<string, number>;

const INITIAL_MINUTES = [4 * 60, 12 * 60, 20 * 60];
const ROUND_DELTAS = [180, 120, 60];
const RATING_OPTIONS = [0, 25, 50, 75, 100];
