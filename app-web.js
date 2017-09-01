import 'whatwg-fetch';
import 'es6-weak-map/implement';
import arrayFrom from 'array-from';
if (!Array.from) Array.from = arrayFrom;
import 'console-polyfill';
import 'flarej/lib/styles/grid';
import 'flarej/lib/components/grid';
import React from 'react'
import ReactDOM from 'react-dom'
import nj from 'nornj';
import './src/utils/njConfigs';
import { compileH, registerComponent } from 'nornj'
import { withRouter } from 'react-router'
import { HashRouter } from 'react-router-dom'
import { AppContainer } from 'react-hot-loader'
import { observer, Provider, inject } from 'mobx-react';
import routes from './routes-web';
import hotReloadRoutes from './hotReloadRoutes';
import './src/web/css/app.scss'
import RootStore from './src/stores/rootStore';
import 'vic-common/resources/styles/base.less';
import 'nornj-react/router';
import { onSnapshot } from "mobx-state-tree";
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
if (!Object.assign && babelHelpers) {
  Object.assign = babelHelpers.extends;
}
import Notification from 'vic-common/lib/components/antd/notification';
import { createNotification } from './src/utils/notification';
createNotification(Notification);


const rootStore = RootStore.create({});
// onSnapshot(rootStore, (snapshot) => {
//   console.log(snapshot)
// })

/**
 * localization
 */
import zh from 'react-intl/locale-data/zh';
import en from 'react-intl/locale-data/en';
import { addLocaleData, IntlProvider } from 'react-intl';
import zh_CN from './src/web/misc/zh_CN';
import en_US from './src/web/misc/en_US';
import intl from 'intl';
addLocaleData([...zh,...en]);

function chooseLocale(){
  switch(navigator.language.split('-')[0]){
      case 'en':
          return en_US;
          break;
      case 'zh':
          return zh_CN;
          break;
      default:
          return zh_CN;
          break;
  }
}

const renderApp = appRoutes => {
  ReactDOM.render(
    <Provider store={rootStore}>
      <IntlProvider locale={navigator.language.split('-')[0]} messages={chooseLocale()}>
        <HashRouter>
          <div id="outer-container">
              {appRoutes()}
          </div>
        </HashRouter>
      </IntlProvider>
    </Provider>,
    document.getElementById('app')
  );
};
renderApp(routes);


if (module.hot) {
  module.hot.accept('./routes-web', () => {
    const newRoutes = require('./routes-web').default;
    // hotReloadRoutes(routes, nextRoutes);
    renderApp(newRoutes);
  });
}
