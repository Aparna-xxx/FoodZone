import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CartProvider } from './context/CartContext';
import { GlobalProvider, useGlobalContext } from './context/globalContext';
import CartScreen from './screens/CartScreen';
import CategoryScreen from './screens/CategoryScreen';
import HomeScreen from './screens/HomeScreen';
import MealsDetailsScreen from './screens/MealsDetailsScreen';
import OrderSummaryScreen from './screens/OrderSummaryScreen';
import PSGWalletScreen from './screens/PSGWalletScreen';
import Colors from './utils/Colors';
import TokenScreen from './screens/TokenScreen';

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
      <Stack.Screen name="MealsCategory" component={CategoryScreen} />
      <Stack.Screen name="MealDescription" component={MealsDetailsScreen} />
      <Stack.Screen name="CartStack" component={CartScreen} />
      <Stack.Screen name="OrderSummary" component={OrderSummaryScreen} />
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="TokenScreen" component={TokenScreen} />
    </Stack.Navigator>
  );
}

function CustomDrawerContent({ navigation }) {
  const { userId, logout } = useGlobalContext();

  const handleLogout = async () => {
    await AsyncStorage.clear();
    logout();
    navigation.navigate('HomeScreen');
  };

  return (
    <View style={styles.drawerContainer}>
      <View style={styles.userInfoSection}>
        <Ionicons name="person-circle-outline" size={80} color={Colors.White700} />
        <Text style={styles.userName}>{userId}</Text>
      </View>

      <TouchableOpacity style={styles.drawerItem} onPress={() => navigation.navigate('Cart')}>
        <Ionicons name="cart" size={24} color={Colors.White700} />
        <Text style={styles.drawerText}>Cart</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.drawerItem} onPress={() => navigation.navigate('PSG Wallet')}>
        <Ionicons name="wallet" size={24} color={Colors.White700} />
        <Text style={styles.drawerText}>PSG Wallet</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.drawerItem} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color={Colors.White700} />
        <Text style={styles.drawerText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
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
          drawerIcon: ({ color, size }) => <Ionicons name="list" color={color} size={size} />,
        }}
      />
      <Drawer.Screen
        name="Cart"
        component={CartScreen}
        options={{
          drawerIcon: ({ color, size }) => <Ionicons name="cart" color={color} size={size} />,
        }}
      />
      <Drawer.Screen
        name="PSG Wallet"
        component={PSGWalletScreen}
        options={{
          drawerIcon: ({ color, size }) => <Ionicons name="wallet" color={color} size={size} />,
        }}
      />
    </Drawer.Navigator>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  return (
    <>
      <StatusBar style="light" />
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

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: 'black',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  userInfoSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  userName: {
    color: Colors.White700,
    fontSize: 18,
    marginTop: 10,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  drawerText: {
    color: Colors.White700,
    fontSize: 16,
    marginLeft: 10,
  },
});
