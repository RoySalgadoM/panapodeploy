import { View, Text } from 'react-native'
import React from 'react'
import { MinusIcon, IconButton, Progress, Box } from "native-base";

export default function ProgressBarComponent(props) {
    const {text, progress} = props;
    return (
        <View>
            <Box w="90%" maxW="400"  >
                <Progress colorScheme="emerald" value={progress} mx="4" />
            </Box>
            <Text style={{ textAlign: "center" }}>
                {text}
            </Text>
        </View>
    )
}