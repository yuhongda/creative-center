import React, {Component} from 'react';
import { findDOMNode } from 'react-dom';
import {observable, computed, toJS, runInAction} from 'mobx'
import {observer, inject} from 'mobx-react';
import nj from 'nornj';
import {registerTmpl} from 'nornj-react';
import {autobind} from 'core-decorators';

import 'vic-common/lib/components/antd/table';
import 'vic-common/lib/components/antd/input';
import 'vic-common/lib/components/antd/button';
import 'vic-common/lib/components/antd/pagination';
import 'vic-common/lib/components/antd/tabs';
import 'vic-common/lib/components/antd/tree';
import 'vic-common/lib/components/antd/checkbox';
import Modal from 'vic-common/lib/components/antd/modal';

import Tree from 'vic-common/lib/components/antd/tree';
import Input from 'vic-common/lib/components/antd/input';
import Message from 'vic-common/lib/components/antd/message';
import Notification from '../../../utils/notification';
import styles from './roleManagement.m.scss';
import tmpls from './roleManagement.t.html';
import moment from 'moment';

// 页面容器组件
@inject('store')
@observer
@registerTmpl('RoleManagement')
export default class RoleManagement extends Component {

  @observable addModalVisible = false;
  @observable detailModalVisible = false;
  @observable tabName = "增加角色";
  @observable inputRole = '';
  @observable addInputRole = '';
  @observable addInputDes = '';
  @observable detailData = [];
  @observable roleId = '';
  @observable selectedRowKeys = [];
  @observable selectedRows =[];


  constructor(props) {
    super(props);
  }

  state = {
    expandedKeys: [],
    autoExpandParent: false,
    checkedKeys: [],
  }

  @autobind
  onExpand(expandedKeys) {
    // console.log('onExpand', arguments);
    this.setState({
      expandedKeys,
      autoExpandParent: true,
    });
  }

  @autobind
  onCheck(checkedKeys) {
    // console.log('checkedKeys',arguments);
    // console.log('checkedKeys',checkedKeys);
    this.setState({
      checkedKeys,
    });

    if(checkedKeys.length==0) {
      this.props.store.accountInfo.setMenuIds([]);
    } else {
      let allChecked = Array.from(new Set(this.getAllCheckedKeys(checkedKeys).concat(checkedKeys)));
      this.props.store.accountInfo.setMenuIds(allChecked);
      console.log('allChecked', allChecked);
    }
  }

  getDefaultCheckedKeys() {
    let keys = [];
    this.props.store.accountInfo.menuData.filter(n => n.level == 3)
        .forEach(item => {
        if(item.selected) {
          keys.push(item.id.toString());
        }
    })
    return keys;
  }

  // 获取树节点的展开形式
  getExpandedKeys(arr) {
    return arr.filter(n => n.level == 1 || n.level == 2).map(m => {return m.id.toString()});
  }

  // 获取选中的 checkbox 包含父级未选中状态
  getAllCheckedKeys(key) {
    const _map = toJS(this.props.store.accountInfo.authTreeDataMap);
    if(key.length > 1) {
       let pids = key.map(item => {return _map[item].pids})
       return Array.from(new Set([].concat(...pids)));
    } else {
       return _map[key].pids;
    }
  }

  initTree() {
    this.setState({
       expandedKeys: this.getExpandedKeys(toJS(this.props.store.accountInfo.menuData)),
       checkedKeys: this.getDefaultCheckedKeys()
    })
  }

  @autobind
  onSaveAddPermission() {
    this.props.store.roleManagement.saveRolePermission({
       roleId: this.props.store.roleManagement.addRoleId,
       menuIds: this.props.store.accountInfo.menuIds
    })
  }

  @autobind
  onSaveEidtPermission() {
    this.props.store.roleManagement.saveRolePermission({
       roleId: this.roleId,
       menuIds: this.props.store.accountInfo.menuIds
    })
  }

  @autobind
  onChangeCheckbox() {
    console.log('onChangeCheckbox');
  }

  componentDidMount() {
      const closeLoading = Message.loading('正在获取数据...', 0);
      Promise.all([
          this.props.store.roleManagement.getRoleManagementData(),
          this.props.store.accountInfo.getRoleMenuTree().then(() => this.initTree()),
      ]).then(() => {
        closeLoading()
      });
  }

  @autobind
  onAddModalCancel() {
    this.addModalVisible = false;
  }

  @autobind
  onInputRole(e) {
     this.inputRole = e.target.value;
  }

  @autobind
  onSearch() {
    if(this.inputRole == '') {
       const closeLoading = Message.loading('正在获取数据...', 0);
       Promise.all([
           this.props.store.roleManagement.getRoleManagementData(),
       ]).then(() => {
         closeLoading()
       });
    } else {
      const { store: { roleManagement } } = this.props;
      // const closeLoading = Message.loading('正在获取数据...', 0);
      // Promise.all([
      //    roleManagement.searchRole({roleName: this.inputRole})
      // ]).then(()=>{
      //    roleManagement.setTableData(roleManagement.searchData)
      // }).then(() => {
      //   closeLoading()
      // });
     const searchRole = roleManagement.tableData.filter(n => n.name == this.inputRole)
     roleManagement.setTableData(searchRole);
    }
  }

  @autobind
  onAddInputRoleChange(e) {
    this.addInputRole = e.target.value;
  }

  @autobind
  onAddInputDesChange(e) {
    this.addInputDes = e.target.value;
  }

  @autobind
  onAddCancel() {
    this.addModalVisible = false;
  }

  @autobind
  onAddSaveRole() {
    if(this.addInputRole == '') {
      Notification.error({ description: '请输入角色名称！', duration: 1 });
    } else {
      const { store: { roleManagement } } = this.props;
      const closeLoading = Message.loading('正在获取数据...', 0);
      let params = {
        roleName: this.addInputRole,
        roleDescribe: this.addInputDes
      }
      if(roleManagement.addRoleId != null) {
        params.roleId = roleManagement.addRoleId;
      }
      Promise.all([
         roleManagement.saveRole(params)
      ]).then(()=>{
         roleManagement.getRoleManagementData();
      }).then(() => {
        closeLoading()
      });
    }
  }

  @autobind
  onAddRole() {
    this.addModalVisible = true;
    this.tabName = "增加角色";
    this.addInputRole = '';
    this.addInputDes = '';``
    this.setState({checkedKeys: []});
    this.props.store.roleManagement.setDisable(true);
  }

  @autobind
  onDeleteRole() {
    const { store: { roleManagement } } = this.props;
    if(this.selectedRows.length==0) {
      Notification.error({ description: '请勾选要删除的角色！', duration: 3 });
    } else {
      Modal.confirm({
        title: '你确认要删除角色吗？',
        onOk: () => {
           const closeLoading = Message.loading('正在获取数据...', 0);
           const roleId = this.selectedRows.map((item)=> item.roleId);
           // console.log('roleId',roleId);
           Promise.all([
              roleManagement.deleteRole({roleId:roleId})
           ]).then(()=>{
              roleManagement.getRoleManagementData();
           }).then(() => {
             closeLoading();
           });
        }
      });
    }
  }

  @autobind
  onExport() {
    console.log('onExport')
  }

  @computed get tableColumns() {
     return [{
         title: '序号',
         dataIndex: 'key',
     }, {
         title: '角色名称',
         dataIndex: 'name',
     }, {
         title: '角色描述',
         dataIndex: 'describe',
     }, {
         title: '创建时间',
         dataIndex: 'cTime',
     }, {
         title: '修改时间',
         dataIndex: 'mTime',
     }, {
       title: '操作',
       dataIndex: 'handler',
       render: (text, record, index) => (
          <span>
            <a href="javascript:;" onClick={()=>this.onEdit(record, index)} className="btn-link">编辑</a>
            <a href="javascript:;" onClick={()=>this.onDetail(record, index)} className="btn-link">用户细则</a>
          </span>
        ),
     }];
  }

  @autobind
  onEdit(record, index) {
    //  console.log('checkedKeys',this.getDefaultCheckedKeys());
    //  console.log('menuData',toJS(this.props.store.accountInfo.menuData));
    //  console.log('authTreeData', toJS(this.props.store.accountInfo.authTreeData));
    //  console.log('authTreeDataMap', toJS(this.props.store.accountInfo.authTreeDataMap));
     this.tabName = "编辑角色"
     this.addModalVisible = true;
     this.addInputRole = record.name;
     this.addInputDes = record.describe;
     this.roleId = record.roleId;
     this.props.store.roleManagement.setDisable(false);
     console.log('onEdit', record, index);
     const closeLoading = Message.loading('正在获取数据...', 0);
     Promise.all([
         this.props.store.accountInfo.getRoleMenuTree({roleId: record.roleId}).then(() => this.initTree()),
     ]).then(() => {
       closeLoading()
     });
  }

  @autobind
  onDetail(record, index) {
    //  console.log('onDetail', record, index);
     this.detailModalVisible = true;
     this.detailData = [];
     this.detailData = record.users;
  }

  @autobind
  onDetailModalCancel() {
    this.detailModalVisible = false;
  }

  @computed get detailColumns() {
     return [{
         title: '序号',
         dataIndex: 'key',
     }, {
         title: '登录名',
         dataIndex: 'loginName',
     }, {
         title: '姓名',
         dataIndex: 'name',
     }, {
         title: '邮箱',
         dataIndex: 'email',
     },  {
         title: '部门',
         dataIndex: 'department',
     },  {
         title: '职务',
         dataIndex: 'role',
     }, {
         title: '开通时间',
         dataIndex: 'oTime',
     }, {
         title: '修改时间',
         dataIndex: 'mTime',
     }];
  }

  getRowSelection() {
    return {
       onChange: (selectedRowKeys, selectedRows) => {
         this.selectedRows = selectedRows;
        //  console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
       }
    }
  }

  render() {
    const TreeNode = Tree.TreeNode;
    const loop = data => data.map((item) => {
      if (item.children) {
        return (
          <TreeNode key={item.key} title={item.title}>
            {loop(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} title={item.title} />;
    });

    const { store: { roleManagement, accountInfo } } = this.props;
    return tmpls.roleManagement(this.state, this.props, this, {
      styles,
      roleManagement,
      accountInfo,
      loop,
      treeData: toJS(accountInfo.authTreeData) || [],
      getDetailRowKey: (record, index) => `${record.key}-${index}`,
      tableData: toJS(roleManagement.tableData),
      detailData: this.detailData,
      rowSelection: this.getRowSelection(),
    });
  }
}
