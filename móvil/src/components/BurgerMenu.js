import React from 'react'
import { Icon } from 'react-native-elements';
import { Text,Box, Center, Button } from "native-base";

export default function BurgerMenu() {
    return (
        <Center>
            <Box ml={-8} h="80%" w="90%" alignItems="flex-start">
                <Button onPress={() => console.log("first")} backgroundColor={"white"} startIcon leftIcon={<Icon type="font-awesome" name={"bars"} color={"black"} />}>
                    
                </Button>
            </Box>
        </Center>

    )
}