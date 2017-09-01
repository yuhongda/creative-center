import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import nj from 'nornj';
import { observable, computed, toJS } from 'mobx'
import { registerTmpl } from 'nornj-react';
import { autobind } from 'core-decorators';
import styles from './stockMarketing.m.scss';
import tmpls from './stockMarketing.t.html';
import Toast from 'vic-common/lib/components/antd-mobile/toast';
import Card from 'vic-common/lib/components/antd-mobile/card';
import Switch from 'vic-common/lib/components/antd-mobile/switch';
import WingBlank from 'vic-common/lib/components/antd-mobile/wingBlank';
import WhiteSpace from 'vic-common/lib/components/antd-mobile/whiteSpace';
import List from 'vic-common/lib/components/antd-mobile/list';
import Picker from 'vic-common/lib/components/antd-mobile/picker';
import Flex from 'vic-common/lib/components/antd-mobile/flex';
import Button from 'vic-common/lib/components/antd-mobile/button';
import Icon from 'vic-common/lib/components/antd-mobile/icon';
import echarts from 'echarts/lib/echarts';
import 'echarts/map/js/china';
import 'vic-common/lib/components/ECharts/lineChart';
import 'vic-common/lib/components/ECharts/barChart';
import 'vic-common/lib/components/ECharts/mapChart';
import 'echarts/lib/component/dataZoom';
import { dateFormat, getGeoCoordMap } from '../../../web/misc/util'
import '../../components/conditionsStock/conditionsStock';
import { ConfigDPR } from '../../config/chart';
import { GetChartOptionWithBase } from '../../utils/utils';
import { showPopup, popupRenderHeader } from '../../utils/common';

const MAXLISTLENGTH = 30;

const getQueryParams = obj => {
  const params = {
    deptId: '',
    categoryId1: '',
    categoryId2: '',
    categoryId3: '',
    brandId: '',
    dataRange: '',
    date: '',
    dateType:''
  };
  const cs = obj && obj.props && obj.props.store && obj.props.store.conditionsStock ? obj.props.store.conditionsStock : null;
  if(cs) {
    const selectedCategory = cs.selectedCategory instanceof Array ? cs.selectedCategory : null;
    params.deptId = cs.selectedDept;
    params.categoryId1 = selectedCategory && selectedCategory.length > 0 ? selectedCategory[0] : '';
    params.categoryId2 = selectedCategory && selectedCategory.length > 1 ? selectedCategory[1] : '';
    params.categoryId3 = selectedCategory && selectedCategory.length > 2 ? selectedCategory[2] : '';
    params.brandId = cs.selectedBrand || '';
    params.date = cs.selectedDate
  }
  return params;
};

@registerTmpl('StockMarketing')
@inject('store')
@observer
export default class StockMarketing extends Component {
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
    const { store: { stockMarketing } } = this.props;
    const params = getQueryParams(this);
    Promise.all([
      stockMarketing.getSummaryData(params),
      stockMarketing.getMapData(Object.assign({}, params, {storeType:stockMarketing.filterSmallObject ? '0' : '1'})),
      stockMarketing.getLevelOneData(params),
      stockMarketing.getBandData(params)      
    ]).then(() => {
      Toast.hide();
    })
  }


  render() {
    return tmpls.stockMarketing(this.state, this.props, this, {
      styles
    });
  }
}


//数据看版
@registerTmpl('stockMarketingSummary')
@inject('store')
@observer
class StockMarketingSummary extends Component{

  render(){
    const { store: { stockMarketing } } = this.props;
    return tmpls.stockMarketingSummary(this.state, this.props, this, {
      styles,
      stockMarketing
    });
  }
}


@registerTmpl('stockMarketingMap')
@inject('store')
@observer
class StockMarketingMap extends Component{
  @observable currentTab = this.props.store.stockMarketing.tabItems ? [toJS(this.props.store.stockMarketing.tabItems)[0].value] : ['stockMoney']; // 'stockMoney' | 'pv' | 'inStock' | 'inStockBig' | 'transferDays' | 'bigSales' | 'bigSalesBig' | 'unsales'
  
  @autobind
  onTabChanged(value){
    this.currentTab = [value + '']
  }

  @autobind
  filterSmallObject(checked){
    this.props.store.stockMarketing.setFilterSmallObject(checked);
    Toast.loading('loading...');
    const params = getQueryParams(this);
    Promise.all([
      this.props.store.stockMarketing.getMapData(Object.assign({}, params, {storeType:(this.props.store.stockMarketing.filterSmallObject ? '0' : '1')}))
    ]).then(() => {
      Toast.hide();
    });
  }


  /**
   * map option
   * 
   * @readonly
   * @memberof StockMarketingMap
   */
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

  @computed get mapOption(){
    let self = this;

    let _data = [], max = 0, _symbolSize = 50;
    
    switch (this.currentTab[0]){
      case 'stockMoney':
        _data = this.props.store.stockMarketing.mapDataStockMoney && this.props.store.stockMarketing.mapDataStockMoney.map(item=>{
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
      toolbox:{show:false},
      series:[
          {
              name: '库存金额',
              type: 'scatter',
              coordinateSystem: 'geo',
              symbolSize: 12,
              label: {
                  normal: {
                      show: true,
                      position:'right',
                      formatter: function(params){
                        return `${params.name}: ${params.value[2]}`
                      },
                      textStyle:{
                        fontSize:12*ConfigDPR.DPR
                      }
                  },
                  emphasis: {
                      show: true
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
      ]
    };
  }

  /**
   * 一级品类option
   * 
   * @readonly
   * @memberof StockMarketingMap
   */
  @computed get barLevelOneOption(){
    let _data = [], unit = '';

    switch (this.currentTab[0]){
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

    switch (this.currentTab[0]){
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
          barWidth:`${30 * ConfigDPR.DPR}px`,
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

    switch (this.currentTab[0]){
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

    switch (this.currentTab[0]){
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

  render(){
    const { store: { stockMarketing } } = this.props;
    return tmpls.stockMarketingMap(this.state, this.props, this, {
      styles,
      stockMarketing,
      tabItems: toJS(stockMarketing.tabItems).map((item,i)=>{
        return {
          key:i,
          value:item.value,
          label:item.name
        }
      })
    });
  }
}

