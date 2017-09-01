import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { observable, computed, toJS } from 'mobx'
import { observer, inject } from 'mobx-react';
import nj from 'nornj';
import { registerTmpl } from 'nornj-react';
import 'vic-common/lib/components/antd/button';
import 'vic-common/lib/components/antd/table';
import 'vic-common/lib/components/antd/icon';
import 'vic-common/lib/components/antd/input';
import 'vic-common/lib/components/antd/radio';
import echarts from 'echarts/lib/echarts';
import 'vic-common/lib/components/ECharts/pieChart';
import 'vic-common/lib/components/ECharts/scatterChart';
import 'echarts/lib/component/dataZoom';
import 'echarts/lib/component/markLine';
import Message from 'vic-common/lib/components/antd/message';
import graphic from 'echarts/lib/util/graphic.js'
import { autobind } from 'core-decorators';
import styles from './marketingSelection.m.scss';
import tmpls from './marketingSelection.t.html';
import '../../components/conditons';
import { dateFormat, debounce, colorList } from '../../misc/util'
import moment from 'moment';
import { outputMoney } from 'flarej/lib/utils/math';



//页面容器组件
@inject('store')
@observer
@registerTmpl('MarketingSelection')
export default class MarketingSelection extends Component {

  

  constructor(props) {
      super(props);
  }

  componentDidMount() {

  }

  @autobind
  onSearch(){
    const closeLoading = Message.loading('正在获取数据...', 0),
          searchConditions = {
            categoryId1: this.props.store.conditions.selectedCategory[0] || '',
            categoryId2: this.props.store.conditions.selectedCategory[1] || '',
            categoryId3: this.props.store.conditions.selectedCategory[2] || '',
            brandId: this.props.store.conditions.selectedBrand || '',
            date: this.props.store.conditions.selectedDate
          };
    let fetchList = [
      this.props.store.marketingSelection.getBandPieData(searchConditions),
      this.props.store.marketingSelection.getProductPortraitList(Object.assign({},searchConditions,{listType:this.props.store.marketingSelection.listType}))
    ];

    Promise.all(fetchList).then(() => {
      closeLoading();

      let _band = this.props.store.marketingSelection.bandPieData && toJS(this.props.store.marketingSelection.bandPieData)[0] && toJS(this.props.store.marketingSelection.bandPieData)[0].name;
      this.props.store.marketingSelection.getBandProductRoleData(Object.assign({}, searchConditions, {band:_band})).then(()=>{
        closeLoading();
      })
    });
  }

  render() {
    return tmpls.marketingSelection(this.state, this.props, this, {
      styles
    });
  }
}


/**
 * 商品定位
 * 
 * @class ProductPosition
 * @extends {Component}
 */
@registerTmpl('productPosition')
@inject('store')
@observer
class ProductPosition extends Component {

  @observable _bandTitle = null;
  @computed get bandTitle(){
    if(this._bandTitle){
      return this._bandTitle;
    }else{
      return this.props.store.marketingSelection.bandPieData && this.props.store.marketingSelection.bandPieData[0] && toJS(this.props.store.marketingSelection.bandPieData)[0].name;
    }
  }

  @computed get bandPieChartOptions(){
    return {
      tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b}: {c} ({d}%)"
      },
      legend: {
          orient: 'vertical',
          x: 'left',
          y: 'center',
          data:this.props.store.marketingSelection.bandPieData && toJS(this.props.store.marketingSelection.bandPieData).map(item=>item.name)
      }
    }
  }

  @computed get bandPieChartData(){
    return [
      {
        name:'Band商品数量分布',
        type:'pie',
        radius: ['35%', '50%'],
        avoidLabelOverlap: false,
        label: {
            normal: {
                show: false,
                position: 'center'
            },
            emphasis: {
                show: true,
                textStyle: {
                    fontSize: '30',
                    fontWeight: 'bold'
                }
            }
        },
        labelLine: {
            normal: {
                show: false
            }
        },
        data: this.props.store.marketingSelection.bandPieData && toJS(this.props.store.marketingSelection.bandPieData)
      }
    ];
  };

  @computed get bandProductRoleChartOption(){
    
    let _data = this.props.store.marketingSelection.bandProductRoleData && toJS(this.props.store.marketingSelection.bandProductRoleData),
        maxX = 0, 
        maxY = 0;
    
    _data && _data.list && _data.list.forEach(item=>{
      if(item[0] > maxX){
        maxX = item[0];
      }
      if(item[1] > maxY){
        maxY = item[1];
      }
    });

    return {
      grid: {
        left: '3%',
        right: '14%',
        top:'15%',
        bottom:'5%',
        containLabel: true
      },
      tooltip: {
          formatter: function(params){
              var result = `<div>${params[0].data[2]}</div>`;
                  result += `<div>
                                  <span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;"></span>
                                  <span>UV转化率:</span>
                                  <span>${params[0].data[0] || '--'}%</span>
                              </div>`;
                  result += `<div>
                                  <span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;"></span>
                                  <span>UV:</span>
                                  <span>${outputMoney(params[0].data[1],0) || '--'}</span>
                              </div>`;
              return result
          }
      },
      xAxis: [
        {
          name:'UV转化率',
          gridIndex: 0, 
          min: 0,
          splitLine:{
            show:false
          },
          max: maxX
        }
      ],
      yAxis: [
        {
          name:'UV',
          gridIndex: 0, 
          splitLine:{
            show:false
          },
          min: 0, 
          max: maxY
        }
      ]
    }
  }

  @computed get bandProductRoleChartData(){
    let _data = this.props.store.marketingSelection.bandProductRoleData && toJS(this.props.store.marketingSelection.bandProductRoleData),
        maxX = 0, 
        maxY = 0;

    _data && _data.list && _data.list.forEach(item=>{
      if(item[0] > maxX){
        maxX = parseFloat(item[0].toFixed(2));
      }
      if(item[1] > maxY){
        maxY = parseFloat(item[1].toFixed(2));
      }
    });

    let dataMap = (_data && _data.list.map((item, i) => {

      const maxSize = 50;
      const _size = item[1] / maxY * maxSize;
      const _opacity = item[0] / maxX;
      
      return {
        name: 'Band商品角色',
        type: 'scatter',
        xAxisIndex: 0,
        yAxisIndex: 0,
        symbolSize: _size < 12 ? 12 : _size,
        itemStyle: {
            normal: {
                color: colorList()[i%colorList().length],
                opacity:_opacity < .5 ? .5 :_opacity
            },
        },
        data: [
            item
        ],
        label: {
            normal: {
                show: false,
                position: 'inside',
                formatter: function(param) {
                    return param.data[2];
                },
            },
        }
      };
    })) || [];

    return [
      ...dataMap,
      {
        name: 'Band商品角色',
        type: 'scatter',
        xAxisIndex: 0,
        yAxisIndex: 0,
        symbolSize:50,
        label: {
            normal: {
                show: true,
                position: 'inside',
                formatter: function(param) {
                    return param.data[2];
                },
            },
        },
        markLine: {
          animation: true,
          lineStyle: {
              normal: {
                  type: 'dashed'
              }
          },
          data: [
            [
              {
              coord: [0, _data && _data.uvAvg],
              symbol: 'none',
              label: {
                  normal: {
                      formatter: _data && _data.uvAvg && '品类UV均线',
                      textStyle: {
                          align: 'right'
                      }
                  }
              }
              }, {
                  coord: [maxX, _data && _data.uvAvg],
                  symbol: 'none'
              }
            ],
            [
              {
                coord: [_data && _data.uvConvertAvg, 0],
                symbol: 'none',
                label: {
                  normal: {
                      formatter: _data && _data.uvAvg && '品类UV转化率均线',
                      textStyle: {
                          align: 'right'
                      }
                  }
                }
              }, {
                  coord: [_data && _data.uvConvertAvg, maxY],
                  symbol: 'none'
              }
            ]
          ]
        }
      }
    ]
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {

    this.refs.ecBandPie.chart.on('click', params => {
      
      if(params.value){
        this._bandTitle = params.name;
        const closeLoading = Message.loading('正在获取数据...', 0),
        searchConditions = {
          categoryId1: this.props.store.conditions.selectedCategory[0] || '',
          categoryId2: this.props.store.conditions.selectedCategory[1] || '',
          categoryId3: this.props.store.conditions.selectedCategory[2] || '',
          brandId: this.props.store.conditions.selectedBrand || '',
          date: this.props.store.conditions.selectedDate,
          band:this.bandTitle
        };

        Promise.all([
          this.props.store.marketingSelection.getBandProductRoleData(searchConditions)
        ]).then(() => {
          closeLoading();
        });
      }
    });
  }

  render() {
    const { store: { marketingSelection } } = this.props;
    return tmpls.productPosition(this.state, this.props, this, {
      styles,
      marketingSelection
    });
  }
}



/**
 * tablePortrait
 * 
 * @class TablePortrait
 * @extends {Component}
 */
@registerTmpl('tablePortrait')
@inject('store')
@observer
class TablePortrait extends Component {


  @autobind
  onListTypeChange(e){
    this.props.store.marketingSelection.setListType(e.target.value);
    const closeLoading = Message.loading('正在获取数据...', 0),
        searchConditions = {
          categoryId1: this.props.store.conditions.selectedCategory[0] || '',
          categoryId2: this.props.store.conditions.selectedCategory[1] || '',
          categoryId3: this.props.store.conditions.selectedCategory[2] || '',
          brandId: this.props.store.conditions.selectedBrand || '',
          date: this.props.store.conditions.selectedDate
        };
    let fetchList = [
      this.props.store.marketingSelection.getProductPortraitList(Object.assign({},searchConditions,{listType:e.target.value}))
    ];

    Promise.all(fetchList).then(() => {
      closeLoading();
    });


  }


  /**
   * tablePortrait list
   * 
   * @memberof UserBehavior
   */
  @computed get tablePortraitColumns(){
    switch (this.props.store.marketingSelection.listType){
      case '1':
        return [
          {
            key:'rank',
            title: '排名',
            dataIndex: 'rank',
            render: (text, record, index) => {
              return {
                children: nj`<span class="rank-${index%4}">${text}</span>`()
              };
            },
            width:'50px'
          }, {
            key:'name',
            title: '商品名称',
            dataIndex: 'name',
            width:'50%'
          }, {
            key:'sku',
            title: 'SKU',
            dataIndex: 'sku'
          }, {
            key:'categoryName',
            title: '品类',
            dataIndex: 'categoryName'
          }, {
            key:'brandName',
            title: '品牌',
            dataIndex: 'brandName'
          }, {
            key:'salesAmount',
            title: '销量',
            dataIndex: 'salesAmount'
          }];
      break;
      case '2':
      return [
        {
          key:'rank',
          title: '排名',
          dataIndex: 'rank',
          render: (text, record, index) => {
            return {
              children: nj`<span class="rank-${index%4}">${text}</span>`()
            };
          },
          width:'50px'
        }, {
          key:'name',
          title: '商品名称',
          dataIndex: 'name',
          width:'50%'          
        }, {
          key:'sku',
          title: 'SKU',
          dataIndex: 'sku'
        }, {
          key:'categoryName',
          title: '品类',
          dataIndex: 'categoryName'
        }, {
          key:'brandName',
          title: '品牌',
          dataIndex: 'brandName'
        }, {
          key:'uv',
          title: 'UV',
          dataIndex: 'uv'
        }];
      break;
      case '3':
      return [
        {
          key:'rank',
          title: '排名',
          dataIndex: 'rank',
          render: (text, record, index) => {
            return {
              children: nj`<span class="rank-${index%4}">${text}</span>`()
            };
          },
          width:'50px'
        }, {
          key:'name',
          title: '商品名称',
          dataIndex: 'name',
          width:'50%'
        }, {
          key:'sku',
          title: 'SKU',
          dataIndex: 'sku'
        }, {
          key:'categoryName',
          title: '品类',
          dataIndex: 'categoryName'
        }, {
          key:'brandName',
          title: '品牌',
          dataIndex: 'brandName'
        }, {
          key:'salesAmountBand',
          title: '销量Band',
          dataIndex: 'salesAmountBand'
        }];
      break;
      default:
      break;
    }
  }

  @computed get tablePortraitData(){

    switch (this.props.store.marketingSelection.listType){
      case '1':
        return toJS(this.props.store.marketingSelection.productPortraitList && this.props.store.marketingSelection.productPortraitList.map((item, i) => {
          return {
            key: i,
            rank: item.rank,
            name: item.name,
            sku: item.sku,
            categoryName: item.categoryName,
            brandName: item.brandName,
            salesAmount: item.salesAmount
          }
        }));
      break;
      case '2':
        return toJS(this.props.store.marketingSelection.productPortraitList && this.props.store.marketingSelection.productPortraitList.map((item, i) => {
          return {
            key: i,
            rank: item.rank,
            name: item.name,
            sku: item.sku,
            categoryName: item.categoryName,
            brandName: item.brandName,
            uv: item.uv
          }
        }));
      break;
      case '3':
        return toJS(this.props.store.marketingSelection.productPortraitList && this.props.store.marketingSelection.productPortraitList.map((item, i) => {
          return {
            key: i,
            rank: item.rank,
            name: item.name,
            sku: item.sku,
            categoryName: item.categoryName,
            brandName: item.brandName,
            salesAmountBand: item.band
          }
        }));
      break;
      default:
      break;
    }
  }

  @autobind
  downloadEvent(){
    findDOMNode(this.refs.formExport).submit();
  }

  @computed get tableScroll(){
    return { y: 500}
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }

  render() {
    const { store: { marketingSelection, conditions } } = this.props;
    return tmpls.tablePortrait(this.state, this.props, this, {
      styles,
      marketingSelection,
      conditions:{
        categoryId1: this.props.store.conditions.selectedCategory[0] || '',
        categoryId2: this.props.store.conditions.selectedCategory[1] || '',
        categoryId3: this.props.store.conditions.selectedCategory[2] || '',
        brandId: this.props.store.conditions.selectedBrand || '',
        date: this.props.store.conditions.selectedDate
      },
      downloadUrl: `${__HOST}/marketingSelection/getTableDataExcel`
    });
  }
}
