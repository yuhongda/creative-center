import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { observable, computed, toJS } from 'mobx'
import { observer, inject } from 'mobx-react';
import nj from 'nornj';
import { registerTmpl } from 'nornj-react';

import 'vic-common/lib/components/antd/pagination';
import 'vic-common/lib/components/antd/icon';
import 'vic-common/lib/components/antd/tabs';
import 'vic-common/lib/components/antd/table';
import 'vic-common/lib/components/antd/tooltip';
import 'vic-common/lib/components/antd/popover';
import 'vic-common/lib/components/antd/checkbox';
import 'vic-common/lib/components/antd/radio';

import echarts from 'echarts/lib/echarts';
import 'echarts/lib/component/calendar';
import 'vic-common/lib/components/ECharts/barChart';
import 'vic-common/lib/components/ECharts/pieChart';

import Message from 'vic-common/lib/components/antd/message';
import graphic from 'echarts/lib/util/graphic.js'
import { autobind } from 'core-decorators';
import styles from './stockWarning.m.scss';
import tmpls from './stockWarning.t.html';
import '../../components/conditonsStock';
import '../../components/conditons';
import Notification from '../../../utils/notification';

// 页面容器组件
@inject('store')
@observer
@registerTmpl('StockWarning')
export default class StockWarning extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {}

    getSearchConditions() {
        return {
            deptId: this.props.store.conditionsStock.selectedDept || '',
            categoryId1: this.props.store.conditionsStock.selectedCategory[0] || '',
            categoryId2: this.props.store.conditionsStock.selectedCategory[1] || '',
            categoryId3: this.props.store.conditionsStock.selectedCategory[2] || '',
            brandId: this.props.store.conditionsStock.selectedBrand || '',
            dataRange: this.props.store.conditionsStock.selectedDataRange || '',
            date: this.props.store.conditionsStock.selectedDate || '',
        }
    }

    @autobind
    onSearch() {
        const { store: { stockWarning } } = this.props;
        const closeLoading = Message.loading('正在获取数据...', 0);
        let searchParams = this.getSearchConditions();
        stockWarning.setSearchParams(searchParams);
        Promise.all([
            stockWarning.getWaringSummary(searchParams),
            stockWarning.getStockPauseData(searchParams),
            stockWarning.getStockOutPVBarData(searchParams),
            stockWarning.getStockOutPVPieData(searchParams),
            stockWarning.getBelowStockData(searchParams),
            stockWarning.getBelowStockListData(searchParams),
            stockWarning.getStockOutData(searchParams),
            stockWarning.getDeadStockData(searchParams)
        ]).then(() => {
            const listParams = this.getSearchConditions();
            searchParams.pauseLength = stockWarning.stockPauseLength;
            stockWarning.getStockPauseListData(searchParams);
            listParams.dcId = stockWarning.stockPVDcId;
            stockWarning.getStockOutPVBarListData(listParams);
            listParams.dcId = stockWarning.stockOutDcId;
            stockWarning.getStockOutListData(listParams);
            listParams.dcId = stockWarning.deadStockDcId;
            stockWarning.getDeadStockListData(listParams);
        }).then(() => {
            closeLoading();
        });
    }

    render() {
        const { store: { stockWarning } } = this.props;
        return tmpls.stockWarning(this.state, this.props, this, {
            styles,
            stockWarning
        });
    }
}

/**
 * summary
 * @class warningSummary
 * @extends {Component}
 */
//---------------------------------------------------------------
@registerTmpl('warningSummary')
@inject('store')
@observer
class WarningSummary extends Component {

    constructor(props) {
        super(props);
        this.popStockPause = nj `<ul><li>暂停缺货金额</li></ul>` ();
        this.popStockPV = nj `<ul><li>无货PV>0的SKU数/总上柜SKU数</li></ul>` ();
        this.popBlowStock = nj `<ul><li>下柜商品库存金额</li></ul>` ();
        this.popStockOut = nj `<ul><li>SKU+DC缺货记录行/总上柜SKU+DC记录行</li></ul>` ();
        this.popDeadStock = nj `<ul><li>滞销SKU数/总有库存SKU数</li></ul>` ();
    }

    componentDidMount() {}

    state = {
        options: [
            { label: '缺货暂停金额', value: 'noStock' },
            { label: '无货PV商品占比', value: 'PV' },
            { label: '下柜库存金额', value: 'noSales' },
            { label: '库存缺货商品占比', value: 'outOfStock' },
            { label: '滞销商品占比', value: 'unsalable' },
        ]
    }

    @autobind
    onChange(checkedValues) {
        if (checkedValues.length <= 4) {
            if (checkedValues.length < 1) {
                Notification.error({ description: '至少选择一个指标', duration: 1 });
            } else {
                this.props.store.stockWarning.setValue(checkedValues);
                this.props.store.stockWarning.setShowItem(0);
            }
        } else {
            Notification.error({ description: '最多只能选择4项指标', duration: 1 });
        }
    }


    render() {
        const { store: { stockWarning } } = this.props;
        return tmpls.warningSummary(this.state, this.props, this, {
            styles,
            stockWarning,
            value: stockWarning.value != 'null' ? toJS(stockWarning.value) : [],
        });
    }
}

/**
 * 01 stockPause 缺货暂停金额
 * @class stockPauseTbox
 * @extends {Component}
 */
//---------------------------------------------------------------
@registerTmpl('stockPauseTbox')
@inject('store')
@observer
export class stockPauseTbox extends Component {

    @computed get stockPauseOption() {
        let _data = toJS(this.props.store.stockWarning.stockPauseData);
        return {
            toolbox: { show: false },
            tooltip: {
                trigger: 'axis',
                axisPointer: { // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                },
                formatter: function(params) {
                    var result = `<div>暂停时长${params[0].name}内订单</div>`;
                    params.forEach(function(item) {
                        result += `<div>
                              <span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:${item.color}"></span>
                              <span>占${item.seriesName}:</span>
                              <span>${((item.data < 0 ? -item.data : item.data) * 100).toFixed(2) || '--'}%</span>
                          </div>`;
                    });
                    return result
                }
            },
            legend: {
                data: ['暂停订单', '损失金额']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '-4%',
                containLabel: true
            },
            xAxis: [{
                type: 'value',
                inverse: true,
                axisLabel: { show: false },
                axisTick: { show: false },
                axisLine: { show: true },
                min: -1,
                max: 1
            }],
            yAxis: [{
                type: 'category',
                axisTick: { show: false },
                data: toJS(_data && _data[0])
            }]
        }
    }
    @computed get stockPauseData() {
        let _data = this.props.store.stockWarning.stockPauseData;
        return [{
                name: '暂停订单',
                type: 'bar',
                stack: 'one',
                barWidth: '50%',
                label: {
                    normal: {
                        show: false,
                        position: 'insideLeft',
                        formatter: params => {
                            return (params.data * 100).toFixed(0) + '%';
                        }
                    }
                },
                data: toJS(_data && _data[1]),
            },
            {
                name: '损失金额',
                type: 'bar',
                stack: 'one',
                barWidth: '50%',
                label: {
                    normal: {
                        show: false,
                        position: 'insideRight',
                        formatter: params => {
                            return (params.data * -100).toFixed(0) + '%';
                        }
                    }
                },
                data: toJS(_data && _data[2]),
            }
        ]
    }

    constructor(props) {
        super(props);
    }

    @autobind
    onDownload() {
        findDOMNode(this.refs.formExport).submit();
    }

    componentDidMount() {
        // 柱状图点击响应
        const { store: { stockWarning } } = this.props;
        this.refs.ecStockPause.chart.on('click', params => {
            //  console.log('ecStockPause', params);
            stockWarning.setStockPauseSeriesName(params.name);
            const listParams = toJS(stockWarning.searchParams);
            const _data = toJS(stockWarning.stockPauseData);
            const _pauseLength = _data[3][_data[0].indexOf(params.name)];
            stockWarning.setStockPauseLength(_pauseLength);
            listParams.pauseLength = _pauseLength;
            //  console.log('click-ecStockPause', listParams);
            const closeLoading = Message.loading('正在获取数据...', 0);
            Promise.all([
                stockWarning.getStockPauseListData(listParams),
            ]).then(() => { closeLoading() });
        });
    }

    render() {
        const { store: { stockWarning } } = this.props;
        const stockPauseTableColumns = [{
            title: '排名',
            dataIndex: 'key',
            width: 50,
        }, {
            title: '商品名称',
            dataIndex: 'productName',
            width: 200,
        }, {
            title: 'SKU编码',
            dataIndex: 'sku',
            width: 100,
        }, {
            title: '订单数量',
            dataIndex: 'orderNum',
            width: 100,
        }, {
            title: '损失金额(元)',
            dataIndex: 'lossSum',
            width: 100,
        }, {
            title: '损失占比',
            dataIndex: 'lossPer',
            width: 100,
            render: text => text != null ? `${text != 0 ? (text * 100).toFixed(2) : 0}%` : ''
        }];
        return tmpls.stockPauseTbox(this.state, this.props, this, {
            styles,
            stockWarning,
            stockPauseTableColumns,
            stockPauseTableData: toJS(stockWarning.stockPauseListData),
            stockPauseScrollNum: { x:true, y: 335 },
            tableParams: toJS(stockWarning.searchParams),
            formAction: `${__HOST}/stockWarning/getStockPauseTableData`,
        });
    }
}

/**
 * 02 stockOutPV 无货PV
 * @class StockOutPVTBox
 * @extends {Component}
 */
//---------------------------------------------------------------
@registerTmpl('stockOutPVTBox')
@inject('store')
@observer
class StockOutPVTBox extends Component {

    @observable switchIndex = 'a';

    constructor(props) {
        super(props);
    }

    /**
     * 无货PV柱状图 option
     * @readonly
     * @memberof stockOutPV
     */
    @computed get barStockOutPVOption() {
        const _data = this.props.store.stockWarning.stockOutPVBarData;
        return {
            toolbox: false,
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: ['售止商品', '全部商品']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'value',
                boundaryGap: [0, 0.01]
            },
            yAxis: {
                type: 'category',
                data: toJS(_data && _data[2]),
            }
        }
    }

    @computed get barStockOutPVData() {
        const _data = this.props.store.stockWarning.stockOutPVBarData;
        return [{
                name: '售止商品',
                type: 'bar',
                stack: 'one',
                data: toJS(_data && _data[0])
            },
            {
                name: '全部商品',
                type: 'bar',
                stack: 'two',
                data: toJS(_data && _data[1])
            }
        ]
    }

    @computed get stockOutPVOption() {
        const _data = this.props.store.stockWarning.stockOutPVPieData;
        return {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: toJS(_data && _data[0])
            }
        }
    }

    @computed get stockOutPVData() {
        const _data = this.props.store.stockWarning.stockOutPVPieData;
        return [{
            name: '无货原因分布',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: toJS(_data && _data[1]),
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }]
    }

    componentDidMount() {
      this.onBarPvClick();
    }

    onBarPvClick() {
      const { store: { stockWarning } } = this.props;
      // 柱状图点击响应
      this.refs.ecBarStockOutPV.chart.on('click', params => {
          stockWarning.setStockOutPVBarName(params.name);
          //  console.log('ecBarStockOutPV', params);
          const pvListParams = toJS(stockWarning.searchParams);
          const _data = toJS(stockWarning.stockOutPVBarData);
          const _dcId = _data[3][_data[2].indexOf(params.name)];
          stockWarning.setStockPVDcId(_dcId)
          pvListParams.dcId = _dcId;
          // console.log('listParams', toJS(pvListParams));
          const closeLoading = Message.loading('正在获取数据...', 0);
          Promise.all([
              stockWarning.getStockOutPVBarListData(toJS(pvListParams)),
          ]).then(() => {
              closeLoading()
          });
      });
    }

    @autobind
    onStockTypeChange(e) {
        this.switchIndex = e.target.value;
        if(e.target.value === 'a') {
           setTimeout(()=> {this.onBarPvClick()}, 1000);
        }
    }

    @autobind
    onDownload() {
        findDOMNode(this.refs.formExport).submit();
    }

    render() {
        const { store: { stockWarning } } = this.props;
        const stockOutPVTableColumns = [{
            title: '排名',
            dataIndex: 'key',
            width: 50,
        }, {
            title: '商品名称',
            dataIndex: 'productName',
            width: 200,
        }, {
            title: 'SKU编码',
            dataIndex: 'sku',
            width: 100,
        }, {
            title: '是否售止',
            dataIndex: 'isSale',
            width: 100,
        }, {
            title: '无货PV',
            dataIndex: 'pv',
            width: 100,
        }, {
            title: '无货PV占比',
            dataIndex: 'pvPer',
            width: 100,
            render: text => text != null ? `${text != 0 ? (text * 100).toFixed(2) : 0}%` : ''
        }, {
            title: '缺货原因',
            dataIndex: 'stockCause',
            width: 100
        }];
        const tableList = toJS(stockWarning.stockOutPVBarListData);
        return tmpls.stockOutPVTBox(this.state, this.props, this, {
            styles,
            stockWarning,
            stockOutPVTableColumns,
            stockOutPVBarTableData: tableList,
            stockOutPVScrollNum: {x:true, y: 345 },
            tableParams: toJS(stockWarning.searchParams),
            formAction: `${__HOST}/stockWarning/getStockOutPVBarTableData`,
        });
    }
}

/**
 * 03 belowStock 下柜库存金额
 * @class belowStockTbox
 * @extends {Component}
 */
//---------------------------------------------------------------
@registerTmpl('belowStockTbox')
@inject('store')
@observer
class BelowStockTbox extends Component {

    constructor(props) {
        super(props);
    }

    @autobind
    onDownload() {
        findDOMNode(this.refs.formExport).submit();
    }

    @computed get belowStockOption() {
        const _data = this.props.store.stockWarning.belowStockData;
        return {
            toolbox: false,
            title: {
                text: '下柜金额商品分布分析',
                x: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'horizontal',
                bottom: 'bottom',
                data: toJS(_data && _data[0])
            }
        }
    }

    @computed get belowStockData() {
        const _data = this.props.store.stockWarning.belowStockData;
        return [{
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: toJS(_data && _data[1]),
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }]
    }

    componentDidMount() {}

    render() {
        const { store: { stockWarning } } = this.props;
        const belowStockTableColumns = [{
            title: '排名',
            dataIndex: 'key',
            width: 50,
        }, {
            title: '商品名称',
            dataIndex: 'productName',
            width: 200,
        }, {
            title: 'SKU编码',
            dataIndex: 'sku',
            width: 100,
        }, {
            title: '下柜库存金额(元)',
            dataIndex: 'blowSum',
            width: 120,
        }, {
            title: '下柜库存金额占比',
            dataIndex: 'blowPer',
            width: 150,
            render: text => text != null ? `${text != 0 ? (text * 100).toFixed(2) : 0}%` : ''
        }];

        return tmpls.belowStockTbox(this.state, this.props, this, {
            styles,
            stockWarning,
            belowStockTableColumns,
            belowStockTableData: toJS(stockWarning.belowStockListData),
            belowStockScrollNum: {x:true, y: 345 },
            tableParams: toJS(stockWarning.searchParams),
            formAction: `${__HOST}/stockWarning/getBelowStockTableData`,
        });
    }
}


/**
 * 04 stockOut 库存缺货
 * @class stockOutTbox
 * @extends {Component}
 */
//---------------------------------------------------------------
@registerTmpl('stockOutTbox')
@inject('store')
@observer
class StockOutTbox extends Component {

    constructor(props) {
        super(props);
    }

    @autobind
    onDownload() {
        findDOMNode(this.refs.formExport).submit();
    }

    @computed get barStockOutOption() {
        const _data = this.props.store.stockWarning.stockOutData;
        return {
            toolbox: false,
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: ['售止缺货商品', '缺货商品']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '1%',
                containLabel: true
            },
            xAxis: {
                type: 'value',
                boundaryGap: [0, 0.01]
            },
            yAxis: {
                type: 'category',
                data: toJS(_data && _data[2]),
            }
        }
    }

    @computed get barStockOutData() {
        const _data = this.props.store.stockWarning.stockOutData;
        return [{
                name: '售止缺货商品',
                type: 'bar',
                stack: 'one',
                data: toJS(_data && _data[0])
            },
            {
                name: '缺货商品',
                type: 'bar',
                stack: 'two',
                data: toJS(_data && _data[1])
            }
        ]
    }

    componentDidMount() {
        const { store: { stockWarning } } = this.props;
        // 点击响应
        this.refs.ecStockOut.chart.on('click', params => {
            stockWarning.setStockOutName(params.name);
            const outListParams = toJS(stockWarning.searchParams);
            const _data = toJS(stockWarning.stockOutData);
            const _dcId = _data[3][_data[2].indexOf(params.name)];
            stockWarning.setStockOutDcId(_dcId);
            outListParams.dcId = _dcId;
            // console.log('ecStockOut', params);
            // console.log('click-ecStockOut', outListParams);
            const closeLoading = Message.loading('正在获取数据...', 0);
            Promise.all([
                stockWarning.getStockOutListData(outListParams),
            ]).then(() => { closeLoading() });
        });

    }


    render() {
        const { store: { stockWarning } } = this.props;
        const stockOutTableColumns = [{
            title: '排名',
            dataIndex: 'key',
            width: 40,
        }, {
            title: '商品名称',
            dataIndex: 'productName',
            width: 200,
        }, {
            title: 'SKU编码',
            dataIndex: 'sku',
            width: 100,
        }, {
            title: '是否售止',
            dataIndex: 'isSale',
            width: 100,
        }];

        return tmpls.stockOutTbox(this.state, this.props, this, {
            styles,
            stockWarning,
            stockOutTableColumns,
            stockOutTableData: toJS(stockWarning.stockOutListData),
            stockOutScrollNum: {x:true, y: 345 },
            tableParams: toJS(stockWarning.searchParams),
            formAction: `${__HOST}/stockWarning/getStockOutTableData`,
        });
    }
}


/**
 * 05 deadStock 滞销商品
 * @class deadStockTbox
 * @extends {Component}
 */
//---------------------------------------------------------------
@registerTmpl('deadStockTbox')
@inject('store')
@observer
class DeadStockTbox extends Component {

    constructor(props) {
        super(props);
    }

    @autobind
    onDownload() {
        findDOMNode(this.refs.formExport).submit();
    }

    @computed get deadStockOption() {
        const _data = this.props.store.stockWarning.deadStockData
        return {
            toolbox: false,
            title: {
                text: '滞销商品分布分析',
                x: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: toJS(_data && _data[0])
            }
        }
    }

    @computed get deadStockData() {
        const _data = this.props.store.stockWarning.deadStockData;
        return [{
            name: '滞销商品',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: toJS(_data && _data[1]),
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }]
    }

    componentDidMount() {
        const { store: { stockWarning } } = this.props;
        // 柱状图点击响应
        this.refs.ecDeadStock.chart.on('click', params => {
            stockWarning.setDeadStockName(params.name);
            const deadListParams = toJS(stockWarning.searchParams);
            const _data = toJS(stockWarning.deadStockData);
            const _dcId = _data[2][_data[0].indexOf(params.name)];
            stockWarning.setDeadStockDcId(_dcId);
            deadListParams.dcId = _dcId;
            // console.log('ecDeadStock', params,_dcId);
            // console.log('click-ecDeadStock', deadListParams);
            const closeLoading = Message.loading('正在获取数据...', 0);
            Promise.all([
                stockWarning.getDeadStockListData(deadListParams),
            ]).then(() => { closeLoading() });
        });
    }

    render() {
        const { store: { stockWarning } } = this.props;
        const deadStockTableColumns = [{
            title: '排名',
            dataIndex: 'key',
            width: 40,
        }, {
            title: '商品名称',
            dataIndex: 'productName',
            width: 200,
        }, {
            title: 'SKU编码',
            dataIndex: 'sku',
            width: 100,
        }, {
            title: '配送中心',
            dataIndex: 'dc',
            width: 100,
        }, {
            title: '滞销库存',
            dataIndex: 'deadStock',
            width: 100,
        }, {
            title: '总库存',
            dataIndex: 'totalStock',
            width: 100,
        }, {
            title: `${stockWarning.days > 0 ? stockWarning.days : 'xx'}日销量`,
            dataIndex: 'dailySales',
            width: 100,
        }, {
            title: '周转',
            dataIndex: 'turnover',
            width: 60,
            render: text => parseFloat(text).toFixed(0) > 0 ? parseFloat(text).toFixed(0) : text

        }];
        return tmpls.deadStockTbox(this.state, this.props, this, {
            styles,
            stockWarning,
            deadStockTableColumns,
            deadStockTableData: toJS(stockWarning.deadStockListData),
            deadStockScrollNum: {x:true, y: 345 },
            tableParams: toJS(stockWarning.searchParams),
            formAction: `${__HOST}/stockWarning/getDeadStockTableData`,
        });
    }
}
