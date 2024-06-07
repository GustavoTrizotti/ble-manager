import { useConnection } from '@/src/context/connection.context';
import { FlashList } from '@shopify/flash-list';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '../utils/themed';

export function Details() {
  const { data, clearLog } = useConnection();

  useEffect(() => {
    clearLog();
  }, []);

  return (
    <View style={container}>
      <FlashList
        data={data}
        estimatedItemSize={48}
        contentContainerStyle={{
          padding: 4,
        }}
        renderItem={({ item: detail }) => (
          <View style={commandContainer}>
            <Text style={dateText}>
              {new Date(detail.timestamp).toLocaleString()}
            </Text>
            <Text style={detail.isCommand ? commandText : messageText}>
              {detail.message}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const { container, commandContainer, dateText, commandText, messageText } =
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
    },
    commandContainer: {
      flexDirection: 'row',
      gap: 8,
      borderBottomWidth: 1,
      borderBottomColor: '#EFEFEFEE',
      alignItems: 'center',
      alignContent: 'center',
      height: 40,
      padding: 8,
    },
    dateText: {
      fontSize: 14,
      color: '#BBB',
    },
    commandText: {
      flex: 1,
      fontSize: 16,
      color: '#C99740',
    },
    messageText: {
      flex: 1,
      fontSize: 16,
      color: '#222',
    },
  });
