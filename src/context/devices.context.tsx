import { createContext, useContext, useEffect, useState } from 'react';
import { DevicesContextProps } from '../types/devices.types';
import { Peripheral } from 'react-native-ble-manager';
import { NativeEventEmitter, NativeModules, ToastAndroid } from 'react-native';
import BleManager from 'react-native-ble-manager';

const DevicesContext = createContext<DevicesContextProps | null>(null);
const bleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(bleManagerModule);

export function useDevices(): DevicesContextProps {
  return useContext(DevicesContext) as DevicesContextProps;
}

export function DevicesProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [isConnecting, setIsConnecting] = useState<
    Readonly<{ status: boolean; peripheralId: string | null }>
  >({
    peripheralId: null,
    status: false,
  });
  const [isScanning, setIsScanning] = useState(false);

  const [peripherals, setPeripherals] = useState<
    Map<Peripheral['id'], Peripheral>
  >(new Map());
  const [connectedPeripheral, setConnectedPeripheral] =
    useState<Peripheral | null>(null);

  function init() {
    BleManager.start();

    bleManagerEmitter.addListener(
      'BleManagerDiscoverPeripheral',
      (peripheral: Peripheral) => {
        if (peripheral.advertising.isConnectable && peripheral.name) {
          setPeripherals(
            (prev) => new Map([...prev, [peripheral.id, peripheral]])
          );
        }
      }
    );

    bleManagerEmitter.addListener(
      'BleManagerConnectPeripheral',
      (peripheral: Peripheral) => {
        setConnectedPeripheral(peripheral);
      }
    );

    bleManagerEmitter.addListener(
      'BleManagerDisconnectPeripheral',
      (peripheral) => {
        if (peripheral) setConnectedPeripheral(null);
      }
    );

    bleManagerEmitter.addListener('BleManagerStopScan', () => {
      setIsScanning(false);
      ToastAndroid.show('Scanning stopped...', ToastAndroid.SHORT);
    });
  }

  function startScan() {
    setPeripherals(new Map());
    setIsScanning(false);
    BleManager.scan([], 5, true)
      .then(async () => {
        setIsScanning(true);
        ToastAndroid.show('Scanning started...', ToastAndroid.SHORT);
      })
      .catch((error) => console.error(error));
  }

  async function connectDevice(id: Peripheral['id']) {
    setIsConnecting({ peripheralId: id, status: true });
    let connected = false;
    await BleManager.connect(id)
      .then(async () => {
        await BleManager.retrieveServices(id)
          .then((peripheral: Peripheral) => {
            ToastAndroid.showWithGravity(
              'Device connected successfully!',
              ToastAndroid.SHORT,
              10
            );
            if (peripheral) {
              connected = true;
              setConnectedPeripheral(peripheral);
            }
          })
          .catch((error) => ToastAndroid.show(error, ToastAndroid.SHORT));
      })
      .catch((error) => ToastAndroid.show(error, ToastAndroid.SHORT))
      .finally(() => setIsConnecting({ peripheralId: null, status: false }));
    return connected;
  }

  async function disconnectDevice() {
    if (connectedPeripheral) {
      await BleManager.disconnect(connectedPeripheral.id)
        .then(() => setConnectedPeripheral(null))
        .catch((error) => console.error(error));
    }
  }

  function readCharacteristic(service: string, characteristic: string) {
    if (connectedPeripheral) {
      BleManager.read(connectedPeripheral.id, service, characteristic)
        .then((data) =>
          console.log(
            `Read value from ${connectedPeripheral.id} - ${service} - ${characteristic}: ${data}`
          )
        )
        .catch((error) => console.error(error));
    }
  }

  function stopScan() {
    BleManager.stopScan()
      .then(() => {
        setIsScanning(false);
      })
      .catch((err) => console.error(err));
  }

  useEffect(() => {
    init();

    return () => {
      bleManagerEmitter.removeAllListeners('BleManagerDiscoverPeripheral');
      bleManagerEmitter.removeAllListeners('BleManagerConnectPeripheral');
      bleManagerEmitter.removeAllListeners('BleManagerDisconnectPeripheral');
      bleManagerEmitter.removeAllListeners(
        'BleManagerDidUpdateValueForCharacteristic'
      );
      bleManagerEmitter.removeAllListeners('BleManagerStopScan');
    };
  }, []);

  return (
    <DevicesContext.Provider
      value={{
        isConnecting,
        isScanning,
        peripherals,
        connectedPeripheral,
        startScan,
        stopScan,
        connectDevice,
        disconnectDevice,
        readCharacteristic,
      }}
    >
      {children}
    </DevicesContext.Provider>
  );
}
