import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Text } from 'react-native';
import { useBluetooth } from '../context/bluetooth.context';
import { useDevices } from '../context/devices.context';
import { useCustomCamera } from '../context/camera.context';
import { Camera } from '../components/utils/camera';
import { SettingsButton } from '../components/settings/settings-button';

export default function Home() {
  const { startScan, isScanning } = useDevices();
  const { isBluetoothEnabled } = useBluetooth();
  const { isCameraOpen, openCamera } = useCustomCamera();

  if (isCameraOpen) {
    return <Camera />;
  }

  return (
    <SafeAreaView style={container}>
      <SettingsButton />
      <View style={titleContainer}>
        <Text style={title}>Native BLE</Text>
        <Text style={subtitle}>Bluetooth Low Energy</Text>
      </View>
      <TouchableOpacity
        style={button}
        disabled={isScanning || !isBluetoothEnabled}
        onPress={() => {
          if (!isCameraOpen) {
            openCamera();
          }
        }}
      >
        <Text style={textButton}>Escanear</Text>
        <FontAwesome name="qrcode" size={32} color="#FFF" />
      </TouchableOpacity>
      <TouchableOpacity
        style={button}
        onPress={async () => {
          startScan();
          router.push('/devices');
        }}
        disabled={isScanning || !isBluetoothEnabled}
      >
        {isScanning ? (
          <ActivityIndicator size={32} color="#FFF" />
        ) : (
          <Text style={textButton}>Verificar</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const { container, titleContainer, title, subtitle, button, textButton } =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFF',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 24,
    },
    titleContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      gap: 6,
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: '#000',
    },
    subtitle: {
      fontSize: 22,
      fontWeight: 'normal',
      color: '#000',
      opacity: 0.5,
    },
    button: {
      display: 'flex',
      flexDirection: 'row',
      gap: 16,
      padding: 14,
      backgroundColor: '#222',
      borderRadius: 4,
      marginTop: 4,
      elevation: 6,
      alignItems: 'center',
      justifyContent: 'center',
    },
    textButton: {
      color: '#FFF',
      fontSize: 18,
      fontWeight: 'bold',
    },
  });
