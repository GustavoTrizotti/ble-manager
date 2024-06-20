import { StyleSheet } from 'react-native';
import { View } from 'react-native';
import { DiscoveredDeviceList } from './discovered-list';

export function DeviceList() {
  return (
    <View style={containerList}>
      <DiscoveredDeviceList />
    </View>
  );
}

const { containerList } = StyleSheet.create({
  containerList: {
    flex: 1,
    width: '100%',
    padding: 8,
  },
});
