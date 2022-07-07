import { View, Text } from 'react-native'
import React from 'react'
import { MinusIcon, IconButton, Progress, Box } from "native-base";

export default function IconButtonComponent() {
  return (
    <IconButton alignItems={"center"} icon={<MinusIcon on size="4" mt="0.5" color="black" />} variant="ghost" _icon={{
    }} />
  )
}