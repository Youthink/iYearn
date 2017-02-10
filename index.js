const path = require('path');
const express = require('express');
const app = express();
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');
const routes = require('./routes');
const config = require('config-lite');
const pkg = require('./package');
const formidable = require('express-formidable');

// 设置模板目录
app.set('views', path.join(__dirname, 'views'));
// 设置模板引擎为 ejs
app.set('view engine', 'ejs');
// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')));
// session 中间件
app.use(session({
  name: config.session.key,// 设置 cookie 中保存 session id 的字段名称
  secret: config.session.secret,// 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
  cookie: {
    maxAge: config.session.maxAge// 过期时间，过期后 cookie 中的 session id 自动删除
  },
  store: new MongoStore({// 将 session 存储到 mongodb
    url: config.mongodb// mongodb 地址
  }),
  resave: false,
  saveUninitialized: true,
}));

// flash 中间价，用来显示通知
app.use(flash());
// 处理表单及文件上传的中间件
app.use(formidable());

routes(app);

app.listen(config.port, function(){
  console.log(`${pkg.name} 正在监听${config.port}端口...`);
});