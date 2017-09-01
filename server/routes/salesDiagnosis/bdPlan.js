'use strict';

const express = require('express');
const _ = require('lodash');
const router = express.Router();
const { resultData } = require('../../common/utils');
const moment = require('moment');
const multer = require('multer');
const upload = multer({ dest: 'server/uploads/' });

router.post('/getPlanSumList', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};

  Object.assign(ret, resultData, {
    data: {
      yearTarget: _.random(50000, 100000),
      seasonTarget1: _.random(10000, 30000),
      seasonTarget2: _.random(10000, 30000),
      seasonTarget3: _.random(10000, 30000),
      seasonTarget4: _.random(10000, 30000),
      monthTarget1: _.random(2000, 8000),
      monthTarget2: _.random(2000, 8000),
      monthTarget3: _.random(2000, 8000),
      monthTarget4: _.random(2000, 8000),
      monthTarget5: _.random(2000, 8000),
      monthTarget6: _.random(2000, 8000),
      monthTarget7: _.random(2000, 8000),
      monthTarget8: _.random(2000, 8000),
      monthTarget9: _.random(2000, 8000),
      monthTarget10: _.random(2000, 8000),
      monthTarget11: _.random(2000, 8000),
      monthTarget12: _.random(2000, 8000),
    }
  });

  res.send(ret);
});

router.post('/getBdCategoryPlanList', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};

  Object.assign(ret, resultData, {
    data: {
      [`${params.year}-01`]: _.random(2000, 8000),
      [`${params.year}-02`]: _.random(2000, 8000),
      [`${params.year}-03`]: _.random(2000, 8000),
      [`${params.year}-04`]: _.random(2000, 8000),
      [`${params.year}-05`]: _.random(2000, 8000),
      [`${params.year}-06`]: _.random(2000, 8000),
      [`${params.year}-07`]: _.random(2000, 8000),
      [`${params.year}-08`]: _.random(2000, 8000),
      [`${params.year}-09`]: _.random(2000, 8000),
      [`${params.year}-10`]: _.random(2000, 8000),
      [`${params.year}-11`]: _.random(2000, 8000),
      [`${params.year}-12`]: _.random(2000, 8000),
    }
  });

  res.send(ret);
});

router.post('/getBdBrandPlanList', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};

  Object.assign(ret, resultData, {
    data: {
      [`${params.year}-01`]: _.random(2000, 8000),
      [`${params.year}-02`]: _.random(2000, 8000),
      [`${params.year}-03`]: _.random(2000, 8000),
      [`${params.year}-04`]: _.random(2000, 8000),
      [`${params.year}-05`]: _.random(2000, 8000),
      [`${params.year}-06`]: _.random(2000, 8000),
      [`${params.year}-07`]: _.random(2000, 8000),
      [`${params.year}-08`]: _.random(2000, 8000),
      [`${params.year}-09`]: _.random(2000, 8000),
      [`${params.year}-10`]: _.random(2000, 8000),
      [`${params.year}-11`]: _.random(2000, 8000),
      [`${params.year}-12`]: _.random(2000, 8000),
    }
  });

  res.send(ret);
});

router.post('/getBdPlanList', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {},
    dataObj = {};

  _.times(+moment(params.date).endOf('month').format("DD"), i => {
    dataObj[moment(params.date).add('days', i).format("YYYY-MM-DD")] = _.random(1000, 10000);
  });

  Object.assign(ret, resultData, {
    data: dataObj
  });

  res.send(ret);
});

router.post('/saveBdPlan', function(req, res) {
  res.type('json');
  let params = req.body,
    ret = {};

  Object.assign(ret, resultData);

  res.send(ret);
});

router.post('/importBdPlan', upload.single('file'), function(req, res) {
  res.type('html');
  let params = req.body,
    ret = {};

  console.log(req.file);
  Object.assign(ret, resultData);

  res.send(ret);
});

router.post('/exportBdPlan', function(req, res) {
  res.type('html');
  let params = req.body,
    ret = {};
    
  console.log(params);
  // Object.assign(ret, resultData, {
  //   data: 'www.jd.com'
  // });

  // res.send(ret);

  res.download('server/files/testDownload.xlsx');
});

module.exports = router;