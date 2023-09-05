const { createProxyMiddleware } = require('http-proxy-middleware');  // 강의 내용과 달라 gpt 내용으로 변경 

module.exports = function (app) {
  app.use(
    '/api', // Replace with the path you want to proxy (e.g., /api)
    createProxyMiddleware({
      target: 'http://localhost:5000', // Replace with your backend server URL
      changeOrigin: true, // Required for virtual hosted sites
      // Add any additional options or headers if needed
    })
  );
};