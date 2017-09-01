/**
 * Created by gaojian3 on 2017/7/7.
 */
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import nj from 'nornj';
import { observable, computed, toJS } from 'mobx'
import { registerTmpl } from 'nornj-react';
import { autobind } from 'core-decorators';
import styles from './businessDashboard.m.scss';
import tmpls from './businessDashboard.t.html';
import Toast from 'vic-common/lib/components/antd-mobile/toast';
import Tabs from 'vic-common/lib/components/antd-mobile/tabs';
import Card from 'vic-common/lib/components/antd-mobile/card';
import WingBlank from 'vic-common/lib/components/antd-mobile/wingBlank';
import WhiteSpace from 'vic-common/lib/components/antd-mobile/whiteSpace';
import Flex from 'vic-common/lib/components/antd-mobile/flex';
import SegmentedControl from 'vic-common/lib/components/antd-mobile/segmentedControl';
import Button from 'vic-common/lib/components/antd-mobile/button';
import Icon from 'vic-common/lib/components/antd-mobile/icon';
import List from 'vic-common/lib/components/antd-mobile/list';
import { CCProgress } from '../../../web/components/CCProgress';
import echarts from 'echarts/lib/echarts';
import 'vic-common/lib/components/ECharts/heatmapChart';
import 'vic-common/lib/components/ECharts/barChart';
import 'echarts/lib/component/visualMap';
import 'echarts/lib/component/calendar';
import 'echarts/lib/component/dataZoom';
import { ConfigDPR } from '../../config/chart';
import { ParseFloatString, GetChartOptionWithBase } from '../../utils/utils';
import { showPopup, popupRenderHeader } from '../../utils/common';
import moment from 'moment';

@registerTmpl('BusinessDashboard')
@inject('store')
@observer
export default class BusinessDashboard extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.store.header.setPageTitle(this.props.moduleName);
    Toast.loading('loading...');
    Promise.all([
      this.props.store.businessDashboard.getTargetData(),
      this.props.store.businessDashboard.getCalendarData(),
      this.props.store.businessDashboard.getSalesTrends(),
      this.props.store.businessDashboard.getCategoryKpiTrackList('month'),
      this.props.store.businessDashboard.getBrandKpiTrackList('month'),
    ]).then(() => Toast.hide());
  }

  @computed get dataYear() {
    const data = this.props.store.businessDashboard;
    return {
      name: '年度KPI追踪（万元）',
      targetName: '年度目标（万元）',
      targetValue: data.yearTarget,
      salesVolumeName: '年至今销售额（万元）',
      salesVolumeValue: data.yearSalesVolume,
      completionRateName: '年至今完成率',
      completionRateValue: `${(data.yearCompletionRate*100).toFixed(2)}%`,
      forecastRateName: '下月预测完成率',
      forecastRateValue: `${data.yearForecastRate.toFixed(2)}%`,
      forecastRateEmphasis: true
    };
  }

  @computed get dataSeason() {
    const data = this.props.store.businessDashboard;
    return {
      name: '季度KPI追踪（万元）',
      targetName: '季度目标（万元）',
      targetValue: data.seasonTarget,
      salesVolumeName: '季至今销售额（万元）',
      salesVolumeValue: data.seasonSalesVolume,
      completionRateName: '季至今完成率',
      completionRateValue: `${(data.seasonCompletionRate*100).toFixed(2)}%`,
      forecastRateName: '下月预测完成率',
      forecastRateValue: `${data.seasonForecastRate.toFixed(2)}%`,
      forecastRateEmphasis: true
    };
  }

  @computed get dataMonth() {
    const data = this.props.store.businessDashboard;
    return {
      name: '月度KPI追踪（万元）',
      targetName: '月度目标（万元）',
      targetValue: data.monthTarget,
      salesVolumeName: '月至今销售额（万元）',
      salesVolumeValue: data.monthSalesVolume,
      completionRateName: '月至今完成率',
      completionRateValue: `${(data.monthCompletionRate*100).toFixed(2)}%`,
      forecastRateName: '下月预测销量',
      forecastRateValue: data.monthForecastSales,
      forecastRateEmphasis: true
    };
  }

  @computed get dataDay() {
    const data = this.props.store.businessDashboard;
    return {
      name: '日度KPI追踪',
      day: data.currentDate,
      targetName: '目标（万元）',
      targetValue: data.calendarTarget,
      salesVolumeName: '实际销售（万元）',
      salesVolumeValue: data.calendarActual,
      completionRateName: '完成率',
      completionRateValue: `${(data.calendarComplete*100).toFixed(2)}%`,
      forecastRateName: '明日预测销量（万元）',
      forecastRateValue: data.calendarSales,
      forecastRateEmphasis: true
    };
  }

  render() {
    return tmpls.BusinessDashboard(this.state, this.props, this, {
      styles
    });
  }
}

@registerTmpl('KPIDashboard')
@observer
export class KPIDashboard extends Component {
  render() {
    return tmpls.KPIDashboard(this.state, this.props, this, {
      styles
    });
  }
}

@registerTmpl('KPIDashboardPane')
@observer
export class KPIDashboardPane extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return tmpls.KPIDashboardPane(this.state, this.props, this, {
      styles
    })
  }
}

@registerTmpl('KPIDashboardPaneItem')
@observer
export class KPIDashboardPaneItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return tmpls.KPIDashboardPaneItem(this.state, this.props, this, {
      styles
    })
  }
}

@registerTmpl('KPIDashboardDay')
@inject('store')
@observer
export class KPIDashboardDay extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { store: { businessDashboard } } = this.props;

    this.refs.calendar.chart.on('click', params => {
      businessDashboard.setCurrentDate(params.data[0]);
      this.props.store.businessDashboard.getCalendarTarget(params.data[0]);
    });

    //初始加载
    this.props.store.businessDashboard.getCalendarTarget(businessDashboard.currentDate);
  }

  @computed get optionCalendar() {
    const { store: { businessDashboard } } = this.props;
    return GetChartOptionWithBase({
      tooltip: {
        position: 'top',
        formatter: function(p) {
          const format = echarts.format.formatTime('yyyy-MM-dd', p.data[0]);
          return format + ': ' + ParseFloatString(p.data[1]);
        }
      },
      xAxis: {
        show: false
      },
      yAxis: {
        show: false
      },
      visualMap: {
        min: 0,
        max: businessDashboard.calendarValues ? Math.max(...toJS(businessDashboard.calendarValues)) : 1000,
        calculable: true,
        orient: 'horizontal',
        top: 'bottom',
        left: 'center',
        inRange: {
          color: ['#599699', 'rgba(235,220,184,0.4)', '#e98883']
        }
      },
      calendar: [{
        left: 20 * ConfigDPR.DPR,
        top: 60 * ConfigDPR.DPR,
        right: 20 * ConfigDPR.DPR,
        bottom: 50 * ConfigDPR.DPR,
        orient: 'vertical',
        range: moment().format("YYYY-MM"),
        yearLabel: {
          position: 'top',
          margin: 40 * ConfigDPR.DPR,
          formatter: (p) => {
            return p.start === p.end ? `${p.start}年` : `${p.start}年-${p.end}年`;
          },
          textStyle: {
            color: '#000',
            fontSize: 16 * ConfigDPR.DPR
          }
        },
        monthLabel: {
          formatter: (p) => {
            return p.nameMap.split('').join('\n');
          }
        }
      }],
      series: [{
        type: 'heatmap',
        coordinateSystem: 'calendar',
        calendarIndex: 0,
        data: businessDashboard.calendarData ? toJS(businessDashboard.calendarData) : [],
        label: {
          normal: {
            show: false
          }
        }
      }]
    });
  }

  @computed get optionTrend() {
    const { store: { businessDashboard } } = this.props;
    return GetChartOptionWithBase({
      grid: {
        top: 25 * ConfigDPR.DPR,
        bottom: 50 * ConfigDPR.DPR
      },
      xAxis: [{
        show: true,
        type: 'category',
        data: toJS(businessDashboard.salesTrendsDate),
        axisLabel: {
          rotate: 90
        }
      }],
      yAxis: [{
        type: 'value'
      }],
      tooltip: {
        show: true,
        formatter: (params) => {
          return `${params.name}:${ParseFloatString(params.value)}`;
        }
      },
      series: [{
        type: 'bar',
        name: '销售额',
        data: toJS(businessDashboard.salesTrendsData)
      }],
      dataZoom: [{
        show: true,
        realtime: true,
        startValue: moment().startOf('month').format("MM-DD"),
        endValue: moment().endOf('month').format("MM-DD"),
        xAxisIndex: [0],
        showDetail: false
      }]
    });
  }

  render() {
    return tmpls.KPIDashboardDay(this.state, this.props, this, {
      styles
    });
  }
}

@registerTmpl('CategoryAndBrandDashboard')
@inject('store')
@observer
export class CategoryAndBrandDashboard extends Component {
  constructor(props) {
    super(props);
    //this.dataType = ['品类', '品牌'];
    //this.dataTypeSelectedIndex = 0;
    this.dateType = ['月至今','季至今','年至今'];
    this.dateTypeSelectedIndex = 0;
    this.state = {
      //categoryAndBrandTitle: '品类KPI追踪',
      controlDisabled: false
    };
    this.maxListLength = 30;
  }

  /*
  @autobind
  onDataTypeChange(e) {
    const idx = e.nativeEvent.selectedSegmentIndex;
    const typeName = this.dataType[idx];
    if(typeName) {
      this.dataTypeSelectedIndex = idx;
      this.setState({
        categoryAndBrandTitle: `${typeName}KPI追踪`
      });
      this.reloadData();
    }
  }
  */

  @autobind
  onDateTypeChange(e) {
    const idx = e.nativeEvent.selectedSegmentIndex;
    if(idx === 0 || idx === 1 || idx === 2) {
      this.dateTypeSelectedIndex = idx;
      this.reloadData()
    }
  }

  reloadData() {
    Toast.loading('loading...');
    this.setState({
      controlDisabled: true
    });
    let paramDate = '';
    switch(this.dateTypeSelectedIndex) {
      case 0:
        paramDate = 'month';
        break;
      case 1:
        paramDate = 'season';
        break;
      case 2:
        paramDate = 'year';
        break;
    }
    /*
    switch(this.dataTypeSelectedIndex) {
      case 0:
        Promise.resolve(this.props.store.businessDashboard.getCategoryKpiTrackList(paramDate))
          .then(() => this.afterRequest());
        break;
      case 1:
        Promise.resolve(this.props.store.businessDashboard.getBrandKpiTrackList(paramDate))
          .then(() => this.afterRequest());
        break;
    }
    */
    Promise.all([
      this.props.store.businessDashboard.getCategoryKpiTrackList(paramDate),
      this.props.store.businessDashboard.getBrandKpiTrackList(paramDate)
    ]).then(() => this.afterRequest());
  }

  parseMillion(val) {
    if (val === null) {
      return 0;
    }

    let fmt = 0;
    val = parseFloat(val);
    if (typeof val === 'number' && !isNaN(val)) {
      fmt = val / 10000;
    }

    return fmt.toFixed(2);
  }

  @autobind
  onCategoryAndBrandBtnClick(type) {
    const { store: { businessDashboard } } = this.props;
    const name = type === 1 ? '品类' : '品牌';
    const dataList = (type === 1) ? toJS(businessDashboard.categoryKpiTrackList) : toJS(businessDashboard.brandKpiTrackList);
    const hasMore = dataList && dataList.length > this.maxListLength;
    const headerTitle = `${name}KPI追踪` + (hasMore ? ` (前${this.maxListLength}条)` : '') + '（万元）';
    const data = dataList ? dataList.slice(0, this.maxListLength) : [];
    //console.log(data);
    showPopup(headerTitle, data && data.length > 0 ? (<div>
        {data.map((i, index) => (
          <List.Item key={index}>
            {i.name}
            <List.Item.Brief>
              <Flex>
                <Flex.Item>目标: {this.parseMillion(i.kpiTrack.target)}</Flex.Item>
                <Flex.Item>完成: {this.parseMillion(i.kpiTrack.current)}</Flex.Item>
              </Flex>
            </List.Item.Brief>
          </List.Item>
        ))}
    </div>) : null);
  }

  @autobind
  onCategoryBtnClick() {
    this.onCategoryAndBrandBtnClick(1);
  }

  @autobind
  onBrandBtnClick() {
    this.onCategoryAndBrandBtnClick(2);
  }

  afterRequest() {
    Toast.hide();
    setTimeout(() => {
      this.setState({
        controlDisabled: false
      });
    }, 500);
  }

  render() {
    //const { store: { businessDashboard } } = this.props;
    //const dataList = (this.dataTypeSelectedIndex === 0) ? businessDashboard.categoryKpiTrackList : businessDashboard.brandKpiTrackList;
    return tmpls.CategoryAndBrandDashboard(this.state, this.props, this, {
      styles,
      //dataList
    })
  }
}

/*
@registerTmpl('CategoryAndBrandDashboardList')
@observer
export class CategoryAndBrandDashboardList extends Component {
  render() {
    return tmpls.CategoryAndBrandDashboardList(this.state, this.props, this, {
      styles
    })
  }
}
*/