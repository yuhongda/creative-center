import { types, getParent } from "mobx-state-tree";
import { fetchData } from 'vic-common/lib/common/fetchConfig';
import Notification from '../../utils/notification';
import { toJS } from 'mobx';
import nj from 'nornj';
import ConditionStore from "../conditionStore";
import AccountInfoStore from "./accountInfoStore";
import { guid } from 'flarej/lib/utils/common';

export const UserInfo = types.model("UserInfo", {
  userId: types.optional(types.number, 0),
  loginName: types.optional(types.string, ''),
  userName: types.optional(types.string, ''),
  email: types.optional(types.string, ''),
  deptName: types.optional(types.string, ''),
  post: types.optional(types.string, ''),
  checked: types.optional(types.boolean, false)
});

const PrivilegeManagementStore = types.model("PrivilegeManagementStore", {
  get root() {
    return getParent(this);
  },
  userData: types.optional(types.array(UserInfo), []),
  checkedUserId: types.optional(types.number, 0),
  get selectedRole() {
    if (!this.roleData.length) {
      return null;
    }

    const ret = this.roleData.filter(role => role.roleId == this.selectedRoleId);
    return ret.length ? ret[0] : null;
  },
  conditions: types.optional(ConditionStore, {}),
  accountInfo: types.optional(AccountInfoStore, {}),
}, {
  roleData: null,
  selectedRoleId: null,
  userRoleData: null,
  authTreeData: null,
  authTreeKey: null
}, {
  afterCreate() {
    this.roleData = [];
    this.selectedRoleId = 0;
    this.userRoleData = [];
    this.authTreeData = [];
    this.authTreeDataMap = null;
  },

  getUserData() {
    return fetchData(`${__HOST}/privilegeManagement/getUserData`, this.setUserData, null, { method: 'post' }).catch((ex) => {
      Notification.error({ description: '获取用户信息异常:' + ex, duration: null });
    });
  },
  setUserData(result) {
    if (result.success) {
      this.userData = result.data;
      if (this.userData && this.userData.length) {
        let checkedItem = null;
        this.userData.every(item => {
          if (item.userId == this.checkedUserId) {
            checkedItem = item;
            return false;
          }
          return true;
        });

        if (checkedItem) {
          checkedItem.checked = true;
        } else {
          this.userData[0].checked = true;
          this.checkedUserId = this.userData[0].userId;
        }
      }
    } else {
      Notification.error({ description: '获取用户信息错误:' + result.message, duration: null });
    }
  },
  setUserDataChecked(v) {
    this.userData.forEach(item => {
      item.checked = item.userId === v;
    });
    this.checkedUserId = v;
  },
  getUserDataChecked() {
    let userInfoChecked = {};
    this.userData.every(item => {
      if (item.checked) {
        userInfoChecked = item;
        return false;
      }
      return true;
    });

    return userInfoChecked;
  },

  saveUser(params) {
    return fetchData(`${__HOST}/privilegeManagement/saveUser`, result => {
      if (result.success) {
        return true;
      } else {
        Notification.error({ description: '保存用户信息错误:' + result.message, duration: null });
        return false;
      }
    }, params, { method: 'post' }).catch((ex) => {
      Notification.error({ description: '保存用户信息异常:' + ex, duration: null });
    });
  },

  deleteUser(params) {
    return fetchData(`${__HOST}/privilegeManagement/deleteUser`, result => {
      if (result.success) {
        return true;
      } else {
        Notification.error({ description: '删除用户信息错误:' + result.message, duration: null });
        return false;
      }
    }, params, { method: 'post' }).catch((ex) => {
      Notification.error({ description: '删除用户信息异常:' + ex, duration: null });
    });
  },

  getRoleData() {
    return fetchData(`${__HOST}/privilegeManagement/getRoleData`, this.setRoleData, null, { method: 'post' }).catch((ex) => {
      Notification.error({ description: '获取角色信息异常:' + ex, duration: null });
    });
  },
  setRoleData(result) {
    if (result.success) {
      this.roleData = result.data;
      if (result.data && result.data[0]) {
        this.selectedRoleId = result.data[0].roleId;
      }
    } else {
      Notification.error({ description: '获取角色信息错误:' + result.message, duration: null });
    }
  },
  setSelectedRoleId(v) {
    this.selectedRoleId = v;
  },

  getUserRoleData(params) {
    return fetchData(`${__HOST}/privilegeManagement/getUserRoleData`, this.setUserRoleData, params, { method: 'post' }).catch((ex) => {
      Notification.error({ description: '获取用户角色信息异常:' + ex, duration: null });
    });
  },
  setUserRoleData(result) {
    if (result.success) {
      this.userRoleData = result.data;
    } else {
      Notification.error({ description: '获取用户角色信息错误:' + result.message, duration: null });
    }
  },

  addUserRole(params) {
    return fetchData(`${__HOST}/privilegeManagement/addUserRole`, result => {
      if (result.success) {
        return true;
      } else {
        Notification.error({ description: '添加用户角色错误:' + result.message, duration: null });
        return false;
      }
    }, params, { method: 'post' }).catch((ex) => {
      Notification.error({ description: '添加用户角色异常:' + ex, duration: null });
    });
  },

  delUserRole(params) {
    return fetchData(`${__HOST}/privilegeManagement/delUserRole`, result => {
      if (result.success) {
        return true;
      } else {
        Notification.error({ description: '删除用户角色错误:' + result.message, duration: null });
        return false;
      }
    }, params, { method: 'post' }).catch((ex) => {
      Notification.error({ description: '删除用户角色异常:' + ex, duration: null });
    });
  },

  addUserBrand(params) {
    return fetchData(`${__HOST}/privilegeManagement/addUserBrand`, result => {
      if (result.success) {
        return true;
      } else {
        Notification.error({ description: '添加用户品类品牌权限错误:' + result.message, duration: null });
        return false;
      }
    }, params, { method: 'post' }).catch((ex) => {
      Notification.error({ description: '添加用户品类品牌权限异常:' + ex, duration: null });
    });
  },

  deleteUserBrand(params) {
    return fetchData(`${__HOST}/privilegeManagement/deleteUserBrand`, result => {
      if (result.success) {
        return true;
      } else {
        Notification.error({ description: '删除用户品类品牌权限错误:' + result.message, duration: null });
        return false;
      }
    }, params, { method: 'post' }).catch((ex) => {
      Notification.error({ description: '删除用户品类品牌权限异常:' + ex, duration: null });
    });
  },

  getUserMenuTree(params) {
    return fetchData(`${__HOST}/privilegeManagement/getUserMenuTree`,
      this.setUserMenuTree,
      params, { method: 'get' }).catch((ex) => {
      Notification.error({
        description: '获取用户权限数据异常:' + ex,
        duration: null
      });
    });
  },
  setUserMenuTree(result) {
    if (result.success) {
      this.authTreeDataMap = this.root.accountInfo.getAuthTreeDataMap(result.data);
      this.authTreeData = this.root.accountInfo.getAuthTreeData(result.data, this.authTreeDataMap);
      this.authTreeKey = guid();
    } else {
      Notification.error({
        description: '获取用户权限数据错误:' + result.message,
        duration: null
      });
    }
  },
});

export default PrivilegeManagementStore;