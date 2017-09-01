import * as React from 'react'
import { Component, PropTypes } from 'react';
import { Link } from 'react-router-dom';
import { toJS, transaction } from 'mobx';
import { observer, inject } from 'mobx-react';
import { registerTmpl } from 'nornj-react';
import { autobind } from 'core-decorators';
import styles from './sider.scss';
import template from './sider.t.html';
import { push as Menu } from 'react-burger-menu'

@inject('store')
@observer
export default class Sider extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

  componentDidMount() {

  }

  selectMenu(event) {
      this.props.store.sider.setCurrent(`${event.currentTarget.getAttribute('data-index')}`)
      this.props.store.sider.setMenu(false)
  }

  toggleMenu(item, event){
    this.props.store.sider.setMenuDataByIndex(!item.expanded, item.index)
  }

  isMenuOpen(state){
    this.props.store.sider.setMenu(state.isOpen)
  }

  render() {
    let self = this

    function generateMenu(items){
        return items.map(function(item, i) {
            if(item.type == 'item'){
                return <Link key={item.index} to={item.link} data-index={item.index} onClick={self.selectMenu.bind(self)} className={`'menu-item' ${self.props.store.sider.current==item.index ? 'cur' : ''}`}>{item.name}</Link>
            }else if(item.type == 'group'){
                return <div key={item.name} className="menu-group">
                            <div className="menu-tit" onClick={self.toggleMenu.bind(self, item)}>{item.name}</div>
                            <div className={`menu-cnt ${item.expanded ? 'expanded':''}`}>
                                {generateMenu(item.children)}
                            </div>
                        </div>
            }
        });
    }
    
    const menuCnt = generateMenu(this.props.store.sider.menuData)

    const menu = <Menu pageWrapId={ "page-wrap" } outerContainerId={ "outer-container" } onStateChange={ this.isMenuOpen.bind(this) } isOpen={this.props.store.sider.isOpen} width={ '5rem' } right>
                    {menuCnt}
                </Menu>

    return (menu)
  }
}


