import * as React from 'react'
import { Component, PropTypes } from 'react';
import { Link } from 'react-router-dom';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import { registerComponent } from 'nornj';
import { registerTmpl } from 'nornj-react';
import { autobind } from 'core-decorators';
import styles from './CCProgress.m.scss';
import tmpls from './CCProgress.t.html';

@registerTmpl('cc-progress')
@observer
export default class CCProgress extends Component {

  // @observable targetPos = 0;
  // @observable currentPos = 0;

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let targetPos, currentPos;
    if (this.props.target > this.props.current) {
      targetPos = 100;
      currentPos = this.props.current / this.props.target * 100;
    } else {
      targetPos = this.props.target / this.props.current * 100;
      currentPos = 100;
    }

    return tmpls.ccProgress(this.props, this, {
      styles,
      targetPos,
      currentPos
    });
  }
}


CCProgress.propTypes = {
  target: React.PropTypes.number,
  current: React.PropTypes.number
};

CCProgress.defaultProps = {
  target: 100,
  current: 0
};