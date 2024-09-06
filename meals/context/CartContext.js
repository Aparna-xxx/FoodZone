import React, { createContext, useState } from 'react';

async function fetchMealsByIds(mealIds) {
    try {
        console.log("Fetching meals for IDs:", mealIds);  // Debugging statement

        // If mealIds is a string, split it into an array
        if (typeof mealIds === 'string') {
            mealIds = mealIds.split(',').map(id => id.trim());
        }

        // Ensure we have an array at this point
        if (!Array.isArray(mealIds)) {
            throw new Error("mealIds should be an array or comma-separated string");
        }

        // Map mealIds array to query parameters
        const queryString = mealIds.map(id => `mealId=${id}`).join('&');

        // Fetch the meals with the properly formatted URL
        const response = await fetch(`http://192.168.57.202:5000/FOOD-ZONE/addMealsById?${queryString}`, {
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
}



export const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState({});

    // Add a meal to the cart
    const addToCart = (mealId, quantity = 1) => {
        setCart((prevCart) => ({
            ...prevCart,
            [mealId]: (prevCart[mealId] || 0) + quantity,
        }));
    };

    // Remove a meal from the cart
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

    // Clear the entire cart
    const clearCart = () => {
        setCart({});
    };

    // Get items in the cart
    const getCartItems = async () => {
        const mealIds = Object.keys(cart);
        if (mealIds.length === 0) return [];
        return await fetchMealsByIds(mealIds.join(','));
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, fetchMealsByIds: getCartItems }}>
            {children}
        </CartContext.Provider>
    );
}
