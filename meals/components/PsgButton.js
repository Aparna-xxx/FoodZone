    import React from 'react';
    import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
    import Colours from '../utils/Colors';

    function PsgButton(props) {
    return (
        <TouchableOpacity onPress={props.onPress} style={[styles.customButton, props.style]}>
        <Text style={[styles.customButtonText, props.textStyle]}>{props.title}</Text>
        </TouchableOpacity>
    );
    }

    export default PsgButton;

    const styles = StyleSheet.create({
    customButton: {
        width: '85%',
        backgroundColor: Colours.DarkBlue100,
        alignItems: 'center',
        height: 60,
        borderRadius: 50,
        justifyContent: 'center',
        marginTop: 20,
    },
    customButtonText: {
        color: 'white',
    },
    });
