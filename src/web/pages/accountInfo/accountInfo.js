import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { observable, computed, toJS } from 'mobx'
import { observer, inject } from 'mobx-react';
import nj from 'nornj';
import { registerTmpl } from 'nornj-react';
import { autobind } from 'core-decorators';

import 'vic-common/lib/components/antd/table';
import 'vic-common/lib/components/antd/pagination';
import Modal from 'vic-common/lib/components/antd/modal';

import Message from 'vic-common/lib/components/antd/message';
import Notification from '../../../utils/notification';
import styles from './accountInfo.m.scss';
import tmpls from './accountInfo.t.html';

// 页面容器组件
// ----------------------------------------------------------
@inject('store')
@observer
@registerTmpl('AccountInfo')
export default class AccountInfo extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { store: { accountInfo } } = this.props;
    const closeLoading = Message.loading('正在获取数据...', 0);
    Promise.all([
        accountInfo.getPersonalInfoData(),
        accountInfo.getAssociatedCategoryData(),
        accountInfo.getAssociatedAccountData()
    ]).then(() => {
      closeLoading()
    });
  }

  render() {
    return tmpls.accountInfo(this.state, this.props, this, {styles});
  }
}

// 01 个人信息组件
// ----------------------------------------------------------
@registerTmpl('personalInfo')
@inject('store')
@observer
class PersonalInfo extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  render() {
    const { store: { accountInfo } } = this.props;
    return tmpls.personalInfo(this.state, this.props, this, {
      styles,
      accountInfo
    });
  }
}

// 02 关联品类品牌组件
// ----------------------------------------------------------

@registerTmpl('AssociatedCategory')
@inject('store')
@observer
class AssociatedCategory extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  @computed get categoryColumns() {
    return  [{
      title: '',
      dataIndex: '',
      key: 'treeName',
      width: '10%'
    }, {
      title: '一级品类',
      dataIndex: 'oneBrand',
      key: 'oneBrand',
      width: '21%'
    },{
      title: '二级品类',
      dataIndex: 'twoBrand',
      key: 'twoBrand',
      width: '22%'
    },{
      title: '三级品类',
      dataIndex: 'threeBrand',
      key: 'threeBrand',
      width: '22%'
    },{
      title: '品牌',
      dataIndex: 'brand',
      key: 'brand',
      width: '25%'
    }];
  }

  render() {
    const { store: { accountInfo } } = this.props;
    return tmpls.associatedCategory(this.state, this.props, this, {
      styles,
      categoryData: toJS(accountInfo.categoryData),
      // categoryRowKey: (record, index) => `${record.name}-${index}`,
    });
  }
}

// 03 关联账号组件
// ----------------------------------------------------------
@registerTmpl('AssociatedAccount')
@inject('store')
@observer
class AssociatedAccount extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  @computed get accountColumns() {
    return [{
        title: '序号',
        dataIndex: 'key',
        width: 100,
    }, {
        title: '登录名',
        dataIndex: 'loginName',
        width: 120,
    }, {
        title: '姓名',
        dataIndex: 'name',
        width: 100,
    }, {
        title: '邮箱',
        dataIndex: 'email',
        width: 150,
    }, {
        title: '部门',
        dataIndex: 'department',
        width: 120,
    }, {
        title: '职务',
        dataIndex: 'duty',
        width: 120,
    },{
        title: '角色',
        dataIndex: 'role',
        width: 120,
    },{
        title: '开通时间',
        dataIndex: 'openTime',
        width: 120,
    },{
        title: '修改时间',
        dataIndex: 'modifyTime',
        width: 120,
    },{
      title: '操作',
      dataIndex: 'handler',
      width: 100,
      render: (text, record, index) => {
        return {
          children: nj`
          <a key="1" href="javascript:;" onClick=${()=>this.goToPrivilege()} class="btn-link">详情</a>
          <a key="2" href="javascript:;" onClick=${()=>this.deleteAccount(record, index)} class="btn-link">删除</a>
          `()
        };
      }
      // render: (text, record, index) => (
      //     <span>
      //       <a href="javascript:;" className="btn-link">详情</a>
      //       <a href="javascript:;" onClick={()=>this.deleteAccount(record, index)} className="btn-link">删除</a>
      //     </span>
      // ),
    }];
  }

  @autobind
  goToPrivilege() {
    let href = window.location.href;
    href = href.substring(0, href.lastIndexOf("\/") + 1);
    window.location = href + 'PrivilegeManagement';
  }

  @autobind
  deleteAccount(record, index) {
    Modal.confirm({
      title: '你确认要删除账号吗？',
      onOk: () => {
      const { store: { accountInfo } } = this.props;
         const closeLoading = Message.loading('正在获取数据...', 0);
         Promise.all([
            accountInfo.deleteAccount({userId:record.userId}),
         ]).then(()=>{
            accountInfo.getAssociatedAccountData();
         }).then(() => {
           closeLoading()
         });
      }
    });
  }

  render() {
    const { store: { accountInfo } } = this.props;
    return tmpls.associatedAccount(this.state, this.props, this, {
      styles,
      accountInfo,
      accountData: toJS(accountInfo.accountData),
      scrollNum: { x:true, y: 350 },
    });
  }
}
