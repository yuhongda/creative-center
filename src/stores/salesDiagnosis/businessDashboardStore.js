import { types } from "mobx-state-tree";
import { fetchData } from 'vic-common/lib/common/fetchConfig';
import Notification from '../../utils/notification';
import queryParams from '../../utils/queryParams';
import moment from 'moment';
import {
  Category,
  Brand
} from "../commonStore";
import { toJS } from 'mobx';
import ConditionStore from "../conditionStore";
import nj from 'nornj';

const KpiTrack = types.model("KpiTrack", {
  current: 0,
  target: 0
});

const KpiTrackItem = types.model("KpiTrackItem", {
  name: '',
  kpiTrack: types.optional(KpiTrack, {})
});

const TargetIndex = types.model("TargetIndex", {
  yearTarget: 0,
  seasonTarget1: 0,
  seasonTarget2: 0,
  seasonTarget3: 0,
  seasonTarget4: 0,
  monthTarget1: 0,
  monthTarget2: 0,
  monthTarget3: 0,
  monthTarget4: 0,
  monthTarget5: 0,
  monthTarget6: 0,
  monthTarget7: 0,
  monthTarget8: 0,
  monthTarget9: 0,
  monthTarget10: 0,
  monthTarget11: 0,
  monthTarget12: 0,
});

const BusinessDashboardStore = types.model("BusinessDashboardStore", {
  yearTarget: 0,
  yearSalesVolume: 0,
  yearCompletionRate: 0,
  yearForecastRate: 0,
  seasonTarget: 0,
  seasonSalesVolume: 0,
  seasonCompletionRate: 0,
  seasonForecastRate: 0,
  monthTarget: 0,
  monthSalesVolume: 0,
  monthCompletionRate: 0,
  monthForecastSales: 0,
  yearKpiTrack: types.optional(KpiTrack, {}),
  seasonKpiTrack: types.optional(KpiTrack, {}),
  monthKpiTrack: types.optional(KpiTrack, {}),

  currentDate: moment().add('days', -1).format("YYYY-MM-DD"),
  calendarTarget: 0,
  calendarActual: 0,
  calendarComplete: 0,
  calendarSales: 0,

  salesTrendsDate: types.optional(types.array(types.string), []),
  salesTrendsData: types.optional(types.array(types.number), []),

  categoryKpiTrackList: types.optional(types.array(KpiTrackItem), []),
  brandKpiTrackList: types.optional(types.array(KpiTrackItem), []),

  categoryForBrand: types.optional(types.array(Category), []),
  categoryForBrandId: '0',

  brandForTarget: types.optional(types.array(Brand), []),
  brandForTargetId: '0',

  targetType: 'category',
  targetIndex: types.optional(TargetIndex, {}),

  conditions: types.optional(ConditionStore, {}),
}, {
  calendarData: null,
  calendarValues: null,
  targetSettingDateData: null,
  targetSettingDateValue: null,
  targetSettingMonthData: null,
  targetSettingMonthValue: null
}, {
  afterCreate() {
    this.targetSettingDateValue = moment();
    this.targetSettingMonthValue = moment();
  },
  getTargetData() {
    return fetchData(`${__HOST}/businessDashboard/getTargetData`, this.setTargetData, null, { method: 'post' }).catch((ex) => {
      Notification.error({ description: '获取目标数据异常:' + ex, duration: null });
    });
  },
  setTargetData(result) {
    if (result.success) {
      const data = result.data;

      this.yearTarget = data.yearTarget;
      this.yearSalesVolume = data.yearSalesVolume;
      this.yearCompletionRate = data.yearCompletionRate;
      this.yearForecastRate = data.yearForecastRate;
      this.seasonTarget = data.seasonTarget;
      this.seasonSalesVolume = data.seasonSalesVolume;
      this.seasonCompletionRate = data.seasonCompletionRate;
      this.seasonForecastRate = data.seasonForecastRate;
      this.monthTarget = data.monthTarget;
      this.monthSalesVolume = data.monthSalesVolume;
      this.monthCompletionRate = data.monthCompletionRate;
      this.monthForecastSales = data.monthForecastSales;
      this.yearKpiTrack = data.yearKpiTrack;
      this.seasonKpiTrack = data.seasonKpiTrack;
      this.monthKpiTrack = data.monthKpiTrack;
    } else {
      Notification.error({ description: '获取目标数据错误:' + result.message, duration: null });
    }
  },
  getCalendarData() {
    return fetchData(`${__HOST}/businessDashboard/getCalendarData`, this.setCalendarData, {
      date: moment().format("YYYY-MM-01")
    }, { method: 'post' }).catch((ex) => {
      Notification.error({ description: '获取日历数据异常:' + ex, duration: null });
    });
  },
  setCalendarData(result) {
    if (result.success) {
      this.calendarValues = result.data.map(item => item[1]);
      this.calendarData = result.data;
    } else {
      Notification.error({ description: '获取日历数据错误:' + result.message, duration: null });
    }
  },

  getCalendarTarget(date) {
    return fetchData(`${__HOST}/businessDashboard/getCalendarTarget`, this.setCalendarTarget, {
      date
    }, { method: 'post' }).catch((ex) => {
      Notification.error({ description: '获取日历目标数据异常:' + ex, duration: null });
    });
  },
  setCalendarTarget(result) {
    if (result.success) {
      this.calendarTarget = result.data.calendarTarget,
        this.calendarActual = result.data.calendarActual,
        this.calendarComplete = result.data.calendarComplete,
        this.calendarSales = result.data.calendarSales
    } else {
      Notification.error({ description: '获取日历目标数据错误:' + result.message, duration: null });
    }
  },

  setCurrentDate(val) {
    this.currentDate = val;
  },

  getCategoryKpiTrackList(date) {
    return fetchData(`${__HOST}/businessDashboard/getCategoryKpiTrackList`, this.setCategoryKpiTrackList, {
      date
    }, { method: 'post' }).catch((ex) => {
      Notification.error({ description: '获取品类KPI追踪数据异常:' + ex, duration: null });
    });
  },
  setCategoryKpiTrackList(result) {
    if (result.success) {
      this.categoryKpiTrackList = result.data;
    } else {
      Notification.error({ description: '获取品类KPI追踪数据错误:' + result.message, duration: null });
    }
  },

  getBrandKpiTrackList(date) {
    return fetchData(`${__HOST}/businessDashboard/getBrandKpiTrackList`, this.setBrandKpiTrackList, {
      date
    }, { method: 'post' }).catch((ex) => {
      Notification.error({ description: '获取品牌KPI追踪数据异常:' + ex, duration: null });
    });
  },
  setBrandKpiTrackList(result) {
    if (result.success) {
      this.brandKpiTrackList = result.data;
    } else {
      Notification.error({ description: '获取品牌KPI追踪数据错误:' + result.message, duration: null });
    }
  },

  getSalesTrends(date) {
    return fetchData(`${__HOST}/businessDashboard/getSalesTrends`, this.setSalesTrends, null, { method: 'post' }).catch((ex) => {
      Notification.error({ description: '获取销量趋势数据异常:' + ex, duration: null });
    });
  },
  setSalesTrends(result) {
    if (result.success) {
      const salesTrendsDate = [],
        salesTrendsData = [];
      result.data.forEach(item => {
        salesTrendsDate.push(item.date);
        salesTrendsData.push(item.value);
      });

      this.salesTrendsDate = salesTrendsDate;
      this.salesTrendsData = salesTrendsData;
    } else {
      Notification.error({ description: '获取销量趋势数据错误:' + result.message, duration: null });
    }
  },

  getCategoryForBrand(date) {
    return fetchData(`${__HOST}/common/getCategory2Data`, this.setCategoryForBrand, null, { method: 'get' }).catch((ex) => {
      Notification.error({ description: '获取目标二级品类数据异常:' + ex, duration: null });
    });
  },
  setCategoryForBrand(result) {
    if (result.success) {
      this.categoryForBrand = result.data;
      this.setCategoryForBrandId(result.data[0].value);
    } else {
      Notification.error({ description: '获取目标二级品类数据错误:' + result.message, duration: null });
    }
  },

  setCategoryForBrandId(id) {
    this.categoryForBrandId = id;
  },

  getBrandForTarget(date) {
    return fetchData(`${__HOST}/common/getBrandData`, this.setBrandForTarget, null, { method: 'get' }).catch((ex) => {
      Notification.error({ description: '获取目标品牌数据异常:' + ex, duration: null });
    });
  },
  setBrandForTarget(result) {
    if (result.success) {
      this.brandForTarget = result.data;
      this.setBrandForTargetId(result.data[0].value);
    } else {
      Notification.error({ description: '获取目标品牌数据错误:' + result.message, duration: null });
    }
  },

  setBrandForTargetId(id) {
    this.brandForTargetId = id;
  },

  setTargetType(type) {
    this.targetType = type;
  },

  getTargetIndex(date) {
    return fetchData(`${__HOST}/bdPlan/getPlanSumList`, this.setTargetIndex, null, { method: 'post' }).catch((ex) => {
      Notification.error({ description: '获取销售目标数据异常:' + ex, duration: null });
    });
  },
  setTargetIndex(result) {
    if (result.success) {
      this.targetIndex = result.data;
    } else {
      Notification.error({ description: '获取销售目标数据错误:' + result.message, duration: null });
    }
  },

  getTargetSettingMonthData(year, categoryId2, brandId) {
    return fetchData(categoryId2 != null ? `${__HOST}/bdPlan/getBdCategoryPlanList` : `${__HOST}/bdPlan/getBdBrandPlanList`, result => {
      if (result.success) {
        this.setTargetSettingMonthData(result.data);
      } else {
        Notification.error({ description: '获取月目标数据错误:' + result.message, duration: null });
      }
    }, {
      year,
      categoryId2,
      brandId
    }, { method: 'post' }).catch((ex) => {
      Notification.error({ description: '获取月目标数据异常:' + ex, duration: null });
    });
  },
  setTargetSettingMonthData(data) {
    this.targetSettingMonthData = data;
  },

  setTargetSettingMonthValue(m) {
    this.targetSettingMonthValue = m;
  },

  getTargetSettingDateData(date) {
    return fetchData(`${__HOST}/bdPlan/getBdPlanList`, result => {
      if (result.success) {
        this.setTargetSettingDateData(result.data);
      } else {
        Notification.error({ description: '获取日目标数据错误:' + result.message, duration: null });
      }
    }, {
      date
    }, { method: 'post' }).catch((ex) => {
      Notification.error({ description: '获取日目标数据异常:' + ex, duration: null });
    });
  },
  setTargetSettingDateData(data) {
    this.targetSettingDateData = data;
  },

  setTargetSettingDateValue(m) {
    this.targetSettingDateValue = m;
  },

  saveBdPlan() {
    const params = {
      date: this.targetSettingDateValue.format("YYYY-MM-01"),
      year: this.targetSettingMonthValue.year()
    };

    //上方表格
    params.dayData = Object.keys(toJS(this.targetSettingDateData))
      .map(key => this.targetSettingDateData[key]).join(',');

    //下方表格
    if (this.targetType == 'category') {
      params.categoryId2 = this.categoryForBrandId;
    } else {
      params.brandId = this.brandForTargetId;
    }
    params.monthData = Object.keys(toJS(this.targetSettingMonthData))
      .map(key => this.targetSettingMonthData[key]).join(',');

    return fetchData(`${__HOST}/bdPlan/saveBdPlan`, result => {
      if (result.success) {
        Notification.success({ description: '保存成功！', duration: 2 });
      } else {
        Notification.error({ description: '保存目标数据错误:' + result.message, duration: null });
      }
    }, params, { method: 'post' }).catch((ex) => {
      Notification.error({ description: '保存目标数据异常:' + ex, duration: null });
    });
  },

  exportBdPlan(params) {
    return fetchData(`${__HOST}/bdPlan/exportBdPlan`, result => {
      if (result.success) {
        Modal.success({
          title: '导出数据成功',
          okText: '确定',
          content: nj`
            <div style="word-wrap:break-word;word-break:break-all">
              下载地址：<a href=${result.data} target="_blank">${result.data}</a>
            </div >`(),
        });
      } else if (result.success == false) {
        Modal.error({
          title: '数据错误',
          okText: '确定',
          content: result.message,
        });
      } else {
        Modal.error({
          title: '导出数据失败',
          okText: '确定',
          content: '可能是网络出现了问题，请重试。',
        });
      }
    }, params, { method: 'post' }).catch((ex) => {
      Notification.error({ description: '导出下载数据异常:' + ex, duration: null });
    });
  },
});

export default BusinessDashboardStore;