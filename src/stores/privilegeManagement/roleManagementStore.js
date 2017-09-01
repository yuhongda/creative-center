import {types} from "mobx-state-tree";
import {fetchData} from 'vic-common/lib/common/fetchConfig';
import Notification from '../../utils/notification';

const RoleManagementStore = types.model("RoleManagementStore", {
  isDisable: types.optional(types.boolean, true),
  activeKey: types.optional(types.string, 'key1'),
}, {
  tableData: null,
  searchData: null,
  addRoleData: null,
  treeData: null,
  addRoleId: null,
}, {
  setTableData(value) {
    this.tableData = value;
  },
  setDisable(value) {
    this.isDisable = value;
  },
  setActiveKey(value) {
    this.activeKey = value;
  },
  getRoleManagementData(params) {
    return fetchData(`${__HOST}/roleManagement/getRoleManagementData`,
      this.setRoleManagementData,
      params,
      {method: 'get'}).catch((ex) => {
      Notification.error({
        description: '获取角色管理数据异常:' + ex,
        duration: null
      });
    });
  },
  setRoleManagementData(result) {
    if (result.success) {
      const data = result.data;
      this.tableData = data.length > 0 ? data : [];
    } else {
      Notification.error({
        description: '获取角色管理度数据异常:' + result.message,
        duration: null
      });
    }
  },

  searchRole(params) {
    return fetchData(`${__HOST}/roleManagement/searchRole`,
      this.setSearchRole,
      params,
      {method: 'get'}).catch((ex) => {
      Notification.error({
        description: '获取角色数据异常:' + ex,
        duration: null
      });
    });
  },
  setSearchRole(result) {
    if (result.success) {
      const data = result.data;
      this.searchData = data;
    } else {
      Notification.error({
        description: '获取角色数据异常:' + result.message,
        duration: null
      });
    }
  },

  saveRole(params) {
    return fetchData(`${__HOST}/roleManagement/saveRole`,
      this.setSaveRole,
      params,
      {method: 'post'}).catch((ex) => {
      Notification.error({
        description: '添加角色数据异常:' + ex,
        duration: null
      });
    });
  },
  setSaveRole(result) {
    if (result.success) {
      const data = result.data;
      this.addRoleId = data.roleId;
      Notification.success({ description: '添加角色成功！', duration: 2 });
      this.setDisable(false);

    } else {
      Notification.error({
        description: '添加角色数据异常:' + result.message,
        duration: null
      });
    }
  },

  saveRolePermission(params) {
    return fetchData(`${__HOST}/roleManagement/saveRolePermission`,
      this.setSaveRolePermission,
      params,
      {method: 'post'}).catch((ex) => {
      Notification.error({
        description: '添加角色权限数据异常:' + ex,
        duration: null
      });
    });
  },
  setSaveRolePermission(result) {
    if (result.success) {
      Notification.success({ description: '添加角色权限成功！', duration: 2 });
    } else {
      Notification.error({description: '添加角色权限数据异常:' + result.message, duration: null
      });
    }
  },

  deleteRole(params) {
    return fetchData(`${__HOST}/roleManagement/deleteRole`,
      this.setDeleteRole,
      params,
      {method: 'post'}).catch((ex) => {
      Notification.error({
        description: '删除角色数据异常:' + ex,
        duration: null
      });
    });
  },

  setDeleteRole(result) {
    if (result.success) {
       Notification.success({ description: '删除角色成功！', duration: null });
    } else {
      Notification.error({description: '删除角色数据异常:' + result.message, duration: null });
    }
  },

  getTreeData(params) {
    return fetchData(`${__HOST}/roleManagement/getRoleMenuTree`,
      this.setTreeData,
      params,
      {method: 'get'}).catch((ex) => {
      Notification.error({
        description: '获取权限列表数据异常:' + ex,
        duration: null
      });
    });
  },
  setTreeData(result) {
    if (result.success) {
      const data = result.data;
      this.treeData = data;
    } else {
      Notification.error({
        description: '获取权限列表数据异常:' + result.message,
        duration: null
      });
    }
  },

});

export default RoleManagementStore;
