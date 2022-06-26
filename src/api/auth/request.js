import axios from "axios";

//@todo move baseURL to config file

// const baseURL =
//   process.env.NODE_ENV === "production"
//     ? "https://stark-harbor-25810.herokuapp.com/"
//     : "https://localhost:4040/";

const baseURL = "https://localhost:4040/";
    

const request = axios.create({
  baseURL: baseURL,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  },
});

export default request;
