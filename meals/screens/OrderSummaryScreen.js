import { useFocusEffect } from '@react-navigation/native';
import React, { useState } from 'react';
import { BackHandler, Dimensions, FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useGlobalContext } from '../context/globalContext';
import Colors from '../utils/Colors';

const ScreenWidth = Dimensions.get('window').width;

function OrderSummaryScreen({ navigation }) {
    const [showBackModal, setShowBackModal] = useState(false);
    const [showInsufficientFundsModal, setShowInsufficientFundsModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [walletBalance, setWalletBalance] = useState(0);
    const [orderId, setOrderId] = useState(null);
    
    const { fetchWalletBalance, userId, cartItems, clearCart, totalPrice, addWalletAmount, saveOrderToDataBase } = useGlobalContext();

    useFocusEffect(
        React.useCallback(() => {
            const loadWalletBalance = async () => {
                const balance = await fetchWalletBalance(userId);
                setWalletBalance(balance);
            };

            loadWalletBalance();

            const onBackPress = () => {
                setShowBackModal(true);
                return true;
            };

            const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () => backHandler.remove();
        }, [])
    );

    const handleUpiPayment = () => {
        console.log('Pay via UPI');
    };

    // const saveOrderToDB = async () => {
    //     try {
    //         const response = await saveOrderToDataBase();
    //         console.log(response);
    //         if (response) {
    //             clearCart();
    //             navigation.navigate('TokenScreen');
    //         }
    //     } catch (error) {
    //         console.error("Error saving order: ", error);
    //     }
    // };
    const saveOrderToDB = async () => {
        try {
            const response = await saveOrderToDataBase();
            console.log('Full response:', response);  // Log the full response to inspect its structure
            
            if (response && response.order_id) {  // Check if response and order_id exist
                const newOrderId = response.order_id;  // Extract order_id
                setOrderId(newOrderId);
                console.log("New order ID: ", newOrderId); // Log new order ID immediately
    
                clearCart();
                // Pass the newOrderId directly to navigation
                navigation.navigate('TokenScreen', { orderId: newOrderId });
                console.log("Navigating to TokenScreen with Order ID:", newOrderId); // Log the new order ID for navigation
            } else {
                console.error('No order_id in response:', response);
            }
        } catch (error) {
            console.error("Error saving order: ", error);
        }
    };
    
    

    const handlePsgWalletPayment = async () => {
        if (walletBalance < totalPrice) {
            setShowInsufficientFundsModal(true);
        } else {
            const newBalance = walletBalance - totalPrice;

            try {
                await addWalletAmount(userId, newBalance);
                setWalletBalance(newBalance);
                await saveOrderToDB();
                clearCart();
                navigation.navigate('TokenScreen', { orderId });
            } catch (error) {
                console.error("Error processing payment: ", error);
            }
        }
    };

    const handleConfirmBack = () => {
        setShowBackModal(false);
        clearCart();
        navigation.navigate('MealsCategory');
    };

    const handleCancelBack = () => {
        setShowBackModal(false);
    };

    const handleGoToWalletScreen = () => {
        setShowInsufficientFundsModal(false);
        navigation.navigate('PSG Wallet');
    };

    function renderCartItem(itemData) {
        const item = itemData.item;
        return (
            <View style={styles.cartItem}>
                <Text style={styles.itemText}>{item.title}</Text>
                <Text style={styles.itemText}>Quantity: {item.quantity}</Text>
                <Text style={styles.itemText}>Total Price: ₹{item.totalPrice.toFixed(2)}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Order Summary</Text>
            <FlatList
                data={cartItems}
                keyExtractor={(item) => item.id.toString()} // Ensure unique key
                renderItem={renderCartItem}
            />
            <View style={styles.totalPriceContainer}>
                <Text style={styles.totalPriceText}>Total Price: ₹{totalPrice.toFixed(2)}</Text>
                <Text style={styles.totalPriceText}>Wallet Balance: ₹{walletBalance.toFixed(2)}</Text>
            </View>
            <View style={styles.paymentButtonsContainer}>
                <Pressable style={styles.payButton1} onPress={handleUpiPayment}>
                    <Text style={styles.payButtonText}>Pay via UPI</Text>
                </Pressable>
                <Pressable style={styles.payButton2} onPress={() => setShowSuccessModal(true)}>
                    <Text style={styles.payButtonText}>Pay via PSG Wallet</Text>
                </Pressable>
            </View>

            {/* Confirmation Modal for Back Button */}
            <Modal
                transparent={true}
                visible={showBackModal}
                animationType="slide"
                onRequestClose={handleCancelBack}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>Going back will remove items from your cart. Do you want to proceed?</Text>
                        <View style={styles.modalButtonContainer}>
                            <Pressable style={styles.modalButton} onPress={handleCancelBack}>
                                <Text style={styles.modalButtonText}>Cancel</Text>
                            </Pressable>
                            <Pressable style={styles.modalButton} onPress={handleConfirmBack}>
                                <Text style={styles.modalButtonText}>Confirm</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Insufficient Funds Modal */}
            <Modal
                transparent={true}
                visible={showInsufficientFundsModal}
                animationType="slide"
                onRequestClose={() => setShowInsufficientFundsModal(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>Insufficient funds in your wallet. Please recharge to proceed.</Text>
                        <View style={styles.modalButtonContainer}>
                            <Pressable style={styles.modalButton} onPress={() => setShowInsufficientFundsModal(false)}>
                                <Text style={styles.modalButtonText}>Cancel</Text>
                            </Pressable>
                            <Pressable style={styles.modalButton} onPress={handleGoToWalletScreen}>
                                <Text style={styles.modalButtonText}>Go to Wallet</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Success Modal */}
            <Modal
                transparent={true}
                visible={showSuccessModal}
                animationType="slide"
                onRequestClose={() => setShowSuccessModal(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>Are you sure you want to continue with payment?</Text>
                        <View style={styles.modalButtonContainer}>
                            <Pressable
                                style={styles.modalButton}
                                onPress={async () => {
                                    await handlePsgWalletPayment();
                                    setShowSuccessModal(false); // Close modal after payment attempt
                                }}
                            >
                                <Text style={styles.modalButtonText}>OK</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

export default OrderSummaryScreen;

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: ScreenWidth * 0.8,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalButton: {
        backgroundColor: Colors.White700,
        padding: 10,
        borderRadius: 5,
        width: '40%',
        alignItems: 'center',
    },
    modalButtonText: {
        fontSize: 16,
        color: 'black',
    },
    container: {
        flex: 1,
        backgroundColor: Colors.WhiteBlue100,
        padding: 10,
    },
    title: {
        fontSize: 24,
        textAlign: 'center',
        marginVertical: 20,
    },
    cartItem: {
        backgroundColor: Colors.White700,
        padding: 10,
        marginVertical: 5,
        borderRadius: 10,
    },
    itemText: {
        fontSize: 16,
        color: 'black',
    },
    totalPriceContainer: {
        marginTop: 10,
        marginBottom: 10,
        alignItems: 'center',
    },
    totalPriceText: {
        fontSize: 18,
        color: 'black',
    },
    paymentButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: ScreenWidth / 20,
    },
    payButton1: {
        backgroundColor: 'black',
        padding: 15,
        borderRadius: 5,
        width: ScreenWidth / 3,
        marginVertical: 10,
        alignItems: 'center',
    },
    payButton2: {
        backgroundColor: Colors.DarkBlue100,
        padding: 15,
        borderRadius: 5,
        width: ScreenWidth / 3,
        marginVertical: 10,
        alignItems: 'center',
    },
    payButtonText: {
        color: Colors.White700,
        fontSize: 16,
        textAlign: 'center',
    },
});
