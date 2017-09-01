import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { observable, computed, toJS } from 'mobx'
import { observer, inject } from 'mobx-react';
import nj from 'nornj';
import { registerTmpl } from 'nornj-react';
import 'vic-common/lib/components/antd/button';
import 'vic-common/lib/components/antd/table';
import 'vic-common/lib/components/antd/select';
import 'vic-common/lib/components/antd/input';
import 'vic-common/lib/components/antd/pagination';
import Notification from 'vic-common/lib/components/antd/notification';
import Message from 'vic-common/lib/components/antd/message';
import { autobind } from 'core-decorators';
import styles from './outOfStockReason.m.scss';
import tmpls from './outOfStockReason.t.html';
import '../../components/conditonsStock';
import { dateFormat } from '../../misc/util'
import 'vic-common/lib/components/antd/table';

const getQueryParams = obj => {
  const params = {
    categoryId1: '',
    categoryId2: '',
    categoryId3: '',
    brandId: '',
    dataRange: '',
    sku: '',
    date: '' //dateFormat(new Date(), 'yyyy-mm-dd')
  };
  const cs = obj && obj.props && obj.props.store && obj.props.store.conditionsStock ? obj.props.store.conditionsStock : null;
  if(cs) {
    const selectedCategory = cs.selectedCategory instanceof Array ? cs.selectedCategory : null;
    //替换中文逗号
    let sku = cs.skuList || '';
    if(sku) {
      sku = sku.replace(/，/g, ',');
    }
    params.categoryId1 = selectedCategory && selectedCategory.length > 0 ? selectedCategory[0] : '';
    params.categoryId2 = selectedCategory && selectedCategory.length > 1 ? selectedCategory[1] : '';
    params.categoryId3 = selectedCategory && selectedCategory.length > 2 ? selectedCategory[2] : '';
    params.brandId = cs.selectedBrand || '';
    params.dataRange = cs.selectedDataRange || '';
    params.sku = sku;
    params.date = cs.selectedDate ? cs.selectedDate : dateFormat(new Date(), 'yyyy-mm-dd')
  }
  return params;
};

//页面容器组件
@inject('store')
@observer
@registerTmpl('OutOfStockReason')
export default class OutOfStockReason extends Component {

  constructor(props) {
      super(props);
  }

  componentDidMount() {
    this.props.store.outOfStockReason.getOutOfStockReasons();
  }

  @autobind
  onSearch(){
    const queryParams = getQueryParams(this);
    queryParams.page = 1;
    queryParams.pageSize = 10;
    const closeLoading = Message.loading('正在获取数据...', 0);
    Promise.all([
      this.props.store.outOfStockReason.getOutOfStockReasonList(queryParams),
      this.props.store.outOfStockReason.setOutOfStockReasonCurrentPage(1)
    ]).then(() => {
      closeLoading();
    });
  }

  render() {

    const { store: { conditions } } = this.props;
    return tmpls.OutOfStockReason(this.state, this.props, this, {
      styles,
      conditions
    });
  }
}

@registerTmpl('OutOfStockReasonSelect')
@inject('store')
@observer
export class OutOfStockReasonSelect extends Component {
  oriValue = null;
  @observable currValue = null;

  componentDidMount() {
    const { value, defValue } = this.props;
    if(typeof value === 'string') {
      this.oriValue = value;
      this.currValue = value;
    }else {
      if (typeof defValue === 'string') {
        this.currValue = defValue;
      } else {
        this.currValue = '0';
      }
    }
  }
  componentDidUpdate() {
    const { value } = this.props;
    if(value !== this.oriValue) {
      this.oriValue = value;
      this.currValue = value;
    }
  }

  @autobind
  onSelectChange(value) {
    this.currValue = value;
    typeof this.props.onChange === 'function' && this.props.onChange(value);
  }

  render() {
    const outOfStockReasons = this.props.store.outOfStockReason.outOfStockReasons;
    return tmpls.OutOfStockReasonSelect(this.state, this.props, this, {
      styles,
      outOfStockReasons
    });
  }
}

@registerTmpl('OutOfStockReasonTable')
@inject('store')
@observer
export class OutOfStockReasonTable extends Component {
  //缺货原因下拉列表默认值
  selectReasonIdDef = '-1';

  @observable dataCanBeSubmit = false;
  @observable dlgPurchasePlanListVisible = false;

  @observable reasonIdBatch = this.selectReasonIdDef;
  @observable selectedRowKeys = [];

  @autobind
  onExport() {
    findDOMNode(this.refs.formExport).submit();
  }

  @autobind
  onPaging(page, pageSize){
    this.selectedRowKeys = [];
    const closeLoading = Message.loading('正在获取数据...', 0);
    const queryParams = getQueryParams(this);
    queryParams.page = page;
    queryParams.pageSize = pageSize;
    Promise.all([
      this.props.store.outOfStockReason.getOutOfStockReasonList(queryParams),
      this.props.store.outOfStockReason.setOutOfStockReasonCurrentPage(page)
    ]).then(() => {
      closeLoading();
    });
  }

  @autobind
  dlgPurchasePlanListCancel() {
    this.dlgPurchasePlanListVisible = false;
    setTimeout(() => {
      this.props.store.outOfStockReason.clearPurchasePlanList();
    }, 300);
  }

  @autobind
  showModal(record) {
    this.dlgPurchasePlanListVisible = true;
    this.props.store.outOfStockReason.getPurchasePlanList({
      skuId: record.skuId,
      dcCode: record.dcCode,
      date: this.props.store.conditionsStock.selectedDate
    });
  }

  @autobind
  onReasonChangeBatch(value) {
    if(!this.selectedRowKeys || !(this.selectedRowKeys instanceof Array)) {
      return;
    }
    this.reasonIdBatch = value;
    this.props.store.outOfStockReason.setOutOfStockReasonIdBatch(this.selectedRowKeys, value);
  }

  @autobind
  onReasonChangeSingle(keyObj, reasonId) {
    //console.log(`${key}, ${reasonId}`);
    const {dcCode, skuId} = keyObj;
    if(this.selectedRowKeys.indexOf(`${dcCode}-${skuId}`) >= 0 && this.reasonIdBatch !== reasonId) {
      this.reasonIdBatch = this.selectReasonIdDef;
    }
    this.props.store.outOfStockReason.setOutOfStockReasonIdByKey(keyObj, reasonId);
  }

  onRemarkChange(key, remark) {
    this.props.store.outOfStockReason.setOutOfStockReasonRemarkByKey(key, remark);
  }

  @autobind
  onClickSave() {
/*    if(!this.selectedRowKeys || !(this.selectedRowKeys instanceof Array) || this.selectedRowKeys.length <= 0) {
      Notification.error({ message: '错误：', description: '尚未选择需要保存的数据', duration: 2 });
      return false;
    }*/
    const closeLoading = Message.loading('正在保存数据...', 0);
    Promise.all([
      this.props.store.outOfStockReason.saveOutOfStockReason()
    ]).then(() => {
      closeLoading();
    });
  }

  @computed get outOfStockList() {
    return toJS(this.props.store.outOfStockReason.outOfStockReasonList);
  }

  rowSelectDisabledByKey(keyObj) {
    const {dcCode, skuId} = keyObj;
    return dcCode && skuId && this.selectedRowKeys.indexOf(`${dcCode}-${skuId}`) >= 0;
  }

  @computed get columns() {
    return [{
      title: 'SKU编码',
      dataIndex: 'skuId',
      className: styles.colSKUID
    }, {
      title: 'SKU名称',
      dataIndex: 'skuName'
    }, {
      title: '配送中心',
      dataIndex: 'dcName'
    }, {
      title: '无货PV',
      dataIndex: 'noStockPv'
    }, {
      title: '无货PV占比',
      dataIndex: 'noStockPvRatio'
    }, {
      title: '现货库存',
      dataIndex: 'spotStockNum'
    }, {
      title: '内配在途',
      dataIndex: 'transitStockSum'
    }, {
      title: '采购在途',
      dataIndex: 'purchasePlanNum',
      render: (text, record) => (<a href="javascript:void(0);" onClick={()=>this.showModal(record)}>{text}</a>)
    }, {
      title: '缺货原因',
      dataIndex: 'oosReason',
      render: (text, record) => {
        text = text === null ? this.selectReasonIdDef : text;
        const onChange = (value) => this.onReasonChangeSingle({dcCode: record.dcCode, skuId: record.skuId}, value);
        return nj `<OutOfStockReasonSelect onChange={${onChange}} defValue={${this.selectReasonIdDef}} value={${text}} disabled={${this.rowSelectDisabledByKey({dcCode: record.dcCode, skuId: record.skuId})}} />` ();
      }
    }, {
      title: '备注',
      dataIndex: 'remark',
      render: (text, record) => {
        const onChange = (e) => {
          this.onRemarkChange({dcCode: record.dcCode, skuId: record.skuId}, e.target.value);
        };
        return nj `<ant-Input value=${text} onChange={${onChange}} />` ();
      }
    }];
  }

  @computed get purchasePlanListColumns() {
    return [{
      title: '配送中心',
      dataIndex: 'dcName'
    }, {
      title: '采购单号',
      dataIndex: 'poNo'
    }, {
      title: '商品数量',
      dataIndex: 'poQtty'
    }, {
      title: '创建时间',
      dataIndex: 'poCreatedDt'
    }, {
      title: '采购单状态',
      dataIndex: 'poStatus'
    }];
  }

  @computed get queryParams() {
    return getQueryParams(this);
  }

  @computed get page() {
    return this.props.store.outOfStockReason.outOfStockReasonCurrentPage;
  }

  @computed get total() {
    return this.props.store.outOfStockReason.outOfStockReasonListCount;
  }

  @computed get purchasePlanList() {
    return toJS(this.props.store.outOfStockReason.purchasePlanList);
  }

  @computed get selectBatchDisabled() {
    return !(this.selectedRowKeys instanceof Array) || this.selectedRowKeys.length <= 0;
  }

  render() {
    return tmpls.OutOfStockReasonTable(this.state, this.props, this, {
      styles,
      getTableRowKey: record => `${record.dcCode}-${record.skuId}`,
      rowSelection: {
        selectedRowKeys: this.selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
          //console.log(`${selectedRowKeys}, ${selectedRows}`);
          this.selectedRowKeys = selectedRowKeys;
          if(!this.selectBatchDisabled && this.reasonIdBatch !== this.selectReasonIdDef) {
            this.onReasonChangeBatch(this.reasonIdBatch);
          }
        }
      },
      formAction: `${__HOST}/outOfStockReason/export`
    });
  }
}