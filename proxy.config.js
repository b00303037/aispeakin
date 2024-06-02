module.exports = [
  {
    context: ["/api"],
    target: "https://aispeak.in",
    secure: false,
    changeOrigin: true,
    logLevel: "debug",
  },
];
