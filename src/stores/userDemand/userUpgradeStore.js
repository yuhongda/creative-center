import { types } from "mobx-state-tree";
import { fetchData } from 'vic-common/lib/common/fetchConfig';
import Notification from '../../utils/notification';



const UserUpgradeStore = types.model("UserUpgradeStore", {

},
{
  /**
   * 用户趋势
   * */
  userTrendsData:null,
  /**
   * 用户留存 
   * */
  userRetentionData:null,
  /**
   * 新客来源
   */
  userSourceData:null,
  /**
   * 留存用户行为
   */
  userBehaviorData:null,
  /**
   * 最受欢迎sku
   */
  hotSkuData:null,
  /**
   * 品类关联度
   */
  correlationData:null,
  /**
   * 关联用户偏好
   */
  coincidenceData: null,
  /**
   * 京东内销售排名
   */
  brandRankData:null,
  /**
   * 重合用户占比
   */
  userCoincidenceRates:null,

  selectedCategory:null,

  /**
   * 京东内销售排名
   */
  selectedBrandRows: null,
  selectedBrandItems: null,
  searchText: null,
  firstSelected: null
},
 {
  getUserTrendsData(params){
    return fetchData(
      `${__HOST}/userUpgrade/getUserTrendsData`, 
      this.setUserTrendsData, 
      params, 
      { method: 'get' })
      .catch((ex) => {
        Notification.error({ description: '获取用户趋势数据异常:' + ex, duration: null });
      });
  },
  setUserTrendsData(result){
    if (result.success) {
      const data = result.data;
      this.userTrendsData = data;
    } else {
      Notification.error({ description: '获取用户趋势数据异常:' + result.message, duration: null });
    }
  },
  getUserRetentionData(params){
    return fetchData(
      `${__HOST}/userUpgrade/getUserRetentionData`, 
      this.setUserRetentionData, 
      params, 
      { method: 'get' })
      .catch((ex) => {
        Notification.error({ description: '获取用户留存数据异常:' + ex, duration: null });
      });
  },
  setUserRetentionData(result){
    if (result.success) {
      const data = result.data;
      this.userRetentionData = data;
    } else {
      Notification.error({ description: '获取用户留存数据异常:' + result.message, duration: null });
    }
  },
  getUserSourceData(params){
    return fetchData(
      `${__HOST}/userUpgrade/getUserSourceData`, 
      this.setUserSourceData, 
      params, 
      { method: 'get' })
      .catch((ex) => {
        Notification.error({ description: '获取新客来源数据异常:' + ex, duration: null });
      });
  },
  setUserSourceData(result){
    if (result.success) {
      const data = result.data;
      this.userSourceData = data;
    } else {
      Notification.error({ description: '获取新客来源数据异常:' + result.message, duration: null });
    }
  },
  getUserBehaviorData(params){
    return fetchData(
      `${__HOST}/userUpgrade/getUserBehaviorData`, 
      this.setUserBehaviorData, 
      params, 
      { method: 'get' })
      .catch((ex) => {
        Notification.error({ description: '获取留存用户行为数据异常:' + ex, duration: null });
      });
  },
  setUserBehaviorData(result){
    if (result.success) {
      const data = result.data;
      this.userBehaviorData = data;
    } else {
      Notification.error({ description: '获取留存用户行为数据异常:' + result.message, duration: null });
    }
  },
  getHotSkuData(params){
    return fetchData(
      `${__HOST}/userUpgrade/getHotSkuData`, 
      this.setHotSkuData, 
      params, 
      { method: 'get' })
      .catch((ex) => {
        Notification.error({ description: '获取最受欢迎sku数据异常:' + ex, duration: null });
      });
  },
  setHotSkuData(result){
    if (result.success) {
      const data = result.data;
      this.hotSkuData = data;
    } else {
      Notification.error({ description: '获取最受欢迎sku数据异常:' + result.message, duration: null });
    }
  },
  getCorrelationData(params){
    return fetchData(
      `${__HOST}/userUpgrade/getCorrelationData`, 
      this.setCorrelationData, 
      params, 
      { method: 'get' })
      .catch((ex) => {
        Notification.error({ description: '获取品类关联度数据异常:' + ex, duration: null });
      });
  },
  setCorrelationData(result){
    if (result.success) {
      const data = result.data;
      this.correlationData = data;
    } else {
      Notification.error({ description: '获取品类关联度数据异常:' + result.message, duration: null });
    }
  },
  getCoincidenceData(params){
    return fetchData(
      `${__HOST}/userUpgrade/getCoincidenceData`, 
      this.setCoincidenceData, 
      params, 
      { method: 'get' })
      .catch((ex) => {
        Notification.error({ description: '获取关联用户偏好数据异常:' + ex, duration: null });
      });
  },
  setCoincidenceData(result){
    if (result.success) {
      const data = result.data;
      this.coincidenceData = data;
    } else {
      Notification.error({ description: '获取关联用户偏好数据异常:' + result.message, duration: null });
    }
  },
  getBrandRankData(params){
    return fetchData(
      `${__HOST}/userUpgrade/getBrandRankData`, 
      this.setBrandRankData, 
      params, 
      { method: 'get' })
      .catch((ex) => {
        Notification.error({ description: '获取京东内销售排名数据异常:' + ex, duration: null });
      });
  },
  setBrandRankData(result){
    if (result.success) {
      const data = result.data;
      this.brandRankData = data;
    } else {
      Notification.error({ description: '获取京东内销售排名数据异常:' + result.message, duration: null });
    }
  },
  getUserCoincidenceRates(params){
    return fetchData(
      `${__HOST}/userUpgrade/getUserCoincidenceRates`, 
      this.setUserCoincidenceRates, 
      params, 
      { method: 'get' })
      .catch((ex) => {
        Notification.error({ description: '获取重合用户占比数据异常:' + ex, duration: null });
      });
  },
  setUserCoincidenceRates(result){
    if (result.success) {
      const data = result.data;
      this.userCoincidenceRates = data.value;
    } else {
      Notification.error({ description: '获取重合用户占比数据异常:' + result.message, duration: null });
    }
  },
  setSelectedCategory(category){
    this.selectedCategory = category;
  },
  setSelectedBrandRows(rows){
    this.selectedBrandRows = rows;
  },
  setSelectedBrandItems(items){
    this.selectedBrandItems = items;
  },
  setSearchText(text){
    this.searchText = text;
  },
  setFirstSelected(id){
    this.firstSelected = id;
  },
  afterCreate() {

  }
});

export default UserUpgradeStore;