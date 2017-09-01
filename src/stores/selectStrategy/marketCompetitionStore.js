import { types } from "mobx-state-tree";
import { fetchData } from 'vic-common/lib/common/fetchConfig';
import Notification from '../../utils/notification';
import { toJS } from 'mobx'



const MarketCompetitionStore = types.model("MarketCompetitionStore", {
  currentTab: types.optional(types.number, ()=>1)
},
{
  /**
   * 品牌概况
   */
  brandSummaryData: null,
  /**
   * 省份销售额
   */
  mapData:null,
  /**
   * 省份销售排名
   */
  provinceRankData:null,
  cityRankData:null,
  /**
   * 城市销售额 - bar chart
   */
  cityBarData:null,
  /**
   * 品牌数据
   */
  brandData:null,
  /**
   * 品牌属性标签
   */
  brandTagData:null,
  /**
   * 品牌画像
   */
  brandPortraitData:null,

  compareBrandCount: null,
  compareMainBrandId:null,
  selectedTag: null
},
{
  getBrandSummaryData(params){
    return fetchData(
      `${__HOST}/marketCompetition/getBrandSummaryData`, 
      this.setBrandSummaryData, 
      params, 
      { method: 'get' })
      .catch((ex) => {
        Notification.error({ description: '获取品牌概况数据异常:' + ex, duration: null });
      });
  },
  setBrandSummaryData(result){
    if (result.success) {
      const data = result.data;
      this.brandSummaryData = data;
    } else {
      Notification.error({ description: '获取品牌概况数据异常:' + result.message, duration: null });
    }
  },
  getMapData(params){
    return fetchData(
      `${__HOST}/marketCompetition/getMapData`, 
      this.setMapData, 
      params, 
      { method: 'get' })
      .catch((ex) => {
        Notification.error({ description: '获取省份分析数据异常:' + ex, duration: null });
      });
  },
  setMapData(result){
    if (result.success) {
      const data = result.data;
      this.mapData = data;
    } else {
      Notification.error({ description: '获取省份分析数据异常:' + result.message, duration: null });
    }
  },
  getProvinceRankData(params){
    return fetchData(
      `${__HOST}/marketCompetition/getProvinceRankData`, 
      this.setProvinceRankData, 
      params, 
      { method: 'get' })
      .catch((ex) => {
        Notification.error({ description: '获取省份分析数据异常:' + ex, duration: null });
      });
  },
  setProvinceRankData(result){
    if (result.success) {
      const data = result.data;
      this.provinceRankData = data;
    } else {
      Notification.error({ description: '获取省份分析数据异常:' + result.message, duration: null });
    }
  },
  getCityBarData(params){
    return fetchData(
      `${__HOST}/marketCompetition/getCityBarData`, 
      this.setCityBarData, 
      params, 
      { method: 'get' })
      .catch((ex) => {
        Notification.error({ description: '获取城市级别数据异常:' + ex, duration: null });
      });
  },
  setCityBarData(result){
    if (result.success) {
      const data = result.data;
      this.cityBarData = data;
    } else {
      Notification.error({ description: '获取城市级别数据异常:' + result.message, duration: null });
    }
  },
  getCityRankData(params){
    return fetchData(
      `${__HOST}/marketCompetition/getCityRankData`, 
      this.setCityRankData, 
      params, 
      { method: 'get' })
      .catch((ex) => {
        Notification.error({ description: '获取城市级别数据异常:' + ex, duration: null });
      });
  },
  setCityRankData(result){
    if (result.success) {
      const data = result.data;
      this.cityRankData = data;
    } else {
      Notification.error({ description: '获取城市级别数据异常:' + result.message, duration: null });
    }
  },
  getBrandTagData(params){
    return fetchData(
      `${__HOST}/marketCompetition/getBrandTagData`, 
      this.setBrandTagData, 
      params, 
      { method: 'get' })
      .catch((ex) => {
        Notification.error({ description: '获取品牌属性标签数据异常:' + ex, duration: null });
      });
  },
  setBrandTagData(result){
    if (result.success) {
      const data = result.data;
      if(data){
        this.brandTagData = data.map((tag, i) => {
          if(i < 5){
            tag.checked = true;
          }else{
            tag.checked = false;
          }
          return tag;
        });
      }else{
        this.brandTagData = [];
      }
    } else {
      Notification.error({ description: '获取品牌属性标签数据异常:' + result.message, duration: null });
    }
  },
  checkBrandTag(tagId, checked){
    this.brandTagData[this.brandTagData.findIndex(tag=>tag.tagId == tagId)].checked = checked;
  },
  getBrandPortraitData(params){
    return fetchData(
      `${__HOST}/marketCompetition/getBrandPortraitData`, 
      this.setBrandPortraitData, 
      params, 
      { method: 'get' })
      .catch((ex) => {
        Notification.error({ description: '获取品牌画像数据异常:' + ex, duration: null });
      });
  },
  setBrandPortraitData(result){
    if (result.success) {
      const data = result.data;
      this.brandPortraitData = data;
    } else {
      Notification.error({ description: '获取品牌画像数据异常:' + result.message, duration: null });
    }
  },
  setCompareBrandCount(item){
    if(this.compareBrandCount){
      this.compareBrandCount.push(item);
    }else{
      this.compareBrandCount = [item];
    }
  },
  delCompareBrandCount(index){
    this.compareBrandCount.splice(index, 1);    
  },
  setCompareBrandValue(index, value){
    this.compareBrandCount[index].value = value;    
  },
  setCompareMainBrandId(id){
    this.compareMainBrandId = id;    
  },
  setSelectedTag(id){
    this.selectedTag = id;
  },
  getBrandData(params){
    return fetchData(
      `${__HOST}/marketCompetition/getBrandData`, 
      this.setBrandData, 
      params, 
      { method: 'get' })
      .catch((ex) => {
        Notification.error({ description: '获取品牌数据异常:' + ex, duration: null });
      });
  },
  setBrandData(result){
    if (result.success) {
      const data = result.data;
      this.brandData = data;
    } else {
      Notification.error({ description: '获取品牌数据异常:' + result.message, duration: null });
    }
  },
  setCurrentTab(index){
    this.currentTab = index;
  },
  afterCreate() {

  }
});

export default MarketCompetitionStore;