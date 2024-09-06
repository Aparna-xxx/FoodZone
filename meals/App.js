import { Ionicons } from '@expo/vector-icons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { CartProvider } from './context/CartContext';
import { GlobalProvider } from './context/globalContext';
import CartScreen from './screens/CartScreen';
import CategoryScreen from './screens/CategoryScreen';
import HomeScreen from './screens/HomeScreen';
import MealsDetailsScreen from './screens/MealsDetailsScreen';
import OrderSummaryScreen from './screens/OrderSummaryScreen';
import PSGWalletScreen from './screens/PSGWalletScreen';
import SignupScreen from './screens/SignupScreen';
import Colors from './utils/Colors';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function StackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.WhiteBlue100 },
      }}
    >
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="MealsCategory" component={CategoryScreen} />
      <Stack.Screen name="MealDescription" component={MealsDetailsScreen} />
      <Stack.Screen name="CartStack" component={CartScreen} />
      <Stack.Screen name="OrderSummary" component={OrderSummaryScreen} />
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
    </Stack.Navigator>
  );
}

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: 'black' },
        headerTintColor: Colors.White700,
        sceneContainerStyle: { backgroundColor: Colors.WhiteBlue100 },
        drawerContentStyle: { backgroundColor: 'black' },
        drawerInactiveTintColor: Colors.White700,
        drawerActiveTintColor: Colors.WhiteBlue400,
        
      }}
    >
      <Drawer.Screen
        name="PSG FoodZone"
        component={StackNavigator}
        options={{
          drawerIcon: ({ color, size }) => <Ionicons name='list' color={color} size={size} />,
        }}
      />
      <Drawer.Screen
        name="Cart"
        component={CartScreen}
        options={{
          drawerIcon: ({ color, size }) => <Ionicons name='cart' color={color} size={size} />,
        }}
      />
      <Drawer.Screen
        name="PSG Wallet"
        component={PSGWalletScreen}
        options={{
          drawerIcon: ({ color, size }) => <Ionicons name='wallet' color={color} size={size} />,
        }}
      />
    </Drawer.Navigator>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    // Check for authentication state, e.g., AsyncStorage or API call.
    // Example: setIsAuthenticated(true) if user is authenticated.
  }, []);

  return (
    <>
      <StatusBar style='light' />
      <GlobalProvider>
        <CartProvider>
          <NavigationContainer>
            {isAuthenticated ? <DrawerNavigator /> : <StackNavigator />}
          </NavigationContainer>
        </CartProvider>
      </GlobalProvider>
      
    </>
  );
}
