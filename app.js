const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const webRouters = require('./routes/web_router');
const config = require('config-lite');
const pkg = require('./package');
const auth = require('./middlewares/auth');
const apiRouterV1 = require('./routes/api_router');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/avatar')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname + Date.parse(new Date()));
  }
});
const upload = multer({ storage: storage });
const cpUpload = upload.any();

// 设置模板目录
app.set('views', path.join(__dirname, 'views'));
// 设置模板引擎为 ejs
app.set('view engine', 'html');
app.engine('html', require('ejs-mate'));
app.locals._layoutFile = 'layout.html';
// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')));

app.use(cpUpload);

//表单内容
app.use(bodyParser.json({limit: '1mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }));
app.use(require('cookie-parser')(config.session.secret));

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
  saveUninitialized: false
}));

// custom middleware
app.use(auth.authUser);

// routes
app.use('/api/v1',apiRouterV1);
app.use('/', webRouters);

app.listen(config.port, function(){
  console.log(`${pkg.name} 正在监听${config.port}端口...`);
});