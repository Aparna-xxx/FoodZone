import {
    Manrope_200ExtraLight,
    Manrope_300Light,
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Manrope_800ExtraBold,
    useFonts,
} from '@expo-google-fonts/manrope';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
    ImageBackground,
    KeyboardAvoidingView,
    Modal,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import PsgButton from '../components/PsgButton';
import { useGlobalContext } from '../context/globalContext';
import Colours from '../utils/Colors';

const HomeScreen = () => {
    let [fontsLoaded] = useFonts({
        Manrope_200ExtraLight,
        Manrope_300Light,
        Manrope_400Regular,
        Manrope_500Medium,
        Manrope_600SemiBold,
        Manrope_700Bold,
        Manrope_800ExtraBold,
    });

    const Navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const [collegeID, setCollegeID] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const { login, signup, captureUserId } = useGlobalContext();

    const handleLogin = async () => {
        if (!collegeID || !password) {
            alert('Please enter both College ID and Password.');
            return;
        }
        const valid = await login(collegeID, password);
        if (valid === true) {
            await AsyncStorage.setItem('collegeID', collegeID);
            await AsyncStorage.setItem('password', password);
            captureUserId(collegeID);
            Navigation.navigate('MealsCategory', {collegeID});
        } else if (valid === 'invalidPWD') {
            alert('Invalid password. Please try again.');
        } else {
            alert("User doesn't exist");
        }
    };

    useEffect(() => {
        const checkSession = async () => {
            try {
                const savedCollegeID = await AsyncStorage.getItem('collegeID');
                const savedPassword = await AsyncStorage.getItem('password');
                console.log(savedCollegeID + " " + savedPassword);
                if (savedCollegeID && savedPassword) {
                    const valid = await login(savedCollegeID, savedPassword);
                    if (valid === true) {
                        setCollegeID(savedCollegeID);
                        setPassword(savedPassword);
                        captureUserId(savedCollegeID);
                        Navigation.navigate('MealsCategory', {collegeID: savedCollegeID});
                    }
                }
            } catch (error) {
                console.error(error);
            }
        };

        checkSession();
    }, []);

    if (!fontsLoaded) {
        return null;
    }

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    const createUser = async () => {
        if (!collegeID || !password || !confirmPassword) {
            alert('Please fill all the fields.');
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }

        const valid = await signup(collegeID, password);
        if (valid === true) {
            await AsyncStorage.setItem('collegeID', collegeID);
            await AsyncStorage.setItem('password', password);
            toggleModal();
            handleLogin();
        } else if (valid === 'exists') {
            alert('User already exists. Please login.');
        } else {
            alert('Signup failed. Please try again.');
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor={Colours.WhiteBlue200} barStyle="dark-content" />
            <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                <KeyboardAvoidingView
                    style={styles.container}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    enabled={false}
                >
                    <ImageBackground
                        source={require('../assets/images/psg.jpg')}
                        style={styles.backgroundContainer}
                        imageStyle={styles.backgroundImage}
                    >
                        <View style={styles.contentContainer}>
                            <View style={styles.cardTransparentContainer}></View>
                            <View style={styles.cardOpaqueContainer}>
                                <Text style={styles.cardTitleText}>Log into Food Zone</Text>
                                <View style={styles.loginBox}>
                                    <TextInput
                                        style={styles.loginText}
                                        placeholder="college ID"
                                        value={collegeID}
                                        onChangeText={setCollegeID}
                                    />
                                    <TextInput
                                        style={styles.loginText}
                                        placeholder="Password"
                                        secureTextEntry
                                        value={password}
                                        onChangeText={setPassword}
                                    />
                                </View>
                                <PsgButton title="Login" onPress={handleLogin} />
                                <Text style={styles.miniText}>
                                    Not a registered user?{' '}
                                    <Text style={styles.signup} onPress={toggleModal}>
                                        Sign up
                                    </Text>{' '}
                                    now!
                                </Text>
                            </View>
                        </View>
                    </ImageBackground>
                </KeyboardAvoidingView>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalBackground}>
                        <View style={styles.modalContainer}>
                            <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
                                <Ionicons name="close-circle-outline" size={32} style={styles.closeButtonText} />
                            </TouchableOpacity>
                            <Text style={styles.modalTitle}>Sign Up</Text>
                            <View style={styles.modalContent}>
                                <TextInput
                                    style={styles.loginText}
                                    placeholder="college ID"
                                    value={collegeID}
                                    onChangeText={setCollegeID}
                                />
                                <TextInput
                                    style={styles.loginText}
                                    placeholder="Password"
                                    secureTextEntry
                                    value={password}
                                    onChangeText={setPassword}
                                />
                                <TextInput
                                    style={styles.loginText}
                                    placeholder="Confirm Password"
                                    secureTextEntry
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                />
                                <PsgButton
                                    style={{ backgroundColor: Colours.DarkBlue100 }}
                                    textStyle={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}
                                    title="Sign Up"
                                    onPress={createUser}
                                />
                                <Text style={styles.switchToLoginText}>
                                    Already have an account?{' '}
                                    <Text style={styles.switchLink} onPress={toggleModal}>
                                        Login
                                    </Text>
                                </Text>
                            </View>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </SafeAreaView>
    );
};

export default HomeScreen;


    
    const styles = StyleSheet.create({
        safeArea: {
        flex: 1,
        },
        scrollContainer: {
        flexGrow: 1,
        },
        container: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        backgroundColor: Colours.WhiteBlue200,
        },
        contentContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        paddingBottom: '8%',
        },
        backgroundContainer: {
        flex: 1,
        width: '100%',
        },
        backgroundImage: {
        resizeMode: 'cover',
        opacity: 0.8,
        },
        cardTransparentContainer: {
        height: '60%',
        backgroundColor: '#fff',
        borderRadius: 20,
        width: '93%',
        opacity: 0.5,
        paddingVertical: 30,
        paddingHorizontal: 10,
        alignItems: 'center',
        },
        cardOpaqueContainer: {
        position: 'absolute',
        top: '26%',
        left: '2%',
        right: '2%',
        alignItems: 'center',
        borderRadius: 10,
        },
        cardTitleText: {
        color: Colours.DarkBlue100,
        fontFamily: 'Manrope_500Medium',
        fontSize: 28,
        },
        loginBox: {
        width: '85%',
        },
        loginText: {
        marginTop: '10%',
        paddingHorizontal: '5%',
        height: 55,
        borderWidth: 0.5,
        borderRadius: 10,
        backgroundColor: Colours.White300,
        borderColor: '#000000',
        width: '100%',
        },
        signup: {
        color: Colours.LinkRed,
        textDecorationLine: 'underline',
        },
        miniText: {
        color: Colours.DarkBlue100,
        paddingTop: '2%',
        fontWeight: 'bold',
        },
        modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        modalContainer: {
        width: '90%',
        backgroundColor: Colours.White300,
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        },
        modalTitle: {
        fontSize: 24,
        fontFamily: 'Manrope_500Medium',
        color: Colours.DarkBlue100,
        marginBottom: 20,
        },
        modalContent: {
        width: '100%',
        },
        closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        },
        closeButtonText: {
        color: Colours.DarkBlue100,
        },
        switchToLoginText: {
        marginTop: 20,
        color: Colours.DarkBlue100,
        },
        switchLink: {
        color: Colours.LinkRed,
        textDecorationLine: 'underline',
        },
    });
    