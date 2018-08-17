var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
var Goods = require('../models/goods')

// 连接mongoDB数据库
mongoose.connect('mongodb://127.0.0.1:27017/mall')

// 监听连接成功事件
mongoose.connection.on('connected', function() {
	console.log('MongoDB connected success')
})

// 监听连接失败事件
mongoose.connection.on('error', function() {
	console.log('MongoDB connected fail')
})

// 监听断开连接事件
mongoose.connection.on('disconnected', function() {
	console.log('MongoDB connected disconnected')
})


// 查询商品列表数据
router.get('/list', function(req, res, next) {
	var page = req.query.page
	var pageSize = req.query.pageSize
	var priceLevel = req.query.priceLevel
	var sort = req.query.sort
	var skip = (page-1) * pageSize
	var priceGt = '', priceLte = ''
	if (priceLevel != 'all') {
		switch (priceLevel) {
			case '0': priceGt = 0; priceLte = 500; break;
			case '1': priceGt = 500; priceLte = 1000; break;
			case '2': priceGt = 1000; priceLte = 2000; break;
		}
		var params = {
			salePrice: {
				$gt: priceGt,
				$lte: priceLte
			}
		}
	}
  var goodsModel = Goods.find(params).skip(skip).limit(pageSize)
  goodsModel.sort({'salePrice': sort})
	goodsModel.exec(function(err, doc){
		if (err) {
			res.json({
				status: '1',
				msg: err.message
			})
		} else {
			res.json({
				status: '0',
				msg: '',
				result: {
					count: doc.length,
					list: doc
				}
			})
		}
	})
});

//加入到购物车
router.post("/addCart", function (req,res,next) {
  var userId = '100000077';
  var productId = req.body.productId;
  var User = require('../models/user');
  User.findOne({userId:userId}, function (err,userDoc) {
    if(err){
        res.json({
            status:"1",
            msg:err.message
        })
    }else{
        if(userDoc){
          var goodsItem = '';
          userDoc.cartList.forEach(function (item) {
              if(item.productId == productId){
                goodsItem = item;
                item.productNum ++;
              }
          });
          if(goodsItem){
            userDoc.save(function (err2,doc2) {
              if(err2){
                res.json({
                  status:"1",
                  msg:err2.message
                })
              }else{
                res.json({
                  status:'0',
                  msg:'',
                  result:'suc'
                })
              }
            })
          }else{
            Goods.findOne({productId:productId}, function (err1,doc) {
              if(err1){
                res.json({
                  status:"1",
                  msg:err1.message
                })
              }else{
                if(doc){
                	var newDoc = {
                		productId: doc.productId,
                		productName: doc.productName,
                		salePrice: doc.salePrice,
                		productImage: doc.productImage,
                		checked: 1,
                		productNum: 1
                	}
                  userDoc.cartList.push(newDoc);
                  userDoc.save(function (err2,doc2) {
                    if(err2){
                      res.json({
                        status:"1",
                        msg:err2.message
                      })
                    }else{
                      res.json({
                        status:'0',
                        msg:'',
                        result:'suc'
                      })
                    }
                  })
                }
              }
            });
          }
        }
    }
  })
});

module.exports = router;