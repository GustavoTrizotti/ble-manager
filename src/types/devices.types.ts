import { Peripheral } from 'react-native-ble-manager';

export interface DevicesContextProps {
  isConnecting: Readonly<{ status: boolean; peripheralId: string | null }>;
  isScanning: boolean;
  peripherals: Map<Peripheral['id'], Peripheral>;
  connectedPeripheral: Peripheral | null;

  startScan(): void;
  stopScan(): void;
  connectDevice(id: Peripheral['id']): Promise<boolean>;
  disconnectDevice(): Promise<void>;
  readCharacteristic(service: string, characteristic: string): void;
}