import { types } from "mobx-state-tree";
import { CommonStore } from "./commonStore";
import HeaderStore from "./headerStore";
import SiderStore from "./SiderStore";
import BusinessDashboardStore from "./salesDiagnosis/businessDashboardStore";
import BusinessEvalStore from "./salesDiagnosis/businessEvalStore";
import StockMarketingStore from "./stockManagement/stockMarketingStore";
import StockWarningStore from "./stockManagement/stockWarningStore";
import OrderFillRateMonitorStore from "./stockManagement/orderFillRateMonitorStore";
import GeneMappingStore from "./selectStrategy/geneMappingStore";
import SubdivisionMarketStore from "./selectStrategy/subdivisionMarketStore";
import ConditionStore from "./conditionStore";
import ConditionStockStore from "./conditionStockStore";
import UserSegmentationStore from "./userDemand/userSegmentationStore";
import PurchasePathStore from "./userDemand/purchasePathStore";
import PriceAnalysisStore from "./priceStrategy/priceAnalysisStore";
import OutOfStockReasonStore from './stockManagement/outOfStockReasonStore';
import UserUpgradeStore from "./userDemand/userUpgradeStore";
import CompetitivePriceModelStore from "./priceStrategy/competitivePriceModelStore";
import MarketCompetitionStore from "./selectStrategy/marketCompetitionStore";
import MarketingSelectionStore from "./selectStrategy/marketingSelectionStore";
import AccountInfoStore from "./privilegeManagement/accountInfoStore";
import RoleManagementStore from "./privilegeManagement/roleManagementStore";
import PrivilegeManagementStore from "./privilegeManagement/privilegeManagementStore";

const RootStore = types.model("RootStore", {
  common: types.optional(CommonStore, {
    userinfo: {
      username: 'Silver'
    }
  }),

  header: types.optional(HeaderStore, {
    current: 0
  }),

  sider: types.optional(SiderStore, {
    isOpen: false,
    current: 'page1',
    // menuData: [{
    //     type: 'group',
    //     index: 'AccountManagement',
    //     name: '账号管理',
    //     expanded: false,
    //     children: [{
    //       type: 'group',
    //       index: 'AccountInformation',
    //       name: '账号管理',
    //       expanded: false,
    //       children: [
    //         { type: 'item', level: 3, link: '/AccountInfo', index: 'AccountInfo', name: '账户信息' },
    //         { type: 'item', level: 3, link: '/PrivilegeManagement', index: 'PrivilegeManagement', name: '权限管理' },
    //         { type: 'item', level: 3, link: '/RoleManagement', index: 'RoleManagement', name: '角色管理' },
    //       ]
    //     }]
    //   }, {
    //     type: 'group',
    //     index: 'IntelligentSupplyChain',
    //     name: '智慧供应链',
    //     expanded: false,
    //     children: [{
    //         type: 'group',
    //         index: 'SalesDiagnose',
    //         name: '销售诊断',
    //         expanded: false,
    //         children: [
    //           { type: 'item', level: 3, link: '/BusinessDashboard', index: 'BusinessDashboard', name: '生意大盘' },
    //           { type: 'item', level: 3, link: '/BusinessEval', index: 'BusinessEval', name: '生意评估' }
    //         ]
    //       },
    //       {
    //         type: 'group',
    //         index: 'UserReq',
    //         name: '用户需求',
    //         expanded: false,
    //         children: [
    //           { type: 'item', level: 3, link: '/UserUpgrade', index: 'UserUpgrade', name: '用户升级' },
    //           { type: 'item', level: 3, link: '/UserSegmentation', index: 'UserSegmentation', name: '用户细分' },
    //           // {type:'item', level: 3, link:'/PurchasePath', index:'PurchasePath', name:'购物路径'}
    //         ]
    //       },
    //       {
    //         type: 'group',
    //         index: 'PurchasePath',
    //         name: '购物路径',
    //         expanded: false,
    //         children: [
    //           { type: 'item', level: 3, link: '/PurchasePath', index: 'PurchasePath', name: '购物路径' }
    //         ]
    //       },
    //       {
    //         type: 'group',
    //         index: 'SelectStrategy',
    //         name: '选品策略',
    //         expanded: false,
    //         children: [
    //           { type: 'item', level: 3, link: '/MarketCompetition', index: 'MarketCompetition', name: '市场竞争' },
    //           { type: 'item', level: 3, link: '/GeneMapping', index: 'GeneMapping', name: '基因图谱' },
    //           { type: 'item', level: 3, link: '/SubdivisionMarket', index: 'SubdivisionMarket', name: '细分市场' },
    //           { type: 'item', level: 3, link: '/MarketingSelection', index: 'MarketingSelection', name: '运营选品' }
    //         ]
    //       },
    //       {
    //         type: 'group',
    //         index: 'PriceStrategy',
    //         name: '价格策略',
    //         expanded: false,
    //         children: [
    //           { type: 'item', level: 3, link: '/PriceAnalysis', index: 'PriceAnalysis', name: '价格弹性分析' },
    //           { type: 'item', level: 3, link: '/CompetitivePriceModel', index: 'CompetitivePriceModel', name: '竞品量价模型' }
    //         ]
    //       },
    //       // {type:'group', index:'Promotion', name:'促销策略', expanded:false, children:[
    //       //     {type:'item', level: 3, link:'/PromotionPlan', index:'PromotionPlan', name:'促销计划'}
    //       // ]},
    //       {
    //         type: 'group',
    //         index: 'StockManagement',
    //         name: '库存管理',
    //         expanded: false,
    //         children: [
    //           { type: 'item', level: 3, link: '/StockMarketing', index: 'StockMarketing', name: '库存健康运营' },
    //           { type: 'item', level: 3, link: '/StockWarning', index: 'StockWarning', name: '库存健康预警' },
    //           // {type:'item', level: 3, link:'/ReasonOfSoldOut', index:'ReasonOfSoldOut', name:'缺货原因录入'},
    //           { type: 'item', level: 3, link: '/OrderFillRateMonitor', index: 'OrderFillRateMonitor', name: '订单满足检测' },
    //           { type: 'item', level: 3, link: '/OutOfStockReason', index: 'OutOfStockReason', name: '缺货原因录入' }
    //         ]
    //       }
    //     ]
    //   },
    //   // {type:'group', index:'SubjectAnalysis', name:'专题分析', expanded:false, children:[
    //   //     {type:'item', link:'/NewArrivalModel', index:'NewArrivalModel', name:'新品上市模型'}
    //   // ]}
    // ]
  }),

  conditions: types.optional(ConditionStore, {}),
  conditionsStock: types.optional(ConditionStockStore, {}),
  businessDashboard: types.optional(BusinessDashboardStore, {}),
  businessEval: types.optional(BusinessEvalStore, {}),
  stockMarketing: types.optional(StockMarketingStore, {}),
  stockWarning: types.optional(StockWarningStore, {}),
  geneMapping: types.optional(GeneMappingStore, {}),
  subdivisionMarket: types.optional(SubdivisionMarketStore, {}),
  userSegmentation: types.optional(UserSegmentationStore, {}),
  priceAnalysis: types.optional(PriceAnalysisStore, {}),
  orderFillRateMonitor: types.optional(OrderFillRateMonitorStore, {}),
  competitivePriceModel: types.optional(CompetitivePriceModelStore, {}),
  outOfStockReason: types.optional(OutOfStockReasonStore, {}),
  userUpgrade: types.optional(UserUpgradeStore, {}),
  purchasePath: types.optional(PurchasePathStore, {}),
  marketCompetition: types.optional(MarketCompetitionStore, {}),
  accountInfo: types.optional(AccountInfoStore, {}),
  roleManagement: types.optional(RoleManagementStore, {}),
  privilegeManagement: types.optional(PrivilegeManagementStore, {}),
  marketingSelection: types.optional(MarketingSelectionStore, {})

});

export default RootStore;