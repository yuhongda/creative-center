import { types } from "mobx-state-tree";
import { fetchData } from 'vic-common/lib/common/fetchConfig';
import Notification from '../../utils/notification';

const OrderFillRateMonitorStore = types.model("OrderFillRateMonitorStore", {
  
},
{
  /**
   * 新订单
   */
  newOrderData:null,
  /**
   * 订单完成
   */
  completeOrder: null,
  orderList: null,
  value: null,
  /**
   * 平均完成周期
   */
  completeAverageCycle:null,
},
 {
  getNewOrderData(params){
    return fetchData(
      `${__HOST}/orderFillRateMonitor/getOrderFillRateMonitorData`, 
      this.setOrderData, 
      params,
      { method: 'post' })
      .catch((ex) => {
        Notification.error({ description: '获取新订单数据接口异常:' + ex, duration: 4 });
      });
  },
  setOrderData(result){
    if (result.success) {
      const data = result.data;
      this.newOrderData = data.newOrder.filter((item)=>{
        if(item.type < 5){
          return item;
        }
      });
      this.completeOrder = data.completeOrder;
      this.value = data.completeOrder.length > 0 ? ['completePurchaseOrderCount', 'completePurchaseSum', 'orderFillRate', 'completeAverageCycle'] : [];
      this.completeAverageCycle = data.completeAverageCycle.filter((item)=>{
        if(item.cityName != null){
          let result = 0;
        
          if(item.date1 != null) { item.date1 = parseFloat(item.date1.toFixed(1)); result += item.date1;}
          if(item.date2 != null) { item.date2 = parseFloat(item.date2.toFixed(1)); result += item.date2;}
          if(item.date3 != null) { item.date3 = parseFloat(item.date3.toFixed(1)); result += item.date3;}
          item.total = result.toFixed(1);
          
          return item;
        }
      });
    } else {
      Notification.error({ description: '获取新订单数据异常:' + result.message, duration: 4 });
    }
  },
  setValue(checkedValues){
    this.value = checkedValues;
  },
  setOrderList(checkedValues){
    let result = [];
    checkedValues.forEach((item)=>{
      this.completeOrder.forEach((subItem)=>{
        if(subItem.id == item){
          result.push({ name: subItem.name, value: subItem.value != null ? subItem.value : '-' , id: subItem.id });
        }
      });
    });
  
    this.orderList = result;
  },
  getTotalDate(name,type){
    let result = 0;
    this.completeAverageCycle.forEach((item)=>{
      if(item.cityName == name){
        result = item.total;
      }
    });
    return result;
  },
  getTotalDate2(type, name){
    let result = [];

    if(name){
      this.completeAverageCycle.forEach((item)=>{
        let total = 0;
        if(item.cityName == name){
          if(item.date1 != null && type[0]) { total += item.date1;}
          if(item.date2 != null && type[1]) { total += item.date2;}
          if(item.date3 != null && type[2]) { total += item.date3;}
          result = total ? total.toFixed(1) : '-';
          return ;
        }
      });
    }else{
      this.completeAverageCycle.forEach((item)=>{
        let val = 0;
        if(item.date1 != null && type[0]) { val += item.date1 > 0 ? item.date1 : 0;}
        if(item.date2 != null && type[1]) { val += item.date2 > 0 ? item.date2 : 0;}
        if(item.date3 != null && type[2]) { val += item.date3 > 0 ? item.date3 : 0;}
        result.push(val.toFixed(1));
      });
    }
    return result;
  }
});

export default OrderFillRateMonitorStore;