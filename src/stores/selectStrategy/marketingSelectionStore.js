import { types } from "mobx-state-tree";
import { fetchData } from 'vic-common/lib/common/fetchConfig';
import Notification from '../../utils/notification';
import { toJS } from 'mobx'



const MarketingSelectionStore = types.model("MarketingSelectionStore", {
  
},
{
  /**
   * 商品定位
   */
  bandPieData: null,

  /**
   * band 商品角色
   */
  bandProductRoleData: null,

  /**
   * 商品画像List
   */
  productPortraitList:null,
  /**
   * 1:日常爆品；2:日常流量品；3:长尾商品
   */
  listType:'1'
},
{
  getBandPieData(params){
    return fetchData(
      `${__HOST}/marketingSelection/getBandPieData`, 
      this.setBandPieData, 
      params, 
      { method: 'get' })
      .catch((ex) => {
        Notification.error({ description: '获取商品定位数据异常:' + ex, duration: null });
      });
  },
  setBandPieData(result){
    if (result.success) {
      const data = result.data;
      this.bandPieData = data;
    } else {
      Notification.error({ description: '获取商品定位数据异常:' + result.message, duration: null });
    }
  },
  getBandProductRoleData(params){
    return fetchData(
      `${__HOST}/marketingSelection/getBandProductRoleData`, 
      this.setBandProductRoleData, 
      params, 
      { method: 'get' })
      .catch((ex) => {
        Notification.error({ description: '获取band商品角色数据异常:' + ex, duration: null });
      });
  },
  setBandProductRoleData(result){
    if (result.success) {
      const data = result.data;
      if(data){
        data.uvConvertAvg = parseFloat((data.uvConvertAvg * 100).toFixed(2));
        data.list = data.list.map(item=>{
          item[0] = parseFloat((item[0] * 100).toFixed(2));
          return item;
        });
        this.bandProductRoleData = data;
      }
    } else {
      Notification.error({ description: '获取band商品角色数据异常:' + result.message, duration: null });
    }
  },
  getProductPortraitList(params){
    return fetchData(
      `${__HOST}/marketingSelection/getProductPortraitList`, 
      this.setProductPortraitList, 
      params, 
      { method: 'get' })
      .catch((ex) => {
        Notification.error({ description: '获取商品画像列表数据异常:' + ex, duration: null });
      });
  },
  setProductPortraitList(result){
    if (result.success) {
      const data = result.data;
      this.productPortraitList = data;
    } else {
      Notification.error({ description: '获取商品画像列表数据异常:' + result.message, duration: null });
    }
  },
  setListType(value){
    this.listType = value;
  },
  afterCreate() {

  }
});

export default MarketingSelectionStore;