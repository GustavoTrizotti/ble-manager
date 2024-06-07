import { Buffer } from 'buffer';
import { createContext, useContext, useEffect, useState } from 'react';
import { NativeEventEmitter, NativeModules } from 'react-native';
import BleManager from 'react-native-ble-manager';
import { ConnectionContextProps, DataProps } from '../types/connection.types';

const ConnectionContext = createContext<ConnectionContextProps | null>(null);
const bleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(bleManagerModule);

export function useConnection(): ConnectionContextProps {
  return useContext(ConnectionContext) as ConnectionContextProps;
}

export function ConnectionProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [data, setData] = useState<DataProps[]>([]);

  async function connectToCharacteristic(
    peripheralId: string,
    service: string,
    characteristic: string
  ) {
    await BleManager.retrieveServices(peripheralId);
    await BleManager.startNotification(peripheralId, service, characteristic);

    bleManagerEmitter.addListener(
      'BleManagerDidUpdateValueForCharacteristic',
      ({ value, peripheral, characteristic, service }) => {
        const data = String.fromCharCode(value);
        setData((prev) => [
          ...prev,
          { message: data, timestamp: Date.now(), isCommand: false },
        ]);
        console.log(
          `Received data: ${data} for characteristic ${characteristic} on service ${service} from peripheral ${peripheral}`
        );
      }
    );
  }

  function clearLog() {
    setData([]);
  }

  async function writeToCharacteristic(
    peripheralId: string,
    service: string,
    characteristic: string,
    data: string
  ) {
    if (data) {
      await BleManager.retrieveServices(peripheralId);
      await BleManager.startNotificationUseBuffer(
        peripheralId,
        service,
        characteristic,
        1
      );
      const bufferedData = Buffer.from(data);
      await BleManager.write(
        peripheralId,
        service,
        characteristic,
        bufferedData.toJSON().data
      ).catch((error) => {
        console.error(error);
      });
    }
  }

  useEffect(() => {
    bleManagerEmitter.addListener(
      'BleManagerDidUpdateValueForCharacteristic',
      ({ value }) => {
        const data = String.fromCharCode(...value);
        setData((prev) => [
          ...prev,
          {
            message: data.replace('Â', ''),
            timestamp: Date.now(),
            isCommand: false,
          },
        ]);
      }
    );
  }, []);

  return (
    <ConnectionContext.Provider
      value={{
        data,
        setData,
        connectToCharacteristic,
        writeToCharacteristic,
        clearLog,
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
}
