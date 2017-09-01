import {types} from "mobx-state-tree";
import {fetchData} from 'vic-common/lib/common/fetchConfig';
import Notification from '../../utils/notification';

const OutOfStockReasonStore = types.model("OutOfStockReasonStore", {}, {
  outOfStockReasons: null,

  outOfStockReasonList: null,
  outOfStockReasonListCount: null,
  outOfStockReasonCurrentPage: 1,

  purchasePlanList: null,


  searchParams: null,
  page: 1,
  pageSize: 10,
}, {
  getOutOfStockReasonList(params) {
    return fetchData(
      `${__HOST}/outOfStockReason/getOutOfStockReasonList`,
      this.setOutOfStockReasonList,
      params,
      { method: 'get' })
      .catch((ex) => {
        Notification.error({ description: '获取缺货列表数据异常:' + ex, duration: null });
      });
  },
  setOutOfStockReasonList(result) {
    if (result.success) {
      const data = result.data;
      //console.log('getOutOfStockReasonList', result.data, result.total);
      //进行多个SKU查询时，若个别SKU无数据，则进行提示
      //判定条件为：result.message返回不为空
      if(result.message) {
        Notification.error({
          description: result.message,
          duration: null
        })
      }
      if(data instanceof Array) {
        this.outOfStockReasonList = data.map((item) => {
          const {oosReason} = item;
          if (typeof oosReason === 'number') {
            item.oosReason = '' + oosReason;
          }
          return item;
        });
        this.outOfStockReasonListCount = result.total;
      }else{
        this.outOfStockReasonList = [];
        this.outOfStockReasonListCount = 0;
      }
    } else {
      this.outOfStockReasonList = null;
      this.outOfStockReasonListCount = null;
      Notification.error({
        description: '获取缺货列表数据异常:' + result.message,
        duration: null
      });
    }
  },
  setOutOfStockReasonIdBatch(keys, reasonId) {
    if(!keys || !(keys instanceof Array) || typeof reasonId !== 'string' || !this.outOfStockReasonList) {
      return false;
    }
    //key: dcCode-skuId
    this.outOfStockReasonList.forEach((item) => {
      if(keys.indexOf(`${item.dcCode}-${item.skuId}`) >= 0) {
        item.oosReason = reasonId;
      }
    });
  },
  setOutOfStockReasonIdByKey(keyObj, reasonId) {
    const {dcCode, skuId} = keyObj;
    if(!dcCode || !skuId || typeof reasonId !== 'string' || !this.outOfStockReasonList) {
      return false;
    }
    for(let o of this.outOfStockReasonList) {
      if(o.dcCode === dcCode && o.skuId === skuId) {
        o.oosReason = reasonId;
        break;
      }
    }
  },
  setOutOfStockReasonRemarkByKey(keyObj, remark) {
    const {dcCode, skuId} = keyObj;
    if(!dcCode || !skuId || typeof remark !== 'string' || !this.outOfStockReasonList) {
      return false;
    }
    for(let o of this.outOfStockReasonList) {
      if(o.dcCode === dcCode && o.skuId === skuId) {
        o.remark = remark;
        break;
      }
    }
  },
  getPurchasePlanList(params) {
    return fetchData(
      `${__HOST}/outOfStockReason/getPurchasePlanList`,
      this.setPurchasePlanList,
      params,
      { method: 'get' })
      .catch((ex) => {
        Notification.error({ description: '获取采购在途数据异常:' + ex, duration: null });
      });
  },
  setPurchasePlanList(result) {
    if (result.success) {
      const data = result.data;
      //console.log('getPurchasePlanList', result.data, result.total);
      this.purchasePlanList = data instanceof Array ? data : null;
    } else {
      this.purchasePlanList = null;
      Notification.error({
        description: '获取采购在途数据异常:' + result.message,
        duration: null
      });
    }
  },
  clearPurchasePlanList() {
    this.purchasePlanList = [];
  },
  getOutOfStockReasons(params) {
    return fetchData(
      `${__HOST}/outOfStockReason/getOutOfStockReasons`,
      this.setOutOfStockReasons,
      params,
      { method: 'get' })
      .catch((ex) => {
        Notification.error({ description: '获取缺货原因数据异常:' + ex, duration: null });
      });
  },
  setOutOfStockReasons(result) {
    if (result.success && (result.data instanceof Array)) {
      const data = result.data;
      //console.log('getOutOfStockReasons', result.data, result.total);
      this.outOfStockReasons = data.map((item) => {
        item.code = item.code + '';
        return item;
      });
    } else {
      this.outOfStockReasons = null;
      Notification.error({
        description: '获取缺货原因数据异常:' + result.message,
        duration: null
      });
    }
  },
  saveOutOfStockReason() {
    return fetchData(
      `${__HOST}/outOfStockReason/saveOutOfStockReason`,
      result => {
        if (result.success) {
          Notification.success({ message: '提示：', description: '保存成功', duration: 1.5 });
        } else {
          let desc = result.message ? `：${result.message}` : '';
          Notification.error({ message: '提示：', description: `保存失败${desc}`, duration: 1.5 });
        }
      },
      this.outOfStockReasonList,
      { method: 'post' })
      .catch((ex) => {
        Notification.error({ description: '保存缺货原因异常:' + ex, duration: null });
      });
  },
  setSearchParams(value) {
    this.searchParams = value
  },
  setOutOfStockReasonCurrentPage(value) {
    this.outOfStockReasonCurrentPage = value;
  }
});

export default OutOfStockReasonStore;
