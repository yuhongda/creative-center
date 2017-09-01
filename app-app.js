import 'whatwg-fetch';
import 'es6-weak-map/implement';
import arrayFrom from 'array-from';
if (!Array.from) Array.from = arrayFrom;
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
import routes from './routes-app';
//import hotReloadRoutes from './hotReloadRoutes';
import './src/app/css/app.scss'
import Header from './src/app/components/header'
//import Sider from './src/app/components/sider'
import RootStore from './src/stores/rootStoreApp';
import 'vic-common/resources/styles/base.less';
import 'nornj-react/router';
import Toast from 'vic-common/lib/components/antd-mobile/toast';
import Modal from 'vic-common/lib/components/antd-mobile/modal';
import { createNotification } from './src/utils/notification';
createNotification([Toast, Modal], true);

const HeaderWithRouter = withRouter(Header);
//const SiderWithRouter = withRouter(Sider);

const rootStore = RootStore.create({});

const renderApp = appRoutes => {
  ReactDOM.render(
    <Provider store={rootStore}>
        <HashRouter>
          <div id="outer-container">
            {/*<SiderWithRouter/>*/}
              <HeaderWithRouter/>
              {appRoutes()}
          </div>
        </HashRouter>
    </Provider>,
    document.getElementById('app')
  );
};
renderApp(routes);


if (module.hot) {
  module.hot.accept('./routes-app', () => {
    const newRoutes = require('./routes-app').default;
    //hotReloadRoutes(routes, nextRoutes);
    renderApp(newRoutes);
  });
}
