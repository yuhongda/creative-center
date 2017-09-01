import React, { Component } from 'react';
import { observable, computed, toJS } from 'mobx'
import { observer, inject } from 'mobx-react';
import nj from 'nornj';
import { registerTmpl } from 'nornj-react';
import 'vic-common/lib/components/antd/radio';
import 'vic-common/lib/components/antd/button';
import 'vic-common/lib/components/antd/cascader';
import 'vic-common/lib/components/antd/datepicker';
import 'vic-common/lib/components/antd/checkbox';
import 'vic-common/lib/components/antd/pagination';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/component/visualMap';
import 'echarts/lib/component/calendar';
import 'vic-common/lib/components/ECharts/barChart';
import 'vic-common/lib/components/ECharts/lineChart';
import 'vic-common/lib/components/ECharts/pieChart';
import Message from 'vic-common/lib/components/antd/message';
import Notification from 'vic-common/lib/components/antd/notification';
import graphic from 'echarts/lib/util/graphic.js'
import { autobind } from 'core-decorators';
import styles from './businessEval.m.scss';
import tmpls from './businessEval.t.html';
import '../../components/conditons';


//页面容器组件
@inject('store')
@observer
@registerTmpl('BusinessEval')
export default class BusinessEval extends Component {

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
            date: this.props.store.conditions.selectedDate || '',
            page:1,
            pagesize:10
          };
    Promise.all([
      this.props.store.businessEval.getSummaryData(searchConditions),
      this.props.store.businessEval.getGrowthData(searchConditions),
      this.props.store.businessEval.getSubCategoryData(searchConditions),
      this.props.store.businessEval.getBarSubCategoryData(searchConditions),
      this.props.store.businessEval.getTableSubCategoryData(searchConditions),
      this.props.store.businessEval.getBrandCompareList(searchConditions),
      this.props.store.businessEval.getBrandCompareItemForCategory(searchConditions)
    ]).then(() => {
      this.props.store.businessEval.clearCompareDockData();
      closeLoading();
    });
  }

  render() {
    const { store: { conditions } } = this.props;
    return tmpls.businessEval(this.state, this.props, this, {
      styles,
      conditions
    });
  }
}

/**
 * summary
 *
 * @class EvalSummary
 * @extends {Component}
 */
@registerTmpl('evalSummary')
@inject('store')
@observer
class EvalSummary extends Component {

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount() {
  }

  render() {
    const { store: { businessEval } } = this.props;
    return tmpls.evalSummary(this.state, this.props, this, {
      styles,
      businessEval
    });
  }
}


/**
 * 整体生意评估
 *
 * @class TotalCompare
 * @extends {Component}
 */
@registerTmpl('totalCompare')
@inject('store')
@observer
class TotalCompare extends Component {

  @observable switchIndex = 'a';
  //销售额趋势
  @computed get salesOptions(){
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
        right:0,
        top:0,
        data: ['宝洁', '品类']
      },
      tooltip: {
          show: true,
          trigger: 'axis',
          formatter:function(params){
              var result = `<div>${params[0].name}</div>`;
              params.forEach(function (item) {
                if(item.seriesName != '品类'){
                  result += `<div>
                                  <span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:${item.color}"></span>
                                  <span>${item.seriesName}:</span>
                                  <span>${item.data || '--'}</span>
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
          data: toJS(this.props.store.businessEval.salesData && this.props.store.businessEval.salesData[2])
      },
      yAxis: {
          show:false,
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
  }
  @computed get salesData(){
    return [
      {
        name: '宝洁',
        type:'bar',
        barWidth: '30px',
        data: toJS(this.props.store.businessEval.salesData && this.props.store.businessEval.salesData[0].map(item=>(item/10000).toFixed(2)))
      },
      {
        name:'品类',
        type:'line',
        data:toJS(this.props.store.businessEval.salesData && this.props.store.businessEval.salesData[1].map(item=>(item/10000).toFixed(2)))
      }
    ];
  };

  //销售额同比增长率趋势
  @computed get salesRatesOptions(){
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
        data: ['宝洁', '品类']
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
                                  <span>${item.data || '--'}%</span>
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
          data: toJS(this.props.store.businessEval.salesRatesData && this.props.store.businessEval.salesRatesData[2])
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
              },
              formatter:'{value}%'
          }
      }
    };
  };
  @computed get salesRatesData(){
    return [
      {
        name: '宝洁',
        type: 'line',
        data: toJS(this.props.store.businessEval.salesRatesData && this.props.store.businessEval.salesRatesData[0].map(item=>(item*100).toFixed(2)))
      },
      {
        name:'品类',
        type:'line',
        data: toJS(this.props.store.businessEval.salesRatesData && this.props.store.businessEval.salesRatesData[1].map(item=>(item*100).toFixed(2)))
      }
    ];
  };

  //增长驱动力趋势
  @computed get growthOptions(){
    let dataX = [], unit = '';
    switch (this.switchIndex) {
      case 'a':
        dataX = toJS(this.props.store.businessEval.growthDataUV && this.props.store.businessEval.growthDataUV[2]);
        unit = '%';
        break;
      case 'b':
        dataX = toJS(this.props.store.businessEval.growthDataUVConvert && this.props.store.businessEval.growthDataUVConvert[2]);
        unit = '%'
        break;
      case 'c':
        dataX = toJS(this.props.store.businessEval.growthDataUser && this.props.store.businessEval.growthDataUser[2]);
        unit = '%';
        break;
      case 'd':
        dataX = toJS(this.props.store.businessEval.growthDataPrice && this.props.store.businessEval.growthDataPrice[2]);
        unit = '';
        break;
    }
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
        data: ['宝洁', '品类']
      },
      tooltip: {
          show: true,
          trigger: 'axis',
          formatter:function(params){
              var result = `<div>${params[0].name}</div>`;
              params.forEach(function (item) {
                if(unit == ''){
                  if(item.seriesName != '品类'){
                    result += `<div>
                                    <span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:${item.color}"></span>
                                    <span>${item.seriesName}:</span>
                                    <span>${item.data || '--'}${unit}</span>
                                </div>`;
                  }
                }else{
                  result += `<div>
                                <span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:${item.color}"></span>
                                <span>${item.seriesName}:</span>
                                <span>${item.data || '--'}${unit}</span>
                            </div>`;
                }

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
          data: dataX
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
              },
              formatter:`{value}${unit}`
          }
      }
    };
  };
  @computed get growthData(){
    let data1 = [], data2 = [];
    switch (this.switchIndex) {
      case 'a':
        data1 = toJS(this.props.store.businessEval.growthDataUV && this.props.store.businessEval.growthDataUV[0].map(item=>(item*100).toFixed(2)));
        data2 = toJS(this.props.store.businessEval.growthDataUV && this.props.store.businessEval.growthDataUV[1].map(item=>(item*100).toFixed(2)));
        break;
      case 'b':
        data1 = toJS(this.props.store.businessEval.growthDataUVConvert && this.props.store.businessEval.growthDataUVConvert[0].map(item=>(item*100).toFixed(2)));
        data2 = toJS(this.props.store.businessEval.growthDataUVConvert && this.props.store.businessEval.growthDataUVConvert[1].map(item=>(item*100).toFixed(2)));
        break;
      case 'c':
        data1 = toJS(this.props.store.businessEval.growthDataUser && this.props.store.businessEval.growthDataUser[0].map(item=>(item*100).toFixed(2)));
        data2 = toJS(this.props.store.businessEval.growthDataUser && this.props.store.businessEval.growthDataUser[1].map(item=>(item*100).toFixed(2)));
        break;
      case 'd':
        data1 = toJS(this.props.store.businessEval.growthDataPrice && this.props.store.businessEval.growthDataPrice[0].map(item=>(item).toFixed(2)));
        data2 = toJS(this.props.store.businessEval.growthDataPrice && this.props.store.businessEval.growthDataPrice[1].map(item=>(item).toFixed(2)));
        break;
    }
    return [
      {
        name: '宝洁',
        type:'line',
        data: data1
      },
      {
        name:'品类',
        type:'line',
        data: data2
      }
    ];
  };

  constructor(props) {
    super(props);
  }

  @autobind
  onGrowthTypeChange(e){
    this.switchIndex = e.target.value
  }

  componentDidMount() {
  }

  render() {
    const { store: { businessEval } } = this.props;
    return tmpls.totalCompare(this.state, this.props, this, {
      styles,
      iconJD:require('../../images/icon-logo-jd.png'),
      iconPG:require('../../images/icon-logo-pg.png'),
      businessEval
    });
  }
}


/**
 * 下级品类对比
 *
 * @class CategoryCompare
 * @extends {Component}
 */
@registerTmpl('categoryCompare')
@inject('store')
@observer
class CategoryCompare extends Component {

  @observable currentView = 1; // 1:'chart' | 2:'table'

  //下级品类对比
  @computed get pieCategoryOptions(){
    return {
      grid: {
          left: '3%',
          right: '3%',
          top:0,
          bottom:0,
          containLabel: true
      },
      tooltip : {
          trigger: 'item',
          // formatter: "{a} <br/>{b} : {c} ({d}%)",
          formatter:function(params){
              var result = `<div>${params.name}</div>`;
              result += `<div>
                              <span>${params.seriesName}:</span>
                              <span>${params.seriesName == '品类'? '' : '('+params.data.value+')'} ${params.percent}%</span>
                          </div>`;
              return result
          }
      },
      toolbox:{show:false},
      legend: {
        left: 'center',
        data: toJS(this.props.store.businessEval.pieSubCategoryData && this.props.store.businessEval.pieSubCategoryData[2])
      }
    };
  };
  @computed get pieCategoryData(){

    let _data1 = [], _data2 = [];
    if(this.props.store.businessEval.pieSubCategoryData){
      this.props.store.businessEval.pieSubCategoryData[0].forEach((item, i)=>{
        _data1.push({
          value:(item/10000).toFixed(2),
          name:this.props.store.businessEval.pieSubCategoryData[2][i]
        });
      });
      this.props.store.businessEval.pieSubCategoryData[1].forEach((item, i)=>{
        _data2.push({
          value:(item/10000).toFixed(2),
          name:this.props.store.businessEval.pieSubCategoryData[2][i]
        });
      });
    }

    return [
      {
        name: '品类',
        radius : '40%',
        center: ['25%', '50%'],
        label: {
            normal: {
                show: false
            },
            emphasis: {
                show: true
            }
        },
        lableLine: {
            normal: {
                show: false
            },
            emphasis: {
                show: true
            }
        },
        data:_data1,
        itemStyle: {
            emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
        }
      },
      {
        name:'宝洁',
        type: 'pie',
        radius : '40%',
        center: ['75%', '50%'],
        label: {
            normal: {
                show: false
            },
            emphasis: {
                show: true
            }
        },
        lableLine: {
            normal: {
                show: false
            },
            emphasis: {
                show: true
            }
        },
        data:_data2,
        itemStyle: {
            emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
        }
      }
    ];
  };
  //销售额同比增长率对比
  @computed get barCategoryOptions(){
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
        data: ['宝洁', '品类']
      },
      tooltip: {
          show: true,
          trigger: 'axis'
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
              },
              rotate:30,
              interval:0
          },
          data: toJS(this.props.store.businessEval.barSubCategoryData && this.props.store.businessEval.barSubCategoryData[2])
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
              },
              formatter:`{value}%`
          }
      },
      series: [
        {
            name:'宝洁',
            type:'bar',
            smooth: true,
            itemStyle:{
                normal:{
                    color:'#616dd3'
                }
            },
            lineStyle:{
                normal:{
                    color:'#616dd3'
                }
            },
            areaStyle:{
                normal:{
                    color: new graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: .5,
                        color: 'rgba(97, 109, 211, .3)'
                    }, {
                        offset: 1,
                        color: 'rgba(255, 255, 255, .2)'
                    }])
                }
            }
        }
      ]
    };
  };
  @computed get barCategoryData(){
    return [
      {
        name: '宝洁',
        type:'bar',
        data: toJS(this.props.store.businessEval.barSubCategoryData && this.props.store.businessEval.barSubCategoryData[0].map(item=>(item*100).toFixed(2)))
      },
      {
        name:'品类',
        type:'bar',
        data: toJS(this.props.store.businessEval.barSubCategoryData && this.props.store.businessEval.barSubCategoryData[1].map(item=>(item*100).toFixed(2)))
      }
    ];
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // const closeLoading = Message.loading('正在获取数据...', 0);
    // Promise.all([
    //   this.props.store.businessEval.getSubCategoryData(),
    //   this.props.store.businessEval.getBarSubCategoryData(),
    //   this.props.store.businessEval.getTableSubCategoryData()
    // ]).then(() => {
    //   closeLoading();
    //   this.pieCategoryData[0].data = this.pieCategoryData[0].data.map((item, i) => {
    //     item.value = this.props.store.businessEval.pieSubCategoryData[0][i];
    //     return item;
    //   });
    //   this.pieCategoryData[1].data = this.pieCategoryData[1].data.map((item, i) => {
    //     item.value = this.props.store.businessEval.pieSubCategoryData[1][i];
    //     return item;
    //   });
    // });
  }

  @autobind
  switchView(index){
    return (e) => {
      this.currentView = index;
    };
  }

  render() {
    const { store: { businessEval, conditions } } = this.props;

    return tmpls.categoryCompare(this.state, this.props, this, {
      styles,
      businessEval,
      conditions
    });
  }
}

/**
 * 品牌生意对比
 *
 * @class BrandCompare
 * @extends {Component}
 */
@registerTmpl('brandCompare')
@inject('store')
@observer
class BrandCompare extends Component {

  @observable trendsChartVisible = false;
  @observable trendsChartDataX = [];
  @computed get trendsChartOptions(){
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
        data: ['品类增长率', '品牌增长率', '销售额']
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
                                  <span>${item.data || '--'}${item.seriesName=='销售额'?'':'%'}</span>
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
          data: toJS(this.trendsChartDataX)
      },
      yAxis: [
        {
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
        },
        {
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
      ],
      series: [
        {
          name: '品类增长率',
          type: 'line',
          yAxisIndex: 1,
          smooth: true,
          itemStyle: {
            normal: {
              color: '#616dd3'
            }
          },
          lineStyle: {
            normal: {
              color: '#616dd3'
            }
          },
          areaStyle: {
            normal: {
              color: new graphic.LinearGradient(0, 0, 0, 1, [{
                offset: .5,
                color: 'rgba(97, 109, 211, .3)'
              }, {
                offset: 1,
                color: 'rgba(255, 255, 255, .2)'
              }])
            }
          }
        },
        {
          name: '品牌增长率',
          type: 'line',
          yAxisIndex: 1,
          smooth: true,
          itemStyle: {
            normal: {
              color: '#616dd3'
            }
          },
          lineStyle: {
            normal: {
              color: '#616dd3'
            }
          },
          areaStyle: {
            normal: {
              color: new graphic.LinearGradient(0, 0, 0, 1, [{
                offset: .5,
                color: 'rgba(97, 109, 211, .3)'
              }, {
                offset: 1,
                color: 'rgba(255, 255, 255, .2)'
              }])
            }
          }
        },
        {
          name: '销售额',
          type: 'bar',
          barWidth: '60%'
        }
      ]
    };
  };
  @observable trendsChartData = [
    {
      name: '品类增长率',
      type:'line',
      data: [],
      yAxisIndex: 1
    },
    {
      name: '品牌增长率',
      type:'line',
      data: [],
      yAxisIndex: 1
    },
    {
      name:'销售额',
      type:'bar',
      barWidth:'50px',
      data:[]
    }
  ];
  @observable trendsChartTop = 1;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  @autobind
  onBrandChecked(item){
    return (e) => {
      if(e.target.checked){
        this.props.store.businessEval.setCompareDockVisible(true);
        if(this.props.store.businessEval.compareDockData){
          if(this.props.store.businessEval.compareDockData.length + 1 < 5){
            this.props.store.businessEval.setChecked(item, true);
            this.props.store.businessEval.setCompareDockData(item);
          }else{
            e.target.checked = false;
            Notification.error({ description: '最多可以对比三个品牌', duration: 2 });
          }
        }else{
            this.props.store.businessEval.setChecked(item, true);
            this.props.store.businessEval.setCompareDockData(item);
        }
      }else{
        this.props.store.businessEval.setChecked(item, false);
        this.props.store.businessEval.removeCompareDockData(item);
      }
    }
  }

  @autobind
  viewTrends(item, index){
    return (e) => {
      this.trendsChartTop = index * 134 + index+1
      setTimeout(()=>{
        this.trendsChartVisible = true;
        this.trendsChartData[0].data = toJS(item.trendsData[0].map(item=>parseFloat((item*100).toFixed(2))));
        this.trendsChartData[1].data = toJS(item.trendsData[1].map(item=>parseFloat((item*100).toFixed(2))));
        this.trendsChartData[2].data = toJS(item.trendsData[2].map(item=>parseFloat((item/10000).toFixed(2))));
        this.trendsChartDataX = toJS(item.trendsData[3]);
      },300)
    }
  }

  @autobind
  closeTrendsChart(){
    this.trendsChartVisible = false
  }

  @autobind
  closeCompareTable(){
    this.props.store.businessEval.setShowCompareTable(false);
    this.props.store.businessEval.clearCompareDockData();
  }

  @autobind
  onPaging(page, pageSize){
    const closeLoading = Message.loading('正在获取数据...', 0),
          searchConditions = {
            categoryId1: this.props.store.conditions.selectedCategory[0] || '',
            categoryId2: this.props.store.conditions.selectedCategory[1] || '',
            categoryId3: this.props.store.conditions.selectedCategory[2] || '',
            date: this.props.store.conditions.selectedDate || '',
            page:1,
            pagesize:10
          };
    Promise.all([
      this.props.store.businessEval.getBrandCompareList(searchConditions)
    ]).then(() => {
      closeLoading();
    });
  }

  render() {
    const { store: { businessEval } } = this.props;

    return tmpls.brandCompare(this.state, this.props, this, {
      styles,
      businessEval,
      defaultLogo: require('../../images/default-logo.png')
    });
  }
}


/**
 * compare dock
 *
 * @class EvalSummary
 * @extends {Component}
 */
@registerTmpl('compareDock')
@inject('store')
@observer
class CompareDock extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  @autobind
  deleteCompareItem(item){
    return (e) => {
      this.props.store.businessEval.removeCompareDockData(item);
      this.props.store.businessEval.setChecked(item, false);
    }
  }

  @autobind
  closeCompareDock(){
    this.props.store.businessEval.setCompareDockVisible(false);
  }

  @autobind
  compareIt(){
    this.props.store.businessEval.setShowCompareTable(true);
    this.props.store.businessEval.setCompareDockVisible(false);
  }

  render() {

    const { store: { businessEval } } = this.props;
    return tmpls.compareDock(this.state, this.props, this, {
      styles,
      businessEval,
      defaultLogo: require('../../images/default-logo.png')
    });
  }
}
