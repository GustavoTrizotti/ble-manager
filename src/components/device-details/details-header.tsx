import { useDevices } from '@/src/context/devices.context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, ToastAndroid, TouchableOpacity } from 'react-native';
import { Text, View } from '../utils/themed';

export function DetailsHeader() {
  const { connectedPeripheral, connectDevice, isConnecting, disconnectDevice } =
    useDevices();
  const { id, name } = connectedPeripheral || {};
  const isConnected = connectedPeripheral ? true : false;

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
        <Text style={headerTitle}>{name || 'Dispositivo não encontrado.'}</Text>
        <Text style={headerSubtitle}>{id || 'Sem dispositivo...'}</Text>
      </View>
      <TouchableOpacity
        onPress={async () => {
          if (!isConnected) {
            await connectDevice(connectedPeripheral?.id as string);
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
