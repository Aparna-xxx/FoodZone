// screens/SignupScreen.js

import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, Pressable } from 'react-native';
import Colors from '../utils/Colors';

const SignupScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#999" />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry={true} placeholderTextColor="#999" />
      <TextInput style={styles.input} placeholder="Confirm Password" secureTextEntry={true} placeholderTextColor="#999" />
      <Pressable style={styles.signupButton} onPress={() => navigation.replace('MealsCategory')}>
        <Text style={styles.signupButtonText}>Sign Up</Text>
      </Pressable>
      <Pressable onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginText}>Already have an account? Login</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.WhiteBlue100,
    padding: 20,
  },
  title: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 24,
    color: 'black',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 10,
    backgroundColor: Colors.White700,
    borderRadius: 5,
    fontFamily: 'Manrope_400Regular',
    color: 'black',
    fontSize: 16,
  },
  signupButton: {
    width: '100%',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    backgroundColor: 'green',
    marginTop: 20,
  },
  signupButtonText: {
    color: Colors.White700,
    fontFamily: 'Manrope_700Bold',
    fontSize: 16,
  },
  loginText: {
    marginTop: 20,
    color: 'black',
    fontFamily: 'Manrope_400Regular',
    fontSize: 14,
  },
});

export default SignupScreen;
