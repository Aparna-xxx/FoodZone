import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { BackHandler, Button, Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useGlobalContext } from '../context/globalContext';
import Colours from '../utils/Colors';

const { width, height } = Dimensions.get('window');

const TokenScreen = ({ route }) => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const logoFromFile = require('../assets/images/diamond.png');

  const { orderIds } = useGlobalContext();

  

  useEffect(() => {
    const backAction = () => {
      console.log(orderIds);
      navigation.navigate('MealsCategory');
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [navigation]);

  const openModal = (orderId) => {
    setSelectedOrderId(orderId);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedOrderId(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Orders</Text>
      <View style={styles.cardContainer}>
        {orderIds.length > 0 ? (
          orderIds.map((orderId, index) => (
            <TouchableOpacity key={index} onPress={() => openModal(orderId)} style={styles.card}>
              <QRCode
                value={orderId}
                logo={logoFromFile}
                size={80}
              />
              <Text style={styles.cardText}> Order ID: {orderId}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noOrdersText}>No Orders Available</Text>
        )}
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Home"
          onPress={() => navigation.navigate('MealsCategory')}
          color="#000000"
        />
      </View>

      {/* Modal for displaying the QR code */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
            <QRCode
              value={selectedOrderId || "No Order ID"}
              logo={logoFromFile}
              size={300}
            />
            <Text style={styles.modalText}>
              Use this E-token to generate physical tokens from the canteen premises
            </Text>
          </View>
        </View>
      </Modal>
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
  title: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 24,
    color: '#333',
    marginBottom: 20,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 10,
    margin: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  cardText: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 16,
    color: '#333',
    marginTop: 5,
  },
  noOrdersText: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
  buttonContainer: {
    marginTop: 20,
    width: '40%',
    alignSelf: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',

  },
  modalContent: {
    width: '90%',
    height:'60%',
    backgroundColor: '#ffffff',
    paddingTop:'15%',
    borderRadius: 10,
    alignItems: 'center',
    elevation: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  closeButtonText: {
    fontSize: 16,
    color:Colours.LinkRed,
    fontWeight:'bold',
  },
  modalText: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 16,
    color: '#333',
    marginTop: 20,
    textAlign: 'center',
  },
});

export default TokenScreen;
