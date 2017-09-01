import * as React from 'react'
import { Component, PropTypes } from 'react';
import { Link } from 'react-router-dom';
import { toJS, transaction } from 'mobx';
import { observer, inject } from 'mobx-react';
import { registerComponent } from 'nornj';
import { registerTmpl } from 'nornj-react';
import { autobind } from 'core-decorators';
import './sider.scss';
import tmpls from './sider.t.html';
import { slide as Menu } from 'react-burger-menu'

registerComponent({ 'burger-Menu': Menu });

@inject('store')
@observer
export default class Sider extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.store.sider.setMenu(true);
    this.props.store.sider.getCurrentUserMenuTree().then(() => this.getCurrentMenuName());
  }

  getCurrentMenuName() {
    let href = window.location.href;
    href = href.substring(href.lastIndexOf("\/") + 1, href.length);

    //初始化一级菜单
    if (href.trim() !== '') {
      this.props.store.header.setCurrent(this.props.store.sider.mapLevel3['/' + href.toLowerCase()].topMenuIndex);
    }

    const menu = this.props.store.sider.currentMenuData;
    const children = menu.map(function(item) {
      return item.children
    })
    const nameArray = children.map(function(item) {
      return item.map(function(item) {
        return item.index
      })
    })
    let index = 0;
    for (let i = 0; i < nameArray.length; i++) {
      for (let j = 0; j < nameArray[i].length; j++) {
        if (nameArray[i][j].toLowerCase() == href.toLowerCase()) {
          index = i;
          break;
        }
      }
      if (index !== 0) {
        break;
      }
    }
    // console.log('index',index, menu[index].index);
    if (href.trim() === '') {
      this.props.store.sider.setCurrent(menu[0].children[0].index);
      this.props.store.sider.setMenuDataByIndex(true, menu[0].index);
    } else {
      this.props.store.sider.setCurrent(href);
      this.props.store.sider.setMenuDataByIndex(true, menu[index].index);
    }

  }

  @autobind
  selectMenu(event) {
    this.props.store.sider.setCurrent(`${event.currentTarget.getAttribute('data-index')}`)
      //   this.props.store.sider.setMenu(false)
  }

  @autobind
  toggleMenu(item) {
    return e => {
      this.props.store.sider.setMenuDataByIndex(!item.expanded, item.index)
    };
  }

  @autobind
  isMenuOpen(state) {
    this.props.store.sider.setMenu(state.isOpen)
  }

  render() {
    const generateMenu = items => {
      return items.map(item => {
        return tmpls.menuCnt(this.props, this, { item, generateMenu });
      });
    }

    const menuCnt = generateMenu(this.props.store.sider.currentMenuData)
    return tmpls.menu(this.props, this, { menuCnt });
  }
}