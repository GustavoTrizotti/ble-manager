import React, { createContext, useContext, useEffect, useState } from 'react';
import { Permission, PermissionsAndroid, Platform } from 'react-native';
import BleManager from 'react-native-ble-manager';
import { BluetoothContextProps } from '../types/bluetooth.types';

const BluetoothContext = createContext<BluetoothContextProps | null>(null);

export function useBluetooth(): BluetoothContextProps {
  return useContext(BluetoothContext) as BluetoothContextProps;
}

interface BluetoothProviderProps {
  children: React.ReactNode;
}

const permissions = [
  PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
  PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
];

export function BluetoothProvider({ children }: BluetoothProviderProps) {
  const [isBluetoothEnabled, setIsBluetoothEnabled] = useState(false);

  async function verifyPermissions() {
    if (Platform.OS === 'android' && Platform.Version >= 23) {
      const checked = await PermissionsAndroid.requestMultiple(permissions);
      const toRequest = Object.entries(checked)
        .filter(([, granted]) => !granted)
        .map(([permission]) => permission);
      await PermissionsAndroid.requestMultiple(toRequest as Permission[]);
    }
  }

  async function enableBluetooth() {
    return await BleManager.enableBluetooth().then(() =>
      setIsBluetoothEnabled(true)
    );
  }

  useEffect(() => {
    (async () => {
      await verifyPermissions();
      await enableBluetooth();
    })();
  }, []);

  return (
    <BluetoothContext.Provider value={{ isBluetoothEnabled }}>
      {children}
    </BluetoothContext.Provider>
  );
}
