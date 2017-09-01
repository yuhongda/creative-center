'use strict';

const express = require('express');
const _ = require('lodash');
const router = express.Router();
const { resultData } = require('../../common/utils');

//列表
router.get('/getOutOfStockReasonList', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};

  Object.assign(ret, resultData, {
      total: 100, // 总条数
      data: [{"reasonId":3,"skuId":"845384","skuName":"【京东超市】玉兰油沐浴露水嫩清爽型1L（沐浴液 沐浴乳 新老包装随机发货）","dcCode":"9","dcName":"沈阳","noStockPv":4,"noStockPvRatio":"0.08%","spotStockNum":2,"transitStockSum":0,"purchasePlanNum":0,"oosReason":"5","oosReasonName":null,"oosDate":"2017-07-27","remark":"rst"},{"reasonId":null,"skuId":"845384","skuName":"【京东超市】玉兰油沐浴露水嫩清爽型1L（沐浴液 沐浴乳 新老包装随机发货）","dcCode":"5","dcName":"武汉","noStockPv":6,"noStockPvRatio":"0.12%","spotStockNum":69,"transitStockSum":0,"purchasePlanNum":0,"oosReason":null,"oosReasonName":null,"oosDate":"2017-07-27","remark":null},{"reasonId":null,"skuId":"1265501","skuName":"【京东超市】玉兰油 OLAY 美肌滋润沐浴乳洁净滋养 1000ML（沐浴露）","dcCode":"5","dcName":"武汉","noStockPv":4,"noStockPvRatio":"0.08%","spotStockNum":20,"transitStockSum":0,"purchasePlanNum":0,"oosReason":null,"oosReasonName":null,"oosDate":"2017-07-27","remark":null},{"reasonId":null,"skuId":"1280166","skuName":"【京东超市】玉兰油 OLAY 深润滋养沐浴乳50ml（新老包装，随机发送）（本品非卖品，建议请勿购买）","dcCode":"316","dcName":"西安","noStockPv":2,"noStockPvRatio":"0.04%","spotStockNum":15,"transitStockSum":0,"purchasePlanNum":0,"oosReason":null,"oosReasonName":null,"oosDate":"2017-07-27","remark":null},{"reasonId":null,"skuId":"1071748","skuName":"【京东超市】舒肤佳香皂薰衣草舒缓呵护125g（新老包装随机发货）","dcCode":"3","dcName":"上海","noStockPv":6,"noStockPvRatio":"0.12%","spotStockNum":32,"transitStockSum":0,"purchasePlanNum":0,"oosReason":null,"oosReasonName":null,"oosDate":"2017-07-27","remark":null},{"reasonId":null,"skuId":"753274","skuName":"【京东超市】玉兰油沐浴露紧致滋润型1L（沐浴液 沐浴乳 新老包装随机发货）","dcCode":"10","dcName":"广州","noStockPv":11,"noStockPvRatio":"0.22%","spotStockNum":114,"transitStockSum":0,"purchasePlanNum":0,"oosReason":null,"oosReasonName":null,"oosDate":"2017-07-27","remark":null},{"reasonId":null,"skuId":"753274","skuName":"【京东超市】玉兰油沐浴露紧致滋润型1L（沐浴液 沐浴乳 新老包装随机发货）","dcCode":"4","dcName":"成都","noStockPv":2,"noStockPvRatio":"0.04%","spotStockNum":93,"transitStockSum":0,"purchasePlanNum":0,"oosReason":null,"oosReasonName":null,"oosDate":"2017-07-27","remark":null},{"reasonId":null,"skuId":"753268","skuName":"【京东超市】玉兰油莹亮滋养沐浴乳720毫升（新老包装随机发货）（沐浴露）","dcCode":"316","dcName":"西安","noStockPv":2,"noStockPvRatio":"0.04%","spotStockNum":1,"transitStockSum":0,"purchasePlanNum":0,"oosReason":null,"oosReasonName":null,"oosDate":"2017-07-27","remark":null},{"reasonId":null,"skuId":"845380","skuName":"【京东超市】玉兰油水嫩清爽沐浴露720ML（新旧包装转换，随机发货）","dcCode":"10","dcName":"广州","noStockPv":1,"noStockPvRatio":"0.02%","spotStockNum":58,"transitStockSum":0,"purchasePlanNum":0,"oosReason":null,"oosReasonName":null,"oosDate":"2017-07-27","remark":null},{"reasonId":null,"skuId":"5239014","skuName":"舒肤佳 Safeguard 活力运动劲爽清新沐浴露400毫升","dcCode":"9","dcName":"沈阳","noStockPv":1,"noStockPvRatio":"0.02%","spotStockNum":0,"transitStockSum":0,"purchasePlanNum":0,"oosReason":null,"oosReasonName":null,"oosDate":"2017-07-27","remark":null}]
    //[{"reasonId":123,"skuId":"1183111","skuName":"【京东超市】护舒宝云感超净棉丝薄卫生巾全周期组合10包装（日用50片+夜用20片+甜睡6片+无香护垫36片）","dcCode":"10","dcName":"广州","noStockPv":16,"noStockPvRatio":"0.34%","spotStockNum":0,"transitStockSum":0,"purchasePlanNum":0,"oosReason":null,"oosReasonName":null,"oosDate":null,"remark":null},{"reasonId":null,"skuId":"1183111","skuName":"【京东超市】护舒宝云感超净棉丝薄卫生巾全周期组合10包装（日用50片+夜用20片+甜睡6片+无香护垫36片）","dcCode":"3","dcName":"上海","noStockPv":30,"noStockPvRatio":"0.64%","spotStockNum":112,"transitStockSum":0,"purchasePlanNum":0,"oosReason":null,"oosReasonName":null,"oosDate":null,"remark":null},{"reasonId":null,"skuId":"1183111","skuName":"【京东超市】护舒宝云感超净棉丝薄卫生巾全周期组合10包装（日用50片+夜用20片+甜睡6片+无香护垫36片）","dcCode":"316","dcName":"西安","noStockPv":10,"noStockPvRatio":"0.21%","spotStockNum":0,"transitStockSum":0,"purchasePlanNum":0,"oosReason":null,"oosReasonName":null,"oosDate":null,"remark":null},{"reasonId":null,"skuId":"1183111","skuName":"【京东超市】护舒宝云感超净棉丝薄卫生巾全周期组合10包装（日用50片+夜用20片+甜睡6片+无香护垫36片）","dcCode":"4","dcName":"成都","noStockPv":1,"noStockPvRatio":"0.02%","spotStockNum":1,"transitStockSum":0,"purchasePlanNum":0,"oosReason":null,"oosReasonName":null,"oosDate":null,"remark":null},{"reasonId":null,"skuId":"1183111","skuName":"【京东超市】护舒宝云感超净棉丝薄卫生巾全周期组合10包装（日用50片+夜用20片+甜睡6片+无香护垫36片）","dcCode":"5","dcName":"武汉","noStockPv":5,"noStockPvRatio":"0.11%","spotStockNum":5,"transitStockSum":0,"purchasePlanNum":0,"oosReason":null,"oosReasonName":null,"oosDate":null,"remark":null},{"reasonId":null,"skuId":"1183111","skuName":"【京东超市】护舒宝云感超净棉丝薄卫生巾全周期组合10包装（日用50片+夜用20片+甜睡6片+无香护垫36片）","dcCode":"6","dcName":"北京","noStockPv":20,"noStockPvRatio":"0.43%","spotStockNum":1,"transitStockSum":0,"purchasePlanNum":0,"oosReason":null,"oosReasonName":null,"oosDate":null,"remark":null},{"reasonId":null,"skuId":"1183111","skuName":"【京东超市】护舒宝云感超净棉丝薄卫生巾全周期组合10包装（日用50片+夜用20片+甜睡6片+无香护垫36片）","dcCode":"772","dcName":"德州","noStockPv":10,"noStockPvRatio":"0.21%","spotStockNum":0,"transitStockSum":0,"purchasePlanNum":0,"oosReason":null,"oosReasonName":null,"oosDate":null,"remark":null},{"reasonId":null,"skuId":"1207989","skuName":"【京东超市】护舒宝云感超净棉贴身 日夜组合装16片卫生巾(日用240mm10片+夜用284mm6片 棉柔 瞬吸 透气)","dcCode":"772","dcName":"德州","noStockPv":13,"noStockPvRatio":"0.28%","spotStockNum":30,"transitStockSum":0,"purchasePlanNum":480,"oosReason":null,"oosReasonName":null,"oosDate":null,"remark":null},{"reasonId":null,"skuId":"1208000","skuName":"【京东超市】护舒宝云感超净棉丝薄卫生巾 夜用284mm16片（棉柔 瞬吸 超薄透气）","dcCode":"9","dcName":"沈阳","noStockPv":28,"noStockPvRatio":"0.60%","spotStockNum":0,"transitStockSum":0,"purchasePlanNum":0,"oosReason":null,"oosReasonName":null,"oosDate":null,"remark":null},{"reasonId":null,"skuId":"1208001","skuName":"【京东超市】护舒宝超净棉丝薄卫生巾 日夜组合28片(日用240mm20片+夜用284mm8片棉柔瞬吸)新老包装随机发放","dcCode":"9","dcName":"沈阳","noStockPv":6,"noStockPvRatio":"0.13%","spotStockNum":0,"transitStockSum":0,"purchasePlanNum":0,"oosReason":null,"oosReasonName":null,"oosDate":null,"remark":null}]
    /*[{
        reasonId: `${parseInt(Math.random() * 10, 10) % 3}`,
        skuId: '111', // SKU编码
        skuName: 'aaa1', // SKU名称
        dcCode: 'bbb1', // 配送中心代码
        dcName: 'ccc1', // 配送中心名称
        noStockPv: 'ddd', // 无货PV
        noStockPvRatio: 'eee', // 无货PV占比   改成百分比？？？
        spotStockNum: 'fff', // 现货库存
        transitStockSum: 'ggg', // 内配在途
        purchasePlanNum: 'hhh', // 采购在途
        oosReason: 'iii',  // 缺货原因代码
        oosReasonName: 'jjj',  // 缺货原因
        oosDate: 'kkk', // 原因登记日期
        remark: 'lll' // 备注
      }, {
        reasonId: "2",
        skuId: '222', // SKU编码
        skuName: 'aaa2', // SKU名称
        dcCode: 'bbb2', // 配送中心代码
        dcName: `DC-${parseInt(Math.random() * 1000, 10)}`, // 配送中心名称
        noStockPv: 'ddd', // 无货PV
        noStockPvRatio: 'eee', // 无货PV占比   改成百分比？？？
        spotStockNum: 'fff', // 现货库存
        transitStockSum: 'ggg', // 内配在途
        purchasePlanNum: 'hhh', // 采购在途
        oosReason: 'iii',  // 缺货原因代码
        oosReasonName: 'jjj',  // 缺货原因
        oosDate: 'kkk', // 原因登记日期
        remark: 'lll' // 备注
      }]*/
  });

  res.send(ret);
});

//保存缺货原因
router.post('/saveOutOfStockReason', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};

  Object.assign(ret, resultData, {
    data: null
  });

  /*ret.success = false;
  ret.message = 'xxxxxx';*/

  res.send(ret);
});

//采购在途
router.get('/getPurchasePlanList', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};

  Object.assign(ret, resultData, {
    total: 100, // 总条数
    //data: null
    data: [{
      dcName: 'dc1', // 配送中心名称
      poNo: '111', // 采购单号
      poQtty: 1000, // 商品数量
      poCreatedDt: '20170707', // 创建时间
      poStatus: 'aa' // 采购单状态
    }, {
      dcName: 'dc2', // 配送中心名称
      poNo: '222', // 采购单号
      poQtty: 2000, // 商品数量
      poCreatedDt: '20170707', // 创建时间
      poStatus: 'aa' // 采购单状态
    }, {
      dcName: 'dc3', // 配送中心名称
      poNo: '333', // 采购单号
      poQtty: 3000, // 商品数量
      poCreatedDt: '20170707', // 创建时间
      poStatus: 'aa' // 采购单状态
    }, {
      dcName: 'dc4', // 配送中心名称
      poNo: '444', // 采购单号
      poQtty: 3000, // 商品数量
      poCreatedDt: '20170707', // 创建时间
      poStatus: 'aa' // 采购单状态
    }, {
      dcName: 'dc5', // 配送中心名称
      poNo: '555', // 采购单号
      poQtty: 3000, // 商品数量
      poCreatedDt: '20170707', // 创建时间
      poStatus: 'aa' // 采购单状态
    }, {
      dcName: 'dc6', // 配送中心名称
      poNo: '666', // 采购单号
      poQtty: 3000, // 商品数量
      poCreatedDt: '20170707', // 创建时间
      poStatus: 'aa' // 采购单状态
    }, {
      dcName: 'dc7', // 配送中心名称
      poNo: '777', // 采购单号
      poQtty: 3000, // 商品数量
      poCreatedDt: '20170707', // 创建时间
      poStatus: 'aa' // 采购单状态
    }, {
      dcName: 'dc8', // 配送中心名称
      poNo: '888', // 采购单号
      poQtty: 3000, // 商品数量
      poCreatedDt: '20170707', // 创建时间
      poStatus: 'aa' // 采购单状态
    }]
  });

  res.send(ret);
});

//缺货原因
router.get('/getOutOfStockReasons', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};

  Object.assign(ret, resultData, {
    total: 100, // 总条数
    //*
    data: [{
      code: -1,
      name: "无"
    }, {
      code: 1,
      name: '原因1'
    }, {
      code: 2,
      name: '原因2'
    }, {
      code: 3,
      name: '原因3'
    }, {
      code: 4,
      name: '原因4'
    }, {
      code: 5,
      name: '原因5'
    }, {
      code: 6,
      name: '原因6'
    }, {
      code: 7,
      name: '原因7'
    }]
  //*/
  //data: null
  });

  res.send(ret);
});

module.exports = router;
