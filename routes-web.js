import React from 'react';
import Bundle from './bundle'
import { withRouter, Redirect } from 'react-router'
import { Switch, Route } from 'react-router-dom';
import { observer, Provider, inject } from 'mobx-react';

import loadHome from 'bundle-loader?lazy&name=[name]!./src/web/pages/home/home.js'
import loadBusinessDashboard from 'bundle-loader?lazy&name=[name]!./src/web/pages/businessDashboard/businessDashboard.js'
import loadBusinessEval from 'bundle-loader?lazy&name=[name]!./src/web/pages/businessEval/businessEval.js'
import loadStockMarketing from 'bundle-loader?lazy&name=[name]!./src/web/pages/stockMarketing/stockMarketing.js'
import loadGeneMapping from 'bundle-loader?lazy&name=[name]!./src/web/pages/geneMapping/geneMapping.js'
import loadSubdivisionMarket from 'bundle-loader?lazy&name=[name]!./src/web/pages/subdivisionMarket/subdivisionMarket.js'
import loadUserSegmentation from 'bundle-loader?lazy&name=[name]!./src/web/pages/userSegmentation/userSegmentation.js'
import loadPriceAnalysis from 'bundle-loader?lazy&name=[name]!./src/web/pages/priceAnalysis/priceAnalysis.js'
import loadCompetitivePriceModel from 'bundle-loader?lazy&name=[name]!./src/web/pages/competitivePriceModel/competitivePriceModel.js'
import loadStockWarning from 'bundle-loader?lazy&name=[name]!./src/web/pages/stockWarning/stockWarning.js'
import loadOrderFillRateMonitor from 'bundle-loader?lazy&name=[name]!./src/web/pages/orderFillRateMonitor/orderFillRateMonitor.js'
import loadOutOfStockReason from 'bundle-loader?lazy&name=[name]!./src/web/pages/outOfStockReason/outOfStockReason.js';
import loadUserUpgrade from 'bundle-loader?lazy&name=[name]!./src/web/pages/userUpgrade/userUpgrade.js'
import loadPurchasePath from 'bundle-loader?lazy&name=[name]!./src/web/pages/purchasePath/purchasePath.js'
import loadMarketCompetition from 'bundle-loader?lazy&name=[name]!./src/web/pages/marketCompetition/marketCompetition.js'
import loadAccountInfo from 'bundle-loader?lazy&name=[name]!./src/web/pages/accountInfo/accountInfo.js'
import loadMarketingSelection from 'bundle-loader?lazy&name=[name]!./src/web/pages/marketingSelection/marketingSelection.js'
import loadRoleManagement from 'bundle-loader?lazy&name=[name]!./src/web/pages/roleManagement/roleManagement.js'
import loadPrivilegeManagement from 'bundle-loader?lazy&name=[name]!./src/web/pages/privilegeManagement/privilegeManagement.js'


import Header from './src/web/components/header'
import Sider from './src/web/components/sider'
const HeaderWithRouter = withRouter(Header)
const SiderWithRouter = withRouter(Sider)

/**
 * 账号信息
 */
const AccountInfo = () => (
  <PageWrap>
	  <Bundle load={loadAccountInfo}>
	      {(_AccountInfo) => {
            const AccountInfo = withRouter(_AccountInfo)
            return <AccountInfo/>
          }
        }
	  </Bundle>
  </PageWrap>
)
/**
 * 权限管理
 */
const PrivilegeManagement = () => (
  <PageWrap>
	  <Bundle load={loadPrivilegeManagement}>
	      {(_PrivilegeManagement) => {
            const PrivilegeManagement = withRouter(_PrivilegeManagement)
            return <PrivilegeManagement/>
          }
        }
	  </Bundle>
  </PageWrap>
)
/**
 * 角色管理
 */
const RoleManagement = () => (
  <PageWrap>
	  <Bundle load={loadRoleManagement}>
	      {(_RoleManagement) => {
            const RoleManagement = withRouter(_RoleManagement)
            return <RoleManagement/>
          }
        }
	  </Bundle>
  </PageWrap>
)

/**
 * 生意大盘
 */
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
/**
 * 生意评估
 */
const BusinessEval = () => (
  <PageWrap>
	  <Bundle load={loadBusinessEval}>
	      {(_BusinessEval) => {
            const BusinessEval = withRouter(_BusinessEval)
            return <BusinessEval/>
          }
        }
	  </Bundle>
  </PageWrap>
)
/**
 * 库存健康运营
 */
const StockMarketing = () => (
  <PageWrap>
	  <Bundle load={loadStockMarketing}>
	      {(_StockMarketing) => {
            const StockMarketing = withRouter(_StockMarketing)
            return <StockMarketing/>
          }
        }
	  </Bundle>
  </PageWrap>
)

/**
 * 库存健康预警
 */
const StockWarning = () => (
  <PageWrap>
	  <Bundle load={loadStockWarning}>
	      {(_StockWarning) => {
            const StockWarning = withRouter(_StockWarning)
            return <StockWarning/>
          }
        }
	  </Bundle>
  </PageWrap>
)

/**
 * 基因图谱
 */
const GeneMapping = () => (
  <PageWrap>
	  <Bundle load={loadGeneMapping}>
	      {(_GeneMapping) => {
            const GeneMapping = withRouter(_GeneMapping)
            return <GeneMapping/>
          }
        }
	  </Bundle>
  </PageWrap>
)
/**
 * 细分市场
 */
const SubdivisionMarket = () => (
  <PageWrap>
	  <Bundle load={loadSubdivisionMarket}>
	      {(_SubdivisionMarket) => {
            const SubdivisionMarket = withRouter(_SubdivisionMarket)
            return <SubdivisionMarket/>
          }
        }
	  </Bundle>
  </PageWrap>
)
/**
 * 用户细分
 */
const UserSegmentation = () => (
  <PageWrap>
	  <Bundle load={loadUserSegmentation}>
	      {(_UserSegmentation) => {
            const UserSegmentation = withRouter(_UserSegmentation)
            return <UserSegmentation/>
          }
        }
	  </Bundle>
  </PageWrap>
)

/**
 * 用户升级
 */
const UserUpgrade = () => (
  <PageWrap>
	  <Bundle load={loadUserUpgrade}>
	      {(_UserUpgrade) => {
            const UserUpgrade = withRouter(_UserUpgrade)
            return <UserUpgrade/>
          }
        }
	  </Bundle>
  </PageWrap>
)

/**
 * 价格弹性分析
 */
const PriceAnalysis = () => (
  <PageWrap>
	  <Bundle load={loadPriceAnalysis}>
	      {(_PriceAnalysis) => {
            const PriceAnalysis = withRouter(_PriceAnalysis)
            return <PriceAnalysis/>
          }
        }
	  </Bundle>
  </PageWrap>
)

/**
 * 订单满足监测
 */
const OrderFillRateMonitor = () => (
  <PageWrap>
	  <Bundle load={loadOrderFillRateMonitor}>
	      {(_OrderFillRateMonitor) => {
            const OrderFillRateMonitor = withRouter(_OrderFillRateMonitor)
            return <OrderFillRateMonitor/>
          }
        }
	  </Bundle>
  </PageWrap>
)

/**
 * 缺货原因录入
 */
const OutOfStockReason = () => (
  <PageWrap>
    <Bundle load={loadOutOfStockReason}>
      {(_OutOfStockReason) => {
        const OutOfStockReason = withRouter(_OutOfStockReason)
        return <OutOfStockReason/>
      }
      }
    </Bundle>
  </PageWrap>
)

/**
 * 竞品量价模型
 */
const CompetitivePriceModel = () => (
  <PageWrap>
    <Bundle load={loadCompetitivePriceModel}>
      {(_CompetitivePriceModel) => {
        const CompetitivePriceModel = withRouter(_CompetitivePriceModel)
        return <CompetitivePriceModel/>
      }
      }
    </Bundle>
  </PageWrap>
)

/**
 * 购物路径
 */
const PurchasePath = () => (
  <PageWrap>
    <Bundle load={loadPurchasePath}>
      {(_PurchasePath) => {
        const PurchasePath = withRouter(_PurchasePath)
        return <PurchasePath/>
      }
      }
    </Bundle>
  </PageWrap>
)

/**
 * 市场竞争
 */
const MarketCompetition = () => (
  <PageWrap>
	  <Bundle load={loadMarketCompetition}>
	      {(_MarketCompetition) => {
            const MarketCompetition = withRouter(_MarketCompetition)
            return <MarketCompetition/>
          }
        }
	  </Bundle>
  </PageWrap>
)

/**
 * 运营选品
 */
const MarketingSelection = () => (
  <PageWrap>
	  <Bundle load={loadMarketingSelection}>
	      {(_MarketingSelection) => {
            const MarketingSelection = withRouter(_MarketingSelection)
            return <MarketingSelection/>
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
      <Route exact path='/BusinessEval' component={BusinessEval}/>
      <Route exact path='/StockMarketing' component={StockMarketing}/>
      <Route exact path='/StockWarning' component={StockWarning}/>
      <Route exact path='/GeneMapping' component={GeneMapping}/>
      <Route exact path='/SubdivisionMarket' component={SubdivisionMarket}/>
      <Route exact path='/UserSegmentation' component={UserSegmentation}/>
      <Route exact path='/UserUpgrade' component={UserUpgrade}/>
      <Route exact path='/PriceAnalysis' component={PriceAnalysis}/>
      <Route exact path='/OrderFillRateMonitor' component={OrderFillRateMonitor}/>
      <Route exact path='/CompetitivePriceModel' component={CompetitivePriceModel}/>
      <Route exact path='/OutOfStockReason' component={OutOfStockReason} />
      <Route exact path='/PurchasePath' component={PurchasePath} />
      <Route exact path='/MarketCompetition' component={MarketCompetition} />
      <Route exact path='/MarketingSelection' component={MarketingSelection} />
      <Route exact path='/AccountInfo' component={AccountInfo} />
      <Route exact path='/PrivilegeManagement' component={PrivilegeManagement} />
      <Route exact path='/RoleManagement' component={RoleManagement} />
      <Redirect from='*' to='/'/>
    </Switch>
  );
};

export default routes;
