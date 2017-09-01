'use strict';

const express = require('express');
const _ = require('lodash');
const router = express.Router();
const { resultData } = require('../../common/utils');
const moment = require('moment');

router.post('/getProps', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};

  Object.assign(ret, resultData, {
    data: _.times(10, i => {
      return {
        value: (i + 1) + '',
        label: '属性' + (i + 1),
        checked: i < 4 ? true : false
      };
    })
  });

  res.send(ret);
});

router.post('/getUserContribution', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};
  console.log(params);
  Object.assign(ret, resultData, {
    data: {
      usersNumber: _.random(100000, 500000),
      singularNumber: _.random(100000, 500000),
      salesContribution: _.random(100000, 500000)
    }
  });

  res.send(ret);
});

router.post('/getPropsData', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};

  Object.assign(ret, resultData, {
    data: _.times(4, i => {
      return {
        propName: '属性' + (i + 1),
        labels: _.times(26, j => {
          return {
            name: '标签' + (j + 1) + (_.random(1, 100) > 50 ? '' : ''),
            user: +_.random(0.1, 1.0).toFixed(4),
            sale: +_.random(0.1, 1.0).toFixed(4),
            categoryUser: +_.random(0.1, 1.0).toFixed(4),
            categorySale: +_.random(0.1, 1.0).toFixed(4),
          };
        }),
        maxLabel: '标签' + (i + 1)
      };
    })
  });

  res.send(ret);
});

router.post('/getPropsDetailData', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};

  Object.assign(ret, resultData, {
    data: _.times(_.random(1, 10) > 5 ? 6 : 3, i => {
      return {
        name: '测试测试测试测试标签' + (i + 1),
        user: +_.random(0.1, 1.0).toFixed(4),
        sale: +_.random(0.1, 1.0).toFixed(4),
        categoryUser: +_.random(0.1, 1.0).toFixed(4),
        categorySale: +_.random(0.1, 1.0).toFixed(4),
        unitPrice: _.random(1000, 10000),
        repurchasingRate: +_.random(0.1, 1.0).toFixed(4),
        categoryUnitPrice: _.random(1000, 10000),
        categoryRepurchasingRate: +_.random(0.1, 1.0).toFixed(4),
      }
    })
  });

  res.send(ret);
});

router.post('/getUserStructureData', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};

  Object.assign(ret, resultData, {
    data: _.times(4, i => {
      return {
        propName: '属性' + (i + 1),
        brands: _.times(3, j => `品牌${j + 1}`),
        labels: _.times(20, j => {
          return {
            name: `标签${j + 1}`,
            value: _.times(3, j => +_.random(0.01, 0.25).toFixed(4))
          };
        })
      }
    })
  });

  res.send(ret);
});

module.exports = router;