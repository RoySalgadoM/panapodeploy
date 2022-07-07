import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, Text } from 'react-native';
import { Table, TableWrapper, Row, Rows, Col } from 'react-native-table-component';
import { Icon } from 'react-native-elements';
import FilterComponent from "../components/FilterComponent"
import { Box, MinusIcon, Flex, AddIcon, IconButton, VStack, Center, Button, PresenceTransition, FormControl, Input } from "native-base";
import ActionsButtons from './ActionsButtons';
import Loading from './Loading';
import AlertComponent from './AlertComponent';


export default function TableComponent(props) {
    const { title, tableHead, widthArr, data, showIcon, isOpen, isSearch, setisLoadingTable, isLoadingTable } = props;
    const [isShow, setIsShow] = useState(isOpen)
    const [filterText, setFilterText] = useState("");
    const filteredItems = data.filter(
        (item) => {
            if (filterText === "") {
                return item = item
            } else if (item[1].toLowerCase().includes(filterText.toLowerCase())) {
                return item = item
            }
        });

    const myRef = React.useRef({});
    React.useEffect(() => {
        const styleObj = {
            borderWidth: 4,
            borderRadius: 4,
            borderColor: "#22D3EE"
        };
    }, []);
    const change = () => {
        setIsShow(!isShow)
    }


    return (
        <View style={styles.container}>
            <Box width="100%" bg="#049474" borderBottomColor={"#042b61"} p="2" shadow={2} _text={{
                fontSize: "md",
                fontWeight: "bold",
                color: "white"
            }} ref={myRef}>
                <Flex direction="row" mt="1.5">
                    <View width={"50%"}>
                        <Text style={{ color: "#ffffff", fontSize: 17 }} >{title}</Text>
                    </View>

                    <View width={"50%"} style={styles.end}>
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
                                        <IconButton onPress={change} icon={<MinusIcon on size="4" mt="0.5" color="#ffffff" />} variant="ghost" _icon={{
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
                                        <IconButton onPress={change} icon={<AddIcon on size="4" mt="0.5" color="#ffffff" />} variant="ghost" _icon={{
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
                    }} ref={myRef}>
                        {isSearch ?
                            <Box flex="1" mt={-10} safeAreaTop>
                                <ScrollView>
                                    <VStack space={2.5} w="100%" px="3">
                                        <Flex direction="row" mb="2.5" mt="1.5" _text={{
                                            color: "coolGray.800"
                                        }}>
                                            <Center width={"100%"}>
                                                <FilterComponent setFilterText={setFilterText} filterText={filterText} onFilter={filteredItems} />
                                            </Center>
                                        </Flex>
                                    </VStack>
                                </ScrollView>
                            </Box>
                            : null}

                        <ScrollView horizontal={true}>
                            <View>
                                {isLoadingTable ? <Loading /> :
                                    <Table style={styles.h100} borderStyle={{ borderColor: '#C1C0B9' }}>
                                        <Row data={tableHead} widthArr={widthArr} textStyle={styles.text} style={[styles.head, styles.textBold]} />
                                        {filteredItems=="" ? <AlertComponent isOpen={true} status={"error"} title={"No hay registros existentes"} />
                                            : 
                                            <Rows
                                                data={filteredItems}
                                                style={[styles.row]}
                                                textStyle={styles.text}
                                                widthArr={widthArr}
                                            /> }

                                    </Table>
                                }

                            </View>
                        </ScrollView>
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