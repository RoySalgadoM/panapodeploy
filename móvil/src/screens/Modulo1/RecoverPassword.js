import { StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { Center, Heading, Box, VStack, Image, FormControl, Input, Link, HStack, Button, Text } from "native-base";
import STYLES from '../../styles';
import Loading from '../../components/Loading';
import AlertComponent from '../../components/AlertComponent';
import { ipServer } from "../../config/Config"
import * as yup from "yup";
import { useFormik } from "formik";

export default function RecoverPassword(props) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(false)
    const [empty, setEmpty] = useState(false)
    const [equals, setEquals] = useState(false)

    const formik = useFormik({
        initialValues: {
            password: "",
            confirmPassword: "",
            code: ""
        },
        validationSchema: yup.object().shape({
            password: yup.string().required("Campo obligatorio"),
            confirmPassword: yup.string().required("Campo obligatorio"),
            code: yup.string().required("Campo obligatorio"),
        }),
        onSubmit: (values) => {
            setIsLoading(true)
            if (values.password != values.confirmPassword) {
                setEquals(true)
                setIsLoading(false)
            } else {
                fetch(`http://${ipServer}/api/user/confir/`, {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(values),

                })
                    .then((response) => response.json())
                    .then(async (responseJson) => {
                        if (responseJson.error == true) {
                            setError(true)
                            setIsLoading(false)
                            setEquals(false)
                        } else {
                            setError(false)
                            setIsLoading(false)
                            setEquals(false)
                            props.navigation.navigate("login")
                        }

                    })
                    .catch((response) => {
                        setError(true)
                        setIsLoading(false)
                    })
            }

        }

    });
    return (
        <Center flexDirection={"column"} alignItems={"center"} style={[STYLES.backBlue, styles.height100, STYLES.fontWhite]}>
            <Center w="90%" bg={"white"}>
                {error ? <AlertComponent isOpen={setError} status={"error"} title={"Este código no es correcto"} /> : null}
                {empty ? <AlertComponent isOpen={setEmpty} status={"error"} title={"Rellena todos los campos"} /> : null}
                {equals ? <AlertComponent isOpen={setEquals} status={"error"} title={"Las contraseñas no son iguales"} /> : null}

                <Image mt={"2"} source={{
                    uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzvJ2rH4GkrSgqsGL9BU0s4Z4jm-aZ7XuT6RFNc1bZ4CawW2JDXJw6GzC7rE23m_7ry80&usqp=CAU"
                }} alt="Alternate Text" size="xl" />
                <Box safeArea p="2" py="8" mt={"-50"} w="100%">
                    <Heading style={STYLES.textCenter} size="xs" fontWeight="100" color="black" _dark={{
                    }}>
                        Ingresa el código que llegó a tu correo electrónico
                    </Heading>

                    <VStack ml={"3"} mr={"3"} space={3} mt="5">
                        <FormControl >
                            <FormControl.Label>Código</FormControl.Label>
                            <Input
                                onChangeText={formik.handleChange('code')}
                                onBlur={formik.handleBlur('code')}
                                value={formik.values.code}
                            />
                            {formik.errors.code ? (
                                <Text color={"#FF0000"}>{formik.errors.code}</Text>
                            ) : null}
                        </FormControl>
                        <Heading style={STYLES.textCenter} size="xs" fontWeight="100" color="black" _dark={{
                        }}>
                            Ingrese su nueva contraseña en los siguientes campos
                        </Heading>
                        <FormControl>
                            <FormControl.Label >Contraseña</FormControl.Label>
                            <Input
                                onChangeText={formik.handleChange('password')}
                                onBlur={formik.handleBlur('password')}
                                value={formik.values.password}
                                type="password" />
                            {formik.errors.password ? (
                                <Text color={"#FF0000"}>{formik.errors.password}</Text>
                            ) : null}
                        </FormControl>
                        <FormControl>
                            <FormControl.Label >Confirmar contraseña</FormControl.Label>
                            <Input type="password"
                                onChangeText={formik.handleChange('confirmPassword')}
                                onBlur={formik.handleBlur('confirmPassword')}
                                value={formik.values.confirmPassword}

                            />
                            {formik.errors.confirmPassword ? (
                                <Text color={"#FF0000"}>{formik.errors.confirmPassword}</Text>
                            ) : null}
                        </FormControl>
                        {isLoading ? <Loading /> : null}
                        <Button mt="4" bg="#042b61" onPress={formik.handleSubmit}>
                            Cambiar contraseña
                        </Button>
                    </VStack>
                </Box>
            </Center>
        </Center>
    )
}

const styles = StyleSheet.create({
    height100: {
        height: "100%"
    }
})
