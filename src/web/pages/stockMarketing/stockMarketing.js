import React, { Component } from 'react';
import { observable, computed, toJS } from 'mobx'
import { observer, inject } from 'mobx-react';
import nj from 'nornj';
import { registerTmpl } from 'nornj-react';
import 'vic-common/lib/components/antd/button';
import 'vic-common/lib/components/antd/switch';
import 'vic-common/lib/components/antd/table';
import 'vic-common/lib/components/antd/select';
import 'vic-common/lib/components/antd/input';
import 'vic-common/lib/components/antd/icon';
import 'vic-common/lib/components/antd/popover';
import 'vic-common/lib/components/antd/upload';
import 'vic-common/lib/components/antd/checkbox';
import 'vic-common/lib/components/antd/radio';
import 'vic-common/lib/components/antd/modal';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/component/calendar';
import 'echarts/map/js/china';
import 'echarts/lib/component/dataZoom';
import 'vic-common/lib/components/ECharts/lineChart';
import 'vic-common/lib/components/ECharts/barChart';
import 'vic-common/lib/components/ECharts/mapChart';
import Message from 'vic-common/lib/components/antd/message';
import graphic from 'echarts/lib/util/graphic.js'
import { autobind } from 'core-decorators';
import styles from './stockMarketing.m.scss';
import tmpls from './stockMarketing.t.html';
import '../../components/conditonsStock';
import { dateFormat, getGeoCoordMap } from '../../misc/util'
import { findDOMNode } from 'react-dom';
import Notification from '../../../utils/notification';
import beforeRoute from '../../misc/beforeRoute'
import moment from 'moment';



//页面容器组件
@inject('store')
@observer
@registerTmpl('StockMarketing')
// @beforeRoute
export default class StockMarketing extends Component {

  constructor(props) {
      super(props);
  }

  componentDidMount() {
  }

  @autobind
  onSearch(){
    const closeLoading = Message.loading('正在获取数据...', 0),
          searchConditions = {
            deptId: this.props.store.conditionsStock.selectedDept || '',
            categoryId1: this.props.store.conditionsStock.selectedCategory[0] || '',
            categoryId2: this.props.store.conditionsStock.selectedCategory[1] || '',
            categoryId3: this.props.store.conditionsStock.selectedCategory[2] || '',
            brandId: this.props.store.conditionsStock.selectedBrand || '',
            dataRange: this.props.store.conditionsStock.selectedDataRange || '',
            date: this.props.store.conditionsStock.selectedDate,
            dateType:this.props.store.conditionsStock.selectedDateType || '',
            tableStartType:this.tableDownloadSortType
          };
    Promise.all([
      this.props.store.stockMarketing.getSummaryData(searchConditions),
      this.props.store.stockMarketing.getMapData(Object.assign({}, searchConditions, {storeType:this.props.store.stockMarketing.filterSmallObject ? '0' : '1'})),
      this.props.store.stockMarketing.getLevelOneData(searchConditions),
      this.props.store.stockMarketing.getBandData(searchConditions),
      this.props.store.stockMarketing.getTrendsData(searchConditions)
    ]).then(() => {
      closeLoading();
    });
  }

  render() {
    return tmpls.stockMarketing(this.state, this.props, this, {
      styles
    });
  }
}

/**
 * summary
 * 
 * @class StockMarketingSummary
 * @extends {Component}
 */
@registerTmpl('stockMarketingSummary')
@inject('store')
@observer
class StockMarketingSummary extends Component {

  constructor(props) {
    super(props);
    this.popCntPV = nj`<div>有货PV/总PV</div>`();
    this.popCntInStock = nj`<ul>
                              <li>
                                中小件各地现货率平均，现货率=有货SKU数/总上柜SKU数
                              </li>
                            </ul>`();
    this.popCntInStockBig = nj`<ul>
                              <li>
                                大件各地现货率平均，现货率=有货SKU数/总上柜SKU数
                              </li>
                            </ul>`();
    this.popCntBigSales = nj`<ul>
                              <li>
                                中小件各地畅销品现货率平均，畅销品现货率=畅销品有货SKU数/畅销品总上柜SKU数
                              </li>
                            </ul>`();
    this.popCntBigSalesBig = nj`<ul>
                              <li>
                                大件各地畅销品现货率平均，畅销品现货率=畅销品有货SKU数/畅销品总上柜SKU数
                              </li>
                            </ul>`();
    this.popCntTransferDays = nj`<ul>
                              <li>
                                库存件数/日均销量
                              </li>
                            </ul>`();
    this.popCntUnsales = nj`<ul>
                              <li>
                                直销库存件数/总库存件数
                              </li>
                            </ul>`();
  }

  componentDidMount() {
    
  }

  render() {
    const { store: { stockMarketing } } = this.props;
    return tmpls.stockMarketingSummary(this.state, this.props, this, {
      styles,
      stockMarketing,
      iconGraph:require('../../images/icon-graph-2.png')
    });
  }
}


/**
 * map
 * 
 * @class StockMarketingMap
 * @extends {Component}
 */
@registerTmpl('stockMarketingMap')
@inject('store')
@observer
class StockMarketingMap extends Component {

  @observable currentTab = this.props.store.stockMarketing.tabItems ? toJS(this.props.store.stockMarketing.tabItems).filter(item=>item.checked)[0].value : 'stockMoney'; // 'stockMoney' | 'pv' | 'inStock' | 'inStockBig' | 'transferDays' | 'bigSales' | 'bigSalesBig' | 'unsales'
  @observable currentView = 0; // 'map':0 | 'chart':1 | 'table':2
  @observable dlgTargetSettingVisible = false;
  @observable ddlItems = [];
  @observable selectedType = 'pv';//'pv' | 'inStock' | 'transferDays' | 'bigSales' | 'unsales'
  @observable tableType = '0'; // 'all' | 'small' | 'big'
  @observable tableDownloadType = 'brand'; // 'brand' | 'category1' | 'category2' | 'category3'
  @observable tableDownloadSortType = 'brand'; // 'brand' | 'category'

  @computed get indexType(){
    if(this.currentTab == 'pv'){
      return 'PV'
    }
    return this.currentTab.replace(/( |^)[a-z]/g, (L) => L.toUpperCase())
  }

  @computed get targetText(){
    switch (this.selectedType){
      case 'pv':
        return '(0~100%)'
      break;
      case 'inStock':
        return '(0~100%)'
      break;
      case 'inStockBig':
        return '(0~100%)'
      break;
      case 'transferDays':
        return '(0~9999天)'
      break;
      case 'bigSales':
        return '(0~100%)'          
      break;
      case 'bigSalesBig':
        return '(0~100%)'          
      break;
      case 'unsales':
        return '(0~100%)'
      break;
    }
  }

  /**
   * map option
   * 
   * @readonly
   * @memberof StockMarketingMap
   */
  @computed get mapOption(){
    let self = this;
    return {
      tooltip: {
          trigger: 'item',
          formatter: function (params) {
            switch (self.currentTab){
              case 'stockMoney':
                return params.name + ' : ' + (params.value[2]/10000).toFixed(2);
              break;
              case 'pv':
                return params.name + ' : ' + (params.value[2]*100).toFixed(2) + '%';
              break;
              case 'inStock':
                return params.name + ' : ' + (params.value[2]*100).toFixed(2) + '%';
              break;
              case 'inStockBig':
                return params.name + ' : ' + (params.value[2]*100).toFixed(2) + '%';
              break;
              case 'transferDays':
                return params.name + ' : ' + params.value[2] + '天';
              break;
              case 'bigSales':
                return params.name + ' : ' + (params.value[2]*100).toFixed(2) + '%';
              break;
              case 'bigSalesBig':
                return params.name + ' : ' + (params.value[2]*100).toFixed(2) + '%';
              break;
              case 'unsales':
                return params.name + ' : ' + (params.value[2]*100).toFixed(2) + '%';
              break;
              default:
                _data = '';
              break;
            }
          }
      },
      legend: {
          orient: 'vertical',
          left: 'left',
          data:['区域详情']
      },
      geo: {
          map: 'china',
          label: {
              emphasis: {
                  show: false
              }
          },
          itemStyle: {
              normal: {
                  areaColor: '#f1f1f1',
                  borderColor: '#333'
              },
              emphasis: {
                  areaColor: '#ccc'
              }
          }
      },
      toolbox:{show:false}
    };
  }

  convertData(data) {
    var res = [];
    for (var i = 0; i < data.length; i++) {
        var geoCoord = getGeoCoordMap()[data[i].name];
        if (geoCoord) {
            res.push({
                name: data[i].name,
                value: geoCoord.concat(data[i].value),
                symbolSize: data[i].symbolSize,
            });
        }
    }
    return res;
  }


  @computed get mapData(){

    let _data = [], max = 0, _symbolSize = 30;

    switch (this.currentTab){
      case 'stockMoney':
        _data = this.props.store.stockMarketing.mapDataStockMoney && this.props.store.stockMarketing.mapDataStockMoney.map(item=>{
          // item.value = parseFloat((item.value / 10000).toFixed(2));
          return item;
        });
      break;
      case 'pv':
        _data = this.props.store.stockMarketing.mapDataPV;
      break;
      case 'inStock':
        _data = this.props.store.stockMarketing.mapDataInStock;
      break;
      case 'inStockBig':
        _data = this.props.store.stockMarketing.mapDataInStockBig;
      break;
      case 'transferDays':
        _data = this.props.store.stockMarketing.mapDataTransferDays;
      break;
      case 'bigSales':
        _data = this.props.store.stockMarketing.mapDataBigSales;
      break;
      case 'bigSalesBig':
        _data = this.props.store.stockMarketing.mapDataBigSalesBig;
      break;
      case 'unsales':
        _data = this.props.store.stockMarketing.mapDataUnsales;
      break;
      default:
        _data = [];
      break;
    }


    _data && _data.forEach(item=>{
      if(item.value > max){
        max = item.value;
      }
    })
    return [
        {
            name: '库存金额',
            type: 'scatter',
            coordinateSystem: 'geo',
            symbolSize: 12,
            label: {
                normal: {
                    show: false
                },
                emphasis: {
                    show: false
                }
            },
            itemStyle: {
              emphasis: {
                  borderColor: '#fff',
                  borderWidth: 1
              }
            },
            data:_data && this.convertData(toJS(_data).map(item=>{
              const _size = parseInt(_symbolSize * (item.value / max),10);
              
              return {
                name:item.name,
                value:item.value,
                symbolSize: _size < 12 ? 12 : _size
              }
            }))
        }
    ];
  }

  /**
   * 一级品类option
   * 
   * @readonly
   * @memberof StockMarketingMap
   */
  @computed get barLevelOneOption(){
    let _data = [], unit = '';

    switch (this.currentTab){
      case 'stockMoney':
        _data = this.props.store.stockMarketing.l1DataStockMoney && this.props.store.stockMarketing.l1DataStockMoney[1];
      break;
      case 'pv':
        _data = this.props.store.stockMarketing.l1DataPV && this.props.store.stockMarketing.l1DataPV[1];
        unit = '%';
      break;
      case 'inStock':
        _data = this.props.store.stockMarketing.l1DataInStock && this.props.store.stockMarketing.l1DataInStock[1];
        unit = '%';
      break;
      case 'inStockBig':
        _data = this.props.store.stockMarketing.l1DataInStockBig && this.props.store.stockMarketing.l1DataInStockBig[1];
        unit = '%';
      break;
      case 'transferDays':
        _data = this.props.store.stockMarketing.l1DataTransferDays && this.props.store.stockMarketing.l1DataTransferDays[1];
      break;
      case 'bigSales':
        _data = this.props.store.stockMarketing.l1DataBigSales && this.props.store.stockMarketing.l1DataBigSales[1];
        unit = '%';
      break;
      case 'bigSalesBig':
        _data = this.props.store.stockMarketing.l1DataBigSalesBig && this.props.store.stockMarketing.l1DataBigSalesBig[1];
        unit = '%';
      break;
      case 'unsales':
        _data = this.props.store.stockMarketing.l1DataUnsales && this.props.store.stockMarketing.l1DataUnsales[1];
        unit = '%';
      break;
      default:
        _data = [];
      break;
    }

    return {
      tooltip: {
          trigger: 'axis',
          axisPointer: {
              type: 'shadow'
          },
          formatter:function(params){
              var result = `<div>${params[0].name}</div>`;
              params.forEach(function (item) {
                  result += `<div>
                                  <span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:${item.color}"></span>
                                  <span>${item.seriesName}:</span>
                                  <span>${item.data || '--'}${unit}</span>
                              </div>`;
              });
              return result
          }
      },
      grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
      },
      yAxis: {
          type: 'category',
          data: toJS(_data)
      },
      toolbox:{show:false}
    };
  }

  @computed get barLevelOneData(){
    let _data = [];

    switch (this.currentTab){
      case 'stockMoney':
        _data = this.props.store.stockMarketing.l1DataStockMoney && this.props.store.stockMarketing.l1DataStockMoney[0].map(item=>(item / 10000).toFixed(2));
      break;
      case 'pv':
        _data = this.props.store.stockMarketing.l1DataPV && this.props.store.stockMarketing.l1DataPV[0].map(item=>(item*100).toFixed(2));
      break;
      case 'inStock':
        _data = this.props.store.stockMarketing.l1DataInStock && this.props.store.stockMarketing.l1DataInStock[0].map(item=>(item*100).toFixed(2));
      break;
      case 'inStockBig':
        _data = this.props.store.stockMarketing.l1DataInStockBig && this.props.store.stockMarketing.l1DataInStockBig[0].map(item=>(item*100).toFixed(2));
      break;
      case 'transferDays':
        _data = this.props.store.stockMarketing.l1DataTransferDays && this.props.store.stockMarketing.l1DataTransferDays[0];
      break;
      case 'bigSales':
        _data = this.props.store.stockMarketing.l1DataBigSales && this.props.store.stockMarketing.l1DataBigSales[0].map(item=>(item*100).toFixed(2));
      break;
      case 'bigSalesBig':
        _data = this.props.store.stockMarketing.l1DataBigSalesBig && this.props.store.stockMarketing.l1DataBigSalesBig[0].map(item=>(item*100).toFixed(2));
      break;
      case 'unsales':
        _data = this.props.store.stockMarketing.l1DataUnsales && this.props.store.stockMarketing.l1DataUnsales[0].map(item=>(item*100).toFixed(2));
      break;
      default:
        _data = [];
      break;
    }

    return [
      {
          name: '',
          type: 'bar',
          barWidth:'30px',
          data: toJS(_data)
      }
    ]
  }

  /**
   * band option
   * 
   * @readonly
   * @memberof StockMarketingMap
   */
  @computed get barStockMoneyBandOption(){
    return {
      tooltip : {
          trigger: 'axis',
          axisPointer : {
              type : 'shadow'
          },
          formatter:function(params){
            var result = `<div>${params[0].name}</div>`;
            params.forEach(function (item) {
                result += `<div>
                            <span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:${item.color}"></span>
                            <span>${item.seriesName}:</span>
                            <span>${item.data ? (item.data*100).toFixed() : '--'}%</span>
                        </div>`;
            });
            return result
        }
      },
      legend: {
          left: 'right',
          data: toJS(this.props.store.stockMarketing.bandDataStockMoney && this.props.store.stockMarketing.bandDataStockMoney[this.props.store.stockMarketing.bandDataStockMoney.length - 1])
      },
      grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
      },
      xAxis:  {
          type: 'value',
          axisLabel:{
            formatter:function(value, index){
                return value*100+'%'
            }
          }
      },
      yAxis: {
          type: 'category',
          data: ['库存金额分布','销售金额分布']
      },
      toolbox:{show:false}
    }
  }

  @computed get barStockMoneyBandData(){

    if(this.props.store.stockMarketing.bandDataStockMoney){
      let _tmpData = toJS(this.props.store.stockMarketing.bandDataStockMoney);
      let total1 = 0, total2 = 0;
      _tmpData.slice(0,-1).forEach((item, i)=>{
        total1 += item[0];
        total2 += item[1];
      });

      let _data = _tmpData.slice(0,-1).map((item, i) => {
        return {
            name: _tmpData[_tmpData.length-1][i],
            type: 'bar',
            stack: '总量',
            label: {
                normal: {
                    show: true,
                    position: 'insideRight',
                    formatter : function (params){
                        return (params.value * 100).toFixed() + '%'
                    }
                }
            },
            barWidth:'50px',
            data: [(item[0] / total1), (item[1] / total2)]
        }
      });
      return _data;
    }else{
      return [];
    }

  }

  @computed get barBandOption(){
    let _data = [];

    switch (this.currentTab){
      case 'stockMoney':
        _data = [];
      break;
      case 'pv':
        _data = this.props.store.stockMarketing.bandDataPV && this.props.store.stockMarketing.bandDataPV[1];
      break;
      case 'inStock':
        _data = this.props.store.stockMarketing.bandDataInStock && this.props.store.stockMarketing.bandDataInStock[1];
      break;
      case 'inStockBig':
        _data = this.props.store.stockMarketing.bandDataInStockBig && this.props.store.stockMarketing.bandDataInStockBig[1];
      break;
      case 'transferDays':
        _data = this.props.store.stockMarketing.bandDataTransferDays && this.props.store.stockMarketing.bandDataTransferDays[1];
      break;
      case 'bigSales':
        _data = this.props.store.stockMarketing.bandDataBigSales && this.props.store.stockMarketing.bandDataBigSales[1];
      break;
      case 'bigSalesBig':
        _data = this.props.store.stockMarketing.bandDataBigSalesBig && this.props.store.stockMarketing.bandDataBigSalesBig[1];
      break;
      case 'unsales':
        _data = this.props.store.stockMarketing.bandDataUnsales && this.props.store.stockMarketing.bandDataUnsales[1];
      break;
      default:
        _data = [];
      break;
    }

    let self = this;
    return {
      grid: {
          left: '3%',
          right: '4%',
          top:'15%',
          bottom:'5%',
          containLabel: true
      },
      legend:{
        show:true,
        right:0,
        top:0,
        data: []
      },
      tooltip: {
          show: true,
          trigger: 'axis',
          formatter:function(params){
              var result = `<div>${params[0].name}</div>`;
              params.forEach(function (item) {
                result += `<div>
                                <span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:${item.color}"></span>
                                <span>${item.seriesName}:</span>
                                <span>${item.data.value || '--'}${self.currentTab == 'transferDays'?'天':'%'}</span>
                            </div>`;
              });
              return result
          }
      },
      toolbox:{show:false},
      xAxis: {
          type: 'category',
          boundaryGap: true,      
          splitLine:{
              show:true,
              lineStyle:{
                  color:'#e5e5e5'
              }
          },
          axisLine:{
              lineStyle:{
                  color:'#e5e5e5'
              }
          },
          axisLabel:{
              textStyle:{
                  color:'#333'
              }
          },
          data: toJS(_data)
      },
      yAxis: {
          type: 'value',
          scale:true,
          splitLine:{
              show:true,
              lineStyle:{
                  color:'#e5e5e5'
              }
          },
          axisLine:{
              lineStyle:{
                  color:'#e5e5e5'
              }
          },
          axisLabel:{
              textStyle:{
                  color:'#333'
              }
          }
      }
    };
  };
  @computed get barBandData(){
    let _data = [];

    switch (this.currentTab){
      case 'stockMoney':
        _data = [];
      break;
      case 'pv':
        _data = this.props.store.stockMarketing.bandDataPV && this.props.store.stockMarketing.bandDataPV[0].map(item=>(item*100).toFixed(2));
      break;
      case 'inStock':
        _data = this.props.store.stockMarketing.bandDataInStock && this.props.store.stockMarketing.bandDataInStock[0].map(item=>(item*100).toFixed(2));
      break;
      case 'inStockBig':
        _data = this.props.store.stockMarketing.bandDataInStockBig && this.props.store.stockMarketing.bandDataInStockBig[0].map(item=>(item*100).toFixed(2));
      break;
      case 'transferDays':
        _data = this.props.store.stockMarketing.bandDataTransferDays && this.props.store.stockMarketing.bandDataTransferDays[0];
      break;
      case 'bigSales':
        _data = this.props.store.stockMarketing.bandDataBigSales && this.props.store.stockMarketing.bandDataBigSales[0].map(item=>(item*100).toFixed(2));
      break;
      case 'bigSalesBig':
        _data = this.props.store.stockMarketing.bandDataBigSalesBig && this.props.store.stockMarketing.bandDataBigSalesBig[0].map(item=>(item*100).toFixed(2));
      break;
      case 'unsales':
        _data = this.props.store.stockMarketing.bandDataUnsales && this.props.store.stockMarketing.bandDataUnsales[0].map(item=>(item*100).toFixed(2));
      break;
      default:
        _data = [];
      break;
    }

    const barColor = ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3']

    return [
      {
        name:'Band',
        type:'bar',
        barWidth:'50px',        
        data: _data && toJS(_data).map((item, i)=>{
          return {
            value: item,
            itemStyle:{
              normal:{
                color:barColor[i%barColor.length]
              }
            }
          }
        })
      }
    ];
  };

  @computed get trendsChartOptions(){
    let _data = [];
    
    switch (this.currentTab){
      case 'stockMoney':
        _data = this.props.store.stockMarketing.trendsDataStockMoney && toJS(this.props.store.stockMarketing.trendsDataStockMoney[4]);
      break;
      case 'pv':
        _data = this.props.store.stockMarketing.trendsDataPV && toJS(this.props.store.stockMarketing.trendsDataPV[2]);
      break;
      case 'inStock':
        _data = this.props.store.stockMarketing.trendsDataInStock && toJS(this.props.store.stockMarketing.trendsDataInStock[2]);
      break;
      case 'inStockBig':
        _data = this.props.store.stockMarketing.trendsDataInStockBig && toJS(this.props.store.stockMarketing.trendsDataInStockBig[2]);
      break;
      case 'transferDays':
        _data = this.props.store.stockMarketing.trendsDataTransferDays && toJS(this.props.store.stockMarketing.trendsDataTransferDays[2]);
      break;
      case 'bigSales':
        _data = this.props.store.stockMarketing.trendsDataBigSales && toJS(this.props.store.stockMarketing.trendsDataBigSales[2]);
      break;
      case 'bigSalesBig':
        _data = this.props.store.stockMarketing.trendsDataBigSalesBig && toJS(this.props.store.stockMarketing.trendsDataBigSalesBig[2]);
      break;
      case 'unsales':
        _data = this.props.store.stockMarketing.trendsDataUnsales && toJS(this.props.store.stockMarketing.trendsDataUnsales[2]);
      break;
      default:
        _data = [];
      break;
    }

    return {
      grid: {
          left: '3%',
          right: '4%',
          top:'15%',
          bottom:'3%',
          containLabel: true
      },
      legend:{
        show:true,
        right:0,
        top:0,
        data: ['库存金额', '在库金额', '内配在途金额', '采购在途金额']
      },
      tooltip: {
          show: true,
          trigger: 'axis',
          formatter:function(params){
              var result = `<div>${params[0].name}</div>`,
                  unit = '';
              if(['库存金额', '在库金额', '内配在途金额', '采购在途金额','周转天数'].indexOf(params[0].seriesName)>=0){
                if(params[0].seriesName == '周转天数'){
                  unit = '天'
                }else{
                  unit = ''
                }
              }else{
                unit = '%'
              }
              params.forEach(function (item) {
                  result += `<div>
                                  <span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:${item.color}"></span>
                                  <span>${item.seriesName}:</span>
                                  <span>${item.data || '--'}${unit}</span>
                              </div>`;
              });
              return result
          }
      },
      toolbox:{show:false},
      xAxis: {
          type: 'category',
          boundaryGap: false,      
          splitLine:{
              show:true,
              lineStyle:{
                  color:'#e5e5e5'
              }
          },
          axisLine:{
              lineStyle:{
                  color:'#e5e5e5'
              }
          },
          axisLabel:{
              textStyle:{
                  color:'#333'
              }
          },
          data: _data
      },
      yAxis: {
          type: 'value',
          scale:true,
          min:0,
          splitLine:{
              show:true,
              lineStyle:{
                  color:'#e5e5e5'
              }
          },
          axisLine:{
              lineStyle:{
                  color:'#e5e5e5'
              }
          },
          axisLabel:{
              textStyle:{
                  color:'#333'
              }
          }
      }
    };
  };
  @computed get trendsChartData(){

    let _data = [];

    switch (this.currentTab){
      case 'stockMoney':
        _data = [
          {
            name: '库存金额',
            type:'line',
            smooth: true,
            data: toJS(this.props.store.stockMarketing.trendsDataStockMoney && this.props.store.stockMarketing.trendsDataStockMoney[0].map(item=>(item/10000).toFixed(2)))
          },
          {
            name: '在库金额',
            type:'line',
            smooth: true,
            data: toJS(this.props.store.stockMarketing.trendsDataStockMoney && this.props.store.stockMarketing.trendsDataStockMoney[1].map(item=>(item/10000).toFixed(2)))
          },
          {
            name:'内配在途金额',
            type:'line',
            smooth: true,
            data:toJS(this.props.store.stockMarketing.trendsDataStockMoney && this.props.store.stockMarketing.trendsDataStockMoney[2].map(item=>(item/10000).toFixed(2)))
          },
          {
            name:'采购在途金额',
            type:'line',
            smooth: true,
            data:toJS(this.props.store.stockMarketing.trendsDataStockMoney && this.props.store.stockMarketing.trendsDataStockMoney[3].map(item=>(item/10000).toFixed(2)))
          }
        ];
      break;
      case 'pv':
        _data = [
          {
            name: 'PV现货率',
            type:'line',
            smooth: true,
            data: toJS(this.props.store.stockMarketing.trendsDataPV && this.props.store.stockMarketing.trendsDataPV[1].map(item=>(item*100).toFixed(2)))
          },
          {
            name: '目标值',
            type:'line',
            smooth: true,
            data: toJS(this.props.store.stockMarketing.trendsDataPV && this.props.store.stockMarketing.trendsDataPV[0].map(item=>(item*100).toFixed(2)))
          }
        ];
      break;
      case 'inStock':
        _data = [
          {
            name: '实物现货率',
            type:'line',
            smooth: true,
            data: toJS(this.props.store.stockMarketing.trendsDataInStock && this.props.store.stockMarketing.trendsDataInStock[1].map(item=>(item*100).toFixed(2)))
          },
          {
            name: '目标值',
            type:'line',
            smooth: true,
            data: toJS(this.props.store.stockMarketing.trendsDataInStock && this.props.store.stockMarketing.trendsDataInStock[0].map(item=>(item*100).toFixed(2)))
          }
        ];
      break;
      case 'inStockBig':
        _data = [
          {
            name: '实物现货率',
            type:'line',
            smooth: true,
            data: toJS(this.props.store.stockMarketing.trendsDataInStockBig && this.props.store.stockMarketing.trendsDataInStockBig[1].map(item=>(item*100).toFixed(2)))
          },
          {
            name: '目标值',
            type:'line',
            smooth: true,
            data: toJS(this.props.store.stockMarketing.trendsDataInStockBig && this.props.store.stockMarketing.trendsDataInStockBig[0].map(item=>(item*100).toFixed(2)))
          }
        ];
      break;
      case 'transferDays':
        _data = [
          {
            name: '周转天数',
            type:'line',
            smooth: true,
            data: toJS(this.props.store.stockMarketing.trendsDataTransferDays && this.props.store.stockMarketing.trendsDataTransferDays[1])
          },
          {
            name: '目标值',
            type:'line',
            smooth: true,
            data: toJS(this.props.store.stockMarketing.trendsDataTransferDays && this.props.store.stockMarketing.trendsDataTransferDays[0])
          }
        ];
      break;
      case 'bigSales':
        _data = [
          {
            name: '畅销品现货率',
            type:'line',
            smooth: true,
            data: toJS(this.props.store.stockMarketing.trendsDataBigSales && this.props.store.stockMarketing.trendsDataBigSales[1].map(item=>(item*100).toFixed(2)))
          },
          {
            name: '目标值',
            type:'line',
            smooth: true,
            data: toJS(this.props.store.stockMarketing.trendsDataBigSales && this.props.store.stockMarketing.trendsDataBigSales[0].map(item=>(item*100).toFixed(2)))
          }
        ];
      break;
      case 'bigSalesBig':
        _data = [
          {
            name: '畅销品现货率',
            type:'line',
            smooth: true,
            data: toJS(this.props.store.stockMarketing.trendsDataBigSalesBig && this.props.store.stockMarketing.trendsDataBigSalesBig[1].map(item=>(item*100).toFixed(2)))
          },
          {
            name: '目标值',
            type:'line',
            smooth: true,
            data: toJS(this.props.store.stockMarketing.trendsDataBigSalesBig && this.props.store.stockMarketing.trendsDataBigSalesBig[0].map(item=>(item*100).toFixed(2)))
          }
        ];
      break;
      case 'unsales':
        _data = [
          {
            name: '滞销占比',
            type:'line',
            smooth: true,
            data: toJS(this.props.store.stockMarketing.trendsDataUnsales && this.props.store.stockMarketing.trendsDataUnsales[1].map(item=>(item*100).toFixed(2)))
          },
          {
            name: '目标值',
            type:'line',
            smooth: true,
            data: toJS(this.props.store.stockMarketing.trendsDataUnsales && this.props.store.stockMarketing.trendsDataUnsales[0].map(item=>(item*100).toFixed(2)))
          }
        ];
      break;
      default:
        _data = [];
      break;
    }
    

    return _data;
  } 

  @computed get tableColumns(){
    switch (this.currentTab){
      case 'stockMoney':
        return this.props.store.stockMarketing.tableDataStockMoney && [{title:'类目（万元）',dataIndex:'category',key:'category',width: '300px'}].concat(toJS(this.props.store.stockMarketing.tableDataStockMoney[0]));
      break;
      case 'pv':
        return this.props.store.stockMarketing.tableDataPV && [{title:'类目（%）',dataIndex:'category',key:'category',width: '300px'}].concat(toJS(this.props.store.stockMarketing.tableDataPV[0]));
      break;
      case 'inStock':
        return this.props.store.stockMarketing.tableDataInStock && [{title:'类目（%）',dataIndex:'category',key:'category',width: '300px'}].concat(toJS(this.props.store.stockMarketing.tableDataInStock[0]));
      break;
      case 'inStockBig':
        return this.props.store.stockMarketing.tableDataInStockBig && [{title:'类目（%）',dataIndex:'category',key:'category',width: '300px'}].concat(toJS(this.props.store.stockMarketing.tableDataInStockBig[0]));
      break;
      case 'transferDays':
        return this.props.store.stockMarketing.tableDataTransferDays && [{title:'类目（天）',dataIndex:'category',key:'category',width: '300px'}].concat(toJS(this.props.store.stockMarketing.tableDataTransferDays[0]));
      break;
      case 'bigSales':
        return this.props.store.stockMarketing.tableDataBigSales && [{title:'类目（%）',dataIndex:'category',key:'category',width: '300px'}].concat(toJS(this.props.store.stockMarketing.tableDataBigSales[0]));
      break;
      case 'bigSalesBig':
        return this.props.store.stockMarketing.tableDataBigSalesBig && [{title:'类目（%）',dataIndex:'category',key:'category',width: '300px'}].concat(toJS(this.props.store.stockMarketing.tableDataBigSalesBig[0]));
      break;
      case 'unsales':
        return this.props.store.stockMarketing.tableDataUnsales && [{title:'类目（%）',dataIndex:'category',key:'category',width: '300px'}].concat(toJS(this.props.store.stockMarketing.tableDataUnsales[0]));
      break;
    }
  }

  @computed get tableData(){
    switch (this.currentTab){
      case 'stockMoney':
        return toJS(this.props.store.stockMarketing.tableDataStockMoney && this.props.store.stockMarketing.tableDataStockMoney[1]);
      break;
      case 'pv':
        return toJS(this.props.store.stockMarketing.tableDataPV && this.props.store.stockMarketing.tableDataPV[1]);
      break;
      case 'inStock':
        return toJS(this.props.store.stockMarketing.tableDataInStock && this.props.store.stockMarketing.tableDataInStock[1]);
      break;
      case 'inStockBig':
        return toJS(this.props.store.stockMarketing.tableDataInStockBig && this.props.store.stockMarketing.tableDataInStockBig[1]);
      break;
      case 'transferDays':
        return toJS(this.props.store.stockMarketing.tableDataTransferDays && this.props.store.stockMarketing.tableDataTransferDays[1]);
      break;
      case 'bigSales':
        return toJS(this.props.store.stockMarketing.tableDataBigSales && this.props.store.stockMarketing.tableDataBigSales[1]);
      break;
      case 'bigSalesBig':
        return toJS(this.props.store.stockMarketing.tableDataBigSalesBig && this.props.store.stockMarketing.tableDataBigSalesBig[1]);
      break;
      case 'unsales':
        return toJS(this.props.store.stockMarketing.tableDataUnsales && this.props.store.stockMarketing.tableDataUnsales[1]);
      break;
    }
  }

  @computed get tableScroll(){
    if(this.tableColumns && this.tableColumns.length > 5){
      return {x:this.tableColumns.length*100, y: 500}
    }else{
      return { y: 500}
    }
  }

  @computed get monthTarget(){
    switch (this.selectedType){
      case 'pv':
        return this.props.store.stockMarketing.targetDataPV || [];
      break;
      case 'inStock':
        return this.props.store.stockMarketing.targetDataInStock || [];
      break;
      case 'inStockBig':
        return this.props.store.stockMarketing.targetDataInStockBig || [];
      break;
      case 'transferDays':
        return this.props.store.stockMarketing.targetDataTransferDays || [];
      break;
      case 'bigSales':
        return this.props.store.stockMarketing.targetDataBigSales || [];
      break;
      case 'bigSalesBig':
        return this.props.store.stockMarketing.targetDataBigSalesBig || [];
      break;
      case 'unsales':
        return this.props.store.stockMarketing.targetDataUnsales || [];
      break;
      default:
        _data = [];
      break;
    }
  }

  constructor(props) {
    super(props);
  }

  getConditions(){
    const now = new Date();
    const prevDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()-1);
    
    return {
      deptId: this.props.store.conditionsStock.selectedDept || '',
      categoryId1: this.props.store.conditionsStock.selectedCategory[0] || '',
      categoryId2: this.props.store.conditionsStock.selectedCategory[1] || '',
      categoryId3: this.props.store.conditionsStock.selectedCategory[2] || '',
      brandId: this.props.store.conditionsStock.selectedBrand || '',
      date: this.props.store.conditionsStock.selectedDate || moment().subtract(1, 'days').format('YYYY-MM-DD'),      
      dataRange: this.props.store.conditionsStock.selectedDataRange || '',
      tableType:this.tableType == 0 ? '' : this.tableType,
      dateType:this.props.store.conditionsStock.selectedDateType || '',
      storeType: this.tableType == 0 ? '' : (this.tableType == 1 ? 0 : 1)
    };
  }

  @autobind
  onTabClick(value){
    return (e) => {
      this.currentTab = value;

      switch (this.currentTab){
        case 'inStock':
          this.tableType = 1;
        break;
        case 'inStockBig':
          this.tableType = 2;
        break;
        case 'bigSales':
          this.tableType = 1;
        break;
        case 'bigSalesBig':
          this.tableType = 2;
        break;
        default:
          this.tableType = 0;
        break;
      }
    }
  }

  @autobind
  switchView(index){
    return (e) => {
      this.currentView = index;

      const closeLoading = Message.loading('正在获取数据...', 0),
            searchConditions = this.getConditions(),
            fetchList = [];
      if(index == 1){
        fetchList.push(this.props.store.stockMarketing.getTrendsData(searchConditions));
      }else if(index == 2){
        fetchList.push(this.props.store.stockMarketing.getTableData(Object.assign({}, searchConditions, {tableStartType:this.tableDownloadSortType})));
      }
      Promise.all(fetchList).then(() => {
        closeLoading();
      });
    };
  }

  @autobind
  showSettingDlg(){
    Promise.all([
      this.props.store.stockMarketing.getTargetData(this.getConditions())
    ]).then(() => {
      this.dlgTargetSettingVisible = true;
    });
  }

  @autobind
  dlgTargetSettingOk(){
    this.props.store.stockMarketing.postTargetValue().then((result) => {
      if (result.success) {
        Notification.success({ description: '设置目标数据成功！', duration: 1.5 });
      } else {
        Notification.error({ description: '设置目标数据异常，请重试。', duration: 1.5 });
      }
    });
    this.dlgTargetSettingVisible = false;
  }

  @autobind
  dlgTargetSettingCancel(){
    this.dlgTargetSettingVisible = false;    
  }

  @autobind
  onTypeChange(value){
    this.selectedType = value;
  }

  @autobind
  onMonthTargetChanged(index){
    return (e) => {
      const regEx = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
      if(e.target.value==''){
          this.props.store.stockMarketing.setTargetValue(index, e.target.value == '' ? null : parseFloat(e.target.value), this.selectedType);
      }else{
        if(regEx.test(e.target.value)){
          let isValid = true;

          if(this.selectedType == 'transferDays'){
            if(!(parseFloat(e.target.value) >= 0 && parseFloat(e.target.value) <= 9999)){
              isValid = false
            }
          }else{
            if(!(parseFloat(e.target.value) >= 0 && parseFloat(e.target.value) <= 100)){
              isValid = false
            }
          }
          if(isValid){
            this.props.store.stockMarketing.setTargetValue(index, e.target.value == '' ? null : parseFloat(e.target.value), this.selectedType);
          }
        }
      }
    }
  }

  @autobind
  filterSmallObject(checked){
    this.props.store.stockMarketing.setFilterSmallObject(checked);
    const closeLoading = Message.loading('正在获取数据...', 0),
          searchConditions = this.getConditions();
    Promise.all([
      this.props.store.stockMarketing.getMapData(Object.assign({}, searchConditions, {storeType:(this.props.store.stockMarketing.filterSmallObject ? '0' : '1')}))
    ]).then(() => {
      closeLoading();
    });
  }

  @autobind
  onTypeChecked(index){
    return (e) => {
      this.props.store.stockMarketing.checkTabItems(index, e.target.checked);
    }
  }

  @autobind
  onTableToolbarChange(e){
    this.tableType = e.target.value;

    const closeLoading = Message.loading('正在获取数据...', 0);
    let searchConditions = this.getConditions();
    if(this.tableType == 1){
      searchConditions = Object.assign({}, searchConditions, {storeType:'0'})
    }else if(this.tableType == 2){
      searchConditions = Object.assign({}, searchConditions, {storeType:'1'})      
    }else{
      searchConditions = Object.assign({}, searchConditions, {storeType:''})
    }
    Promise.all([
      this.props.store.stockMarketing.getTableData(Object.assign({}, searchConditions, {tableStartType:this.tableDownloadSortType}))
    ]).then(() => {
      closeLoading();
    });
  }

  @autobind
  downloadEvent(){
    findDOMNode(this.refs.formExport).submit();
  }

  @autobind
  tableDownloadTypeChanged(value){
    this.tableDownloadType = value;
  }

  @autobind
  preventHide(triggerNode){
    return triggerNode.parentNode;
  }


  @autobind
  onTableDownloadSortTypeChange(e){
    this.tableDownloadSortType = e.target.value;
    if(this.tableDownloadSortType == 'brand'){
      this.tableDownloadType = 'brand';
    }else{
      this.tableDownloadType = 'category1';      
    }

    const closeLoading = Message.loading('正在获取数据...', 0);
    let searchConditions = this.getConditions();
    Promise.all([
      this.props.store.stockMarketing.getTableData(Object.assign({}, searchConditions, {tableStartType:this.tableDownloadSortType}))
    ]).then(() => {
      closeLoading();
    });
  }

  componentDidMount() {
    this.ddlItems = [
      {name:'PV现货率',value:'pv'},
      {name:'实物现货率(中小件)',value:'inStock'},
      {name:'实物现货率(大件)',value:'inStockBig'},
      {name:'周转天数',value:'transferDays'},
      {name:'畅销品现货率(中小件)',value:'bigSales'},
      {name:'畅销品现货率(大件)',value:'bigSalesBig'},
      {name:'滞销占比',value:'unsales'}
    ]

  }

  render() {
    const { store: { stockMarketing, conditionsStock } } = this.props;
    const uploadProps = {
      name: 'file',
      action: `${__HOST}/stockMarketing/setHotSkus`,
      accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
      beforeUpload(file){
        const filename = file.name.split('.');
        if(filename[filename.length-1] == 'xlsx' || filename[filename.length-1] == 'xls'){
          return true;
        }else{
          Notification.error({ description: `文件类型不正确，只能上传Excell文件。`, duration: 1.5 });
          return false;
        }
      },
      onChange(info) {
        if (info.file.status === 'done') {
          if(info.file.response.data.length == 0){
            Notification.success({ description: `上传成功`, duration: 1.5 });
          }else{
            Notification.error({ description: `SKU: ${info.file.response && info.file.response.data.join(',')} 上传失败`, duration: null });          
          }
        } else if (info.file.status === 'error') {
            Notification.error({ description: `${info.file.name} 上传失败`, duration: null });          
        }
        
      }
    };

    const dlgTargetSettingCnt = tmpls.dlgTargetSettings(this.state, this.props, this, {
      styles,
      stockMarketing
    });

    const popUploadCnt = tmpls.popUploadCnt(this.state, this.props, this, {
      styles,
      uploadProps,
      conditions: this.getConditions(),
      downloadUrl: `${__HOST}/stockMarketing/getHotSkuTemplate`,
      downloadUrlHotSku:`${__HOST}/stockMarketing/getHotSkus`
    });

    const popTableDownloadCnt = tmpls.popTableDownloadCnt(this.state, this.props, this, {
      styles,
      conditions: this.getConditions(),
      downloadUrl: `${__HOST}/stockMarketing/getTableDataExcel`
    });

    const popTypeCnt = tmpls.popTypeCnt(this.state, this.props, this, {
      styles,
      stockMarketing
    });

    return tmpls.stockMarketingMap(this.state, this.props, this, {
      styles,
      dlgTargetSettingCnt,
      popUploadCnt,
      popTableDownloadCnt,
      popTypeCnt,
      stockMarketing,
      conditions: this.getConditions(),
      downloadUrl: `${__HOST}/stockMarketing/getTableDataExcel`
    });
  }
}


