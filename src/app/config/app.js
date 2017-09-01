/**
 * Created by gaojian3 on 2017/7/10.
 */

const ConfigApp = {
  home: {
    funcsPerRow: 4
  }
};

const AppFunctions = [{
  type:'group',
  index:'SmartSupportChain',
  name:'智慧供应链',
  expanded:false,
  children:[{
    type:'item',
    link:'/BusinessDashboard',
    index:'BusinessDashboard',
    name:'生意大盘'
  }, {
    type:'item',
    link:'/PurchasePath',
    index:'PurchasePath',
    name:'购物路径'
  }, {
    type:'item',
    link:'/StockMarketing',
    index:'StockMarketing',
    name:'库存健康运营'
  }, {
    type:'item',
    link:'',
    index:'SaleDiagnosis',
    name:'生意评估',
    disabled: true
  }, {
    type:'item',
    link:'',
    index:'PriceTra',
    name:'价格策略',
    disabled: true
  }, {
    type:'UserRequirement',
    link:'',
    index:'UserRequirement',
    name:'用户需求',
    disabled: true
  }]
}, {
  type:'group',
  index:'ThematicAnalysis',
  name:'专题分析',
  expanded:false,
  children:[{
    type:'item',
    link:'',
    index:'NewListing',
    name:'新品上市',
    disabled: true
  }]
}];

export {
  ConfigApp,
  AppFunctions
};