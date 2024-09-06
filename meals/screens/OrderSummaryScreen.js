import React from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions, Pressable } from 'react-native';
import Colors from '../utils/Colors';

const ScreenWidth = Dimensions.get('window').width;

function OrderSummaryScreen({ route }) {
    const { cartItems, totalPrice } = route.params;

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

    // Handle payment via UPI
    const handleUpiPayment = () => {
        // Implement UPI payment logic here
        console.log('Pay via UPI');
    };

    // Handle payment via PSG wallet
    const handlePsgWalletPayment = () => {
        // Implement PSG wallet payment logic here
        console.log('Pay via PSG Wallet');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Order Summary</Text>
            <FlatList
                data={cartItems}
                keyExtractor={(item) => item.id}
                renderItem={renderCartItem}
            />
            <View style={styles.totalPriceContainer}>
                <Text style={styles.totalPriceText}>Total Price: ₹{totalPrice.toFixed(2)}</Text>
            </View>
            <View style={styles.paymentButtonsContainer}>
                <Pressable style={styles.payButton1} onPress={handleUpiPayment}>
                    <Text style={styles.payButtonText}>Pay via UPI</Text>
                </Pressable>
                <Pressable style={styles.payButton2} onPress={handlePsgWalletPayment}>
                    <Text style={styles.payButtonText}>Pay via PSG Wallet</Text>
                </Pressable>
            </View>
        </View>
    );
}

export default OrderSummaryScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.WhiteBlue100,
        padding: 10,
    },
    title: {
        fontFamily: 'Manrope_700Bold',
        fontSize: 24,
        color: 'black',
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
        fontFamily: 'Manrope_400Regular',
        fontSize: 16,
        color: 'black',
    },
    totalPriceContainer: {
        marginTop:10,
        marginBottom:10,
        alignItems: 'center',
    },
    totalPriceText: {
        fontFamily: 'Manrope_700Bold',
        fontSize: 18,
        color: 'black',
    },
    paymentButtonsContainer: {
       
        alignItems: 'stretch',
        flexDirection:'row',
        justifyContent:'space-between',
        paddingHorizontal:ScreenWidth/20,
    },
    payButton1: {
        backgroundColor: 'black', // Background color for buttons
        padding: 15,
        borderRadius: 5,
        width: ScreenWidth / 3, // Width of the button
        marginVertical: 10,
        alignItems: 'center',
    },
    payButton2: {
        backgroundColor: Colors.DarkBlue100, // Background color for buttons
        padding: 15,
        borderRadius: 5,
        width: ScreenWidth / 3, // Width of the button
        marginVertical: 10,
        alignItems: 'center',
    },
    payButtonText: {
        color: Colors.White700,
        fontFamily: 'Manrope_700Bold',
        fontSize: 16,
        textAlign:'center'
    },
});
