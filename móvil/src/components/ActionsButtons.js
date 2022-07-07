import { View, Text } from 'react-native'
import React from 'react'
import { Icon } from 'react-native-elements';
import { Button } from "native-base";

export default function ActionsButtons(props) {
    const {color, name, bgColor, action} = props;
    return (
        <View style={{alignItems:"center", padding:10}}>
            <Button onPress={action} w={"40%"} backgroundColor={bgColor} startIcon leftIcon={<Icon type="font-awesome" name={name} color={color}/>}>
            </Button>
        </View>
    )
}