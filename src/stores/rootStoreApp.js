import { types } from "mobx-state-tree";
import { CommonStore } from "./commonStore";
import HeaderStore from "./headerStore";
import BusinessDashboardStore from "./salesDiagnosis/businessDashboardStore";
import ConditionStore from "./conditionStore";
import ConditionStockStore from "./conditionStockStore";
import PurchasePathStore from "./userDemand/purchasePathStore";
import StockMarketingStore from "./stockManagement/stockMarketingStore";

const RootStore = types.model("RootStore", {
  common: types.optional(CommonStore, {
    userinfo: {
      username: 'Silver'
    }
  }),

  header: types.optional(HeaderStore, {
    current: 1
  }),

  conditions: types.optional(ConditionStore, {}),
  conditionsStock: types.optional(ConditionStockStore, {}),
  businessDashboard: types.optional(BusinessDashboardStore, {}),
  purchasePath: types.optional(PurchasePathStore, {}),
  stockMarketing: types.optional(StockMarketingStore, {})
});

export default RootStore;
