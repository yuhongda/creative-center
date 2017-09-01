import { types, getParent } from "mobx-state-tree";
import { fetchData } from 'vic-common/lib/common/fetchConfig';
import Notification from '../../utils/notification';
import moment from 'moment';
import { toJS } from 'mobx';
import nj from 'nornj';

const CompeteItem = types.model("CompeteItem", {
  sku: '',
  wareName: '',
  sourceId: '',
  sourceName: '',
  get parentStore() {
    return getParent(getParent(this));
  }
}, {
  parentSku: null
}, {
  afterCreate() {
    this.parentSku = this.parentStore.sku;
  },
});

const SkuItem = types.model("SkuItem", {
  sku: '',
  wareName: '',
  competeList: types.optional(types.array(CompeteItem), []),
  expanded: false,
  competeSelectedKeys: types.optional(types.array(types.string), []),
  get parentStore() {
    return getParent(getParent(this));
  }
}, {
  setExpanded(expanded) {
    //先关闭其他所有展开的skuItem
    expanded && this.parentStore.contrastRelationData.forEach(item => {
      item.expanded = false;
    });

    this.expanded = expanded;
  },
  setCompeteSelectedKeys(selectedKeys) {
    this.competeSelectedKeys = selectedKeys.filter(key => {
      if (this.competeSelectedKeys.find(k => k == key) == null) {
        return true;
      }
    });
  }
});

const CompetitivePriceModelStore = types.model("CompetitivePriceModelStore", {
  contrastRelationData: types.optional(types.array(SkuItem), []),
  wareName: '',
  selectedDate: moment().format("YYYY-MM-DD")
}, {
  promotionData: null,
  trendAnalysisData: null,
  competeWareInfo: null
}, {
  afterCreate() {
    this.trendAnalysisData = [];
  },

  setSelectedDate(date) {
    this.selectedDate = date;
  },

  getParams(params = {}) {
    let sku,
      friendsSku,
      sourceId,
      sourceName;

    this.contrastRelationData.every(skuItem => {
      if (skuItem.expanded) {
        sku = skuItem.sku;
        if (skuItem.competeSelectedKeys.length) {
          skuItem.competeList.every(competeItem => {
            if ((competeItem.sku + '_' + competeItem.sourceId) == skuItem.competeSelectedKeys[0]) {
              friendsSku = competeItem.sku;
              sourceId = competeItem.sourceId;
              sourceName = competeItem.sourceName;
              return false;
            }
            return true;
          });
        }
        return false;
      }
      return true;
    });

    return Object.assign({
      sku,
      friendsSku,
      sourceId,
      sourceName
    }, params);
  },

  getContrastRelationData() {
    return fetchData(`${__HOST}/competitivePriceModel/getContrastRelationData`, this.setContrastRelationData, null, { method: 'post' }).catch((ex) => {
      Notification.error({ description: '获取对照关系数据异常:' + ex, duration: null });
    });
  },
  setContrastRelationData(result) {
    if (result.success) {
      this.contrastRelationData = result.data ? result.data.map((skuItem, i) => {
        if (i == 0) {
          skuItem.expanded = true;
          skuItem.competeList && skuItem.competeList.forEach((competeItem, j) => {
            if (j == 0) {
              skuItem.competeSelectedKeys = [competeItem.sku + '_' + competeItem.sourceId];
            }
          });
        }
        return skuItem;
      }) : [];
    } else {
      Notification.error({ description: '获取对照关系数据错误:' + result.message, duration: null });
    }
  },

  getPromotionData(date) {
    return fetchData(`${__HOST}/competitivePriceModel/getPromotionData`, this.setPromotionData, this.getParams({ date }), { method: 'post' }).catch((ex) => {
      Notification.error({ description: '获取促销数据异常:' + ex, duration: null });
    });
  },
  setPromotionData(result) {
    if (result.success) {
      this.promotionData = result.data;
    } else {
      Notification.error({ description: '获取促销数据错误:' + result.message, duration: null });
    }
  },

  getTrendAnalysisData() {
    return fetchData(`${__HOST}/competitivePriceModel/getTrendAnalysisData`, this.setTrendAnalysisData, this.getParams(), { method: 'post' }).catch((ex) => {
      Notification.error({ description: '获取趋势分析数据异常:' + ex, duration: null });
    });
  },
  setTrendAnalysisData(result) {
    if (result.success) {
      this.trendAnalysisData = result.data;
    } else {
      Notification.error({ description: '获取趋势分析数据错误:' + result.message, duration: null });
    }
  },
  reactChartData() {
    this.trendAnalysisData = [];
    this.promotionData = [];
  },

  deleteWare(sku) {
    return fetchData(`${__HOST}/competitivePriceModel/deleteWare`, result => {
      if (result.success) {
        return true;
      } else {
        Notification.error({ description: '删除自营商品错误:' + result.message, duration: null });
        return false;
      }
    }, { sku }, { method: 'post' }).catch((ex) => {
      Notification.error({ description: '删除自营商品异常:' + ex, duration: null });
    });
  },

  deleteCompeteWare(params) {
    return fetchData(`${__HOST}/competitivePriceModel/deleteCompeteWare`, result => {
      if (result.success) {
        return true;
      } else {
        Notification.error({ description: '删除友商商品错误:' + result.message, duration: null });
        return false;
      }
    }, params, { method: 'post' }).catch((ex) => {
      Notification.error({ description: '删除友商商品异常:' + ex, duration: null });
    });
  },

  getWareName(sku) {
    return fetchData(`${__HOST}/competitivePriceModel/getWareName`, this.setWareName, { sku }, { method: 'post' }).catch((ex) => {
      Notification.error({ description: '获取自营商品名称异常:' + ex, duration: null });
    });
  },
  setWareName(result) {
    if (result.success) {
      this.wareName = result.data;
    } else {
      Notification.error({ description: '获取自营商品名称错误:' + result.message, duration: null });
    }
    return result.data;
  },

  getCompeteWareInfo(sku, competeSku) {
    return fetchData(`${__HOST}/competitivePriceModel/getCompeteWareInfo`, this.setCompeteWareInfo, { sku, competeSku }, { method: 'post' }).catch((ex) => {
      Notification.error({ description: '获取竞争商品信息异常:' + ex, duration: null });
    });
  },
  setCompeteWareInfo(result) {
    if (result.success) {
      this.competeWareInfo = result.data;
    } else {
      Notification.error({ description: '获取竞争商品信息错误:' + result.message, duration: null });
    }
    return result.data;
  },

  addCompeteWare(params) {
    return fetchData(`${__HOST}/competitivePriceModel/addCompeteWare`, result => {
      if (result.success) {
        return true;
      } else {
        Notification.error({ description: '添加友商商品错误:' + result.message, duration: null });
        return false;
      }
    }, params, { method: 'post' }).catch((ex) => {
      Notification.error({ description: '添加友商商品异常:' + ex, duration: null });
    });
  },

  setWareNameValue(v) {
    this.wareName = v;
  },

  setCompeteWareInfoValue(v) {
    this.competeWareInfo = v;
  },

  hasData() {
    let hasData = false;
    this.contrastRelationData && this.contrastRelationData.forEach(skuItem => {
      if(skuItem.competeSelectedKeys.length) {
        hasData = true;
      }
    });

    return hasData;
  }
});

export default CompetitivePriceModelStore;