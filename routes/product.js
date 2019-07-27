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
    pool.query(`SELECT lid,title,price,sold_count,is_onsale FROM xz_laptop LIMIT ?,?`,[start,size],function(err,result){
        if(err) throw err;
        res.send(result);
        // 后台测试输出结果
        // console.log(result);
    });
});

//商品详情路由  响应到浏览器的列信息需要完善
router.get('/detail',function(req,res){
    var obj=req.query;
    if(!obj.lid){
        res.send({
            code:401,
            msg:'lid required'
        });
        return;
    }
    pool.query(`SELECT lid,title,price FROM xz_laptop WHERE lid=?`,[obj.lid],function(err,result){
        if(err) throw err;
        if(result.length>0){
            res.send(result);
        }else{
            res.send({
                code:301,
                msg:'product is not exists'
            });
        }
    });
});
//添加商品路由  需要通过表单添加的列需要完善
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
router.get('/update',function(req,res){
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
    pool.query(`UPDATE xz_laptop SET ? WHERE lid=?`,[obj,obj.lid],function(err,result){
        if(err) throw err;
        if(result.affectedRows>0){
            res.send({
                code:200,
                msg:'update suc'
            });
        }else{
            res.send({
                code:301,
                msg:'update err'
            });
        }
    });
});
//删除商品路由
router.get('/delete',function(req,res){
    var obj=req.query;
    if(!obj.lid){
        res.send({
            code:401,
            msg:'lid required'
        });
        return;
    }
    pool.query(`DELETE FROM xz_laptop WHERE lid=?`,[obj.lid],function(err,result){
        if(err) throw err;
        if(result.affectedRows>0){
            res.send({
                code:200,
                msg:'delete suc'
            });
        }else{
            res.send({
                code:301,
                msg:'delete err'
            });
        }
    });
});
module.exports=router;