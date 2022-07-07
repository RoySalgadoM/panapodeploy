import * as instace from "axios";
const axios = instace.create({
  baseURL: "http://localhost:8080/api",
});

var CryptoJS = require("crypto-js");
let secret = "4_p(0cw@7zb28bd!^1&3&rhk%x08z1wr6bnrdw#&q7to%=map_";

const requestHandler = (request) => {
  request.headers["Accept"] = "application/json";
  request.headers["Content-Type"] = "application/json";
  let ciphertext = localStorage.getItem("user") || null
  if (ciphertext) {
    var bytes = CryptoJS.AES.decrypt(ciphertext, secret);
    var originalText = bytes.toString(CryptoJS.enc.Utf8);
    request.headers["Authorization"] = `Bearer${originalText}`;
  }
  return request;
};

const errorResponseHandler = (response) => {
  return Promise().reject({ ...response });
};

const successResponseHandler = (response) => {
  return response.data;
};

// Inteferir y cambiar el request.
axios.interceptors.request.use((request) => requestHandler(request));

//Interferir en la respuesta y hacer que utilice otros métodos.
axios.interceptors.response.use(
  (response) => successResponseHandler(response),
  (error) => errorResponseHandler(error)
);

export default axios;
