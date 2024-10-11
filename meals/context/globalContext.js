import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { createContext, useContext, useState } from 'react';
import Category from '../server/models/category';
import Meal from '../server/models/meal';

const BASE_URL = "http://192.168.1.144:5000/FOOD-ZONE/";

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const [error, setError] = useState(null);
    const [cart, setCart] = useState({});
    const [userId, setUserId] = useState(null);

    const login = async (regno, pwd) => {
        try {
            const response = await axios.get(`${BASE_URL}signin`, {
                params: { regno, pwd }
            });
            if (response.data.response == true) {
                await AsyncStorage.setItem('userId', regno); // Save user ID in AsyncStorage
                setUserId(regno); // Capture user ID in state
                return true;
            } else if(response.data.response == 'invalidPWD'){
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
            if (response.data.response == true) {
                await AsyncStorage.setItem('userId', regno); // Save user ID in AsyncStorage
                setUserId(regno); // Capture user ID in state
                return true;
            } else if (response.data.response == 'exists'){
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
            const data = response.data;
            return data.map(item => new Meal(
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

    const addToCart = (mealId, quantity) => {
        setCart((prevCart) => {
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
        setCart((prevCart) => {
            const updatedCart = { ...prevCart };
            if (updatedCart[mealId] > quantity) {
                updatedCart[mealId] -= quantity;
            } else {
                delete updatedCart[mealId];
            }
            return updatedCart;
        });
    };

    const clearCart = () => {
        setCart({});
    };

    const captureUserId = (thisUser) => {
        setUserId(thisUser);
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
            captureUserId,
            cart,
            userId,
            error
        }}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => useContext(GlobalContext);
