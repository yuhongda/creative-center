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
import 'vic-common/lib/components/antd/radio';
import 'vic-common/lib/components/antd/checkbox';
import 'vic-common/lib/components/antd/popover';
import echarts from 'echarts/lib/echarts';
import 'vic-common/lib/components/ECharts/lineChart';
import 'vic-common/lib/components/ECharts/barChart';
import 'vic-common/lib/components/ECharts/scatterChart';
import 'vic-common/lib/components/ECharts/mapChart';
import 'echarts/lib/component/dataZoom';
import 'echarts/lib/component/markLine';
import 'echarts/map/js/china';
import Message from 'vic-common/lib/components/antd/message';
import graphic from 'echarts/lib/util/graphic.js'
import { autobind } from 'core-decorators';
import styles from './marketCompetition.m.scss';
import tmpls from './marketCompetition.t.html';
import '../../components/conditons';
import { dateFormat, debounce, colorList, getGeoCoordMap } from '../../misc/util'
import moment from 'moment';
import { outputMoney } from 'flarej/lib/utils/math';



//页面容器组件
@inject('store')
@observer
@registerTmpl('MarketCompetition')
export default class MarketCompetition extends Component {
  
  @computed get brandDataWithoutAll(){
    return this.props.store.marketCompetition.brandData;
  }

  constructor(props) {
      super(props);
  }

  componentDidMount() {

  }

  @autobind
  callback(index){
    this.props.store.marketCompetition.setCurrentTab(+index);
  }

  @autobind
  onSearch(){
    const closeLoading = Message.loading('正在获取数据...', 0),
          searchConditions = this.props.store.conditions.getParamsHasLevel4();
    
    let fetchList = [
      this.props.store.marketCompetition.getBrandData(searchConditions),
      this.props.store.marketCompetition.getBrandSummaryData(searchConditions),
      this.props.store.marketCompetition.getMapData(searchConditions),
      this.props.store.marketCompetition.getProvinceRankData(searchConditions),
      this.props.store.marketCompetition.getCityBarData(searchConditions),
      this.props.store.marketCompetition.getBrandTagData(searchConditions),      
      this.props.store.marketCompetition.getCityRankData(Object.assign({}, searchConditions, {cityLevel:'一线'}))
    ];
    

    Promise.all(fetchList).then(() => {

      closeLoading();

      if(this.brandDataWithoutAll[0]){
        this.props.store.marketCompetition.setCompareMainBrandId(this.brandDataWithoutAll[0].value);
      }
      let _brandIds = this.props.store.marketCompetition.compareMainBrandId;
      if(this.props.store.marketCompetition.compareBrandCount){
          _brandIds = _brandIds + '-' + this.props.store.marketCompetition.compareBrandCount.map(item => item.value).join('-');
      }

      this.props.store.marketCompetition.getBrandPortraitData(Object.assign({},searchConditions, {
        brandIds: _brandIds || (this.brandDataWithoutAll[0] && this.brandDataWithoutAll[0].value),
        tagId: this.props.store.marketCompetition.selectedTag || (this.props.store.marketCompetition.brandTagData[0] && this.props.store.marketCompetition.brandTagData[0].tagId)
      })).then(()=>{
        closeLoading();
      });

    });
  }

  render() {
    const { store: { marketCompetition } } = this.props;
    return tmpls.marketCompetition(this.state, this.props, this, {
      styles,
      marketCompetition
    });
  }
}



/**
 * 品牌概况
 * 
 * @class BrandSummary
 * @extends {Component}
 */
@registerTmpl('brandSummary')
@inject('store')
@observer
class BrandSummary extends Component {

  /**
   * 品牌概况
   * 
   * @readonly
   * @memberof BrandSummary
   */
  @computed get brandSummaryOption(){

    let _data = this.props.store.marketCompetition.brandSummaryData && toJS(this.props.store.marketCompetition.brandSummaryData),
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
      tooltip: {
        show:false,
        formatter: function(params){
            var result = `<div>${params[0].data[2]}</div>`;
                result += `<div>
                                <span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;"></span>
                                <span>销售额:</span>
                                <span>${params[0].data[0] || '--'}</span>
                            </div>`;
                result += `<div>
                                <span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;"></span>
                                <span>用户数:</span>
                                <span>${params[0].data[1] || '--'}</span>
                            </div>`;
            return result
        }
      },
      xAxis: [
        {
          name:'销售额',
          gridIndex: 0, 
          splitLine:{
            show:false
          },
          min: 0, 
          max: maxX,
          axisLabel:{
            show:false
          }
        }
      ],
      yAxis: [
        {
          name:'用户数',
          gridIndex: 0, 
          splitLine:{
            show:false
          },
          min: 0, 
          max: maxY.toFixed(2),
          axisLabel:{
            show:false
          }
        }
      ]
    }
  }

  @computed get brandSummaryData(){
    let _data = this.props.store.marketCompetition.brandSummaryData && toJS(this.props.store.marketCompetition.brandSummaryData),
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
      item[1] = item[1].toFixed(2);
      
      return {
        name: '品牌概况',
        type: 'scatter',
        xAxisIndex: 0,
        yAxisIndex: 0,
        symbolSize: 50,
        itemStyle: {
            normal: {
                color: colorList()[i%colorList().length]
            },
        },
        data: [
            item
        ],
        label: {
            normal: {
                show: true,
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
        name: '品牌概况',
        type: 'scatter',
        xAxisIndex: 0,
        yAxisIndex: 0,
        // data: _data && _data.list.map(item=>{
        //   item[1] = item[1].toFixed(2);
        //   return item;
        // }),
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
              coord: [0, _data && _data.userAvg],
              symbol: 'none',
              label: {
                  normal: {
                      formatter: '品类用户数均线',
                      textStyle: {
                          align: 'right'
                      }
                  }
              }
              }, {
                  coord: [maxX, _data && _data.userAvg],
                  symbol: 'none'
              }
            ],
            [
              {
                coord: [_data && _data.salesAmountAvg, 0],
                symbol: 'none',
                label: {
                  normal: {
                      formatter: '品类销售额均线',
                      textStyle: {
                          align: 'right'
                      }
                  }
                }
              }, {
                  coord: [_data && _data.salesAmountAvg, maxY],
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
    
  }

  render() {
    const { store: { marketCompetition } } = this.props;
    return tmpls.brandSummary(this.state, this.props, this, {
      styles,
      marketCompetition
    });
  }
}


/**
 * 品牌排行
 * 
 * @class BrandRank
 * @extends {Component}
 */
@registerTmpl('brandRank')
@inject('store')
@observer
class BrandRank extends Component {

  @observable rankType = 'province'; //'province' | 'city'
  @observable rankTitle = '全国';

  /**
   * map
   * 
   * @readonly
   * @memberof BrandRank
   */
  @computed get mapOption(){
    return {
      tooltip: {
          show:false,
          trigger: 'item',
          formatter: function (params) {

            if(params.value){
              return params.name + ' : ' + (params.value.toFixed(2)) + '%';
            }else{
              return '';
            }
          }
      },
      legend: {
          orient: 'vertical',
          left: 'left',
          data:['品类全国销售额分布']
      },
      geo: {
          map: 'china',
          label: {
            normal: {
                show: true
            },
            emphasis: {
                show: false
            }
          },
          itemStyle: {
              normal: {
                  areaColor: '#f1f1f1',
                  borderColor: '#333',
                  show:false
              },
              emphasis: {
                  areaColor: '#ccc'
              }
          }
      },
      visualMap: {
          type: 'piecewise',
          splitNumber: 3,
          pieces: [
              {
                  min: 50,
                  label: '>50%',
                  color: '#acc9f9'
              }, {
                  max: 50,
                  min: 20,
                  label: '20% ~ 50%',
                  color: '#c7dbfc'
              }, {
                  value: 0,
                  label: '0 ~ 20%',
                  color: '#ddeaff'
              },
          ],
          textStyle: {
                  color: '#333'
          },
          min: 0,
          max: 100,
          left: 'left',
          top: 'bottom',
          calculable: true,
          show: true,
          seriesIndex: 0,
      },
      toolbox:{show:false}
    };
  }

  convertData(data) {
    var res = [];
    for (var i = 0; i < data.length; i++) {
        var geoCoord = getGeoCoordMap(true)[data[i].name];
        if (geoCoord) {
            res.push({
                name: data[i].name,
                value: geoCoord.concat(data[i].value),
                symbolSize: data[i].symbolSize
            });
        }
    }
    return res;
  }

  @computed get mapData(){
    
    let _data = [], max = 0, _symbolSize = 30;

    _data = this.props.store.marketCompetition.mapData && toJS(this.props.store.marketCompetition.mapData);
      
    _data && _data.forEach(item=>{
      if(item.value > max){
        max = item.value;
      }
    })
    return [
        {
            name: '销售额占比',
            // type: 'scatter',
            // coordinateSystem: 'geo',
            type: 'map',
            mapType: 'china',
            symbolSize: 30,
            showLegendSymbol:false,
            label: {
                normal: {
                  formatter: '{b}',
                  position: 'right',
                  show: false
                },
                emphasis: {
                    show: true
                }
            },
            data:_data && this.convertData(toJS(_data).map(item=>{
              const _size = item.value * _symbolSize;
              
              return {
                name:item.name,
                value:(item.value * 100).toFixed(2),
                symbolSize: _size < 12 ? 12 : _size
              }
            }))
        }
    ];
  }

  /**
   * 品牌排行列表
   * 
   * @memberof BrandRank
   */
  @observable tableBrandRankColumns =  [
    {
      key:'brandName',
      title: '品牌',
      dataIndex: 'brandName'
    },
    {
      key:'salesRank',
      title: '销售额',
      dataIndex: 'salesRank',
      render: (text, record, index) => {
        return {
          children: nj`<span class="rank-${index%4}">${text}</span>`()
        };
      }
    },
    {
      key:'productCount',
      title: '商品数量',
      dataIndex: 'productCount',
      render: (text, record, index) => {
        return {
          children: nj`<span class="rank-${index%4}">${text}</span>`()
        };
      }
    }
  ];

  @computed get tableBrandRankData(){
    let _data = null;
    if(this.rankType == 'province'){
      _data = this.props.store.marketCompetition.provinceRankData && toJS(this.props.store.marketCompetition.provinceRankData);
    }else{
      _data = this.props.store.marketCompetition.cityRankData && toJS(this.props.store.marketCompetition.cityRankData);
    }

    if(_data){
      return _data.map((item, i) => {
        return {
          key: i,
          brandName: item.brandName,
          salesRank: item.salesRank,
          productCount: item.productCount
        }
      });
    }else{
      return [];
    }
  }

  /**
   * 城市级别 bar chart
   * 
   * @readonly
   * @memberof BrandRank
   */
  @computed get cityBarOptions(){
    
    return {
      grid: {
          left: '3%',
          right: '4%',
          top:'15%',
          bottom:'5%',
          containLabel: true
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
                                <span>${item.data.value || '--'}%</span>
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
          data: this.props.store.marketCompetition.cityBarData && toJS(this.props.store.marketCompetition.cityBarData[1])
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
  @computed get cityBarData(){
    const barColor = ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3']
    return [
      {
        name:'销售额',
        type:'bar',
        barWidth:'50px',
        data: this.props.store.marketCompetition.cityBarData && toJS(this.props.store.marketCompetition.cityBarData[0]).map(item=>(item*100).toFixed(2)).map((item, i)=>{
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


  @autobind
  onRankTypeChange(e){
    this.rankType = e.target.value;

    const closeLoading = Message.loading('正在获取数据...', 0),
          searchConditions = Object.assign({},this.props.store.conditions.getParamsHasLevel4(),{
                              province:null,
                              cityLevel:'一线'
                            });
    let fetchList = null;

    if(this.rankType == 'province'){
      this.rankTitle = '全国';
      fetchList = [
        this.props.store.marketCompetition.getMapData(searchConditions),
        this.props.store.marketCompetition.getProvinceRankData(searchConditions)
      ];
    }else{
      this.rankTitle = '一线城市';
      fetchList = [
        this.props.store.marketCompetition.getCityBarData(searchConditions),
        this.props.store.marketCompetition.getCityRankData(searchConditions)
      ];
    }
    
    Promise.all(fetchList).then(() => {
      closeLoading();
    });

  }

  @autobind
  onResetClicked(){
    this.rankTitle = '全国';
    const closeLoading = Message.loading('正在获取数据...', 0),
          searchConditions = Object.assign({},this.props.store.conditions.getParamsHasLevel4(),{
                              province:null
                            });
    Promise.all([
      this.props.store.marketCompetition.getMapData(searchConditions),
      this.props.store.marketCompetition.getProvinceRankData(searchConditions)
    ]).then(() => {
      closeLoading();
    });
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {

    this.refs.ecMap.chart.on('click', params => {

      if(params.value){
        this.rankTitle = params.name;
        const closeLoading = Message.loading('正在获取数据...', 0),
              searchConditions = Object.assign({},this.props.store.conditions.getParamsHasLevel4(),{
                province:params.name
              });

        Promise.all([
          this.props.store.marketCompetition.getProvinceRankData(searchConditions)
        ]).then(() => {
          closeLoading();
        });
      }
    });

    this.refs.ecCityBar.chart.on('click', params => {
      const _cityLevel = ['一线', '二线', '三线', '四线', '五线'];

      if(params.value){
        this.rankTitle = params.name;
        const closeLoading = Message.loading('正在获取数据...', 0),
              searchConditions = Object.assign({},this.props.store.conditions.getParamsHasLevel4(),{
                cityLevel:encodeURIComponent(params.name) //_cityLevel.findIndex(item => item == params.name) + 1
              });

        Promise.all([
          this.props.store.marketCompetition.getCityRankData(searchConditions)
        ]).then(() => {
          closeLoading();
        });
      }
    });
  }

  render() {
    const { store: { marketCompetition } } = this.props;
    return tmpls.brandRank(this.state, this.props, this, {
      styles,
      marketCompetition
    });
  }
}


/**
 * 品牌画像
 * 
 * @class BrandPortrait
 * @extends {Component}
 */
@registerTmpl('brandPortrait')
@inject('store')
@observer
class BrandPortrait extends Component {

  @computed get isEmpty(){
    if(this.props.store.marketCompetition.brandTagData && this.props.store.marketCompetition.brandTagData.length>0 && this.brandDataWithoutAll){
      return false;
    }else{
      return true
    }
  }

  @computed get brandDataWithoutAll(){
    return this.props.store.marketCompetition.brandData;
  }

  @computed get selectedTagName(){
    let _selectedTagName = '';
    if(this.props.store.marketCompetition.brandTagData && this.props.store.marketCompetition.brandTagData.length>0){
      let selectedTag = this.props.store.marketCompetition.brandTagData.find(item=>item.tagId == this.props.store.marketCompetition.selectedTag);
      if(selectedTag){
        _selectedTagName = selectedTag.tagName;
      }
    }
    return _selectedTagName;
  }
  /**
   * 品牌画像
   * 
   * @readonly
   * @memberof BrandPortrait
   */
  @computed get brandPortraitOptions(){

    const _legend = this.props.store.marketCompetition.brandPortraitData && toJS(this.props.store.marketCompetition.brandPortraitData[0]).map(item=>item.brandName);

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
        data: [..._legend, '品类销量基线']
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
                                  <span>${(item.data) || '--'}%</span>
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
          data: this.props.store.marketCompetition.brandPortraitData && toJS(this.props.store.marketCompetition.brandPortraitData[2])
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
  @computed get brandPortraitData(){

    const mapData = (this.props.store.marketCompetition.brandPortraitData && toJS(this.props.store.marketCompetition.brandPortraitData[0]).map(item=>{
      return {
        name: item.brandName,
        type: 'bar',
        stack: '总量',
        barWidth:'50px',        
        data: item.data.map(item=>parseFloat((item*100).toFixed(2)))
      }
    })) || []

    return [
      ...mapData,
      {
        name:'品类销量基线',
        type:'line',
        data: this.props.store.marketCompetition.brandPortraitData && toJS(this.props.store.marketCompetition.brandPortraitData[1].map(item=>parseFloat((item*100).toFixed(2))))
      }
    ];
  };

  @computed get checkedBrandTags(){
    return this.props.store.marketCompetition.brandTagData && toJS(this.props.store.marketCompetition.brandTagData).filter(tag => tag.checked);
  }

  @autobind
  addCompareBrand(){
    this.props.store.marketCompetition.setCompareBrandCount({
      id:this.compareBrandCount && this.compareBrandCount.length,
      value:this.props.store.marketCompetition.brandData[0] && this.props.store.marketCompetition.brandData[0].value
    });
  }

  @autobind
  delBrand(index){
    return (e) => {
      this.props.store.marketCompetition.delCompareBrandCount(index);
    }
  }

  @autobind
  onMainBrandChange(value){
    this.props.store.marketCompetition.setCompareMainBrandId(value);
  }

  @autobind
  onBrandChange(index){
    return (value) => {
      this.props.store.marketCompetition.setCompareBrandValue(index, value);
    }
  }

  @autobind
  onTagChecked(tagId){
    return (e) => {
      this.props.store.marketCompetition.checkBrandTag(tagId, e.target.checked);
    }
  }

  @autobind
  onTagChange(e){
    this.props.store.marketCompetition.setSelectedTag(e.target.value);
    this.doCompare();
  }

  @autobind
  doCompare(){
    const closeLoading = Message.loading('正在获取数据...', 0),
          searchConditions = this.props.store.conditions.getParamsHasLevel4();
    
    let _brandIds = this.props.store.marketCompetition.compareMainBrandId;
    if(this.props.store.marketCompetition.compareBrandCount){
        if(_brandIds){
          _brandIds = _brandIds + '-' + this.props.store.marketCompetition.compareBrandCount.filter(item=>item.value != '').map(item => item.value).join('-');
        }else{
          _brandIds = this.props.store.marketCompetition.compareBrandCount.map(item => item.value).join('-');
        }
    }

    this.props.store.marketCompetition.getBrandPortraitData(Object.assign({},searchConditions, {
      brandIds: _brandIds || (this.brandDataWithoutAll[0] && this.brandDataWithoutAll[0].value),
      tagId: this.props.store.marketCompetition.selectedTag || (this.props.store.marketCompetition.brandTagData[0] && this.props.store.marketCompetition.brandTagData[0].tagId)
    })).then(()=>{
      closeLoading();
    });
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {

    const closeLoading = Message.loading('正在获取数据...', 0),
          searchConditionsLevel4 = this.props.store.conditions.getParamsHasLevel4();

    let fetchList = [
      this.props.store.marketCompetition.getBrandData(searchConditionsLevel4),
      this.props.store.marketCompetition.getBrandTagData(searchConditionsLevel4)
    ];

    Promise.all(fetchList).then(() => {
      
      closeLoading();

      if(this.props.store.marketCompetition.currentTab == 2){
        if(this.brandDataWithoutAll[0]){
          this.props.store.marketCompetition.setCompareMainBrandId(this.brandDataWithoutAll[0].value);
        }
        let _brandIds = this.props.store.marketCompetition.compareMainBrandId;
        if(this.props.store.marketCompetition.compareBrandCount){
            _brandIds = _brandIds + '-' + this.props.store.marketCompetition.compareBrandCount.map(item => item.value).join('-');
        }
  
        this.props.store.marketCompetition.getBrandPortraitData(Object.assign({},searchConditionsLevel4, {
          brandIds: _brandIds || (this.brandDataWithoutAll[0] && this.brandDataWithoutAll[0].value),
          tagId: this.props.store.marketCompetition.selectedTag || (this.props.store.marketCompetition.brandTagData[0] && this.props.store.marketCompetition.brandTagData[0].tagId)
        })).then(()=>{
          closeLoading();

          if(this.brandDataWithoutAll[0]){
            this.props.store.marketCompetition.setCompareMainBrandId(this.brandDataWithoutAll[0].value);
          }
          this.props.store.marketCompetition.setSelectedTag(this.props.store.marketCompetition.brandTagData && toJS(this.props.store.marketCompetition.brandTagData)[0].tagId);
        });
      }
    });
  }

  render() {
    const { store: { marketCompetition, conditions  } } = this.props;

    const popTagsCnt = tmpls.popTagsCnt(this.state, this.props, this, {
      styles,
      marketCompetition,
      conditions
    });

    return tmpls.brandPortrait(this.state, this.props, this, {
      styles,
      marketCompetition,
      conditions,
      popTagsCnt
    });
  }
}

