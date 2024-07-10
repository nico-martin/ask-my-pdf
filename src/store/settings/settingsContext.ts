import React from 'react';
import { FeatureExtractionModel } from '@utils/vectorDB/VectorDB.ts';
import { INITIAL_SETTINGS } from './constants.ts';

type Enumerate<
  N extends number,
  Acc extends number[] = [],
> = Acc['length'] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc['length']]>;

type Range<F extends number, T extends number> = Exclude<
  Enumerate<T>,
  Enumerate<F>
>;

export interface Settings {
  promptTemplate: string;
  featureExtractionModel: FeatureExtractionModel;
  resultsBeforeAndAfter: number;
  maxNumberOfResults: number;
  similarityThreshold: Range<0, 101>;
}

export interface SettingsContext {
  settings: Settings;
  setSettings: (settings: Partial<Settings>) => void;
  setShowModal: (show: boolean) => void;
}

const settingsContext = React.createContext<SettingsContext>({
  settings: INITIAL_SETTINGS,
  setSettings: (_settings: Partial<Settings>) => {},
  setShowModal: () => {},
});

export default settingsContext;
