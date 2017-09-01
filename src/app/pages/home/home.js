/**
 * Created by gaojian3 on 2017/7/7.
 */
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { autobind } from 'core-decorators';
import nj from 'nornj';
import { registerTmpl } from 'nornj-react';
import styles from './home.m.scss';
import tmpls from './home.t.html';
import Card from 'vic-common/lib/components/antd-mobile/card';
import WingBlank from 'vic-common/lib/components/antd-mobile/wingBlank';
import WhiteSpace from 'vic-common/lib/components/antd-mobile/whiteSpace';
import Flex from 'vic-common/lib/components/antd-mobile/flex';
import { FuncIcon } from '../../components/funcIcon';
import { FUNCS } from '../../../../routes-app';

const imgHomeMain = require('../../images/home-main.png');

@registerTmpl('Home')
@inject('store')
@observer
export default class Home extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.store.header.setPageTitle(this.props.moduleName);
  }

  render() {
    return tmpls.Home(this.state, this.props, this, {
      styles,
      FUNCS,
      imgHomeMain
    });
  }
}