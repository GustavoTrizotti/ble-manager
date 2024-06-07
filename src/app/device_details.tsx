import { useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Details } from '../components/device-details/details';
import { DetailsHeader } from '../components/device-details/details-header';
import { DetailsInput } from '../components/device-details/details-input';

export default function DeviceDetails() {
  const params = useLocalSearchParams();
  const [peripheralId, setPeripheralId] = useState<string>(
    params.peripheralId as string
  );

  return (
    <SafeAreaView style={container}>
      <DetailsHeader peripheralId={peripheralId} />
      <Details />
      <DetailsInput />
      <StatusBar style="light" />
    </SafeAreaView>
  );
}

const { container } = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    justifyContent: 'space-between',
  },
});
