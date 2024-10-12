import AntDesign from '@expo/vector-icons/AntDesign';
import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useGlobalContext } from '../context/globalContext';
import Colors from '../utils/Colors';

const ScreenWidth = Dimensions.get('window').width;

function CartScreen({ navigation }) {
    const { cart, addToCart, removeFromCart, clearCart, fetchMealsByIds, captureCartItems, captureTotalPrice } = useGlobalContext();
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const fetchCartItems = async () => {
            const mealIds = Object.keys(cart).map(item => item.meal_id); // ensure you get meal_ids
            if (mealIds.length > 0) {
                try {
                    const fetchedMeals = await fetchMealsByIds(mealIds);
                    if (fetchedMeals && fetchedMeals.length > 0) {
                        const items = fetchedMeals.map(meal => {
                            const cartItem = cart.find(item => item.meal_id === meal.id);
                            return {
                                ...meal,
                                quantity: cartItem ? cartItem.quantity : 0, // Use cartItem quantity
                                totalPrice: (cartItem ? cartItem.quantity : 0) * meal.price,
                            };
                        });
                        setCartItems(items);
                    } else {
                        setCartItems([]);
                    }
                } catch (error) {
                    console.error("Error fetching meals by IDs:", error);
                    setCartItems([]);
                }
            } else {
                setCartItems([]);
            }
        };
        fetchCartItems();
    }, [cart, fetchMealsByIds]);

    const totalPrice = cartItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0);

    function renderCartItem(itemData) {
        const item = itemData.item;
        return (
            <View style={styles.cartItem}>
                <View>
                    <Text style={styles.itemText}>{item.title}</Text>
                    <Text style={styles.itemText}>Quantity: {item.quantity}</Text>
                    <Text style={styles.itemText}>Total Price: ₹{(item.totalPrice).toFixed(2)}</Text>
                </View>
                <View style={styles.buttonContainer}>
                    <Pressable style={styles.button} onPress={() => removeFromCart(item.id)}>
                        <AntDesign name="minuscircle" size={24} color='black' />
                    </Pressable>
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                    <Pressable style={styles.button} onPress={() => addToCart(item.id)}>
                        <AntDesign name="pluscircle" size={24} color='black' />
                    </Pressable>
                </View>
            </View>
        );
    }

    const handleConfirmOrder = async () => {
        try {
            captureCartItems(cartItems);
            captureTotalPrice(totalPrice);
            navigation.navigate('OrderSummary'); // Navigate on success
        } catch (error) {
            console.error("Error saving cart:", error);
        }
    };

    return (
        <View style={styles.container}>
            {cartItems.length === 0 ? (
                <View style={styles.emptyCartContainer}>
                    <Text style={styles.emptyCartText}>Your cart is empty.</Text>
                </View>
            ) : (
                <>
                    <FlatList
                        data={cartItems}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderCartItem}
                    />
                    <View style={styles.totalPriceContainer}>
                        <Text style={styles.totalPriceText}>Total Price: ₹{totalPrice.toFixed(2)}</Text>
                    </View>
                    <View style={styles.buttonContainer}>
                        <Pressable style={styles.clearButton} onPress={clearCart}>
                            <Text style={styles.clearButtonText}>Clear Cart</Text>
                        </Pressable>
                        <Pressable
                            style={styles.confirmButton}
                            onPress={handleConfirmOrder}
                        >
                            <Text style={styles.confirmButtonText}>Confirm Order</Text>
                        </Pressable>
                    </View>
                </>
            )}
        </View>
    );
}

export default CartScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.WhiteBlue100,
        padding: 10,
    },
    cartItem: {
        backgroundColor: Colors.White700,
        padding: 10,
        marginVertical: 5,
        borderRadius: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemText: {
        fontFamily: 'Manrope_400Regular',
        fontSize: 16,
        color: 'black',
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: ScreenWidth / 2,
        justifyContent: 'space-between',
    },
    button: {
        backgroundColor: Colors.White700,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    quantityText: {
        fontFamily: 'Manrope_400Regular',
        fontSize: 16,
        color: 'black',
        marginHorizontal: 20,
    },
    totalPriceContainer: {
        marginTop: 10,
        alignItems: 'center',
    },
    totalPriceText: {
        fontFamily: 'Manrope_700Bold',
        fontSize: 18,
        color: 'black',
    },
    clearButton: {
        padding: 10,
        borderRadius: 5,
        width: ScreenWidth / 3,
        alignItems: 'center',
        backgroundColor: 'black',
        marginRight: 10, // Add margin for spacing
    },
    clearButtonText: {
        color: Colors.White700,
        fontFamily: 'Manrope_700Bold',
        fontSize: 16,
        textAlign: 'center',
        width: '100%',
    },
    confirmButton: {
        padding: 10,
        borderRadius: 5,
        width: ScreenWidth / 3,
        alignItems: 'center',
        backgroundColor: 'black',
    },
    confirmButtonText: {
        color: Colors.White700,
        fontFamily: 'Manrope_700Bold',
        fontSize: 16,
        textAlign: 'center',
        width: '100%',
    },
});
