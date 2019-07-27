const express=require('express');
const pool=require('../pool.js');
var router=express.Router(); 

//添加购物车路由
router.get('/add',function(req,res){
    var obj=req.query;
    var i=400;
    for(var key in obj){
        if(!obj[key]){
            res.send({
                code:i,
                msg:key+' is required'
            });
            return;
        }
    }
    //判断商品编号是否存在    由于没有页面展示所以这一步是必要的
    pool.query(`SELECT lid FROM xz_laptop WHERE lid=?`,[obj.product_id],function(err,result){
        //如果商品存在，则加入购物车
        if(result.length>0){
            pool.query(`INSERT INTO xz_shoppingcart_item SET ?`,[obj],function(err,result){
                if(err) throw err;
                res.send({
                    code:200,
                    msg:'add suc'
                });
            });
        }else{
            res.send({   
                code:301,
                msg:'product doesn`t exist'
            });
        }
    });
});

//购物车列表
router.get('/list',function(req,res){
    var obj=req.query;
    var pno=obj.pno,size=obj.size;
    if(!pno)    pno=1;
    if(!size)   size=5;
    var start=(pno-1)*size;
    pool.query(`SELECT * FROM xz_shoppingcart_item LIMIT ?,?`,[start,size],function(err,result){
        if(err) throw err;
        res.send(result);
    });
});

//删除购物车
router.get('/delete',function(req,res){
    var obj=req.query;
    if(!obj.iid){
        res.send({
            code:401,
            msg:'iid is required'
        });
        return;
    }
    pool.query(`DELETE FROM xz_shoppingcart_item WHERE iid=?`,[obj.iid],function(err,result){
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

//修改购物车中的购买数量
router.get('/updatecount',function(req,res){
    var obj=req.query;
    for(var key in obj){
        if(!obj[key]){
            res.send({
                code:401,
                msg:key+' is required'
            });
            return;
        }
    }
    pool.query(`UPDATE xz_shoppingcart_item SET count=? WHERE iid=?`,[obj.count,obj.iid],function(err,result){
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

//修改购物车某条目是否勾选
router.get('/updatechecked',function(req,res){
    var obj=req.query;
    for(var key in obj){
        if(!obj[key]){
            res.send({
                code:401,
                msg:key+' is required'
            });
            return;
        }
    }
    pool.query(`UPDATE xz_shoppingcart_item SET is_checked=? WHERE iid=?`,[obj.is_checked,obj.iid],function(err,result){
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
module.exports=router;