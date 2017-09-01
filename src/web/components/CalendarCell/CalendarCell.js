import * as React from 'react'
import { Component, PropTypes } from 'react';
import { Link } from 'react-router-dom';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import { registerComponent } from 'nornj';
import { registerTmpl } from 'nornj-react';
import { autobind } from 'core-decorators';
import styles from './CalendarCell.m.scss';
import tmpls from './CalendarCell.t.html';
import 'vic-common/lib/components/antd/input';

const REGEX_NUM = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;

@registerTmpl('cc-calendar-cell')
@observer
export default class CalendarCell extends Component {

  constructor(props) {
    super(props);
  }

  @observable inputValue = '';
  @observable editing = false;

  @autobind
  onChange(e) {
    this.inputValue = e.target.value;
  }

  @autobind
  onCellClick() {
    const { model, name, date, isDisabled } = this.props;
    if (isDisabled || this.editing) {
      return;
    }
    
    this.editing = true;
    this.inputValue = model[name][date];

    setTimeout(() => {
      this.refs.input.refs.input.focus();
    }, 100);
  }

  @autobind
  onBlur() {
    const { model, name, date } = this.props;
    let inputValue = this.inputValue;
    if(inputValue === '') {
      inputValue = '0';
    }

    if (REGEX_NUM.test(inputValue)) {
      model[name][date] = inputValue;
      this.editing = false;
    }
  }

  render() {
    return tmpls.CalendarCell(this.props, this, { styles });
  }
}