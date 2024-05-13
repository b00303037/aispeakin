module.exports = [
  {
    context: ["/api"],
    target: "https://localhost:44312",
    // target: "https://dev.stardusttw.com",
    secure: false,
    changeOrigin: true,
    logLevel: "debug",
  },
];
