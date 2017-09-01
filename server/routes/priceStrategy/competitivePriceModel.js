'use strict';

const express = require('express');
const _ = require('lodash');
const router = express.Router();
const { resultData } = require('../../common/utils');
const moment = require('moment');

router.post('/getContrastRelationData', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};

  Object.assign(ret, resultData, {
    data: _.times(5, i => {
      return {
        sku: (i + 100000) + '',
        wareName: '商品' + (i + 1),
        competeList: _.times(5, j => {
          const _r1 = _.random(0, 1) > 0.5;

          return {
            sku: (j + 200000) + '',
            wareName: '测试测试测试测试测试测试测试测试测试测试友商商品' + (j + 1),
            sourceId: _r1 ? '1' : '2',
            sourceName: _r1 ? '天猫' : '淘宝'
          };
        })
      };
    })
  });

  res.send(ret);
});

router.post('/getWareName', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};

  Object.assign(ret, resultData, {
    data: params.sku + '_商品名称'
  });

  res.send(ret);
});

router.post('/getCompeteWareInfo', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};

  Object.assign(ret, resultData, {
    data: {
      wareName: params.sku + '_友商商品名称',
      matchList: _.times(2, i => {
        const _r1 = _.random(0, 1) > 0.5;

        return {
          sku: (i + 200000) + '',
          wareName: '友商商品' + (i + 1),
          sourceId: _r1 ? '1' : '2',
          sourceName: _r1 ? '天猫' : '淘宝'
        };
      })
    }
  });

  res.send(ret);
});

// router.post('/addWare', function(req, res) {
//   res.type('json');
//   let params = req.body,
//     ret = {};

//   Object.assign(ret, resultData);

//   res.send(ret);
// });

router.post('/addCompeteWare', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};

  Object.assign(ret, resultData);

  res.send(ret);
});

router.post('/deleteWare', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};

  Object.assign(ret, resultData);

  res.send(ret);
});

router.post('/deleteCompeteWare', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};

  Object.assign(ret, resultData);

  res.send(ret);
});

router.post('/getPromotionData', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};

  Object.assign(ret, resultData, {
    data: {
      date: params.date,
      promotion: _.times(2, j => {
        return {
          name: '促销' + (j + 1),
          content: _.random(1, 100) > 50 ? '满100减100现金\n满200减100现金' : null
        };
      }),
      competePromotion: _.times(2, j => {
        return {
          name: '促销' + (j + 1),
          content: _.random(1, 100) > 50 ? '满100减100现金<br>满200减100现金' : null
        };
      })
    }
  });

  res.send(ret);
});

router.post('/getTrendAnalysisData', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};

  Object.assign(ret, resultData, {
    data: _.times(365, i => {
      return {
        date: moment('2017-01-01').add('days', i).format("YYYY-MM-DD"),
        price: _.times(3, i => {
          return {
            time: `${15 + i}:00`,
            value: _.random(1000, 10000)
          };
        }),
        competePrice: _.times(3, i => {
          return {
            time: `${17 + i}:00`,
            value: _.random(1000, 10000)
          };
        }),
        sales: _.random(1000, 10000),
        competeSales: _.random(1000, 10000)
      };
    })
  });

  res.send(ret);
});

module.exports = router;