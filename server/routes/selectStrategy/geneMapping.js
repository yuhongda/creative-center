'use strict';

const express = require('express');
const _ = require('lodash');
const router = express.Router();
const { resultData } = require('../../common/utils');

router.get('/getRequirementInsightData', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};

  Object.assign(ret, resultData, {
    data: [
      {
        id:1,
        key:1,
        rank:1,
        name:'口味',
        rankOffline:2,
        children:[
          _.times(5, i => {
            return {
              key:11,
              rank:i+1,
              type:'原味',
              salesRates:_.random(0, 1,true).toFixed(2),
              salesAmountRates:_.random(0, 1,true).toFixed(2),
              salesGrowth:_.random(0, 1,true).toFixed(2),
              uvGrowth:_.random(0, 1,true).toFixed(2),
              uvConvertion:_.random(0, 1,true).toFixed(2),
              price:1000,
              userGrowth:_.random(0, 1,true).toFixed(2)
            };
          }),
          _.times(5, i => {
            return {
              key:12,
              rank:i+1+10,
              type:'原味',
              salesRates:_.random(0, 1,true).toFixed(2),
              salesAmountRates:_.random(0, 1,true).toFixed(2),
              salesGrowth:_.random(0, 1,true).toFixed(2),
              uvGrowth:_.random(0, 1,true).toFixed(2),
              uvConvertion:_.random(0, 1,true).toFixed(2),
              price:1000,
              userGrowth:_.random(0, 1,true).toFixed(2)
            };
          })
        ]
      },
      {
        id:2,
        key:2,
        rank:2,
        name:'产地',
        rankOffline:1,
        children:[
          _.times(5, i => {
            return {
              key:21,
              rank:i+1+20,
              type:'北京',
              salesRates:_.random(0, 1,true).toFixed(2),
              salesAmountRates:_.random(0, 1,true).toFixed(2),
              salesGrowth:_.random(0, 1,true).toFixed(2),
              uvGrowth:_.random(0, 1,true).toFixed(2),
              uvConvertion:_.random(0, 1,true).toFixed(2),
              price:1000,
              userGrowth:_.random(0, 1,true).toFixed(2)
            };
          }),
          [
            {
              key:22,
              rank:100,
              type:'东京',
              salesRates:0.55,
              salesAmountRates:0.55,
              salesGrowth:0.55,
              uvGrowth:0.55,
              uvConvertion:0.55,
              price:1000,
              userGrowth:0.55
            }
          ]
        ]
      },
      {
        id:3,
        key:3,
        rank:3,
        name:'产地2',
        rankOffline:3,
        children:[
          _.times(5, i => {
            return {
              key:31,
              rank:i+1+20,
              type:'北京',
              salesRates:_.random(0, 1,true).toFixed(2),
              salesAmountRates:_.random(0, 1,true).toFixed(2),
              salesGrowth:_.random(0, 1,true).toFixed(2),
              uvGrowth:_.random(0, 1,true).toFixed(2),
              uvConvertion:_.random(0, 1,true).toFixed(2),
              price:1000,
              userGrowth:_.random(0, 1,true).toFixed(2)
            };
          }),
          [
            {
              key:32,
              rank:100,
              type:'东京',
              salesRates:0.55,
              salesAmountRates:0.55,
              salesGrowth:0.55,
              uvGrowth:0.55,
              uvConvertion:0.55,
              price:1000,
              userGrowth:0.55
            }
          ]
        ]
      }
    ]
  });

  res.send(ret);
});

router.post('/setOfflineRank', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};


  res.send(ret);
});


/**
 * 基因链分析
 * params: 属性1，属性2
 */
router.get('/getGeneLinkData', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};

  Object.assign(ret, resultData, {
    data: [
      [
        {
          id:1,
          key:1,
          rank:1,
          name:'原味',
          salesRates:_.random(0, 1,true).toFixed(2),
          children:[
            {
              id:11,
              key:11,
              name:'国产',
              salesRates:_.random(0, 1,true).toFixed(2)
            },
            {
              id:12,
              key:12,
              name:'进口',
              salesRates:_.random(0, 1,true).toFixed(2)
            }
          ]
        },
        {
          id:2,
          key:2,
          rank:2,
          name:'巧克力味',
          salesRates:_.random(0, 1,true).toFixed(2),
          children:[
            {
              id:21,
              key:21,
              name:'国产',
              salesRates:_.random(0, 1,true).toFixed(2)
            },
            {
              id:22,
              key:22,
              name:'进口',
              salesRates:_.random(0, 1,true).toFixed(2)
            }
          ]
        }
      ],
      [
        {
          id:1,
          key:1,
          rank:1,
          name:'原味',
          uvRates:_.random(0, 1,true).toFixed(2),
          children:[
            {
              id:31,
              key:11,
              name:'国产',
              uvRates:_.random(0, 1,true).toFixed(2)
            },
            {
              id:32,
              key:12,
              name:'进口',
              uvRates:_.random(0, 1,true).toFixed(2),
            }
          ]
        },
        {
          id:4,
          key:2,
          rank:2,
          name:'巧克力味',
          uvRates:_.random(0, 1,true).toFixed(2),
          children:[
            {
              id:41,
              key:21,
              name:'国产1',
              uvRates:_.random(0, 1,true).toFixed(2)
            },
            {
              id:42,
              key:22,
              name:'进口2',
              uvRates:_.random(0, 1,true).toFixed(2)
            }
          ]
        }
      ]
    ]
  });

  res.send(ret);
});


module.exports = router;