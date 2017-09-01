'use strict';

const express = require('express');
const _ = require('lodash');
const router = express.Router();
const { resultData } = require('../../common/utils');

router.get('/getBrandSummaryData', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};

  Object.assign(ret, resultData, {
    data: {
      userAvg:20000,
      salesAmountAvg:3000,
      list:[
        [_.random(0, 10000), _.random(0, 100000,true),'海飞丝'],
        [_.random(0, 10000), _.random(0, 100000,true),'潘婷'],
        [_.random(0, 10000), _.random(0, 100000,true),'欧莱雅']
      ]
    }
  });

  res.send(ret);
});

/**
 * 省份分析 - map
 */
router.get('/getMapData', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};

  Object.assign(ret, resultData, {
    data:[
      {"name":"北京","value":_.random(0, 1,true)},
      {"name":"上海","value":_.random(0, 1,true)},
      {"name":"广东","value":_.random(0, 1,true)},
      {"name":"新疆","value":_.random(0, 1,true)}
    ]
  });

  res.send(ret);
});

/**
 * 省份分析 - 排行
 */
router.get('/getProvinceRankData', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};

  Object.assign(ret, resultData, {
    data: _.times(10, i => {
      return {
        brandName:'海飞丝',
        salesRank:i+1,
        productCount:i+1
      };
    })
  });

  res.send(ret);
});

/**
 * 
 * 城市级别 - bar
 */
router.get('/getCityBarData', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};

  Object.assign(ret, resultData, {
    data: [
      [_.random(0, 1000), _.random(0, 1000), _.random(0, 1000), _.random(0, 1000), _.random(0, 1000)],
      ['一线', '二线', '三线', '四线', '五线']
    ]
  });

  res.send(ret);
});


/**
 * 城市级别 - 排行
 */
router.get('/getCityRankData', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};

  Object.assign(ret, resultData, {
    data: _.times(10, i => {
      return {
        brandName:'海飞丝city',
        salesRank:i+1,
        productCount:i+1
      };
    })
  });

  res.send(ret);
});


/**
 * 品牌
 */
router.get('/getBrandData', function(req, res) {
  res.type('json');
  let ret = {};

  Object.assign(ret, resultData, {
    data: [{
      value: 123 + '',
      label: '品牌1'
    }, {
      value: 412 + '',
      label: '品牌2'
    }]
  });

  res.send(ret);
});


/**
 * 品牌标签
 */
router.get('/getBrandTagData', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};

  Object.assign(ret, resultData, {
    data: [
      {tagId:1, tagName:'口味'},
      {tagId:2, tagName:'分类'},
      {tagId:3, tagName:'价格'},
      {tagId:4, tagName:'包装'}
    ]
  });

  res.send(ret);
});


/**
 * 品牌画像
 */
router.get('/getBrandPortraitData', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};

  Object.assign(ret, resultData, {
    data: [
      [
        {
          brandName:'品牌1',
          data:[_.random(0, 1000),_.random(0, 1000),_.random(0, 1000),_.random(0, 1000),_.random(0, 1000)]
        },
        {
          brandName:'品牌2',
          data:[_.random(0, 1000),_.random(0, 1000),_.random(0, 1000),_.random(0, 1000),_.random(0, 1000)]
        }
      ],
      [_.random(0, 1000), _.random(0, 1000), _.random(0, 1000), _.random(0, 1000), _.random(0, 1000)],
      ['巧克力味', '盐味', '甜味', '酸味', '其他']
    ]
  });

  res.send(ret);
});

module.exports = router;