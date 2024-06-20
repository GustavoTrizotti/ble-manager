import { useConnection } from '@/src/context/connection.context';
import { useDevices } from '@/src/context/devices.context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import { PeripheralInfo } from 'react-native-ble-manager';

export function DetailsHeader() {
  const { connectedPeripheral, connectDevice, isConnecting, disconnectDevice } =
    useDevices();
  const { data, writeToCharacteristic } = useConnection();
  const { id, name } = connectedPeripheral || {};
  const isConnected = connectedPeripheral ? true : false;
  const { peripheralId } = useLocalSearchParams();
  const [battery, setBattery] = useState<number | null>(null);

  useEffect(() => {
    if (!battery && connectedPeripheral) {
      (async () =>
        await writeToCharacteristic(
          (connectedPeripheral as PeripheralInfo).id,
          'ffe0',
          'ffe1',
          'b'
        ))();
    }
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      setBattery(parseInt(data[0].message));
    }
  }, [data]);

  if (isConnecting.status) {
    return (
      <View style={header}>
        <Text style={headerTitle}>Conectando...</Text>
      </View>
    );
  }

  async function goBack() {
    router.back();
    await disconnectDevice();
    ToastAndroid.show('Dispositivo desconectado.', ToastAndroid.SHORT);
  }

  return (
    <View style={header}>
      <TouchableOpacity onPress={() => goBack()}>
        <Ionicons name="arrow-back" color="#FFF" size={24} />
      </TouchableOpacity>
      <View style={headerInfoContainer}>
        <Text style={headerTitle}>{name || 'Dispositivo ausente.'}</Text>
        <Text style={headerSubtitle}>
          {id || 'Sem dispositivo conectado...'}
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          gap: 4,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={headerSubtitle}>{battery || '00'}%</Text>
        <MaterialCommunityIcons name="battery" color="#FFF" size={20} />
      </View>
      <TouchableOpacity
        onPress={async () => {
          if (!isConnected) {
            if (connectedPeripheral?.id) {
              await connectDevice(connectedPeripheral?.id as string);
            } else {
              await connectDevice(peripheralId as string);
            }
          } else {
            await disconnectDevice();
            ToastAndroid.show('Dispositivo desconectado.', ToastAndroid.SHORT);
          }
        }}
      >
        {isConnected ? (
          <Ionicons name="link-outline" color="#FFF" size={24} />
        ) : (
          <Ionicons name="unlink" color="#FFF" size={24} />
        )}
      </TouchableOpacity>
    </View>
  );
}

const { header, headerInfoContainer, headerTitle, headerSubtitle } =
  StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 24,
      paddingTop: 48,
      backgroundColor: '#222',
    },
    headerInfoContainer: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#222',
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#FFF',
    },
    headerSubtitle: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#FFF',
      opacity: 0.5,
    },
  });
