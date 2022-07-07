import { View, Text, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { Flex, Box, PresenceTransition, IconButton, MinusIcon, AddIcon, Button } from "native-base";


export default function BoxHeaderComponentInit(props) {
    const { title, showIcon, Form, isOpen,bgColor, fontColor } = props;
    const [isShow, setIsShow] = useState(isOpen)
    const change = () => {
        setIsShow(!isShow)
    }
    return (
        <View style={styles.container}>
            <Box width="100%" bg={bgColor} borderBottomColor={"#042b61"} p="2" shadow={2} _text={{
                fontSize: "sm",
                fontWeight: "bold",
                color: "white"
            }}>
                <Flex direction="row" mt="1.5">
                    <View width={"80%"}>
                        <Text style={{ color: fontColor, fontSize: 17 }} >{title}</Text>
                    </View>

                    <View width={"20%"} style={styles.end}>
                        {
                            showIcon ?
                                isShow ?
                                    <PresenceTransition visible={isShow} initial={{
                                        opacity: 0,
                                        scale: 0
                                    }} animate={{
                                        opacity: 1,
                                        scale: 1,
                                        transition: {
                                            duration: 1000
                                        }
                                    }}>
                                        <IconButton onPress={change} icon={<MinusIcon on size="4" mt="0.5" color={fontColor} />} variant="ghost" _icon={{
                                        }} />
                                    </PresenceTransition>
                                    :
                                    <PresenceTransition visible={!isShow} initial={{
                                        opacity: 0,
                                        scale: 0
                                    }} animate={{
                                        opacity: 1,
                                        scale: 1,
                                        transition: {
                                            duration: 1000
                                        }
                                    }}>
                                        <IconButton onPress={change} icon={<AddIcon on size="4" mt="0.5" color={fontColor} />} variant="ghost" _icon={{
                                        }} />
                                    </PresenceTransition>
                                :
                                null
                        }
                    </View>
                </Flex>


            </Box>
            {isShow ?
                <PresenceTransition visible={isShow} initial={{
                    opacity: 0
                }} animate={{
                    opacity: 1,
                    transition: {
                        duration: 500
                    }
                }}>
                    <Box width="100%" bg="white" p="2" shadow={2} _text={{
                        fontSize: "md",
                        fontWeight: "bold",
                        color: "black"
                    }}>
                        {Form}
                       
                        
                    </Box>
                </PresenceTransition>
                : null
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        paddingTop: 30,
        backgroundColor: '#ffffff'
    },
    head: {
        height: 50,

        backgroundColor: '#ffffff',
        borderBottomWidth: 1
    },
    textBold: {
        fontWeight: "bold",
        textAlign: 'center'
    },
    text: {
        textAlign: 'center',
        fontWeight: '200',

    },
    dataWrapper: {
        marginTop: -1
    },
    row: {
        height: 40,
        backgroundColor: '#F7F8FA'
    },
    end: {
        alignItems: "flex-end",
        paddingRight: 5
    },
    w100: {
        width: "100%"
    }
});