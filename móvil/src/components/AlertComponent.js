import React from 'react'
import { Alert, VStack, HStack, Text, IconButton, CloseIcon } from "native-base";

export default function AlertComponent(props) {
    const {status, title, isOpen} = props;
    const close = ()=>{
        isOpen(false)
    }
    return (
        <Alert w="100%" status={status}>
            <VStack space={2} flexShrink={1} w="100%">
                <HStack flexShrink={1} space={2} justifyContent="space-between">
                    <HStack space={2} flexShrink={1}>
                        <Alert.Icon mt="1" />
                        <Text fontSize="md" color="coolGray.800">
                            {title}
                        </Text>
                    </HStack>
                    <IconButton variant="unstyled" onPress={close} icon={<CloseIcon size="3" color="coolGray.600" />} />
                </HStack>
            </VStack>
        </Alert>
    )
}