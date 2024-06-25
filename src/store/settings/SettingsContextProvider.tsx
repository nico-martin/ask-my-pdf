import React from 'react';
import Context, { Settings } from './settingsContext.ts';
import { INITIAL_SETTINGS } from '@store/settings/constants.ts';
import { Modal } from '@theme';
import SettingsForm from './SettingsForm.tsx';

const SettingsContextProvider: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  const [showModal, setShowModal] = React.useState<boolean>(true);
  const [settings, setSettings] = React.useState<Settings>(INITIAL_SETTINGS);
  return (
    <Context.Provider
      value={{
        settings,
        setSettings: (newSettings) =>
          setSettings({ ...settings, ...newSettings }),
      }}
    >
      {children}
      {showModal && (
        <Modal close={() => setShowModal(false)} title="Settings">
          <SettingsForm />
        </Modal>
      )}
    </Context.Provider>
  );
};

export default SettingsContextProvider;
