import React from 'react';
import settingsContext, { SettingsContext } from './settingsContext.ts';

const useSettingsContext = (): SettingsContext =>
  React.useContext(settingsContext);

export default useSettingsContext;
