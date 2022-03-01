import React, { useContext, useEffect, useState } from 'react';
import { createApiClient } from 'lib/api/http/apiClient';
import { PerformanceDashboardStyles } from './PerformanceDashboardStyles';
import { MetricsLineChart } from './MetricsLineChart';
import InfoIcon from '../../icons/performance dashboard/info';
import { MetricKeyValue, TestIdToName } from './PacketLoss';
import { Data } from './Table';
import isEmpty from 'lodash/isEmpty';
import { UserContext, UserContextState } from 'lib/Routes/UserProvider';
import LoadingIndicator from 'app/components/Loading';
import { HeatMapData, Vnet } from 'lib/api/http/SharedTypes';
import Heatmap, { LegendData } from './Heatmap';
import { GridLabel } from 'app/containers/Pages/TrafficPage/SessionPage/Table/styles';
import { Chart, ChartContainerStyles } from 'app/components/ChartContainer/styles';

interface GoodputProps {
  readonly selectedRows: Data[];
  readonly timeRange: string;
  readonly networks: Vnet[];
}

const GOODPUT = 'goodput';
const GOODPUT_ANOMALY = 'goodput_anomaly';
const GOODPUT_LOWERBOUND = 'goodput_lowerbound';
const GOODPUT_UPPERBOUND = 'goodput_upperbound';
const GOODPUT_THRESHOLD = 'goodput_threshold';

export const GOODPUT_HEATMAP_LEGEND: LegendData[] = [
  {
    low: 100,
    high: Infinity,
    color: '#52984E',
  },
  {
    low: 75,
    high: 99.99,
    color: '#FED0AB',
  },
  {
    low: 25,
    high: 74.99,
    color: '#FFC568',
  },
  {
    low: 10,
    high: 24.99,
    color: '#F69442',
  },
  {
    low: 0,
    high: 9.99,
    color: '#DC4545',
  },
];

export const Goodput: React.FC<GoodputProps> = ({ selectedRows, timeRange, networks }) => {
  const classes = PerformanceDashboardStyles();

  const [goodputData, setGoodputData] = useState<MetricKeyValue>({});
  const [anomalyCount, setAnomalyCount] = useState<number>(0);
  const [heatMapGoodput, setHeatMapGoodput] = useState<HeatMapData[]>([]);

  const userContext = useContext<UserContextState>(UserContext);

  const apiClient = createApiClient(userContext.accessToken!);

  const testIdToName: TestIdToName = selectedRows.reduce((accu, nextValue) => {
    accu[nextValue.id] = nextValue.name;
    return accu;
  }, {});

  useEffect(() => {
    const getGoodputMetrics = async () => {
      const goodputChartData: MetricKeyValue = {};
      let totalAnomalyCount = 0;
      const promises = selectedRows.map(row => apiClient.getGoodputMetrics(row.sourceDevice, row.destination, timeRange, row.id));
      Promise.all(promises).then(values => {
        values.forEach(item => {
          const anomalyArray = item.metrics.keyedmap.find(item => item.key === GOODPUT_ANOMALY)?.ts || [];
          totalAnomalyCount = totalAnomalyCount + anomalyArray.length;
          goodputChartData[item.testId] = item.metrics.keyedmap.find(item => item.key === GOODPUT)?.ts || [];
          goodputChartData[`${item.testId}_anomaly`] = item.metrics.keyedmap.find(item => item.key === GOODPUT_ANOMALY)?.ts || [];
          goodputChartData[`${item.testId}_upperbound`] = item.metrics.keyedmap.find(item => item.key === GOODPUT_UPPERBOUND)?.ts || [];
          goodputChartData[`${item.testId}_lowerbound`] = item.metrics.keyedmap.find(item => item.key === GOODPUT_LOWERBOUND)?.ts || [];
          goodputChartData[`${item.testId}_threshold`] = item.metrics.keyedmap.find(item => item.key === GOODPUT_THRESHOLD)?.ts || [];
        });
        setGoodputData(goodputChartData);
        setAnomalyCount(totalAnomalyCount);
      });
    };
    const getHeatMapGoodput = async () => {
      const promises = selectedRows.map(row => {
        const rowNetworkId = networks.find(network => network.name === row.sourceNetwork)?.extId || '';
        return apiClient.getHeatmapGoodput(rowNetworkId, row.destination, timeRange, row.id);
      });
      Promise.all(promises).then(values => {
        const heatMapGoodput: HeatMapData[] = values.map(item => ({
          testId: item.testId,
          metrics: item.avgMetric.resourceMetric,
        }));
        setHeatMapGoodput(heatMapGoodput);
      });
    };

    getGoodputMetrics();
    getHeatMapGoodput();

    return () => {
      setGoodputData({});
      setHeatMapGoodput([]);
    };
  }, [selectedRows, timeRange]);

  return (
    <div className={classes.pageComponentBackground}>
      <div className={classes.pageComponentTitleContainer}>
        <div className={classes.pageComponentTitle}>Goodput summary</div>
        <div className={classes.pillContainer}>
          <span className={classes.pillText}>{anomalyCount}</span>
        </div>
      </div>
      <ChartContainerStyles style={{ maxWidth: '100%', minHeight: 420, maxHeight: 420 }}>
        {!isEmpty(selectedRows) ? (
          // goodputData contains 5 keys for each row. One for the data, one for anomaly, one for upperbound,one for lowerbound and one for threshold
          Object.keys(goodputData).length / 5 === selectedRows.length ? (
            <Chart>
              <MetricsLineChart dataValueSuffix="mbps" selectedRows={selectedRows} inputData={goodputData} />
            </Chart>
          ) : (
            <div className={classes.noChartContainer}>
              <LoadingIndicator />
            </div>
          )
        ) : (
          <div className={classes.noChartContainer}>
            <span className={classes.noChartText}>To see the data select SLA Tests on top</span>
          </div>
        )}
      </ChartContainerStyles>
    </div>
  );
};
