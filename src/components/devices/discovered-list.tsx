import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { StyleSheet } from 'react-native';
import { Text, View } from '../utils/themed';
import { DeviceHeader } from './device-header';
import { DeviceListItem } from './device-list-item';
import { useDevices } from '@/src/context/devices.context';

export function DiscoveredDeviceList() {
  const { peripherals } = useDevices();

  return (
    <View style={styles.container}>
      <DeviceHeader
        name="Discovered Devices"
        icon={
          <Ionicons name="phone-portrait-outline" color="#00000050" size={24} />
        }
      />
      {Array.from(peripherals).length === 0 ? (
        <Text style={styles.notFoundText}>
          No new device has been discovered...
        </Text>
      ) : (
        <FlashList
          contentContainerStyle={{
            padding: 6,
          }}
          data={Array.from(peripherals.values())}
          renderItem={(device) => <DeviceListItem device={device} />}
          estimatedItemSize={128}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  notFoundText: {
    fontSize: 16,
    fontWeight: 'normal',
    padding: 12,
    opacity: 0.4,
  },
});
