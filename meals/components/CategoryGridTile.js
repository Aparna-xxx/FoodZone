import { Pressable, View,Text,StyleSheet,Dimensions, Platform} from "react-native";
import React, { useState, useEffect } from 'react';
import Colors from '../utils/Colors';
const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;



import {
  useFonts,
  Manrope_200ExtraLight,
  Manrope_300Light,
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  Manrope_800ExtraBold,
} from '@expo-google-fonts/manrope';



function CategoryGridTile(props){

  let [fontsLoaded] = useFonts({
    Manrope_200ExtraLight,
    Manrope_300Light,
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Manrope_800ExtraBold,
  });

  if (!fontsLoaded) {
    return null;
  }
  else{

        return(
            <View style={styles.grid}>
                <Pressable style={({pressed})=>[styles.button, pressed?styles.iosPressed:null]} android_ripple={{color:Colors.WhiteBlue200}} onPress={props.onPress}>
                  <View style={[styles.innerGrid,{backgroundColor:Colors.White700}]}>
                    <Text style={styles.gridText}>{props.title} </Text>
                  </View>
                </Pressable>
            </View>
        )
  }
}

export default CategoryGridTile;

const styles=StyleSheet.create({
    grid:{
        flex:1,
        height:ScreenHeight/4,
        elevation:8,
        backgroundColor:'white',
        shadowColor:'black',
        shadowOpacity:0.25,
        shadowOffset:{width:0, height:2},
        shadowRadius:8,
        margin:10,
        borderRadius:10,
        overflow: Platform.OS==='android'?'hidden':'visible', 
        opacity:0.8,
        borderColor:'black',
        borderWidth:1,
        
      
        
    },
    iosPressed:{
      opacity:0.5,
    },
    innerGrid:{
      flex:1,
      padding:16,
      justifyContent:'center',
      alignItems:'center',
      borderRadius:10,
      
  
    },
    button:{
      flex:1,
      
    },
    gridText:{
      fontFamily:'Manrope_800ExtraBold',
      fontSize:ScreenWidth/21,
      color:'#000000',
    }
    
})