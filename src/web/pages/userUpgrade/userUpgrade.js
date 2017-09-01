import React, { Component } from 'react';
import { observable, computed, toJS } from 'mobx'
import { observer, inject } from 'mobx-react';
import nj from 'nornj';
import { registerTmpl } from 'nornj-react';
import 'vic-common/lib/components/antd/tabs';
import 'vic-common/lib/components/antd/button';
import 'vic-common/lib/components/antd/table';
import 'vic-common/lib/components/antd/icon';
import 'vic-common/lib/components/antd/input';
import echarts from 'echarts/lib/echarts';
import 'vic-common/lib/components/ECharts/lineChart';
import 'vic-common/lib/components/ECharts/barChart';
import 'vic-common/lib/components/ECharts/graphChart';
import 'vic-common/lib/components/ECharts/radarChart';
import 'echarts/lib/component/dataZoom';
import Message from 'vic-common/lib/components/antd/message';
import graphic from 'echarts/lib/util/graphic.js'
import { autobind } from 'core-decorators';
import styles from './userUpgrade.m.scss';
import tmpls from './userUpgrade.t.html';
import '../../components/conditons';
import { dateFormat, debounce, colorList } from '../../misc/util'
import moment from 'moment';
import { outputMoney } from 'flarej/lib/utils/math';



//页面容器组件
@inject('store')
@observer
@registerTmpl('UserUpgrade')
export default class UserUpgrade extends Component {

  @observable currentTab = 1;

  constructor(props) {
      super(props);
  }

  componentDidMount() {

  }

  @autobind
  callback(index){
    this.currentTab = index;
  }

  @autobind
  onSearch(){
    this.props.store.userUpgrade.setSelectedBrandRows(null);
    this.props.store.userUpgrade.setSelectedBrandItems(null);
    this.props.store.userUpgrade.setSearchText(null);
    this.props.store.userUpgrade.setFirstSelected(null);
    this.props.store.userUpgrade.setUserCoincidenceRates({
      success:true,
      data:{value:null}
    });


    const closeLoading = Message.loading('正在获取数据...', 0),
          searchConditions = {
            categoryId1: this.props.store.conditions.selectedCategory[0] || '',
            categoryId2: this.props.store.conditions.selectedCategory[1] || '',
            categoryId3: this.props.store.conditions.selectedCategory[2] || '',
            brandId: this.props.store.conditions.selectedBrand || '',
            date: this.props.store.conditions.selectedDate
          };
    let fetchList = [
      this.props.store.userUpgrade.getUserTrendsData(searchConditions),
      this.props.store.userUpgrade.getUserRetentionData(searchConditions),
      this.props.store.userUpgrade.getUserSourceData(searchConditions),
      this.props.store.userUpgrade.getUserBehaviorData(searchConditions),
      this.props.store.userUpgrade.getHotSkuData(searchConditions),
      this.props.store.userUpgrade.getCorrelationData(searchConditions)
    ];

    if(this.currentTab > 1){
      fetchList.push(this.props.store.userUpgrade.getBrandRankData(Object.assign({}, searchConditions, {brandNameCn: this.props.store.userUpgrade.searchText})));
    }

    Promise.all(fetchList).then(() => {
      closeLoading();

      if(this.currentTab > 1){
        this.props.store.userUpgrade.setSelectedCategory(this.props.store.userUpgrade.correlationData[0]);
        this.props.store.userUpgrade.getCoincidenceData(Object.assign({},searchConditions, {selectedCategoryId: this.props.store.userUpgrade.correlationData[0] && this.props.store.userUpgrade.correlationData[0].categoryId})).then(()=>{
          closeLoading();
        });
      }
    });
  }

  render() {
    return tmpls.userUpgrade(this.state, this.props, this, {
      styles
    });
  }
}



/**
 * 用户行为
 * 
 * @class UserBehavior
 * @extends {Component}
 */
@registerTmpl('userBehavior')
@inject('store')
@observer
class UserBehavior extends Component {

  /**
   * 用户趋势
   * 
   * @readonly
   * @memberof UserBehavior
   */
  @computed get barUserTrendsOption(){
    
    return {
      grid: {
          left: '3%',
          right: '4%',
          top:'15%',
          bottom:'5%',
          containLabel: true
      },
      color: ['#2f4554', '#c23531', '#61a0a8'],
      legend:{
        show:true,
        left:'center',
        top:0,
        data: ['老客','新客']
      },
      tooltip: {
          show: true,
          trigger: 'axis',
          formatter:function(params){
              var result = `<div>${params[0].name}</div>`;
              params.forEach(function (item, i) {
                  result += `<div>
                                  <span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:${item.color}"></span>
                                  <span>${item.seriesName}:</span>
                                  <span>${outputMoney(item.data.value,0) || '--'}</span>
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
          data: toJS(this.props.store.userUpgrade.userTrendsData && this.props.store.userUpgrade.userTrendsData[2])
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
  @computed get barUserTrendsData(){
    return [
      {
        name:'老客',
        type:'bar',
        stack:'总量',
        barWidth:'50px',
        data: this.props.store.userUpgrade.userTrendsData && this.props.store.userUpgrade.userTrendsData[0] && toJS(this.props.store.userUpgrade.userTrendsData[0]).map((item, i) => {
          return {
            value: item,
            itemStyle:{
              normal:{
                color:colorList()[1]
              }
            }
          }
        })
      },
      {
        name:'新客',
        type:'bar',
        stack:'总量',
        barWidth:'50px',
        data: this.props.store.userUpgrade.userTrendsData && this.props.store.userUpgrade.userTrendsData[0] && toJS(this.props.store.userUpgrade.userTrendsData[1]).map((item, i) => {
          return {
            value: item,
            itemStyle:{
              normal:{
                color:colorList()[0]
              }
            }
          }
        })
      }
    ];
  };

  /**
   * 用户留存
   * 
   * @readonly
   * @memberof UserBehavior
   */
  @computed get barUserRetentionOption(){

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
        show:false,
        left:'center',
        top:0
      },
      tooltip: {
          show: true,
          trigger: 'axis',
          formatter:function(params){
              var result = `<div>${self.props.store.conditions.selectedDate}</div>`;
              params.forEach(function (item, i) {
                if(!(item.seriesName == '辅助' || item.data == '-' || item.data == 0)){
                  let unit = '';
                  if(item.seriesName == '占基期留存用户'){
                    unit = '%';
                  }else{
                    unit = '';                    
                  }

                  result += `<div>
                                  <span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:${item.color}"></span>
                                  <span>${item.seriesName}:</span>
                                  <span>${outputMoney(parseFloat(item.data),item.seriesName == '占基期留存用户' ? 2 : 0) || '--'}${unit}</span>
                              </div>`;
                }
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
          data: toJS(this.props.store.userUpgrade.userRetentionData && this.props.store.userUpgrade.userRetentionData[6].slice(0,-1))
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
  @computed get barUserRetentionData(){
    return [
      {
            name: '辅助',
            type: 'bar',
            stack: '总量',
            barWidth : 80,
            itemStyle: {
                normal: {
                    barBorderColor: 'rgba(0,0,0,0)',
                    color: 'rgba(0,0,0,0)'
                },
                emphasis: {
                    barBorderColor: 'rgba(0,0,0,0)',
                    color: 'rgba(0,0,0,0)'
                }
            },
            data: this.props.store.userUpgrade.userRetentionData && toJS(this.props.store.userUpgrade.userRetentionData[0].map(item=>(typeof item == 'number') ? parseFloat(item.toFixed(2)) : item))
        },
        {
            name: '基期留存用户',
            type: 'bar',
            stack: '总量',
            barWidth : 80,
            label: {
                normal: {
                    show: true,
                    position: 'top'
                }
            },
            data: this.props.store.userUpgrade.userRetentionData && toJS(this.props.store.userUpgrade.userRetentionData[1].map(item=>(typeof item == 'number') ? parseFloat(item.toFixed(2)) : item))
        },
        {
            name: '流失用户',
            type: 'bar',
            stack: '总量',
            barWidth : 80,
            label: {
                normal: {
                    show: true,
                    position: 'top'
                }
            },
            data: this.props.store.userUpgrade.userRetentionData && toJS(this.props.store.userUpgrade.userRetentionData[2].map(item=>(typeof item == 'number') ? parseFloat(item.toFixed(2)) : item))
        },
        {
            name: '新增用户',
            type: 'bar',
            stack: '总量',
            barWidth : 80,
            label: {
                normal: {
                    show: true,
                    position: 'top'
                }
            },
            data: this.props.store.userUpgrade.userRetentionData && toJS(this.props.store.userUpgrade.userRetentionData[3].map(item=>(typeof item == 'number') ? parseFloat(item.toFixed(2)) : item))
        },
        {
            name: '留存用户',
            type: 'bar',
            stack: '总量',
            barWidth : 80,
            label: {
                normal: {
                    show: true,
                    position: 'top'
                }
            },
            data: this.props.store.userUpgrade.userRetentionData && toJS(this.props.store.userUpgrade.userRetentionData[4].map(item=>(typeof item == 'number') ? parseFloat(item.toFixed(2)) : item))
        },
        {
            name: '占基期留存用户',
            type: 'bar',
            stack: '总量',
            barWidth : 80,
            label: {
                normal: {
                    show: false,
                    position: 'top'
                }
            },
            itemStyle:{
              normal:{
                opacity:0
              }
            },
            data: this.props.store.userUpgrade.userRetentionData && toJS(this.props.store.userUpgrade.userRetentionData[5].map(item=>(typeof item == 'number') ? parseFloat((item*100).toFixed(2)) : item))
        }
    ];
  };

  /**
   * 新客来源
   * 
   * @readonly
   * @memberof UserBehavior
   */
  @computed get barUserSourceOption(){
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
                                  <span>${item.data.value || '--'}%</span>
                              </div>`;
              });
              return result
          }
      },
      grid: {
          left: '3%',
          right: '10%',
          bottom: '3%',
          containLabel: true
      },
      yAxis: {
          type: 'category',
          data: toJS(this.props.store.userUpgrade.userSourceData && this.props.store.userUpgrade.userSourceData.chartData && this.props.store.userUpgrade.userSourceData.chartData[1])
      },
      toolbox:{show:false}
    };
  }

  @computed get barUserSourceData(){
    return [
      {
          name: '来源占比',
          type: 'bar',
          barWidth : 30,
          label: {
              normal: {
                  show: true,
                  position: 'right',
                  formatter:function(params){
                    if(params.data.value != 0){
                      return `${params.data.value}%`
                    }else{
                      return '';
                    }
                  }
              }
          },
          data: this.props.store.userUpgrade.userSourceData && toJS(this.props.store.userUpgrade.userSourceData.chartData && this.props.store.userUpgrade.userSourceData.chartData[0].map((item, i)=>{
            return {
              value: (item*100).toFixed(2),
              itemStyle:{
                normal:{
                  color: colorList()[i%colorList().length]
                }
              }
            }
          }))
      }
    ]
  }

  /**
   * 留存用户行为
   * 
   * @readonly
   * @memberof UserBehavior
   */
  @computed get userBehaviorOptions(){
    return {
      grid: {
          left: '0',
          right: '4%',
          top:'15%',
          bottom:'3%',
          containLabel: true
      },
      legend:{
        show:true,
        left:'center',
        top:0,
        data: ['用户占比','客单价']        
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
                                  <span>${outputMoney(item.data,2) || '--'}${item.seriesName=='用户占比' ? '%' : ''}</span>
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
          data: toJS(this.props.store.userUpgrade.userBehaviorData && this.props.store.userUpgrade.userBehaviorData[2])
      },
      yAxis: [
        {
            splitLine:{
                show:false
            },
            type : 'value',
            name : '用户占比',
            axisLabel : {
                formatter: '{value}%'
            }
        },
        {
            splitLine:{
                show:false
            },
            type : 'value',
            name : '客单价',
            axisLabel : {
                formatter: '{value}'
            }
        }
      ]
    };
  } 
  @computed get userBehaviorData(){
    return [
      {
        name: '用户占比',
        type:'bar',
        barWidth:'50px',
        itemStyle:{
          normal:{
            color: colorList()[1]
          }
        },
        data: toJS(this.props.store.userUpgrade.userBehaviorData && this.props.store.userUpgrade.userBehaviorData[0].map(item=>parseFloat((item*100).toFixed(2))))
      },
      {
        name:'客单价',
        type:'line',
        yAxisIndex: 1,
        data:toJS(this.props.store.userUpgrade.userBehaviorData && this.props.store.userUpgrade.userBehaviorData[1].map(item=>parseFloat(item.toFixed(2))))
      }
    ];
  };

  /**
   * 最受欢迎sku
   * 
   * @memberof UserBehavior
   */
  @observable tableNewUserColumns =  [{
    key:'rank',
    title: '排名',
    dataIndex: 'rank',
    render: (text, record, index) => {
      return {
        children: nj`<span class="rank-${index%4}">${text}</span>`()
      };
    }
  }, {
    key:'sku',
    title: 'SKU',
    dataIndex: 'sku',
    width:'15%'
  }, {
    key:'name',
    title: '商品名称',
    dataIndex: 'name'
  }, {
    key:'volume',
    title: '成交量',
    dataIndex: 'volume',
    width:'15%'
  }];

  @computed get tableNewUserData(){

    return toJS(this.props.store.userUpgrade.hotSkuData && this.props.store.userUpgrade.hotSkuData.hotSkuForNewUser.map((item, i) => {
      return {
        key: i,
        rank: item.rank,
        sku: item.sku,
        name: item.name,
        volume: item.volume
      }
    }));

  }

  @observable tableOldUserColumns =  [{
    key:'rank',
    title: '排名',
    dataIndex: 'rank',
    render: (text, record, index) => {
      return {
        children: nj`<span class="rank-${index%4}">${text}</span>`()
      };
    }
  }, {
    key:'sku',
    title: 'SKU',
    dataIndex: 'sku',
    width:'15%'
  }, {
    key:'name',
    title: '商品名称',
    dataIndex: 'name'
  }, {
    key:'volume',
    title: '成交量',
    dataIndex: 'volume',
    width:'15%'
  }];

  @computed get tableOldUserData(){

    return toJS(this.props.store.userUpgrade.hotSkuData && this.props.store.userUpgrade.hotSkuData.hotSkuForOldUser.map((item, i) => {
      return {
        key: i,
        rank: item.rank,
        sku: item.sku,
        name: item.name,
        volume: item.volume
      }
    }));

  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    
  }

  render() {
    const { store: { userUpgrade } } = this.props;
    return tmpls.userBehavior(this.state, this.props, this, {
      styles,
      userUpgrade
    });
  }
}



/**
 * 品类关联度
 * 
 * @class MultiCategory
 * @extends {Component}
 */
@registerTmpl('categoryCorrelation')
@inject('store')
@observer
class CategoryCorrelation extends Component {

  /**
   * 品类关联度
   * 
   * @memberof CategoryCorrelation
  * */
  @observable graphCategoryCorrelationOption = {
    title: {
        text: ''
    },
    tooltip: {},
    animationDurationUpdate: 1500,
    animationEasingUpdate: 'quinticInOut',
    toolbox:{show:false}
  }

  @computed get graphCategoryCorrelationData(){
    let _data = this.props.store.userUpgrade.correlationData ? toJS(this.props.store.userUpgrade.correlationData).map((item,i) => {
      let _symbolSize = 30;
      if((item.correlation*100) >= 10){
        _symbolSize = 40;
      }else if((item.correlation*100) >= 5 && (item.correlation*100) < 10){
        _symbolSize = 30;            
      }else{
        _symbolSize = 20;
      }

      return {
          name: item.category,
          category: item.category,
          draggable: true,
          symbolSize:_symbolSize
      }
    }) : []

    if(this.props.store.conditions.selectedCategory[2]){
      _data = [{
          name: toJS(this.props.store.conditions.selectedCategoryOptions)[2].label,
          category: 0,
          symbolSize: 80,
          draggable: true,
          itemStyle:{
            normal:{
              color:colorList()[0]          
            }
          }
      }].concat(_data);
    }else{
      _data = [{
          name: toJS(this.props.store.conditions.selectedCategoryOptions)[1].label,
          category: 0,
          symbolSize: 80,
          draggable: true,
          itemStyle:{
            normal:{
              color:colorList()[0]
            }
          },
          label:{
            normal:{
              textStyle:{
                color:colorList()[0]
              }
            }
          }   
      }].concat(_data);
    }

    let _link = this.props.store.userUpgrade.correlationData ? toJS(this.props.store.userUpgrade.correlationData).map((item, i) => {
      let _color = '#feced2';
      if((item.correlation*100) >= 10){
        _color = '#a5000e';
      }else if((item.correlation*100) >= 5 && (item.correlation*100) < 10){
        _color = '#fe5664';            
      }else{
        _color = '#feced2';
      }
      
      return {
          source: 0,
          target: i+1,
          lineStyle:{
            normal:{
              width:2,
              color:_color
            }
          },
          value:''
      }
    }) : []

    return [
        {
            name:'品类关联度',
            type: 'graph',
            layout: 'force',
            symbolSize: 15,
            focusNodeAdjacency: true,
            roam: true,
            categories: this.props.store.userUpgrade.correlationData && toJS(this.props.store.userUpgrade.correlationData).map((item, i)=>{

              return {
                name: item.category,
                itemStyle: {
                    normal: {
                        color: colorList().slice(1)[i%colorList().slice(1).length],
                    }
                },
                label:{
                  normal:{
                    textStyle:{
                      color:colorList().slice(1)[i%colorList().slice(1).length]
                    }
                  }
                }
              }
            }),
            label: {
                normal: {
                    show: true,
                    position:'bottom',
                    textStyle: {
                        fontSize: 12
                    },
                }
            },
            force: {
                initLayout:'circular',
                repulsion: 300,
                edgeLength:100,
                gravity:0
            },
            edgeSymbolSize: [4, 50],
            edgeLabel: {
                normal: {
                    show: true,
                    textStyle: {
                        fontSize: 10
                    },
                    formatter: "{c}"
                }
            },
            data: _data,
            links: _link.reduce((a, b)=>{return a.concat(b)}, []),
            lineStyle: {
                normal: {
                    opacity: 0.9,
                    width: 1,
                    curveness: 0
                }
            }
        }
    ]
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const closeLoading = Message.loading('正在获取数据...', 0),
          searchConditions = {
            categoryId1: this.props.store.conditions.selectedCategory[0] || '',
            categoryId2: this.props.store.conditions.selectedCategory[1] || '',
            categoryId3: this.props.store.conditions.selectedCategory[2] || '',
            brandId: this.props.store.conditions.selectedBrand || '',
            date: this.props.store.conditions.selectedDate
          };
    Promise.all([
      this.props.store.userUpgrade.getCorrelationData(searchConditions)
    ]).then(() => {
      closeLoading();
      this.props.store.userUpgrade.setSelectedCategory(this.props.store.userUpgrade.correlationData && this.props.store.userUpgrade.correlationData[0]);
      this.props.store.userUpgrade.getCoincidenceData(Object.assign({},searchConditions, {selectedCategoryId: this.props.store.userUpgrade.correlationData && this.props.store.userUpgrade.correlationData[0] && this.props.store.userUpgrade.correlationData[0].categoryId})).then(()=>{
        closeLoading();
      });
    });
  }

  render() {
    const { store: { userUpgrade } } = this.props;

    return tmpls.categoryCorrelation(this.state, this.props, this, {
      styles,
      userUpgrade
    });
  }
}



/**
 * 品类关联度 - table
 * 
 * @class MultiCategory
 * @extends {Component}
 */
@registerTmpl('categoryCorrelationTable')
@inject('store')
@observer
class CategoryCorrelationTable extends Component {

  @observable tableCategoryCorrelationColumns =  [{
    key:'rank',
    title: '排名',
    dataIndex: 'rank',
    render: (text, record, index) => {
      return {
        children: nj`<span class="rank-${index%4}">${text}</span>`()
      };
    }
  }, {
    key:'category',
    title: '关联品类',
    dataIndex: 'category'
  }, {
    key:'correlation',
    title: '关联度指数',
    dataIndex: 'correlation',
    className: 'blue'
  }, {
    key:'coincidence',
    title: '用户重合度',
    dataIndex: 'coincidence',
    className: 'blue'
  }, {
    key:'expansion',
    title: '用户膨胀度',
    dataIndex: 'expansion',
    className: 'blue'
  }];

  @computed get tableCategoryCorrelationData(){

    return toJS(this.props.store.userUpgrade.correlationData && this.props.store.userUpgrade.correlationData.map((item, i) => {
      return {
        key: i,
        categoryId:item.categoryId,
        rank: item.rank,
        category: item.category,
        correlation: (item.correlation * 100).toFixed(2),
        coincidence: (item.coincidence * 100).toFixed(2),
        expansion: (item.expansion * 100).toFixed(2)
      }
    }));

  }

  @autobind
  onCategorySelected(record){
    this.props.store.userUpgrade.setSelectedCategory(record);
    const closeLoading = Message.loading('正在获取数据...', 0),
          searchConditions = {
            categoryId1: this.props.store.conditions.selectedCategory[0] || '',
            categoryId2: this.props.store.conditions.selectedCategory[1] || '',
            categoryId3: this.props.store.conditions.selectedCategory[2] || '',
            brandId: this.props.store.conditions.selectedBrand || '',
            date: this.props.store.conditions.selectedDate,
            selectedCategoryId: this.props.store.userUpgrade.selectedCategory && this.props.store.userUpgrade.selectedCategory.categoryId
          };
    Promise.all([
      this.props.store.userUpgrade.getCoincidenceData(searchConditions)
    ]).then(() => {
      closeLoading();
    });
  }

  @autobind
  renderRowClass(record, index){
    if(this.props.store.userUpgrade.selectedCategory){
      if(record.categoryId == (this.props.store.userUpgrade.selectedCategory && this.props.store.userUpgrade.selectedCategory.categoryId))
        return 'row-highlight'
    }
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    
  }

  render() {
    const { store: { userUpgrade } } = this.props;

    return tmpls.categoryCorrelationTable(this.state, this.props, this, {
      styles,
      userUpgrade,
      selectedCategory:this.props.store.userUpgrade.selectedCategory
    });
  }
}

/**
 * 关联用户偏好
 * 
 * @class UserPrefer
 * @extends {Component}
 */
@registerTmpl('userPrefer')
@inject('store')
@observer
class UserPrefer extends Component {

  @observable selectedBrand = null;

  @observable tableBrandColumns =  [{
    key:'rank',
    title: '排名',
    dataIndex: 'rank',
    render: (text, record, index) => {
      return {
        children: nj`<span class="rank-${index%4}">${text}</span>`()
      };
    }
  }, {
    key:'brandName',
    title: '品牌',
    dataIndex: 'brandName'
  }];

  @computed get tableBrandData(){

    return toJS(this.props.store.userUpgrade.coincidenceData && this.props.store.userUpgrade.coincidenceData.map((item, i) => {
      return {
        key: i,
        id: item.id,
        rank: item.rank,
        brandName: item.brandName
      }
    }));

  }

  @observable tableCoincidenceColumns =  [
    {
      key:'rank',
      title: '排名',
      dataIndex: 'rank',
      render: (text, record, index) => {
        return {
          children: nj`<span class="rank-${index%4}">${text}</span>`()
        };
      }
    }, {
      key:'brandName',
      title: '品牌',
      dataIndex: 'brandName'
    }, {
      key:'coincidence',
      title: '用户重合度',
      dataIndex: 'coincidence',
      className: 'blue'
    }, {
      key:'expansion',
      title: '潜在用户膨胀度',
      dataIndex: 'expansion',
      className: 'blue'
    }
  ];

  @computed get tableCoincidenceData(){
    let _tmpData = null;

    if(this.selectedBrand){
      _tmpData = toJS(this.props.store.userUpgrade.coincidenceData && this.props.store.userUpgrade.coincidenceData.filter(item=>item.id==this.selectedBrand.id));
    }else{
      _tmpData = toJS(this.props.store.userUpgrade.coincidenceData)
    }

    return _tmpData && _tmpData[0] && _tmpData[0].coincidenceData.map((item, i) => {
      return {
        key: i,
        id: item.id,
        rank: item.rank,
        brandName: item.brandName,
        coincidence: (item.coincidence * 100).toFixed(2),
        expansion: (item.expansion * 100).toFixed(2)
      }
    });

  }

  @autobind
  onBrandSelected(record, index, event){
    this.selectedBrand = record
  }

  @autobind
  renderRowClass(record, index){
    if(this.selectedBrand){
      if(record.id == this.selectedBrand.id)
        return 'row-highlight'
    }else{
      if(index == 0) 
        return 'row-highlight'        
    }
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    
  }

  render() {
    const { store: { userUpgrade } } = this.props;

    return tmpls.userPrefer(this.state, this.props, this, {
      styles,
      userUpgrade
    });
  }
}


/**
 * 京东内销售排名
 * 
 * @class SalesRank
 * @extends {Component}
 */
@registerTmpl('salesRank')
@inject('store')
@observer
class SalesRank extends Component {  
  
  @observable tableBrandRankColumns =  [{
    key:'rank',
    title: '排名',
    dataIndex: 'rank',
    render: (text, record, index) => {
      return {
        children: nj`<i class="rank-${index%4}">${text}</i>`()
      };
    }
  }, {
    key:'brandName',
    title: '品牌',
    dataIndex: 'brandName'
  }];

  @computed get tableBrandRankData(){
    let _filterData = this.tableBrandRankFilterData;
    return toJS(this.props.store.userUpgrade.brandRankData && this.props.store.userUpgrade.brandRankData.map((item, i) => {
      return {
        key: i,
        id: item.id,
        rank: item.rank,
        brandName: item.brandName,
        brandLogo: item.brandLogo,
        userRates:item.userRates,
        rebuyRates:item.rebuyRates,
        priceRates:item.priceRates
      }
    }));
  }

  @computed get tableBrandRankFilterData(){
    let regEx = null;
    if(this.props.store.userUpgrade.searchText){
      regEx = new RegExp(`.*${this.props.store.userUpgrade.searchText}.*`);
    }

    return toJS(this.props.store.userUpgrade.brandRankData && this.props.store.userUpgrade.brandRankData.filter(item=>regEx?item.brandName.search(regEx)>=0:true).map((item, i) => {
      return {
        key: i,
        id: item.id,
        rank: item.rank,
        brandName: item.brandName,
        brandLogo: item.brandLogo,
        userRates:item.userRates,
        rebuyRates:item.rebuyRates,
        priceRates:item.priceRates
      }
    }));

  }

  @computed get radarOption(){
    const _selectedBrandItems = toJS(this.props.store.userUpgrade.selectedBrandItems) || [];
    let max = 100, min = 0;
    
    if(_selectedBrandItems.length > 0){
      _selectedBrandItems.forEach(item=>{
        if((item.userRates*100) > max){
          max = item.userRates*100;
        }
        if((item.rebuyRates*100) > max){
          max = item.rebuyRates*100;
        }
        if((item.priceRates*100) > max){
          max = item.priceRates*100;
        }
        if((item.userRates*100) < min){
          min = item.userRates*100;
        }
        if((item.rebuyRates*100) < min){
          min = item.rebuyRates*100;
        }
        if((item.priceRates*100) < min){
          min = item.priceRates*100;
        }
      });
    }

    

    return {
      tooltip: {
          trigger: 'axis'
      },
      toolbox:{show:false},
      legend: {
          left: 'right',
          data:_selectedBrandItems.map(item => {
            return item.brandName
          })
      },
      radar: [
          {
              indicator: [
                  {text: '用户数', max: max+max*0.2, min: min},
                  {text: '复购率', max: max+max*0.2, min: min},
                  {text: '客单价', max: max+max*0.2, min: min}
              ],
              center: ['50%','50%'],
              radius: 80
          }
      ]
    }
  }

  @computed get radarData(){
    const _selectedBrandItems = toJS(this.props.store.userUpgrade.selectedBrandItems) || [];
    return [
        {
            type: 'radar',
            tooltip: {
                trigger: 'item'
            },
            itemStyle: {normal: {areaStyle: {type: 'default'}}},
            data: _selectedBrandItems.map(item => {
              return {
                value: [(item.userRates*100).toFixed(2), (item.rebuyRates*100).toFixed(2), (item.priceRates*100).toFixed(2)],
                name: item.brandName
              }
            })
        }
    ]
  }

  @autobind
  onSelectChange(selectedRowKeys, selectedRows) {
    if(selectedRows.length == 1){
      this.props.store.userUpgrade.setFirstSelected(selectedRows[0].id);
    }
    if(this.props.store.userUpgrade.selectedBrandRows && this.props.store.userUpgrade.selectedBrandRows.length > 0){
      if(this.props.store.userUpgrade.selectedBrandRows.length < 2){
        this.props.store.userUpgrade.setSelectedBrandRows(toJS(this.props.store.userUpgrade.selectedBrandRows).concat(selectedRows.filter(item=>item.id != toJS(this.props.store.userUpgrade.selectedBrandRows)[0].id)));
      }
    }else{
      this.props.store.userUpgrade.setSelectedBrandRows(selectedRows);
    }
  }

  @autobind
  onSelect(record, selected, selectedRows){
    

    if(selected){
      if(this.props.store.userUpgrade.selectedBrandItems && this.props.store.userUpgrade.selectedBrandItems.length > 0){
        if(this.props.store.userUpgrade.selectedBrandItems.length < 2){
          this.props.store.userUpgrade.setSelectedBrandItems(toJS(this.props.store.userUpgrade.selectedBrandItems).concat(selectedRows.filter(item=>item.id != toJS(this.props.store.userUpgrade.selectedBrandItems)[0].id)))
        }
      }else{
        this.props.store.userUpgrade.setSelectedBrandItems(toJS(this.tableBrandRankData).filter(item=>selectedRows.some(row=>row.id==item.id)));
      }

      if(this.props.store.userUpgrade.selectedBrandRows.length == 2){
        
        // if(this.props.store.userUpgrade.selectedBrandRows[0].id != this.props.store.userUpgrade.firstSelected){
        //   this.props.store.userUpgrade.setSelectedBrandItems([this.props.store.userUpgrade.selectedBrandItems[1], this.props.store.userUpgrade.selectedBrandItems[0]]);
        // }
        this.props.store.userUpgrade.getUserCoincidenceRates({
          categoryId1: this.props.store.conditions.selectedCategory[0] || '',
          categoryId2: this.props.store.conditions.selectedCategory[1] || '',
          categoryId3: this.props.store.conditions.selectedCategory[2] || '',
          brandId: this.props.store.conditions.selectedBrand || '',
          date: this.props.store.conditions.selectedDate,
          brandId1:this.props.store.userUpgrade.selectedBrandItems[0].id,
          brandId2:this.props.store.userUpgrade.selectedBrandItems[1].id
        });
      }else{
        this.props.store.userUpgrade.setUserCoincidenceRates({
          success:true,
          data:{value:null}
        });
      }
    }else{
      console.log(toJS(this.props.store.userUpgrade.selectedBrandRows).filter(item=>item.id != record.id))
      this.props.store.userUpgrade.setSelectedBrandRows(toJS(this.props.store.userUpgrade.selectedBrandRows).filter(item=>item.id != record.id));
      this.props.store.userUpgrade.setSelectedBrandItems(toJS(this.props.store.userUpgrade.selectedBrandRows).filter(item=>item.id != record.id));
      this.props.store.userUpgrade.setUserCoincidenceRates({
        success:true,
        data:{value:null}
      });
    }
    
  }

  @autobind
  filterRows(record, index){
    if(this.props.store.userUpgrade.searchText){
      if(this.props.store.userUpgrade.selectedBrandRows && this.props.store.userUpgrade.selectedBrandRows.filter(item=>item.id == record.id).length > 0){
        return '';
      }

      if(this.tableBrandRankFilterData.filter(item=>item.id == record.id).length > 0){
        return '';
      }else{
        return 'hide';
      }
    }else{
        return '';
    }
  }

  @autobind
  onSearchChange(e){
    e.persist();
    this.debounceChange(e);
  }

  @autobind
  removeSelectedBrand(id){
    return (e) => {
      let _selectedRows = this.props.store.userUpgrade.selectedBrandRows && toJS(this.props.store.userUpgrade.selectedBrandRows);
      let _selectedItems = this.props.store.userUpgrade.selectedBrandRows && toJS(this.props.store.userUpgrade.selectedBrandRows);


      this.props.store.userUpgrade.setSelectedBrandRows(_selectedRows.filter(item=>item.id != id));
      this.props.store.userUpgrade.setSelectedBrandItems(_selectedItems.filter(item=>item.id != id));
      this.props.store.userUpgrade.setUserCoincidenceRates({
        success:true,
        data:{value:null}
      });
    }
  }

  constructor(props) {
    super(props);
    this.debounceChange = debounce(e => {
      this.props.store.userUpgrade.setSearchText(e.target.value);
      this.props.store.userUpgrade.getBrandRankData({
        categoryId1: this.props.store.conditions.selectedCategory[0] || '',
        categoryId2: this.props.store.conditions.selectedCategory[1] || '',
        categoryId3: this.props.store.conditions.selectedCategory[2] || '',
        brandId: this.props.store.conditions.selectedBrand || '',
        date: this.props.store.conditions.selectedDate,
        brandNameCn: this.props.store.userUpgrade.searchText
      });
    }, 500);

    this.tableSetting = {y:280}
  }

  componentDidMount() {
    const closeLoading = Message.loading('正在获取数据...', 0),
          searchConditions = {
            categoryId1: this.props.store.conditions.selectedCategory[0] || '',
            categoryId2: this.props.store.conditions.selectedCategory[1] || '',
            categoryId3: this.props.store.conditions.selectedCategory[2] || '',
            brandId: this.props.store.conditions.selectedBrand || '',
            date: this.props.store.conditions.selectedDate,
            brandNameCn: this.props.store.userUpgrade.searchText
          };
    Promise.all([
      this.props.store.userUpgrade.getBrandRankData(searchConditions)
    ]).then(() => {
      closeLoading();
    });
  }

  render() {
    const { store: { userUpgrade } } = this.props;

    let _keys = [];
    _keys = this.tableBrandRankData && toJS(this.tableBrandRankData).filter(item=>{
      if(this.props.store.userUpgrade.selectedBrandRows){
        let _tmpBrand = toJS(this.props.store.userUpgrade.selectedBrandRows).find(brand=>brand.id == item.id);
        if(_tmpBrand){
          return true;
        }else{
          return false;
        }
      }else{
        return false;
      }
    }).map(item=>item.key);


    const rowSelection = {
      selectedRowKeys: _keys,
      onChange: this.onSelectChange,
      onSelect: this.onSelect,
      getCheckboxProps: (record) => {
        if(this.props.store.userUpgrade.selectedBrandRows){
          const _selectedBrandRows = toJS(this.props.store.userUpgrade.selectedBrandRows);
          if(_selectedBrandRows.length == 2){
            return {
              disabled: !_selectedBrandRows.some(item => item.key == record.key)
            };
          }else{
            return {
              disabled:false
            }
          }
        }else{
          return {
            disabled:false
          }
        }
      }
    };

    return tmpls.salesRank(this.state, this.props, this, {
      styles,
      userUpgrade,
      rowSelection,
      defaultLogo: require('../../images/default-logo.png')
    });
  }
}
