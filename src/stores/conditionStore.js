import { types, detach } from "mobx-state-tree";
import { fetchData } from 'vic-common/lib/common/fetchConfig';
import Notification from '../utils/notification';
import moment from 'moment';
import { toJS } from 'mobx'

const CategoryOption = types.model("CategoryOption", {
  value: types.optional(types.identifier(types.string), () => ''),
  label: types.optional(types.string, () => ''),
  children: types.maybe(types.array(types.late(() => CategoryOption)))
}, {
  beforeDestroy() {
    detach(this);
  }
});
const BrandOption = types.model("BrandOption", {
  value: types.optional(types.identifier(types.string), () => ''),
  label: types.optional(types.string, () => '')
});
const CategoryLevel4Option = types.model("CategoryLevel4Option", {
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
const PropOption = types.model("PropOption", {
  value: types.optional(types.identifier(types.string), () => ''),
  label: types.optional(types.string, () => '')
});

const ConditionStore = types.model("ConditionStore", {
  categoryData: types.optional(types.array(CategoryOption), () => []),
  categoryHasLevel4Data: types.optional(types.array(CategoryOption), () => []),
  categoryLevel4Data: types.optional(types.array(CategoryLevel4Option), () => [{ value: '0', label: '全部' }]),
  selectedCategory: types.optional(types.array(types.string), () => []),
  selectedCategoryHasLevel4: types.optional(types.array(types.string), () => []),
  selectedCategoryLevel4: types.optional(types.number, () => 0),
  selectedDate: types.optional(types.string, () => moment().subtract(1, 'months').format('YYYY-MM')),
  brandData: types.optional(types.array(BrandOption), () => []),
  selectedBrand: types.optional(types.number, () => 0),
  selectedMultiBrand: types.optional(types.array(types.string), []),
  propData: types.optional(types.array(PropOption), () => []),
  selectedProp: types.optional(types.string, () => '0'),
  deptData: types.optional(types.array(DeptOption), () => []),
  selectedDept: types.optional(types.string, () => ''),
  vendorData: types.optional(types.array(VendorOption), () => [{ value: '0', label: '全部' }]),
  selectedVendor: types.optional(types.string, () => ''),
  selectedDateRange: types.optional(types.array(types.string), []),
}, {
  selectedCategoryOptions: null,
  selectedCategoryHasLevel4Options: null,
  selectedCategoryLevel4Options: null
}, {
  getParamsHasLevel4(params = {}) {
    return Object.assign({
      categoryId1: this.selectedCategoryHasLevel4.length >= 1 ? this.selectedCategoryHasLevel4[0] : '',
      categoryId2: this.selectedCategoryHasLevel4.length >= 2 ? this.selectedCategoryHasLevel4[1] : '',
      categoryId3: this.selectedCategoryHasLevel4.length >= 3 ? this.selectedCategoryHasLevel4[2] : '',
      categoryId4: encodeURI(this.selectedCategoryHasLevel4.length >= 4 ? this.selectedCategoryHasLevel4Options[3].label : ''),
      propId: encodeURI(this.selectedProp != null ? this.selectedProp : ''),
      date: this.selectedDate ? this.selectedDate : ''
    }, params);
  },

  getCategoryData(params) {
    return fetchData(
        `${__HOST}/common/getCategoryData`,
        this.setCategoryData,
        params, { method: 'get' })
      .catch((ex) => {
        Notification.error({ description: '获取品类数据异常:' + ex, duration: null });
      });
  },
  setCategoryData(result) {
    if (result.success) {
      const data = result.data;
      this.categoryData = data;
    } else {
      Notification.error({ description: '获取品类数据异常:' + result.message, duration: null });
    }
  },
  setSelectedCategory(selectedItems, selectedOptions) {
    this.selectedCategory = selectedItems;
    this.selectedCategoryOptions = selectedOptions;
  },

  getCategoryHasLevel4Data(params) {
    return fetchData(
        `${__HOST}/common/getCategoryHasLevel4Data`,
        this.setCategoryHasLevel4Data,
        params, { method: 'get' })
      .catch((ex) => {
        Notification.error({ description: '获取品类(包含4级)数据异常:' + ex, duration: null });
      });
  },
  setCategoryHasLevel4Data(result) {
    if (result.success) {
      const data = result.data;
      this.categoryHasLevel4Data = data;
    } else {
      Notification.error({ description: '获取品类(包含4级)数据错误:' + result.message, duration: null });
    }
  },
  setSelectedCategoryHasLevel4(selectedItems, selectedOptions) {
    this.selectedCategoryHasLevel4 = selectedItems;
    this.selectedCategoryHasLevel4Options = selectedOptions;
  },

  getPropData(params) {
    return fetchData(
        `${__HOST}/common/getPropData`,
        result => this.setPropData(result, params),
        params, { method: 'get' })
      .catch((ex) => {
        Notification.error({ description: '获取属性数据异常:' + ex, duration: null });
      });
  },
  setPropData(result) {
    if (result.success) {
      let data = result.data;
      this.propData = data;
      this.selectedProp = data.length > 0 ? data[0].label : '请选择';
    } else {
      Notification.error({ description: '获取属性数据异常:' + result.message, duration: null });
    }
  },
  setSelectedProp(value) {
    // this.selectedProp = value;
    /*
    * 此处暂定（后台给的数据是name，暂无法根据id查询）
    * 先属性查询根据 value 反查 label
    */
    const vs = this.propData.map(function(item) {
        return item.value
    });
    let index;
    for(let i =0; i<vs.length; i++) {
      if(vs[i] == value){
          index = i;
          break;
      }
    }
    this.selectedProp = toJS(this.propData)[index].label;
  },

  getCategoryDefaultValue(type) {
    switch (type) {
      case '1': //1、2级必选
      case '5':
        {
          const values = [
            this.categoryData[0].value,
            this.categoryData[0].children[0].value
          ];
          const options = [
            this.categoryData[0],
            this.categoryData[0].children[0]
          ];

          return {
            values,
            options
          };
        }
      case '2': //1级必选
      case '3':
        {
          const values = [
            this.categoryData[0].value
          ];
          const options = [
            this.categoryData[0]
          ];

          return {
            values,
            options
          };
        }
      case '4': //1、2、3、4级品类必选
        {
          const category1 = this.categoryHasLevel4Data[0];
          const category2 = category1.children[0];
          const category3 = category2.children[0];
          const category4 = category3.children && category3.children.length ? category3.children[0] : null;

          const values = [
            category1.value,
            category2.value,
            category3.value
          ];
          const options = [
            category1,
            category2,
            category3
          ];
          if (category4) {
            values.push(category4.value);
            options.push(category4);
          }

          return {
            values,
            options
          };
        }
    }
  },

  getCategoryLevel4Data(params) {
    return fetchData(
        `${__HOST}/common/getCategoryLevel4Data`,
        this.setCategoryLevel4Data,
        params, { method: 'get' })
      .catch((ex) => {
        Notification.error({ description: '获取四级品类数据异常:' + ex, duration: null });
      });
  },
  setCategoryLevel4Data(result) {
    if (result.success) {
      let data = result.data;
      data = [{ value: '0', label: '全部' }].concat(data);
      this.categoryLevel4Data = data;
      this.selectedCategoryLevel4 = +data[0].value;
    } else {
      Notification.error({ description: '获取四级品类数据异常:' + result.message, duration: null });
    }
  },
  setSelectedCategoryLevel4(value) {
    this.selectedCategoryLevel4 = parseInt(value, 10);
  },
  setSelectedDate(date) {
    this.selectedDate = date;
  },
  getBrandData(params) {
    return fetchData(
        `${__HOST}/common/getBrandData`,
        result => this.setBrandData(result, params),
        params, { method: 'get' })
      .catch((ex) => {
        Notification.error({ description: '获取品牌数据异常:' + ex, duration: null });
      });
  },
  setBrandData(result, params) {
    if (result.success) {
      let data = result.data;
      if (!params || !params.notAll) {
        data = [{ value: '0', label: '全部' }].concat(data);
      }

      this.brandData = data;
      this.selectedBrand = +data[0].value;
      this.selectedMultiBrand = [result.data[0].value];
    } else {
      Notification.error({ description: '获取品牌数据异常:' + result.message, duration: null });
    }
  },
  setSelectedBrand(value) {
    this.selectedBrand = parseInt(value, 10);
  },
  setSelectedMultiBrand(value) {
    this.selectedMultiBrand = value;
  },

  getDeptData(params) {
    return fetchData(
        `${__HOST}/common/getDeptData`,
        this.setDeptData,
        params, { method: 'get' })
      .catch((ex) => {
        Notification.error({ description: '获取部门数据异常:' + ex, duration: null });
      });
  },
  setDeptData(result) {
    if (result.success) {
      const data = result.data;
      this.deptData = data;
      this.selectedDept = data[0].value.toString();
    } else {
      Notification.error({ description: '获取部门数据异常:' + result.message, duration: null });
    }
  },
  setSelectedDept(value) {
    this.selectedDept = value;
  },

  getVendorData(params) {
    return fetchData(
        `${__HOST}/common/getVendorData`,
        this.setVendorData,
        params, { method: 'get' })
      .catch((ex) => {
        Notification.error({ description: '获取供应商数据异常:' + ex, duration: null });
      });
  },
  setVendorData(result) {
    if (result.success) {
      let data = result.data;
      data = [{ value: '0', label: '全部' }].concat(data);
      this.vendorData = data;
      this.selectedVendor = data[0].value.toString();
    } else {
      Notification.error({ description: '获取供应商数据异常:' + result.message, duration: null });
    }
  },
  setSelectedVendor(value) {
    this.selectedVendor = value;
  },

  setSelectedDateRange(date) {
    this.selectedDateRange = date;
  },

  afterCreate() {
    this.brandData = [{ value: '0', label: '全部' }];
  }
});

export default ConditionStore;
