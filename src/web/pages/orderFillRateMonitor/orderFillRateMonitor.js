import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { observer, inject } from 'mobx-react';
import nj, { taggedTmpl as njs } from 'nornj';
import { observable, computed, toJS } from 'mobx';
import { registerTmpl } from 'nornj-react';
import 'vic-common/lib/components/antd/card';
import 'vic-common/lib/components/antd/icon';
import 'vic-common/lib/components/antd/table';
import 'vic-common/lib/components/antd/tooltip';
import 'vic-common/lib/components/antd/checkbox';
import 'vic-common/lib/components/antd/datepicker';
import 'vic-common/lib/components/ECharts/pieChart';
import 'vic-common/lib/components/ECharts/barChart';
import 'echarts/lib/component/dataZoom';
import Notification from 'vic-common/lib/components/antd/notification';
import Message from 'vic-common/lib/components/antd/message';
import { autobind } from 'core-decorators';
import styles from './orderFillRateMonitor.m.scss';
import tmpls from './orderFillRateMonitor.t.html';
import '../../components/conditonsStock';

//千分位分割方法
function formatNumber(number){
    number = number+'';
    let _text = 0;
    let _int = null;
    let _float = null;
    let _len = -1;
    _text = number.indexOf('E') > -1 ? new Number(number)+'' : number ;

    let _isLt0 = _text.indexOf('-') > -1;
    _text = _isLt0 ? _text.split('-')[1] : _text;

    if(_text.indexOf('.')>-1){
        let _arr = _text.split('.');
        _int = _arr[0];
        _float = '.'+_arr[1];
        _len = _int.length;
    }else{
        _int = _text;
        _float = '';
        _len = _int.length;
    }

    if(_len > 3){
        let r = _len%3;
        let val = r>0 ? _int.slice(0,r)+","+_int.slice(r,_len).match(/\d{3}/g).join(","):_int.slice(r,_len).match(/\d{3}/g).join(",");
        return _isLt0 ? '-'+val+ _float : val+ _float;
    }else{
        return _isLt0 ? '-'+_int+ _float : _int+_float;
    }
}

//页面容器组件
@registerTmpl('OrderFillRateMonitor')
@inject('store')
@observer
export default class OrderFillRateMonitor extends Component {

  constructor(props) {
    super(props);
  }

  @autobind
  onSearch() {
    const { store: { orderFillRateMonitor, conditionsStock } } = this.props;
    const closeLoading = Message.loading('正在获取数据...', 0);
    Promise.all([
      orderFillRateMonitor.getNewOrderData({
        categoryId1: conditionsStock.selectedCategory.length > 0 ? conditionsStock.selectedCategory[0] : '',
        categoryId2: conditionsStock.selectedCategory.length > 1 ? conditionsStock.selectedCategory[1] : '',
        categoryId3: conditionsStock.selectedCategory.length > 2 ? conditionsStock.selectedCategory[2] : '',
        brandId: conditionsStock.selectedBrand,
        date: conditionsStock.selectedDate
      }),
      
    ]).then(() => {
      closeLoading();
      orderFillRateMonitor.setOrderList(orderFillRateMonitor.value);
    });
  }

  render() {
    const { store: { userSegmentation } } = this.props;

    return tmpls.orderFillRateMonitor(this.state, this.props, this, {
      styles,
      userSegmentation
    });
  }
}

//新订单
@registerTmpl('NewOrder')
@inject('store')
@observer
class NewOrder extends Component{
  state = {
    columns: [
      {
        title: '订单类型',
        dataIndex: 'type',
        width: 80,
        render: (text, record, index)=>{
          let name = '';
          switch (text){
            case 1:
              name = '预下单';
              break;
            case 2:
              name = '审核中';
              break;
            case 3:
              name = '在途';
              break;
            case 4:
              name = '完成';
              break;
            case 0:
              name = '合计';
              break;
          }
          return name;
        }
      },
      {
        title: '订单数量',
        dataIndex: 'count',
        width: 90
      },
      {
        title: '订单金额',
        dataIndex: 'sum',
        render: (text, record, index)=>{
          return formatNumber(text.toFixed(2));
        }
      }
    ]
  }

  //获取新订单图表-图例
  @autobind
  getBarData(type){
    const data = toJS(this.props.store.orderFillRateMonitor.newOrderData);
    const result = data && data.slice(0, -1);
    return result && result.map((item)=>{
      if(type){
        if(item.type == 1) { return '预下单'; }
        if(item.type == 2) { return '审核中'; }
        if(item.type == 3) { return '在途'; }
        if(item.type == 4) { return '完成'; }
      }else{
        if(item.type == 1) { return { name: '预下单', value: item.count}; }
        if(item.type == 2) { return { name: '审核中', value: item.count}; }
        if(item.type == 3) { return { name: '在途', value: item.count}; }
        if(item.type == 4) { return { name: '完成', value: item.count}; }
      }
    });
  }

  @computed get pieChartOptions(){
    return {
      tooltip: {
        show: true
      },
      legend:{
        left: 'center',
        bottom:0,
        data: this.getBarData('name')
      },
      toolbox: {
        show: false
      }
    };
  }

  @computed get pieChartData(){

    return [
      {
        type:'pie',
        label: {
            normal: {
                show: false,
            },
        },
        center: ['50%','40%'],
        radius:[0, '70%'],
        data:this.getBarData()
      }
    ];
  }

  render(){
    return tmpls.newOrder(this.state, this.props, this, {
      styles,
      data: toJS(this.props.store.orderFillRateMonitor.newOrderData)
    });
  }
}

//完成订单
@registerTmpl('CompleteOrder')
@inject('store')
@observer
class CompleteOrder extends Component{
  state = {
    options: [
      { label: '已完成采购单数', value: 'completePurchaseOrderCount' },
      { label: '已完成采购金额', value: 'completePurchaseSum' },
      { label: '订单满足率', value: 'orderFillRate' },
      { label: '平均完成周期', value: 'completeAverageCycle' },
      { label: '接受确认率', value: 'acceptConfirmRate' },
      { label: '订单履约率', value: 'orderPerformanceRate' },
      { label: '提交到确认时间', value: 'submitToConfirmDate' },
    ]
  }

  @autobind
  onChange(checkedValues){
    const { orderFillRateMonitor } = this.props.store;
    if(orderFillRateMonitor.completeOrder == 'null') return false;

    // if(checkedValues.length <= 4){
      orderFillRateMonitor.setValue(checkedValues);
      orderFillRateMonitor.setOrderList(checkedValues);
    /* }else{
      Message.error('最多只能选择4项指标');
    } */
  }

  render(){
    const { orderFillRateMonitor } = this.props.store;
    let valueSP = '-';
    orderFillRateMonitor.orderList != null && orderFillRateMonitor.orderList.forEach((item)=>{
      if(item.id == 'completePurchaseSum'){
        valueSP = item.value != '-' ? formatNumber((item.value/10000).toFixed(2)) : '-';
      }
    });
    return tmpls.completeOrder(this.state, this.props, this, {
      styles,
      value: orderFillRateMonitor.value != 'null' ? toJS(orderFillRateMonitor.value) : [],
      orderList: orderFillRateMonitor.orderList != 'null' ? toJS(orderFillRateMonitor.orderList) : [],
      valueSP,
    });
  }
}

//平均完成周期
@registerTmpl('CompleteAverageCycle')
@inject('store')
@observer
class CompleteAverageCycle extends Component{

  @autobind
  getChartData(type){
    const { orderFillRateMonitor } = this.props.store;
    if(orderFillRateMonitor.completeAverageCycle == null) return [];

    const result = orderFillRateMonitor.completeAverageCycle.map((item)=>{
      if(type == '1'){ return item.date1; }
      if(type == '2'){ return item.date2; }
      if(type == '3'){ return item.date3; }
      if(type == '4'){ 
        let val = 0;
        val += item.date1 > 0 ? item.date1 : 0;
        val += item.date2 > 0 ? item.date2 : 0;
        val += item.date3 > 0 ? item.date3 : 0;
        return val.toFixed(1);
      }
      if(type == 'name'){ return item.cityName ? item.cityName : '-'; }
    });
    return result;
  }

  @autobind
  completeAverageCycleRef(selfChart){
    const { orderFillRateMonitor } = this.props.store;
    selfChart && selfChart.chart.on('legendselectchanged', function(params){
      const selected = params.selected;
      const arr = [ Number(selected['确认时间']), Number(selected['送货时间']), Number(selected['收货时间']) ];

      if(arr.toString() != [0,0,0].toString()){
        selfChart.chart.setOption({
          tooltip : {
            
              formatter: (params)=>{
                const value = orderFillRateMonitor.getTotalDate2(arr, params[0].name);
                let val = '';
                if(params.length > 0){
                  const len = params.length;
                  val = params[0].name + '<br />'
                        + params[len-1].marker + params[len-1].seriesName + ' ' + value + '<br />';
                  params.forEach((item,i)=>{
                    if(i<len-1){
                      val += params[i].marker + params[i].seriesName + ' ' + (params[i].value != null ? params[i].value : '-') + '<br />'
                    }
                  });
                }
                return val;
              }
          },
          series: [
            {
              name: '总时间',
              label: {
                normal: {
                  show: true,
                  position: 'right',
                  formatter: (params)=>{
                    const result = orderFillRateMonitor.getTotalDate2(arr, params.name);
                    return result+'天';
                  }
                },
                emphasis: {
                  formatter: (params)=>{
                    const result = orderFillRateMonitor.getTotalDate2(arr, params.name);
                    return result+'天';
                  }
                }
              },
              data: orderFillRateMonitor.getTotalDate2(arr)
            }
          ]
        });
      }else{
        selfChart.chart.setOption({
          series: [
            {
              name: '总时间',
              data: []
            }
          ]
        });
      }
    }); 
  }
  
  @computed get barChartOptions(){
    return {
      color: ['#2c6a89', '#de463d', '#fca11e', '#ffffff'],
      tooltip : {
          trigger: 'axis',
          axisPointer : {            // 坐标轴指示器，坐标轴触发有效
              type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: (params)=>{
            const value = this.props.store.orderFillRateMonitor.getTotalDate(params[0].name);
            let val = '';
            if(params.length > 0){
              const len = params.length;
              val = params[0].name + '<br />'
                    + params[len-1].marker + params[len-1].seriesName + ' ' + value + '<br />';
              params.forEach((item,i)=>{
                if(i<len-1){
                  val += params[i].marker + params[i].seriesName + ' ' + (params[i].value != null ? params[i].value : '-') + '<br />'
                }
              });
            }
            return val;
          }
      },
      legend: {
        top: 0,
        right: 0,
        data: ['确认时间', '送货时间','收货时间'],
      },
      grid: {
          left: '3%',
          right: 110,
          bottom: '3%',
          containLabel: true
      },
      dataZoom:[
        {
          type: 'slider',
          yAxisIndex: 0,
          show: true,
          start: 0,
          end: 80,
          right: 25
        }
      ],
      xAxis:  {
          type: 'value'
      },
      yAxis: {
          type: 'category',
          data: this.getChartData('name')
      },
      toolbox: {
        show: false
      }
    };
  }

  @computed get barChartData(){
    const { orderFillRateMonitor } = this.props.store;
    return [
      {
        name: '确认时间',
        type: 'bar',
        stack: '总量',
        data: this.getChartData('1'),
      },
      {
        name: '送货时间',
        type: 'bar',
        stack: '总量',
        data: this.getChartData('2'),
      },
      {
        name: '收货时间',
        type: 'bar',
        stack: '总量',
        data: this.getChartData('3'),
      },
      {
        name: '总时间',
        type: 'bar',
        barGap: '-100%',
        z: 1,
        label: {
          normal: {
            show: true,
            position: 'right',
            textStyle: {
              color:'#000'
            },
            formatter: (params)=>{
              const result = orderFillRateMonitor.getTotalDate(params.name);
              return result != null ? result+'天' : null;
            }
          }
        },
        data: this.getChartData('4'),
      }
    ];
  }
  
  render(){
    return tmpls.completeAverageCycle(this.props, this, {styles});
  }
}