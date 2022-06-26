module.exports = {
  baseUrl: process.env.NODE_ENV === "production" ? "/vue-spotify/" : "/",

  devServer: {
    host: "localhost",
    port: 8080,
    https: true,
  },

  css: {
    loaderOptions: {
      sass: {
        data: "@import ./src/styles/util/util.sass"
      }
    }
  }
};
