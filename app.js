const express=require('express');
//此中间件虽然是对路由进行筛选拦截的，但是路由或者路由器最终是要挂在到服务器上的，
//所以所有的中间都要写在服务器中并且要写在挂载路由之前
const bodyparser=require('body-parser');    
const user_router=require('./routes/user.js');
const product_router=require('./routes/product.js');

var app=express();
app.listen(8080);
app.use(express.static('./public'));

app.use(bodyparser.urlencoded({
    extended:false
}));

app.use(express.static('./public'));
app.use('/user',user_router);
app.use('/product',product_router);
