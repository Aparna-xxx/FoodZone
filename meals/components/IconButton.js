import { StyleSheet, Pressable } from "react-native"
import {Ionicons} from '@expo/vector-icons';
function IconButton(props){
    return (
        <Pressable onPress={props.onPress} style={({pressed})=>pressed && styles.Pressed}>
            <Ionicons name={props.icon} size={24} color={props.color}/>
        </Pressable>
    )
}

export default IconButton;

const styles=StyleSheet.create({
    Pressed:{
        opacity:0.5,
    }
})