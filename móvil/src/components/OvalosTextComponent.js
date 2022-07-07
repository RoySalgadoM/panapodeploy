import { View, Text } from 'react-native'
import React from 'react'
import { Badge } from "native-base";

export default function OvalosTextComponent(props) {
  const {text, colorB } = props;
  return (
    <Badge bg={colorB} _text={{
      color:"#fff"
    }}>{text}</Badge>
  )
}