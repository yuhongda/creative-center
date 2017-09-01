import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { observer, inject } from 'mobx-react';
import { autobind } from 'core-decorators';
import nj from 'nornj';
import { registerTmpl } from 'nornj-react';
import Input from 'vic-common/lib/components/antd-mobile/inputItem';
import Button from 'vic-common/lib/components/antd-mobile/button';
import WhiteSpace from 'vic-common/lib/components/antd-mobile/whiteSpace';
import Toast from 'vic-common/lib/components/antd-mobile/toast';
import styles from './index.m.scss';
import tmpls from './index.t.html';

@registerTmpl('Index')
// @inject('store')
@observer
export default class Index extends Component {
  constructor(props) {
    super(props);

    this.state = {
      code: ''
    };
  }

  @autobind
  onCodeChange(val) {
    this.setState({
      code: val
    });
  }
  
  @autobind
  login(){
    //window.location.href = '//passport.jd.com/new/login.aspx?ReturnUrl=' + window.location.href.split('/').slice(0,-1).join('/');
    //window.location.href = '//passport.jd.com/new/login.aspx?ReturnUrl=http://' + window.location.host;
    if(this.state.code === '') {
      Toast.info('请输入验证码');
    } else {
      findDOMNode(this.refs['formLogin']).submit();
    }
  }

  render() {
    return tmpls.Index(this.state, this.props, this, {
      styles
    });
  }
}
