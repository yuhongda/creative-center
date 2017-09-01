import { types } from "mobx-state-tree";
import { fetchData } from 'vic-common/lib/common/fetchConfig';
import Notification from '../../utils/notification';



const GeneMappingStore = types.model("GeneMappingStore", {
  selectedProp1:types.optional(types.number, ()=>0),
  selectedProp2:types.optional(types.number, ()=>0)
},
{
  /**
   * 需求洞察
   */
  requirementInsightData:null,
  /**
   * 基因链分析
   */
  geneLinkAnalysisData:null,
  geneLinkAnalysisTableData:null
},
 {
  getRequirementInsightData(params){
    return fetchData(
      `${__HOST}/geneMapping/getRequirementInsightData`, 
      this.setRequirementInsightData, 
      params, 
      { method: 'get' })
      .catch((ex) => {
        Notification.error({ description: '获取需求洞察数据异常:' + ex, duration: null });
      });
  },
  setRequirementInsightData(result){
    if (result.success) {
      const data = result.data;
      this.requirementInsightData = data;
    } else {
      Notification.error({ description: '获取需求洞察数据异常:' + result.message, duration: null });
    }
  },
  setOfflineRank(params){
    params.categoryId1 = parseInt(params.categoryId1, 10);
    params.categoryId2 = parseInt(params.categoryId2, 10);
    params.categoryId3 = parseInt(params.categoryId3, 10);
    params.categoryId4 = parseInt(params.categoryId4, 10);
    params.propId = parseInt(params.id, 10);
    params.rank = parseInt(params.rank, 10);
    return fetchData(
      `${__HOST}/geneMapping/setOfflineRank`, 
      null, 
      params, 
      { method: 'post' })
      .catch((ex) => {
        Notification.error({ description: '设置线下排名异常:' + ex, duration: null });
      });
  },
  getGeneLinkData(params){
    return fetchData(
      `${__HOST}/geneMapping/getGeneLinkData`, 
      this.setGeneLinkData, 
      params, 
      { method: 'get' })
      .catch((ex) => {
        Notification.error({ description: '获取基因链分析数据异常:' + ex, duration: null });
      });
  },
  setGeneLinkData(result){
    if (result.success) {
      const data = result.data;
      let _data = [];
      if(data && data.length > 0){
        _data[0] = this.adjustGeneLinkData(data[0], 'salesRates');
        _data[1] = this.adjustGeneLinkData(data[1], 'uvRates');
      }else{
        _data = null
      }
      this.geneLinkAnalysisData = _data;


      /**
       * table 数据
       */
      if(data && data.length > 0){
        let tableData = this.adjustGeneLinkData4Table(data[0]);
        let tableDataFinal = this.adjustGeneLinkData4TableUV(tableData, data[1]);
        this.geneLinkAnalysisTableData = tableDataFinal;
      }
    } else {
      Notification.error({ description: '获取基因链分析数据异常:' + result.message, duration: null });
    }
  },
  adjustGeneLinkData(data, type){
    let typeText = type == 'salesRates' ? '销售额占比' : 'UV占比';
    return data.map((item, i) => {
      item.attributes = {};
      item.attributes[typeText] = (item[type] * 100).toFixed(2) + '%';
      if(item.children && item.children.length > 0){
        this.adjustGeneLinkData(item.children, type);
      }
      return item;
    });
  },
  adjustGeneLinkData4Table(data){
    if(data && data.length > 0){
      return data.map((item, i) => {
          
        return {
          key: item.key,
          rank: item.rank,
          name: item.name,
          salesRates: (item.salesRates * 100).toFixed(2) + '%',
          uvRates: (item.uvRates * 100).toFixed(2) + '%',
          children:this.adjustGeneLinkData4Table(item.children)
        }
      });
    }
  },
  adjustGeneLinkData4TableUV(data, uvData){
    return data.map((item, i) => {
      item.uvRates = (uvData[i].uvRates * 100).toFixed(2) + '%';
      if(item.children && item.children.length > 0){
        item.children = this.adjustGeneLinkData4TableUV(item.children, uvData[i].children);
      }
      return item;
    });
  },
  setSelectedProp1(value){
    this.selectedProp1 = value;
  },
  setSelectedProp2(value){
    this.selectedProp2 = value;
  },
  afterCreate() {

  }
});

export default GeneMappingStore;