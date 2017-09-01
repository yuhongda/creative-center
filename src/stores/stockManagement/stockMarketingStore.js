import { types } from "mobx-state-tree";
import { fetchData } from 'vic-common/lib/common/fetchConfig';
import Notification from '../../utils/notification';
import { toJS } from 'mobx'
import Cookies from 'universal-cookie';
const cookies = new Cookies();

const Summary = types.model("Summary", {
  stockMoney:0,
  stockMoneyGrowth:0,
  pvRates:0,
  pvRatesGrowth:0,
  inStockRates:0,
  inStockRatesGrowth:0,
  inStockRatesBig:0,
  inStockRatesGrowthBig:0,
  transferDays:0,
  transferDaysGrowth:0,
  bigSales:0,
  bigSalesGrowth:0,
  bigSalesBig:0,
  bigSalesGrowthBig:0,
  unsales:0,
  unsalesGrowth:0
}, {
  
});


const StockMarketingStore = types.model("StockMarketingStore", {
  /**
   * 顶部数据看版
   */
  summaryData:types.optional(Summary, () => {
    return {
      stockMoney:0,
      stockMoneyGrowth:0,
      pvRates:0,
      pvRatesGrowth:0,
      inStockRates:0,
      inStockRatesGrowth:0,
      inStockRatesBig:0,
      inStockRatesGrowthBig:0,
      transferDays:0,
      transferDaysGrowth:0,
      bigSales:0,
      bigSalesGrowth:0,
      bigSalesBig:0,
      bigSalesGrowthBig:0,
      unsales:0,
      unsalesGrowth:0
    }
  }),
  filterSmallObject:types.optional(types.boolean, () => true)
},
{
  tabItems:null,

  /**
   * map区域详情数据
   */
  mapDataStockMoney:null,
  mapDataPV:null,
  mapDataInStock:null,
  mapDataInStockBig:null,
  mapDataTransferDays:null,
  mapDataBigSales:null,
  mapDataBigSalesBig:null,
  mapDataUnsales:null,

  /**
   * 一级品类详情数据
   */
  l1DataStockMoney:null,
  l1DataPV:null,
  l1DataInStock:null,
  l1DataInStockBig:null,
  l1DataTransferDays:null,
  l1DataBigSales:null,
  l1DataBigSalesBig:null,
  l1DataUnsales:null,

  /**
   * band详情数据
   */
  bandDataStockMoney:null,
  bandDataPV:null,
  bandDataInStock:null,
  bandDataInStockBig:null,
  bandDataTransferDays:null,
  bandDataBigSales:null,
  bandDataBigSalesBig:null,
  bandDataUnsales:null,

  /**
   * 整体趋势数据
   */
  trendsDataStockMoney:null,
  trendsDataPV:null,
  trendsDataInStock:null,
  trendsDataInStockBig:null,
  trendsDataTransferDays:null,
  trendsDataBigSales:null,
  trendsDataBigSalesBig:null,
  trendsDataUnsales:null,


  /**
   * table data
   */
  tableDataStockMoney:null,
  tableDataPV:null,
  tableDataInStock:null,
  tableDataInStockBig:null,
  tableDataTransferDays:null,
  tableDataBigSales:null,
  tableDataBigSalesBig:null,
  tableDataUnsales:null,

  /**
   * 目标设置
   */
  targetDataPV:null,
  targetDataInStock:null,
  targetDataInStockBig:null,
  targetDataTransferDays:null,
  targetDataBigSales:null,
  targetDataBigSalesBig:null,
  targetDataUnsales:null
},
 {
  setTabItems(tabs){
    this.tabItems = tabs;
      cookies.set('CC_TabItems', JSON.stringify(toJS(this.tabItems)), { expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), path: '/', domain: 'ril.jd.com' });
      // cookies.set('CC_TabItems', JSON.stringify(toJS(this.tabItems)), { expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), path: '/' });
  },
  checkTabItems(index, checked){
    if(checked){
      if(this.tabItems.filter(item=>item.checked).length == 4){
        Notification.error({ description: '最多选择四个指标', duration:2 });
      }else{
        this.tabItems[index].checked = checked;
        cookies.set('CC_TabItems', JSON.stringify(toJS(this.tabItems)), { expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), path: '/', domain: 'ril.jd.com' });
        // cookies.set('CC_TabItems', JSON.stringify(toJS(this.tabItems)), { expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), path: '/' });    
      }
    }else{
      if(this.tabItems.filter(item=>item.checked).length == 1){
        Notification.error({ description: '至少选择一个指标', duration:2 });
      }else{
        this.tabItems[index].checked = checked;
        cookies.set('CC_TabItems', JSON.stringify(toJS(this.tabItems)), { expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), path: '/', domain: 'ril.jd.com' });
        // cookies.set('CC_TabItems', JSON.stringify(toJS(this.tabItems)), { expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), path: '/' });
      }
    }
  },
  setFilterSmallObject(value){
    this.filterSmallObject = value;
  },
  getSummaryData(params){
    return fetchData(
      `${__HOST}/stockMarketing/getSummaryData`, 
      this.setSummaryData, 
      params, 
      { method: 'get' })
      .catch((ex) => {
        Notification.error({ description: '获取数据看版数据异常:' + ex, duration: null });
      });
  },
  setSummaryData(result){
    if (result.success) {
      const data = result.data;

      this.summaryData.stockMoney = data.stockMoney ? parseFloat((data.stockMoney / 10000).toFixed(2)) : 0;
      this.summaryData.stockMoneyGrowth = data.stockMoneyGrowth ? parseFloat((data.stockMoneyGrowth * 100).toFixed(2)) : 0;
      this.summaryData.pvRates = data.pvRates ? parseFloat((data.pvRates * 100).toFixed(2)) : 0;
      this.summaryData.pvRatesGrowth = data.pvRatesGrowth ? parseFloat((data.pvRatesGrowth * 100).toFixed(2)) : 0;
      this.summaryData.inStockRates = parseFloat((data.inStockRates * 100).toFixed(2)) || 0;
      this.summaryData.inStockRatesGrowth = data.inStockRatesGrowth ? parseFloat((data.inStockRatesGrowth * 100).toFixed(2)) : 0;
      this.summaryData.inStockRatesBig = parseFloat((data.inStockRatesBig * 100).toFixed(2)) || 0;
      this.summaryData.inStockRatesGrowthBig = data.inStockRatesGrowthBig ? parseFloat((data.inStockRatesGrowthBig * 100).toFixed(2)) : 0;
      this.summaryData.transferDays = data.transferDays || 0;
      this.summaryData.transferDaysGrowth = data.transferDaysGrowth ? parseFloat((data.transferDaysGrowth * 100).toFixed(2)) : 0;
      this.summaryData.bigSales = parseFloat((data.bigSales * 100).toFixed(2)) || 0;
      this.summaryData.bigSalesGrowth = data.bigSalesGrowth ? parseFloat((data.bigSalesGrowth * 100).toFixed(2)) : 0;
      this.summaryData.bigSalesBig = parseFloat((data.bigSalesBig * 100).toFixed(2)) || 0;
      this.summaryData.bigSalesGrowthBig = data.bigSalesGrowthBig ? parseFloat((data.bigSalesGrowthBig * 100).toFixed(2)) : 0;
      this.summaryData.unsales = parseFloat((data.unsales * 100).toFixed(2)) || 0;
      this.summaryData.unsalesGrowth = data.unsalesGrowth ? parseFloat((data.unsalesGrowth * 100).toFixed(2)) : 0;
    } else {
      Notification.error({ description: '获取数据看版数据异常:' + result.message, duration: null });
    }
  },
  getMapData(params){
    return fetchData(
      `${__HOST}/stockMarketing/getMapData`, 
      this.setMapData, 
      params, 
      { method: 'get' })
      .catch((ex) => {
        Notification.error({ description: '获取区域详情数据异常:' + ex, duration: null });
      });
  },
  setMapData(result){
    if (result.success) {
      const data = result.data;
      this.mapDataStockMoney = data.mapDataStockMoney;
      this.mapDataPV = data.mapDataPV;
      this.mapDataInStock = data.mapDataInStock;
      this.mapDataInStockBig = data.mapDataInStockBig;
      this.mapDataTransferDays = data.mapDataTransferDays;
      this.mapDataBigSales = data.mapDataBigSales;
      this.mapDataBigSalesBig = data.mapDataBigSalesBig;
      this.mapDataUnsales = data.mapDataUnsales;
    } else {
      Notification.error({ description: '获取区域详情数据异常:' + result.message, duration: null });
    }
  },
  getLevelOneData(params){
    return fetchData(
      `${__HOST}/stockMarketing/getLevelOneData`, 
      this.setLevelOneData, 
      params, 
      { method: 'get' })
      .catch((ex) => {
        Notification.error({ description: '获取一级品类详情数据异常:' + ex, duration: null });
      });
  },
  setLevelOneData(result){
    if (result.success) {
      const data = result.data;
      this.l1DataStockMoney = data.l1DataStockMoney;
      this.l1DataPV = data.l1DataPV;
      this.l1DataInStock = data.l1DataInStock;
      this.l1DataInStockBig = data.l1DataInStockBig;
      this.l1DataTransferDays = data.l1DataTransferDays;
      this.l1DataBigSales = data.l1DataBigSales;
      this.l1DataBigSalesBig = data.l1DataBigSalesBig;
      this.l1DataUnsales = data.l1DataUnsales;
    } else {
      Notification.error({ description: '获取一级品类详情数据异常:' + result.message, duration: null });
    }
  },
  getBandData(params){
    return fetchData(
      `${__HOST}/stockMarketing/getBandData`, 
      this.setBandData, 
      params, 
      { method: 'get' })
      .catch((ex) => {
        Notification.error({ description: '获取Band详情数据异常:' + ex, duration: null });
      });
  },
  setBandData(result){
    if (result.success) {
      const data = result.data;
      this.bandDataStockMoney = data.bandDataStockMoney;
      this.bandDataPV = data.bandDataPV;
      this.bandDataInStock = data.bandDataInStock;
      this.bandDataInStockBig = data.bandDataInStockBig;
      this.bandDataTransferDays = data.bandDataTransferDays;
      this.bandDataBigSales = data.bandDataBigSales;
      this.bandDataBigSalesBig = data.bandDataBigSalesBig;
      this.bandDataUnsales = data.bandDataUnsales;
    } else {
      Notification.error({ description: '获取Band详情数据异常:' + result.message, duration: null });
    }
  },
  getTrendsData(params){
    return fetchData(
      `${__HOST}/stockMarketing/getTrendsData`, 
      this.setTrendsData, 
      params, 
      { method: 'get' })
      .catch((ex) => {
        Notification.error({ description: '获取趋势数据异常:' + ex, duration: null });
      });
  },
  setTrendsData(result){
    if (result.success) {
      const data = result.data;
      this.trendsDataStockMoney = data.trendsDataStockMoney;
      this.trendsDataPV = data.trendsDataPV;
      this.trendsDataInStock = data.trendsDataInStock;
      this.trendsDataInStockBig = data.trendsDataInStockBig;
      this.trendsDataTransferDays = data.trendsDataTransferDays;
      this.trendsDataBigSales = data.trendsDataBigSales;
      this.trendsDataBigSalesBig = data.trendsDataBigSalesBig;
      this.trendsDataUnsales = data.trendsDataUnsales;
    } else {
      Notification.error({ description: '获取趋势数据异常:' + result.message, duration: null });
    }
  },
  getTableData(params){
    return fetchData(
      `${__HOST}/stockMarketing/getTableData`, 
      this.setTableData, 
      params, 
      { method: 'get' })
      .catch((ex) => {
        Notification.error({ description: '获取表格数据异常:' + ex, duration: null });
      });
  },
  setTableData(result){
    if (result.success) {
      const data = result.data;
      this.tableDataStockMoney = data.tableDataStockMoney;
      this.tableDataPV = data.tableDataPV;
      this.tableDataInStock = data.tableDataInStock;
      this.tableDataInStockBig = data.tableDataInStockBig;
      this.tableDataTransferDays = data.tableDataTransferDays;
      this.tableDataBigSales = data.tableDataBigSales;
      this.tableDataBigSalesBig = data.tableDataBigSalesBig;
      this.tableDataUnsales = data.tableDataUnsales;
    } else {
      Notification.error({ description: '获取表格数据异常:' + result.message, duration: null });
    }
  },
  getTargetData(params){
    return fetchData(
      `${__HOST}/stockMarketing/getTargetData`, 
      this.setTargetData, 
      params, 
      { method: 'get' })
      .catch((ex) => {
        Notification.error({ description: '获取目标数据异常:' + ex, duration: null });
      });
  },
  setTargetData(result){
    if (result.success) {
      const data = result.data;
      this.targetDataPV = data.targetDataPV;
      this.targetDataInStock = data.targetDataInStock;
      this.targetDataInStockBig = data.targetDataInStockBig;
      this.targetDataTransferDays = data.targetDataTransferDays;
      this.targetDataBigSales = data.targetDataBigSales;
      this.targetDataBigSalesBig = data.targetDataBigSalesBig;
      this.targetDataUnsales = data.targetDataUnsales;
    } else {
      Notification.error({ description: '获取目标数据异常:' + result.message, duration: null });
    }
  },
  setTargetValue(index, value, type){
    switch (type){
      case 'pv':
        return this.targetDataPV[index] = value;
      break;
      case 'inStock':
        return this.targetDataInStock[index] = value;
      break;
      case 'inStockBig':
        return this.targetDataInStockBig[index] = value;
      break;
      case 'transferDays':
        return this.targetDataTransferDays[index] = value;
      break;
      case 'bigSales':
        return this.targetDataBigSales[index] = value;
      break;
      case 'bigSalesBig':
        return this.targetDataBigSalesBig[index] = value;
      break;
      case 'unsales':
        return this.targetDataUnsales[index] = value;
      break;
      default:
        _data = [];
      break;
    }
  },
  postTargetValue(){
    return fetchData(
      `${__HOST}/stockMarketing/setTargetData`, 
      null, 
      {
        targetDataPV:this.targetDataPV,
        targetDataInStock:this.targetDataInStock,
        targetDataInStockBig:this.targetDataInStockBig,
        targetDataTransferDays:this.targetDataTransferDays,
        targetDataBigSales:this.targetDataBigSales,
        targetDataBigSalesBig:this.targetDataBigSalesBig,
        targetDataUnsales:this.targetDataUnsales
      }, 
      { method: 'post' })
      .catch((ex) => {
        Notification.error({ description: '设置目标数据异常:' + ex, duration: null });
      });
  },
  afterCreate() {
    const tabItemsInCookie = cookies.get('CC_TabItems');

    if(tabItemsInCookie){
      this.tabItems = tabItemsInCookie
    }else{
      this.tabItems = [
        {name:'库存金额',value:'stockMoney', checked:true},
        {name:'PV现货率',value:'pv', checked:true},
        {name:'实物现货率(中小件)',value:'inStock', checked:true},
        {name:'实物现货率(大件)',value:'inStockBig', checked:true},
        {name:'周转天数',value:'transferDays', checked:false},
        {name:'畅销品现货率(中小件)',value:'bigSales', checked:false},
        {name:'畅销品现货率(大件)',value:'bigSalesBig', checked:false},
        {name:'滞销占比',value:'unsales', checked:false}
      ];
      cookies.set('CC_TabItems', JSON.stringify(toJS(this.tabItems)), { expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), path: '/', domain: 'ril.jd.com' });
      // cookies.set('CC_TabItems', JSON.stringify(toJS(this.tabItems)), { expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), path: '/' });
    }
    
  }
});

export default StockMarketingStore;