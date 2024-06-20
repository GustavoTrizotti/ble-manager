import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, TouchableOpacity } from 'react-native';

export function SettingsButton() {
  return (
    <TouchableOpacity style={button} onPress={() => router.push('settings')}>
      <Ionicons name="settings" size={32} color="#FFF" />
    </TouchableOpacity>
  );
}

const { button } = StyleSheet.create({
  button: {
    position: 'absolute',
    top: '3%',
    right: '5%',
    padding: 12,
    borderRadius: 6,
    backgroundColor: '#222222',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
});
