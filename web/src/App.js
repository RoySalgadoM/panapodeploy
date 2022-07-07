import React, { useEffect, useReducer } from "react";
import { AuthContext } from "./components/auth/authContext";
import { AppRouter } from "./components/routes/AppRouter";


const App = () => {
  var CryptoJS = require("crypto-js");

  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'SIGN_IN':
          return {
            ...prevState,
            userToken: action.token,
            isSignOut: false
          };
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignOut: true,
            userToken: null,
            directior: null,
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
      userToken: null,
      isSignOut: false,
      directivo: null,
      coordinador: null,
      rape: null,
      rd: null,
      rolSign: null
    },
  );

  const authContext = React.useMemo(
    () => ({
      signIn: async (user) => {
        let secret = "4_p(0cw@7zb28bd!^1&3&rhk%x08z1wr6bnrdw#&q7to%=map_"
        let token = user.token
        dispatch({ type: 'SIGN_IN', token: token });
        var ciphertext = CryptoJS.AES.encrypt(user.token, secret).toString();

        localStorage.setItem('user', ciphertext);
        localStorage.setItem('username', user.user.username);

      },
      signOut: async () => {
        dispatch({ type: 'SIGN_OUT', token: null });
        dispatch({ type: 'RAPE', enable: null });
        dispatch({ type: 'RD', enable: null });
        dispatch({ type: 'DIRECTIVO', enable: null });
        dispatch({ type: 'COORDINADOR', enable: null });
        dispatch({ type: 'ROL_ACTIVE', rol: null });
        localStorage.removeItem('user');
        localStorage.removeItem('username');
        localStorage.removeItem('roles');
        localStorage.removeItem('userRol');
      },
      getRoles: () => {
        return state.directivo
      },
      setRoles: async (directivo, coordinador, rape, rd) => {
        if (rape == true) {
          dispatch({ type: 'RAPE', enable: "true" });
          dispatch({ type: 'ROL_ACTIVE', rol: "RAPE" });
          var ciphertext = CryptoJS.AES.encrypt("RAPE", secret).toString();
          localStorage.setItem('userRol', ciphertext);
        }
        if (rd == true) {
          dispatch({ type: 'RD', enable: "true" });
          dispatch({ type: 'ROL_ACTIVE', rol: "RD" });
          var ciphertext = CryptoJS.AES.encrypt("RD", secret).toString();
          localStorage.setItem('userRol', ciphertext);
        }
        if (directivo == true) {
          dispatch({ type: 'DIRECTIVO', enable: "true" });
          dispatch({ type: 'ROL_ACTIVE', rol: "DIRECTIVO" });
          var ciphertext = CryptoJS.AES.encrypt("DIRECTIVO", secret).toString();
          localStorage.setItem('userRol', ciphertext);
        }
        if (coordinador == true) {
          dispatch({ type: 'COORDINADOR', enable: "true" });
          dispatch({ type: 'ROL_ACTIVE', rol: "COORDINADOR" });

          var ciphertext = CryptoJS.AES.encrypt("COORDINADOR", secret).toString();
          localStorage.setItem('userRol', ciphertext);
        }

        let roles = {
          "RAPE": rape,
          "COORDINADOR": coordinador,
          "RD": rd,
          "DIRECTIVO": directivo
        }
        var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(roles), secret).toString();
        localStorage.setItem('roles', ciphertext);
      },
      setRoleActive: (rol) => {
        dispatch({ type: 'ROL_ACTIVE', rol: rol });
      }
    }),
    []
  );

  let secret = "4_p(0cw@7zb28bd!^1&3&rhk%x08z1wr6bnrdw#&q7to%=map_";

  useEffect(() => {
    let cipherRoles = localStorage.getItem("roles") || null
    let decryptedData;
    let coordinador =  null
    let rd =null
    let rape =  null
    let directivo = null

    if (cipherRoles) {
      var bytes = CryptoJS.AES.decrypt(cipherRoles, secret);
      decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      coordinador = decryptedData.COORDINADOR 
      rd = decryptedData.RD
      rape = decryptedData.RAPE
      directivo = decryptedData.DIRECTIVO
    }

    let userRol = localStorage.getItem("userRol") || null
    var originalRol;
    var originalToken

    if (userRol) {
      var bytes = CryptoJS.AES.decrypt(userRol, secret);
      originalRol = bytes.toString(CryptoJS.enc.Utf8);
      dispatch({ type: 'ROL_ACTIVE', rol: originalRol });
    }

    let ciphertext = localStorage.getItem("user") || null
    if (ciphertext) {
      var bytes = CryptoJS.AES.decrypt(ciphertext, secret);
      originalToken = bytes.toString(CryptoJS.enc.Utf8);
      dispatch({ type: 'RESTORE_TOKEN', token: originalToken });
    }

    if (coordinador === true) {
      dispatch({ type: 'COORDINADOR', enable: "true" });
    }
    if (rd === true) {
      dispatch({ type: 'RD', enable: "true" });
    }
    if (rape === true) {
      dispatch({ type: 'RAPE', enable: "true" });
    }
    if (directivo === true) {
      dispatch({ type: 'DIRECTIVO', enable: "true" });
    }
    
  }, []);

  return (
    <AuthContext.Provider value={{ authContext, state }}>
      <AppRouter />
    </AuthContext.Provider>
  );
};

export default App;
