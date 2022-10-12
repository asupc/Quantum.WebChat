# Quantum.WebChat

量子WebChat 前端开源代码，依赖量子服务，并不能单独运行。

依赖nodejs

## 安装依赖
<pre>npm install</pre>
## 本地浏览
<pre>npm run dev</pre>
开发环境时，修改src/App.Vue 52行，将http://127.0.0.1:5088 修改为你量子的地址。
## 打包
<pre>npm run build</pre>
打包时，默认没有根地址。
可修改参数 /src/config/index.js
<pre>
module.exports = {
  build: { //生产环境
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/quantum-chat/',  //可为 "/" 或者自定义。
    productionSourceMap: true,
    productionGzip: false,
    productionGzipExtensions: ['js', 'css']
  },
  dev: { //开发环境
    env: require('./dev.env'),
    port: 8080,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {},
    cssSourceMap: false
  }
}
</pre>
