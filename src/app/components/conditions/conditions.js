import * as React from 'react'
import { Component, PropTypes } from 'react';
import { observable, computed, toJS, runInAction } from 'mobx'
import { observer, inject } from 'mobx-react';
import { registerComponent } from 'nornj';
import { registerTmpl } from 'nornj-react';
import { autobind } from 'core-decorators';
import styles from './conditions.m.scss';
import tmpls from './conditions.t.html'
import WhiteSpace from 'vic-common/lib/components/antd-mobile/whiteSpace';
import List from 'vic-common/lib/components/antd-mobile/list';
import Picker from 'vic-common/lib/components/antd-mobile/picker';
import DatePicker from 'vic-common/lib/components/antd-mobile/datePicker';
import InputItem from 'vic-common/lib/components/antd-mobile/inputItem';
import Button from 'vic-common/lib/components/antd-mobile/button';
import Toast from 'vic-common/lib/components/antd-mobile/toast';
import moment from 'moment';

const BRAND_NOT_ALL = ['2'];

@registerTmpl('conditions')
@inject('store')
@observer
export default class Conditions extends Component {

  constructor(props) {
    super(props);
  }

  @observable defaultDate;

  componentWillMount() {
    const { defaultValueType } = this.props;
    const { conditions } = this.props.store;
    if(defaultValueType === '3') {
      this.defaultDate = moment();
    }
    else {
      this.defaultDate = moment().subtract(1, 'months');
    }
    conditions.setSelectedDate(this.defaultDate.format('YYYY-MM'));
  }

  componentDidMount() {
    Toast.loading('loading...');
    const { conditions } = this.props.store;
    const { showCategoryHasLevel4, showProp, defaultValueType } = this.props;
    const initFn = () => {
      Toast.hide();
      this.props.onSearch();
    };

    Promise.all([
      //conditions.getDeptData(),
      !showCategoryHasLevel4 ? conditions.getCategoryData() : conditions.getCategoryHasLevel4Data({ date: conditions.selectedDate })
    ]).then(() => {
      switch (defaultValueType) {
        case '1':
        { //1、2级品类必选
          const v = conditions.getCategoryDefaultValue('1');
          runInAction(() => {
            conditions.setSelectedCategory(v.values, v.options);
            initFn();
          });
        }
          break;
        case '2':
        { //1级品类、品牌必选
          const v = conditions.getCategoryDefaultValue('2');
          runInAction(() => {
            conditions.setSelectedCategory(v.values, v.options);
            conditions.getBrandData({ categoryId1: v.values[0], notAll: true }).then(() => {
              initFn();
            });
          });
        }
          break;
        case '3':
        { //1级品类必选
          const v = conditions.getCategoryDefaultValue('3');
          runInAction(() => {
            conditions.setSelectedCategory(v.values, v.options);
            conditions.getBrandData({ categoryId1: v.values[0] }).then(() => {
              initFn();
            });
          });
        }
          break;
        case '4':
        { //1、2、3、4级品类必选
          const v = conditions.getCategoryDefaultValue('4');
          runInAction(() => {
            conditions.setSelectedCategoryHasLevel4(v.values, v.options);
            if (showProp) {
              conditions.getPropData(conditions.getParamsHasLevel4()).then(() => {
                initFn();
              });
            } else {
              initFn();
            }
          });
        }
          break;
        default:
          initFn();
          break;
      }
    });
  }

  @autobind
  onCategoryChange(value, selectedOptions) {
    const { defaultValueType } = this.props;
    switch (defaultValueType) {
      case '1':
      { //1、2级品类必选
        if (value.length < 2) {
          return;
        }
      }
        break;
      case '2':
      case '3':
      { //1级品类
        if (value.length < 1) {
          return;
        }
      }
        break;
    }

    this.props.store.conditions.setSelectedCategory(value, selectedOptions);
    this.props.store.conditions.getBrandData({ categoryId1: value[0], categoryId2: value[1], categoryId3: value[2], notAll: BRAND_NOT_ALL.indexOf(defaultValueType) >= 0 });
    // if (this.props.showCategoryLevel4 && value[2]) {
    //   this.props.store.conditions.getCategoryLevel4Data({ categoryId3: value[2] });
    // }
  }

  @autobind
  onCategoryHasLevel4Change(value, selectedOptions) {
    if (value.length < 3) {
      return;
    } else if (value.length == 3) { //如果有4级就必须选到4级
      if (selectedOptions[2].children && selectedOptions[2].children.length) {
        return;
      }
    }

    this.props.store.conditions.setSelectedCategoryHasLevel4(value, selectedOptions);
    if (this.props.showProp) {
      this.props.store.conditions.getPropData(this.props.store.conditions.getParamsHasLevel4());
    }
  }

  @autobind
  propFilterOption(inputValue, option) {
    if(option.props.children.indexOf(inputValue) > -1) {
      return true;
    }
  }

  @autobind
  onPropChange(value) {
    this.props.store.conditions.setSelectedProp(value);
  }

  /*
    已废弃
  */
  @autobind
  onCategoryLevel4Change(value) {
    this.props.store.conditions.setSelectedCategoryLevel4(value);
    this.props.store.conditions.getBrandData({
      categoryId1: this.props.store.conditions.selectedCategory[0],
      categoryId2: this.props.store.conditions.selectedCategory[1],
      categoryId3: this.props.store.conditions.selectedCategory[2],
      categoryId4: value
    });
  }

  @autobind
  onDateChange(date) {
    const { conditions } = this.props.store;
    const dateString = moment(date).format('YYYY-MM');
    conditions.setSelectedDate(moment(date).format('YYYY-MM'));

    const { showCategoryHasLevel4, showProp } = this.props;
    if (showCategoryHasLevel4) {
      conditions.getCategoryHasLevel4Data({ date: dateString }).then(() => {
        // const v = conditions.getCategoryDefaultValue('4');
        // conditions.setSelectedCategoryHasLevel4(v.values, v.options);
        if (showProp) {
          conditions.getPropData(conditions.getParamsHasLevel4({ date: dateString }));
        }
      });
    }
  }

  @autobind
  onDeptChange(value) {
    this.props.store.conditions.setSelectedDept(value);
  }

  @autobind
  onBrandChange(value) {
    this.props.store.conditions.setSelectedBrand(value);
  }

  @autobind
  onMultiBrandChange(value) {
    this.props.store.conditions.setSelectedMultiBrand(value);
  }

  @autobind
  onClick(event) {
    this.props.onSearch()
  }

  addDefaultItem4Category(arr) {
    if(arr && arr instanceof Array && arr.length > 0) {
      arr.unshift({
        label: '全部',
        value: '',
        children: []
      });
      for(let o of arr) {
        if(o && o.children) {
          o.children = this.addDefaultItem4Category(o.children);
        }
      }
    }
    return arr;
  }

  //为二、三级添加'全部'项 - 一级必选，其它非必选
  @computed get categoryData() {
    const { store: { conditions } } = this.props;
    if(!conditions.categoryData) {
      return [];
    }
    const data = toJS(conditions.categoryData);
    for(let o of data) {
      if(o && o.children && o.children instanceof Array && o.children.length > 0) {
        o.children = this.addDefaultItem4Category(o.children);
      }
    }
    return data;
  }

  @computed get selectedBrand() {
    return ['' + this.props.store.conditions.selectedBrand];
  }

  @computed get selectedDate() {
    return moment(this.props.store.conditions.selectedDate);
  }

  monthFormatter(val) {
    return moment(val).format('YYYY-MM');
  }

  render() {
    const { store: { conditions } } = this.props;
    return tmpls.siteConditions(this.props, this, {
      conditions,
      moment
    });
  }
}


Conditions.propTypes = {
  showCategory: React.PropTypes.bool,
  showDate: React.PropTypes.bool,
  showBrand: React.PropTypes.bool,
  showProp: React.PropTypes.bool,
  showDept: React.PropTypes.bool,
  showDataRange: React.PropTypes.bool,
  showSKU: React.PropTypes.bool,
  showDistCenter: React.PropTypes.bool,
  showElement: React.PropTypes.bool,
  onSearch: React.PropTypes.func
};

Conditions.defaultProps = {
  showCategory: false,
  showDate: false,
  showBrand: false,
  showProp: false,
  showDept: false,
  showDataRange: false,
  showSKU: false,
  showDistCenter: false,
  showElement: false,
  onSearch: () => {},
  conditionBtnContent: '查询',
  defaultValueType: null
};
