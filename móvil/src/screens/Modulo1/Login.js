import { StyleSheet , NativeModules} from 'react-native'
import React, { useState } from 'react'
import { Center, Heading, Box, VStack, Image, FormControl, Input, Link, HStack, Button, Text } from "native-base";
import STYLES from '../../styles';
import AlertComponent from "../../components/AlertComponent"
import { ipServer } from "../../config/Config"
import Loading from '../../components/Loading';
import { AuthContext } from '../../config/AuthContext';
import * as yup from "yup";
import { useFormik } from "formik";

export default function Login(props) {
  const { logged, setLogged } = props;
  const [dataLogin, setDataLogin] = useState([]);
  const [errorAlert, setErrorAlert] = useState(false)
  const { signIn, getRoles, setRoles } = React.useContext(AuthContext);

  const [errorAlertBlank, setErrorAlertBlank] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const formik = useFormik({
    initialValues: {
      password: "",
      username: ""
    },
    validationSchema: yup.object().shape({
      password: yup.string().required("Campo obligatorio"),
      username: yup.string().email('Ingresa un correo válido').required("Campo obligatorio")
    }),
    onSubmit: (values) => {
      setIsLoading(true)
      fetch(`http://${ipServer}/api/auth/login`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),

      })
        .then((response) => response.json())
        .then(async (responseJson) => {
          formik.resetForm();
          signIn(responseJson.data)
          let authorities = responseJson.data.user.authorities;
          console.log(authorities)
          let directivo, coordinador, rape, rd;
          for (let i = 0; i < authorities.length; i++) {
            if (authorities[i].authority === "Coordinador") {
              coordinador = true;
            }
            if (authorities[i].authority === "RD") {
              rape = true;
            }
            if (authorities[i].authority === "RAPE") {
              rd = true;
            }
            if (authorities[i].authority === "Directivo") {
              directivo = true;
            }

          }
          formik.resetForm
          setRoles(directivo, coordinador, rape, rd)
          setIsLoading(false)
        })
        .catch((error) => {
          setErrorAlert(true)
          setIsLoading(false)
          setErrorAlertBlank(false)
        });
    },
  });
  const goToForgot = () => {
    props.navigation.navigate("forgotPassword")
  }
 
  return (
    <Center flexDirection={"column"} alignItems={"center"} style={[STYLES.backBlue, styles.height100, STYLES.fontWhite]}>
      <Center w="90%" bg={"white"}>
        {errorAlert ? <AlertComponent isOpen={setErrorAlert} status={"error"} title={"Usuario y/o contraseña incorrectos"} /> : null}
        {errorAlertBlank ? <AlertComponent isOpen={setErrorAlertBlank} status={"error"} title={"Primero llena todos los campos"} /> : null}
        <Image mt={"2"} source={{
          uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzvJ2rH4GkrSgqsGL9BU0s4Z4jm-aZ7XuT6RFNc1bZ4CawW2JDXJw6GzC7rE23m_7ry80&usqp=CAU"
        }} alt="Alternate Text" size="xl" />
        <Box safeArea p="2" py="8" mt={"-50"} w="100%">
          <Heading style={STYLES.textCenter} size="xs" fontWeight="100" color="black" _dark={{
          }}>
            Para ingresar al sistema primero inicia sesión
          </Heading>

          <VStack ml={"3"} mr={"3"} space={3} mt="5">
            <FormControl >
              <FormControl.Label>Correo electrónico</FormControl.Label>
              <Input keyboardType='email-address' onChangeText={formik.handleChange('username')}
                onBlur={formik.handleBlur('username')}
                value={formik.values.username} type='email' />
              {formik.errors.username ? (
                <Text color={"#FF0000"}>{formik.errors.username}</Text>
              ) : null}
            </FormControl>
            <FormControl>
              <FormControl.Label >Contraseña</FormControl.Label>
              <Input onChangeText={formik.handleChange('password')}
                onBlur={formik.handleBlur('password')}
                value={formik.values.password} type="password" />
              {formik.errors.password ? (
                <Text color={"#FF0000"}>{formik.errors.password}</Text>
              ) : null}
            </FormControl>
            {isLoading ? <Loading /> : null}
            <Button mt="4" bg="#042b61" onPress={formik.handleSubmit} disabled={!(formik.isValid && formik.dirty)}>
              Iniciar sesión
            </Button>
            <Link onPress={goToForgot} marginTop={"4"} _text={{
              fontSize: "xs",
              fontWeight: "500",
              color: "indigo.500"
            }} alignSelf="flex-start" mt="1">
              Recuperar contraseña
            </Link>
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
