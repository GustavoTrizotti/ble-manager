import { useCustomCamera } from '@/src/context/camera.context';
import { Ionicons } from '@expo/vector-icons';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Button, StyleSheet, TouchableOpacity } from 'react-native';
import { CheckDevice } from './check_device';
import { Text, View } from 'react-native';

export function Camera() {
  const { closeCamera } = useCustomCamera();
  const [permission, requestPermission] = useCameraPermissions();

  const [facing, setFacing] = useState<CameraType>('back');
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [code, setCode] = useState<string | null>(null);

  useEffect(() => setCode(null), []);

  useEffect(() => {
    if (code) {
      setIsVisible(true);
    }
  }, [code]);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.accessContainer}>
        <Text style={{ textAlign: 'center', ...styles.accessTitle }}>
          Permita que o aplicativo acesse a câmera
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          style={styles.accessButton}
        >
          <Text style={styles.accessText}>Permitir</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  }

  function clearCode() {
    setCode(null);
  }

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={closeCamera}>
          <Ionicons
            size={24}
            name="caret-back"
            color="#FFF"
            style={{ marginRight: 4 }}
          />
        </TouchableOpacity>
        <View style={{ backgroundColor: '#111', flexDirection: 'row', gap: 8 }}>
          <Ionicons size={24} name="qr-code" color="#FFF" />
          <Text style={styles.text}>Escanear Código</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
          <Ionicons size={24} name="camera-reverse" color="#FFF" />
        </TouchableOpacity>
      </View>
      <CameraView
        style={styles.camera}
        facing={facing}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
        onBarcodeScanned={(scan) => {
          setCode(scan.data);
        }}
      >
        <View style={styles.frame}></View>
      </CameraView>
      <CheckDevice
        isVisible={isVisible}
        onClose={() => setIsVisible(false)}
        code={code as string}
        clearCode={clearCode}
      />
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  accessContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  camera: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    backgroundColor: '#111',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingTop: '10%',
  },
  accessButton: {
    backgroundColor: '#FFF',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accessTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  accessText: {
    color: '#111',
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#555',
    borderRadius: 50,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  frame: {
    position: 'absolute',
    padding: 20,
    width: 280,
    height: 280,
    borderWidth: 4,
    borderColor: '#EEE',
    backgroundColor: 'transparent',
    borderStyle: 'dashed',
  },
});
