import { types } from "mobx-state-tree";
import { fetchData } from 'vic-common/lib/common/fetchConfig';
import Notification from '../../utils/notification';
import { toJS } from 'mobx';

const PurchasePathStore = types.model("PurchasePathStore", {
  
},
{
  /**
   * 流量趋势
   */
  userPathData:null,
  /**
   * 流量转化来源
   */
  userPathChart:null,
  userPathNumber:null,
  /**
   * 下载
   */
  download:null,
  /**
   * 爆款SKU
   */
  userPathTopSku:null,
  sortField: 'dataVol',
  /**
   * 热搜词转化
   */
  userPathTopSkuKeyword:null,
},
 {
  getUserPathData(params){
    return fetchData(
      `${__HOST}/purchasePath/getUserPathData`, 
      this.setUserPathData,
      params,
      { method: 'post' })
      .catch((ex) => {
        Notification.error({ description: '获取流量趋势接口异常:' + ex, duration: 4 });
      });
  },
  setUserPathData(result){
    if (result.success) {
      this.userPathData = result.data;
    } else {
      Notification.error({ description: '获取流量趋势数据异常:' + result.message, duration: 4 });
    }
  },
  getUserPathChartNumber(params){
    return fetchData(
      `${__HOST}/purchasePath/getUserPathChartNumber`, 
      this.setUserPathChartNumber,
      params,
      { method: 'post' })
      .catch((ex) => {
        Notification.error({ description: '获取流量转化来源接口异常:' + ex, duration: 4 });
      });
  },
  setUserPathChartNumber(result){
    if (result.success) {
      this.userPathChart = result.data.chart;
      this.userPathNumber = result.data.number;
    } else {
      Notification.error({ description: '获取流量转化来源数据异常:' + result.message, duration: 4 });
    }
  },
  getDownloadFile(params){
    return fetchData(
      `${__HOST}/purchasePath/getDownloadFile`, 
      this.setDownload,
      params,
      { method: 'post' })
      .catch((ex) => {
        Notification.error({ description: '获取下载接口异常:' + ex, duration: 4 });
      });
  },
  setDownload(result){
    if (result.success) {
      this.download = result.data;
    } else {
      Notification.error({ description: '获取下载数据异常:' + result.message, duration: 4 });
    }
  },
  getUserPathTopSku(params){
    return fetchData(
      `${__HOST}/purchasePath/getUserPathTopSku`, 
      this.setUserPathTopSku,
      params,
      { method: 'post' })
      .catch((ex) => {
        Notification.error({ description: '获取爆款SKU接口异常:' + ex, duration: 4 });
      });
  },
  setUserPathTopSku(result){
    if (result.success) {
      this.userPathTopSku = result.data.map((item)=>{
        item.subItem = item.subItem.filter((childItem)=>{
          if(childItem.channel != null){
            return childItem;
          }
        });
        return item;
      });
    } else {
      Notification.error({ description: '获取爆款SKU数据异常:' + result.message, duration: 4 });
    }
  },
  getUserPathTopSkuSearch(params){
    return fetchData(
      `${__HOST}/purchasePath/getUserPathTopSkuSearch`, 
      this.setUserPathTopSkuSearch,
      params,
      { method: 'post' })
      .catch((ex) => {
        Notification.error({ description: '获取爆款SKU搜索接口异常:' + ex, duration: 4 });
      });
  },
  setUserPathTopSkuSearch(result){
    if (result.success) {
      this.userPathTopSku = result.data;
    } else {
      Notification.error({ description: '获取爆款SKU搜索数据异常:' + result.message, duration: 4 });
    }
  },
  setSortField(sortField){
    this.sortField = sortField;
  },
  setUserPathTopSkuSearchResult(params){
    /* let val = [];
    this.userPathTopSku.forEach((item)=>{
      if(item.itemSkuId == skuID){
        val.push(item);
      }
    });
    this.userPathTopSku = val; */
    return fetchData(
      `${__HOST}/purchasePath/getUserPathTopSkuSearch`, 
      this.setUserPathTopSku,
      params,
      { method: 'post' })
      .catch((ex) => {
        Notification.error({ description: '获取爆款SKU搜索接口异常:' + ex, duration: 4 });
      });
  },
  getUserPathTopSkuKeyword(params){
    return fetchData(
      `${__HOST}/purchasePath/getUserPathTopSkuKeyword`, 
      this.setUserPathTopSkuKeyword,
      params,
      { method: 'post' })
      .catch((ex) => {
        Notification.error({ description: '获取热搜词转化接口异常:' + ex, duration: 4 });
      });
  },
  setUserPathTopSkuKeyword(result){
    if (result.success) {
      if(result.data.length == 0){
        return false;
      }
      const no1 = result.data[0].keyword_cnt;
      let arr = [[],[],[],[]];

      result.data.forEach((item, i)=>{
        item.precent = parseFloat((item.keyword_cnt / no1 * 100).toFixed(2));
        if(i >= 0 && i <=4){ arr[0].push(item); }
        if(i >= 5 && i <=9){ arr[1].push(item); }
        if(i >= 10 && i <=14){ arr[2].push(item); }
        if(i >= 15 && i <=19){ arr[3].push(item); }
      });

      this.userPathTopSkuKeyword = arr;
    } else {
      Notification.error({ description: '获取热搜词转化数据异常:' + result.message, duration: 4 });
    }
  },
});

export default PurchasePathStore;