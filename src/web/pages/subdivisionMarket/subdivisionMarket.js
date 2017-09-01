import React, {Component} from 'react';
import { findDOMNode } from 'react-dom';
import {observable, computed, toJS} from 'mobx'
import {observer, inject} from 'mobx-react';
import nj, { taggedTmpl as njs } from 'nornj';
import {registerTmpl} from 'nornj-react';

import 'vic-common/lib/components/antd/modal';
import 'vic-common/lib/components/antd/radio';
import 'vic-common/lib/components/antd/pagination';
import 'vic-common/lib/components/antd/icon';
import 'vic-common/lib/components/antd/table';
import 'vic-common/lib/components/antd/tooltip';
import 'vic-common/lib/components/antd/checkbox';

import echarts from 'echarts/lib/echarts';
import 'echarts/lib/component/calendar';
import 'vic-common/lib/components/ECharts/barChart';
import 'vic-common/lib/components/ECharts/lineChart';

import Message from 'vic-common/lib/components/antd/message';
import graphic from 'echarts/lib/util/graphic.js'
import {autobind} from 'core-decorators';
import styles from './subdivisionMarket.m.scss';
import tmpls from './subdivisionMarket.t.html';
import '../../components/conditons';


//页面容器组件
@inject('store')
@observer
@registerTmpl('SubdivisionMarket')
export default class SubdivisionMarket extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }

  @autobind
  onSearch(){
    const closeLoading = Message.loading('正在获取数据...', 0);
    const searchParams = this.props.store.conditions.getParamsHasLevel4();
    // console.log('searchParams',searchParams);
    Promise.all([
      this.props.store.subdivisionMarket.getBusinessData(searchParams),
      this.props.store.subdivisionMarket.getCompeteData(searchParams),
      this.props.store.subdivisionMarket.getUserFeatureData(searchParams)
    ]).then(() => {
      closeLoading();
    });
  }

  render() {
    const { store: { subdivisionMarket } } = this.props;
    return tmpls.subdivisionMarket(this.state, this.props, this, {
      styles,
      subdivisionMarket
    });
  }
}

/*
* 01 细分市场生意评估
*/
//---------------------------------------------------------------
@registerTmpl('marketAnalyse')
@inject('store')
@observer
export class MarketAnalyse extends Component {

  @observable switchSale = 'a';
  @observable switchGrowth = 'a';

  @computed get saleOption() {
    let _data = [], _tab = 'a';
    let _legend = ['品类','细分市场','细分市场宝洁'];
     switch (this.switchSale) {
       case 'a':
         _data = this.props.store.subdivisionMarket.salesData;
         break;
       case 'b':
         _data = this.props.store.subdivisionMarket.amountData;
         _tab ='b';
         break;
     }
     return {
       tooltip: {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'line'        // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter: function(params) {
                var result = `<div>${params[0].name}</div>`;
                    result += `<div>
                          <span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;
                          background-color:${params[2] && params[2].color || ''}"></span>
                          <span>${params[2] && params[2].seriesName || _legend[2]}:</span>`;
                    result += _tab == 'b' ? `<span>${params[2] && (params[2].data).toFixed(2) || '--'}</span></div>` :
                             `<span>${params[2] && (params[2].data).toFixed(0) || '--'}</span></div>`;

                return result
            }
        },
        toolbox: {
            show:false,
        },
        grid: {
            left: '-5%',
            right: '-5%',
            bottom: '3%',
            containLabel: true
        },
        legend: {
            data: _legend
        },
        xAxis: [
            {
                type: 'category',
                data: toJS(_data && _data[3]),
                axisPointer: {
                    type: 'line'
                }
            }
        ],
        color: ['#03BABA', '#2F4554', '#C23531'],
        yAxis: [
            {
                type: 'value',
                axisLabel: {
                  show:false
                }
            },{
              type: 'value',
              axisLabel: {
                show:false
              }
          }

        ]
     }
  }
  @computed get saleData() {
    let _data = [];
    switch (this.switchSale) {
      case 'a':
        _data = this.props.store.subdivisionMarket.salesData;
        break;
      case 'b':
        _data = this.props.store.subdivisionMarket.amountData;
        break;
    }
    return [
        {
            name:'品类',
            type:'line',
            barWidth: '40%',
            data:toJS(_data && _data[0])
        },
        {
            name:'细分市场',
            type:'line',
            data:toJS(_data && _data[1])
        },
        {
            name:'细分市场宝洁',
            type:'bar',
            yAxisIndex: 1,
            data:toJS(_data && _data[2])
        }
    ]
  }

  @computed get growthOption() {
     let _data = [],
         isNumber = false;
     switch (this.switchGrowth) {
       case 'a':
         _data = this.props.store.subdivisionMarket.uvGrowthData;
         break;
       case 'b':
         _data = this.props.store.subdivisionMarket.uvConvertData;
         break;
       case 'c':
         _data = this.props.store.subdivisionMarket.userGrowthData;
         break;
       case 'd':
         _data = this.props.store.subdivisionMarket.unitPriceData;
         isNumber = true;
         break;
     }
     return {
       tooltip: {
           trigger: 'axis',
           formatter: function(params) {
               var result = `<div>${params[0].name}</div>`;
               var str;
               params.forEach(function(item) {
                   str = isNumber ? `<span>${(item.data * 1).toFixed(2) || '--'}</span></div>` : `<span>${(item.data * 100).toFixed(2) || '--'}%</span></div>`
                   result += `<div>
                         <span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:${item.color}"></span>
                         <span>${item.seriesName}:</span>`;
                   result += str;
               });
               return result
           }
       },
       toolbox: {
            show:false,
       },
       grid: {
           left: '3%',
           right: '4%',
           bottom: '3%',
           containLabel: true
       },
       legend: {
           data:['品类','细分市场','细分市场宝洁']
       },
       grid: {
           left: '3%',
           right: '4%',
           bottom: '3%',
           containLabel: true
       },
       toolbox: {
           show: false,
       },
       xAxis: {
           type: 'category',
           axisPointer: {
               type: 'line'
           },
           data: toJS(_data && _data[3])
       },
       yAxis: {
           type: 'value'
        }
     }
  }
  @computed get growthData() {
    let _data = [];
    switch (this.switchGrowth) {
      case 'a':
        _data = this.props.store.subdivisionMarket.uvGrowthData;
        break;
      case 'b':
        _data = this.props.store.subdivisionMarket.uvConvertData;
        break;
      case 'c':
        _data = this.props.store.subdivisionMarket.userGrowthData;
        break;
      case 'd':
        _data = this.props.store.subdivisionMarket.unitPriceData;
        break;
    }
    return [
        {
            name:'品类',
            type:'line',
            stack: 'one',
            data: toJS(_data && _data[0]),
        },
        {
            name:'细分市场',
            type:'line',
            stack: 'one',
            data: toJS(_data && _data[1]),
        },
        {
            name:'细分市场宝洁',
            type:'line',
            stack: 'one',
            data: toJS(_data && _data[2]),
        }
    ]
  }

  constructor(props) {
    super(props);
  }

  @autobind
  onSalesTypeChange(e){
    this.switchSale = e.target.value;
  }

  @autobind
  onGrowthTypeChange(e){
    this.switchGrowth = e.target.value;
  }

  componentDidMount() {

  }

  render() {
    const {store: { subdivisionMarket }} = this.props;
    return tmpls.marketAnalyse(this.state, this.props, this, {
      styles,
      subdivisionMarket,
    });
  }
}


/*
* 02 细分市场竞争评估
*/
//---------------------------------------------------------------
@registerTmpl('marketCompetition')
@inject('store')
@observer
export class MarketCompetition extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }

  render() {
     const {store: { subdivisionMarket }} = this.props;
     const topTenColumns = [{
        title: '细分市场排名',
        dataIndex: 'key',
        width:80,
        render: (text, record, index) => {
          return {
            children: nj`<i class="rank rank-${index%4}">${text}</i>`()
          };
        }
      }, {
        title: '品牌',
        dataIndex: 'brand',
        width:150,
      }, {
        title: '品类排名',
        dataIndex: 'categoryRank',
        width:100,
      }];
      const topThirtyColumns = [{
         title: '细分市场排名',
         dataIndex: 'key',
         width:80,
         render: (text, record, index) => {
           return {
             children: nj`<i class="rank rank-${index%4}">${text}</i>`()
           };
         }
       }, {
         title: '商品名称',
         dataIndex: 'productName',
         width:200,
       }, {
         title: 'SKU编码',
         dataIndex: 'sku',
         width:80,
       }, {
         title: '品类排名',
         dataIndex: 'categoryRank',
         width:80,
       }];
      return tmpls.marketCompetition(this.state, this.props, this, {
        styles,
        subdivisionMarket,
        topTenColumns,
        topTenData: toJS(subdivisionMarket.topTen),
        topThirtyColumns,
        topThirtyData: toJS(subdivisionMarket.topThirty),
        topThirtyScrollNum: { x:true, y: 470}
      });
  }
}

/*
* 03 细分市场用户特征
*/
//---------------------------------------------------------------
@registerTmpl('marketUserFeature')
@inject('store')
@observer
export class MarketUserFeature extends Component {

  @computed get marketUserOption() {
    let _data = this.props.store.subdivisionMarket.marketData;
    return {
      tooltip : {
          trigger: 'axis',
          axisPointer : {            // 坐标轴指示器，坐标轴触发有效
              type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter:function(params) {
              var result = `<div style="text-align:left">${params[0].name}</div>`;
              params.forEach(function (item) {
                result += `<div style="text-align:left">
                                <span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:${item.color}"></span>
                                <span>${item.seriesName}:</span>
                                <span>${ (item.data < 0 ? -item.data * 100 : item.data * 100).toFixed(2) || '--'}%</span>
                            </div>`;
              });
              return result
          }
      },
      toolbox: {
         show:false,
      },
      legend: {
          data:['用户数占比', '销售贡献占比']
      },
      grid: {
          left: '4%',
          right: '3%',
          bottom: '3%',
          containLabel: true
      },
      xAxis : [
          {
              type : 'value'
          }
      ],
      yAxis : [
          {
              type : 'category',
              axisTick : {show: false},
              data : toJS(_data && _data[2])
          }
      ]
    }
  }

  @computed get marketUserData() {
    let _data = this.props.store.subdivisionMarket.marketData;
    return [
      {
           name:'用户数占比',
           type:'bar',
           barWidth: '50%',
           stack: '总量',
           label: {
               normal: {
                   show: false,
                   position: 'insideRight',
                   formatter: params => {
                     return (parseFloat(params.data) * 100).toFixed(2) + '%';
                   }
               }
           },
           data:toJS(_data && _data[0])
       },
       {
           name:'销售贡献占比',
           type:'bar',
           barWidth: '50%',
           stack: '总量',
           label: {
               normal: {
                   show: false,
                   position: 'insideLeft',
                   formatter: params => {
                     return (parseFloat(params.data) * -100).toFixed(2) + '%';
                   }
               }
           },
           data:toJS(_data && _data[1])
       }
    ]
  }

  @computed get marketCategoryOption() {
    let _data = this.props.store.subdivisionMarket.categoryData;
    return {
      tooltip : {
          trigger: 'axis',
          axisPointer : {            // 坐标轴指示器，坐标轴触发有效
              type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter:function(params) {
              var result = `<div style="text-align:left">${params[0].name}</div>`;
              params.forEach(function (item) {
                result += `<div style="text-align:left">
                                <span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:${item.color}"></span>
                                <span>${item.seriesName}:</span>
                                <span>${ (item.data < 0 ? -item.data * 100 : item.data * 100).toFixed(2) || '--'}%</span>
                            </div>`;
              });
              return result
          }
      },
      toolbox: {
         show:false,
      },
      legend: {
          data:['用户数占比', '销售贡献占比']
      },
      grid: {
          left: '4%',
          right: '3%',
          bottom: '3%',
          containLabel: true
      },
      xAxis : [
          {
              type : 'value'
          }
      ],
      yAxis : [
          {
              type : 'category',
              axisTick : {show: false},
              data : toJS(_data && _data[2])
          }
      ]
    }
  }

  @computed get marketCategoryData() {
    let _data = this.props.store.subdivisionMarket.categoryData;
    return [
      {
           name:'用户数占比',
           type:'bar',
           barWidth: '50%',
           stack: '总量',
           label: {
               normal: {
                   show: false,
                   position: 'insideRight',
                   formatter: params => {
                     return (parseFloat(params.data) * 100).toFixed(2) + '%';
                   }
               }
           },
           data:toJS(_data && _data[0])
       },
       {
           name:'销售贡献占比',
           type:'bar',
           barWidth: '50%',
           stack: '总量',
           label: {
               normal: {
                   show: false,
                   position: 'insideLeft',
                   formatter: params => {
                     return (parseFloat(params.data) * -100).toFixed(2) + '%';
                   }
               }
           },
           data:toJS(_data && _data[1])
       }
    ]
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }

  @autobind
  onTags(value) {
    return () => {
        const searchParams = this.props.store.conditions.getParamsHasLevel4();
        searchParams.tag = encodeURI(value);
        const closeLoading = Message.loading('正在获取数据...', 0);
        Promise.all([
          this.props.store.subdivisionMarket.getUserFeatureData(searchParams)
        ]).then(()=>{
          this.props.store.subdivisionMarket.setCurrentTag(value);
        }).then(() => {
          closeLoading();
        });
    }
  }


 // --------------------- 暂注销 ----------------------------
 /*   state = {
    options: [
      { label: '性别', value: 'sex' },
      { label: '年龄', value: 'age' },
      { label: '购买地域', value: 'area' },
      { label: '收入水平', value: 'income' },
    ]
  }

  @autobind
  onChange(checkedValues){
     this.props.store.subdivisionMarket.setValue(checkedValues);
  }
  */
 // -------------------------------------------------
  render() {
    const { store: { subdivisionMarket }} = this.props;
    return tmpls.marketUserFeature(this.state, this.props, this, {
      styles,
      subdivisionMarket,
      tags: subdivisionMarket.tagsData,
      // value: subdivisionMarket.value != 'null' ? toJS(subdivisionMarket.value) : [],
    });
  }
}
