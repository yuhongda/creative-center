import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import nj, { taggedTmpl as njs } from 'nornj';
import { observable, computed, toJS, runInAction } from 'mobx';
import { registerTmpl } from 'nornj-react';
import 'vic-common/lib/components/antd/modal';
import 'vic-common/lib/components/antd/icon';
import 'vic-common/lib/components/antd/tooltip';
import 'vic-common/lib/components/antd/table';
import 'vic-common/lib/components/antd/input';
import 'vic-common/lib/components/antd/button';
import 'vic-common/lib/components/ECharts/lineChart';
import 'echarts/lib/component/dataZoom';
import Message from 'vic-common/lib/components/antd/message';
import Modal from 'vic-common/lib/components/antd/modal';
import { autobind } from 'core-decorators';
import styles from './competitivePriceModel.m.scss';
import tmpls from './competitivePriceModel.t.html';
import '../../components/conditons/conditons.scss';
import { findDOMNode } from 'react-dom';
import moment from 'moment';

function queryData(competitivePriceModel) {
  const closeLoading = Message.loading('正在获取数据...', 0);
  Promise.all([
    competitivePriceModel.getContrastRelationData().then(() => {
      if (competitivePriceModel.hasData()) {
        return Promise.all([
          competitivePriceModel.getPromotionData(competitivePriceModel.selectedDate),
          competitivePriceModel.getTrendAnalysisData()
        ]);
      } else {
        competitivePriceModel.reactChartData();
        return Promise.resolve();
      }
    })
  ]).then(() => closeLoading());
}

//页面容器组件
@registerTmpl('CompetitivePriceModel')
@inject('store')
@observer
export default class CompetitivePriceModel extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { store: { competitivePriceModel } } = this.props;
    queryData(competitivePriceModel);
  }

  render() {
    const { store: { competitivePriceModel } } = this.props;

    return tmpls.competitivePriceModel(this.props, this, {
      styles,
      competitivePriceModel,
      iconGraph: require('../../images/icon-price-summary2.png')
    });
  }
}

@registerTmpl('SetRelation')
@inject('store')
@observer
export class SetRelation extends Component {
  @observable modalVisible = false;
  @autobind
  onSetRelation() {
    this.modalVisible = true;
  }

  @autobind
  onModalCancel() {
    this.modalVisible = false;
  }

  @computed get tableData() {
    const { store: { competitivePriceModel } } = this.props;
    const datas = [];

    competitivePriceModel.contrastRelationData.forEach(skuItem => {
      skuItem.competeList.forEach((competeItem, i) => {
        datas.push({
          rowSpan: i == 0 ? skuItem.competeList.length : null,
          sku: skuItem.sku,
          wareName: skuItem.wareName,
          competeSku: competeItem.sku,
          competeWareName: competeItem.wareName,
          sourceId: competeItem.sourceId,
          sourceName: competeItem.sourceName
        });
      });
    });

    return datas;
  }

  @autobind
  onDelete(sku) {
    const { store: { competitivePriceModel } } = this.props;

    return e => {
      Modal.confirm({
        title: '确认删除？',
        onOk: () => {
          const closeLoading = Message.loading('正在删除数据...', 0);
          competitivePriceModel.deleteWare(sku).then(result => {
            closeLoading();
            if (result) {
              queryData(competitivePriceModel);
            }
          });
        }
      });
    };
  }

  @autobind
  onCompeteDelete(text, record, index) {
    const { store: { competitivePriceModel } } = this.props;

    return e => {
      Modal.confirm({
        title: '确认删除？',
        onOk: () => {
          const closeLoading = Message.loading('正在删除数据...', 0);
          competitivePriceModel.deleteCompeteWare({
            sku: record.sku,
            friendsSku: record.competeSku,
            sourceId: record.sourceId,
            sourceName: record.sourceName,
          }).then(result => {
            closeLoading();
            if (result) {
              queryData(competitivePriceModel);
            }
          });
        }
      });
    };
  }

  @autobind
  renderGroupRow(name) {
    return (text, record, index) => {
      const obj = {
        children: name === 'operation' ? nj `<a onClick="${this.onDelete(record.sku)}">删除</a>` () : text,
        props: {},
      };

      if (record.rowSpan) {
        obj.props.rowSpan = record.rowSpan;
      } else {
        obj.props.rowSpan = 0;
      }
      return obj;
    };
  }

  @observable skuInput = '';
  @observable skuSubmit = '';

  @autobind
  onSkuChange(e) {
    this.skuInput = e.target.value;
  }

  @autobind
  onQuerySku() {
    if (this.skuInput.trim() === '') {
      Modal.error({
        title: '请输入正确的自营商品编码'
      });
      return;
    }

    const { store: { competitivePriceModel } } = this.props;
    const closeLoading = Message.loading('正在获取数据...', 0);

    competitivePriceModel.getWareName(this.skuInput).then(result => {
      if (result != null && result.trim() !== '') {
        this.skuSubmit = this.skuInput;
      } else {
        this.skuSubmit = '';
        competitivePriceModel.setWareNameValue('');
      }

      this.skuCompeteInput = '';
      this.skuCompeteSubmit = '';
      competitivePriceModel.setCompeteWareInfoValue(null);
      closeLoading();
    });
  }

  @observable skuCompeteInput = '';
  @observable skuCompeteSubmit = '';

  @autobind
  onCompeteSkuChange(e) {
    this.skuCompeteInput = e.target.value;
  }

  @autobind
  onQueryCompeteSku() {
    if (this.skuCompeteInput.trim() === '') {
      Modal.error({
        title: '请输入正确的竞争商品编码'
      });
      return;
    }
    if (this.skuSubmit.trim() === '') {
      Modal.error({
        title: '请输入正确的自营商品编码'
      });
      return;
    }

    const { store: { competitivePriceModel } } = this.props;
    const closeLoading = Message.loading('正在获取数据...', 0);
    competitivePriceModel.getCompeteWareInfo(this.skuSubmit, this.skuCompeteInput).then(result => {
      if (result != null && result.wareName != null && result.wareName.trim() !== '') {
        this.skuCompeteSubmit = this.skuCompeteInput;
      } else {
        this.skuCompeteSubmit = '';
        competitivePriceModel.setCompeteWareInfoValue(null);
      }
      closeLoading();
    });
  }

  @autobind
  onAddCompeteSku() {
    if (this.skuSubmit.trim() === '') {
      Modal.error({
        title: '请输入正确的自营商品编码'
      });
      return;
    }
    if (this.skuCompeteSubmit.trim() === '') {
      Modal.error({
        title: '请输入正确的竞争商品编码'
      });
      return;
    }

    const { store: { competitivePriceModel } } = this.props;
    const closeLoading = Message.loading('正在提交数据...', 0);
    competitivePriceModel.addCompeteWare({
      sku: this.skuSubmit,
      competeSku: this.skuCompeteSubmit
    }).then(result => {
      closeLoading();
      if (result) {
        queryData(competitivePriceModel);
      }
    });
  }

  @autobind
  onAddFriendsSku(text, record, index) {
    const { store: { competitivePriceModel } } = this.props;

    return e => {
      const closeLoading = Message.loading('正在提交数据...', 0);
      competitivePriceModel.addCompeteWare({
        sku: this.skuSubmit,
        competeSku: this.skuCompeteSubmit,
        friendsSku: record.sku,
        sourceId: record.sourceId,
        sourceName: record.sourceName
      }).then(result => {
        closeLoading();
        if (result) {
          queryData(competitivePriceModel);
        }
      });
    };
  }

  render() {
    const { store: { competitivePriceModel } } = this.props;

    return tmpls.setRelation(this.props, this, {
      styles,
      competitivePriceModel,
      scroll: competitivePriceModel.contrastRelationData.length > 1 ? {
        y: 240
      } : undefined,
      friendsScroll: competitivePriceModel.competeWareInfo && competitivePriceModel.competeWareInfo.matchList.length > 10 ? {
        y: 240
      } : undefined
    });
  }
}

@registerTmpl('FocusOnCommodities')
@inject('store')
@observer
export class FocusOnCommodities extends Component {
  @autobind
  onItemExpand(skuItem) {
    const { store: { competitivePriceModel } } = this.props;

    return e => {
      skuItem.setExpanded(!skuItem.expanded);

      //获取趋势分析
      if (skuItem.expanded && skuItem.competeSelectedKeys.length) {
        const closeLoading = Message.loading('正在获取数据...', 0);
        competitivePriceModel.getTrendAnalysisData().then(() => closeLoading());
      }
    };
  }

  @autobind
  onDelete(skuItem) {
    const { store: { competitivePriceModel } } = this.props;

    return e => {
      Modal.confirm({
        title: '确认删除？',
        onOk: () => {
          const closeLoading = Message.loading('正在删除数据...', 0);
          competitivePriceModel.deleteWare(skuItem.sku).then(result => {
            closeLoading();
            if (result) {
              queryData(competitivePriceModel);
            }
          });
        }
      });
    };
  }

  @autobind
  onCompeteDelete(text, record, index) {
    const { store: { competitivePriceModel } } = this.props;

    return e => {
      Modal.confirm({
        title: '确认删除？',
        onOk: () => {
          const closeLoading = Message.loading('正在删除数据...', 0);
          competitivePriceModel.deleteCompeteWare({
            sku: record.parentSku,
            friendsSku: record.sku,
            sourceId: record.sourceId,
            sourceName: record.sourceName,
          }).then(result => {
            closeLoading();
            if (result) {
              queryData(competitivePriceModel);
            }
          });
        }
      });
    };
  }

  @autobind
  onSelectChange(skuItem) {
    const { store: { competitivePriceModel } } = this.props;

    return selectedKeys => {
      skuItem.setCompeteSelectedKeys(selectedKeys);

      //获取趋势分析
      if (skuItem.expanded && skuItem.competeSelectedKeys.length) {
        const closeLoading = Message.loading('正在获取数据...', 0);
        competitivePriceModel.getPromotionData(competitivePriceModel.selectedDate),
        competitivePriceModel.getTrendAnalysisData().then(() => closeLoading());
      }
      else {
        competitivePriceModel.reactChartData();
      }
    };
  }

  render() {
    const { store: { competitivePriceModel } } = this.props;

    return tmpls.focusOnCommodities(this.props, this, {
      styles,
      competitivePriceModel
    });
  }
}

@registerTmpl('PromotionInfo')
@inject('store')
@observer
export class PromotionInfo extends Component {
  render() {
    const { store: { competitivePriceModel } } = this.props;

    return tmpls.promotionInfo(this.props, this, {
      styles,
      competitivePriceModel
    });
  }
}

@registerTmpl('TrendAnalysis')
@inject('store')
@observer
export class TrendAnalysis extends Component {
  @computed get option() {
    const { store: { competitivePriceModel } } = this.props;
    const dates = competitivePriceModel.trendAnalysisData.map(dayData => dayData.date);
    const startValue = moment().subtract(7, 'days').format("YYYY-MM-DD"),
      endValue = moment().format("YYYY-MM-DD");

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: p => {
          if (p[0].seriesName === '商品销量') {
            return;
          }

          return njs `
          <div>${p[0].name}</div>
          <#each ${p}>
            <#if {${nj.isObject}_(data)}>
              {{marker}}{seriesName}<br>
              <#each {data.datas} moreValues>
                {time}：{value}
                <#if {!(@last)}><br></#if>
              </#each>
              <#else>{{marker}}{seriesName}：{data}</#else>
            </#if>
            <br>
          </#each>
        ` ();
        },
      },
      legend: {
        left: 'right',
        data: ['商品价格', '竞品价格', '商品销量', '竞品销量']
      },
      dataZoom: [{
        show: true,
        realtime: true,
        startValue,
        endValue,
        zoomOnMouseWheel: false,
        xAxisIndex: [0, 1]
      }, {
        type: 'inside',
        realtime: true,
        startValue,
        endValue,
        zoomOnMouseWheel: false,
        xAxisIndex: [0, 1]
      }],
      grid: [{
        // left: 80,
        // right: 80,
        height: '30%'
      }, {
        // left: 80,
        // right: 80,
        top: '55%',
        height: '30%'
      }],
      xAxis: [{
        type: 'category',
        boundaryGap: false,
        axisLine: { onZero: true },
        data: dates
      }, {
        gridIndex: 1,
        type: 'category',
        boundaryGap: false,
        axisLine: { onZero: true },
        data: dates
      }],
      yAxis: [{
        name: '价格趋势分析',
        type: 'value'
      }, {
        gridIndex: 1,
        name: '销量趋势分析',
        type: 'value',
        axisLabel: {
          show: false
        }
      }],
      toolbox: { show: false }
    }
  }

  @computed get data() {
    const { store: { competitivePriceModel } } = this.props;
    const dataPrice = [],
      dataCompetePrice = [],
      dataSales = [],
      dataCompeteSales = [];
    competitivePriceModel.trendAnalysisData.forEach(dayData => {
      dataPrice.push(dayData.price && dayData.price.length ? {
        datas: toJS(dayData.price),
        value: dayData.price ? Math.min.apply(null, dayData.price.map(p => p.value)) : 0
      } : { datas: null, value: 0 });
      dataCompetePrice.push(dayData.competePrice && dayData.competePrice.length ? {
        datas: toJS(dayData.competePrice),
        value: dayData.competePrice ? Math.min.apply(null, dayData.competePrice.map(p => p.value)) : 0
      } : { datas: null, value: 0 });
      dataSales.push(dayData.sales);
      dataCompeteSales.push(dayData.competeSales);
    });

    return [{
      name: '商品价格',
      smooth: true,
      data: dataPrice
    }, {
      name: '竞品价格',
      smooth: true,
      data: dataCompetePrice
    }, {
      name: '商品销量',
      smooth: true,
      xAxisIndex: 1,
      yAxisIndex: 1,
      data: dataSales
    }, {
      name: '竞品销量',
      smooth: true,
      xAxisIndex: 1,
      yAxisIndex: 1,
      data: dataCompeteSales
    }];
  }

  componentDidMount() {
    const { store: { competitivePriceModel } } = this.props;

    this.refs.chart.chart.on('click', params => {
      runInAction(() => {
        competitivePriceModel.setSelectedDate(params.name);
        competitivePriceModel.getPromotionData(params.name);
      });
    });
  }

  render() {
    const { store: { competitivePriceModel } } = this.props;

    return tmpls.trendAnalysis(this.props, this, {
      styles,
      competitivePriceModel
    });
  }
}
