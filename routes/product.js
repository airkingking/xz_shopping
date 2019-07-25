const express=require('express');
const pool=require('../pool.js');
var router=express.Router();

//商品列表路由
router.get('/list',function(req,res){
    var obj=req.query;
    var pno=obj.pno;
    var size=obj.size;
    if(!pno)   pno=1;
    if(!size)  size=9;
    pno=parseInt(pno);
    size=parseInt(size);
    var start=(pno-1)*size;
    pool.query(`SELECT lid,price,title FROM xz_laptop LIMIT ?,?`,[start,size],function(err,result){
        if(err) throw err;
        res.send(result);
        // 后台测试输出结果
        // console.log(result);
    });
});

//商品详情路由

//添加商品路由
router.get('/add',function(req,res){
    var obj=req.query;
    var i=400;
    for(var key in obj){
        if(!obj[key]){
            res.send({
                code:i++,
                msg:key+' is required'
            });
            return;
        }
    }
    pool.query(`INSERT INTO xz_laptop SET ?`,[obj],function(err,result){
        if(err) throw err;
        if(result.affectedRows>0){
           res.send({
               code:200,
               msg:'add suc'
           }); 
        }else{
            res.send({
                code:301,
                msg:'add err'
            });
        }
    });
});

//修改商品路由

//删除商品路由

module.exports=router;