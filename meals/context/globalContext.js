import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { createContext, useContext, useState } from 'react';
import Category from '../server/models/category';
import Meal from '../server/models/meal';

const BASE_URL = "http://192.168.95.81:5000/FOOD-ZONE/";

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const [error, setError] = useState(null);
    const [cart, setCart] = useState([]);
    const [userId, setUserId] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [orderIds, setOrderIds] = useState([]);
    
    const login = async (regno, pwd) => {
        try {
            const response = await axios.get(`${BASE_URL}signin`, {
                params: { regno, pwd }
            });
            if (response.data.response === true) {
                await AsyncStorage.setItem('userId', regno);
                setUserId(regno);
                return true;
            } else if (response.data.response === 'invalidPWD') {
                return 'invalidPWD';
            } else {
                return false;
            }
        } catch (error) {
            console.error('Network Error:', error);
            setError('There was a network error. Please try again later.');
        }
    };

    const signup = async (regno, pwd) => {
        try {
            const response = await axios.post(`${BASE_URL}signup`, {
                regno,
                pwd
            });
            if (response.data.response === true) {
                await AsyncStorage.setItem('userId', regno);
                setUserId(regno);
                return true;
            } else if (response.data.response === 'exists') {
                return "exists";
            }
        } catch (error) {
            console.error('Network Error:', error);
            setError('There was a network error. Please try again later.');
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.clear();
            setUserId(null);
            clearCart(); // Clear cart on logout
        } catch (error) {
            console.error('Logout Error:', error);
            setError('There was a problem logging out. Please try again later.');
        }
    };

    const fetchMealsByCategory = async (categoryId) => {
        try {
            const response = await axios.get(`${BASE_URL}meals`, {
                params: { categoryId }
            });
            return response.data.map(item => new Meal(
                item.id,
                item.categoryIds,
                item.title,
                item.price,
                item.imageUrl,
                item.stock,
            ));
        } catch (error) {
            console.error('Network Error:', error);
            setError('There was a network error. Please try again later.');
        }
    };

    const fetchWalletBalance = async (userId) => {
        try {
            const response = await axios.get(`${BASE_URL}wallet`, {
                params: { userId }
            });
            return response.data.balance;
        } catch (error) {
            console.error('Network Error:', error);
            setError('There was a network error. Please try again later.');
        }
    };

    const addWalletAmount = async (userId, amount) => {
        try {
            const response = await axios.post(`${BASE_URL}addWalletAmount`, {
                amount,
                userId
            });
            return response.data.amount;
        } catch (error) {
            console.error('Network Error:', error);
            setError('There was a network error. Please try again later.');
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${BASE_URL}categories`);
            return response.data.map(item => new Category(item.id, item.title, item.color));
        } catch (error) {
            console.error('Network Error:', error);
            setError('There was a network error. Please try again later.');
        }
    };

    const addToCart = (mealId, quantity = 1) => {
        setCart(prevCart => {
            const existingMeal = prevCart.find(item => item.meal_id === mealId);
            if (existingMeal) {
                return prevCart.map(item =>
                    item.meal_id === mealId
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                return [...prevCart, { meal_id: mealId, quantity }];
            }
        });
    };
    
    const removeFromCart = (mealId, quantity = 1) => {
        setCart(prevCart => {
            const updatedCart = prevCart.map(item => {
                if (item.meal_id === mealId) {
                    return { ...item, quantity: item.quantity - quantity };
                }
                return item;
            }).filter(item => item.quantity > 0);
            return updatedCart;
        });
    };

    const clearCart = () => {
        setCart([]);
        setCartItems([]);
        setTotalPrice(0);
    };

    const fetchMealsByIds = async (mealIds) => {
        try {
            if (typeof mealIds === 'string') {
                mealIds = mealIds.split(',').map(id => id.trim());
            }
            if (!Array.isArray(mealIds)) {
                throw new Error("mealIds should be an array or comma-separated string");
            }
            const queryString = mealIds.map(id => `mealId=${id}`).join('&');
            const response = await fetch(`${BASE_URL}addMealsById?${queryString}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                if (response.status === 404) {
                    console.warn(`Meal with ID(s) ${mealIds} not found`);
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (!data || data.length === 0) {
                console.warn(`No data received for meal ID(s): ${mealIds}`);
                return [];
            }
            return data;
        } catch (error) {
            console.error("Error fetching meals by IDs:", error);
            return [];
        }
    };

    const getCartItems = async () => {
        const mealIds = cart.map(item => item.meal_id);
        if (mealIds.length === 0) return [];
        return await fetchMealsByIds(mealIds.join(','));
    };

    const captureUserId = (thisUser) => {
        setUserId(thisUser);
    };

    const captureCartItems = (items) => {
        setCartItems(items);
    };

    const captureTotalPrice = (price) => {
        setTotalPrice(price);
    };
    
    const saveOrderToDataBase = async () => {
        const user_id = userId.trim();
        const orderData = {
            user_id,
            cartItems: cartItems.map(item => ({
                meal_id: item.id,
                category_id: item.categoryIds[0],
                title: item.title,
                price: item.price,
                quantity: item.quantity,
            }))
        };

        try {
            const response = await axios.post(`${BASE_URL}saveOrder`, orderData);
            const orderId = response.order_id;
            
            setOrderIds(prevOrderIds => [...prevOrderIds, orderId]);
            return response;
        } catch (error) {
            console.error("Error saving order:", error);
        }
    };

    return (
        <GlobalContext.Provider value={{
            login,
            signup,
            logout,
            fetchMealsByCategory,
            fetchWalletBalance,
            addWalletAmount,
            fetchCategories,
            addToCart,
            removeFromCart,
            clearCart,
            fetchMealsByIds: getCartItems,
            captureUserId,
            captureCartItems,
            captureTotalPrice,
            saveOrderToDataBase,
            cart,
            userId,
            cartItems,
            totalPrice,
            orderIds,
            error
        }}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => useContext(GlobalContext);
