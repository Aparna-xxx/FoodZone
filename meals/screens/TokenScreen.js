import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';


const TokenScreen = () => {
  let logoFromFile = require('../assets/images/diamond.png');
  return (
    <View style={styles.container}>
      <QRCode
        value="Just some string value"
        logo={logoFromFile}
        size={300}
      />
    <Text style={styles.text}>
      Use this E-token to generate physical tokens from the canteen premises
    </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EEF5FF', // Using the background color you like
    paddingTop:80,
  },
  text: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 20,
    color: 'black',
    padding:30,
    textAlign:'center',
    marginTop:40,
    
  },
});

export default TokenScreen;
