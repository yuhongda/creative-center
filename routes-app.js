import React from 'react';
import Bundle from './bundle'
import { withRouter, Redirect } from 'react-router'
import { Switch, Route } from 'react-router-dom';
import { observer, Provider, inject } from 'mobx-react';
import { ConfigApp } from './src/app/config/app';
import Home from 'bundle-loader?lazy&name=[name]!./src/app/pages/home/home';
import Index from 'bundle-loader?lazy&name=[name]!./src/app/pages/index/index';
import BusinessDashboard from 'bundle-loader?lazy&name=[name]!./src/app/pages/businessDashboard/businessDashboard';
import PurchasePath from 'bundle-loader?lazy&name=[name]!./src/app/pages/purchasePath/purchasePath';
import StockMarketing from 'bundle-loader?lazy&name=[name]!./src/app/pages/stockMarketing/stockMarketing';
//import Page1 from 'bundle-loader?lazy&name=[name]!./src/app/pages/page1/page1.js'
//import Page2 from 'bundle-loader?lazy&name=[name]!./src/app/pages/page2/page2.js'
import { AppFunctions } from './src/app/config/app';

//默认Icon
const iconNone = require('./src/app/images/icon-none.png');

//功能页
const FUNCCOMPONENTS = {
  'BusinessDashboard': {
    icon: require('./src/app/images/icon-businessDashboard@3x.png'),
    component: BusinessDashboard
  },
  'PurchasePath': {
    icon: require('./src/app/images/icon-purchasePath@3x.png'),
    component: PurchasePath
  },
  'StockMarketing': {
    icon: require('./src/app/images/icon_stockMarketing@3x.png'),
    component: StockMarketing
  },
  'SaleDiagnosis': {
    icon: require('./src/app/images/icon-sallediagnosis@3x.png'),
    component: null
  },
  'PriceTra': {
    icon: require('./src/app/images/icon-price@3x.png'),
    component: null
  },
  'UserRequirement': {
    icon: require('./src/app/images/icon-UserRequirement@3x.png'),
    component: null
  },
  'NewListing': {
    icon: require('./src/app/images/icon-newlisting@3x.png'),
    component: null
  }
};

//默认页
const ROUTES = [{
  key: 'home',
  path: '/',
  title: '首页',
  component: Home
},{
  key: 'index',
  path: '/index',
  title: '首页',
  component: Index
},];

//功能列表
export const FUNCS = [];
if(AppFunctions && AppFunctions instanceof Array) {
  for(let appFunction of AppFunctions) {
    const modules = [];
    let mods = [];
    if(appFunction.children && appFunction.children instanceof Array) {
      for(let i=0; i<appFunction.children.length; i++) {
        const mod = appFunction.children[i];
        let newMod = {
          key: mod.index,
          path: mod.link,
          title: mod.name,
          disabled: mod.disabled
        };
        mods.push(newMod);
        if(i > 0 && (i+1) % ConfigApp.home.funcsPerRow === 0) {
          modules.push(mods);
          mods = [];
        }
        //
        if(FUNCCOMPONENTS[newMod.key]) {
          const func = FUNCCOMPONENTS[newMod.key];
          if(func) {
            newMod.icon = func.icon;
            newMod.component = func.component;
            ROUTES.push(newMod);
          }
        }
        if(!newMod.icon) {
          newMod.icon = iconNone;
        }
      }
      if(mods.length > 0 && mods.length < ConfigApp.home.funcsPerRow) {
        let diff = ConfigApp.home.funcsPerRow - mods.length;
        for (let j = 0; j < diff; j++) {
          mods.push({key: `null_${j}`});
        }
        modules.push(mods);
      }
    }
    FUNCS.push({
      key: appFunction.index,
      title: appFunction.name,
      modules: modules
    });
  }
}

const AppRoute = ({ module: module, ...rest }) => (
  <Route {...rest} render={props => (
    <Bundle load={module.component}>
      {(load) => {
        const Component = withRouter(load);
        return <Component moduleName={module.title}/>
      }}
    </Bundle>
  )}/>
);

const routes = () => {
  return (
    <Switch>
      {ROUTES.map((module) => {
        return (
          <AppRoute exact path={module.path} module={module} key={module.key}/>
        )
      })}
    </Switch>
  );
};

export default routes;
