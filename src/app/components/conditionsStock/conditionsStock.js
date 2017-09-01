import * as React from 'react'
import { Component, PropTypes } from 'react';
import { observable, computed, toJS } from 'mobx'
import { observer, inject } from 'mobx-react';
import { registerComponent } from 'nornj';
import { registerTmpl } from 'nornj-react';
import { autobind } from 'core-decorators';
import styles from './conditionsStock.m.scss';
import tmpls from './conditionsStock.t.html'
import WhiteSpace from 'vic-common/lib/components/antd-mobile/whiteSpace';
import List from 'vic-common/lib/components/antd-mobile/list';
import Picker from 'vic-common/lib/components/antd-mobile/picker';
import DatePicker from 'vic-common/lib/components/antd-mobile/datePicker';
import InputItem from 'vic-common/lib/components/antd-mobile/inputItem';
import Button from 'vic-common/lib/components/antd-mobile/button';
import Toast from 'vic-common/lib/components/antd-mobile/toast';
import moment from 'moment';
import { findDOMNode } from 'react-dom';

@registerTmpl('conditionsStock')
@inject('store')
@observer
export default class ConditionsStock extends Component {

  @observable currentDateType = 'day';
  @observable selectedDateValue = moment().subtract(1, 'months');

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if(this.props.showMonthDate){
      this.props.store.conditionsStock.setSelectedDate(moment().subtract(1, 'months').format('YYYY-MM'));
    }

    let fetchList = [];
    if(this.props.showDept){
      fetchList.push(this.props.store.conditionsStock.getDeptData())
    }else{
      fetchList.push(this.props.store.conditionsStock.getCategoryData())
    }

    Toast.loading('loading...', 0);
    Promise.all(fetchList).then(() => {
      Toast.hide();
      this.props.onSearch()
    });
  }

  @autobind
  onCategoryChange(value){
    this.props.store.conditionsStock.setSelectedCategory(value);
    this.props.store.conditionsStock.getBrandData({categoryId1:value[0],categoryId2:value[1],categoryId3:value[2]});
  }

  @autobind
  onDateChange(date, dateString) {
    if(this.currentDateType == 'week'){
      const startDate = date.startOf('isoweek').format('YYYY-MM-DD');
      const endDate = date.endOf('isoweek').format('YYYY-MM-DD');
      this.props.store.conditionsStock.setSelectedDate(`${startDate},${endDate}`);
      this.selectedDateValue = date.endOf('isoweek');
    }else{
      /*
      this.props.store.conditionsStock.setSelectedDate(dateString);
      this.selectedDateValue = date;
      */
      const v = moment(date).format('YYYY-MM-DD');
      this.props.store.conditionsStock.setSelectedDate(v);
      this.selectedDateValue = date;
    }
  }

  @autobind
  onMonthDateChange(date){
    const v = moment(date).format('YYYY-MM');
    this.props.store.conditionsStock.setSelectedDate(v);
    this.selectedDateValue = date;
  }

  @autobind
  onDateDaysChange(date){
    this.props.store.conditionsStock.setSelectedDate(date);
  }

  @autobind
  onDateTypeChange(e){
    this.currentDateType = e.target.value;
    this.props.store.conditionsStock.setSelectedDateType(e.target.value);
    this.props.store.conditionsStock.setSelectedDate('');
    this.selectedDateValue = '';
    if(this.currentDateType === 'month'){
      this.props.store.conditionsStock.setSelectedDate(moment().subtract(1, 'months').format('YYYY-MM'));
    }
    if(this.currentDateType === 'week'){
      this.props.store.conditionsStock.setSelectedDate(moment().subtract(1, 'days').endOf('isoweek').format('YYYY-MM-DD'));
    }
    if(this.currentDateType === 'day'){
      this.props.store.conditionsStock.setSelectedDate(moment().subtract(1, 'days').format('YYYY-MM-DD'));
    }
  }

  @autobind
  onDeptChange(value) {
    this.props.store.conditionsStock.setSelectedDept(value[0]);
    this.props.store.conditionsStock.getCategoryData({deptId:value[0]});
  }

  @computed get brandData() {
    return this.props.store.conditionsStock.brandData.toJSON();
  }
  @computed get selectedBrand() {
    return ['' + this.props.store.conditionsStock.selectedBrand];
  }
  @autobind
  onBrandChange(value) {
    this.props.store.conditionsStock.setSelectedBrand(value);
  }

  @autobind
  onDataRangeChange(value){
    this.props.store.conditionsStock.setSelectedDataRange(value);
  }

  @autobind
  onClick(event){
    this.props.onSearch()
  }

  @autobind
  onSKUChange(val){
    this.props.store.conditionsStock.setSKUs(val);
  }

  monthFormatter(val) {
    return val.format('YYYY-MM');
  }

  render() {
    const { store: { conditionsStock } } = this.props;

    return tmpls.ConditionsStock(this.props, this, {
      styles,
      conditionsStock,
      selectedDate:moment(conditionsStock.selectedDate),
      selectedDept:[conditionsStock.selectedDept]
    });
  }
}


ConditionsStock.propTypes = {
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

ConditionsStock.defaultProps = {
  showCategory: false,
  showDate: false,
  showBrand: false,
  showProp: false,
  showDept: false,
  showDataRange: false,
  showSKU: false,
  showDistCenter: false,
  showElement: false,
  onSearch:() => {},
  conditionBtnContent: '查询'
};

