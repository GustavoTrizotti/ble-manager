import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDevices } from '../context/devices.context';

export default function Settings() {
  const { changeName } = useDevices();
  const [name, setName] = useState<string>('');

  return (
    <SafeAreaView style={container}>
      <TouchableOpacity
        style={{ position: 'absolute', left: '5%', top: '5%' }}
        onPress={() => router.back()}
      >
        <Ionicons name="caret-back" color="#222" size={32} />
      </TouchableOpacity>
      <View style={titleContainer}>
        <Text style={title}>Native BLE</Text>
        <View
          style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'center',
            padding: 24,
            gap: 20,
          }}
        >
          <TextInput
            placeholder="Device name..."
            value={name}
            style={input}
            onChangeText={(text) => setName(text)}
          />
          <TouchableOpacity
            style={button}
            onPress={() => {
              changeName(name);
              setName('');
            }}
          >
            <Text style={buttonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const { container, title, titleContainer, input, button, buttonText } =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFF',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    titleContainer: {
      flex: 1,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: '#000',
    },
    subtitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#000',
      opacity: 0.5,
    },
    input: {
      fontSize: 18,
      padding: 16,
      borderRadius: 6,
      backgroundColor: '#F8F8F8',
      width: '100%',
    },
    button: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      gap: 16,
      padding: 14,
      backgroundColor: '#222',
      borderRadius: 4,
      elevation: 6,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonText: {
      color: '#FFF',
      fontSize: 18,
      fontWeight: 'bold',
    },
  });
