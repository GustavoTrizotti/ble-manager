import { useDevices } from '@/src/context/devices.context';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Peripheral } from 'react-native-ble-manager';

interface CheckDeviceProps {
  isVisible: boolean;
  onClose: () => void;
  code: string;
  clearCode: () => void;
}

export function CheckDevice({
  isVisible,
  onClose,
  code,
  clearCode,
}: CheckDeviceProps) {
  const {
    startScan,
    peripherals,
    stopScan,
    isScanning,
    connectDevice,
    isConnecting,
  } = useDevices();

  const [peripheralScanned, setPeripheralScanned] = useState<Peripheral | null>(
    null
  );

  function findPeripheral(code: string) {
    if (Array.from(peripherals.values()).length > 0) {
      const peripheral: Peripheral | undefined = Array.from(
        peripherals.values()
      ).find((peripheral) => peripheral.name === code);
      if (peripheral) {
        setPeripheralScanned(peripheral);
      }
    }
  }

  async function connectQR(id: string) {
    return await connectDevice(id).then((res) => res);
  }

  function clearData() {
    onClose();
    clearCode();
  }

  useEffect(() => {
    if (code && isVisible) {
      startScan();
    }
  }, [isVisible]);

  useEffect(() => {
    findPeripheral(code);
  }, [peripherals]);

  useEffect(() => {
    if (peripheralScanned) {
      (async () => {
        stopScan();
        let success = false;
        while (!success) {
          success = await connectQR(peripheralScanned.id).then((res) => res);
        }
        clearData();
        router.push({
          pathname: '/device_details',
          params: {
            peripheralId: peripheralScanned.id,
          },
        });
      })();
    }
  }, [peripheralScanned]);

  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <View style={styles.modalContent}>
        <View style={styles.titleContainer}>
          <View
            style={{
              backgroundColor: 'transparent',
              flexDirection: 'row',
              gap: 12,
            }}
          >
            <MaterialIcons name="sensors" color="#fff" size={24} />
            <Text style={styles.title}>Escaneando dispositivo '{code}'</Text>
          </View>
          <Pressable
            onPress={() => {
              clearCode();
              onClose();
            }}
          >
            <MaterialIcons name="close" color="#fff" size={24} />
          </Pressable>
        </View>
        <View style={styles.contentContainer}>
          {isScanning && <ActivityIndicator size={42} color="#FFF" />}
          {!isScanning && (
            <>
              <View
                style={{
                  backgroundColor: 'transparent',
                  gap: 12,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={styles.title}>
                  Dispositivo encontrado com sucesso!
                </Text>
                <Text style={styles.subtitle}>
                  {peripheralScanned?.id || '...'}
                </Text>
              </View>
              {isConnecting && (
                <>
                  <Text style={styles.subtitle}>Conectando...</Text>
                  <ActivityIndicator color="#FFF" size={36} />
                </>
              )}
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    height: '40%',
    width: '100%',
    backgroundColor: '#333',
    borderTopRightRadius: 18,
    borderTopLeftRadius: 18,
    position: 'absolute',
    bottom: 0,
  },
  titleContainer: {
    height: '20%',
    backgroundColor: 'transparent',
    borderBottomWidth: 2,
    borderBottomColor: '#555',
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    margin: 12,
    marginBottom: 0,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  subtitle: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.5,
  },
  button: {
    padding: 16,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 12,
    borderRadius: 4,
  },
});
