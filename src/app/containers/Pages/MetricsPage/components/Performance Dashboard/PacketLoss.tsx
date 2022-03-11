import React, { useContext, useEffect, useRef, useState } from 'react';
import { createApiClient } from 'lib/api/http/apiClient';
import { PerformanceDashboardStyles } from './PerformanceDashboardStyles';
import { MetricsLineChart } from './MetricsLineChart';
import LoadingIndicator from 'app/components/Loading';
import { LegendData } from './Heatmap';
import isEmpty from 'lodash/isEmpty';
import { UserContext, UserContextState } from 'lib/Routes/UserProvider';
import { Chart, ChartContainerStyles } from 'app/components/ChartContainer/styles';
import { EmptyText } from 'app/components/Basic/NoDataStyles/NoDataStyles';
import { useHistory } from 'react-router-dom';
import { LocationState } from '../..';
import { ModelalertType } from 'lib/api/ApiModels/Workflow/apiModel';
import { checkforNoData } from './filterFunctions';
import { SelectedNetworkMetricsData } from './PerformanceDashboard';

interface PacketLossProps {
  readonly selectedNetworksMetricsData: SelectedNetworkMetricsData[];
  readonly timeRange: string;
}

interface DataMetrics {
  readonly time: string;
  readonly value: string;
}

export interface MetricKeyValue {
  [id: string]: DataMetrics[];
}

export interface TestIdToName {
  [id: string]: string;
}

const PACKET_LOSS = 'packetloss';
const PACKET_LOSS_ANOMALY = 'packetloss_anomaly';
const PACKET_LOSS_LOWERBOUND = 'packetloss_lowerbound';
const PACKET_LOSS_UPPERBOUND = 'packetloss_upperbound';
const PACKET_LOSS_THRESHOLD = 'packetloss_threshold';

export const PACKET_LOSS_HEATMAP_LEGEND: LegendData[] = [
  {
    low: 0,
    high: 20,
    color: '#52984E',
  },
  {
    low: 21,
    high: 50,
    color: '#FED0AB',
  },
  {
    low: 51,
    high: 75,
    color: '#FFC568',
  },
  {
    low: 75,
    high: Infinity,
    color: '#DC4545',
  },
];

export const PacketLoss: React.FC<PacketLossProps> = ({ selectedNetworksMetricsData, timeRange }) => {
  const classes = PerformanceDashboardStyles();
  const [packetLossData, setPacketLossData] = useState<MetricKeyValue>({});
  const [anomalyCount, setAnomalyCount] = useState<number>(0);

  const userContext = useContext<UserContextState>(UserContext);
  const apiClient = createApiClient(userContext.accessToken!);

  const history = useHistory();
  const scrollRef = useRef(null);

  useEffect(() => {
    if (history && history && history.location.state) {
      const state = history.location.state as LocationState;
      if (state.anomalyType === ModelalertType.ANOMALY_PACKETLOSS) {
        scrollRef.current.scrollIntoView();
      }
    }
  }, []);

  useEffect(() => {
    const getPacketLossMetrics = async () => {
      const packetLossChartData: MetricKeyValue = {};
      let totalAnomalyCount = 0;
      const promises = selectedNetworksMetricsData.map(row => apiClient.getPacketLossMetrics(row.deviceString, row.destination, timeRange, row.label));
      Promise.all(promises).then(values => {
        values.forEach(item => {
          const anomalyArray = item.metrics.keyedmap.find(item => item.key === PACKET_LOSS_ANOMALY)?.ts || [];
          totalAnomalyCount = totalAnomalyCount + anomalyArray.length;
          packetLossChartData[item.testId] = item.metrics.keyedmap.find(item => item.key === PACKET_LOSS)?.ts || [];
          packetLossChartData[`${item.testId}_anomaly`] = anomalyArray;
          packetLossChartData[`${item.testId}_upperbound`] = item.metrics.keyedmap.find(item => item.key === PACKET_LOSS_UPPERBOUND)?.ts || [];
          packetLossChartData[`${item.testId}_lowerbound`] = item.metrics.keyedmap.find(item => item.key === PACKET_LOSS_LOWERBOUND)?.ts || [];
          packetLossChartData[`${item.testId}_threshold`] = item.metrics.keyedmap.find(item => item.key === PACKET_LOSS_THRESHOLD)?.ts || [];
        });
        setPacketLossData(packetLossChartData);
        setAnomalyCount(totalAnomalyCount);
      });
    };

    getPacketLossMetrics();

    return () => {
      setPacketLossData({});
    };
  }, [selectedNetworksMetricsData, timeRange]);

  return (
    <>
      <div ref={scrollRef} className={classes.metricComponentTitleContainer}>
        <div className={classes.pageComponentTitle}>Packet Loss summary</div>
        <div className={classes.pillContainer}>
          <span className={classes.pillText}>{anomalyCount}</span>
        </div>
      </div>
      <ChartContainerStyles style={{ maxWidth: '100%', minHeight: 420, maxHeight: 420 }}>
        {!isEmpty(selectedNetworksMetricsData) ? (
          // packetLossData contains 5 keys for each row. One for the data, one for anomaly, one for upperbound,one for lowerbound and one for threshold
          Object.keys(packetLossData).length / 5 === selectedNetworksMetricsData.length ? (
            checkforNoData(packetLossData) ? (
              <EmptyText>No Data</EmptyText>
            ) : (
              <Chart>
                <MetricsLineChart dataValueSuffix="%" selectedNetworksMetricsData={selectedNetworksMetricsData} inputData={packetLossData} />
              </Chart>
            )
          ) : (
            <LoadingIndicator margin="auto" />
          )
        ) : (
          <EmptyText>To see the data select SLA Tests</EmptyText>
        )}
      </ChartContainerStyles>
    </>
  );
};
