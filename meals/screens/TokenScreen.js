import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TokenScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello World</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EEF5FF', // Using the background color you like
  },
  text: {
    fontSize: 20,
    color: '#333', // Dark text color for contrast
  },
});

export default TokenScreen;
