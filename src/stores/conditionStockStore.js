import { types } from "mobx-state-tree";
import { fetchData } from 'vic-common/lib/common/fetchConfig';
import Notification from '../utils/notification';
import moment from 'moment';
import { toJS } from 'mobx'


const CategoryOption = types.model("CategoryOption", {
  value: types.optional(types.identifier(types.string), () => ''),
  label: types.optional(types.string, () => ''),
  children: types.maybe(types.array(types.late(() => CategoryOption)))
});
const BrandOption = types.model("BrandOption", {
  value: types.optional(types.identifier(types.string), () => ''),
  label: types.optional(types.string, () => '')
});
const DeptOption = types.model("DeptOption", {
  value: types.optional(types.identifier(types.string), () => ''),
  label: types.optional(types.string, () => '')
});
const VendorOption = types.model("VendorOption", {
  value: types.optional(types.identifier(types.string), () => ''),
  label: types.optional(types.string, () => '')
});

const ConditionStockStore = types.model("ConditionStockStore", {
  categoryData:types.optional(types.array(CategoryOption), ()=>[]),
  selectedCategory:types.optional(types.array(types.string), () => []),
  selectedDate:types.optional(types.string, () => moment().subtract(1, 'days').format('YYYY-MM-DD')),
  brandData:types.optional(types.array(BrandOption), ()=>[]),
  selectedBrand:types.optional(types.number, () => 0),
  deptData:types.optional(types.array(DeptOption), ()=>[]),
  selectedDept:types.optional(types.string, () => ''),
  vendorData:types.optional(types.array(VendorOption), ()=>[]),
  selectedVendor:types.optional(types.string, () => ''),
  selectedDateRange:types.optional(types.array(types.string), []),
  selectedDataRange:types.optional(types.string, () => '0'),
  selectedDateType:types.optional(types.string, () => 'day'),
  skuList:types.optional(types.string, () => '')
}, {
  getCategoryData(params){
    return fetchData(
      `${__HOST}/common/getStockCategoryData`, 
      this.setCategoryData,
      params, 
      { method: 'get' })
      .catch((ex) => {
        Notification.error({ description: '获取品类数据异常:' + ex, duration: null });
      });
  },
  setCategoryData(result){
    if (result.success) {
      const data = result.data;
      this.categoryData = [{value:'',label:'全部'}].concat(data);
      this.selectedCategory = [toJS(this.categoryData)[0].value];
    } else {
      Notification.error({ description: '获取品类数据异常:' + result.message, duration: null });
    }
  },
  setSelectedCategory(selectedItems){
    this.selectedCategory = selectedItems;
  },
  setSelectedDate(date){
    this.selectedDate = date;
  },
  getBrandData(params){
    return fetchData(
      `${__HOST}/common/getStockBrandData`, 
      this.setBrandData,
      params, 
      { method: 'get' })
      .catch((ex) => {
        Notification.error({ description: '获取品牌数据异常:' + ex, duration: null });
      });
  },
  setBrandData(result){
    if (result.success) {
      let data = result.data;
      data = [{value:'0',label:'全部'}].concat(data);
      this.brandData = data;
      this.selectedBrand = +data[0].value;
    } else {
      Notification.error({ description: '获取品牌数据异常:' + result.message, duration: null });
    }
  },
  setSelectedBrand(value){
    this.selectedBrand = parseInt(value,10);
  },
  getDeptData(params){
    return fetchData(
      `${__HOST}/common/getStockDeptData`, 
      this.setDeptData,
      params, 
      { method: 'get' })
      .catch((ex) => {
        Notification.error({ description: '获取部门数据异常:' + ex, duration: null });
      });
  },
  setDeptData(result){
    if (result.success) {
      const data = result.data;
      this.deptData = data;
      
      //临时将“消费品事业部”设为默认
      let filterData = data.filter(item=>item.label == '消费品事业部');
      if(filterData.length > 0){
        this.selectedDept = filterData[0].value.toString();
      }else{
        this.selectedDept = data[0].value.toString();
      }
      this.getCategoryData({deptId:this.selectedDept})
    } else {
      Notification.error({ description: '获取部门数据异常:' + result.message, duration: null });
    }
  },
  setSelectedDept(value){
    this.selectedDept = value;
  },
  setSelectedDateRange(date){
    this.selectedDateRange = date;
  },
  setSelectedDataRange(value){
    this.selectedDataRange = value;
  },
  setSelectedDateType(value){
    this.selectedDateType = value;
  },
  setSKUs(skuList){
    this.skuList = skuList;
  },
  afterCreate(){
    this.brandData = [{value:'0',label:'全部'}];
  }
});

export default ConditionStockStore;