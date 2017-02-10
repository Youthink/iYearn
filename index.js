const express = require('express');
const app = express();
const path = require('path');
const routes = require('./routes');
const formidable = require('express-formidable');

// 设置模板目录
app.set('views', path.join(__dirname, 'views'));
// 设置模板引擎为 ejs
app.set('view engine', 'ejs');

app.use(formidable());

routes(app);

app.listen(3001, function(){
  console.log('正在监听30001端口...');
});