import {types} from "mobx-state-tree";
import {fetchData} from 'vic-common/lib/common/fetchConfig';
import Notification from '../../utils/notification';

const SubdivisionMarketStore = types.model("SubdivisionMarketStore", {}, {
  businessData: null,
  salesData:null,
  amountData:null,
  uvGrowthData:null,
  uvConvertData:null,
  userGrowthData:null,
  unitPriceData:null,
  competeData: null,
  topTen:null,
  topThirty:null,
  userFeatureData: null,
  searchParams: null,
  tagsData: null,
  currentTag: null,
  marketData:null,
  categoryData:null,

  value: null,

}, {
  setSearchParams(value) {
    this.searchParams = value;
  },
  getBusinessData(params) {
    return fetchData(`${__HOST}/subdivisionMarket/getBusinessData`,
      this.setBusinessData,
      params,
      {method: 'get'}).catch((ex) => {
      Notification.error({
        description: '获取细分市场生意评估数据异常:' + ex,
        duration: 1
      });
    });
  },
  setBusinessData(result) {
    if (result.success) {
      const data = result.data;
      this.businessData = data;
      this.salesData = data.salesData;
      this.amountData = data.amountData;
      this.uvGrowthData = data.uvGrowthData;
      this.uvConvertData = data.uvConvertData;
      this.userGrowthData = data.userGrowthData;
      this.unitPriceData = data.unitPriceData;
    } else {
      Notification.error({
        description: '获取细分市场生意评估数据异常:' + result.message,
        duration: 1
      });
    }
  },
  getCompeteData(params) {
    return fetchData(`${__HOST}/subdivisionMarket/getCompeteData`,
      this.setCompeteData,
      params,
      {method: 'get'}).catch((ex) => {
      Notification.error({
        description: '获取细分市场竞争评估数据异常:' + ex,
        duration: 1
      });
    });
  },
  setCompeteData(result) {
    if (result.success) {
      const data = result.data;
      this.competeData = data;
      this.topTen = data.topTen;
      this.topThirty = data.topThirty;
    } else {
      Notification.error({
        description: '获取细分市场竞争评估数据异常:' + result.message,
        duration: 1
      });
    }
  },
  //
  getUserFeatureData(params) {
    return fetchData(`${__HOST}/subdivisionMarket/getUserFeatureData`,
      this.setUserFeatureData,
      params,
      {method: 'get'}).catch((ex) => {
      Notification.error({
        description: '获取细分市场用户特征数据异常:' + ex,
        duration: 1
      });
    });
  },
  setUserFeatureData(result) {
    if (result.success) {
      const data = result.data;
      this.userFeatureData = data;
      this.tagsData = data.tagsData;
      this.marketData = data.marketData;
      this.categoryData = data.categoryData;
      // this.value = ['sex', 'age'];
      this.currentTag = data.tagsData[0] ? this.tagsData[0] : '';
    } else {
      Notification.error({
        description: '获取细分市场用户特征数据异常:' + result.message,
        duration: 1
      });
    }
  },
  setCurrentTag(value) {
    this.currentTag = value;
  },
  setValue(checkedValues){
    this.value = checkedValues;
  },
});

export default SubdivisionMarketStore;
