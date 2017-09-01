import {types} from "mobx-state-tree";
import {fetchData} from 'vic-common/lib/common/fetchConfig';
import Notification from '../../utils/notification';

const AccountInfoStore = types.model("AccountInfoStore", {
  expandedKeys: types.optional(types.array(types.string), []),
  checkedKeys: types.optional(types.array(types.string), []),
}, {
  personalData: null,
  categoryData: null,
  accountData: null,
  authTreeData: null,
  menuData: null,
  menuIds: null,
}, {
  afterCreate() {
    this.authTreeDataMap = null;
  },
  setMenuIds(checkeds) {
    this.menuIds = checkeds.join();
  },
  getAuthTreeDataMap(authList) {
    const authTreeDataMap = {};
    authList.forEach(node => {
      authTreeDataMap[node.id] = node;
    });

    return authTreeDataMap;
  },

  setExpandedKeys(value) {
    this.expandedKeys = value;
  },

  setCheckedKeys(value) {
     this.checkedKeys = value;
  },

  getAuthTreeData(authList, authMap, level = 1, node, pids = []) {
    if(level == 4) {
      return null;
    }

    return authList
      .filter(n => n.level == level && (!node ? true : n.pid == node.id.toString()))
      .map(n => {
        authMap[n.id].pids = pids;

        return {
          key: n.id.toString(),
          title: n.name,
          children: this.getAuthTreeData(authList, authMap, level + 1, n, [...pids, n.id.toString()])
        };
      });
  },

  getRoleMenuTree(params) {
    return fetchData(`${__HOST}/accountInfo/getRoleMenuTree`,
      this.setRoleMenuTree,
      params,
      {method: 'get'}).catch((ex) => {
      Notification.error({
        description: '获取角色权限数据异常:' + ex,
        duration: null
      });
    });
  },
  setRoleMenuTree(result) {
    if (result.success) {
      this.menuData = result.data;
      this.authTreeDataMap = this.getAuthTreeDataMap(result.data);
      this.authTreeData = this.getAuthTreeData(result.data, this.authTreeDataMap);
    } else {
      Notification.error({
        description: '获取角色权限数据错误:' + result.message,
        duration: null
      });
    }
  },

  deleteAccount(params) {
    return fetchData(`${__HOST}/accountInfo/deleteAccount`,
      this.setDeleteAccount,
      params,
      {method: 'post'}).catch((ex) => {
      Notification.error({
        description: '删除关联账号数据异常:' + ex,
        duration: null
      });
    });
  },
  setDeleteAccount(result) {
    if (result.success) {
      const data = result.data;
    } else {
      Notification.error({
        description: '删除关联账号失败' + result.message,
        duration: null
      });
    }
  },
  getPersonalInfoData(params) {
    return fetchData(`${__HOST}/accountInfo/getPersonalInfoData`,
      this.setPersonalInfoData,
      params,
      {method: 'get'}).catch((ex) => {
      Notification.error({
        description: '获取个人信息数据异常:' + ex,
        duration: null
      });
    });
  },
  setPersonalInfoData(result) {
    if (result.success) {
      const data = result.data;
      this.personalData = data;
    } else {
      Notification.error({
        description: '获取个人信息数据异常:' + result.message,
        duration: null
      });
    }
  },

  getAssociatedCategoryData(params) {
    return fetchData(`${__HOST}/accountInfo/getAssociatedCategoryData`,
      this.setAssociatedCategoryData,
      params,
      {method: 'get'}).catch((ex) => {
      Notification.error({
        description: '获取关联品类品牌数据异常:' + ex,
        duration: null
      });
    });
  },
  setAssociatedCategoryData(result) {
    if (result.success) {
      const data = result.data;
      this.categoryData = data.length > 0 ? data : [];
    } else {
      Notification.error({
        description: '获取关联品类品牌数据异常:' + result.message,
        duration: null
      });
    }
  },

  getAssociatedAccountData(params) {
    return fetchData(`${__HOST}/accountInfo/getAssociatedAccountData`,
      this.setAssociatedAccountData,
      params,
      {method: 'get'}).catch((ex) => {
      Notification.error({
        description: '获取关联账号数据异常:' + ex,
        duration: null
      });
    });
  },
  setAssociatedAccountData(result) {
    if (result.success) {
      const data = result.data;
      this.accountData = data.length > 0 ? data : [];
    } else {
      Notification.error({
        description: '获取关联账号数据异常:' + result.message,
        duration: null
      });
    }
  },

});

export default AccountInfoStore;
