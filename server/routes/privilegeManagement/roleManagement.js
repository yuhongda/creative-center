'use strict';

const express = require('express');
const _ = require('lodash');
const router = express.Router();
const {resultData} = require('../../common/utils');

router.get('/getRoleMenuTree', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};
  Object.assign(ret, resultData, {
    data: [{
        key: '0-0',
        title: '智慧供应链',
        children: [{
            key: '0-0-0',
            title: '销售诊断',
            children: [{
                key: '0-0-0-0',
                title: '生意大盘'
              },{
                key: '0-0-0-1',
                title: '生意评估'
              }]
          }, {
            key: '0-0-1',
            title: '用户需求',
            children: [{
                title: '用户细分',
                key: '0-0-1-0'
              },{
                title: '用户升级',
                key: '0-0-1-1'
              },{
                title: '购物路径',
                key: '0-0-1-2'
              }]
          }]
      }, {
        key: '0-1',
        title: '专题分析',
        children: [{
            key: '0-1-0',
            title: '新品上市1',
            children: [{
                title: '用户细分',
                key: '0-1-1-0'
              },{
                title: '用户升级',
                key: '0-1-1-1'
              },{
                title: '购物路径',
                key: '0-1-1-2'
              }]
        },{
            key: '0-1-1',
            title: '新品上市2',
            children: [{
                title: '用户细分',
                key: '0-1-1-0'
              },{
                title: '用户升级',
                key: '0-1-1-1'
              },{
                title: '购物路径',
                key: '0-1-1-2'
              }]
        },{
            key: '0-1-2',
            title: '新品上市3'
        }]
    }]
  });
  res.send(ret);
});

router.post('/saveRolePermission', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};

  console.log('roldId', params.roldId);
  console.log('menuIds', params.menuIds);

  Object.assign(ret, resultData);

  res.send(ret);
});

router.get('/searchRole', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};
  Object.assign(ret, resultData, {
    data: [
      {
        key: 1,
        userId: 12,
        name: '管理员000',
        describe: '我是描述',
        cTime: '2017-6-15',
        mTime: '2017-8-15'
      }
    ]
  });
  res.send(ret);
});

router.post('/deleteRole', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};

  console.log('userId', params.userId);
  Object.assign(ret, resultData);

  res.send(ret);
});

router.post('/saveRole', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};

  console.log('userName', params.userName);
  console.log('userDescribe', params.userDescribe);

  Object.assign(ret, resultData, {
     data: {
       roleId: '9999'
     }
  });

  res.send(ret);
});

router.get('/getRoleManagementData', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};
  Object.assign(ret, resultData, {
    data: [
      {
        key: 1,
        roleId: 145,
        name: '管理员',
        describe: '我是描述',
        cTime: '2017-6-15',
        mTime: '2017-8-15',
        users: [
          {
            key: 1,
            userId: 123,
            loginName: '小花',
            name: '糊涂图',
            email: 'tesste111@jd.com',
            department: '技术部',
            duty: '工程师',
            role: '开发区',
            oTime: '2017-6-15',
            mTime: '2017-8-15'
          }, {
            key: 2,
            userId: 566,
            loginName: '大花',
            name: '糊涂图',
            email: 'tesste222@jd.com',
            department: '技术部',
            duty: '工程师',
            role: '开发区',
            oTime: '2017-6-15',
            mTime: '2017-8-15'
          }
        ]
      }, {
        key: 2,
        roleId: 783,
        name: '管理员2',
        describe: '我是描述222',
        cTime: '2017-6-15',
        mTime: '2017-8-15',
        users: [
          {
            key: 1,
            userId: 123,
            loginName: '小小花',
            name: '糊涂图',
            email: 'tesste111@jd.com',
            department: '技术部',
            duty: '工程师',
            role: '开发区',
            oTime: '2017-6-15',
            mTime: '2017-8-15'
          }
        ]
      }
    ]
  });
  res.send(ret);
});

module.exports = router;
