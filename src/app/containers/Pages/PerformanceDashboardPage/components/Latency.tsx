import { Typography } from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import { createApiClient } from 'lib/api/http/apiClient';
import { PerformanceDashboardStyles } from '../PerformanceDashboardStyles';
import { MetricsLineChart } from './MetricsLineChart';
import InfoIcon from '../icons/info.svg';
import LoadingIndicator from '../../../../components/Loading';
import { MetricKeyValue, TestIdToName } from './PacketLoss';
import { Data } from './Table';
import Heatmap, { LegendData } from './Heatmap';
import { HeatMapData } from 'lib/api/http/SharedTypes';
import { isEmpty } from 'lodash';
import { UserContext, UserContextState } from 'lib/Routes/UserProvider';

interface LatencyProps {
  readonly selectedRows: Data[];
  readonly timeRange: string;
}

const LATENCY = 'latency';
const LATENCY_ANOMALY = 'latency_anomaly';

const LATENCY_HEATMAP_LEGEND: LegendData[] = [
  {
    low: 0,
    high: 30,
    color: '#52984E',
  },
  {
    low: 30,
    high: 50,
    color: '#FED0AB',
  },
  {
    low: 50,
    high: 80,
    color: '#FFC568',
  },
  {
    low: 80,
    high: 120,
    color: '#F69442',
  },
  {
    low: 120,
    high: Infinity,
    color: '#DC4545',
  },
];

export const Latency: React.FC<LatencyProps> = ({ selectedRows, timeRange }) => {
  const classes = PerformanceDashboardStyles();

  const [latencyData, setLatencyData] = useState<MetricKeyValue>({});
  const [heatMapLatency, setHeatMapLatency] = useState<HeatMapData[]>([]);

  const userContext = useContext<UserContextState>(UserContext);
  const apiClient = createApiClient(userContext.idToken!);

  const testIdToName: TestIdToName = selectedRows.reduce((accu, nextValue) => {
    accu[nextValue.id] = nextValue.name;
    return accu;
  }, {});

  useEffect(() => {
    const getLatencyMetrics = async () => {
      const latencyChartData: MetricKeyValue = {};
      const promises = selectedRows.map(row => apiClient.getLatencyMetrics(row.sourceDevice, row.destination, timeRange, row.id));
      Promise.all(promises).then(values => {
        values.forEach(item => {
          latencyChartData[item.testId] = item.metrics.keyedmap.find(item => item.key === LATENCY)?.ts || [];
          latencyChartData[`${item.testId}_anomaly`] = item.metrics.keyedmap.find(item => item.key === LATENCY_ANOMALY)?.ts || [];
        });
        setLatencyData(latencyChartData);
      });
    };

    const getHeatMapLatency = async () => {
      const promises = selectedRows.map(row => apiClient.getHeatmapLatency(row.sourceNetwork, row.destination, timeRange, row.id));
      Promise.all(promises).then(values => {
        const heatMapLatency: HeatMapData[] = values.map(item => {
          return {
            testId: item.testId,
            metrics: item.avgMetric.resourceMetric,
          };
        });
        setHeatMapLatency(heatMapLatency);
      });
    };

    getLatencyMetrics();
    getHeatMapLatency();

    return () => {
      setLatencyData({});
      setHeatMapLatency([]);
    };
  }, [selectedRows, timeRange]);

  return (
    <div>
      <div className={classes.flexContainer}>
        <div>
          <Typography className={classes.itemTitle}>
            Latency summary
            <span className={classes.sortIcon}>
              <img src={InfoIcon} alt="ínfo" />
            </span>
          </Typography>
          <Typography className={classes.subTitleText}>Shows aggregated latency between sources.</Typography>
        </div>
      </div>
      <div className={classes.lineChartContainer}>
        {!isEmpty(selectedRows) ? (
          // latencyData contains 2 keys for each row. One for the data and one for anomaly
          Object.keys(latencyData).length / 2 === selectedRows.length ? (
            <MetricsLineChart dataValueSuffix="ms" selectedRows={selectedRows} inputData={latencyData} />
          ) : (
            <div className={classes.noChartContainer}>
              <LoadingIndicator />
            </div>
          )
        ) : (
          <div className={classes.noChartContainer}>
            <Typography className={classes.noChartText}>To see the data select SLA Tests on top</Typography>
          </div>
        )}
      </div>
      <hr className={classes.hrLine} />
      <div className={classes.flexContainer}>
        <div>
          <Typography className={classes.itemTitle}>
            Median latency
            <span className={classes.sortIcon}>
              <img src={InfoIcon} alt="ínfo" />
            </span>
          </Typography>
          <Typography className={classes.subTitleText}>Shows aggregated latency between branches and applications.</Typography>
        </div>
      </div>
      <div className={classes.lineChartContainer}>
        {!isEmpty(selectedRows) ? (
          heatMapLatency.length === selectedRows.length ? (
            <Heatmap data={heatMapLatency} selectedRows={testIdToName} legendData={LATENCY_HEATMAP_LEGEND} dataSuffix="ms" />
          ) : (
            <div className={classes.noChartContainer}>
              <LoadingIndicator />
            </div>
          )
        ) : (
          <div className={classes.noChartContainer}>
            <Typography className={classes.noChartText}>To see the data select SLA Tests on top</Typography>
          </div>
        )}
      </div>
    </div>
  );
};
