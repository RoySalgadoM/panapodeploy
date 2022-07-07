import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from './src/components/Loading';
import { AuthContext } from './src/config/AuthContext';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { LogBox } from 'react-native';
import {
  Text,
  Link,
  HStack,
  Center,
  Heading,
  Switch,
  useColorMode,
  NativeBaseProvider,
  extendTheme,
  VStack,
  Code,
  Button,
} from "native-base";

const config = {
  useSystemColorMode: false,
  initialColorMode: "dark",
};
export const theme = extendTheme({ config });

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();


import Login from "./src/screens/Modulo1/Login"
import RecoverPassword from './src/screens/Modulo1/RecoverPassword';
import ForgotPassword from './src/screens/Modulo1/ForgotPassword';
import Dashboard from './src/screens/Dashboard';
import AltaDireccion from './src/screens/AltaDireccion';
import Clientes from './src/screens/Clientes';
import Personal from './src/screens/Personal';
import ProjectsCoordinador from './src/screens/projects/ProjectsCoordinador';
import ProjectsRD from './src/screens/projects/ProjectsRD';
import ProjectsRape from './src/screens/projects/ProjectsRape';
import Role from './src/screens/Role';
import ViewReports from './src/screens/ViewReports';
import Roles from './src/screens/Roles';
import Users from './src/screens/Users';
export default function App({ navigation }) {

  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
            directivo: null,
            coordinador: null,
            rape: null,
            rd: null,
            rolSign: null
          };
        case 'COORDINADOR':
          return {
            ...prevState,
            coordinador: action.enable
          };
        case 'DIRECTIVO':
          return {
            ...prevState,
            directivo: action.enable
          };
        case 'RAPE':
          return {
            ...prevState,
            rape: action.enable
          };
        case 'RD':
          return {
            ...prevState,
            rd: action.enable
          };
        case 'ROL_ACTIVE':
          return {
            ...prevState,
            rolSign: action.rol
          };

      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
      directivo: null,
      coordinador: null,
      rape: null,
      rd: null,
      rolSign: null
    }
  );

  const authContext = React.useMemo(
    () => ({
      signIn: async (data) => {
        console.log(data.token)
        console.log(data.user.username)
        dispatch({ type: 'SIGN_IN', token: data.token });
        try {
          await AsyncStorage.setItem('token', data.token)
          await AsyncStorage.setItem('username', data.user.username)

        } catch (e) {
          console.log(e)
          // error reading value
        }
      },
      signOut: async () => {
        dispatch({ type: 'SIGN_OUT', token: null })
        dispatch({ type: 'DIRECTIVO', enable: null })
        dispatch({ type: 'RD', enable: null })
        dispatch({ type: 'RAPE', enable: null })
        dispatch({ type: 'COORDINADOR', enable: null })
        dispatch({ type: 'ROL_ACTIVE', rol: null })
        try {
          await AsyncStorage.removeItem('token')
          await AsyncStorage.removeItem('username')
          await AsyncStorage.removeItem('role')
          await AsyncStorage.setItem('RD', "false")
          await AsyncStorage.setItem('RAPE', "false")
          await AsyncStorage.setItem('COORDINADOR', "false")
        } catch (e) {
          console.log(e)
          // error reading value
        }
      },
      getRoles: () => {
        console.log(state.userToken)
      },
      setRoles: async (directivo, coordinador, rape, rd) => {
        if (rape) {
          dispatch({ type: 'RAPE', enable: true });
          dispatch({ type: 'ROL_ACTIVE', rol: "RAPE" });
          try {
            await AsyncStorage.setItem('role', "RAPE")
            await AsyncStorage.setItem('RAPE', "true")
          } catch (e) {
            console.log(e)
            // error reading value
          }
        }else{
          try {
            await AsyncStorage.setItem('RAPE', "false")
          } catch (e) {
            console.log(e)
          }
        }
        if (rd) {
          dispatch({ type: 'RD', enable: true });
          dispatch({ type: 'ROL_ACTIVE', rol: "RD" });
          try {
            await AsyncStorage.setItem('role', "RD")
            await AsyncStorage.setItem('RD', "true")
          } catch (e) {
            console.log(e)
            // error reading value
          }
        }else{
          try {
            await AsyncStorage.setItem('RD', "false")
          } catch (e) {
            console.log(e)
          }
        }
        if (directivo) {
          dispatch({ type: 'DIRECTIVO', enable: true });
          dispatch({ type: 'ROL_ACTIVE', rol: "DIRECTIVO" });
          try {
            await AsyncStorage.setItem('role', "DIRECTIVO")
          } catch (e) {
            console.log(e)
            // error reading value
          }
        }
        if (coordinador) {
          dispatch({ type: 'COORDINADOR', enable: true });
          dispatch({ type: 'ROL_ACTIVE', rol: "COORDINADOR" });
          try {
            await AsyncStorage.setItem('role', "COORDINADOR")
            await AsyncStorage.setItem('COORDINADOR', "true")
          } catch (e) {
            console.log(e)
            // error reading value
          }
        }else{
          try {
            await AsyncStorage.setItem('COORDINADOR', "false")
          } catch (e) {
            console.log(e)
          }
        }
      },
      setRoleActive: async(rol) => {
        dispatch({ type: 'ROL_ACTIVE', rol: rol });
        try {
          await AsyncStorage.setItem('role', rol)
        } catch (e) {
          console.log(e)
          // error reading value
        }
      }

    }),
    []
  );

  React.useEffect(() => {
  }, [])
  LogBox.ignoreLogs(['NativeBase']); //Hide warnings

  return (
    <NativeBaseProvider>
      <AuthContext.Provider value={authContext}>

        <NavigationContainer>
          {state.userToken == null ? (
            <Stack.Navigator>
              <Stack.Screen
                name="login"
                component={Login}
                options={{
                  headerShown: false, hidden: true,
                  animationTypeForReplace: state.isSignout ? 'pop' : 'push',
                }}
              />
              <Stack.Screen
                name="forgotPassword"
                component={ForgotPassword}
                options={{
                  headerShown: false, hidden: true
                }}
              />
              <Stack.Screen
                name="recoverPassword"
                component={RecoverPassword}
                options={{
                  headerShown: false, hidden: true
                }}
              />
            </Stack.Navigator>
          ) :

            state.rolSign == "COORDINADOR" ?
              <Drawer.Navigator initialRouteName='dashboard'>
                <Drawer.Screen name="dashboard" options={{ title: "Panel de proyectos" }} component={Dashboard} />
                <Drawer.Screen name="projects" options={{ title: "Gestión de proyectos" }} component={ProjectsCoordinador} />
                <Drawer.Screen name="personal" options={{ title: "Gestión de personal" }} component={Personal} />
                <Drawer.Screen name="users" options={{ title: "Gestión de usuarios"}} component={Users} />
                <Drawer.Screen name="direction" options={{ title: "Gestión de usuarios de alta dirección" }} component={AltaDireccion} />
                <Drawer.Screen name="clients" options={{ title: "Gestión de clientes" }} component={Clientes} />
                <Drawer.Screen name="roles" options={{ title: "Gestión de roles"}} component={Roles} />
                <Drawer.Screen name="role" options={{ title: "Configuración", headerRight: () => (<Button bg={"#042b61"} onPress={() => authContext.signOut()} mr={2}>Cerrar sesión</Button>) }} component={Role} />
                <Drawer.Screen name="reports" options={{ title: "Ver reportes",drawerItemStyle:{display:'none'} }} component={ViewReports} />
              </Drawer.Navigator>
              : state.rolSign == "DIRECTIVO" ?
                <Drawer.Navigator initialRouteName='dashboard'>
                  <Drawer.Screen name="dashboard" options={{ title: "Panel de proyectos"}} component={Dashboard} />
                </Drawer.Navigator>
                : state.rolSign == "RD" ?
                  <Drawer.Navigator initialRouteName='dashboard'>
                    <Drawer.Screen name="dashboard" options={{ title: "Panel de proyectos", headerRight: () => (<Button onPress={() => authContext.signOut()} mr={2}>Cerrar sesión</Button>) }} component={Dashboard} />
                    <Drawer.Screen name="projects" options={{ title: "Gestión de proyectos RD" }} component={ProjectsRD} />
                    <Drawer.Screen name="reports" options={{ title: "Ver reportes",drawerItemStyle:{display:'none'} }} component={ViewReports} />
                    <Drawer.Screen name="role" options={{ title: "Configuración", headerRight: () => (<Button bg={"#042b61"} onPress={() => authContext.signOut()} mr={2}>Cerrar sesión</Button>) }} component={Role} />
                  </Drawer.Navigator>
                  : state.rolSign == "RAPE" ?
                    <Drawer.Navigator initialRouteName='dashboard'>
                      <Drawer.Screen name="dashboard" options={{ title: "Panel de proyectos"}} component={Dashboard} />
                      <Drawer.Screen name="projects" options={{ title: "Gestión de proyectos RAPE" }} component={ProjectsRape} />
                      <Drawer.Screen name="reports" options={{ title: "Ver reportes",drawerItemStyle:{display:'none'} }} component={ViewReports} />
                      <Drawer.Screen name="role" options={{ title: "Configuración", headerRight: () => (<Button bg={"#042b61"} onPress={() => authContext.signOut()} mr={2}>Cerrar sesión</Button>) }} component={Role} />
                    </Drawer.Navigator>
                    : null
          }
        </NavigationContainer>
      </AuthContext.Provider>
    </NativeBaseProvider>

  );
}

function ToggleDarkMode() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <HStack space={2} alignItems="center">
      <Text>Dark</Text>
      <Switch
        isChecked={colorMode === "light"}
        onToggle={toggleColorMode}
        aria-label={
          colorMode === "light" ? "switch to dark mode" : "switch to light mode"
        }
      />
      <Text>Light</Text>
    </HStack>
  );
}