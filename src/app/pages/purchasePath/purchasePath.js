import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import nj from 'nornj';
import { observable, computed, toJS } from 'mobx'
import { registerTmpl } from 'nornj-react';
import { autobind } from 'core-decorators';
import styles from './purchasePath.m.scss';
import tmpls from './purchasePath.t.html';
import Toast from 'vic-common/lib/components/antd-mobile/toast';
import Card from 'vic-common/lib/components/antd-mobile/card';
import WingBlank from 'vic-common/lib/components/antd-mobile/wingBlank';
import WhiteSpace from 'vic-common/lib/components/antd-mobile/whiteSpace';
import List from 'vic-common/lib/components/antd-mobile/list';
import Picker from 'vic-common/lib/components/antd-mobile/picker';
import Flex from 'vic-common/lib/components/antd-mobile/flex';
import Button from 'vic-common/lib/components/antd-mobile/button';
import Icon from 'vic-common/lib/components/antd-mobile/icon';
import echarts from 'echarts/lib/echarts';
import 'vic-common/lib/components/ECharts/lineChart';
import 'vic-common/lib/components/ECharts/barChart';
import 'echarts/lib/component/dataZoom';
import '../../components/conditions/conditions';
import { ConfigDPR } from '../../config/chart';
import { GetChartOptionWithBase } from '../../utils/utils';
import { showPopup, popupRenderHeader } from '../../utils/common';

const MAXLISTLENGTH = 30;

const iconTableSwitch = require('../../images/icon-table-switch.svg');

const getQueryParams = obj => {
  const params = {
    categoryId1: '',
    categoryId2: '',
    categoryId3: '',
    brandId: '',
    sku: '',
    date: '', //dateFormat(new Date(), 'yyyy-mm-dd')
    sortField: "dataVol"
  };
  const cs = obj && obj.props && obj.props.store && obj.props.store.conditions ? obj.props.store.conditions : null;
  if(cs) {
    const selectedCategory = cs.selectedCategory instanceof Array ? cs.selectedCategory : null;
    params.categoryId1 = selectedCategory && selectedCategory.length > 0 ? selectedCategory[0] : '';
    params.categoryId2 = selectedCategory && selectedCategory.length > 1 ? selectedCategory[1] : '';
    params.categoryId3 = selectedCategory && selectedCategory.length > 2 ? selectedCategory[2] : '';
    params.brandId = cs.selectedBrand || '';
    params.sku = cs.skuList || '';
    params.date = cs.selectedDate
  }
  return params;
};

@registerTmpl('PurchasePath')
@inject('store')
@observer
export default class PurchasePath extends Component {
  constructor(props) {
    super(props);
    this.maxListLength = MAXLISTLENGTH;
  }

  componentDidMount() {
    this.props.store.header.setPageTitle(this.props.moduleName);
/*    Toast.loading('loading...');
    Promise.all([

    ]).then(() => Toast.hide());*/
  }

  @autobind
  onSearch() {
    Toast.loading('loading...');
    const { store: { purchasePath } } = this.props;
    const params = getQueryParams(this);
    Promise.all([
      purchasePath.getUserPathData(params),
      purchasePath.getUserPathChartNumber(params),
      purchasePath.getUserPathTopSku(params),
      purchasePath.getUserPathTopSkuKeyword(params)
    ]).then(() => {
      Toast.hide();
    })
  }

  @autobind
  onShowSKUClick() {
    const { userPathTopSku } = this.props.store.purchasePath;
    const hasMore = userPathTopSku && userPathTopSku.length > this.maxListLength;
    const headerTitle = '爆款SKU' + (hasMore ? ` (前${this.maxListLength}条)` : '');
    const data = userPathTopSku ? userPathTopSku.toJSON().slice(0, this.maxListLength) : [];
    showPopup(headerTitle, data && data.length > 0 ? (<div>
        {data.map((i, index) => (
          <List.Item key={index}>
            <List.Item.Brief>
              <div style={{whiteSpace:'normal',textOverflow:'visible',overflow:'visible',color:'#000'}}>{i.rank} {i.itemName}</div>
              <Flex>
                <Flex.Item>浏览量：{i.dataVol}</Flex.Item>
              </Flex>
              <Flex>
                <Flex.Item>加购量：{i.addCartCnt}</Flex.Item>
                <Flex.Item style={{flex:2,textAlign:'right'}}>加购转化率：{i.addCartRatio}%</Flex.Item>
              </Flex>
              <Flex>
                <Flex.Item>下单量：{i.purchaseCnt}</Flex.Item>
                <Flex.Item style={{flex:2,textAlign:'right'}}>下单转化率：{i.purchaseRatio}%</Flex.Item>
              </Flex>
            </List.Item.Brief>
          </List.Item>
        ))}
    </div>) : null);
  }

  @autobind
  onShowHotKeywordClick() {
    const { userPathTopSkuKeyword } = this.props.store.purchasePath;
    let tmp = [];
    for(let arr of toJS(userPathTopSkuKeyword)) {
      if(arr instanceof Array && arr.length > 0) {
        tmp = tmp.concat(arr);
      }
    }
    const hasMore = tmp && tmp.length > this.maxListLength;
    const headerTitle = '热搜词转化' + (hasMore ? ` (前${this.maxListLength}条)` : '');
    const data = tmp ? tmp.slice(0, this.maxListLength) : [];
    showPopup(headerTitle, data && data.length > 0 ? (<div>
        {data.map((i, index) => (
          <List.Item key={index} extra={`${i.precent}%`}>
          {`${index+1} ${i.keyword} (${i.keyword_cnt}次`})
          </List.Item>
        ))}
    </div>) : null);
  }

  render() {
    return tmpls.PurchasePath(this.state, this.props, this, {
      styles
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
    return GetChartOptionWithBase({
      grid: {
        top: 10 * ConfigDPR.DPR,
        bottom: 30 * ConfigDPR.DPR,
        containLabel: true
      },
      dataZoom:[
        {
          show: true,
          start: 0,
          end: 40,
          showDetail: false
        }
      ],
      xAxis: {
        type: 'category',
        data: this.getChartData('x')
      },
      toolbox: {
        show: false
      },
      series: [
        {
          name:'流量趋势',
          type:'line',
          smooth: true,
          data:this.getChartData()
        }
      ]
    });
  }

  render(){
    return tmpls.userPathData(this, {styles});
  }
}

//流量转化来源
@registerTmpl('UserPathChartNumber')
@inject('store')
@observer
class UserPathChartNumber extends Component{

  state = {/*
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
          return nj`<ant-progress percent="{data}" strokeWidth="{5}" showInfo="{false}" />`({data: parseFloat(Number(record.dataVolRatioTrans))});
        }
      },
      {
        title: ' 商详页点击量',
        dataIndex: 'click',
        width: 120
      },
      {
        title: '品牌',
        children: [
          {
            title: ' 来源占比',
            dataIndex: 'dataVolRatioTrans',
            key: 'dataVolRatioTrans',
            width: 110,
            render: (text, record, index)=>{
              return text != null ? text+'%' : '-';
            }
          },
          {
            title: ' 加购转化',
            dataIndex: 'addCartRatioTrans',
            key: 'addCartRatioTrans',
            width: 110,
            render: (text, record, index)=>{
              return text != null ? text+'%' : '-';
            }
          }
        ]
      },
      {
        title: '品类',
        children: [
          {
            title: ' 来源占比',
            dataIndex: 'dataVolRatioAllTrans',
            key: 'dataVolRatioAllTrans',
            width: 110,
            render: (text, record, index)=>{
              return text != null ? text+'%' : '-';
            }
          },
          {
            title: ' 加购转化',
            dataIndex: 'addCartRatioAllTrans',
            key: 'addCartRatioAllTrans',
            width: 110,
            render: (text, record, index)=>{
              return text != null ? text+'%' : '-';
            }
          },
        ]
      }
    ]*/
  }

  /*
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
  }*/

  @autobind
  onUserPathChartNumberTableClick() {
    const { userPathChart } = this.props.store.purchasePath;
    const hasMore = userPathChart && userPathChart.length > MAXLISTLENGTH;
    const headerTitle = '流量转化来源' + (hasMore ? ` (前${MAXLISTLENGTH}条)` : '');
    const data = userPathChart ? userPathChart.toJSON().slice(0, MAXLISTLENGTH) : [];
    const popupContent = data && data.length > 0 ? (<div>
        {data.map((i, index) => (
          <List.Item key={index}>
            {`${i.channel}（点击：${i.click}）`}
            <List.Item.Brief>
              <Flex>
                <Flex.Item>品牌</Flex.Item>
                <Flex.Item style={{flex: 2}}>
                  来源占比:{i.dataVolRatioTrans === null ? '无' : `${i.dataVolRatioTrans}%`}
                </Flex.Item>
                <Flex.Item style={{flex: 2}}>
                  加购转化:{i.addCartRatioTrans === null ? '无' : `${i.addCartRatioTrans}%`}
                </Flex.Item>
              </Flex>
              <Flex>
                <Flex.Item>品类</Flex.Item>
                <Flex.Item style={{flex: 2}}>
                  来源占比:{i.dataVolRatioAllTrans === null ? '无' : `${i.dataVolRatioAllTrans}%`}
                </Flex.Item>
                <Flex.Item style={{flex: 2}}>
                  加购转化:{i.addCartRatioAllTrans === null ? '无' : `${i.addCartRatioAllTrans}%`}
                </Flex.Item>
              </Flex>
            </List.Item.Brief>
          </List.Item>
        ))}
    </div>) : null;
    showPopup(headerTitle, popupContent);
  }

  @autobind
  getChartData(type){
    const { purchasePath } = this.props.store;
    if(purchasePath.userPathChart === null) return [];

    const result = purchasePath.userPathChart.map((item)=>{
      if(type === 'name'){ return item.channel; }
      if(type === 'dataVolRatioTrans'){ return (item.dataVolRatioTrans).toFixed(2); }
      if(type === 'addCartRatioTrans'){ return (item.addCartRatioTrans).toFixed(2); }
      if(type === 'dataVolRatioAllTrans'){ return (item.dataVolRatioAllTrans).toFixed(2); }
      if(type === 'addCartRatioAllTrans'){ return (item.addCartRatioAllTrans).toFixed(2); }
    });
    return result;
  }

  @computed get barChartOptions(){
    return GetChartOptionWithBase({
      grid: {
        top: 50 * ConfigDPR.DPR,
        bottom: 25 * ConfigDPR.DPR,
        containLabel: true
      },
      color: ['#638ca6', '#f0b2ae', '#fdb449'],
      tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
          type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: (params)=>{
          const _string = params[0].name + '<br />'
            + params[0].seriesName +':'+ (params[0].value?(parseFloat(params[0].value).toFixed(2)):'-') + '%' + '<br />'
            + params[1].seriesName +':'+ (params[1].value?(parseFloat(params[1].value).toFixed(2)):'-') + '%' + '<br />'
            + params[2].seriesName +':'+ (params[2].value?(parseFloat(params[2].value).toFixed(2)):'-') + '%' + '<br />'
            + params[3].seriesName +':'+ (params[3].value?(parseFloat(params[3].value).toFixed(2)):'-') + '%';
          return _string;
        }
      },
      legend: {
        top: 0,
        right: 0,
        data: ['品牌-流量占比', '品牌-加购转化率','品类-流量占比','品类-加购转化率'],
      },
      dataZoom:[
        {
          show: true,
          start: 0,
          end: 20,
          showDetail: false
        }
      ],
      xAxis: {
        type: 'category',
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
      },
      series: [
        {
          name: '品牌-流量占比',
          type: 'bar',
          stack: '总量',
          data: this.getChartData('dataVolRatioTrans'),
        },
        {
          name: '品牌-加购转化率',
          type: 'bar',
          stack: '总量',
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
      ]
    });
  }

  render(){
    const { purchasePath } = this.props.store;

    return tmpls.userPathChartNumber(this.state, this, {
      styles,
      userPathNumber: purchasePath.userPathNumber != null ? purchasePath.userPathNumber : [],
      iconTableSwitch: iconTableSwitch
      //dataSource: purchasePath.userPathChart != null ? toJS(purchasePath.userPathChart) : [],
      //scroll: { y: 420 },
      //bordered: true
    });
  }
}

/*
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
      },
      {
        title: '浏览量',
        dataIndex: 'dataVol',
        width: 80,
      },
      {
        title: '加购量',
        dataIndex: 'addCartCnt',
        width: 90,
      },
      {
        title: '转化率',
        dataIndex: 'addCartRatio',
        width: 80,
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
        title: '转化率',
        dataIndex: 'purchaseRatio',
        width: 80,
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
          return nj`<ant-progress percent="{data}" strokeWidth="{5}" showInfo="{false}" />`({data: parseFloat(record.dataVolRatio)});
        }
      },
      {
        title: '商详页点击量',
        dataIndex: 'dataVol',
        width: 100
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

    if( value.length > 0 ){
      //purchasePath.userPathTopSku
      purchasePath.setUserPathTopSkuSearchResult(value);
    }else{
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
        sortField: purchasePath.sortField
      }).then(() => {
        closeLoading();
      });
    }
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
      dataSource: purchasePath.userPathTopSku !== null ? toJS(purchasePath.userPathTopSku) : [],
    });
  }
}
*/