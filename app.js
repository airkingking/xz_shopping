const express=require('express');
//此中间件虽然是对路由进行筛选拦截的，但是路由或者路由器最终是要挂在到服务器上的，
//所以所有的中间都要写在服务器中并且要写在挂载路由之前
const bodyparser=require('body-parser');
//引入同意目录下的自定义模块时'./'是必须要加的
const user_router=require('./routes/user.js');
const product_router=require('./routes/product.js');
const cart_router=require('./routes/cart.js');

var app=express();
app.listen(8080);
app.use(express.static('./public'));

app.use(bodyparser.urlencoded({
    extended:false
}));

app.use(express.static('./public'));
app.use('/user',user_router);
app.use('/product',product_router);
app.use('/cart',cart_router);

//网站首页的路由和html需要完善
