/**
 * Created by gaojian3 on 2017/7/10.
 */

import { GetDevicePixelRatio } from '../utils/utils';

const ConfigApp = {
  home: {
    funcsPerRow: 4
  }
};

const DPR = GetDevicePixelRatio();
const ConfigDPR = {
  DPR: DPR,
  fontSizeTitle: 14 * DPR,
  fontSizeNormal: 12 * DPR
};

const ConfigMQCanlendar = {
  splitLine: {
    lineStyle: {
      width: 1 * ConfigDPR.DPR
    }
  },
  dayLabel: {
    nameMap: 'cn',
    textStyle: {
      fontSize: ConfigDPR.fontSizeNormal
    }
  },
  monthLabel: {
    nameMap: 'cn',
    textStyle: {
      fontSize: ConfigDPR.fontSizeNormal
    }
  },
  yearLabel: {
    position: 'top',
    textStyle: {
      fontSize: ConfigDPR.fontSizeNormal
    }
  }
};
const ConfigMQVisualMap = {
  itemWidth: 20 * ConfigDPR.DPR,
  itemHeight: 140 * ConfigDPR.DPR,
  textStyle: {
    fontSize: ConfigDPR.fontSizeNormal
  }
};

const ConfigChart = {
  baseOption: {
    title: {},
    legend: {
      icon: 'roundRect',
      textStyle: {
        fontSize: ConfigDPR.fontSizeNormal
      }
    },
    grid: {
      left: 10,
      top: 10,
      right: 10,
      bottom: 10,
      containLabel: true
    },
    tooltip: {
      confine: true
    },
    xAxis: {},
    yAxis: {},
    series: [],
    color: [
      '#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'
    ]
  },
  media: [
    {
      option: {
        title: {
          textStyle: {
            fontSize: 16
          }
        },
        xAxis: {
          nameLocation: 'end',
          nameGap: 10,
          splitNumber: 5,
          splitLine: {
            show: true
          }
        }
      }
    }, {
      //query: {maxWidth: 1200, minWidth: 479},
      query: {},
      option: {
        title: {
          textStyle: {
            fontSize: ConfigDPR.fontSizeTitle
          }
        },
        legend: {
          textStyle: {
            fontSize: ConfigDPR.fontSizeNormal
          },
          itemWidth: 12 * DPR,
          itemHeight: 12 * DPR
        },
        tooltip: {
          textStyle: {
            fontSize: 'inherit'
          }
        },
        xAxis: {
          nameLocation: 'end',
          nameTextStyle: {
            fontSize: ConfigDPR.fontSizeNormal
          },/*
           nameGap: 10,
           splitNumber: 5,
           splitLine: {
           show: true
           },*/
          axisLabel: {
            textStyle: {
              fontSize: ConfigDPR.fontSizeNormal
            }
          }
        },
        yAxis: {
          nameLocation: 'end',
          nameTextStyle: {
            fontSize: ConfigDPR.fontSizeNormal
          },
          axisLabel: {
            textStyle: {
              fontSize: ConfigDPR.fontSizeNormal
            }
          }
        }
      }
    }
  ]
};

export {
  ConfigDPR,
  ConfigMQCanlendar,
  ConfigMQVisualMap,
  ConfigChart
};