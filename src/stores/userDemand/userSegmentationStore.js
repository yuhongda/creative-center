import { types, getParent } from "mobx-state-tree";
import { fetchData } from 'vic-common/lib/common/fetchConfig';
import Notification from '../../utils/notification';
import moment from 'moment';
import {
  Category,
  Brand
} from "../commonStore";
import { toJS } from 'mobx';
import ConditionStore from "../conditionStore";
import nj from 'nornj';

export const UserProp = types.model("UserProp", {
  value: '0',
  label: '',
  checked: false
});

const UserSegmentationStore = types.model("UserSegmentationStore", {
  get root() {
    return getParent(this);
  },

  usersNumber: types.optional(types.union(types.number, types.literal(null)), 0),
  singularNumber: types.optional(types.union(types.number, types.literal(null)), 0),
  salesContribution: types.optional(types.union(types.number, types.literal(null)), 0),
  userProps: types.optional(types.array(UserProp), []),
  propsChecked: types.optional(types.array(types.string), []),
  modalPropName: '',
  modalVisible: false,
  dataType: '1'
}, {
  propsData: null,
  propsDetailData: null,
  userStructureData: null
}, {
  afterCreate() {
    this.propsData = [];
    this.userStructureData = [];
  },

  getParams(hasProps, propName, multiBrand) {
    const { conditions } = this.root;
    const categorys = conditions.selectedCategory;
    let brandId = '';
    if(!multiBrand) {
      if(conditions.selectedBrand) {
        brandId = conditions.selectedBrand;
      }
    }
    else {
      if(conditions.selectedMultiBrand.length) {
        brandId = conditions.selectedMultiBrand.join(',');
      }
    }

    return {
      categoryId1: categorys && categorys.length >= 1 ? categorys[0] : '',
      categoryId2: categorys && categorys.length >= 2 ? categorys[1] : '',
      categoryId3: categorys && categorys.length >= 3 ? categorys[2] : '',
      date: conditions.selectedDate ? conditions.selectedDate : '',
      brandId,
      propId: propName != null ? propName : (hasProps ? this.propsChecked.join(',') : ''),
      dataType: multiBrand ? this.dataType : ''
    };
  },

  getUserContribution() {
    return fetchData(`${__HOST}/userSegmentation/getUserContribution`, this.setUserContribution, this.getParams(), { method: 'post' }).catch((ex) => {
      Notification.error({ description: '获取用户贡献数据异常:' + ex, duration: null });
    });
  },
  setUserContribution(result) {
    if (result.success) {
      this.usersNumber = result.data.usersNumber;
      this.singularNumber = result.data.singularNumber;
      this.salesContribution = result.data.salesContribution;
    } else {
      Notification.error({ description: '获取用户贡献数据错误:' + result.message, duration: null });
    }
  },

  getProps() {
    return fetchData(`${__HOST}/userSegmentation/getProps`, this.setProps, this.getParams(), { method: 'post' }).catch((ex) => {
      Notification.error({ description: '获取属性数据异常:' + ex, duration: null });
    });
  },
  setProps(result) {
    if (result.success) {
      this.userProps = result.data;
      this.propsChecked = result.data.filter(item => {
        if (item.checked) {
          return true;
        }
      }).map(item => item.value);
    } else {
      Notification.error({ description: '获取属性数据错误:' + result.message, duration: null });
    }
  },
  setPropsChecked(checkeds) {
    this.propsChecked = checkeds;
  },

  getPropsData() {
    return fetchData(`${__HOST}/userSegmentation/getPropsData`, this.setPropsData, this.getParams(true), { method: 'post' }).catch((ex) => {
      Notification.error({ description: '获取各属性图表数据异常:' + ex, duration: null });
    });
  },
  setPropsData(result) {
    if (result.success) {
      this.propsData = result.data;
      result.data && result.data.length && this.setModalPropName(result.data[0].propName);
    } else {
      Notification.error({ description: '获取各属性图表数据错误:' + result.message, duration: null });
    }
  },

  getPropsDetailData(propName) {
    return fetchData(`${__HOST}/userSegmentation/getPropsDetailData`, this.setPropsDetailData, this.getParams(null, propName), { method: 'post' }).catch((ex) => {
      Notification.error({ description: '获取各属性图表详细数据异常:' + ex, duration: null });
    });
  },
  setPropsDetailData(result) {
    if (result.success) {
      //result = {"success":true,"message":null,"data":[{"name":"15岁以下","user":null,"sale":null,"categoryUser":2.6499,"categorySale":4.0261,"unitPrice":null,"repurchasingRate":null,"categoryUnitPrice":91.0969,"categoryRepurchasingRate":1.4282},{"name":"16-25岁","user":5.0651,"sale":5.648,"categoryUser":0.7057,"categorySale":0.4935,"unitPrice":70.8033,"repurchasingRate":1.0195,"categoryUnitPrice":95.5466,"categoryRepurchasingRate":1.35},{"name":"26-35岁","user":4.6474,"sale":5.2966,"categoryUser":0.3694,"categorySale":0.1617,"unitPrice":86.1805,"repurchasingRate":1.0399,"categoryUnitPrice":99.0362,"categoryRepurchasingRate":1.4468},{"name":"36-45岁","user":5.083,"sale":5.357,"categoryUser":0.1192,"categorySale":-0.0843,"unitPrice":93.2392,"repurchasingRate":1.0516,"categoryUnitPrice":97.9247,"categoryRepurchasingRate":1.4134},{"name":"46-55岁","user":7.3,"sale":9.5614,"categoryUser":0.5019,"categorySale":0.2738,"unitPrice":96.274,"repurchasingRate":1.1285,"categoryUnitPrice":98.5156,"categoryRepurchasingRate":1.4477},{"name":"56岁以上","user":4.1765,"sale":6.1154,"categoryUser":0.5748,"categorySale":0.1985,"unitPrice":100.8926,"repurchasingRate":1.0227,"categoryUnitPrice":96.2776,"categoryRepurchasingRate":1.5534},{"name":"其他","user":10.5306,"sale":9.4835,"categoryUser":3.2519,"categorySale":0.8317,"unitPrice":73.9121,"repurchasingRate":1.0425,"categoryUnitPrice":97.6671,"categoryRepurchasingRate":1.2994}],"total":0};
      this.propsDetailData = result.data;
    } else {
      Notification.error({ description: '获取各属性图表详细数据错误:' + result.message, duration: null });
    }
  },

  setModalPropName(name) {
    this.modalPropName = name;
  },

  setModalVisible(value, name) {
    if(name != null) {
      this.modalPropName = name;
    }
    this.modalVisible = value;
  },

  getUserStructureData() {
    return fetchData(`${__HOST}/userSegmentation/getUserStructureData`, this.setUserStructureData, this.getParams(true, null, true), { method: 'post' }).catch((ex) => {
      Notification.error({ description: '获取竞品分析数据异常:' + ex, duration: null });
    });
  },
  setUserStructureData(result) {
    if (result.success) {
      this.userStructureData = result.data;
    } else {
      Notification.error({ description: '获取竞品分析数据错误:' + result.message, duration: null });
    }
  },

  setDataType(v) {
    this.dataType = v;
  }
});

export default UserSegmentationStore;