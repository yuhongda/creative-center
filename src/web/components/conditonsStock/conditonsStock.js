import * as React from 'react'
import { Component, PropTypes } from 'react';
import { Link } from 'react-router-dom';
import { observable, toJS } from 'mobx'
import { observer, inject } from 'mobx-react';
import { registerComponent } from 'nornj';
import { registerTmpl } from 'nornj-react';
import { autobind } from 'core-decorators';
import './conditonsStock.scss';
import tmpls from './conditonsStock.t.html';
import Message from 'vic-common/lib/components/antd/message';
import 'vic-common/lib/components/antd/input';
import 'vic-common/lib/components/antd/button';
import 'vic-common/lib/components/antd/cascader';
import 'vic-common/lib/components/antd/datepicker';
import 'vic-common/lib/components/antd/select';
import 'vic-common/lib/components/antd/radio';
import moment from 'moment';
import { findDOMNode } from 'react-dom';

@registerTmpl('conditionsStock')
@inject('store')
@observer
export default class ConditionsStock extends Component {

  @observable currentDateType = 'day';
  @observable selectedDateValue = '';

  constructor(props) {
    super(props);
  }

  componentDidMount() {

    if(this.props.showMonthDate){
      this.props.store.conditionsStock.setSelectedDate(moment().subtract(1, 'months').format('YYYY-MM'));
    }else{
      this.props.store.conditionsStock.setSelectedDate(moment().subtract(1, 'days').format('YYYY-MM-DD'));
    }

    const closeLoading = Message.loading('正在获取数据...', 0);
    let fetchList = [];
    if(this.props.showDept){
      fetchList.push(this.props.store.conditionsStock.getDeptData());
    }
    fetchList.push(this.props.store.conditionsStock.getCategoryData());
    fetchList.push(this.props.store.conditionsStock.getBrandData({categoryId1:null,categoryId2:null,categoryId3:null}));

    Promise.all(fetchList).then(() => {
      closeLoading();
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
      let now = moment();
      const startDate = date.startOf('isoweek').format('YYYY-MM-DD');
      let endDate = date.endOf('isoweek').format('YYYY-MM-DD');

      if(date.endOf('isoweek') > now){
        endDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
      }

      this.props.store.conditionsStock.setSelectedDate(`${startDate},${endDate}`);      
      this.selectedDateValue = date.endOf('isoweek');
    }else{
      this.props.store.conditionsStock.setSelectedDate(dateString);
      this.selectedDateValue = date;
    }
  }

  @autobind
  onMonthDateChange(date, dateString){
      this.props.store.conditionsStock.setSelectedDate(dateString);
  }

  @autobind
  onDateDaysChange(date, dateString){
      this.props.store.conditionsStock.setSelectedDate(dateString);
  }

  @autobind
  onDateTypeChange(e){
    this.currentDateType = e.target.value;
    this.props.store.conditionsStock.setSelectedDateType(e.target.value);
    this.props.store.conditionsStock.setSelectedDate('');
    this.selectedDateValue = '';
    if(this.currentDateType == 'month'){
      this.props.store.conditionsStock.setSelectedDate(moment().subtract(0, 'months').format('YYYY-MM'));
    }
    if(this.currentDateType == 'week'){
      const startDate = moment().subtract(1, 'days').startOf('isoweek').format('YYYY-MM-DD');
      const endDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
      this.props.store.conditionsStock.setSelectedDate(`${startDate},${endDate}`);
    }
    if(this.currentDateType == 'day'){
      this.props.store.conditionsStock.setSelectedDate(moment().subtract(1, 'days').format('YYYY-MM-DD'));      
    }
  }

  @autobind
  onDeptChange(value) {
    this.props.store.conditionsStock.setSelectedDept(value);
    this.props.store.conditionsStock.getCategoryData({deptId:value});
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
  onSKUChange(e){
    const value = e.target.value.replace(/，/ig, ',');
    this.props.store.conditionsStock.setSKUs(value);
  }

  @autobind
  disabledDate(date){
    let now = moment().subtract(1, 'days'),
        start = moment('2017-07-31');

    if(date >= now || date <= start){
      return true;
    }else{
      return false;
    }
  }

  @autobind
  disabledMonth(date){
    let start = moment('2017-07-31'),
        end = moment('2017-09-01');
    if(date > start && date < end){
      return false;
    }else{
      return true;
    }
  }

  render() {
    const { store: { conditionsStock } } = this.props;

    let _selectedDate = conditionsStock.selectedDate;
    if(_selectedDate){
      if(conditionsStock.selectedDate.split(',').length == 2){
        _selectedDate = moment(conditionsStock.selectedDate.split(',')[1]);
      }else{
        _selectedDate = moment(conditionsStock.selectedDate);        
      }
    }else{
      _selectedDate = moment().subtract(1, 'days')
    }

    return tmpls.siteConditions(this.props, this, {
      conditionsStock,
      lastMonth:moment().subtract(0, 'months'),
      selectedDate:_selectedDate
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

