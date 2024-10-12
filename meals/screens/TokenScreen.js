import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const TokenScreen = ({ route }) => {
  // Access orderId from route.params. Default to null if not provided.
  const orderId = route.params?.orderId; 
  console.log(orderId);
  let logoFromFile = require('../assets/images/diamond.png');

  return (
    <View style={styles.container}>
      <QRCode
        value={orderId || "No Order ID"} // Use orderId as the value for the QR code
        logo={logoFromFile}
        size={300}
      />
      <Text style={styles.text}>
        Use this E-token to generate physical tokens from the canteen premises
      </Text>
      <Text style={styles.orderIdText}>
        Order ID: {orderId || 'Not Available'} {/* Display the order ID or a fallback message */}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#EEF5FF',
    paddingTop: 80,
  },
  text: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 20,
    color: 'black',
    padding: 30,
    textAlign: 'center',
    marginTop: 40,
  },
  orderIdText: {
    fontSize: 16,
    color: 'black',
  },
});

export default TokenScreen;
