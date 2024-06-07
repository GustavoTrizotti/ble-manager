import { ListRenderItemInfo } from '@shopify/flash-list';
import { router, usePathname } from 'expo-router';
import { ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { Peripheral } from 'react-native-ble-manager';
import { Text, View } from '../utils/themed';
import { useDevices } from '@/src/context/devices.context';
import { useEffect } from 'react';

export function DeviceListItem({
  device,
}: {
  device: ListRenderItemInfo<Peripheral>;
}) {
  const { connectDevice, isConnecting, connectedPeripheral } = useDevices();
  const { id, rssi, name } = device.item;
  const pathname = usePathname();

  useEffect(() => {
    if (connectedPeripheral && pathname === '/devices') {
      router.push({
        pathname: '/device_details',
        params: {
          id: 1,
          peripheralId: connectedPeripheral.id,
        },
      });
    }
  }, [connectedPeripheral]);

  return (
    <View style={container}>
      <View style={infoContainer}>
        <Text style={textTitle}>{name || 'Sem nome'}</Text>
        <Text style={textSubtitle}>{id}</Text>
        <Text style={textSubtitle}>RSSI: {rssi}</Text>
      </View>
      <TouchableOpacity
        style={connectButton}
        onPress={async () => {
          await connectDevice(id);
        }}
      >
        {isConnecting.peripheralId !== id || !isConnecting.status ? (
          <Text style={connectButtonText}>Connect</Text>
        ) : (
          <ActivityIndicator size={24} color="#FFF" />
        )}
      </TouchableOpacity>
    </View>
  );
}

const {
  container,
  infoContainer,
  textTitle,
  textSubtitle,
  connectButton,
  connectButtonText,
} = StyleSheet.create({
  container: {
    flex: 1,
    height: 148,
    backgroundColor: '#FFF',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: 6,
    padding: 18,
    borderRadius: 4,
    elevation: 4,
  },
  infoContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexDirection: 'column',
    gap: 12,
    padding: 4,
  },
  textTitle: {
    color: '#000',
    fontSize: 17,
    fontWeight: 'bold',
  },
  textSubtitle: {
    color: '#000',
    opacity: 0.5,
    fontSize: 16,
    fontWeight: 'bold',
  },
  connectButton: {
    width: 90,
    backgroundColor: '#222',
    padding: 10,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  connectButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
