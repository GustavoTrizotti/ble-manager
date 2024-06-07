import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DeviceList } from '../components/devices/device-list';
import { Text, View } from '../components/utils/themed';
import { useDevices } from '../context/devices.context';

export default function Devices() {
  const { startScan } = useDevices();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleContainer}>
        <Link href="/">
          <Ionicons name="arrow-back" size={24} />
        </Link>
        <Text style={styles.title}>Devices</Text>
        <TouchableOpacity onPress={startScan}>
          <Ionicons name="refresh-circle" size={36} />
        </TouchableOpacity>
      </View>
      <DeviceList />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    padding: 12,
  },
  titleContainer: {
    width: '100%',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
