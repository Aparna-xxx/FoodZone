import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useGlobalContext } from '../context/globalContext';
import Colors from '../utils/Colors';

const ScreenWidth = Dimensions.get('window').width;

function PSGWalletScreen() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState('');
  const [walletBalance, setWalletBalance] = useState(null);
  const [lastRechargeAmount, setLastRechargeAmount] = useState(null); // New state to store the last recharge amount

  const { fetchWalletBalance, userId, addWalletAmount } = useGlobalContext();

  const loadBalance = async () => {
    try {
      const balance = await fetchWalletBalance(userId);
      const numericBalance = Number(balance); // Type cast to number

      if (!isNaN(numericBalance)) {
        setWalletBalance(numericBalance);
      } else {
        throw new Error('Invalid balance value');
      }
    } catch (err) {
      setError('Failed to load balance');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch wallet balance when the component mounts
    loadBalance();
  }, []);

  const handleRecharge = () => {
    setModalVisible(true);
  };

  const handleAddAmount = async () => {
    const amount = Number(rechargeAmount);
    if (isNaN(amount) || amount < 100 || amount > 2000) {
      alert('Please enter a valid amount between ₹100 and ₹2000.');
      return;
    }

    try {
      const finalAmount = amount + walletBalance;
      await addWalletAmount(userId, finalAmount);
      setLastRechargeAmount(amount); // Store the recharge amount before resetting
      await loadBalance(); // Refresh the balance after a successful recharge
      setModalVisible(false);
      setRechargeAmount(''); // Clear the input field
      setSuccessModalVisible(true); // Show success modal after recharge
    } catch (err) {
      alert('Failed to add amount to wallet.');
    }
  };

  const handleSuccessModalClose = () => {
    setSuccessModalVisible(false);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.Black} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PSG Wallet</Text>
      <Text style={styles.balanceText}>
        Current Balance: ₹{walletBalance !== null ? walletBalance.toFixed(2) : '0.00'}
      </Text>
      <Pressable style={styles.rechargeButton} onPress={handleRecharge}>
        <Text style={styles.rechargeButtonText}>Recharge via UPI</Text>
      </Pressable>

      {/* Recharge Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Recharge Wallet</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter amount"
              keyboardType="numeric"
              value={rechargeAmount}
              onChangeText={setRechargeAmount}
            />
            <Pressable style={styles.addButton} onPress={handleAddAmount}>
              <Text style={styles.addButtonText}>Add Amount</Text>
            </Pressable>
            <Pressable style={styles.cancelButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={successModalVisible}
        onRequestClose={handleSuccessModalClose}
      >
        <View style={styles.successModalContainer}>
          <View style={styles.successModalView}>
            <MaterialIcons name="check-circle" size={64} color={Colors.SuccessGreen} />
            <Text style={styles.successText}>Recharge Successful!</Text>
            <Text style={styles.successAmountText}>₹{lastRechargeAmount} has been added to your wallet.</Text>
            <Pressable style={styles.successButton} onPress={handleSuccessModalClose}>
              <Text style={styles.successButtonText}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default PSGWalletScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WhiteBlue100,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 24,
    color: 'black',
    marginBottom: 20,
  },
  balanceText: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 18,
    color: 'black',
    marginBottom: 20,
  },
  rechargeButton: {
    backgroundColor: 'black',
    padding: 15,
    borderRadius: 5,
    width: ScreenWidth / 1.5,
    alignItems: 'center',
  },
  rechargeButtonText: {
    color: Colors.White700,
    fontFamily: 'Manrope_700Bold',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontFamily: 'Manrope_400Regular',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    width: ScreenWidth * 0.8,
  },
  modalTitle: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 20,
    color: 'black',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    fontFamily: 'Manrope_400Regular',
    fontSize: 16,
    marginBottom: 20,
    color: 'black',
  },
  addButton: {
    backgroundColor: 'black',
    padding: 15,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  addButtonText: {
    color: Colors.White700,
    fontFamily: 'Manrope_700Bold',
    fontSize: 16,
  },
  cancelButton: {
    padding: 15,
    width: '100%',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'black',
    fontFamily: 'Manrope_400Regular',
    fontSize: 16,
  },
  successModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  successModalView: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    width: ScreenWidth * 0.8,
  },
  successText: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 24,
    color: Colors.SuccessGreen,
    marginTop: 20,
  },
  successAmountText: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 18,
    color: 'black',
    marginTop: 10,
  },
  successButton: {
    backgroundColor: 'black',
    padding: 15,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  successButtonText: {
    color: Colors.White700,
    fontFamily: 'Manrope_700Bold',
    fontSize: 16,
  },
});
