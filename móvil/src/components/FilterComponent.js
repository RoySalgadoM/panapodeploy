import { View, Text } from 'react-native'
import React from 'react'
import { FormControl, Input } from "native-base";

export default function FilterComponent({filterText, setFilterText,onFilter}) {
    return (
        <FormControl>
            <FormControl.Label>Buscar:</FormControl.Label>
            <Input type='text' onChangeText={value => {
                setFilterText(value)
                onFilter
        }} placeholder='Buscar' />
        </FormControl>
    )
}