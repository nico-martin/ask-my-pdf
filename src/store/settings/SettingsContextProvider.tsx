import React from 'react';
import Context, { Settings } from './settingsContext.ts';
import { INITIAL_SETTINGS } from '@store/settings/constants.ts';
import { Modal } from '@theme';
import SettingsForm from './SettingsForm.tsx';
import LocalStorage from '@utils/LocalStorage.ts';

const Store = new LocalStorage<Settings>('settings');

const SettingsContextProvider: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  const [showModal, setShowModal] = React.useState<boolean>(false);
  const [settings, setSettings] = React.useState<Settings>(
    Store.get() || INITIAL_SETTINGS
  );
  const closeButton = React.useRef<HTMLButtonElement>(null);

  return (
    <Context.Provider
      value={{
        settings,
        setSettings: (newSettings) =>
          setSettings({ ...settings, ...newSettings }),
        setShowModal,
      }}
    >
      {children}
      {showModal && (
        <Modal
          setCloseButton={(b) => {
            closeButton.current = b;
          }}
          close={() => setShowModal(false)}
          title="Settings"
        >
          <SettingsForm
            defaultValues={settings}
            setValues={(data) => {
              Store.set(data);
              setSettings(data);
              closeButton.current?.click();
            }}
          />
        </Modal>
      )}
    </Context.Provider>
  );
};

export default SettingsContextProvider;
