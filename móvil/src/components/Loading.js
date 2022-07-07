import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React from 'react'

export default function Loading(props) {
     return (
          <View style={[styles.container, styles.horizontal]}>
               <ActivityIndicator size="large" color="#042b61" />
          </View>
     )
}

const styles = StyleSheet.create({
     container: {
       flex: 1,
       justifyContent: "center"
     },
     horizontal: {
       flexDirection: "row",
       justifyContent: "space-around",
       padding: 10
     }
   });