'use strict';

const express = require('express');
const _ = require('lodash');
const router = express.Router();
const { resultData } = require('../../common/utils');

// 细分市场生意评估
router.get('/getBusinessData', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};

  Object.assign(ret, resultData, {
    data: {
      salesData:[
        _.times(6, i => {return _.random(100000, 1000000, true).toFixed(2)}),
        _.times(6, i => {return _.random(10000, 100000, true).toFixed(2)}),
        _.times(6, i => {return _.random(100, 10000)}),
        ['1月','2月','3月','4月','5月','6月']
      ],
      amountData:[
        _.times(6, i => {return _.random(100000, 1000000, true).toFixed(2)}),
        _.times(6, i => {return _.random(100, 10000, true).toFixed(2)}),
        _.times(6, i => {return _.random(100, 10000, true)}),
        ['1月','2月','3月','4月','5月','6月']
      ],
      uvGrowthData:[
        _.times(6, i => {return _.random(0.1, 1, true).toFixed(4)}),
        _.times(6, i => {return _.random(0.1, 1, true).toFixed(4)}),
        _.times(6, i => {return _.random(0.1, 1, true).toFixed(4)}),
        ['1月','2月','3月','4月','5月','6月']
      ],
      uvConvertData:[
        _.times(6, i => {return _.random(0.1, 1, true).toFixed(4)}),
        _.times(6, i => {return _.random(0.1, 1, true).toFixed(4)}),
        _.times(6, i => {return _.random(0.1, 1, true).toFixed(4)}),
        ['1月','2月','3月','4月','5月','6月']
      ],
      userGrowthData:[
        _.times(6, i => {return _.random(0.1, 1, true).toFixed(4)}),
        _.times(6, i => {return _.random(0.1, 1, true).toFixed(4)}),
        _.times(6, i => {return _.random(0.1, 1, true).toFixed(4)}),
        ['1月','2月','3月','4月','5月','6月']
      ],
      unitPriceData:[
        _.times(6, i => {return _.random(100, 10000, true).toFixed(2)}),
        _.times(6, i => {return _.random(100, 10000, true).toFixed(2)}),
        _.times(6, i => {return _.random(100, 10000, true).toFixed(2)}),
        ['1月','2月','3月','4月','5月','6月']
      ]
    }
  });

  res.send(ret);
});

// 细分市场竞争评估
router.get('/getCompeteData', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};

  Object.assign(ret, resultData, {
    data: {
      topTen: _.times(10, i => {
        return {
          key: i + 1,
          brand: '商品名字' + i,
          categoryRank: _.random(1, 10),
        };
      }),
      topThirty: _.times(30, i => {
        return {
          key: i + 1,
          productName: '联想(Lenovo)拯救者R720 15.6英寸游戏笔记本电脑' + i,
          sku: _.random(1000, 10000),
          categoryRank: _.random(1, 10),
        };
      })
    }
  });

  res.send(ret);
});

// 细分市场用户特征
router.get('/getUserFeatureData', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};
  Object.assign(ret, resultData, {
    data: {
      tagsData: ['城市','购买力','性别','促销敏感度'],
      marketData: [
         _.times(5, i => {return _.random(0.1, 1, true)}),
         _.times(5, i => {return -_.random(0.1, 1, true)}),
         ['一线','二线','三线','四线','五线']
      ],
      categoryData: [
         _.times(5, i => {return _.random(0.1, 1, true)}),
         _.times(5, i => {return -_.random(0.1, 1, true)}),
         ['一线','二线','三线','四线','五线']
      ]
    }
  });

  res.send(ret);
});

module.exports = router;
