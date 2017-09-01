import React from 'react';
import Bundle from './bundle'
import { withRouter, Redirect } from 'react-router'
import { Switch, Route } from 'react-router-dom';
import { observer, Provider, inject } from 'mobx-react';

import loadHome from 'bundle-loader?lazy&name=[name]!./src/web/pages/home/home.js'
import loadBusinessDashboard from 'bundle-loader?lazy&name=[name]!./src/web/pages/businessDashboard/businessDashboard.js'


import Header from './src/web/components/header'
import Sider from './src/web/components/sider'
const HeaderWithRouter = withRouter(Header)
const SiderWithRouter = withRouter(Sider)

const BusinessDashboard = () => (
  <PageWrap>
	  <Bundle load={loadBusinessDashboard}>
	      {(_BusinessDashboard) => {
            const BusinessDashboard = withRouter(_BusinessDashboard)
            return <BusinessDashboard/>
          }
        }
	  </Bundle>
  </PageWrap>
)

const Home = () => (
	  <Bundle load={loadHome}>
	      {(_Home) => {
            const Home = withRouter(_Home)
            return <Home/>
          }
        }
	  </Bundle>
)

const PageWrap = inject("store")(
    observer(({ store, children }) =>{
        return <div>
                  <SiderWithRouter/>
                  <HeaderWithRouter/>
                  <div id="page-wrap" className={store.sider.isOpen ? 'isMenuOpen' : ''}>
                    {children}
                  </div>
                </div>
      }
    )
)

const routes = () => {
  return (
    <Switch>
      <Route exact path='/' component={BusinessDashboard}/>
      <Route exact path='/Home' component={Home}/>
      <Route exact path='/BusinessDashboard' component={BusinessDashboard}/>
      <Redirect from='*' to='/'/>
    </Switch>
  );
};

export default routes;
