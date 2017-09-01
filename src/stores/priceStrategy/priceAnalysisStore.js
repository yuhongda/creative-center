import {types} from "mobx-state-tree";
import {fetchData} from 'vic-common/lib/common/fetchConfig';
import Notification from '../../utils/notification';

const PriceAnalysisStore = types.model("PriceAnalysisStore", {}, {
  priceProductsData: null,
  priceProductsList: null,
  priceProductsListCount: null,
  priceCurrentPage: 1,
  bandIndex: 0,
  priceProductSuccess: null,
  priceListSuccess: null,
  priceTableData:null,

  searchParams: null,
  saleBand: 'B',
  sensitivity: 1,
  page: 1,
  pageSize: 10,
}, {
  getPriceProductsData(params) {
    return fetchData(`${__HOST}/priceAnalysis/getPriceProductsData`,
      this.setPriceProductsData,
      params,
      {method: 'get'}).catch((ex) => {
      Notification.error({
        description: '获取商品价格敏感度数据异常:' + ex,
        duration: null
      });
    });
  },
  setPriceProductsData(result) {
    if (result.success) {
      const data = result.data;
      this.priceProductSuccess = result.success;
      this.priceProductsData = data.length > 0 ? data : [[],[],[]];
    } else {
      Notification.error({
        description: '获取商品价格敏感度数据异常:' + result.message,
        duration: null
      });
    }
  },

  getPriceProductsList(params) {
  return fetchData(
    `${__HOST}/priceAnalysis/getPriceProductsList`,
    this.setPriceProductsList,
    params,
    { method: 'get' })
    .catch((ex) => {
      Notification.error({ description: '获取销量E band 商品列表数据异常:' + ex, duration: null });
    });
  },
  setPriceProductsList(result) {
    if (result.success) {
      const data = result.data;
      this.priceProductsList = data;
      this.priceProductsListCount = result.total;
    } else {
      Notification.error({
        description: '获取销量E band 商品列表数据异常:' + result.message,
        duration: null
      });
    }
  },
  setSearchParams(value) {
    this.searchParams = value
  },
  setSaleBand(value) {
    this.saleBand = value;
  },
  setSensitivity(value) {
    this.sensitivity = value;
  },
  setBandIndex(value) {
    this.bandIndex = value;
  },
  setPriceCurrentPage(value) {
    this.priceCurrentPage = value;
  }
});



export default PriceAnalysisStore;
