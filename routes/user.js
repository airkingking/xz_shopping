const express=require('express');
const pool=require('../pool.js');
var router=express.Router();

//用户首页路由    //静态资源已经托管到了public下，已经属于固态路由，直接访问即可，无需再写路由
// router.get('/user_index',function(req,res){
//     if(err) throw err;
//     res.sendFile('./pubilc/user_index.html');
// });
//用户注册路由
router.post('/reg',function(req,res){
    var obj=req.body;
    //验证数据是否为空,如果为空
    if(!obj.uname){
        res.send({code:401,msg:'uname required'});
        //如果为空则阻止向后执行
        return;
    }
    if(!obj.upwd){
        res.send({code:402,msg:'upwd required'});
        //如果为空则阻止向后执行
        return;
    }
    if(!obj.email){
        res.send({code:403,msg:'email required'});
        //如果为空则阻止向后执行
        return;
    }
    if(!obj.phone){
        res.send({code:404,msg:'phone required'});
        //如果为空则阻止向后执行
        return;
    }
    //测试一下在路由中操作数据库能不能解决uid一直递增的问题===>不能！！
    // pool.query(`DELETE FROM xz_user WHERE uid>?`,[5],function(err,result){
    //     if(err) throw err;
    // });
    pool.query(`INSERT INTO xz_user SET ?`,[obj],function(err,result){
        if(err) throw err;
        if(result.affectedRows>0)
           res.send({code:200,msg:'register suc'});
    });
});

//用户登录路由
router.post('/login',function(req,res){
    var obj=req.body;
    //验证数据是否为空,如果为空
    if(!obj.uname){
        res.send({code:401,msg:'uname required'});
        //如果为空则阻止向后执行
        return;
    }
    if(!obj.upwd){
        res.send({code:402,msg:'upwd required'});
        //如果为空则阻止向后执行
        return;
    }

    //验证有数据
    //console.log(obj);

    //写SQL语句查询用户和密码同时满足的表单提交的数据
    pool.query(`SELECT * FROM xz_user WHERE uname=? AND upwd=?`,[obj.uname,obj.upwd],function(err,result){
        if(err) throw(err);
        //测试可以查询到数据
        //console.log(result);

        //判断是否登录成功
        if(result.length>0){   //查询的返回result为数组，根据数组长度判断是否已经通过数据验证
            res.send({code:200,msg:'login suc'});
        }else{
            res.send({code:301,msg:'login err'});
        }
    });
});

//检索用户
router.get('/detail',function(req,res){
    var obj=req.query;
    if(!obj.uid){
        res.send({code:401,msg:'uid required'});
        return;
    }
    pool.query(`SELECT * FROM xz_user WHERE uid=?`,[obj.uid],function(err,result){
        if(err) throw err;
        
        if(result.length>0){
            console.log(result[0]);
            res.send(result[0]);
        }else{
            res.send({
                code:301,
                msg:'can not find'
            });
        }
    });
});

//修改用户信息路由
router.get('/update',function(req,res){
    var obj=req.query;
    var i=400;
    //通过遍历对象实现一次性对属性值的查空
    for(var key in obj){
        if(!obj[key]){
            res.send({
                code:i++,
                msg:key+' is required'
            });
        return;
        }
    }
    //可以直接插入对象
    pool.query('UPDATE xz_user SET ? WHERE uid=?',[obj,obj.uid],function(err,result){
        if(err) throw err;
        if(result.affectedRows>0){//判断要修改的信息是否存在，通过update之后受影响的行数来判断
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

//用户列表路由，需要提供当前页码和数据量
router.get('/list',function(req,res){
    var obj=req.query;

    //定义这两个变量一定要放到判断是否为空之前，保证参与判断的是从查询字符串获得的值
    //如果为空仍然可以正常执行
    var pno=obj.pno,size=obj.size;

    pno=parseInt(pno);  
    size=parseInt(size);

    if(!pno) pno=1;
    if(!size) size=3;
    

    //转数值型之后再赋值
    var start=(pno-1)*size;
    pool.query('SELECT * FROM xz_user LIMIT ?,?',[start,size],function(err,result){
        res.send(result);
        //后台测试输出结果
        //console.log(result);
    });

});

//删除用户路由
router.get('/delete',function(req,res){
    var obj=req.query;
    if(!obj.uid){
        res.send({
            code:401,
            msg:'uid required'
        });
        return;
    }
    pool.query(`DELETE FROM xz_user WHERE uid=?`,[obj.uid],function(err,result){
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