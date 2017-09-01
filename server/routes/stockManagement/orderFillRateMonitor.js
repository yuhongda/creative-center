'use strict';

const express = require('express');
const _ = require('lodash');
const router = express.Router();
const { resultData } = require('../../common/utils');

router.post('/getOrderFillRateMonitorData', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};

  const newOrder = _.times(5, function(i){
    const num = i + 1;
    return {
      id:num, 
      type: num, 
      count: 10000+num, 
      sum: 1000000+num
    };
  });

  const completeOrder = [
    { id:'completePurchaseOrderCount', name: '已完成采购单数', value: 500},
    { id:'completePurchaseSum', name: '已完成采购金额', value: 1000},
    { id:'orderFillRate', name: '订单满足率', value: 98.12},
    { id:'completeAverageCycle', name: '平均完成周期', value: 500},
    { id:'acceptConfirmRate', name: '接受确认率', value: 500},
    { id:'orderPerformanceRate', name: '订单履约率', value: 30},
    { id:'submitToConfirmDate', name: '提交到确认时间', value: 10},
  ];

  const completeAverageCycle = _.times(7, function(i){
    const num = i + 1;
    return {
      id: num,
      cityName: '北京'+num,
      date1: 0.8,
      date1Name: '确认时间',
      date2: 0.8,
      date2Name: '送货时间',
      date3: 0.8,
      date3Name: '收货时间'
    }
  });
  
  Object.assign(ret, resultData, {
    data: {
      newOrder,
      completeOrder,
      completeAverageCycle
    }
  });

  const testData = {
    "success":true,
    "message":null,
    "data":{
      "completeOrder":[
        {"name":"已完成采购单数","value":555,"id":"completePurchaseOrderCount"},
        {"name":"已完成采购金额","value":7.400214405E7,"id":"completePurchaseSum"},
        {"name":"订单满足率","value":0.9015,"id":"orderFillRate"},
        {"name":"平均完成周期","value":8.1,"id":"completeAverageCycle"},
        {"name":"接受确认率","value":0.9329,"id":"acceptConfirmRate"},
        {"name":"订单履约率","value":0.9664,"id":"orderPerformanceRate"},
        {"name":"提交到确认时间","value":3.3,"id":"submitToConfirmDate"}
      ],
      "newOrder":[
        {"count":23,"sum":997980.52,"id":1,"type":10020},
        {"count":230,"sum":2.217899135E7,"id":2,"type":2},
        {"count":220,"sum":4.498615157E7,"id":3,"type":3},
        {"count":1532,"sum":2.7374967122E8,"id":4,"type":4},
        {"count":2005,"sum":3.4191279466E8,"id":5,"type":0}
      ],
      "completeAverageCycle":[
        {"date2Name":"送货时间","cityName":null,"date3":null,"id":1,"date2":2.7,"date1":2.8,"date3Name":"收货时间","date1Name":"确认时间"},
        {"date2Name":"送货时间","cityName":"广州配送中心","date3":0.2,"id":2,"date2":5.4,"date1":1.5,"date3Name":"收货时间","date1Name":"确认时间"},
        {"date2Name":"送货时间","cityName":"上海配送中心","date3":0.2,"id":3,"date2":5.1,"date1":2.4,"date3Name":"收货时间","date1Name":"确认时间"},
        {"date2Name":"送货时间","cityName":"西安配送中心","date3":-0.1,"id":4,"date2":7.1,"date1":1.5,"date3Name":"收货时间","date1Name":"确认时间"},
        {"date2Name":"送货时间","cityName":"成都配送中心","date3":0.1,"id":5,"date2":8.6,"date1":1.4,"date3Name":"收货时间","date1Name":"确认时间"},
        {"date2Name":"送货时间","cityName":"武汉配送中心","date3":0.1,"id":6,"date2":7.4,"date1":1.5,"date3Name":"收货时间","date1Name":"确认时间"},
        {"date2Name":"送货时间","cityName":"北京配送中心","date3":0.3,"id":7,"date2":2.7,"date1":2.9,"date3Name":"收货时间","date1Name":"确认时间"},
        {"date2Name":"送货时间","cityName":"天津配送中心","date3":0.2,"id":8,"date2":2.8,"date1":4.0,"date3Name":"收货时间","date1Name":"确认时间"},
        {"date2Name":"送货时间","cityName":"固安配送中心","date3":0.1,"id":9,"date2":2.6,"date1":3.3,"date3Name":"收货时间","date1Name":"确认时间"},
        {"date2Name":"送货时间","cityName":"南沙保税配送中心","date3":1.9,"id":10,"date2":13.3,"date1":12.8,"date3Name":"收货时间","date1Name":"确认时间"},
        {"date2Name":"送货时间","cityName":"德州配送中心","date3":0.3,"id":11,"date2":8.1,"date1":4.4,"date3Name":"收货时间","date1Name":"确认时间"},
        {"date2Name":"送货时间","cityName":"沈阳配送中心","date3":0.1,"id":12,"date2":6.1,"date1":2.7,"date3Name":"收货时间","date1Name":"确认时间"}
      ]},
      "total":0
    };
  res.send(testData);
  // res.send(ret);
});

module.exports = router;
