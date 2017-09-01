import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import nj, { taggedTmpl as njs } from 'nornj';
import { observable, computed, toJS, runInAction } from 'mobx'
import { registerTmpl } from 'nornj-react';
import 'vic-common/lib/components/antd/button';
import 'vic-common/lib/components/antd/modal';
import 'vic-common/lib/components/antd/select';
import 'vic-common/lib/components/antd/calendar';
import 'vic-common/lib/components/antd/cascader';
import 'vic-common/lib/components/antd/datepicker';
import 'vic-common/lib/components/antd/popover';
import 'vic-common/lib/components/antd/upload';
import 'vic-common/lib/components/antd/icon';
import 'vic-common/lib/components/antd/radio';
import Notification from 'vic-common/lib/components/antd/notification';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/component/visualMap';
import 'echarts/lib/component/calendar';
import 'echarts/lib/component/dataZoom';
import 'vic-common/lib/components/ECharts/heatmapChart';
import 'vic-common/lib/components/ECharts/barChart';
import Message from 'vic-common/lib/components/antd/message';
import graphic from 'echarts/lib/util/graphic.js'
import { autobind } from 'core-decorators';
import styles from './businessDashboard.m.scss';
import tmpls from './businessDashboard.t.html';
import ccProgress from '../../components/CCProgress'
import CalendarCell from '../../components/CalendarCell'
import { dateFormat } from '../../misc/util'
import moment from 'moment';
import '../../components/conditons/conditons.scss';
import 'vic-common/lib/components/antd/datepicker';
import { findDOMNode } from 'react-dom';
import 'vic-common/lib/components/antd/pagination';

//页面容器组件
@registerTmpl('BusinessDashboard')
@inject('store')
@observer
export default class BusinessDashboard extends Component {

  @observable dlgTargetSettingVisible = false;
  @observable dlgDownloadVisible = false;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { store: { businessDashboard } } = this.props;
    const closeLoading = Message.loading('正在获取数据...', 0);
    Promise.all([
      businessDashboard.getTargetData(),
      businessDashboard.getCalendarData(),
      businessDashboard.getSalesTrends(),
      businessDashboard.getCategoryKpiTrackList('month'),
      businessDashboard.getBrandKpiTrackList('month'),
      businessDashboard.getTargetSettingDateData(moment().format("YYYY-MM-01")),
      businessDashboard.getCategoryForBrand().then(() => {
        return businessDashboard.getTargetSettingMonthData(moment().year(), businessDashboard.categoryForBrandId);
      }),
      businessDashboard.getBrandForTarget(),
      businessDashboard.getTargetIndex(),
      businessDashboard.conditions.getCategoryData().then(() => {
        return businessDashboard.conditions.getBrandData();
      }),
      businessDashboard.conditions.getVendorData()
    ]).then(() => closeLoading());
  }

  @autobind
  doTargetSetting() {
    this.dlgTargetSettingVisible = true
  }

  @autobind
  dlgTargetSettingOk() {
    this.dlgTargetSettingVisible = false
  }

  @autobind
  dlgTargetSettingCancel() {
    this.dlgTargetSettingVisible = false
  }

  @autobind
  doDownload() {
    this.dlgDownloadVisible = true
  }

  @autobind
  dlgDownloadOk() {
    this.dlgDownloadVisible = false
  }

  @autobind
  dlgDownloadCancel() {
    this.dlgDownloadVisible = false
  }


  @autobind
  dateCellRender(date) {
    let _dateString = dateFormat(new Date(date), 'yyyy-mm-dd'),
      _date = new Date(new Date(date).getFullYear(), new Date(date).getMonth(), new Date(date).getDate()),
      _now = new Date(),
      now = new Date(_now.getFullYear(), _now.getMonth(), _now.getDate());

    return nj `<cc-calendar-cell model=${this.props.store.businessDashboard} name="targetSettingDateData" date="${_dateString}" isDisabled="${_date<now}"/>` ()
  }

  @autobind
  monthCellRender(date) {
    let _dateString = dateFormat(new Date(date), 'yyyy-mm'),
      _date = new Date(new Date(date).getFullYear(), new Date(date).getMonth(), 1),
      _now = new Date(),
      now = new Date(_now.getFullYear(), _now.getMonth(), 1);

    return nj `<cc-calendar-cell model=${this.props.store.businessDashboard} name="targetSettingMonthData" date="${_dateString}" isDisabled="${_date<now}"/>` ()
  }

  @autobind
  categoryChange(value) {
    const { store: { businessDashboard } } = this.props;
    businessDashboard.setCategoryForBrandId(value);
    businessDashboard.getTargetSettingMonthData(businessDashboard.targetSettingMonthValue.year(),
      businessDashboard.categoryForBrandId,
      null
    );
  }

  @autobind
  brandChange(value) {
    const { store: { businessDashboard } } = this.props;
    businessDashboard.setBrandForTargetId(value);
    businessDashboard.getTargetSettingMonthData(businessDashboard.targetSettingMonthValue.year(),
      null,
      businessDashboard.brandForTargetId
    );
  }

  @autobind
  targetChange(e) {
    const { store: { businessDashboard } } = this.props;
    businessDashboard.setTargetType(e.target.value);
    businessDashboard.getTargetSettingMonthData(businessDashboard.targetSettingMonthValue.year(),
      businessDashboard.targetType == 'category' ? businessDashboard.categoryForBrandId : null,
      businessDashboard.targetType == 'brand' ? businessDashboard.brandForTargetId : null
    );
  }

  @autobind
  panelChange(m) {
    const { store: { businessDashboard } } = this.props;
    businessDashboard.setTargetSettingDateValue(m);
    businessDashboard.getTargetSettingDateData(m.format("YYYY-MM-01"));
  }

  @autobind
  categoryPanelChange(m) {
    const { store: { businessDashboard } } = this.props;
    businessDashboard.setTargetSettingMonthValue(m);
    businessDashboard.getTargetSettingMonthData(m.year(),
      businessDashboard.targetType == 'category' ? businessDashboard.categoryForBrandId : null,
      businessDashboard.targetType == 'brand' ? businessDashboard.brandForTargetId : null
    );
  }

  @autobind
  onSave() {
    const { store: { businessDashboard } } = this.props;
    const closeLoading = Message.loading('正在保存数据...', 0);
    businessDashboard.saveBdPlan().then(() => {
      businessDashboard.getTargetIndex().then(() => closeLoading());
    });
  }

  @autobind
  onCategoryChange(value) {
    const { store: { businessDashboard } } = this.props;
    businessDashboard.conditions.setSelectedCategory(value);
    businessDashboard.conditions.getBrandData({ categoryId: value });
  }

  @autobind
  onBrandChange(value) {
    const { store: { businessDashboard } } = this.props;
    businessDashboard.conditions.setSelectedBrand(value);
  }

  @autobind
  onVendorChange(value) {
    const { store: { businessDashboard } } = this.props;
    businessDashboard.conditions.setSelectedVendor(value);
  }

  @autobind
  onDateRangeChange(date, dateString) {
    const { store: { businessDashboard } } = this.props;
    businessDashboard.conditions.setSelectedDateRange(dateString);
  }

  @autobind
  onClick() {
    // const { store: { businessDashboard } } = this.props;
    // const { conditions } = businessDashboard;
    // const categorys = conditions.selectedCategory;

    // const closeLoading = Message.loading('正在导出数据...', 0);
    // businessDashboard.exportBdPlan({
    //   categoryId1: categorys && categorys.length >= 1 ? categorys[0] : null,
    //   categoryId2: categorys && categorys.length >= 2 ? categorys[1] : null,
    //   categoryId3: categorys && categorys.length >= 3 ? categorys[2] : null,
    //   brandId: conditions.selectedBrand,
    //   vendorId: conditions.selectedVendor,
    //   date: conditions.selectedDateRange.length ? conditions.selectedDateRange.join(',') : null
    // }).then(() => closeLoading());

    findDOMNode(this.refs.formExport).submit();
  }

  render() {
    const { store: { businessDashboard } } = this.props;
    const { conditions } = businessDashboard;
    const categorys = conditions.selectedCategory;

    const uploadProps = {
      name: 'file',
      action: `${__HOST}/bdPlan/importBdPlan`,
      // headers: {
      //   authorization: 'authorization-text',
      // },
      onChange(info) {
        // if (info.file.status !== 'uploading') {
        //   console.log(info.file, info.fileList);
        // }
        if (info.file.status === 'done') {
          Notification.success({ message: `${info.file.name} 上传成功`, duration: 1.5 });
        } else if (info.file.status === 'error') {
          Notification.error({ message: `${info.file.name} 上传失败`, duration: 1.5 });
        }
      },
    };

    const dlgTargetSettingCnt = tmpls.dlgTargetSettings(this.state, this.props, this, {
      styles,
      businessDashboard
    });

    const popUploadCnt = tmpls.popUploadCnt(this.state, this.props, this, {
      styles,
      uploadProps,
      downloadUrl: `${__HOST}/bdPlan/downloadTemplate`
    });

    const dlgTargetSettingsTitleCnt = tmpls.dlgTargetSettingsTitle(this.state, this.props, this, {
      styles,
      popUploadCnt
    });

    const dlgDownloadCnt = tmpls.dlgDownload(this.state, this.props, this, {
      styles,
      conditions,
      categoryId1: categorys && categorys.length >= 1 ? categorys[0] : '',
      categoryId2: categorys && categorys.length >= 2 ? categorys[1] : '',
      categoryId3: categorys && categorys.length >= 3 ? categorys[2] : '',
      conditionBtnContent: '导出',
      showCategory: true,
      showBrand: true,
      showVendor: true,
      showDateRange: true,
      formAction: `${__HOST}/bdPlan/exportBdPlan`
    });


    return tmpls.businessDashboard(this.state, this.props, this, {
      styles,
      dlgTargetSettingCnt,
      dlgTargetSettingsTitleCnt,
      dlgDownloadCnt,
      iconJD: require('../../images/icon-logo-jd.png'),
      iconPG: require('../../images/icon-logo-pg.png')
    });
  }
}


@registerTmpl('dashboard')
@inject('store')
@observer
class Dashboard extends Component {

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount() {


  }

  render() {
    const { store: { businessDashboard } } = this.props;

    return tmpls.dashboard(this.state, this.props, this, {
      styles,
      businessDashboard
    });
  }
}


@registerTmpl('calendar')
@inject('store')
@observer
class Calendar extends Component {

  constructor(props) {
    super(props);

    // function getVirtulData(year) {
    //   year = year || '2017';
    //   var date = +echarts.number.parseDate(year + '-01-01');
    //   var end = +echarts.number.parseDate((year) + '-02-01');
    //   var dayTime = 3600 * 24 * 1000;
    //   var data = [];
    //   for (var time = date; time < end; time += dayTime) {
    //     data.push([
    //       echarts.format.formatTime('yyyy-MM-dd', time),
    //       Math.floor(Math.random() * 1000)
    //     ]);
    //   }
    //   return data;
    // }

    const startValue = moment().subtract(30, 'days').format("MM-DD"),
      endValue = moment().subtract(1, 'days').format("MM-DD");

    this.state = {
      option: {
        grid: {
          left: '3%',
          right: '4%',
          top: '5%',
          containLabel: true
        },
        tooltip: {
          position: 'top',
          formatter: function(p) {
            var format = echarts.format.formatTime('yyyy-MM-dd', p.data[0]);
            return njs `${format}<br>{{${p.marker}}}销售额: {${p.data[1]}.('toFixed')_(2)}` ();
          },
          trigger: 'item'
        },
        calendar: [{
          cellSize: 'auto',
          orient: 'vertical',
          range: moment().format("YYYY-MM"),
          left: 100,
          right: 100,
          bottom: 40,
          dayLabel: {
            margin: 10,
            nameMap: ['日', '一', '二', '三', '四', '五', '六']
          },
          monthLabel: {
            nameMap: [
              '一月', '二月', '三月',
              '四月', '五月', '六月',
              '七月', '八月', '九月',
              '十月', '十一月', '十二月'
            ]
          },
          yearLabel: {
            margin: 40
          }
        }]
      },
      optionSalesTrends: {
        legend: {
          data: ['销售额'],
          top: 10,
          left: 'right'
        },
        tooltip: {
          formatter: p => njs `
            <div>${p[0].name}</div>
            <#each ${p}>
              {{marker}}{seriesName}：{data.('toFixed')_(2)}
              <br>
            </#each>
          ` (),
        },
        grid: {
          left: 20,
          right: 60,
          top: 50,
          bottom: 50,
          containLabel: true
        },
        yAxis: [{
          type: 'value',
        }],
        dataZoom: [{
          show: true,
          realtime: true,
          startValue,
          endValue,
          xAxisIndex: [0]
        }],
      },
    };
  }

  componentDidMount() {
    const { store: { businessDashboard } } = this.props;

    this.refs.calendar.chart.on('click', params => {
      businessDashboard.setCurrentDate(params.data[0]);
      this.props.store.businessDashboard.getCalendarTarget(params.data[0]);
    });

    //初始加载
    this.props.store.businessDashboard.getCalendarTarget(businessDashboard.currentDate);
  }

  @observable modalVisible = false;
  @autobind
  onBtnClick() {
    this.modalVisible = true;
  }

  @autobind
  onModalCancel() {
    this.modalVisible = false;
  }

  render() {
    const { store: { businessDashboard } } = this.props;

    return tmpls.calendar(this.props, this, {
      styles,
      businessDashboard,
      option: Object.assign({}, this.state.option, {
        visualMap: {
          min: 0,
          max: businessDashboard.calendarValues ? Math.max(...toJS(businessDashboard.calendarValues)) : 1000,
          calculable: true,
          orient: 'horizontal',
          top: 325,
          left: 'right',
          inRange: {
            color: ['#599699', 'rgba(235,220,184,0.4)', '#e98883']
          }
        }
      }),
      data: [{
        coordinateSystem: 'calendar',
        calendarIndex: 0,
        data: businessDashboard.calendarData ? toJS(businessDashboard.calendarData) : []
      }],
      optionSalesTrends: Object.assign({}, this.state.optionSalesTrends, {
        xAxis: [{
          type: 'category',
          data: toJS(businessDashboard.salesTrendsDate),
          axisPointer: {
            type: 'shadow'
          },
          axisLabel: {
            rotate: 45
          }
        }]
      }),
      dataSalesTrends: [{
        name: '销售额',
        data: toJS(businessDashboard.salesTrendsData)
      }]
    });
  }
}


@registerTmpl('category')
@inject('store')
@observer
class Category extends Component {

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  pageSize = 4;
  @observable currentCategory = 1;
  @observable currentBrand = 1;

  @computed get dataCategory() {
    const { store: { businessDashboard } } = this.props;
    const pageIndex = this.currentCategory,
      pageSize = this.pageSize,
      start = (pageIndex - 1) * pageSize,
      end = pageIndex * pageSize;

    return businessDashboard.categoryKpiTrackList.filter((obj, i) => {
      if (i >= start && i < end) {
        return true;
      }
    });
  }

  @autobind
  onPagingCategory(page, pageSize) {
    this.currentCategory = page;
  }

  @computed get dataBrand() {
    const { store: { businessDashboard } } = this.props;
    const pageIndex = this.currentBrand,
      pageSize = this.pageSize,
      start = (pageIndex - 1) * pageSize,
      end = pageIndex * pageSize;

    return businessDashboard.brandKpiTrackList.filter((obj, i) => {
      if (i >= start && i < end) {
        return true;
      }
    });
  }

  @autobind
  onPagingBrand(page, pageSize) {
    this.currentBrand = page;
  }

  @observable dateType = 'month';

  @autobind
  clickBtn(date) {
    return e => {
      runInAction(() => {
        this.dateType = date;
        this.currentCategory = 1;
        this.currentBrand = 1;

        const closeLoading = Message.loading('正在获取数据...', 0);
        Promise.all([
          this.props.store.businessDashboard.getCategoryKpiTrackList(date),
          this.props.store.businessDashboard.getBrandKpiTrackList(date),
        ]).then(() => closeLoading());
      });
    };
  }

  render() {
    const { store: { businessDashboard } } = this.props;

    return tmpls.category(this.props, this, {
      styles,
      businessDashboard
    });
  }
}