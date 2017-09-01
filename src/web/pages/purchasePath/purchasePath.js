import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { observer, inject } from 'mobx-react';
import nj, { taggedTmpl as njs } from 'nornj';
import { observable, computed, toJS } from 'mobx';
import { registerTmpl } from 'nornj-react';
import 'vic-common/lib/components/antd/card';
import 'vic-common/lib/components/antd/icon';
import 'vic-common/lib/components/antd/table';
import 'vic-common/lib/components/antd/radio';
import 'vic-common/lib/components/antd/switch';
import 'vic-common/lib/components/antd/progress';
import 'vic-common/lib/components/ECharts/lineChart';
import 'vic-common/lib/components/ECharts/barChart';
import 'echarts/lib/component/dataZoom';
import Notification from 'vic-common/lib/components/antd/notification';
import Message from 'vic-common/lib/components/antd/message';
import Modal from 'vic-common/lib/components/antd/modal';
import { autobind } from 'core-decorators';
import styles from './purchasePath.m.scss';
import tmpls from './purchasePath.t.html';
import '../../components/conditons';

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
    const { store: { purchasePath, conditions } } = this.props;
    const closeLoading = Message.loading('正在获取数据...', 0);
    const categoryId1 = conditions.selectedCategory.length > 0 ? conditions.selectedCategory[0] : '';
    const categoryId2 = conditions.selectedCategory.length > 1 ? conditions.selectedCategory[1] : '';
    const categoryId3 = conditions.selectedCategory.length > 2 ? conditions.selectedCategory[2] : '';
    Promise.all([
      purchasePath.getUserPathData({
        categoryId1: categoryId1,
        categoryId2: categoryId2,
        categoryId3: categoryId3,
        brandId: conditions.selectedBrand,
        date: conditions.selectedDate
      }),
      purchasePath.getUserPathChartNumber({
        categoryId1: categoryId1,
        categoryId2: categoryId2,
        categoryId3: categoryId3,
        brandId: conditions.selectedBrand,
        date: conditions.selectedDate
      }),
      purchasePath.getUserPathTopSku({
        categoryId1: categoryId1,
        categoryId2: categoryId2,
        categoryId3: categoryId3,
        brandId: conditions.selectedBrand,
        date: conditions.selectedDate,
        sortField: 'dataVol',
        itemSkuId: ''
      }),
      purchasePath.getUserPathTopSkuKeyword({
        categoryId1: categoryId1,
        categoryId2: categoryId2,
        categoryId3: categoryId3,
        brandId: conditions.selectedBrand,
        date: conditions.selectedDate
      }),
    ]).then(() => {
      closeLoading();
      
    });
  }

  render() {
    const { store: { purchasePath } } = this.props;

    return tmpls.purchasePath(this.state, this.props, this, {
      styles,
      purchasePath
    });
  }
}

//流量趋势
@registerTmpl('UserPathData')
@inject('store')
@observer
class UserPathData extends Component{

  @autobind
  getChartData(type){
    const { purchasePath } = this.props.store;
    if(purchasePath.userPathData == null) return [];

    const result = purchasePath.userPathData.map((item)=>{
      if(type == 'x'){
        return item.date;
      }else{
        return item.value;
      }
    });
    return result;
  }

  @computed get lineChartOptions(){
    return {
      color: ['#495f6e'],
      grid: {
        top: '3%',
          left: '3%',
          right: '3%',
          bottom: '17%',
          containLabel: true
      },
      dataZoom:[
        {
          show: true,
          start: 0,
          end: 100
        }
      ],
      xAxis: {
          type: 'category',
          axisLabel: {
            interval: 0,
            rotate: 30,
          },
          data: this.getChartData('x')
      },
      toolbox: {
        show: false
      }
    };
  }

  @computed get lineChartData(){

    return [
      {
        name:'uv流量',
        type:'line',
        smooth: true,
        data:this.getChartData()
      }
    ];
  }

  render(){
    return tmpls.userPathData(this, {styles});
  }
}

//流量来源
@registerTmpl('UserPathChartNumber')
@inject('store')
@observer
class UserPathChartNumber extends Component{
  state = {
    isShowTable: styles.hideTable,
    showDownload: styles.hideDownload,
    columns: [
      {
        title: '',
        width: 50,
        render: (text, record, index)=>{
          return index+1;
        }
      },
      {
        title: '流量来源',
        dataIndex: 'channel',
        width: 130
      },
      {
        title: '',
        width: 120,
        render: (text, record, index)=>{
          const { purchasePath } = this.props.store;
          const baseValue = purchasePath.userPathChart[0].dataVolRatioTrans;
          const value = parseFloat(Number(record.dataVolRatioTrans)) / baseValue *100;
          return nj`<ant-progress percent="{data}" strokeWidth="{5}" showInfo="{false}" status="{success}" />`({data: value});
        }
      },
      {
        title: ' 商详页点击量',
        dataIndex: 'click',
        width: 120,
        render: (text, record, index)=>{
          const value = formatNumber(text);
          return <div className="tdRight">{value}</div>;
        }
      },
      {
        title: '品牌：来源占比',
        dataIndex: 'dataVolRatioTrans',
        key: 'dataVolRatioTrans',
        width: 110,
        render: (text, record, index)=>{
          return text != null ? (text).toFixed(2)+'%' : '-';
        }
      },
      {
        title: '品牌：加购转化',
        dataIndex: 'addCartRatioTrans',
        key: 'addCartRatioTrans',
        width: 110,
        render: (text, record, index)=>{
          return text != null ? (text).toFixed(2)+'%' : '-';
        }
      },
      {
        title: '品类：来源占比',
        dataIndex: 'dataVolRatioAllTrans',
        key: 'dataVolRatioAllTrans',
        width: 110,
        render: (text, record, index)=>{
          return text != null ? (text).toFixed(2)+'%' : '-';
        }
      },
      {
        title: '品类：加购转化',
        dataIndex: 'addCartRatioAllTrans',
        key: 'addCartRatioAllTrans',
        width: 110,
        render: (text, record, index)=>{
          return text != null ? (text).toFixed(2)+'%' : '-';
        }
      },
    ]
  }

  //切换图表和表格
  @autobind
  switchChange(checked){
    checked ? this.setState({ isShowTable: styles.showTable, showDownload: styles.showDownload }) : this.setState({ isShowTable: styles.hideTable, showDownload: styles.hideDownload });
  }

  //下载
  @autobind
  download(){
    const { store: { purchasePath, conditions } } = this.props;
    const categoryId1 = conditions.selectedCategory.length > 0 ? conditions.selectedCategory[0] : '';
    const categoryId2 = conditions.selectedCategory.length > 0 ? conditions.selectedCategory[1] : '';
    const categoryId3 = conditions.selectedCategory.length > 0 ? conditions.selectedCategory[2] : '';
    purchasePath.getDownloadFile({
      categoryId1: categoryId1,
      categoryId2: categoryId2,
      categoryId3: categoryId3,
      brandId: conditions.selectedBrand,
      date: conditions.selectedDate
    }).then(()=>{
      if(purchasePath.download != null){
        Modal.success({
          title: '获取下载地址成功，请下载文件',
          content: nj`<a href="{url}" class="{styles.url}">下载</a>`({url: purchasePath.download, styles}),
          onOk: ()=>{}
        });
      }
    });
  }

  @autobind
  getChartData(type){
    const { purchasePath } = this.props.store;
    if(purchasePath.userPathChart == null) return [];

    const result = purchasePath.userPathChart.map((item)=>{
      if(type == 'name'){ return item.channel; }
      if(type == 'dataVolRatioTrans'){ return item.dataVolRatioTrans ? item.dataVolRatioTrans.toFixed(2) : '-'; }
      if(type == 'addCartRatioTrans'){ return item.addCartRatioTrans? item.addCartRatioTrans.toFixed(2) : '-'; }
      if(type == 'dataVolRatioAllTrans'){ return item.dataVolRatioAllTrans ? item.dataVolRatioAllTrans.toFixed(2) : '-'; }
      if(type == 'addCartRatioAllTrans'){ return item.addCartRatioAllTrans ? item.addCartRatioAllTrans.toFixed(2) : '-'; }
    });
    return result;
  }

  @computed get barChartOptions(){
    return {
      color: ['#638ca6', '#79abcb', '#fdb449', '#b26a00'],
      tooltip : {
          trigger: 'axis',
          axisPointer : {            // 坐标轴指示器，坐标轴触发有效
              type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: (params)=>{
            let val = '';
            if(params.length > 0){
              const len = params.length;
              val = params[0].name + '<br />';
              params.forEach((item)=>{
                const value = item.value != '-' ? item.value+'%' : item.value;
                val += item.marker + item.seriesName + ' ' + value + '<br />'
              });
            }
            return val;
          }
      },
      legend: {
        top: 0,
        right: 0,
        data: ['品牌-流量占比', '品牌-加购转化率','品类-流量占比','品类-加购转化率'],
      },
      grid: {
          left: '1%',
          right: 0,
          bottom: '19%',
          containLabel: true
      },
      dataZoom:[
        {
          show: true,
          start: 0,
          end: 6
        }
      ],
      xAxis: {
          type: 'category',
          axisLabel: {
            rotate: 30,
          },
          data: this.getChartData('name')
      },
      yAxis: {
          type: 'value',
          axisLabel: {
              formatter: '{value}%'
          }
      },
      toolbox: {
        show: false
      }
    }
  }

  @computed get barChartData(){
    return [
      {
        name: '品牌-流量占比',
        type: 'bar',
        stack: '总量',
        barMaxWidth: 70,
        data: this.getChartData('dataVolRatioTrans'),
      },
      {
        name: '品牌-加购转化率',
        type: 'bar',
        stack: '总量',
        barMaxWidth: 70,
        data: this.getChartData('addCartRatioTrans'),
      },
      {
        name:'品类-流量占比',
        type:'line',
        smooth: true,
        data: this.getChartData('dataVolRatioAllTrans'),
      },
      {
        name:'品类-加购转化率',
        type:'line',
        smooth: true,
        data: this.getChartData('addCartRatioAllTrans'),
      }
    ];
  }
  
  render(){
    const { purchasePath } = this.props.store;

    return tmpls.userPathChartNumber(this.state, this, {
      styles,
      userPathNumber: purchasePath.userPathNumber != null ? purchasePath.userPathNumber : [],
      dataSource: purchasePath.userPathChart != null ? toJS(purchasePath.userPathChart) : [],
      scroll: { y: 380 },
      bordered: true
    });
  }
}

//爆款SKU
@registerTmpl('UserPathTopSku')
@inject('store')
@observer
class UserPathTopSku extends Component{
  state = {
    columns: [
      {
        title: '排名',
        dataIndex: 'rank',
        width: 50,
      },
      {
        title: 'Sku ID',
        dataIndex: 'itemSkuId',
        width: 100,
      },
      {
        title: 'Sku 名称',
        dataIndex: 'itemName',
        width: 290,
        render: (text, record, index)=>{
          return <div className="tdLeft">{text}</div>;
        }
      },
      {
        title: '浏览量',
        dataIndex: 'dataVol',
        width: 80,
        render: (text, record, index)=>{
          const value = formatNumber(text);
          return <div className="tdRight">{value}</div>;
        }
      },
      {
        title: '加购量',
        dataIndex: 'addCartCnt',
        width: 90,
        render: (text, record, index)=>{
          const value = formatNumber(text);
          return <div className="tdRight">{value}</div>;
        }
      },
      {
        title: '加购转化率',
        dataIndex: 'addCartRatio',
        width: 90,
        render: (text, record, index)=>{
          return (parseFloat(text)).toFixed(2)+'%';
        }
      },
      {
        title: '下单量',
        dataIndex: 'purchaseCnt',
        width: 90,
      },
      {
        title: '下单转化率',
        dataIndex: 'purchaseRatio',
        width: 90,
        render: (text, record, index)=>{
          return (parseFloat(text)).toFixed(2)+'%';
        }
      },
      {
        title: '流量来源',
        width: 90,
        render: (text, record, index)=>{
          const key = record.key;
          return nj`<div style="{obj('cursor' :('pointer'))}" onClick="${this.showTemplateView(key)}">查看</div>`({key});
        },
      },
    ],
    bordered: true,
    scroll: {
      y: 600
    },
    visible: false,
    inputValue: '',
    isSkuID: false,
    //modal 参数
    width: 900,
    modalScroll: {
      y: 380
    },
    modalColumns: [
      {
        title: '',
        dataIndex: 'rank',
        width: 50
      },
      {
        title: '流量来源',
        dataIndex: 'channel',
        width: 100
      },
      {
        title: '',
        width: 100,
        render: (text, record, index)=>{
          const baseValue = this.state.modalDataSource[0].dataVolRatio;
          const value = parseFloat(Number(record.dataVolRatio)) / baseValue *100;
          return nj`<ant-progress percent="{data}" strokeWidth="{5}" showInfo="{false}" status="{success}" />`({data: value});
        }
      },
      {
        title: '商详页点击量',
        dataIndex: 'dataVol',
        width: 100,
        render: (text, record, index)=>{
          const value = formatNumber(text);
          return <div className="tdRight">{value}</div>;
        }
      },
      {
        title: '来源占比',
        dataIndex: 'dataVolRatio',
        width: 100,
        render: (text, record, index)=>{
          return (parseFloat(text)).toFixed(2)+'%';
        }
      },
      {
        title: '加购转化',
        dataIndex: 'addCartRatio',
        width: 100,
        render: (text, record, index)=>{
          return (parseFloat(text)).toFixed(2)+'%';
        }
      },
    ],
    isShowChart: styles.hideChart,
    modalTitle: '',
    modalDataSource: [],
    data: [],
    checked: false
  }

  //输入sku id
  @autobind
  inputChange(e){
    const value = e.target.value;
    const reg = /^\d+$/;
    if(reg.test(value) || value.length == 0){
      this.setState({ inputValue: e.target.value });
    }
  }

  //提交sku id 后查询
  @autobind
  inputSubmit(e){
    const value = e.target.value;
    const { store: { purchasePath, conditions } } = this.props;
    
    const closeLoading = Message.loading('正在获取数据...', 0);
    const categoryId1 = conditions.selectedCategory.length > 0 ? conditions.selectedCategory[0] : '';
    const categoryId2 = conditions.selectedCategory.length > 1 ? conditions.selectedCategory[1] : '';
    const categoryId3 = conditions.selectedCategory.length > 2 ? conditions.selectedCategory[2] : '';
    purchasePath.getUserPathTopSku({
      categoryId1: categoryId1,
      categoryId2: categoryId2,
      categoryId3: categoryId3,
      brandId: conditions.selectedBrand,
      date: conditions.selectedDate,
      sortField: purchasePath.sortField,
      itemSkuId: value
    }).then(() => {
      closeLoading();
    });
  }

  //查看数据
  @autobind
  showTemplateView(id){
    return e=>{
      const { store: { purchasePath } } = this.props;
      
      purchasePath.userPathTopSku.forEach((item)=>{
        if(item.key == id){
          const modalDataSource = item.subItem;

          this.setState({
            modalTitle: item.itemName,
            modalDataSource,
            data: modalDataSource,
            isShowChart: styles.hideChart,
            checked: false,
            visible: true,
          });
        }
      });
    }
  }

  //切换图表和表格
  @autobind
  switchChange(checked){
    checked ? this.setState({ checked: true, isShowChart: styles.showChart }) : this.setState({ checked: false, isShowChart: styles.hideChart });
  }

  //关闭查看窗口
  @autobind
  closeModal(){
    this.setState({ visible: false });
  }

  //切换排序
  @autobind
  radioChange(e){
    const sortField = e.target.value;
    const { store: { purchasePath, conditions } } = this.props;
    purchasePath.setSortField(sortField);
    const closeLoading = Message.loading('正在获取数据...', 0);
    const categoryId1 = conditions.selectedCategory.length > 0 ? conditions.selectedCategory[0] : '';
    const categoryId2 = conditions.selectedCategory.length > 1 ? conditions.selectedCategory[1] : '';
    const categoryId3 = conditions.selectedCategory.length > 2 ? conditions.selectedCategory[2] : '';
      
    purchasePath.getUserPathTopSku({
      categoryId1: categoryId1,
      categoryId2: categoryId2,
      categoryId3: categoryId3,
      brandId: conditions.selectedBrand,
      date: conditions.selectedDate,
      sortField
    }).then(() => {
      closeLoading();
      
    });
  }

  render(){
    const { purchasePath } = this.props.store;

    return tmpls.userPathTopSku(this.state, this, {
      styles,
      dataSource: purchasePath.userPathTopSku != null ? toJS(purchasePath.userPathTopSku) : [],
    });
  }
}

//爆款sku modal图表
@registerTmpl('BarChart')
@inject('store')
@observer
class BarChart extends Component{

  @autobind
  getChartData(type){
    const { purchasePath } = this.props.store;

    const result = this.props.data.map((item)=>{
      if(type == 'channel'){ 
        return item.channel; 
      }else{ 
        return (item.dataVolRatio).toFixed(2);
      }
    });
    return result;
  }

   @computed get barChartOptions(){
    return {
      color: ['#495f6e'],
      tooltip : {
          trigger: 'axis',
          axisPointer : {            // 坐标轴指示器，坐标轴触发有效
              type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: (params)=>{
            let val = '';
            if(params.length > 0){
              const len = params.length;
              val = params[0].name + '<br />';
              params.forEach((item)=>{
                val += item.marker + item.seriesName + ' ' + (item.value != null ? item.value+'%' : '-') + '<br />'
              });
            }
            return val;
          }
      },
      grid: {
        top: '3%',
          left: '1%',
          right: '1%',
          bottom: '10%',
          containLabel: true
      },
      dataZoom:[
        {
          show: true,
          start: 0,
          end: 60
        }
      ],
      xAxis: {
          type: 'category',
          data: this.getChartData('channel')
      },
      yAxis: {
          type: 'value',
          axisLabel: {
              formatter: '{value}%'
          }
      },
      toolbox: {
        show: false
      }
    }
  } 

   @computed get barChartData(){
    return [
      {
        name: '品牌-流量占比',
        type: 'bar',
        data: this.getChartData(),
      }
    ];
  } 

  render(){
    return tmpls.barChart(this, {styles});
  }
}

//热搜词转化
@registerTmpl('UserPathTopSkuKeyword')
@inject('store')
@observer
class UserPathTopSkuKeyword extends Component{

  render(){
    const { purchasePath } = this.props.store;
    const data = purchasePath.userPathTopSkuKeyword != null && purchasePath.userPathTopSkuKeyword.map((item)=>{
      item.map((subItem)=>{
        subItem.value = formatNumber(subItem.keyword_cnt);
        return subItem;
      });
      return item;
    });

    return tmpls.userPathTopSkuKeyword(this, {
      styles,
      // data: purchasePath.userPathTopSkuKeyword != null ? purchasePath.userPathTopSkuKeyword : [],
      data,
    });
  }
}