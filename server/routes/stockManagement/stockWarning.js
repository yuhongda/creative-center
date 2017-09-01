'use strict';

const express = require('express');
const _ = require('lodash');
const router = express.Router();
const { resultData } = require('../../common/utils');

router.get('/getWaringSummary', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};
  Object.assign(ret, resultData, {
    data: {
      noStockStopMoney: null,
      noStockStopGrowth: -_.random(0.1, 1, true),
      pvMoney: _.random(0.1, 1, true),
      pvGrowth: -_.random(0.1, 1, true),
      noSalesMoney: _.random(100000, 10000000),
      noSalesGrowth: _.random(0.1, 1, true),
      outOfStockMoney: null,
      outOfStockGrowth:-_.random(0.1, 1, true),
      unsalableMoney: _.random(0.1, 1, true),
      unsalableGrowth: _.random(0.1, 1, true),

      // noStockStopMoney:null,
      // noStockStopGrowth: null,
      // pvmoney: 0,
      // pvgrowth: null,
      // noSalesMoney:null,
      // noSalesGrowth: 0,
      // outOfStockMoney: null,
      // outOfStockGrowth: 0,
      // unsalableMoney: 0,
      // unsalableGrowth: 0,
    }
  });
  res.send(ret);
});

//===================== stockPause 缺货暂停金额 =======================
router.get('/getStockPauseData', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};
  Object.assign(ret, resultData, {
    data: [
      ['4天以内', '4-7天以内', '7-30天', '31天以上'],
      _.times(4, i => { return _.random(0.1, 1.0).toFixed(2) }),
      _.times(4, i => { return -_.random(0.1, 1.0).toFixed(2) }),
      [4,47,730,30]
    ]
  });
  res.send(ret);
});

router.get('/getStockPauseListData', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};
  Object.assign(ret, resultData, {
    // data: [
    //   {
    //     key:  1,
    //     productName: 'Android O 自适应图标的意义何在？Google 设计师给你答案科普',
    //     sku: _.random(1, 1000),
    //     orderNum: _.random(1, 100),
    //     lossSum: _.random(5000, 100000),
    //     lossPer: null
    //   },{
    //     key:  2,
    //     productName: 'Android O 自适应图标的意义何在？Google 设计师给你答案科普',
    //     sku: _.random(1, 1000),
    //     orderNum: _.random(1, 100),
    //     lossSum: _.random(5000, 100000),
    //     lossPer: _.random(0.1, 1, true)
    //   },{
    //     key:  3,
    //     productName: 'Android O 自适应图标的意义何在？Google 设计师给你答案科普',
    //     sku: _.random(1, 1000),
    //     orderNum: _.random(1, 100),
    //     lossSum: _.random(5000, 100000),
    //     lossPer: 0
    //   },{
    //     key:  4,
    //     productName: 'Android O 自适应图标的意义何在？Google 设计师给你答案科普',
    //     sku: _.random(1, 1000),
    //     orderNum: _.random(1, 100),
    //     lossSum: _.random(5000, 100000),
    //     lossPer: _.random(0.1, 1, true)
    //   },{
    //     key:  5,
    //     productName: 'Android O 自适应图标的意义何在？Google 设计师给你答案科普',
    //     sku: _.random(1, 1000),
    //     orderNum: _.random(1, 100),
    //     lossSum: _.random(5000, 100000),
    //     lossPer: null
    //   },
    // ]
    data: _.times(15, i => {
      return {
        key: i + 1,
        productName: 'Android O 自适应图标的意义何在？Google 设计师给你答案科普' + i,
        sku: _.random(1, 1000),
        orderNum: _.random(1, 100),
        lossSum: _.random(5000, 100000),
        lossPer: _.random(1, 100)
      };
    })
  });
  res.send(ret);
});

//===================== StockOutPV 无货PV =======================
router.get('/getStockOutPVBarData', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};
  Object.assign(ret, resultData, {
    data: [
       _.times(6, i => { return _.random(1000, 5000) }),
       _.times(6, i => { return _.random(5000, 10000) }),
       ['巴西','印尼','美国','印度','中国','日本'],
       [211, 222, 233, 244, 255, 266],
    ]
  });
  res.send(ret);
});

router.get('/getStockOutPVPieData', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};
  Object.assign(ret, resultData, {
    data: [
       ['京东未下单','采购在途','品牌商缺货','分销商未下单','超配额订货','停售商品','其他'],
       [
         {value:_.random(1, 100), name:'京东未下单'},
         {value:_.random(1, 100), name:'采购在途'},
         {value:_.random(1, 100), name:'品牌商缺货'},
         {value:_.random(1, 100), name:'分销商未下单'},
         {value:_.random(1, 100), name:'超配额订货'},
         {value:_.random(1, 100), name:'停售商品'},
         {value:_.random(1, 100), name:'其他'}
      ]
    ]
  });
  res.send(ret);
});

router.get('/getStockOutPVBarListData', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};
  Object.assign(ret, resultData, {
    // data: [
    //   {
    //     key: 1,
    //     productName: '不仅吃饭可以打折 如今「王者荣耀」段位高买车也能优惠了',
    //     sku: _.random(1000, 10000),
    //     isSale:'否',
    //     pv: _.random(5000, 100000),
    //     pvPer: _.random(0.1, 1, true),
    //     stockCause: '缺货原因'
    //   },{
    //     key: 2,
    //     productName: '不仅吃饭可以打折 如今「王者荣耀」段位高买车也能优惠了',
    //     sku: _.random(1000, 10000),
    //     isSale:'否',
    //     pv: _.random(5000, 100000),
    //     pvPer: null,
    //     stockCause: '缺货原因'
    //   },{
    //     key: 3,
    //     productName: '不仅吃饭可以打折 如今「王者荣耀」段位高买车也能优惠了',
    //     sku: _.random(1000, 10000),
    //     isSale:'否',
    //     pv: _.random(5000, 100000),
    //     pvPer: 0,
    //     stockCause: '缺货原因'
    //   },{
    //     key: 4,
    //     productName: '不仅吃饭可以打折 如今「王者荣耀」段位高买车也能优惠了',
    //     sku: _.random(1000, 10000),
    //     isSale:'否',
    //     pv: _.random(5000, 100000),
    //     pvPer: _.random(0.1, 1, true),
    //     stockCause: '缺货原因'
    //   },
    // ]
    data: _.times(15, i => {
      return {
        key: i + 1,
        productName: '不仅吃饭可以打折 如今「王者荣耀」段位高买车也能优惠了' + i,
        sku: _.random(1000, 10000),
        isSale:'否',
        pv: _.random(5000, 100000),
        pvPer: _.random(1, 100),
        stockCause: '缺货原因'
      };
    })
  });
  res.send(ret);
});

router.get('/getStockOutPVPieListData', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};
  Object.assign(ret, resultData, {
    data:[]
  });
  res.send(ret);
});

//===================== belowStock 下柜库存金额 =======================
router.get('/getBelowStockData', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};
  Object.assign(ret, resultData, {
    data: [
      ['Top5商品','其它'],
      [
          {value:_.random(1000, 10000), name:'Top5商品'},
          {value:_.random(1000, 10000), name:'其它'},
      ]
    ]
  });
  res.send(ret);
});

router.get('/getBelowStockListData', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};
  Object.assign(ret, resultData, {
    // data: [
    //   {
    //     key: 1,
    //     productName: '经验分享：用产品思维进行团队管理',
    //     sku: _.random(1000, 10000),
    //     blowSum: _.random(1000, 10000),
    //     blowPer: _.random(0.1, 1, true),
    //   },{
    //     key: 2,
    //     productName: '经验分享：用产品思维进行团队管理',
    //     sku: _.random(1000, 10000),
    //     blowSum: _.random(1000, 10000),
    //     blowPer: null,
    //   },{
    //     key: 3,
    //     productName: '经验分享：用产品思维进行团队管理',
    //     sku: _.random(1000, 10000),
    //     blowSum: _.random(1000, 10000),
    //     blowPer: 0,
    //   },{
    //     key: 4,
    //     productName: '经验分享：用产品思维进行团队管理',
    //     sku: _.random(1000, 10000),
    //     blowSum: _.random(1000, 10000),
    //     blowPer: _.random(0.1, 1, true),
    //   },
    // ]
    data: _.times(15, i => {
      return {
        key: i + 1,
        productName: '经验分享：用产品思维进行团队管理' + i,
        sku: _.random(1000, 10000),
        blowSum: _.random(1000, 10000),
        blowPer: _.random(1, 100),
      };
    })
  });
  res.send(ret);
});

//===================== stockOut 库存缺货 =======================
router.get('/getStockOutData', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};
  Object.assign(ret, resultData, {
    data: [
       _.times(6, i => { return _.random(1000, 10000) }),
       _.times(6, i => { return _.random(1000, 10000) }),
       ['巴西','印尼','美国','印度','中国','日本'],
       [411, 422, 433, 44, 55, 66],
    ]
  });
  res.send(ret);
});

router.get('/getStockOutListData', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};
  Object.assign(ret, resultData, {
    data: _.times(15, i => {
      return {
        key: i + 1,
        productName: '看不惯又干不掉的引导界面，该怎么设计？' + i,
        sku: _.random(1000, 10000),
        isSale:'否'
      };
    })
  });
  res.send(ret);
});

//===================== deadStock 滞销商品 =======================
router.get('/getDeadStockData', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};
  Object.assign(ret, resultData, {
    data: [
       ['北京','上海','南京','天津','湖南'],
       [
         {value:_.random(100, 10000), name:'北京'},
         {value:_.random(100, 10000), name:'上海'},
         {value:_.random(100, 10000), name:'南京'},
         {value:_.random(100, 10000), name:'天津'},
         {value:_.random(100, 10000), name:'湖南'}
      ],
      [511, 522, 533, 544, 555],
    ]
  });
  res.send(ret);
});

router.get('/getDeadStockListData', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};
  Object.assign(ret, resultData, {
    // data: [
    //   {
    //     key:1,
    //     productName: '特斯拉将推出小型SUV，与Model 3共用底盘' ,
    //     sku: _.random(1000, 10000),
    //     dc:'北京',
    //     deadStock: _.random(100, 10000),
    //     totalStock: _.random(1000, 10000),
    //     dailySales: _.random(100, 10000),
    //     turnover: _.random(10, 100, true),
    //     days: 30,
    //   },{
    //     key:2,
    //     productName: '特斯拉将推出小型SUV，与Model 3共用底盘' ,
    //     sku: _.random(1000, 10000),
    //     dc:'北京',
    //     deadStock: _.random(100, 10000),
    //     totalStock: _.random(1000, 10000),
    //     dailySales: _.random(100, 10000),
    //     turnover: null,
    //     days: 30,
    //   },{
    //     key:3,
    //     productName: '特斯拉将推出小型SUV，与Model 3共用底盘' ,
    //     sku: _.random(1000, 10000),
    //     dc:'北京',
    //     deadStock: _.random(100, 10000),
    //     totalStock: _.random(1000, 10000),
    //     dailySales: _.random(100, 10000),
    //     turnover: 0,
    //     days: 30,
    //   },{
    //     key:4,
    //     productName: '特斯拉将推出小型SUV，与Model 3共用底盘' ,
    //     sku: _.random(1000, 10000),
    //     dc:'北京',
    //     deadStock: _.random(100, 10000),
    //     totalStock: _.random(1000, 10000),
    //     dailySales: _.random(100, 10000),
    //     turnover: _.random(10, 100, true),
    //     days: 30,
    //   },
    // ]
    data: _.times(15, i => {
      return {
        key: i + 1,
        productName: '特斯拉将推出小型SUV，与Model 3共用底盘' + i,
        sku: _.random(1000, 10000),
        dc:'北京',
        deadStock: _.random(100, 10000),
        totalStock: _.random(1000, 10000),
        dailySales: _.random(100, 10000),
        turnover: _.random(10, 100, true)
      };
    })
  });
  res.send(ret);
});

module.exports = router;
