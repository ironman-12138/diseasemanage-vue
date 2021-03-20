module.exports = {
  
    // 配置跨域请求
    devServer: {
      port: 8080,
      host: 'localhost',
      open: true,
      https: false,
      proxy: {
        '/api': {
          target: 'http://localhost:8081/',
          ws: true,
          changeOrigin: true,
          pathRewrite: {
            '^/': ''
          }
        }
      }
  
    }
  
  }