'use strict';

const express = require('express');
const _ = require('lodash');
const router = express.Router();
const {resultData} = require('../../common/utils');

router.post('/deleteAccount', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};

  console.log('accountId', params.accountId);
  Object.assign(ret, resultData);

  res.send(ret);
});

router.get('/getPersonalInfoData', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};
  Object.assign(ret, resultData, {
    data: {
      brandCode: 'pg',
      role: '主账号',
      brandName: '宝洁',
      contactEmail: 'zhitest@jd.com'
    }
  });
  res.send(ret);
});

router.get('/getAssociatedCategoryData', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};
  Object.assign(ret, resultData, {
    data: [
      {
        key: '112123',
        treeName: '养护个护',
        oneBrand: '养护个护',
        children: [
          {
            key: '112123_13242341',
            treeName: '洗发护发',
            twoBrand: '洗发护发',
            children: [
              {
                key: '112123_13242341_12342411',
                treeName: '洗发',
                threeBrand: '洗发',
                children: [
                  {
                    key: '112123_13242341_12342411_1111',
                    treeName: '海飞丝',
                    brand: '海飞丝'
                  }, {
                    key: '112123_13242341_12342411_1112',
                    treeName: '沙宣',
                    brand: '沙宣'
                  }, {
                    key: '112123_13242341_12342411_1113',
                    treeName: '沙宣',
                    brand: '沙宣'
                  }, {
                    key: '112123_13242341_12342411_1114',
                    treeName: '沙宣',
                    brand: '沙宣'
                  }, {
                    key: '112123_13242341_12342411_1115',
                    treeName: '沙宣',
                    brand: '沙宣'
                  }, {
                    key: '112123_13242341_12342411_1116',
                    treeName: '沙宣',
                    brand: '沙宣'
                  }, {
                    key: '112123_13242341_12342411_1117',
                    treeName: '沙宣',
                    brand: '沙宣'
                  }, {
                    key: '112123_13242341_12342411_1118',
                    treeName: '沙宣',
                    brand: '沙宣'
                  }, {
                    key: '112123_13242341_12342411_1119',
                    treeName: '沙宣',
                    brand: '沙宣'
                  }, {
                    key: '112123_13242341_12342411_1110',
                    treeName: '沙宣10',
                    brand: '沙宣10'
                  }
                ]
              }, {
                key: '112123_13242341_112',
                treeName: '护发',
                threeBrand: '护发',
                brand: '飘柔'
              }, {
                key: '112123_13242341_113',
                treeName: '染发',
                threeBrand: '染发',
                brand: '飘柔'
              }
            ]
          }, {
            key: '112123_12',
            treeName: '口腔护理',
            twoBrand: '口腔护理',
            children: [
              {
                key: '112123_12_121',
                treeName: '漱口水',
                threeBrand: '口腔护理',
                brand: '佳洁士'
              }, {
                key: '112123_12_122',
                treeName: '漱口水',
                threeBrand: '口腔护理',
                brand: '漱口水'
              }
            ]
          }
        ]
      }, {
        key: '2',
        treeName: '我的宠物',
        oneBrand: '我的宠物',
        children: [
          {
            key: '2_21',
            treeName: '水族世界',
            twoBrand: '水族世界',
            children: [
              {
                key: '2_21_211',
                treeName: '闽江鱼缸',
                brand: '闽江鱼缸'
              }, {
                key: '2_21_212',
                treeName: '鱼之宝',
                brand: '鱼之宝'
              }
            ]
          }, {
            key: '2_22',
            treeName: '猫粮狗粮',
            twoBrand: '猫粮狗粮',
            children: [
              {
                key: '2_22_221',
                treeName: '皇家',
                brand: '皇家'
              }, {
                key: '2_22_222',
                treeName: '宝路',
                brand: '宝路'
              }
            ]
          }
        ]
      }
    ]
  });
  res.send(ret);
});

router.get('/getAssociatedAccountData', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};
  Object.assign(ret, resultData, {
    data: [
      {
        key: 1,
        userId: 1212313,
        loginName: '大王花',
        name: '糊涂图',
        email: 'tesste@jd.com',
        department: '技术部',
        duty: '工程师',
        role: '开发区',
        openTime: '2017-8-15',
        modifyTime: '2017-8-15'
      }, {
        key: 2,
        userId: 3434522,
        loginName: '大王花2',
        name: '糊涂图',
        email: 'tesste@jd.com',
        department: '技术部',
        duty: '工程师',
        role: '开发区',
        openTime: '2017-8-15',
        modifyTime: '2017-8-15'
      }
    ]
  });
  res.send(ret);
});

router.get('/getRoleMenuTree', function(req, res) {
  res.type('json');
  let params = req.query,
    ret = {};

  ret = {
    "data": [
      {
        "sysVersion": 0,
        "level": 1,
        "isDelete": 1,
        "updateUser": "yangdongjun3",
        "displayStatus": 1,
        "pid": 0,
        "updateTime": 1503374005000,
        "sort": 0,
        "isLeaf": 0,
        "url": "智慧供应链",
        "createTime": 1503374005000,
        "appId": "76",
        "name": "智慧供应链",
        "createUser": "yangdongjun3",
        "id": 44,
        "selected": true
      }, {
        "sysVersion": 0,
        "level": 2,
        "isDelete": 1,
        "updateUser": "yangdongjun3",
        "displayStatus": 1,
        "pid": 44,
        "updateTime": 1503374121000,
        "sort": 1,
        "isLeaf": 1,
        "createTime": 1503374121000,
        "appId": "76",
        "name": "销售诊断",
        "createUser": "yangdongjun3",
        "id": 45,
        "selected": false
      }, {
        "sysVersion": 0,
        "level": 3,
        "isDelete": 1,
        "updateUser": "yangdongjun3",
        "displayStatus": 1,
        "pid": 45,
        "updateTime": 1503374212000,
        "sort": 2,
        "isLeaf": 1,
        "url": "/BusinessDashboard",
        "createTime": 1503374212000,
        "appId": "76",
        "name": "生意大盘",
        "createUser": "yangdongjun3",
        "id": 46,
        "selected": true
      }, {
        "sysVersion": 0,
        "level": 3,
        "isDelete": 1,
        "updateUser": "yangdongjun3",
        "displayStatus": 1,
        "pid": 45,
        "updateTime": 1503374225000,
        "sort": 3,
        "isLeaf": 1,
        "url": "/BusinessEval",
        "createTime": 1503374225000,
        "appId": "76",
        "name": "生意评估",
        "createUser": "yangdongjun3",
        "id": 47,
        "selected": true
      }, {
        "sysVersion": 0,
        "level": 2,
        "isDelete": 1,
        "updateUser": "yangdongjun3",
        "displayStatus": 1,
        "pid": 44,
        "updateTime": 1503374241000,
        "sort": 4,
        "isLeaf": 1,
        "createTime": 1503374241000,
        "appId": "76",
        "name": "用户需求",
        "createUser": "yangdongjun3",
        "id": 48,
        "selected": false
      }, {
        "sysVersion": 0,
        "level": 3,
        "isDelete": 1,
        "updateUser": "yangdongjun3",
        "displayStatus": 1,
        "pid": 48,
        "updateTime": 1503380450000,
        "sort": 5,
        "isLeaf": 1,
        "url": "/UserUpgrade",
        "createTime": 1503380450000,
        "appId": "76",
        "name": "用户升级",
        "createUser": "yangdongjun3",
        "id": 56,
        "selected": true
      }, {
        "sysVersion": 0,
        "level": 3,
        "isDelete": 1,
        "updateUser": "yangdongjun3",
        "displayStatus": 1,
        "pid": 48,
        "updateTime": 1503380466000,
        "sort": 6,
        "isLeaf": 1,
        "url": "/UserSegmentation",
        "createTime": 1503380466000,
        "appId": "76",
        "name": "用户细分",
        "createUser": "yangdongjun3",
        "id": 57,
        "selected": true
      }, {
        "sysVersion": 0,
        "level": 2,
        "isDelete": 1,
        "updateUser": "yangdongjun3",
        "displayStatus": 1,
        "pid": 44,
        "updateTime": 1503374258000,
        "sort": 6,
        "isLeaf": 1,
        "createTime": 1503374258000,
        "appId": "76",
        "name": "购物路径",
        "createUser": "yangdongjun3",
        "id": 49,
        "selected": false
      }, {
        "sysVersion": 0,
        "level": 3,
        "isDelete": 1,
        "updateUser": "yangdongjun3",
        "displayStatus": 1,
        "pid": 49,
        "updateTime": 1503380489000,
        "sort": 7,
        "isLeaf": 1,
        "url": "/PurchasePath",
        "createTime": 1503380489000,
        "appId": "76",
        "name": "购物路径",
        "createUser": "yangdongjun3",
        "id": 58,
        "selected": false
      }, {
        "sysVersion": 0,
        "level": 2,
        "isDelete": 1,
        "updateUser": "yangdongjun3",
        "displayStatus": 1,
        "pid": 44,
        "updateTime": 1503374268000,
        "sort": 8,
        "isLeaf": 1,
        "createTime": 1503374268000,
        "appId": "76",
        "name": "选品策略",
        "createUser": "yangdongjun3",
        "id": 50,
        "selected": false
      }, {
        "sysVersion": 0,
        "level": 3,
        "isDelete": 1,
        "updateUser": "yangdongjun3",
        "displayStatus": 1,
        "pid": 50,
        "updateTime": 1503380506000,
        "sort": 9,
        "isLeaf": 1,
        "url": "/MarketCompetition",
        "createTime": 1503380506000,
        "appId": "76",
        "name": "市场竞争",
        "createUser": "yangdongjun3",
        "id": 59,
        "selected": false
      }, {
        "sysVersion": 0,
        "level": 3,
        "isDelete": 1,
        "updateUser": "yangdongjun3",
        "displayStatus": 1,
        "pid": 50,
        "updateTime": 1503380519000,
        "sort": 10,
        "isLeaf": 1,
        "url": "/GeneMapping",
        "createTime": 1503380519000,
        "appId": "76",
        "name": "基因图谱",
        "createUser": "yangdongjun3",
        "id": 60,
        "selected": false
      }, {
        "sysVersion": 0,
        "level": 3,
        "isDelete": 1,
        "updateUser": "yangdongjun3",
        "displayStatus": 1,
        "pid": 50,
        "updateTime": 1503380541000,
        "sort": 11,
        "isLeaf": 1,
        "url": "/SubdivisionMarket",
        "createTime": 1503380541000,
        "appId": "76",
        "name": "细分市场",
        "createUser": "yangdongjun3",
        "id": 61,
        "selected": false
      }, {
        "sysVersion": 0,
        "level": 3,
        "isDelete": 1,
        "updateUser": "yangdongjun3",
        "displayStatus": 1,
        "pid": 50,
        "updateTime": 1503380557000,
        "sort": 12,
        "isLeaf": 1,
        "url": "/MarketingSelection",
        "createTime": 1503380557000,
        "appId": "76",
        "name": "运营选品",
        "createUser": "yangdongjun3",
        "id": 62,
        "selected": false
      }, {
        "sysVersion": 0,
        "level": 2,
        "isDelete": 1,
        "updateUser": "yangdongjun3",
        "displayStatus": 1,
        "pid": 44,
        "updateTime": 1503374277000,
        "sort": 13,
        "isLeaf": 1,
        "createTime": 1503374277000,
        "appId": "76",
        "name": "价格策略",
        "createUser": "yangdongjun3",
        "id": 51,
        "selected": false
      }, {
        "sysVersion": 0,
        "level": 3,
        "isDelete": 1,
        "updateUser": "yangdongjun3",
        "displayStatus": 1,
        "pid": 51,
        "updateTime": 1503380576000,
        "sort": 14,
        "isLeaf": 1,
        "url": "/PriceAnalysis",
        "createTime": 1503380576000,
        "appId": "76",
        "name": "价格弹性分析",
        "createUser": "yangdongjun3",
        "id": 63,
        "selected": false
      }, {
        "sysVersion": 0,
        "level": 3,
        "isDelete": 1,
        "updateUser": "yangdongjun3",
        "displayStatus": 1,
        "pid": 51,
        "updateTime": 1503380588000,
        "sort": 15,
        "isLeaf": 1,
        "url": "/CompetitivePriceModel",
        "createTime": 1503380588000,
        "appId": "76",
        "name": "竞品量价模型",
        "createUser": "yangdongjun3",
        "id": 64,
        "selected": false
      }, {
        "sysVersion": 0,
        "level": 2,
        "isDelete": 1,
        "updateUser": "yangdongjun3",
        "displayStatus": 1,
        "pid": 44,
        "updateTime": 1503374285000,
        "sort": 16,
        "isLeaf": 1,
        "createTime": 1503374285000,
        "appId": "76",
        "name": "库存管理",
        "createUser": "yangdongjun3",
        "id": 52,
        "selected": false
      }, {
        "sysVersion": 0,
        "level": 3,
        "isDelete": 1,
        "updateUser": "yangdongjun3",
        "displayStatus": 1,
        "pid": 52,
        "updateTime": 1503380602000,
        "sort": 17,
        "isLeaf": 1,
        "url": "/StockMarketing",
        "createTime": 1503380602000,
        "appId": "76",
        "name": "库存健康运营",
        "createUser": "yangdongjun3",
        "id": 65,
        "selected": false
      }, {
        "sysVersion": 0,
        "level": 3,
        "isDelete": 1,
        "updateUser": "yangdongjun3",
        "displayStatus": 1,
        "pid": 52,
        "updateTime": 1503380617000,
        "sort": 18,
        "isLeaf": 1,
        "url": "/StockWarning",
        "createTime": 1503380617000,
        "appId": "76",
        "name": "库存健康预警",
        "createUser": "yangdongjun3",
        "id": 66,
        "selected": false
      }, {
        "sysVersion": 0,
        "level": 3,
        "isDelete": 1,
        "updateUser": "yangdongjun3",
        "displayStatus": 1,
        "pid": 52,
        "updateTime": 1503380636000,
        "sort": 19,
        "isLeaf": 1,
        "url": "/OrderFillRateMonitor",
        "createTime": 1503380636000,
        "appId": "76",
        "name": "订单满足检测",
        "createUser": "yangdongjun3",
        "id": 67,
        "selected": false
      }, {
        "sysVersion": 0,
        "level": 3,
        "isDelete": 1,
        "updateUser": "yangdongjun3",
        "displayStatus": 1,
        "pid": 52,
        "updateTime": 1503380652000,
        "sort": 20,
        "isLeaf": 1,
        "url": "/OutOfStockReason",
        "createTime": 1503380652000,
        "appId": "76",
        "name": "缺货原因录入",
        "createUser": "yangdongjun3",
        "id": 68,
        "selected": false
      }, {
        "sysVersion": 0,
        "level": 2,
        "isDelete": 1,
        "updateUser": "yangdongjun3",
        "displayStatus": 1,
        "pid": 44,
        "updateTime": 1503374293000,
        "sort": 21,
        "isLeaf": 1,
        "createTime": 1503374293000,
        "appId": "76",
        "name": "账号管理",
        "createUser": "yangdongjun3",
        "id": 53,
        "selected": false
      }, {
        "sysVersion": 0,
        "level": 3,
        "isDelete": 1,
        "updateUser": "yangdongjun3",
        "displayStatus": 1,
        "pid": 53,
        "updateTime": 1503380668000,
        "sort": 22,
        "isLeaf": 1,
        "url": "/AccountInfo",
        "createTime": 1503380668000,
        "appId": "76",
        "name": "账户信息",
        "createUser": "yangdongjun3",
        "id": 69,
        "selected": false
      }, {
        "sysVersion": 0,
        "level": 3,
        "isDelete": 1,
        "updateUser": "yangdongjun3",
        "displayStatus": 1,
        "pid": 53,
        "updateTime": 1503380682000,
        "sort": 23,
        "isLeaf": 1,
        "url": "/PrivilegeManagement",
        "createTime": 1503380682000,
        "appId": "76",
        "name": "权限管理",
        "createUser": "yangdongjun3",
        "id": 70,
        "selected": false
      }, {
        "sysVersion": 0,
        "level": 3,
        "isDelete": 1,
        "updateUser": "yangdongjun3",
        "displayStatus": 1,
        "pid": 53,
        "updateTime": 1503380694000,
        "sort": 24,
        "isLeaf": 1,
        "url": "/RoleManagement",
        "createTime": 1503380694000,
        "appId": "76",
        "name": "角色管理",
        "createUser": "yangdongjun3",
        "id": 71,
        "selected": false
      }
    ],
    "success": true
  };

  res.send(ret);
});

module.exports = router;
