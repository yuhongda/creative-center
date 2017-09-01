import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { observable, computed, toJS, runInAction } from 'mobx'
import { observer, inject } from 'mobx-react';
import nj from 'nornj';
import { registerTmpl } from 'nornj-react';
import { autobind } from 'core-decorators';
import 'vic-common/lib/components/antd/table';
import 'vic-common/lib/components/antd/input';
import 'vic-common/lib/components/antd/button';
import 'vic-common/lib/components/antd/select';
import 'vic-common/lib/components/antd/cascader';
import Modal from 'vic-common/lib/components/antd/modal';
import 'vic-common/lib/components/antd/checkbox';
import 'vic-common/lib/components/antd/tree';
import { Form } from 'vic-common/lib/components/antd/form';
import { email } from 'flarej/lib/utils/regexp';
import Message from 'vic-common/lib/components/antd/message';
import styles from './privilegeManagement.m.scss';
import tmpls from './privilegeManagement.t.html';

// 页面容器组件
@registerTmpl('PrivilegeManagement')
@inject('store')
@observer
export default class PrivilegeManagement extends Component {
  componentDidMount() {
    const { store: { privilegeManagement } } = this.props;
    const closeLoading = Message.loading('正在获取数据...', 0);
    Promise.all([
      privilegeManagement.getUserData().then(() => Promise.all([
        privilegeManagement.getUserRoleData({ userId: privilegeManagement.checkedUserId }),
        privilegeManagement.getUserMenuTree({ userId: privilegeManagement.checkedUserId }),
        privilegeManagement.accountInfo.getAssociatedCategoryData({ userId: privilegeManagement.checkedUserId })
      ])),
      privilegeManagement.getRoleData(),
      privilegeManagement.conditions.getCategoryData().then(() => privilegeManagement.conditions.getBrandData()),
    ]).then(() => {
      closeLoading();
    });
  }

  render() {
    const { store: { privilegeManagement } } = this.props;
    return tmpls.privilegeManagement(this.props, this, {
      styles,
      privilegeManagement
    });
  }
}

@observer
class UserList extends Component {
  @observable modalTitle = '';
  @observable modalVisible = false;
  @autobind
  onModalCancel() {
    this.modalVisible = false;
  }

  @autobind
  onAdd() {
    runInAction(() => {
      this.modalTitle = '新增用户';
      this.modalVisible = true;
      this.props.form.resetFields();
    });
  }

  @autobind
  onEdit() {
    runInAction(() => {
      this.modalTitle = '编辑用户';
      this.modalVisible = true;

      const { store: { privilegeManagement } } = this.props;
      const userDataChecked = privilegeManagement.getUserDataChecked();
      this.props.form.setFieldsValue({
        loginName: userDataChecked.loginName,
        userName: userDataChecked.userName,
        email: userDataChecked.email,
        deptName: userDataChecked.deptName,
        post: userDataChecked.post
      });
    });
  }

  @autobind
  onDelete() {
    Modal.confirm({
      title: '确认删除？',
      onOk: () => {
        const { store: { privilegeManagement } } = this.props;
        const closeLoading = Message.loading('正在删除数据...', 0);

        privilegeManagement.deleteUser({
          userId: privilegeManagement.checkedUserId
        }).then(result => {
          closeLoading();
          if (result) {
            privilegeManagement.getUserData();
          }
        });
      }
    });
  }

  @autobind
  onCheckboxChange(e) {
    const { store: { privilegeManagement } } = this.props;
    privilegeManagement.setUserDataChecked(e.target.value);

    const closeLoading = Message.loading('正在获取数据...', 0);
    Promise.all([
      privilegeManagement.getUserRoleData({ userId: privilegeManagement.checkedUserId }),
      privilegeManagement.getUserMenuTree({ userId: privilegeManagement.checkedUserId }),
      privilegeManagement.accountInfo.getAssociatedCategoryData({ userId: privilegeManagement.checkedUserId })
    ]).then(() => {
      closeLoading();
    });
  }

  loginName(options) {
    return this.props.form.getFieldDecorator('loginName', {
      rules: [{ required: true, message: '京东账号不能为空！' }]
    })(options.result());
  }

  userName(options) {
    return this.props.form.getFieldDecorator('userName')(options.result());
  }

  email(options) {
    return this.props.form.getFieldDecorator('email', {
      rules: [{ required: true, pattern: email, message: '邮箱格式不正确！' }]
    })(options.result());
  }

  deptName(options) {
    return this.props.form.getFieldDecorator('deptName')(options.result());
  }

  post(options) {
    return this.props.form.getFieldDecorator('post')(options.result());
  }

  @autobind
  onSubmit(e) {
    e.preventDefault();

    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { store: { privilegeManagement } } = this.props;
        const closeLoading = Message.loading('正在保存数据...', 0);
        let userId = null;
        if (this.modalTitle == '编辑用户') {
          userId = privilegeManagement.checkedUserId;
        }

        privilegeManagement.saveUser({
          userId,
          loginName: values.loginName,
          userName: values.userName,
          email: values.email,
          deptName: values.deptName,
          post: values.post
        }).then(result => {
          closeLoading();
          if (result) {
            this.modalVisible = false;
            privilegeManagement.getUserData();
          }
        });
      }
    });
  }

  render() {
    const { store: { privilegeManagement } } = this.props;
    return tmpls.userList(this.props, this, {
      styles,
      privilegeManagement
    });
  }
}
nj.registerComponent('UserList', inject('store')(observer(Form.create()(UserList))));

@registerTmpl('RoleList')
@inject('store')
@observer
class RoleList extends Component {
  @autobind
  onRoleChange(value) {
    const { store: { privilegeManagement } } = this.props;
    privilegeManagement.setSelectedRoleId(value);
  }

  onRowDelete(text, record, index) {
    return e => {
      Modal.confirm({
        title: '确认删除？',
        onOk: () => {
          const { store: { privilegeManagement } } = this.props;
          const closeLoading = Message.loading('正在删除数据...', 0);

          privilegeManagement.delUserRole({
            userId: privilegeManagement.checkedUserId,
            roleId: privilegeManagement.selectedRoleId
          }).then(result => {
            closeLoading();
            if (result) {
              privilegeManagement.getUserRoleData({ userId: privilegeManagement.checkedUserId });
            }
          });
        }
      });
    };
  }

  @autobind
  onAdd() {
    const { store: { privilegeManagement } } = this.props;
    const closeLoading = Message.loading('正在提交数据...', 0);

    privilegeManagement.addUserRole({
      userId: privilegeManagement.checkedUserId,
      roleId: privilegeManagement.selectedRoleId
    }).then(result => {
      closeLoading();
      if (result) {
        privilegeManagement.getUserRoleData({ userId: privilegeManagement.checkedUserId });
        privilegeManagement.getUserMenuTree({ userId: privilegeManagement.checkedUserId });
      }
    });
  }

  loop(data) {
    return data.map((item) => {
      if (item.children) {
        return nj `<ant-TreeNode key=${item.key} title=${item.title}>
                     ${this.loop(item.children)}
                   </ant-TreeNode>` ();
      }
      return nj `<ant-TreeNode key=${item.key} title=${item.title} />` ();
    });
  }

  render() {
    const { store: { privilegeManagement } } = this.props;
    return tmpls.roleList(this.props, this, {
      styles,
      privilegeManagement
    });
  }
}

@registerTmpl('DataAuth')
@inject('store')
@observer
class DataAuth extends Component {
  @autobind
  onCategoryChange(value) {
    const { store: { privilegeManagement } } = this.props;
    privilegeManagement.conditions.setSelectedCategory(value);
    privilegeManagement.conditions.getBrandData({ categoryId: value });
  }

  @autobind
  onBrandChange(value) {
    const { store: { privilegeManagement } } = this.props;
    privilegeManagement.conditions.setSelectedBrand(value);
  }

  @autobind
  onAdd() {
    const { store: { privilegeManagement } } = this.props;
    const closeLoading = Message.loading('正在提交数据...', 0);
    const { selectedCategory, selectedBrand } = privilegeManagement.conditions;

    privilegeManagement.addUserBrand({
      userId: privilegeManagement.checkedUserId,
      categoryId1: selectedCategory && selectedCategory.length >= 1 ? selectedCategory[0] : null,
      categoryId2: selectedCategory && selectedCategory.length >= 2 ? selectedCategory[1] : null,
      categoryId3: selectedCategory && selectedCategory.length >= 3 ? selectedCategory[2] : null,
      brandId: selectedBrand != 0 ? selectedBrand : null
    }).then(result => {
      closeLoading();
      if (result) {
        privilegeManagement.accountInfo.getAssociatedCategoryData({ userId: privilegeManagement.checkedUserId })
      }
    });
  }

  onRowDelete(text, record, index) {
    return e => {
      Modal.confirm({
        title: '确认删除？',
        onOk: () => {
          const { store: { privilegeManagement } } = this.props;
          const closeLoading = Message.loading('正在删除数据...', 0);
          const params = text.split('_');

          privilegeManagement.deleteUserBrand({
            userId: privilegeManagement.checkedUserId,
            categoryId1: params.length >= 1 ? params[0] : null,
            categoryId2: params.length >= 2 ? params[1] : null,
            categoryId3: params.length >= 3 ? params[2] : null,
            brandId: params.length >= 4 ? params[3] : null,
          }).then(result => {
            closeLoading();
            if (result) {
              privilegeManagement.accountInfo.getAssociatedCategoryData({ userId: privilegeManagement.checkedUserId })
            }
          });
        }
      });
    };
  }

  render() {
    const { store: { privilegeManagement } } = this.props;
    return tmpls.dataAuth(this.props, this, {
      styles,
      privilegeManagement,
      conditions: privilegeManagement.conditions
    });
  }
}