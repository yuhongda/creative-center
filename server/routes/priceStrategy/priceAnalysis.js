'use strict';

const express = require('express');
const _ = require('lodash');
const router = express.Router();
const { resultData } = require('../../common/utils');

// 商品价格敏感度
router.get('/getPriceProductsData', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};

  Object.assign(ret, resultData, {
    data: [
      [null,null,0,null],// _.times(9, i => { return _.random(0.1, 1.0).toFixed(2) }),
      [0,null,0,null],// _.times(9, i => { return -_.random(0.1, 1.0).toFixed(2) }),
      ['B','D','E','F','G','H','I','G','K'],
    ]
  });

  res.send(ret);
});

router.get('/getPriceProductsList', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};

  Object.assign(ret, resultData, {
      total: 100, // 总条数
      data: [
        {
            rank: 1,
            skuName: '我是商品名字',
            skuId: _.random(1, 1000),
            saleBand: 'A',
            gmvBand: 'B',
            clickBand: 'A',
            kvBand: 'B',
            ec: 0,
            sensitivity: '低',
        },
        {
            rank: 2,
            skuName: '我是商品名字',
            skuId: _.random(1, 1000),
            saleBand: 'A',
            gmvBand: 'B',
            clickBand: 'A',
            kvBand: 'B',
            ec: null,
            sensitivity: '低',
        },
        {
            rank: 2,
            skuName: '我是商品名我是商品名字我是商品名字我是商品名字我是商品名字我是商品名字字',
            skuId: _.random(1, 1000),
            saleBand: 'A',
            gmvBand: 'B',
            clickBand: 'A',
            kvBand: 'B',
            ec: 0,
            sensitivity: '低',
        },
        {
            rank: 2,
            skuName: '我是商品名字',
            skuId: _.random(1, 1000),
            saleBand: 'A',
            gmvBand: 'B',
            clickBand: 'A',
            kvBand: 'B',
            ec: null,
            sensitivity: '低',
        },
        {
            rank: 2,
            skuName: '我是商品名字',
            skuId: _.random(1, 1000),
            saleBand: 'A',
            gmvBand: 'B',
            clickBand: 'A',
            kvBand: 'B',
            ec: null,
            sensitivity: '低',
        },
      ]
      // data: _.times(10, i => {
      //   return {
      //     rank: i,
      //     skuName: '我是商品名字' + i,
      //     skuId: _.random(1, 1000),
      //     saleBand: 'A',
      //     gmvBand: 'B',
      //     clickBand: 'A',
      //     kvBand: 'B',
      //     ec: 0,
      //     sensitivity: '低',
      //   };
      // })
  });

  res.send(ret);
});

module.exports = router;
