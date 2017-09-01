'use strict';

const express = require('express');
const _ = require('lodash');
const router = express.Router();
const { resultData } = require('../../common/utils');
const moment = require('moment');

router.post('/saveUser', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};

  console.log('loginName', params.loginName);
  console.log('userId', params.userId);
  console.log('userName', params.userName);
  console.log('email', params.email);
  console.log('deptName', params.deptName);
  console.log('post', params.post);

  Object.assign(ret, resultData);

  res.send(ret);
});

router.post('/deleteUser', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};

  console.log('userId', params.userId);
  Object.assign(ret, resultData);

  res.send(ret);
});

router.post('/getUserData', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};

  Object.assign(ret, resultData, {
    data: _.times(5, i => {
      return {
        userId: (i + 1),
        loginName: (i + 1) + '',
        userName: '用户' + (i + 1),
        email: (i + 1) + '@jd.com',
        deptName: '部门' + (i + 1),
        post: '职务' + (i + 1)
      };
    })
  });

  res.send(ret);
});

router.post('/getRoleData', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};

  Object.assign(ret, resultData, {
    data: _.times(5, i => {
      return {
        roleId: (i + 1),
        roleName: '角色' + (i + 1),
        description: i != 1 ? 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum ' + (i + 1) : null
      };
    })
  });

  res.send(ret);
});

router.post('/addUserRole', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};

  console.log('userId', params.userId);
  console.log('roleId', params.roleId);

  Object.assign(ret, resultData);

  res.send(ret);
});

router.post('/getUserRoleData', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};

  console.log('userId', params.userId);

  Object.assign(ret, resultData, {
    data: _.times(5, i => {
      return {
        roleId: (i + 1),
        roleName: '角色' + (i + _.random(1, 10))
      };
    })
  });

  res.send(ret);
});

router.post('/delUserRole', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};

  console.log('userId', params.userId);
  console.log('roleId', params.roleId);
  Object.assign(ret, resultData);

  res.send(ret);
});

router.post('/addUserBrand', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};

  console.log('userId', params.userId);
  console.log('categoryId1', params.categoryId1);
  console.log('categoryId2', params.categoryId2);
  console.log('categoryId3', params.categoryId3);
  console.log('brandId', params.brandId);

  Object.assign(ret, resultData);

  res.send(ret);
});

router.post('/deleteUserBrand', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};

  console.log('userId', params.userId);
  console.log('categoryId1', params.categoryId1);
  console.log('categoryId2', params.categoryId2);
  console.log('categoryId3', params.categoryId3);
  console.log('brandId', params.brandId);

  Object.assign(ret, resultData);

  res.send(ret);
});

router.get('/getUserMenuTree', function(req, res) {
  res.type('json');
  let params = req.query,
    ret = {};

  console.log('userId', params.userId);

//   Object.assign(ret, resultData, {
//     data: _.times(2, i => {
//       return {
//         value: (i + 1),
//         label: '一级菜单' + (i + 1),
//         children: _.times(2, j => {
//           return {
//             value: (j + 1),
//             label: '二级菜单' + (j + 1),
//             children: _.times(2, k => {
//               return {
//                 value: (k + 1),
//                 label: '三级菜单' + (k + 1),
//                 checked: true,
//                 isLeaf: true
//               };
//             })
//           };
//         })
//       };
//     })
//   });

  ret = {"data":[{"appId":"76","createTime":1503374005000,"createUser":"yangdongjun3","displayStatus":1,"id":44,"isDelete":1,"isLeaf":0,"level":1,"name":"智慧供应链","pid":0,"sort":0,"sysVersion":0,"updateTime":1503374005000,"updateUser":"yangdongjun3","url":"智慧供应链"},{"appId":"76","createTime":1503374121000,"createUser":"yangdongjun3","displayStatus":1,"id":45,"isDelete":1,"isLeaf":1,"level":2,"name":"销售诊断","pid":44,"sort":1,"sysVersion":0,"updateTime":1503374121000,"updateUser":"yangdongjun3"},{"appId":"76","createTime":1503374212000,"createUser":"yangdongjun3","displayStatus":1,"id":46,"isDelete":1,"isLeaf":1,"level":3,"name":"生意大盘","pid":45,"sort":2,"sysVersion":0,"updateTime":1503374212000,"updateUser":"yangdongjun3","url":"/BusinessDashboard"},{"appId":"76","createTime":1503374225000,"createUser":"yangdongjun3","displayStatus":1,"id":47,"isDelete":1,"isLeaf":1,"level":3,"name":"生意评估","pid":45,"sort":3,"sysVersion":0,"updateTime":1503374225000,"updateUser":"yangdongjun3","url":"/BusinessEval"},{"appId":"76","createTime":1503374241000,"createUser":"yangdongjun3","displayStatus":1,"id":48,"isDelete":1,"isLeaf":1,"level":2,"name":"用户需求","pid":44,"sort":4,"sysVersion":0,"updateTime":1503374241000,"updateUser":"yangdongjun3"},{"appId":"76","createTime":1503380450000,"createUser":"yangdongjun3","displayStatus":1,"id":56,"isDelete":1,"isLeaf":1,"level":3,"name":"用户升级","pid":48,"sort":5,"sysVersion":0,"updateTime":1503380450000,"updateUser":"yangdongjun3","url":"/UserUpgrade"},{"appId":"76","createTime":1503380466000,"createUser":"yangdongjun3","displayStatus":1,"id":57,"isDelete":1,"isLeaf":1,"level":3,"name":"用户细分","pid":48,"sort":6,"sysVersion":0,"updateTime":1503380466000,"updateUser":"yangdongjun3","url":"/UserSegmentation"},{"appId":"76","createTime":1503374258000,"createUser":"yangdongjun3","displayStatus":1,"id":49,"isDelete":1,"isLeaf":1,"level":2,"name":"购物路径","pid":44,"sort":6,"sysVersion":0,"updateTime":1503374258000,"updateUser":"yangdongjun3"},{"appId":"76","createTime":1503380489000,"createUser":"yangdongjun3","displayStatus":1,"id":58,"isDelete":1,"isLeaf":1,"level":3,"name":"购物路径","pid":49,"sort":7,"sysVersion":0,"updateTime":1503380489000,"updateUser":"yangdongjun3","url":"/PurchasePath"},{"appId":"76","createTime":1503374268000,"createUser":"yangdongjun3","displayStatus":1,"id":50,"isDelete":1,"isLeaf":1,"level":2,"name":"选品策略","pid":44,"sort":8,"sysVersion":0,"updateTime":1503374268000,"updateUser":"yangdongjun3"},{"appId":"76","createTime":1503380506000,"createUser":"yangdongjun3","displayStatus":1,"id":59,"isDelete":1,"isLeaf":1,"level":3,"name":"市场竞争","pid":50,"sort":9,"sysVersion":0,"updateTime":1503380506000,"updateUser":"yangdongjun3","url":"/MarketCompetition"},{"appId":"76","createTime":1503380519000,"createUser":"yangdongjun3","displayStatus":1,"id":60,"isDelete":1,"isLeaf":1,"level":3,"name":"基因图谱","pid":50,"sort":10,"sysVersion":0,"updateTime":1503380519000,"updateUser":"yangdongjun3","url":"/GeneMapping"},{"appId":"76","createTime":1503380541000,"createUser":"yangdongjun3","displayStatus":1,"id":61,"isDelete":1,"isLeaf":1,"level":3,"name":"细分市场","pid":50,"sort":11,"sysVersion":0,"updateTime":1503380541000,"updateUser":"yangdongjun3","url":"/SubdivisionMarket"},{"appId":"76","createTime":1503380557000,"createUser":"yangdongjun3","displayStatus":1,"id":62,"isDelete":1,"isLeaf":1,"level":3,"name":"运营选品","pid":50,"sort":12,"sysVersion":0,"updateTime":1503380557000,"updateUser":"yangdongjun3","url":"/MarketingSelection"},{"appId":"76","createTime":1503374277000,"createUser":"yangdongjun3","displayStatus":1,"id":51,"isDelete":1,"isLeaf":1,"level":2,"name":"价格策略","pid":44,"sort":13,"sysVersion":0,"updateTime":1503374277000,"updateUser":"yangdongjun3"},{"appId":"76","createTime":1503380576000,"createUser":"yangdongjun3","displayStatus":1,"id":63,"isDelete":1,"isLeaf":1,"level":3,"name":"价格弹性分析","pid":51,"sort":14,"sysVersion":0,"updateTime":1503380576000,"updateUser":"yangdongjun3","url":"/PriceAnalysis"},{"appId":"76","createTime":1503380588000,"createUser":"yangdongjun3","displayStatus":1,"id":64,"isDelete":1,"isLeaf":1,"level":3,"name":"竞品量价模型","pid":51,"sort":15,"sysVersion":0,"updateTime":1503380588000,"updateUser":"yangdongjun3","url":"/CompetitivePriceModel"},{"appId":"76","createTime":1503374285000,"createUser":"yangdongjun3","displayStatus":1,"id":52,"isDelete":1,"isLeaf":1,"level":2,"name":"库存管理","pid":44,"sort":16,"sysVersion":0,"updateTime":1503374285000,"updateUser":"yangdongjun3"},{"appId":"76","createTime":1503380602000,"createUser":"yangdongjun3","displayStatus":1,"id":65,"isDelete":1,"isLeaf":1,"level":3,"name":"库存健康运营","pid":52,"sort":17,"sysVersion":0,"updateTime":1503380602000,"updateUser":"yangdongjun3","url":"/StockMarketing"},{"appId":"76","createTime":1503380617000,"createUser":"yangdongjun3","displayStatus":1,"id":66,"isDelete":1,"isLeaf":1,"level":3,"name":"库存健康预警","pid":52,"sort":18,"sysVersion":0,"updateTime":1503380617000,"updateUser":"yangdongjun3","url":"/StockWarning"},{"appId":"76","createTime":1503380636000,"createUser":"yangdongjun3","displayStatus":1,"id":67,"isDelete":1,"isLeaf":1,"level":3,"name":"订单满足检测","pid":52,"sort":19,"sysVersion":0,"updateTime":1503380636000,"updateUser":"yangdongjun3","url":"/OrderFillRateMonitor"},{"appId":"76","createTime":1503380652000,"createUser":"yangdongjun3","displayStatus":1,"id":68,"isDelete":1,"isLeaf":1,"level":3,"name":"缺货原因录入","pid":52,"sort":20,"sysVersion":0,"updateTime":1503380652000,"updateUser":"yangdongjun3","url":"/OutOfStockReason"},{"appId":"76","createTime":1503374005000,"createUser":"yangdongjun3","displayStatus":1,"id":200,"isDelete":1,"isLeaf":0,"level":1,"name":"账号管理","pid":0,"sort":0,"sysVersion":0,"updateTime":1503374005000,"updateUser":"yangdongjun3","url":"账号管理"},{"appId":"76","createTime":1503374293000,"createUser":"yangdongjun3","displayStatus":1,"id":53,"isDelete":1,"isLeaf":1,"level":2,"name":"账号管理","pid":200,"sort":21,"sysVersion":0,"updateTime":1503374293000,"updateUser":"yangdongjun3"},{"appId":"76","createTime":1503380668000,"createUser":"yangdongjun3","displayStatus":1,"id":69,"isDelete":1,"isLeaf":1,"level":3,"name":"账户信息","pid":53,"sort":22,"sysVersion":0,"updateTime":1503380668000,"updateUser":"yangdongjun3","url":"/AccountInfo"},{"appId":"76","createTime":1503380682000,"createUser":"yangdongjun3","displayStatus":1,"id":70,"isDelete":1,"isLeaf":1,"level":3,"name":"权限管理","pid":53,"sort":23,"sysVersion":0,"updateTime":1503380682000,"updateUser":"yangdongjun3","url":"/PrivilegeManagement"},{"appId":"76","createTime":1503380694000,"createUser":"yangdongjun3","displayStatus":1,"id":71,"isDelete":1,"isLeaf":1,"level":3,"name":"角色管理","pid":53,"sort":24,"sysVersion":0,"updateTime":1503380694000,"updateUser":"yangdongjun3","url":"/RoleManagement"}],"success":true};

  res.send(ret);
});

router.get('/getCurrentUserMenuTree', function(req, res) {
  res.type('json');
  let params = req.query,
    ret = {};

  ret = {"data":[{"appId":"76","createTime":1503374005000,"createUser":"yangdongjun3","displayStatus":1,"id":200,"isDelete":1,"isLeaf":0,"level":1,"name":"账号管理","pid":0,"sort":0,"sysVersion":0,"updateTime":1503374005000,"updateUser":"yangdongjun3","url":"账号管理"},{"appId":"76","createTime":1503374293000,"createUser":"yangdongjun3","displayStatus":1,"id":53,"isDelete":1,"isLeaf":1,"level":2,"name":"账号管理","pid":200,"sort":21,"sysVersion":0,"updateTime":1503374293000,"updateUser":"yangdongjun3"},{"appId":"76","createTime":1503380668000,"createUser":"yangdongjun3","displayStatus":1,"id":69,"isDelete":1,"isLeaf":1,"level":3,"name":"账户信息","pid":53,"sort":22,"sysVersion":0,"updateTime":1503380668000,"updateUser":"yangdongjun3","url":"/AccountInfo"},{"appId":"76","createTime":1503380682000,"createUser":"yangdongjun3","displayStatus":1,"id":70,"isDelete":1,"isLeaf":1,"level":3,"name":"权限管理","pid":53,"sort":23,"sysVersion":0,"updateTime":1503380682000,"updateUser":"yangdongjun3","url":"/PrivilegeManagement"},{"appId":"76","createTime":1503380694000,"createUser":"yangdongjun3","displayStatus":1,"id":71,"isDelete":1,"isLeaf":1,"level":3,"name":"角色管理","pid":53,"sort":24,"sysVersion":0,"updateTime":1503380694000,"updateUser":"yangdongjun3","url":"/RoleManagement"},{"appId":"76","createTime":1503374005000,"createUser":"yangdongjun3","displayStatus":1,"id":44,"isDelete":1,"isLeaf":0,"level":1,"name":"智慧供应链","pid":0,"sort":0,"sysVersion":0,"updateTime":1503374005000,"updateUser":"yangdongjun3","url":"智慧供应链"},{"appId":"76","createTime":1503374121000,"createUser":"yangdongjun3","displayStatus":1,"id":45,"isDelete":1,"isLeaf":1,"level":2,"name":"销售诊断","pid":44,"sort":1,"sysVersion":0,"updateTime":1503374121000,"updateUser":"yangdongjun3"},{"appId":"76","createTime":1503374212000,"createUser":"yangdongjun3","displayStatus":1,"id":46,"isDelete":1,"isLeaf":1,"level":3,"name":"生意大盘","pid":45,"sort":2,"sysVersion":0,"updateTime":1503374212000,"updateUser":"yangdongjun3","url":"/BusinessDashboard"},{"appId":"76","createTime":1503374225000,"createUser":"yangdongjun3","displayStatus":1,"id":47,"isDelete":1,"isLeaf":1,"level":3,"name":"生意评估","pid":45,"sort":3,"sysVersion":0,"updateTime":1503374225000,"updateUser":"yangdongjun3","url":"/BusinessEval"},{"appId":"76","createTime":1503374241000,"createUser":"yangdongjun3","displayStatus":1,"id":48,"isDelete":1,"isLeaf":1,"level":2,"name":"用户需求","pid":44,"sort":4,"sysVersion":0,"updateTime":1503374241000,"updateUser":"yangdongjun3"},{"appId":"76","createTime":1503380450000,"createUser":"yangdongjun3","displayStatus":1,"id":56,"isDelete":1,"isLeaf":1,"level":3,"name":"用户升级","pid":48,"sort":5,"sysVersion":0,"updateTime":1503380450000,"updateUser":"yangdongjun3","url":"/UserUpgrade"},{"appId":"76","createTime":1503380466000,"createUser":"yangdongjun3","displayStatus":1,"id":57,"isDelete":1,"isLeaf":1,"level":3,"name":"用户细分","pid":48,"sort":6,"sysVersion":0,"updateTime":1503380466000,"updateUser":"yangdongjun3","url":"/UserSegmentation"},{"appId":"76","createTime":1503374258000,"createUser":"yangdongjun3","displayStatus":1,"id":49,"isDelete":1,"isLeaf":1,"level":2,"name":"购物路径","pid":44,"sort":6,"sysVersion":0,"updateTime":1503374258000,"updateUser":"yangdongjun3"},{"appId":"76","createTime":1503380489000,"createUser":"yangdongjun3","displayStatus":1,"id":58,"isDelete":1,"isLeaf":1,"level":3,"name":"购物路径","pid":49,"sort":7,"sysVersion":0,"updateTime":1503380489000,"updateUser":"yangdongjun3","url":"/PurchasePath"},{"appId":"76","createTime":1503374268000,"createUser":"yangdongjun3","displayStatus":1,"id":50,"isDelete":1,"isLeaf":1,"level":2,"name":"选品策略","pid":44,"sort":8,"sysVersion":0,"updateTime":1503374268000,"updateUser":"yangdongjun3"},{"appId":"76","createTime":1503380506000,"createUser":"yangdongjun3","displayStatus":1,"id":59,"isDelete":1,"isLeaf":1,"level":3,"name":"市场竞争","pid":50,"sort":9,"sysVersion":0,"updateTime":1503380506000,"updateUser":"yangdongjun3","url":"/MarketCompetition"},{"appId":"76","createTime":1503380519000,"createUser":"yangdongjun3","displayStatus":1,"id":60,"isDelete":1,"isLeaf":1,"level":3,"name":"基因图谱","pid":50,"sort":10,"sysVersion":0,"updateTime":1503380519000,"updateUser":"yangdongjun3","url":"/GeneMapping"},{"appId":"76","createTime":1503380541000,"createUser":"yangdongjun3","displayStatus":1,"id":61,"isDelete":1,"isLeaf":1,"level":3,"name":"细分市场","pid":50,"sort":11,"sysVersion":0,"updateTime":1503380541000,"updateUser":"yangdongjun3","url":"/SubdivisionMarket"},{"appId":"76","createTime":1503380557000,"createUser":"yangdongjun3","displayStatus":1,"id":62,"isDelete":1,"isLeaf":1,"level":3,"name":"运营选品","pid":50,"sort":12,"sysVersion":0,"updateTime":1503380557000,"updateUser":"yangdongjun3","url":"/MarketingSelection"},{"appId":"76","createTime":1503374277000,"createUser":"yangdongjun3","displayStatus":1,"id":51,"isDelete":1,"isLeaf":1,"level":2,"name":"价格策略","pid":44,"sort":13,"sysVersion":0,"updateTime":1503374277000,"updateUser":"yangdongjun3"},{"appId":"76","createTime":1503380576000,"createUser":"yangdongjun3","displayStatus":1,"id":63,"isDelete":1,"isLeaf":1,"level":3,"name":"价格弹性分析","pid":51,"sort":14,"sysVersion":0,"updateTime":1503380576000,"updateUser":"yangdongjun3","url":"/PriceAnalysis"},{"appId":"76","createTime":1503380588000,"createUser":"yangdongjun3","displayStatus":1,"id":64,"isDelete":1,"isLeaf":1,"level":3,"name":"竞品量价模型","pid":51,"sort":15,"sysVersion":0,"updateTime":1503380588000,"updateUser":"yangdongjun3","url":"/CompetitivePriceModel"},{"appId":"76","createTime":1503374285000,"createUser":"yangdongjun3","displayStatus":1,"id":52,"isDelete":1,"isLeaf":1,"level":2,"name":"库存管理","pid":44,"sort":16,"sysVersion":0,"updateTime":1503374285000,"updateUser":"yangdongjun3"},{"appId":"76","createTime":1503380602000,"createUser":"yangdongjun3","displayStatus":1,"id":65,"isDelete":1,"isLeaf":1,"level":3,"name":"库存健康运营","pid":52,"sort":17,"sysVersion":0,"updateTime":1503380602000,"updateUser":"yangdongjun3","url":"/StockMarketing"},{"appId":"76","createTime":1503380617000,"createUser":"yangdongjun3","displayStatus":1,"id":66,"isDelete":1,"isLeaf":1,"level":3,"name":"库存健康预警","pid":52,"sort":18,"sysVersion":0,"updateTime":1503380617000,"updateUser":"yangdongjun3","url":"/StockWarning"},{"appId":"76","createTime":1503380636000,"createUser":"yangdongjun3","displayStatus":1,"id":67,"isDelete":1,"isLeaf":1,"level":3,"name":"订单满足检测","pid":52,"sort":19,"sysVersion":0,"updateTime":1503380636000,"updateUser":"yangdongjun3","url":"/OrderFillRateMonitor"},{"appId":"76","createTime":1503380652000,"createUser":"yangdongjun3","displayStatus":1,"id":68,"isDelete":1,"isLeaf":1,"level":3,"name":"缺货原因录入","pid":52,"sort":20,"sysVersion":0,"updateTime":1503380652000,"updateUser":"yangdongjun3","url":"/OutOfStockReason"}],"success":true};

  res.send(ret);
});

module.exports = router;