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