import {types} from "mobx-state-tree";
import {fetchData} from 'vic-common/lib/common/fetchConfig';
import Notification from 'vic-common/lib/components/antd/notification';
import {toJS} from 'mobx';

const Summary = types.model("Summary", {
  noStockStopMoney: 0,
  noStockStopGrowth:0,
  pvMoney: 0,
  pvGrowth: 0,
  noSalesMoney: 0,
  noSalesGrowth:0,
  outOfStockMoney:0,
  outOfStockGrowth:0,
  unsalableMoney: 0,
  unsalableGrowth:0
}, {});

const StockWarningStore = types.model("StockWarningStore", {
  warningSummary: types.optional(Summary, () => {
    return {
      noStockStopMoney: 0,
      noStockStopGrowth:0,
      pvMoney: 0,
      pvGrowth: 0,
      noSalesMoney: 0,
      noSalesGrowth:0,
      outOfStockMoney:0,
      outOfStockGrowth:0,
      unsalableMoney: 0,
      unsalableGrowth:0
    }
  })
}, {
  stockPauseData: null,
  stockPauseListData: null,
  stockOutPVBarData: null,
  stockOutPVBarListData: null,
  stockOutPVPieData: null,
  stockOutPVPieListData: null,
  belowStockData: null,
  belowStockListData: null,
  stockOutData: null,
  stockOutListData: null,
  deadStockData: null,
  deadStockListData: null,

  stockPauseSeriesName: null,
  stockOutPVBarName: null,
  belowStockName: null,
  stockOutName: null,
  deadStockName: null,
  searchParams: null,

  stockPauseLength: null,
  stockPVDcId: null,
  stockOutDcId: null,
  deadStockDcId: null,
  value: null,
  days: 0,
  showItem: 1,
}, {
  setShowItem(value){
    this.showItem = value;
  },
  setValue(checkedValues){
    this.value = checkedValues;
  },
  setStockPauseLength(value) {
    this.stockPauseLength = value;
  },
  setStockOutDcId(value) {
    this.stockOutDcId = value;
  },
  setStockPVDcId(value) {
    this.stockPVDcId = value;
  },
  setDeadStockDcId(value) {
    this.stockOutDcId = value;
  },
  setSearchParams(value) {
     this.searchParams = value;
  },

  setStockPauseSeriesName(value) {
    this.stockPauseSeriesName = value;
  },

  setBelowStockName(value) {
    this.belowStockName = value;
  },

  setStockOutName(value) {
    this.stockOutName = value;
  },

  setDeadStockName(value) {
    this.deadStockName = value;
  },

  getWaringSummary(params) {
    return fetchData(`${__HOST}/stockWarning/getWaringSummary`,
      this.setWaringSummary,
      params,
      {method: 'get'}).catch((ex) => {
      Notification.error({
        description: '获取库存健康监控数据异常:' + ex,
        duration: null
      });
    });
  },
  setWaringSummary(result) {
    if (result.success) {
      const data = result.data;
      // this.warningSummary = data;
      this.warningSummary.noStockStopMoney = data.noStockStopMoney ? parseFloat((data.noStockStopMoney / 10000).toFixed(2)) : 0;
      this.warningSummary.noStockStopGrowth = data.noStockStopGrowth ? parseFloat((data.noStockStopGrowth * 100).toFixed(2)) : 0;
      this.warningSummary.pvMoney = data.pvMoney ? parseFloat((data.pvMoney * 100).toFixed(2)) : 0;
      this.warningSummary.pvGrowth = data.pvGrowth ? parseFloat((data.pvGrowth * 100).toFixed(2)) : 0;
      this.warningSummary.noSalesMoney = data.noSalesMoney ? parseFloat((data.noSalesMoney / 10000).toFixed(2)) : 0;
      this.warningSummary.noSalesGrowth = data.noSalesGrowth ? parseFloat((data.noSalesGrowth * 100).toFixed(2)) : 0;
      this.warningSummary.outOfStockMoney = data.outOfStockMoney ? parseFloat((data.outOfStockMoney * 100).toFixed(2)) : 0;
      this.warningSummary.outOfStockGrowth = data.outOfStockGrowth ? parseFloat((data.outOfStockGrowth * 100).toFixed(2)) : 0;
      this.warningSummary.unsalableMoney = data.unsalableMoney ? parseFloat((data.unsalableMoney * 100).toFixed(2)) : 0;
      this.warningSummary.unsalableGrowth = data.unsalableGrowth ? parseFloat((data.unsalableGrowth * 100).toFixed(2)) : 0;
    } else {
      Notification.error({
        description: '获取库存健康监控数据异常:' + result.message,
        duration: null
      });
    }
    this.value = ['noStock', 'PV', 'outOfStock','unsalable'];
  },
  //------------- Tbox1 -------------
  getStockPauseData(params) {
    return fetchData(`${__HOST}/stockWarning/getStockPauseData`,
      this.setStockPauseData,
      params,
      {method: 'get'}).catch((ex) => {
      Notification.error({
        description: '获取缺货暂停金额数据异常:' + ex,
        duration: null
      });
    });
  },
  setStockPauseData(result) {
    if (result.success) {
      const data = result.data;
      if(data.length>0) {
        this.stockPauseData = data;
        this.stockPauseSeriesName = data[0][0];
        this.stockPauseLength = data[3][0];
      } else {
        this.stockPauseData = [['4天以内', '4-7天以内', '7-30天', '31天以上'],[],[],[]];
        this.stockPauseSeriesName = '';
      }
    } else {
      Notification.error({
        description: '获取缺货暂停金额数据异常:' + result.message,
        duration: null
      });
    }
  },
  getStockPauseListData(params) {
    return fetchData(`${__HOST}/stockWarning/getStockPauseListData`,
      this.setStockPauseListData,
      params,
      {method: 'get'}).catch((ex) => {
      Notification.error({
        description: '获取缺货暂停金额列表数据异常:' + ex,
        duration: null
      });
    });
  },
  setStockPauseListData(result) {
    if (result.success) {
      const data = result.data;
      this.stockPauseListData = data;
    } else {
      Notification.error({
        description: '获取缺货暂停金额列表数据异常:' + result.message,
        duration: null
      });
    }
  },
  //------------- Tbox2 -------------
  setStockOutPVBarName(value) {
     this.stockOutPVBarName = value;
  },
  getStockOutPVBarData(params) {
    return fetchData(`${__HOST}/stockWarning/getStockOutPVBarData`,
      this.setStockOutPVBarData,
      params,
      {method: 'get'}).catch((ex) => {
      Notification.error({
        description: '获取无货PV数据异常:' + ex,
        duration: null
      });
    });
  },
  setStockOutPVBarData(result) {
    if (result.success) {
      const data = result.data;
      if(data.length>0) {
        this.stockOutPVBarData = data;
        this.stockOutPVBarName = data[2][0];
        this.stockPVDcId = data [3][0]
      } else {
        this.stockOutPVBarData = [[],[],[],[]]
        this.stockOutPVBarName = '';
      }
    } else {
      Notification.error({
        description: '获取无货PV数据异常:' + result.message,
        duration: null
      });
    }
  },
  getStockOutPVBarListData(params) {
    return fetchData(`${__HOST}/stockWarning/getStockOutPVBarListData`,
      this.setStockOutPVBarListData,
      params,
      {method: 'get'}).catch((ex) => {
      Notification.error({
        description: '获取无货PV列表数据异常:' + ex,
        duration: null
      });
    });
  },
  setStockOutPVBarListData(result) {
    if (result.success) {
      const data = result.data;
      this.stockOutPVBarListData = data;
    } else {
      Notification.error({
        description: '获取无货PV列表数据异常:' + result.message,
        duration: null
      });
    }
  },
  //------------ Pie ------------
  getStockOutPVPieData(params) {
    return fetchData(`${__HOST}/stockWarning/getStockOutPVPieData`,
      this.setStockOutPVPieData,
      params,
      {method: 'get'}).catch((ex) => {
      Notification.error({
        description: '获取无货PV数据异常:' + ex,
        duration: null
      });
    });
  },
  setStockOutPVPieData(result) {
    if (result.success) {
      const data = result.data;
      this.stockOutPVPieData = data;
    } else {
      Notification.error({
        description: '获取无货PV数据异常:' + result.message,
        duration: null
      });
    }
  },
  getStockOutPVPieListData(params) {
    return fetchData(`${__HOST}/stockWarning/getStockOutPVPieListData`,
      this.setStockOutPVPieListData,
      params,
      {method: 'get'}).catch((ex) => {
      Notification.error({
        description: '获取无货PV列表数据异常:' + ex,
        duration: null
      });
    });
  },
  setStockOutPVPieListData(result) {
    if (result.success) {
      const data = result.data;
      this.stockOutPVPieListData = data;
    } else {
      Notification.error({
        description: '获取无货PV列表数据异常:' + result.message,
        duration: null
      });
    }
  },

  //------------- Tbox3 -------------
  getBelowStockData(params) {
    return fetchData(`${__HOST}/stockWarning/getBelowStockData`,
      this.setBelowStockData,
      params,
      {method: 'get'}).catch((ex) => {
      Notification.error({
        description: '获取下柜库存金额数据异常:' + ex,
        duration: null
      });
    });
  },
  setBelowStockData(result) {
    if (result.success) {
      const data = result.data;
      if(data.length>0) {
        this.belowStockData = data;
        this.belowStockName = data[0][0];
       } else {
        this.belowStockData = [[],[]];
        this.belowStockName = '';
      }
    } else {
      Notification.error({
        description: '获取下柜库存金额数据异常:' + result.message,
        duration: null
      });
    }
  },
  getBelowStockListData(params) {
    return fetchData(`${__HOST}/stockWarning/getBelowStockListData`,
      this.setBelowStockListData,
      params,
      {method: 'get'}).catch((ex) => {
      Notification.error({
        description: '获取下柜库存金额列表数据异常:' + ex,
        duration: null
      });
    });
  },
  setBelowStockListData(result) {
    if (result.success) {
      const data = result.data;
      this.belowStockListData = data;
    } else {
      Notification.error({
        description: '获取下柜库存金额列表数据异常:' + result.message,
        duration: null
      });
    }
  },
  //------------- Tbox4 -------------
  getStockOutData(params) {
    return fetchData(`${__HOST}/stockWarning/getStockOutData`,
      this.setStockOutData,
      params,
      {method: 'get'}).catch((ex) => {
      Notification.error({
        description: '获取库存缺货数据异常:' + ex,
        duration: null
      });
    });
  },
  setStockOutData(result) {
    if (result.success) {
      const data = result.data;
      if(data.length>0) {
        this.stockOutData = data;
        this.stockOutName = data[2][0];
        this.stockOutDcId = data[3][0];
      } else {
        this.stockOutData = [[],[],[],[]];
        this.stockOutName = '';
      }
    } else {
      Notification.error({
        description: '获取库存缺货数据异常:' + result.message,
        duration: null
      });
    }
  },
  getStockOutListData(params) {
    return fetchData(`${__HOST}/stockWarning/getStockOutListData`,
      this.setStockOutListData,
      params,
      {method: 'get'}).catch((ex) => {
      Notification.error({
        description: '获取库存缺货列表数据异常:' + ex,
        duration: null
      });
    });
  },
  setStockOutListData(result) {
    if (result.success) {
      const data = result.data;
      this.stockOutListData = data;
    } else {
      Notification.error({
        description: '获取库存缺货列表数据异常:' + result.message,
        duration: null
      });
    }
  },
  //------------- Tbox5 -------------
  getDeadStockData(params) {
    return fetchData(`${__HOST}/stockWarning/getDeadStockData`,
      this.setDeadStockData,
      params,
      {method: 'get'}).catch((ex) => {
      Notification.error({
        description: '获取滞销商品数据异常:' + ex,
        duration: null
      });
    });
  },
  setDeadStockData(result) {
    if (result.success) {
      const data = result.data;
      if(data.length>0) {
        this.deadStockData = data;
        this.deadStockName = data[0][0];
        this.deadStockDcId = data[2][0];
      } else {
        this.deadStockData = [[],[],[]];
        this.deadStockName ='';
      }
    } else {
      Notification.error({
        description: '获取滞销商品数据异常:' + result.message,
        duration: null
      });
    }
  },
  getDeadStockListData(params) {
    return fetchData(`${__HOST}/stockWarning/getDeadStockListData`,
      this.setDeadStockListData,
      params,
      {method: 'get'}).catch((ex) => {
      Notification.error({
        description: '获取滞销商品列表数据异常:' + ex,
        duration: null
      });
    });
  },
  setDeadStockListData(result) {
    if (result.success) {
      const data = result.data;
      this.deadStockListData = data;
      this.days = data[0] ? data[0].days : 0;
    } else {
      Notification.error({
        description: '获取滞销商品列表数据异常:' + result.message,
        duration: null
      });
    }
  },
  afterCreate() {}
});

export default StockWarningStore;
