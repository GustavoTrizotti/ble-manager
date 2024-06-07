import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Details } from '../components/device-details/details';
import { DetailsHeader } from '../components/device-details/details-header';
import { DetailsInput } from '../components/device-details/details-input';

export default function DeviceDetails() {
  return (
    <SafeAreaView style={container}>
      <DetailsHeader />
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
