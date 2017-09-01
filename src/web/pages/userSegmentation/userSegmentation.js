import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import nj, { taggedTmpl as njs } from 'nornj';
import { observable, computed, toJS, runInAction } from 'mobx';
import { registerTmpl } from 'nornj-react';
import 'vic-common/lib/components/antd/modal';
import 'vic-common/lib/components/antd/icon';
import 'vic-common/lib/components/antd/tabs';
import 'vic-common/lib/components/antd/tooltip';
import 'vic-common/lib/components/antd/checkbox';
import 'vic-common/lib/components/antd/radio';
import Notification from 'vic-common/lib/components/antd/notification';
import 'vic-common/lib/components/ECharts/barChart';
import 'echarts/lib/component/dataZoom';
import 'echarts/lib/chart/line';
import Message from 'vic-common/lib/components/antd/message';
import { autobind } from 'core-decorators';
import styles from './userSegmentation.m.scss';
import tmpls from './userSegmentation.t.html';
import '../../components/conditons/conditons.scss';
import 'vic-common/lib/components/antd/datepicker';
import { findDOMNode } from 'react-dom';
import '../../components/conditons';

//tab1的echarts实例
const propsCharts = {};

//tab2的echarts实例
const competitorCharts = {};

//页面容器组件
@registerTmpl('UserSegmentation')
@inject('store')
@observer
export default class UserSegmentation extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  @observable showMultiBrand = false;
  @autobind
  onTabChange(key) {
    this.showMultiBrand = key !== 'userData';

    //重绘echarts实例
    setTimeout(() => {
      try {
        if (key === 'userData') {
          for (let o in propsCharts) {
            propsCharts[o] && propsCharts[o].resize();
          }
        } else {
          for (let o in competitorCharts) {
            competitorCharts[o] && competitorCharts[o].resize();
          }
        }
      } catch (ex) {}
    }, 200);
  }

  @autobind
  onSearch() {
    const { store: { userSegmentation } } = this.props;
    const closeLoading = Message.loading('正在获取数据...', 0);
    Promise.all([
      userSegmentation.getUserContribution(),
      userSegmentation.getProps().then(() => {
        return Promise.all([
          userSegmentation.getPropsData(),
          userSegmentation.getUserStructureData()
        ]);
      })
    ]).then(() => {
      closeLoading();
    });
  }

  @autobind
  onModalCancel() {
    const { store: { userSegmentation } } = this.props;
    userSegmentation.setModalVisible(false);
  }

  @autobind
  onCheckboxChange(checkedValues) {
    if (checkedValues.length < 1) {
      return;
    }

    const { store: { userSegmentation } } = this.props;
    userSegmentation.setPropsChecked(checkedValues);

    const closeLoading = Message.loading('正在获取数据...', 0);
    Promise.all([
      userSegmentation.getPropsData(),
      userSegmentation.getUserStructureData()
    ]).then(() => {
      closeLoading();
    });
  }

  @autobind
  radioChange(e) {
    const { store: { userSegmentation } } = this.props;
    userSegmentation.setDataType(e.target.value);
    userSegmentation.getUserStructureData();
  }

  render() {
    const { store: { userSegmentation } } = this.props;

    return tmpls.userSegmentation(this.state, this.props, this, {
      styles,
      userSegmentation
    });
  }
}

@registerTmpl('UserContribution')
@inject('store')
@observer
export class UserContribution extends Component {
  componentDidMount() {}

  render() {
    const { store: { userSegmentation } } = this.props;

    return tmpls.userContribution(this.state, this.props, this, {
      styles,
      userSegmentation
    });
  }
}

@registerTmpl('PropsChart')
@inject('store')
@observer
export class PropsChart extends Component {
  componentDidMount() {
    this.refs.chart.chart.on('mouseover', p => {
      if (!this.isOpenCategory) {
        return;
      }

      if (p.seriesId[p.seriesId.length - 1] == '1') {
        this.isCategoryUser = true;
      } else {
        this.isCategorySale = true;
      }
    });

    this.refs.chart.chart.on('mouseout', p => {
      if (!this.isOpenCategory) {
        return;
      }

      if (p.seriesId[p.seriesId.length - 1] == '1') {
        this.isCategoryUser = false;
      } else {
        this.isCategorySale = false;
      }
    });

    propsCharts[this.props.propData.propName] = this.refs.chart.chart;
  }

  @observable isOpenCategory = false;
  @autobind
  openCategory() {
    runInAction(() => {
      this.isOpenCategory = !this.isOpenCategory;
      this.isCategoryUser = false;
      this.isCategorySale = false;
    });
  }

  @autobind
  openDetail() {
    const { store: { userSegmentation } } = this.props;
    userSegmentation.setModalVisible(true, this.props.propData.propName);
  }

  fixZero(v) {
    if (v == null) {
      return 0;
    }
    if (v === 0) {
      return 0.0000001;
    }
    return v;
  }

  @computed get option() {
    const { propData } = this.props;
    const hasData = propData && propData.labels.length;

    return {
      legend: {
        data: hasData ? propData.labels.map(label => label.name) : [],
      },
      grid: {
        // left: '3%',
        // right: '4%',
        // bottom: '3%',
        // containLabel: true
        left: 80,
        right: 80,
        top: 90,
        bottom: 20
      },
      xAxis: [{
        type: 'value',
        axisLabel: { show: false },
        axisTick: { show: false },
        axisLine: { show: false },
        min: -1,
        max: 1
      }],
      yAxis: [{
        type: 'category',
        axisTick: { show: false },
        //axisLine: { show: false },
        data: []
      }],
    };
  }

  @observable isCategoryUser = false;
  @observable isCategorySale = false;

  @computed get data() {
    const { propData } = this.props;
    const hasData = propData && propData.labels.length;

    return hasData ? [...propData.labels.map(label => {
      return {
        name: label.name,
        stack: label.name,
        type: 'bar',
        label: {
          normal: {
            show: true,
            position: 'right',
            formatter: params => {
              return (parseFloat(params.data) * 100).toFixed(2) + '%';
            }
          }
        },
        data: [this.fixZero(!this.isCategoryUser ? label.sale : label.categoryUser)]
      };
    }), ...propData.labels.map(label => {
      return {
        name: label.name,
        stack: label.name,
        type: 'bar',
        label: {
          normal: {
            show: true,
            position: 'left',
            formatter: params => {
              return (parseFloat(params.data) * -100).toFixed(2) + '%';
            }
          }
        },
        data: [this.fixZero(!this.isCategorySale ? label.user : label.categorySale) * -1]
      };
    })] : [];
  }

  render() {
    const { store: { userSegmentation } } = this.props;
    const { propData } = this.props;
    const hasData = propData && propData.labels.length;

    return tmpls.propsChart(propData, this.props, this, {
      styles,
      userSegmentation
    });
  }
}

@registerTmpl('PropsDetail')
@inject('store')
@observer
export class PropsDetail extends Component {
  componentDidMount() {
    const { store: { userSegmentation } } = this.props;
    userSegmentation.getPropsDetailData(userSegmentation.modalPropName);
  }

  @computed get tableData() {
    const { store: { userSegmentation } } = this.props;
    if (!userSegmentation.propsDetailData) {
      return [];
    }

    const row1 = ['客单价'],
      row2 = ['复购率'],
      row3 = ['品类客单价'],
      row4 = ['品类复购率'];

    userSegmentation.propsDetailData.forEach(prop => {
      row1.push(prop.unitPrice);
      row2.push(prop.repurchasingRate);
      row3.push(prop.categoryUnitPrice);
      row4.push(prop.categoryRepurchasingRate);
    });

    return [row1, row2, row3, row4];
  }

  @computed get chartOption() {
    return {
      tooltip: {
        formatter: p => njs `
          <div>${p[0].name}</div>
          <#each ${p}>
            {{marker}}{seriesName}：{data !== ('-') ? (data | percent(2), '-')}
            <br>
          </#each>
        ` (),
      },
      grid: {
        bottom: 80
      },
      yAxis: [{
        type: 'value',
        axisLabel: {
          formatter: value => njs `{${value} | percent(2)}` ()
        }
      }],
      xAxis: [{
        type: 'category',
        data: this.labels,
        axisPointer: {
          type: 'shadow'
        },
        axisLabel: {
          rotate: 30,
          interval: 0
        }
      }],
      color: ['#2F4554', '#C23531']
    };
  }

  @computed get labels() {
    const { store: { userSegmentation } } = this.props;
    if (!userSegmentation.propsDetailData) {
      return [];
    }

    return userSegmentation.propsDetailData.map(label => label.name);
  }

  @computed get userDataValue() {
    const { store: { userSegmentation } } = this.props;
    if (!userSegmentation.propsDetailData) {
      return [];
    }

    return userSegmentation.propsDetailData.map(label => label.user != null ? label.user : '-');
  }

  @computed get categoryUserDataValue() {
    const { store: { userSegmentation } } = this.props;
    if (!userSegmentation.propsDetailData) {
      return [];
    }

    return userSegmentation.propsDetailData.map(label => label.categoryUser != null ? label.categoryUser : '-');
  }

  @computed get saleDataValue() {
    const { store: { userSegmentation } } = this.props;
    if (!userSegmentation.propsDetailData) {
      return [];
    }

    return userSegmentation.propsDetailData.map(label => label.sale != null ? label.sale : '-');
  }

  @computed get categorySaleDataValue() {
    const { store: { userSegmentation } } = this.props;
    if (!userSegmentation.propsDetailData) {
      return [];
    }

    return userSegmentation.propsDetailData.map(label => label.categorySale != null ? label.categorySale : '-');
  }

  render() {
    const { store: { userSegmentation } } = this.props;

    return tmpls.propsDetail(this.props, this, {
      styles,
      userSegmentation,
      userOption: this.chartOption,
      userData: [{
        name: '用户',
        data: this.userDataValue,
        barMaxWidth: 40
      }, {
        name: '品类用户',
        type: 'line',
        smooth: true,
        data: this.categoryUserDataValue
      }],
      saleOption: this.chartOption,
      saleData: [{
        name: '销量',
        data: this.saleDataValue,
        barMaxWidth: 40
      }, {
        name: '品类销量',
        type: 'line',
        smooth: true,
        data: this.categorySaleDataValue
      }]
    });
  }
}

@registerTmpl('CompetitorAnalysis')
@inject('store')
@observer
export class CompetitorAnalysis extends Component {
  componentDidMount() {
    competitorCharts[this.props.propData.propName] = this.refs.chart.chart;
  }

  @computed get option() {
    const { propData } = this.props;

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: p => njs `
          <div>${propData.propName}-${p[0].name}</div>
          <div>
            <#each ${p}>
              {{marker}}{seriesName}：{data | percent(2)}
              <#if {@index % (2) != (0)}><br></#if>
            </#each>
          </div>
        ` (),
      },
      legend: {
        left: 'right',
        data: propData.labels.map(label => label.name)
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        axisLabel: {
          formatter: value => njs `{${value} | percent(2)}` ()
        },
        max: 1
      },
      yAxis: {
        type: 'category',
        data: toJS(propData.brands)
      },
      toolbox: { show: false }
    }
  }

  @computed get data() {
    const { propData } = this.props;

    return propData.labels.map(label => {
      return {
        name: label.name,
        stack: '总量',
        barMaxWidth: 50,
        label: {
          normal: {
            //show: true,
            position: 'insideRight'
          }
        },
        data: toJS(label.value)
      };
    });
  }

  render() {
    const { store: { userSegmentation } } = this.props;
    const { propData } = this.props;

    return tmpls.competitorAnalysis(propData, this.props, this, {
      styles,
      userSegmentation,
    });
  }
}