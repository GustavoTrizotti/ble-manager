import { useConnection } from '@/src/context/connection.context';
import { useDevices } from '@/src/context/devices.context';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { PeripheralInfo } from 'react-native-ble-manager';

export function DetailsInput() {
  const { connectedPeripheral } = useDevices();
  const { writeToCharacteristic, setData } = useConnection();
  const [command, setCommand] = useState<string>('');

  return (
    <View style={container}>
      <TextInput
        placeholder="Digite o comando..."
        style={input}
        placeholderTextColor="#BBB"
        value={command}
        onChangeText={(text) => setCommand(text)}
      />
      <TouchableOpacity
        style={button}
        onPress={async () => {
          if (connectedPeripheral) {
            setData((prev) => [
              ...prev,
              { message: command, timestamp: Date.now(), isCommand: true },
            ]);
            await writeToCharacteristic(
              (connectedPeripheral as PeripheralInfo).id,
              'ffe0',
              'ffe1',
              command
            );
            setCommand('');
          }
        }}
      >
        <Ionicons name="send" size={24} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}

const { container, input, button } = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#EFEFEFEF',
  },
  input: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 4,
    color: '#222',
  },
  button: {
    backgroundColor: '#222',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
});
