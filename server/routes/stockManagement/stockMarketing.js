'use strict';

const express = require('express');
const _ = require('lodash');
const router = express.Router();
const { resultData } = require('../../common/utils');

router.get('/getSummaryData', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};

  Object.assign(ret, resultData, {
    data: {
      stockMoney:_.random(1, 100 * 10000),
      stockMoneyGrowth:_.random(0, 1, true),
      pvRates:_.random(0, 1, true),
      pvRatesGrowth:-_.random(0, 1, true),
      inStockRates:_.random(0, 1, true),
      inStockRatesGrowth:_.random(0, 1, true),
      inStockRatesBig:_.random(0, 1, true),
      inStockRatesGrowthBig:_.random(0, 1, true),
      transferDays:_.random(1, 100),
      transferDaysGrowth:_.random(0, 1, true),
      bigSales:_.random(0, 1, true),
      bigSalesGrowth:_.random(0, 1, true),
      bigSalesBig:_.random(0, 1, true),
      bigSalesGrowthBig:_.random(0, 1, true),
      unsales:_.random(0, 1, true),
      unsalesGrowth:_.random(0, 1, true)
    }
  });

  res.send(ret);
});

router.get('/getMapData', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};

  Object.assign(ret, resultData, {
    data: {
      "mapDataStockMoney":[{"name":"北京","value":102},{"name":"武汉","value":1020}],
      "mapDataPV":[{"name":"北京","value":103},{"name":"天津","value":103}],
      "mapDataInStock":[{"name":"北京","value":104}],
      "mapDataInStockBig":[{"name":"北京","value":704}],
      "mapDataTransferDays":[{"name":"北京","value":105}],
      "mapDataBigSales":[{"name":"北京","value":106}],
      "mapDataBigSalesBig":[{"name":"北京","value":106}],
      "mapDataUnsales":[{"name":"北京","value":107}]
    }
  });

  res.send(ret);
});


router.get('/getLevelOneData', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};

  Object.assign(ret, resultData, {
    data: {
      l1DataStockMoney:[
        [18203, 23489, 29034, 104970, 131744, 630230],
        ['巴西','印尼','美国','印度','中国','世界人口(万)']
      ],
      l1DataPV:[
        [18203, 234289, 29034, 104970, 131744, 630230],
        ['巴西','印尼','美国','印度','中国','世界人口(万)']
      ],
      l1DataInStock:[
        [18203, 23489, 29034, 1043970, 131744, 630230],
        ['巴西','印尼','美国','印度','中国','世界人口(万)']
      ],
      l1DataInStockBig:[
        [18203, 23489, 29034, 1043970, 131744, 630230],
        ['巴西','印尼','美国','印度','中国','世界人口(万)']
      ],
      l1DataTransferDays:[
        [18203, 23489, 29034, 10434970, 131744, 630230],
        ['巴西','印尼','美国','印度','中国','世界人口(万)']
      ],
      l1DataBigSales:[
        [1820343, 23489, 29034, 104970, 131744, 630230],
        ['巴西','印尼','美国','印度','中国','世界人口(万)']
      ],
      l1DataBigSalesBig:[
        [1820343, 23489, 29034, 104970, 131744, 630230],
        ['巴西','印尼','美国','印度','中国','世界人口(万)']
      ],
      l1DataUnsales:[
        [18203, 23489, 29034, 104970, 13174344, 6310230],
        ['巴西','印尼','美国','印度','中国','世界人口(万)']
      ]
    }
  });

  res.send(ret);
});

router.get('/getBandData', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};

  Object.assign(ret, resultData, {
    data: {
      "bandDataStockMoney":[[320,302],[120,132],[220,182],[150,212],[820,832],[820,832],[821,900],["A","B","C","D","E","L","Z"]],
      "bandDataPV":[[18203,234289,29034,104970,131744,630230,630230],["A","B","C","D","E","L","Z"]],
      "bandDataInStock":[[18203,234289,29034,104970,131744,630230,630230],["A","B","C","D","E","L","Z"]],
      "bandDataInStockBig":[[18203,234289,29034,104970,131744,630230,630230],["A","B","C","D","E","L","Z"]],
      "bandDataTransferDays":[[18203,234289,29034,104970,131744,630230,630230],["A","B","C","D","E","L","Z"]],
      "bandDataBigSales":[[18203,234289,29034,104970,131744,630230,630230],["A","B","C","D","E","L","Z"]],
      "bandDataBigSalesBig":[[18203,234289,29034,104970,131744,630230,630230],["A","B","C","D","E","L","Z"]],
      "bandDataUnsales":[[18203,234289,29034,104970,131744,630230,630230],["A","B","C","D","E","L","Z"]]}
  });

  res.send(ret);
});

router.get('/getTrendsData', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};

  Object.assign(ret, resultData, {
    data: {
      trendsDataStockMoney: _.random(1, 100) > 50 ? [
        [_.random(1, 100), _.random(1, 100), _.random(1, 100), _.random(1, 100), _.random(1, 100)],
        [_.random(1, 100), _.random(1, 100), _.random(1, 100), _.random(1, 100), _.random(1, 100)],
        [_.random(1, 100), _.random(1, 100), _.random(1, 100), _.random(1, 100), _.random(1, 100)],
        [_.random(1, 100), _.random(1, 100), _.random(1, 100), _.random(1, 100), _.random(1, 100)],
        ['2017-01','2017-02','2017-03','2017-04','2017-05']
      ] : [
        [_.random(1, 100), _.random(1, 100), _.random(1, 100), _.random(1, 100), _.random(1, 100), _.random(1, 100), _.random(1, 100), _.random(1, 100), _.random(1, 100), _.random(1, 100)],
        [_.random(1, 100), _.random(1, 100), _.random(1, 100), _.random(1, 100), _.random(1, 100), _.random(1, 100), _.random(1, 100), _.random(1, 100), _.random(1, 100), _.random(1, 100)],
        [_.random(1, 100), _.random(1, 100), _.random(1, 100), _.random(1, 100), _.random(1, 100), _.random(1, 100), _.random(1, 100), _.random(1, 100), _.random(1, 100), _.random(1, 100)],
        [_.random(1, 100), _.random(1, 100), _.random(1, 100), _.random(1, 100), _.random(1, 100), _.random(1, 100), _.random(1, 100), _.random(1, 100), _.random(1, 100), _.random(1, 100)],
        ['2017-01','2017-02','2017-03','2017-04','2017-05', '2017-06','2017-07','2017-08','2017-09','2017-10']
      ],
      trendsDataPV:[
        [1000, 1000, 1000, 5000, 5000],
        [_.random(1, 100), _.random(1, 100), _.random(1, 100), _.random(1, 100), _.random(1, 100)],
        ['2017-01','2017-02','2017-03','2017-04','2017-05']
      ],
      trendsDataInStock:[
        [1000, 1000, 1000, 5000, 5000],
        [_.random(1, 100), _.random(1, 100), _.random(1, 100), _.random(1, 100), _.random(1, 100)],
        ['2017-01','2017-02','2017-03','2017-04','2017-05']
      ],
      trendsDataInStockBig:[
        [1000, 1000, 1000, 5000, 5000],
        [_.random(1, 100), _.random(1, 100), _.random(1, 100), _.random(1, 100), _.random(1, 100)],
        ['2017-01','2017-02','2017-03','2017-04','2017-05']
      ],
      trendsDataTransferDays:[
        [1000, 1000, 1000, 5000, 5000],
        [_.random(1, 100), _.random(1, 100), _.random(1, 100), _.random(1, 100), _.random(1, 100)],
        ['2017-01','2017-02','2017-03','2017-04','2017-05']
      ],
      trendsDataBigSales:[
        [1000, 1000, 1000, 5000, 5000],
        [_.random(1, 100), _.random(1, 100), _.random(1, 100), _.random(1, 100), _.random(1, 100)],
        ['2017-01','2017-02','2017-03','2017-04','2017-05']
      ],
      trendsDataBigSalesBig:[
        [1000, 1000, 1000, 5000, 5000],
        [_.random(1, 100), _.random(1, 100), _.random(1, 100), _.random(1, 100), _.random(1, 100)],
        ['2017-01','2017-02','2017-03','2017-04','2017-05']
      ],
      trendsDataUnsales:[
        [1000, 1000, 1000, 5000, 5000],
        [_.random(1, 100), _.random(1, 100), _.random(1, 100), _.random(1, 100), _.random(1, 100)],
        ['2017-01','2017-02','2017-03','2017-04','2017-05']
      ]
    }
  });

  res.send(ret);
});

router.get('/getTableData', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};

  Object.assign(ret, resultData, {
    data: {
      tableDataStockMoney:[
        [
          {title:'北京',dataIndex:'bj',key:'bj',width:'150px'},
          {title:'上海',dataIndex:'sh',key:'sh',width:'150px'},
          {title:'上海',dataIndex:'sh',key:'sh1',width:'150px'},
          {title:'上海',dataIndex:'sh',key:'sh2',width:'150px'},
          {title:'上海',dataIndex:'sh',key:'sh3',width:'150px'},
          {title:'上海',dataIndex:'sh',key:'sh4',width:'150px'},
          {title:'上海',dataIndex:'sh',key:'sh5',width:'150px'},
          {title:'上海',dataIndex:'sh',key:'sh6',width:'150px'},
          {title:'上海',dataIndex:'sh',key:'sh6',width:'150px'},
          {title:'上海',dataIndex:'sh',key:'sh6',width:'150px'},
          {title:'上海',dataIndex:'sh',key:'sh6',width:'150px'},
          {title:'上海',dataIndex:'sh',key:'sh6',width:'150px'},
          {title:'上海',dataIndex:'sh',key:'sh6',width:'150px'},
          {title:'上海',dataIndex:'sh',key:'sh6',width:'150px'},
          {title:'上海',dataIndex:'sh',key:'sh6',width:'150px'},
          {title:'上海',dataIndex:'sh',key:'sh6',width:'150px'},
          {title:'上海',dataIndex:'sh',key:'sh6',width:'150px'},
          {title:'上海',dataIndex:'sh',key:'sh6',width:'150px'},
          {title:'上海',dataIndex:'sh',key:'sh6',width:'150px'},
          {title:'上海',dataIndex:'sh',key:'sh6',width:'150px'},
          {title:'上海',dataIndex:'sh',key:'sh6',width:'150px'},
          {title:'上海',dataIndex:'sh',key:'sh6',width:'150px'},
          {title:'上海',dataIndex:'sh',key:'sh6',width:'150px'},
          {title:'上海',dataIndex:'sh',key:'sh6',width:'150px'},
          {title:'上海',dataIndex:'sh',key:'sh6',width:'150px'},
          {title:'上海',dataIndex:'sh',key:'sh6',width:'150px'},
          {title:'上海',dataIndex:'sh',key:'sh6',width:'150px'},
          {title:'上海',dataIndex:'sh',key:'sh6',width:'150px'},
          {title:'上海',dataIndex:'sh',key:'sh6',width:'150px'},
          {title:'上海',dataIndex:'sh',key:'sh6',width:'150px'},
          {title:'上海',dataIndex:'sh',key:'sh6',width:'150px'},
          {title:'上海',dataIndex:'sh',key:'sh6',width:'150px'},
          {title:'上海',dataIndex:'sh',key:'sh6',width:'150px'},
          {title:'上海',dataIndex:'sh',key:'sh6',width:'150px'},
          {title:'上海',dataIndex:'sh',key:'sh6',width:'150px'},
          {title:'上海',dataIndex:'sh',key:'sh6',width:'150px'},
          {title:'上海',dataIndex:'sh',key:'sh7',width:'150px'},
          {title:'上海',dataIndex:'sh',key:'sh8',width:'150px'},
          {title:'上海',dataIndex:'sh',key:'sh9',width:'150px'},
          {title:'广州',dataIndex:'gz',key:'gz',width:'150px'}
        ],
        [
          {
            key: 1,
            category: '个护化妆',
            bj: _.random(1, 1000000),
            sh: _.random(1, 1000000),
            sh1: _.random(1, 1000000),
            sh2: _.random(1, 1000000),
            sh3: _.random(1, 1000000),
            sh4: _.random(1, 1000000),
            sh5: _.random(1, 1000000),
            sh6: _.random(1, 1000000),
            sh7: _.random(1, 1000000),
            sh8: _.random(1, 1000000),
            sh9: _.random(1, 1000000),
            gz: _.random(1, 100),
            children: [
              {
                key: 11,
                category: '口腔护理',
                bj: _.random(1, 100),
                sh: _.random(1, 100),
                gz: _.random(1, 100),
                children: [
                  {
                    key: 111,
                    category: '口腔护理1',
                    bj: _.random(1, 100),
                    sh: _.random(1, 100),
                    gz: _.random(1, 100),
                  }
                ]
              }
            ]
          }
        ]
      ],
      tableDataPV:[
        [
          {title:'北京',dataIndex:'bj',key:'bj'},
          {title:'上海',dataIndex:'sh',key:'sh'},
          {title:'广州',dataIndex:'gz',key:'gz'}
        ],
        [
          {
            key: 1,
            category: '个护化妆',
            bj: _.random(1, 100),
            sh: _.random(1, 100),
            gz: _.random(1, 100),
            children: [
              {
                key: 11,
                category: '口腔护理',
                bj: _.random(1, 100),
                sh: _.random(1, 100),
                gz: _.random(1, 100),
              }
            ]
          }
        ]
      ],
      tableDataInStock:[
        [
          {title:'北京',dataIndex:'bj',key:'bj'},
          {title:'上海',dataIndex:'sh',key:'sh'},
          {title:'广州',dataIndex:'gz',key:'gz'}
        ],
        [
          {
            key: 1,
            category: '个护化妆',
            bj: _.random(1, 100),
            sh: _.random(1, 100),
            gz: _.random(1, 100),
            children: [
              {
                key: 11,
                category: '口腔护理',
                bj: _.random(1, 100),
                sh: _.random(1, 100),
                gz: _.random(1, 100),
              }
            ]
          }
        ]
      ],
      tableDataInStockBig:[
        [
          {title:'北京',dataIndex:'bj',key:'bj'},
          {title:'上海',dataIndex:'sh',key:'sh'},
          {title:'广州',dataIndex:'gz',key:'gz'}
        ],
        [
          {
            key: 1,
            category: '个护化妆',
            bj: _.random(1, 100),
            sh: _.random(1, 100),
            gz: _.random(1, 100),
            children: [
              {
                key: 11,
                category: '口腔护理',
                bj: _.random(1, 100),
                sh: _.random(1, 100),
                gz: _.random(1, 100),
              }
            ]
          }
        ]
      ],
      tableDataTransferDays:[
        [
          {title:'北京',dataIndex:'bj',key:'bj'},
          {title:'上海',dataIndex:'sh',key:'sh'},
          {title:'广州',dataIndex:'gz',key:'gz'}
        ],
        [
          {
            key: 1,
            category: '个护化妆',
            bj: _.random(1, 100),
            sh: _.random(1, 100),
            gz: _.random(1, 100),
            children: [
              {
                key: 11,
                category: '口腔护理',
                bj: _.random(1, 100),
                sh: _.random(1, 100),
                gz: _.random(1, 100),
              }
            ]
          }
        ]
      ],
      tableDataBigSales:[
        [
          {title:'北京',dataIndex:'bj',key:'bj'},
          {title:'上海',dataIndex:'sh',key:'sh'},
          {title:'广州',dataIndex:'gz',key:'gz'}
        ],
        [
          {
            key: 1,
            category: '个护化妆',
            bj: _.random(1, 100),
            sh: _.random(1, 100),
            gz: _.random(1, 100),
            children: [
              {
                key: 11,
                category: '口腔护理',
                bj: _.random(1, 100),
                sh: _.random(1, 100),
                gz: _.random(1, 100),
              }
            ]
          }
        ]
      ],
      tableDataBigSalesBig:[
        [
          {title:'北京',dataIndex:'bj',key:'bj'},
          {title:'上海',dataIndex:'sh',key:'sh'},
          {title:'广州',dataIndex:'gz',key:'gz'}
        ],
        [
          {
            key: 1,
            category: '个护化妆',
            bj: _.random(1, 100),
            sh: _.random(1, 100),
            gz: _.random(1, 100),
            children: [
              {
                key: 11,
                category: '口腔护理',
                bj: _.random(1, 100),
                sh: _.random(1, 100),
                gz: _.random(1, 100),
              }
            ]
          }
        ]
      ],
      tableDataUnsales:[
        [
          {title:'北京',dataIndex:'bj',key:'bj'},
          {title:'上海',dataIndex:'sh',key:'sh'},
          {title:'广州',dataIndex:'gz',key:'gz'}
        ],
        [
          {
            key: 1,
            category: '个护化妆',
            bj: _.random(1, 100),
            sh: _.random(1, 100),
            gz: _.random(1, 100),
            children: [
              {
                key: 11,
                category: '口腔护理',
                bj: _.random(1, 100),
                sh: _.random(1, 100),
                gz: _.random(1, 100),
              }
            ]
          }
        ]
      ]
    }
    // data:{"tableDataInStock":[],"tableDataBigSalesBig":[null,null],"tableDataStockMoney":[[{"title":"»´π˙","dataIndex":"all","key":"all","width":"150px"},{"title":"¥Ûº˛","dataIndex":"lg","key":"lg","width":"150px"},{"title":"÷––°º˛","dataIndex":"sml","key":"sml","width":"150px"}],[]],"tableDataTransferDays":[[{"title":"»´π˙","dataIndex":"all","key":"all","width":"150px"},{"title":"¥Ûº˛","dataIndex":"lg","key":"lg","width":"150px"},{"title":"÷––°º˛","dataIndex":"sml","key":"sml","width":"150px"}],[]],"tableDataInStockBig":[null,null],"tableDataUnsales":[[{"title":"»´π˙","dataIndex":"all","key":"all","width":"150px"},{"title":"¥Ûº˛","dataIndex":"lg","key":"lg","width":"150px"},{"title":"÷––°º˛","dataIndex":"sml","key":"sml","width":"150px"}],[]],"tableDataPV":[[{"title":"»´π˙","dataIndex":"all","key":"all","width":"150px"},{"title":"¥Ûº˛","dataIndex":"lg","key":"lg","width":"150px"},{"title":"÷––°º˛","dataIndex":"sml","key":"sml","width":"150px"}],[]],"tableDataBigSales":[null,null]}
  });

  res.send(ret);
});

router.get('/getTargetData', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};

  Object.assign(ret, resultData, {
    data: {
      targetDataPV:[
        _.random(1, 100), _.random(1, 100), _.random(1, 100), _.random(1, 100), 
        _.random(1, 100), _.random(1, 100), _.random(1, 100), _.random(1, 100), 
        _.random(1, 100), _.random(1, 100), _.random(1, 100), _.random(1, 100)
      ],
      targetDataInStock:[
        _.random(1, 100), _.random(1, 100), _.random(1, 100), _.random(1, 100), 
        _.random(1, 100), _.random(1, 100), _.random(1, 100), _.random(1, 100), 
        _.random(1, 100), _.random(1, 100), _.random(1, 100), _.random(1, 100)
      ],
      targetDataInStockBig:[
        _.random(1, 100), _.random(1, 100), _.random(1, 100), _.random(1, 100), 
        _.random(1, 100), _.random(1, 100), _.random(1, 100), _.random(1, 100), 
        _.random(1, 100), _.random(1, 100), _.random(1, 100), _.random(1, 100)
      ],
      targetDataTransferDays:[
        _.random(1, 100), _.random(1, 100), _.random(1, 100), _.random(1, 100), 
        _.random(1, 100), _.random(1, 100), _.random(1, 100), _.random(1, 100), 
        _.random(1, 100), _.random(1, 100), _.random(1, 100), _.random(1, 100)
      ],
      targetDataBigSales:[
        _.random(1, 100), _.random(1, 100), _.random(1, 100), _.random(1, 100), 
        _.random(1, 100), _.random(1, 100), _.random(1, 100), _.random(1, 100), 
        _.random(1, 100), _.random(1, 100), _.random(1, 100), _.random(1, 100)
      ],
      targetDataBigSalesBig:[
        _.random(1, 100), _.random(1, 100), _.random(1, 100), _.random(1, 100), 
        _.random(1, 100), _.random(1, 100), _.random(1, 100), _.random(1, 100), 
        _.random(1, 100), _.random(1, 100), _.random(1, 100), _.random(1, 100)
      ],
      targetDataUnsales:[
        _.random(1, 100), _.random(1, 100), _.random(1, 100), _.random(1, 100), 
        _.random(1, 100), _.random(1, 100), _.random(1, 100), _.random(1, 100), 
        _.random(1, 100), _.random(1, 100), _.random(1, 100), _.random(1, 100)
      ]
    }
  });

  res.send(ret);
});



router.post('/setHotSkus', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};

  Object.assign(ret, resultData, {
    data: ['123','321']
  });

  res.send(ret);
});


module.exports = router;