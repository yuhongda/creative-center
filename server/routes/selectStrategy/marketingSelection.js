'use strict';

const express = require('express');
const _ = require('lodash');
const router = express.Router();
const { resultData } = require('../../common/utils');

/**
 * band商品数量分布
 */
router.get('/getBandPieData', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};

  Object.assign(ret, resultData, {
    data: [
      {value:_.random(0, 1000), name:'A'},
      {value:_.random(0, 1000), name:'B'},
      {value:_.random(0, 1000), name:'C'},
      {value:_.random(0, 1000), name:'D'},
      {value:_.random(0, 1000), name:'E'}
    ]
  });

  res.send(ret);
});

/**
 * band 商品角色
 */
router.get('/getBandProductRoleData', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};

  Object.assign(ret, resultData, {
    data: {
      uvAvg:20000,
      uvConvertAvg:_.random(0, 1,true),
      list:[
        [_.random(0, 1,true), _.random(0, 100000),'海飞丝'],
        [_.random(0, 1,true), _.random(0, 100000),'潘婷'],
        [_.random(0, 1,true), _.random(0, 100000),'欧莱雅']
      ]
    }
  });

  res.send(ret);
});

/**
 * 商品画像List
 */
router.get('/getProductPortraitList', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};

  Object.assign(ret, resultData, {
    data: _.times(10, i => {
      return {
        rank:i+1,
        name:'【京东超市】飘柔 Rejoice 净爽去屑洗发露750ml净爽去屑洗发露750ml净爽去屑洗发露750ml净爽去屑洗发露750ml净爽去屑洗发露750ml',
        sku:4071550,
        categoryName:'洗发',
        brandName:'品牌',
        salesAmount:_.random(0, 10000, true),
        uv:_.random(0, 10000),
        band:_.random(0, 10000)
      };
    })
  });

  res.send(ret);
});

module.exports = router;