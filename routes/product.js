const express=require('express');
const pool=require('../pool.js');
var router=express.Router();

//商品列表路由
router.get('/list',function(req,res){
    var obj=req.query;
    var pno=obj.pno,size=obj.size;
    if(!pno)   pno=1;
    if(!size)  size=10;
    pno=parseInt(pno);
    size=parseInt(size);
    var start=(pno-1)*size;
    pool.query(`SELECT * FROM xz_laptop LIMIT ?,?`,[start,size],function(err,result){
        if(err) throw err;
        res.send(result);
        // 后台测试输出结果
        // console.log(result);
    });

});
module.exports=router;