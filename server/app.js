'use strict';

const express = require('express');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const nj = require('nornj');
const njExpressEngine = require('nornj/tools/expressEngine');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
// const configs = require('../configs');
const app = express();

//启动webpack dev server

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

//设置Express模板引擎
app.engine('html', njExpressEngine({
  delimiters: {
    start: '{%',
    end: '%}',
    extension: '$',
    prop: '##'
  },
  defaultLayout: 'default',
  layoutsDir: 'layout/'
}));
app.set('views', __dirname + '/views');
app.set('view engine', 'html');

//设置跨域访问
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Credentials', true);
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", ' 3.2.1');
  res.header("Content-Type", "application/json;charset=utf-8");
  if (req.method == "OPTIONS") res.send(200);
  else next();
});


const businessDashboard = require('./routes/salesDiagnosis/businessDashboard');
app.use('/businessDashboard', businessDashboard);

const bdPlan = require('./routes/salesDiagnosis/bdPlan');
app.use('/bdPlan', bdPlan);

const businessEval = require('./routes/salesDiagnosis/businessEval');
app.use('/businessEval', businessEval);

const userSegmentation = require('./routes/userDemand/userSegmentation');
app.use('/userSegmentation', userSegmentation);

const userUpgrade = require('./routes/userDemand/userUpgrade');
app.use('/userUpgrade', userUpgrade);

const purchasePath = require('./routes/userDemand/purchasePath');
app.use('/purchasePath', purchasePath);

const stockMarketing = require('./routes/stockManagement/stockMarketing');
app.use('/stockMarketing', stockMarketing);

const stockWarning = require('./routes/stockManagement/stockWarning');
app.use('/stockWarning', stockWarning);

const geneMapping = require('./routes/selectStrategy/geneMapping');
app.use('/geneMapping', geneMapping);

const subdivisionMarket = require('./routes/selectStrategy/subdivisionMarket');
app.use('/subdivisionMarket', subdivisionMarket);

const priceAnalysis = require('./routes/priceStrategy/priceAnalysis');
app.use('/priceAnalysis', priceAnalysis);

const orderFillRateMonitor = require('./routes/stockManagement/orderFillRateMonitor');
app.use('/orderFillRateMonitor', orderFillRateMonitor);
const competitivePriceModel = require('./routes/priceStrategy/competitivePriceModel');
app.use('/competitivePriceModel', competitivePriceModel);

const outOfStockReason = require('./routes/outOfStockReason/outOfStockReason');
app.use('/outOfStockReason', outOfStockReason);

const marketCompetition = require('./routes/selectStrategy/marketCompetition');
app.use('/marketCompetition', marketCompetition);

const accountInfo = require('./routes/privilegeManagement/accountInfo');
app.use('/accountInfo', accountInfo);

const privilegeManagement = require('./routes/privilegeManagement/privilegeManagement');
app.use('/privilegeManagement', privilegeManagement);

const roleManagement = require('./routes/privilegeManagement/roleManagement');
app.use('/roleManagement', roleManagement);

const marketingSelection = require('./routes/selectStrategy/marketingSelection');
app.use('/marketingSelection', marketingSelection);

const { resultData } = require('./common/utils');

app.get('/', function(req, res) {
  res.redirect('/index');
});

app.get('/index', function(req, res) {
  res.type('html');
  res.render('index');
});

app.get('/checkUser', function(req, res) {
  res.type('html');
  res.sendFile('views/checkUser.html', { root: __dirname });
});

app.get('/common/getLoginInfo', function(req, res) {
  res.type('json');
  let ret = {};

  Object.assign(ret, resultData, {
    data: 'test_user'
  });

  res.send(ret);
});

app.get('/common/getCategoryData', function(req, res) {
  res.type('json');
  let ret = {};

  Object.assign(ret, resultData, {
    data: [{
      value: 123 + '',
      label: 'Zhejiang',
      children: [{
        value: 100 + '',
        label: 'Hangzhou',
        children: [{
          value: 101 + '',
          label: 'West Lake',
        }],
      }],
    }, {
      value: 412 + '',
      label: 'Jiangsu',
      children: [{
        value: 432 + '',
        label: 'Nanjing',
        children: [{
          value: 1243 + '',
          label: 'Zhong Hua Men',
        }],
      }],
    }]
  });

  res.send(ret);
});

app.get('/common/getCategoryHasLevel4Data', function(req, res) {
  res.type('json');
  let ret = {};

  //   const d = [{
  //       "children": [{
  //           "children": [{
  //             "label": "卫生巾",
  //             "value": "1408"
  //           }],
  //           "label": "女性护理",
  //           "value": "1385"
  //         },
  //         {
  //           "children": [{
  //               "label": "面膜",
  //               "value": "1392"
  //             },
  //             {
  //               "label": "剃须",
  //               "value": "1416"
  //             }
  //           ],
  //           "label": "面部护肤",
  //           "value": "1381"
  //         },
  //         {
  //           "children": [{
  //             "label": "牙膏/牙粉",
  //             "value": "1405"
  //           }],
  //           "label": "口腔护理",
  //           "value": "1384"
  //         },
  //         {
  //           "children": [{
  //             "label": "沐浴",
  //             "value": "1401"
  //           }],
  //           "label": "身体护理",
  //           "value": "1383"
  //         },
  //         {
  //           "children": [{
  //               "label": "套装",
  //               "value": "6739"
  //             },
  //             {
  //               "label": "护发",
  //               "value": "11923"
  //             }
  //           ],
  //           "label": "洗发护发",
  //           "value": "1386"
  //         },
  //         {
  //           "children": [{
  //               "label": "家庭清洁",
  //               "value": "1663"
  //             },
  //             {
  //               "label": "衣物清洁",
  //               "value": "1662"
  //             }
  //           ],
  //           "label": "清洁用品",
  //           "value": "1625"
  //         }
  //       ],
  //       "label": "美妆个护",
  //       "value": "1316"
  //     },
  //     {
  //       "children": [{
  //         "children": [{
  //           "label": "婴儿尿裤",
  //           "value": "7057"
  //         }],
  //         "label": "尿裤湿巾",
  //         "value": "1525"
  //       }],
  //       "label": "母婴",
  //       "value": "1317"
  //     },
  //     {
  //       "children": [{
  //         "children": [{
  //             "label": "XP定制高端品类3-1",
  //             "value": "888"
  //           },
  //           {
  //             "label": "XP定制高端品类3-2",
  //             "value": "999"
  //           }
  //         ],
  //         "label": "XP定制高端品类2",
  //         "value": "777"
  //       }],
  //       "label": "XP定制高端品类1",
  //       "value": "666"
  //     }
  //   ];

  let d;
  if (_.random(1, 100) > 50) {
    d = [{ "children": [{ "children": [{ "children": [{ "label": "卸妆油", "value": "1316_1381_13544_卸妆油" }, { "label": "卸妆啫喱", "value": "1316_1381_13544_卸妆啫喱" }, { "label": "其他", "value": "1316_1381_13544_其他" }, { "label": "卸妆湿巾", "value": "1316_1381_13544_卸妆湿巾" }, { "label": "卸妆水/卸妆液", "value": "1316_1381_13544_卸妆水/卸妆液" }, { "label": "卸妆乳", "value": "1316_1381_13544_卸妆乳" }], "label": "卸妆", "value": "13544" }, { "label": "精华", "value": "13546" }, { "children": [{ "label": "精华", "value": "1316_1381_13547_精华" }, { "label": "乳/霜", "value": "1316_1381_13547_乳/霜" }, { "label": "眼胶", "value": "1316_1381_13547_眼胶" }], "label": "眼霜", "value": "13547" }, { "children": [{ "label": "防晒喷雾", "value": "1316_1381_13548_防晒喷雾" }, { "label": "其他", "value": "1316_1381_13548_其他" }, { "label": "防晒霜/乳", "value": "1316_1381_13548_防晒霜/乳" }, { "label": "防晒啫喱/露", "value": "1316_1381_13548_防晒啫喱/露" }], "label": "防晒", "value": "13548" }, { "label": "洁面", "value": "1389" }, { "label": "爽肤水", "value": "1390" }, { "label": "乳液面霜", "value": "1391" }, { "label": "面膜", "value": "1392" }, { "label": "套装", "value": "1396" }, { "children": [{ "label": "女士除毛刀", "value": "1316_1381_1416_女士除毛刀" }, { "label": "剃须泡沫", "value": "1316_1381_1416_剃须泡沫" }, { "label": "替换刀头/刀片", "value": "1316_1381_1416_替换刀头/刀片" }, { "label": "剃须膏/啫喱", "value": "1316_1381_1416_剃须膏/啫喱" }, { "label": "男士剃须刀", "value": "1316_1381_1416_男士剃须刀" }], "label": "剃须", "value": "1416" }], "label": "面部护肤", "value": "1381" }, { "children": [{ "label": "沐浴", "value": "1401" }, { "label": "手足", "value": "2562" }], "label": "身体护理", "value": "1383" }, { "children": [{ "label": "牙膏/牙粉", "value": "1405" }, { "label": "牙刷/牙线", "value": "1406" }, { "children": [{ "label": "漱口水", "value": "1316_1384_1407_漱口水" }], "label": "漱口水", "value": "1407" }], "label": "口腔护理", "value": "1384" }, { "children": [{ "label": "卫生巾", "value": "1408" }, { "label": "卫生护垫", "value": "1409" }], "label": "女性护理", "value": "1385" }, { "children": [{ "label": "洗发", "value": "11922" }, { "children": [{ "label": "精华乳/油", "value": "1316_1386_11923_精华乳/油" }, { "label": "发膜", "value": "1316_1386_11923_发膜" }, { "label": "营养水", "value": "1316_1386_11923_营养水" }, { "label": "护发素/乳", "value": "1316_1386_11923_护发素/乳" }, { "label": "其他", "value": "1316_1386_11923_其他" }], "label": "护发", "value": "11923" }, { "label": "造型", "value": "11925" }, { "children": [{ "label": "洗护套装", "value": "1316_1386_6739_洗护套装" }], "label": "套装", "value": "6739" }], "label": "洗发护发", "value": "1386" }, { "children": [{ "children": [{ "label": "除菌（霉）剂", "value": "1316_1625_1662_除菌（霉）剂" }, { "label": "洗衣液", "value": "1316_1625_1662_洗衣液" }, { "label": "衣物护理剂", "value": "1316_1625_1662_衣物护理剂" }, { "label": "消毒剂", "value": "1316_1625_1662_消毒剂" }, { "label": "洗衣皂", "value": "1316_1625_1662_洗衣皂" }, { "label": "衣领净", "value": "1316_1625_1662_衣领净" }, { "label": "洗衣凝珠", "value": "1316_1625_1662_洗衣凝珠" }, { "label": "漂渍剂", "value": "1316_1625_1662_漂渍剂" }, { "label": "洗衣粉", "value": "1316_1625_1662_洗衣粉" }], "label": "衣物清洁", "value": "1662" }, { "label": "家庭清洁", "value": "1663" }], "label": "清洁用品", "value": "1625" }], "label": "美妆个护", "value": "1316" }, { "children": [{ "children": [{ "label": "拉拉裤", "value": "1546" }, { "label": "婴儿湿巾", "value": "1548" }, { "label": "婴儿尿裤", "value": "7057" }], "label": "尿裤湿巾", "value": "1525" }], "label": "母婴", "value": "1319" }];
  } else {
    d = [{ "children": [{ "children": [{ "label": "卸妆", "value": "13544" }, { "label": "精华", "value": "13546" }, { "label": "眼霜", "value": "13547" }, { "label": "防晒", "value": "13548" }, { "label": "洁面", "value": "1389" }, { "label": "爽肤水", "value": "1390" }, { "label": "乳液面霜", "value": "1391" }, { "label": "面膜", "value": "1392" }, { "label": "套装", "value": "1396" }, { "label": "剃须", "value": "1416" }], "label": "面部护肤", "value": "1381" }, { "children": [{ "label": "沐浴", "value": "1401" }, { "label": "手足", "value": "2562" }], "label": "身体护理", "value": "1383" }, { "children": [{ "label": "牙膏/牙粉", "value": "1405" }, { "label": "牙刷/牙线", "value": "1406" }, { "label": "漱口水", "value": "1407" }], "label": "口腔护理", "value": "1384" }, { "children": [{ "label": "卫生巾", "value": "1408" }, { "label": "卫生护垫", "value": "1409" }], "label": "女性护理", "value": "1385" }, { "children": [{ "label": "洗发", "value": "11922" }, { "label": "护发", "value": "11923" }, { "label": "造型", "value": "11925" }, { "label": "套装", "value": "6739" }], "label": "洗发护发", "value": "1386" }, { "children": [{ "label": "衣物清洁", "value": "1662" }, { "label": "家庭清洁", "value": "1663" }], "label": "清洁用品", "value": "1625" }], "label": "美妆个护", "value": "1316" }, { "children": [{ "children": [{ "label": "拉拉裤", "value": "1546" }, { "label": "婴儿湿巾", "value": "1548" }, { "label": "婴儿尿裤", "value": "7057" }], "label": "尿裤湿巾", "value": "1525" }], "label": "母婴", "value": "1319" }];
  }

  Object.assign(ret, resultData, {
    // data: [{
    //   value: 123 + '',
    //   label: 'Zhejiang',
    //   children: [{
    //     value: 100 + '',
    //     label: 'Hangzhou',
    //     children: [{
    //       value: 101 + '',
    //       label: 'West Lake',
    //       children: [{
    //         value: 102 + '',
    //         label: 'Small boat',
    //       }]
    //     }],
    //   }],
    // }, {
    //   value: 412 + '',
    //   label: 'Jiangsu',
    //   children: [{
    //     value: 432 + '',
    //     label: 'Nanjing',
    //     children: [{
    //       value: 1243 + '',
    //       label: 'Zhong Hua Men',
    //     }],
    //   }],
    // }]
    data: d
  });

  res.send(ret);
});

app.get('/common/getPropData', function(req, res) {
  res.type('json');
  let ret = {};

  Object.assign(ret, resultData, {
    data: [{
      value: '123_456',
      label: '属性1—口味'
    }, {
      value: '1234_4568',
      label: '属性2—口味'
    }]
  });

  res.send(ret);
});

/*
  已废弃
*/
app.get('/common/getCategoryLevel4Data', function(req, res) {
  res.type('json');
  let ret = {};

  Object.assign(ret, resultData, {
    data: [{
      value: 123 + '',
      label: 'Zhejiang'
    }, {
      value: 412 + '',
      label: 'Jiangsu'
    }]
  });

  res.send(ret);
});

app.get('/common/getBrandData', function(req, res) {
  res.type('json');
  let ret = {};

  Object.assign(ret, resultData, {
    data: [{
      value: 123 + '',
      label: 'Zhejiang'
    }, {
      value: 412 + '',
      label: 'Jiangsu'
    }]
  });

  res.send(ret);
});

app.get('/common/getDeptData', function(req, res) {
  res.type('json');
  let ret = {};

  Object.assign(ret, resultData, {
    data: [{
      value: 123 + '',
      label: 'Zhejiang'
    }, {
      value: 412 + '',
      label: '消费品'
    }]
  });

  res.send(ret);
});

app.get('/common/getCategory2Data', function(req, res) {
  res.type('json');
  let ret = {};

  Object.assign(ret, resultData, {
    data: _.times(5, i => {
      return {
        value: (i + 1) + '',
        label: `品类${i + 1}`
      };
    })
  });

  res.send(ret);
});

app.get('/common/getVendorData', function(req, res) {
  res.type('json');
  let ret = {};

  Object.assign(ret, resultData, {
    data: _.times(5, i => {
      return {
        value: (i + 1) + '',
        label: `供应商${i + 1}`
      };
    })
  });

  res.send(ret);
});

/**
 * 库存管理
 */
app.get('/common/getStockDeptData', function(req, res) {
  res.type('json');
  let ret = {};

  Object.assign(ret, resultData, {
    data: [{
      value: 123 + '',
      label: 'Zhejiang1'
    }, {
      value: 33 + '',
      label: '消费品事业部'
    }]
  });

  res.send(ret);
});

app.get('/common/getStockCategoryData', function(req, res) {
  res.type('json');
  let ret = {};

  Object.assign(ret, resultData, {
    data: [{
      value: 123 + '',
      label: 'Zhejiang11',
      children: [{
        value: 100 + '',
        label: 'Hangzhou',
        children: [{
          value: 101 + '',
          label: 'West Lake',
        }],
      }],
    }, {
      value: 412 + '',
      label: 'Jiangsu',
      children: [{
        value: 432 + '',
        label: 'Nanjing',
        children: [{
          value: 1243 + '',
          label: 'Zhong Hua Men',
        }],
      }],
    }]
  });

  res.send(ret);
});

app.get('/common/getStockBrandData', function(req, res) {
  res.type('json');
  let ret = {};

  Object.assign(ret, resultData, {
    data: [{
      value: 123 + '',
      label: 'Zhejiang'
    }, {
      value: 412 + '',
      label: 'Jiangsu'
    }]
  });

  res.send(ret);
});



let server = app.listen(8088, function() {
  let host = server.address().address;
  let port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
