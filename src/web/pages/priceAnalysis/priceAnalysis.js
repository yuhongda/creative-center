import React, {Component} from 'react';
import { findDOMNode } from 'react-dom';
import {observable, computed, toJS, runInAction} from 'mobx'
import {observer, inject} from 'mobx-react';
import nj from 'nornj';
import {registerTmpl} from 'nornj-react';
import 'vic-common/lib/components/antd/pagination';
import 'vic-common/lib/components/antd/icon';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/component/calendar';
import 'vic-common/lib/components/ECharts/barChart';
import Message from 'vic-common/lib/components/antd/message';
import graphic from 'echarts/lib/util/graphic.js'
import {autobind} from 'core-decorators';
import styles from './priceAnalysis.m.scss';
import tmpls from './priceAnalysis.t.html';
import '../../components/conditons';
import { dateFormat, getGeoCoordMap } from '../../misc/util'

//页面容器组件
@inject('store')
@observer
@registerTmpl('PriceAnalysis')
export default class PriceAnalysis extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }

  getSearchConditions() {
    return {
      categoryId1: this.props.store.conditions.selectedCategory[0] || '',
      categoryId2: this.props.store.conditions.selectedCategory[1] || '',
      categoryId3: this.props.store.conditions.selectedCategory[2] || '',
      brandId: this.props.store.conditions.selectedBrand || '',
      date: this.props.store.conditions.selectedDate || dateFormat(new Date(), 'yyyy-mm') ,
      page: 1,
      pageSize: 10
    }
  }

  @autobind
  onSearch(){
    const { store: { priceAnalysis } } = this.props;
    const closeLoading = Message.loading('正在获取数据...', 0);
    const searchParams = this.getSearchConditions();
    // console.log('searchParams',searchParams);
    priceAnalysis.setSearchParams(searchParams);
    Promise.all([
       priceAnalysis.getPriceProductsData(searchParams)
    ]).then(()=> {
      const searchList = searchParams,
            saleBandId = toJS(priceAnalysis.priceProductsData)[2][0];
            searchList.saleBand = saleBandId;
            searchList.sensitivity = 1;
            priceAnalysis.setSaleBand(saleBandId);
            priceAnalysis.setSensitivity(1);
            priceAnalysis.setBandIndex(0);
      // console.log('searchList',searchList);
      // console.log('priceProductsData',toJS(priceAnalysis.priceProductsData));
      priceAnalysis.getPriceProductsList(searchParams)
    }).then(() => {
      closeLoading();
    });
  }

  render() {
    const { store: { conditions } } = this.props;
    return tmpls.priceAnalysis(this.state, this.props, this, {styles, conditions});
  }
}

/**
 * summary
 *
 * @class PriceAnalysisSummary
 * @extends {Component}
 */
@registerTmpl('priceAnalysisSummary')
@inject('store')
@observer
class PriceAnalysisSummary extends Component {
  render() {
    return tmpls.priceAnalysisSummary(this.state,this, {styles, iconGraph: require('../../images/icon-price-summary.png')});
  }
}

/**
 * products
 *
 * @class priceAnalysisProduct
 * @extends {Component}
 */
@registerTmpl('priceAnalysisProduct')
@inject('store')
@observer
class PriceAnalysisProduct extends Component {

  @computed get barProductsOption() {
    let _data = this.props.store.priceAnalysis.priceProductsData;
    return {
      backgroundColor: '#fff',
      toolbox: false,
      tooltip: {
        formatter:function(params){
              let result = `<div>${params[0].name} 指标解读</div>`;
              params.forEach(function (item) {
                let num = `${item.data}` < 0 ? -`${item.data}` : `${item.data}`;
                if( num == 'null') { num = 0 }
                result += `<div>
                              <span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:${item.color}"></span>
                              <span>${item.seriesName}:</span>
                              <span>${ (num * 100).toFixed(0) || '--'}%</span>
                           </div>`;
              });
              return result
          }
      },
      xAxis: {
        data: toJS(_data && _data[2]),
        name: '销量Band',
        silent: false,
        axisLabel: { show: true },
        axisTick: { show: false },
        axisLine: {
          lineStyle: {
            color:'#999'
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#e6e6e6',
            type: 'dotted',
          }
        },
        splitArea: {
          show: true,
          areaStyle: {
            color: ['rgba(250,250,250,0.2)','rgba(252,252,252,0.3)']
          }
        },
      },
      color: ['#82A5B9', '#EDB0AD'],
      yAxis: {
        show:true,
        inverse: false,
        axisLabel: { show: false },
        axisTick: { show: false },
        axisLine: {
          lineStyle: {
            color:'#999'
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#e6e6e6',
            type: 'dotted',
          }
        },
        splitArea: {
          show: true,
          areaStyle: {
            color: ['rgba(250,250,250,0.3)','rgba(252,252,252,0.4)']
          }
        },
        min: -1,
        max: 1,
      },
      grid: {
        left: 100
      }
    };
  }

  @computed get barProductsData() {
    let _data = this.props.store.priceAnalysis.priceProductsData
    let itemStyle = {
        normal: {
          borderColor: '#2D6A89',
          borderWidth: 3,
          borderType: 'solid',
          barBorderRadius: 5,
        },
        emphasis: {
            // color: '#c23531',
            barBorderWidth: 1,
            shadowBlur: 20,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            shadowColor: 'rgba(0,0,0,0.5)'
        }
    };
    let itemStyle2 = {
      normal: {
        borderColor: '#DC4638',
        borderWidth: 3,
        borderType: 'solid',
        barBorderRadius: 5,
      },
      emphasis: {
          // color: '#c23531',
          barBorderWidth: 1,
          shadowBlur: 20,
          shadowOffsetX: 0,
          shadowOffsetY: 0,
          shadowColor: 'rgba(0,0,0,0.5)'
      }
    }
    return [
      {
        name: '高',
        type: 'bar',
        stack: 'one',
        barWidth: '40%',
        itemStyle: itemStyle,
        data: toJS(_data && _data[0])
      }, {
        name: '低',
        type: 'bar',
        stack: 'one',
        itemStyle: itemStyle2,
        data: toJS(_data && _data[1])
      }
    ]
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { store: { priceAnalysis } } = this.props;
    this.refs.ecProducts.chart.on('click', params => {
       const _sensitivity = params.seriesName === "低" ? 0 : 1;
       runInAction(() => {
         priceAnalysis.setSaleBand(params.name);
         priceAnalysis.setBandIndex(params.seriesIndex);
         priceAnalysis.setSensitivity(_sensitivity);
       });
      //  console.log('params', params);
       const listParams = toJS(priceAnalysis.searchParams);
       listParams.saleBand = params.name;
       listParams.sensitivity = _sensitivity;
      //  console.log('请求list的参数',listParams);
       const closeLoading = Message.loading('正在获取数据...', 0);
        Promise.all([
            priceAnalysis.getPriceProductsList(listParams),
            priceAnalysis.setPriceCurrentPage(1)
        ]).then(() => { closeLoading() });
    });

  }

  render() {
    const {store: { priceAnalysis }} = this.props;
    return tmpls.priceAnalysisProduct(this.state, this.props, this, {styles, priceAnalysis});
  }
}


/**
 * list
 *
 * @class priceAnalysisList
 * @extends {Component}
 */
@registerTmpl('priceAnalysisList')
@inject('store')
@observer
class PriceAnalysisList extends Component {

  constructor(props) {
    super(props);
  }

  @autobind
  onDownload() {
    findDOMNode(this.refs.formExport).submit();
  }

  @autobind
  onPaging(page, pageSize){
    const closeLoading = Message.loading('正在获取数据...', 0);
    const { store: { priceAnalysis } } = this.props;
    const pageParams = toJS(priceAnalysis.searchParams);
    pageParams.saleBand = priceAnalysis.saleBand;
    pageParams.sensitivity = priceAnalysis.sensitivity;
    pageParams.page = page;
    pageParams.pageSize = pageSize;
    // console.log('pageParams', pageParams);
    Promise.all([
      this.props.store.priceAnalysis.getPriceProductsList(pageParams),
      this.props.store.priceAnalysis.setPriceCurrentPage(page)
    ]).then(() => {
      closeLoading();
    });
  }

  render() {
    const {store: { priceAnalysis }} = this.props;
    return tmpls.priceAnalysisList(this.state, this.props, this,
      {
        styles,
        priceAnalysis,
        categoryId1: this.props.store.conditions.selectedCategory[0] || '',
        categoryId2: this.props.store.conditions.selectedCategory[1] || '',
        categoryId3: this.props.store.conditions.selectedCategory[2] || '',
        brandId: this.props.store.conditions.selectedBrand || '',
        date: this.props.store.conditions.selectedDate || '',
        formAction: `${__HOST}/priceAnalysis/getPriceTableData`
      });
  }
}
