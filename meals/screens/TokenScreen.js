import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { BackHandler, Button, StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const TokenScreen = ({ route }) => {
  const navigation = useNavigation();
  const orderId = route.params?.orderId;
  let logoFromFile = require('../assets/images/diamond.png');

  
  useEffect(() => {
    const backAction = () => {
      navigation.navigate('MealsCategory');
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <QRCode
        value={orderId || "No Order ID"}
        logo={logoFromFile}
        size={300}
      />
      <Text style={styles.text}>
        Use this E-token to generate physical tokens from the canteen premises
      </Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Home"
          onPress={() => navigation.navigate('MealsCategory')}
          color="#000000"
        />
      </View>
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
  buttonContainer: {
    marginTop: 40,
    width: '40%',
    alignSelf: 'center',
  },
});

export default TokenScreen;
