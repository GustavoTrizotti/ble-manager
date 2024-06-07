import { ActivityIndicator, StyleSheet } from 'react-native';
import { Text, View } from '../utils/themed';
import { useDevices } from '@/src/context/devices.context';

interface DeviceHeaderProps {
  name: string;
  icon?: React.ReactElement | undefined;
}

export function DeviceHeader({ name, icon }: DeviceHeaderProps) {
  const { isScanning } = useDevices();

  return (
    <View style={deviceContainer}>
      <View style={deviceLabelContainer}>
        {icon || null}
        <Text style={deviceText}>{name}</Text>
      </View>
      {isScanning && <ActivityIndicator size={24} color="#000" />}
    </View>
  );
}

const { deviceContainer, deviceLabelContainer, deviceText } = StyleSheet.create(
  {
    deviceContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 8,
      borderBottomWidth: 2,
      borderBottomColor: '#00000010',
    },
    deviceLabelContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      rowGap: 4,
    },
    deviceText: {
      fontSize: 16,
      fontWeight: 'bold',
      opacity: 0.5,
      padding: 6,
    },
  }
);
