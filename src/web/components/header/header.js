import { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import { registerTmpl } from 'nornj-react';
import { autobind } from 'core-decorators';
import { Link } from 'react-router-dom';
// import 'vic-common/lib/components/antd/menu';
import styles from './header.scss';
import template from './header.t.html';
import { registerComponent } from 'nornj';

// import { FormattedMessage } from 'react-intl';
// registerComponent({'cc-FormattedMessage': FormattedMessage})

@inject('store')
@observer
export default class Header extends Component {
  static defaultProps = {
    current: 1
  };

  componentWillMount() {

  }
  componentDidMount() {
  }

  @autobind
  navChanged(event){
    this.props.store.header.setCurrent(parseInt(event.currentTarget.getAttribute('data-index'),10))
    // this.props.history.push(`/page${this.props.store.header.current}`);
  }

  render() {
    return template(this.props, this, {
      styles,
      headerPic:require('../../images/pic-header.png')
    });
  }
}
