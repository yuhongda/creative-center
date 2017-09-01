import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import { registerTmpl } from 'nornj-react';
import { autobind } from 'core-decorators';
import { Link } from 'react-router-dom';
// import 'vic-common/lib/components/antd/menu';
import styles from './header.m.scss';
import template from './header.t.html';
import NavBar from 'vic-common/lib/components/antd-mobile/navBar';
import Icon from 'vic-common/lib/components/antd-mobile/icon';

@inject('store')
@registerTmpl('vicb-Header')
@observer
export default class Header extends Component {
  static defaultProps = {
    current: 1
  };

  @autobind
  navChanged(event){
    this.props.store.header.setCurrent(parseInt(event.currentTarget.getAttribute('data-index'),10))
    this.props.history.push(`/page${this.props.store.header.current}`);
  }

  @autobind
  onBack() {
    this.props.history.goBack();
  }

  render() {
    return template(this.props, this, {
      styles
    });
  }
}