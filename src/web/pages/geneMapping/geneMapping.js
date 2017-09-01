import React, { Component } from 'react';
import { observable, computed, toJS } from 'mobx'
import { observer, inject } from 'mobx-react';
import nj from 'nornj';
import { registerComponent } from 'nornj';
import { registerTmpl } from 'nornj-react';
import 'vic-common/lib/components/antd/button';
import 'vic-common/lib/components/antd/table';
import 'vic-common/lib/components/antd/input';
import 'vic-common/lib/components/antd/icon';
import 'vic-common/lib/components/antd/select';
import 'vic-common/lib/components/antd/radio';
import Message from 'vic-common/lib/components/antd/message';
import { autobind } from 'core-decorators';
import styles from './geneMapping.m.scss';
import tmpls from './geneMapping.t.html';
import '../../components/conditons';
// import Tree from 'react-d3-tree';
import Tree from 'vic-common/lib/components/react-d3-tree';
import { dateFormat, debounce, colorList } from '../../misc/util'


//页面容器组件
@inject('store')
@observer
@registerTmpl('GeneMapping')
export default class GeneMapping extends Component {

  constructor(props) {
      super(props);
  }

  componentDidMount() {
  }

  @autobind
  onSearch(){
    const closeLoading = Message.loading('正在获取数据...', 0),
          searchConditions = this.props.store.conditions.getParamsHasLevel4({ propId: '0' });
    Promise.all([
      this.props.store.geneMapping.getRequirementInsightData(searchConditions)
    ]).then(() => {
      closeLoading();
      this.props.store.geneMapping.setSelectedProp1(0);
      this.props.store.geneMapping.setSelectedProp2(0);
    });
  }

  render() {
    return tmpls.geneMapping(this.state, this.props, this, {
      styles
    });
  }
}

/**
 * 需求洞察
 * 
 * @class RequirementInsight
 * @extends {Component}
 */
@registerTmpl('requirementInsight')
@inject('store')
@observer
class RequirementInsight extends Component {

  @observable selectedProp = null;
  @observable currentSubTable = 'jd'; // 'jd' | 'pg'

  @computed get subName(){
    if(this.selectedProp){
      return this.selectedProp.name;
    }else{
      return this.props.store.geneMapping.requirementInsightData && this.props.store.geneMapping.requirementInsightData[0] && this.props.store.geneMapping.requirementInsightData[0].name
    }
  }

  @observable tablePropColumns =  [{
    key:'1',
    title: '排名',
    dataIndex: 'rank',
    render: (text, record, index) => {
      return {
        children: nj`<span class="rank-${index%4}">${text}</span>`()
      };
    }
  }, {
    key:'2',
    title: '属性',
    dataIndex: 'name'
  }, {
    key:'3',
    title: '线下排名',
    dataIndex: 'rankOffline'
  }];

  @computed get tablePropData(){

    return this.props.store.geneMapping.requirementInsightData && toJS(this.props.store.geneMapping.requirementInsightData.map((item, i) => {
      return {
        key: i,
        id:item.id,
        rank: item.rank,
        name: item.name,
        rankOffline: item.rankOffline
      }
    }));

  }

  @observable tableSubPropColumns = [
    {
      key:'1',
      title:'市场结构占比',
      children:[
        {
          key:'11',
          title: '排名',
          dataIndex: 'rank',
          render: (text, record, index) => {
            return {
              children: nj`<span class="rank-${index%4}">${text}</span>`()
            };
          }
        }, {
          key:'12',
          title: '属性',
          dataIndex: 'name'
        }, {
          key:'13',
          title: '销售占比',
          dataIndex: 'salesRates'
        }, {
          key:'14',
          title: '销量占比',
          dataIndex: 'salesAmountRates'
        }
      ]
    },
    {
      key:'2',
      title:'增长驱动力寻找',
      children:[
        {
          key:'21',
          title: '销售增长率',
          dataIndex: 'salesGrowth',
          render: (text, record, index) => {
            let _className = '';
            if(toJS(this.tableSubPropData).filter(item=>{
              return parseFloat(item.salesGrowth.slice(0, -1)) > parseFloat(record.salesGrowth)
            }).length == 0){
              _className = 'highlight';
            }

            return {
              props: {
                className: _className,
              },
              children: text
            };
          }
        }, {
          key:'22',
          title: 'uv增长率',
          dataIndex: 'uvGrowth',
          render: (text, record, index) => {
            let _className = '';
            if(toJS(this.tableSubPropData).filter(item=>{
              return parseFloat(item.uvGrowth.slice(0, -1)) > parseFloat(record.uvGrowth)
            }).length == 0){
              _className = 'highlight';
            }

            return {
              props: {
                className: _className,
              },
              children: text
            };
          }
        }, {
          key:'23',
          title: 'uv转化率',
          dataIndex: 'uvConvertion',
          render: (text, record, index) => {
            let _className = '';
            if(toJS(this.tableSubPropData).filter(item=>{
              return parseFloat(item.uvConvertion.slice(0, -1)) > parseFloat(record.uvConvertion)
            }).length == 0){
              _className = 'highlight';
            }

            return {
              props: {
                className: _className,
              },
              children: text
            };
          }
        }, {
          key:'24',
          title: '客单价',
          dataIndex: 'price'
        }, {
          key:'25',
          title: '用户增长率',
          dataIndex: 'userGrowth',
          render: (text, record, index) => {
            let _className = '';
            if(toJS(this.tableSubPropData).filter(item=>{
              return parseFloat(item.userGrowth.slice(0, -1)) > parseFloat(record.userGrowth)
            }).length == 0){
              _className = 'highlight';
            }

            return {
              props: {
                className: _className,
              },
              children: text
            };
          }
        }
      ]
    }  
  ];

  @computed get tableSubPropData(){
    let filterArray = this.props.store.geneMapping.requirementInsightData && toJS(this.props.store.geneMapping.requirementInsightData)
            .filter(item => item.id == (this.selectedProp ? this.selectedProp.id : this.props.store.geneMapping.requirementInsightData[0] && this.props.store.geneMapping.requirementInsightData[0].id));

    if(filterArray && filterArray.length>0){
      return filterArray[0].children[this.currentSubTable == 'jd' ? 0 : 1].map((item, i) => {
        return {
          key: i,
          rank: item.rank,
          name: item.type,
          salesRates: (item.salesRates * 100).toFixed(2) + '%',
          salesAmountRates: (item.salesAmountRates * 100).toFixed(2) + '%',
          salesGrowth: (item.salesGrowth * 100).toFixed(2) + '%',
          uvGrowth: (item.uvGrowth * 100).toFixed(2) + '%',
          uvConvertion: (item.uvConvertion * 100).toFixed(2) + '%',
          price: item.price.toFixed(2),
          userGrowth: (item.userGrowth * 100).toFixed(2) + '%'
        }
      });
    }
    
  }


  @autobind
  onPropSelected(record, index, event){
    this.selectedProp = record
  }

  @autobind
  renderRowClass(record, index){
    if(this.selectedProp){
      if(record.id == this.selectedProp.id)
        return 'row-highlight'
    }else{
      if(index == 0) 
        return 'row-highlight'        
    }
  }

  @autobind
  switchSubTable(tag){
    return (e) => {
      this.currentSubTable = tag;
      
    }
  }

  @autobind
  setOfflineRank(e){
    const regEx = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
    if(regEx.test(e.target.value)){
      const closeLoading = Message.loading('正在获取数据...', 0),
            searchConditions = this.props.store.conditions.getParamsHasLevel4({ propId: '0' });
      let _id = null;
      if(this.selectedProp){
        _id = this.selectedProp.id;
      }else{
        _id = this.props.store.geneMapping.requirementInsightData && toJS(this.props.store.geneMapping.requirementInsightData)[0].id
      }
      if(_id && e.target.value != ''){
        Promise.all([
          this.props.store.geneMapping.setOfflineRank(Object.assign({}, searchConditions, {id:_id,rank:e.target.value})),
          this.props.store.geneMapping.getRequirementInsightData(searchConditions)
        ]).then(() => {
          closeLoading();
        });
        e.target.value = '';
        e.target.blur()
      }
    }
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  render() {
    const { store: { geneMapping } } = this.props;
    return tmpls.requirementInsight(this.state, this.props, this, {
      styles,
      geneMapping
    });
  }
}

registerComponent({'cc-Tree': Tree})

/**
 * 基因链分析
 * 
 * @class GeneLinkAnalysis
 * @extends {Component}
 */
@registerTmpl('geneLinkAnalysis')
@inject('store')
@observer
class GeneLinkAnalysis extends Component {
  
  @observable currentView = 1; // 'chart':1, 'table':2
  @observable treeType = 'sales'; // 'sales' | 'uv'
  @observable isFetching = false;

  @computed get propData1(){
    let data = this.props.store.geneMapping.requirementInsightData;
    if(data){
      return [{id:0,name:'请选择'}].concat(toJS(data.filter(item => item.id != this.props.store.geneMapping.selectedProp2 || item.id == 0).map((item, i) => {
        return {
          key: i,
          id:item.id,
          rank: item.rank,
          name: item.name,
          rankOffline: item.rankOffline
        }
      })))
    }
  }

  @computed get propData2(){
    let data = this.props.store.geneMapping.requirementInsightData;
    if(data){
      return [{id:0,name:'请选择'}].concat(toJS(data.filter(item => item.id != this.props.store.geneMapping.selectedProp1 || item.id == 0).map((item, i) => {
        return {
          key: i,
          id:item.id,
          rank: item.rank,
          name: item.name,
          rankOffline: item.rankOffline
        }
      })))
    }
  }

  @computed get treeViewData(){

    let category = '品类',
        _data = null;

    const { conditions } = this.props.store;
    if(conditions.selectedCategoryHasLevel4Options){
      if(conditions.selectedCategoryHasLevel4Options.length < 4){
        category = conditions.selectedCategoryHasLevel4Options[2].label
      }
      else {
        category = conditions.selectedCategoryHasLevel4Options[3].label
      }
    }

    if(this.treeType == 'sales'){
      _data = this.props.store.geneMapping.geneLinkAnalysisData && toJS(this.props.store.geneMapping.geneLinkAnalysisData[0])
    }else{
      _data = this.props.store.geneMapping.geneLinkAnalysisData && toJS(this.props.store.geneMapping.geneLinkAnalysisData[1])
    }

    return [{
      id:0,
      name: category,
      children:_data
    }];
  }

  @observable tableColumns = [
    {title:'排名',dataIndex:'rank',key:'rank'},
    {title:'属性',dataIndex:'name',key:'name'},
    {title:'销售额占比',dataIndex:'salesRates',key:'salesRates',
      sorter: (a, b) => {
        return a.salesRates.slice(0, -1) - b.salesRates.slice(0, -1);
      }
    },
    {title:'UV占比',dataIndex:'uvRates',key:'uvRates',
      sorter: (a, b) => {
        return a.uvRates.slice(0, -1) - b.uvRates.slice(0, -1);
      }
    }
  ];

  @computed get tableData(){
    return this.props.store.geneMapping.geneLinkAnalysisTableData && toJS(this.props.store.geneMapping.geneLinkAnalysisTableData)
  }

  constructor(props) {
    super(props);
    this.state = {
      treeViewProps: {
        translate:{x:50,y:250},
        zoomable:true,
        pathFunc:'elbow',
        separation:{siblings: 1, nonSiblings: 1}
      }
    };

    this.debounceChange = debounce(e => {
      this.treeType = e.target.value;
    }, 500);
  }

  componentDidMount() {
    if(this.props.store.geneMapping.selectedProp1 == ''){
      this.props.store.geneMapping.setSelectedProp1(this.propData1 && this.propData1[0].id)
    }
    if(this.props.store.geneMapping.selectedProp2 == ''){
      this.props.store.geneMapping.setSelectedProp1(this.propData2 && this.propData2[0].id)
    }
  }

  @autobind
  switchView(index){
    return (e) => {
      this.currentView = index;
    };
  }

  fetchGeneLinkData(){
    this.isFetching = true;
    let self = this;
    this.treeType = 'sales';
    const closeLoading = Message.loading('正在获取数据...', 0),
          searchConditions = this.props.store.conditions.getParamsHasLevel4({
            propId1:this.props.store.geneMapping.selectedProp1,
            propId2:this.props.store.geneMapping.selectedProp2,
            propId: '0'
          });
    Promise.all([
      this.props.store.geneMapping.getGeneLinkData(searchConditions)
    ]).then(() => {
      closeLoading();
      setTimeout(function() {
        self.isFetching = false;
      }, 500);
    });
  }

  @autobind
  onPropList1Change(value){
    this.props.store.geneMapping.setSelectedProp1(parseInt(value, 10));

    if(this.props.store.geneMapping.selectedProp1 && this.props.store.geneMapping.selectedProp2){
      this.fetchGeneLinkData();
    }else{
      this.props.store.geneMapping.setGeneLinkData({
        success:true,
        data:null
      })
    }
  }
  @autobind
  onPropList2Change(value){
    this.props.store.geneMapping.setSelectedProp2(parseInt(value, 10));

    if(this.props.store.geneMapping.selectedProp1 && this.props.store.geneMapping.selectedProp2){
      this.fetchGeneLinkData();
    }else{
      this.props.store.geneMapping.setGeneLinkData({
        success:true,
        data:null
      })
    }
  }

  @autobind
  onTreeToolbarChange(e){
    let self = this;
    this.debounceChange(e);
    // this.treeType = e.target.value;
  }

  render() {
    const { store: { geneMapping } } = this.props;
    return tmpls.geneLinkAnalysis(this.state, this.props, this, {
      styles,
      geneMapping,
      arrow: require('../../images/arrow-down.png')
    });
  }
}
