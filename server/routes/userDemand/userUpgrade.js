'use strict';

const express = require('express');
const _ = require('lodash');
const router = express.Router();
const { resultData } = require('../../common/utils');

/**
 * 用户趋势
 */
router.get('/getUserTrendsData', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};

  Object.assign(ret, resultData, {
    data: [
      [18203, 234289, 29034, 104970, 131744, 630230, 630230],
      [18203, 0, 29034, 104970, 131744, 630230, 630230],
      ['2017-06', '2017-07', '2017-08', '2017-09', '2017-10', '2017-11', '2017-12']
    ]
  });

  res.send(ret);
});

/**
 * 用户留存
 */
router.get('/getUserRetentionData', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};

  Object.assign(ret, resultData, {
    // data: [
    //   [0, 800, 800, 0, 0],
    //   [900, '-', '-', '-'],
    //   ['-', 100, '-', '-'],
    //   ['-', '-', 300, '-'],
    //   ['-', '-', '-', 1100],
    //   [0, _.random(0, 1, true), _.random(0, 1, true), _.random(0, 1, true)],
    //   ['基期留存用户', '流失用户', '新增用户', '留存用户', '占基期留存用户']
    // ]
    data:[[0,10667,10667,0],["11333","-","-","-"],["-","666","-","-"],["-","-","1213","-"],["-","-","-","11537"],
      [0, _.random(0, 1, true), _.random(0, 1, true), _.random(0, 1, true)],
    ["基期留存用户","流失用户","新增用户","留存用户","占基期留存用户比"]]
  });

  res.send(ret);
});

/**
 * 新客来源
 */
router.get('/getUserSourceData', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};

  Object.assign(ret, resultData, {
    data: {
      newUserCount: _.random(0,10000),
      userRetentionRate: _.random(0, 1, true),
      userGrowth: _.random(0, 1, true),
      chartData:[
        [0, _.random(0, 1, true), _.random(0, 1, true)],
        ['京东拉新', '京东拉新', '品牌拉新']
      ]
    }
    
    
  });

  res.send(ret);
});

/**
 * 留存用户行为
 */
router.get('/getUserBehaviorData', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};

  Object.assign(ret, resultData, {
    data: [
      [_.random(0, 1, true), _.random(0, 1, true),_.random(0, 1, true), _.random(0, 1, true)],
      [100000, 52, 200, 334],
      ['1次', '2次', '3次', '4次']
    ]
  });

  res.send(ret);
});

/**
 * 最受欢迎sku
 */
router.get('/getHotSkuData', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};

  Object.assign(ret, resultData, {
    data: {
      hotSkuForNewUser: _.times(10, i => {
        return {
          rank:i+1,
          sku:4071550,
          name:'【京东超市】飘柔 Rejoice 净爽去屑洗发露750ml净爽去屑洗发露750ml净爽去屑洗发露750ml净爽去屑洗发露750ml净爽去屑洗发露750ml',
          volume:_.random(0, 10000)
        };
      }),
      hotSkuForOldUser: _.times(10, i => {
        return {
          rank:i+1,
          sku:4071550,
          name:'【京东超市】飘柔 Rejoice 净爽去屑洗发露750ml净爽去屑洗发露750ml净爽去屑洗发露750ml净爽去屑洗发露750ml净爽去屑洗发露750ml',
          volume:_.random(0, 10000)
        };
      })
    }
  });

  res.send(ret);
});


/**
 * 品类关联度
 */
router.get('/getCorrelationData', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};

  Object.assign(ret, resultData, {
    data: [
      {
        rank:1,
        categoryId:1,
        category:'饼干蛋糕',
        correlation:_.random(0, 1, true),
        coincidence:_.random(0, 1, true),
        expansion:_.random(0, 1, true)
      },
      {
        rank:2,
        categoryId:2,
        category:'休闲零食',
        correlation:_.random(0, 1, true),
        coincidence:_.random(0, 1, true),
        expansion:_.random(0, 1, true)
      },
      {
        rank:3,
        categoryId:3,
        category:'坚果炒货',
        correlation:_.random(0, 0.1, true),
        coincidence:_.random(0, 0.1, true),
        expansion:_.random(0, 0.1, true)
      },
      {
        rank:4,
        categoryId:4,
        category:'蜜饯果干',
        correlation:_.random(0, 0.1, true),
        coincidence:_.random(0, 0.1, true),
        expansion:_.random(0, 0.1, true)
      },
      {
        rank:5,
        categoryId:5,
        category:'肉干肉铺',
        correlation:_.random(0, 0.1, true),
        coincidence:_.random(0, 0.1, true),
        expansion:_.random(0, 0.1, true)
      }
    ]
  });

  res.send(ret);
});

/**
 * 重合用户品牌偏好
 */
router.get('/getCoincidenceData', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};

  Object.assign(ret, resultData, {
    data: [
      {
        id:1,
        rank:1,
        brandName:'飘柔',
        coincidenceData:_.times(5, i => {
          return {
            rank:i+1,
            brandName:'稻香村',
            coincidence:_.random(0, 0.1, true),
            expansion:_.random(0, 10, true)
          };
        })
      },
      {
        id:2,
        rank:2,
        brandName:'海飞丝',
        coincidenceData:_.times(5, i => {
          return {
            rank:i+1,
            brandName:'达利园',
            coincidence:_.random(0, 10, true),
            expansion:_.random(0, 10, true)
          };
        })
      },
      {
        id:3,
        rank:3,
        brandName:'沙宣',
        coincidenceData:_.times(5, i => {
          return {
            rank:i+1,
            brandName:'盼盼',
            coincidence:_.random(0, 10, true),
            expansion:_.random(0, 10, true)
          };
        })
      }
    ]
  });

  res.send(ret);
});

/**
 * 京东内销售排名
 */
router.get('/getBrandRankData', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};

  Object.assign(ret, resultData, {
    data: [
      {
        id:1,
        rank:1,
        brandName:'飘柔',
        brandLogo:'//img30.360buyimg.com/popshop/jfs/t934/198/911579725/8999/a9779c6d/55598e22N474e1ab8.jpg',
        userRates:-_.random(0, 100, true),
        rebuyRates:_.random(0, 100, true),
        priceRates:_.random(0, 100, true)
      },
      {
        id:2,
        rank:2,
        brandName:'海飞丝',
        brandLogo:'//img30.360buyimg.com/popshop/jfs/t934/198/911579725/8999/a9779c6d/55598e22N474e1ab8.jpg',
        userRates:_.random(0, 100, true),
        rebuyRates:_.random(0, 100, true),
        priceRates:_.random(0, 100, true)
      },
      {
        id:3,
        rank:3,
        brandName:'沙宣',
        brandLogo:'//img30.360buyimg.com/popshop/jfs/t934/198/911579725/8999/a9779c6d/55598e22N474e1ab8.jpg',
        userRates:_.random(0, 1, true),
        rebuyRates:_.random(0, 1, true),
        priceRates:_.random(0, 1, true)
      }
    ]
  });

  res.send(ret);
});


/**
 * 重合用户占比
 */
router.get('/getUserCoincidenceRates', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};

  Object.assign(ret, resultData, {
    data: {
      value:_.random(0, 1, true)
    }
  });

  res.send(ret);
});

module.exports = router;
