import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import { registerTmpl } from 'nornj-react';
import { autobind } from 'core-decorators';
import styles from './funcIcon.m.scss';
import template from './funcIcon.t.html';

@inject('store')
@registerTmpl('funcIcon')
@observer
export default class FuncIcon extends Component {

  @autobind
  onClick() {
    if(this.props.info && this.props.info.path) {
      this.props.history.push(this.props.info.path);
    }
  }

  render() {
    return template(this.props, this, {
      styles
    });
  }
}