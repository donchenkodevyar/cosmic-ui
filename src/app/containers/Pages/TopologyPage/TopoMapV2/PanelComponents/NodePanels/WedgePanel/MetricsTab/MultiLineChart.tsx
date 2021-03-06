import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { MultiLineMetricsData } from 'app/containers/Pages/TopologyPage/TopologyMetrics/SharedTypes';
import { DateTime } from 'luxon';
import { sortBy } from 'lodash';
import { getCorrectedTimeString } from 'app/containers/Pages/MetricsPage/components/Utils';

interface LineChartProps {
  readonly dataValueSuffix?: string;
  readonly inputData: MultiLineMetricsData[];
  readonly chartWidth?: string | number | null;
  readonly chartHeight?: string | number | null;
  readonly xAxisText?: string;
  readonly yAxisText?: string;
  readonly timeFormat?: string;
  readonly sharedMarker?: boolean;
  readonly showAdditionalTooltipItem?: boolean;
}

const INPUT_TIME_FORMAT: string = 'yyyy-MM-dd HH:mm:ss ZZZ z';

const COLOURS = [
  '#0288D1',
  '#6A1B9A',
  '#29B6F6',
  '#26A69A',
  '#558B2F',
  '#EC407A',
  '#689F38',
  '#AD1457',
  '#F48FB1',
  '#26C6DA',
  '#00695C',
  '#EF5350',
  '#E91E63',
  '#F44336',
  '#CE93D8',
  '#00838F',
  '#7E57C2',
  '#C62828',
  '#9FA8DA',
  '#80CBC4',
  '#283593',
  '#9CCC65',
  '#009688',
  '#5C6BC0',
  '#01579B',
  '#880E4F',
  '#7B1FA2',
  '#EF9A9A',
  '#C5E1A5',
  '#C2185B',
  '#0277BD',
  '#B39DDB',
  '#673AB7',
  '#AB47BC',
  '#81D4FA',
  '#303F9F',
  '#B71C1C',
  '#00BCD4',
  '#4527A0',
  '#8BC34A',
  '#80DEEA',
  '#D32F2F',
  '#512DA8',
  '#33691E',
  '#004D40',
  '#3F51B5',
  '#311B92',
  '#9C27B0',
  '#006064',
  '#00796B',
  '#03A9F4',
  '#4A148C',
  '#0097A7',
  '#1A237E',
];

export const MultiLineChart: React.FC<LineChartProps> = ({ dataValueSuffix, inputData, xAxisText, yAxisText, chartHeight, chartWidth, sharedMarker = false, showAdditionalTooltipItem = false }) => {
  const series = inputData.map(item => {
    const metrics = item.metrics.map(metric => {
      const timeString = getCorrectedTimeString(metric.time);
      const timestamp = DateTime.fromFormat(timeString, INPUT_TIME_FORMAT).toUTC();
      return { x: timestamp.toMillis(), y: Number(metric.value), additionalTooltipItemValue: item.additionalTooltipItemValue };
    });
    return {
      name: item.name,
      data: sortBy(metrics, 'x'),
    };
  });

  const turboThreshold = inputData.reduce((acc, nextValue) => acc + nextValue.metrics.length, 0);

  const lineChartOptions = {
    chart: {
      zoomType: 'x',
      height: chartHeight || null,
      width: chartWidth || null,
    },
    time: {
      useUTC: false,
    },
    title: false,
    xAxis: {
      type: 'datetime',
      labels: {
        autoRotation: 0,
      },
      title: {
        text: xAxisText,
      },
    },
    tooltip: {
      shared: sharedMarker,
      crosshairs: sharedMarker,
      useHTML: true,
      pointFormat: showAdditionalTooltipItem
        ? `<div><div><b>{point.additionalTooltipItemValue}</b></div><div></div><b>Value </b>{point.y:,.0f}</div>`
        : `<div><div><b>{series.name}</b><div><b>Value </b>{point.y:,.0f}</div></div></div>`,
      valueSuffix: dataValueSuffix ? ` ${dataValueSuffix}` : '',
    },
    plotOptions: {
      series: {
        turboThreshold: turboThreshold,
        marker: {
          enabled: false,
        },
      },
    },
    yAxis: {
      title: {
        text: yAxisText,
      },
      labels: {
        format: dataValueSuffix ? `{text} ${dataValueSuffix}` : `{text}`,
      },
    },
    legend: false,
    credits: {
      enabled: false,
    },
    colors: COLOURS,
    series: series,
  };

  return <HighchartsReact highcharts={Highcharts} options={lineChartOptions} />;
};
