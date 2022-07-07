import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, Text } from 'react-native';
import { Table, TableWrapper, Row, Rows, Col } from 'react-native-table-component';
import Loading from './Loading';
import AlertComponent from './AlertComponent';


export default function TableUniqueComponent(props) {
    const { tableHead, widthArr, data, isLoadingTable } = props;

    return (
        <View style={styles.container}>
            <ScrollView horizontal={true}>
                <View>
                    {isLoadingTable ? <Loading /> :
                        <Table style={styles.h100} borderStyle={{ borderColor: '#C1C0B9' }}>
                            <Row data={tableHead} widthArr={widthArr} textStyle={styles.text} style={[styles.head, styles.textBold]} />
                            {data == "" ? <AlertComponent isOpen={true} status={"error"} title={"No se han agregado programadores"} />
                                :
                                <Rows
                                    data={data}
                                    style={[styles.row]}
                                    textStyle={styles.text}
                                    widthArr={widthArr}
                                />}

                        </Table>
                    }

                </View>
            </ScrollView>


        </View>
    )
}



const styles = StyleSheet.create({
    container: {
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