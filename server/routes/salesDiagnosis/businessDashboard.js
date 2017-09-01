'use strict';

const express = require('express');
const _ = require('lodash');
const router = express.Router();
const { resultData } = require('../../common/utils');
const moment = require('moment');

router.post('/getTargetData', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};

  Object.assign(ret, resultData, {
    data: {
      yearTarget: 1234567,
      yearSalesVolume: 234567,
      yearCompletionRate: 0.28,
      yearForecastRate: 0.28,
      seasonTarget: 234567,
      seasonSalesVolume: 234567,
      seasonCompletionRate: 0.28,
      seasonForecastRate: 0.28,
      monthTarget: 234567,
      monthSalesVolume: 234567,
      monthCompletionRate: 0.28,
      monthForecastSales: 234567,
      yearKpiTrack: {
        current: _.random(100000000, 1000000000),
        target: _.random(100000000, 1000000000)
      },
      seasonKpiTrack: {
        current: _.random(100000000, 1000000000),
        target: _.random(100000000, 1000000000)
      },
      monthKpiTrack: {
        current: _.random(100000000, 1000000000),
        target: _.random(100000000, 1000000000)
      },
    }
  });

  res.send(ret);
});

router.post('/getCalendarData', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};

  Object.assign(ret, resultData, {
    data: _.times(+moment(params.date).endOf('month').format("DD"), i => {
      return [
        moment(params.date).add('days', i).format("YYYY-MM-DD"),
        _.random(10, 10000)
      ];
    })
  });

  res.send(ret);
});

router.post('/getCalendarTarget', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};

  Object.assign(ret, resultData, {
    data: {
      calendarTarget: _.random(1000000000, 10000000000),
      calendarActual: _.random(1000000000, 10000000000),
      calendarComplete: _.random(0.1, 0.95),
      calendarSales: _.random(10000, 100000)
    }
  });

  res.send(ret);
});

router.post('/getCategoryKpiTrackList', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};

  Object.assign(ret, resultData, {
    data: _.times(5, i => {
      return {
        name: '品类' + (i + 1),
        kpiTrack: {
          current: _.random(1, 100),
          target: _.random(1, 100)
        }
      };
    })
  });

  res.send(ret);
});

router.post('/getBrandKpiTrackList', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};

  Object.assign(ret, resultData, {
    data: _.times(6, i => {
      return {
        name: '品牌' + (i + 1),
        kpiTrack: {
          current: _.random(1, 100),
          target: _.random(1, 100)
        }
      };
    })
  });

  res.send(ret);
});

router.post('/getSalesTrends', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};

  Object.assign(ret, resultData, {
    data: _.times(365, i => {
      return {
        date: moment('2017-01-01').add('days', i).format("MM-DD"),
        value: _.random(1000, 10000)
      };
    })
  });

  res.send(ret);
});

router.post('/getCategoryForBrand', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};

  Object.assign(ret, resultData, {
    data: _.times(5, i => {
      return {
        id: (i + 1) + '',
        name: `品类${i + 1}`
      };
    })
  });

  res.send(ret);
});

router.post('/getTargetMonthData', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};

  

  Object.assign(ret, resultData, {
    data: _.times(5, i => {
      return {
        id: (i + 1) + '',
        name: `品类${i + 1}`
      };
    })
  });

  res.send(ret);
});

module.exports = router;