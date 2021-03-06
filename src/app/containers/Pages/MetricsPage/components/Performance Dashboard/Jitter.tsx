import React, { useContext, useEffect, useRef, useState } from 'react';
import { createApiClient } from 'lib/api/http/apiClient';
import { MetricsLineChart } from './MetricsLineChart';
import { EscalationCorelation, MetricKeyValue } from './PacketLoss';
import isEmpty from 'lodash/isEmpty';
import { UserContext, UserContextState } from 'lib/Routes/UserProvider';
import LoadingIndicator from 'app/components/Loading';
import { Chart, ChartContainerStyles } from 'app/components/ChartContainer/styles';
import { useHistory } from 'react-router-dom';
import { LocationState } from '../..';
import { ModelalertType } from 'lib/api/ApiModels/Workflow/apiModel';
import { checkforNoData } from './filterFunctions';
import { EmptyText } from 'app/components/Basic/NoDataStyles/NoDataStyles';
import { LegendData, SelectedNetworkMetricsData } from './PerformanceDashboard';
import { GENERAL_TIME_RANGE_QUERY_TYPES } from 'lib/api/ApiModels/paramBuilders';
import { AlertApi } from 'lib/api/ApiModels/Services/alert';
import { NetworkAlertChainResponse, NetworkAlertLogParams, Data } from 'lib/api/http/SharedTypes';
import { useGetChainData } from 'lib/api/http/useAxiosHook';
import { getCorrectedTimeString } from '../Utils';
import { MetricsStyles } from '../../MetricsStyles';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import IconButton from 'app/components/Buttons/IconButton';

interface JitterProps {
  readonly selectedNetworksMetricsData: SelectedNetworkMetricsData[];
  readonly timeRange: string;
  readonly expandedItem: string;
  readonly baseMetricName: string;
  readonly onExpandedItemChange: (value: string) => void;
}

const JITTER = 'jitter';
const JITTER_ANOMALY = 'jitter_anomaly';
const JITTER_LOWERBOUND = 'jitter_lowerbound';
const JITTER_UPPERBOUND = 'jitter_upperbound';
const JITTER_THRESHOLD = 'jitter_threshold';

const FIELD_ARRAY = [JITTER, JITTER_LOWERBOUND, JITTER_UPPERBOUND, JITTER_THRESHOLD];

export const JITTER_HEATMAP_LEGEND: LegendData[] = [
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

export const Jitter: React.FC<JitterProps> = ({ selectedNetworksMetricsData, timeRange, baseMetricName, expandedItem, onExpandedItemChange }) => {
  const classes = MetricsStyles();
  const { response, onGetChainData } = useGetChainData<NetworkAlertChainResponse>();
  const [escalationjitterData, setEscalationJitterData] = useState<MetricKeyValue>({});
  const [escalationCorelation, setEscalationCorelation] = useState<EscalationCorelation[]>([]);
  const [jitterData, setJitterData] = useState<MetricKeyValue>({});
  const [anomalyJitterData, setAnomalyJitterData] = useState<MetricKeyValue>({});
  const [anomalyCount, setAnomalyCount] = useState<number>(0);

  const userContext = useContext<UserContextState>(UserContext);

  const apiClient = createApiClient(userContext.accessToken!);

  const history = useHistory();
  const scrollRef = useRef(null);

  const handleExpansionItemChange = (value: string) => () => onExpandedItemChange(value);

  const getJitterAnomalies = async () => {
    const jitterChartData: MetricKeyValue = {};
    let totalAnomalyCount = 0;

    const promises = selectedNetworksMetricsData.reduce((acc, row) => {
      const networkApiList = row.deviceString ? apiClient.getJitterMetrics(row.deviceString, row.destination, timeRange, `${row.label}_${JITTER_ANOMALY}`, JITTER_ANOMALY) : [];
      return acc.concat(networkApiList);
    }, []);

    Promise.all(promises).then(values => {
      if (!isEmpty(values)) {
        selectedNetworksMetricsData.forEach(network => {
          const responseItem = values.find(item => item?.testId === `${network.label}_${JITTER_ANOMALY}`);
          if (responseItem) {
            const anomalyArray = responseItem.metrics.keyedmap.find(item => item.key === JITTER_ANOMALY)?.ts || [];
            totalAnomalyCount = totalAnomalyCount + anomalyArray.length;
            jitterChartData[`${network.label}_anomaly`] = anomalyArray;
          }
        });
      }
      setAnomalyJitterData(jitterChartData);
      setAnomalyCount(totalAnomalyCount);
    });
  };

  const getJitterMetrics = async () => {
    const jitterChartData: MetricKeyValue = {};

    const promises = selectedNetworksMetricsData.reduce((acc, row) => {
      const networkApiList = row.deviceString ? FIELD_ARRAY.map(field => apiClient.getJitterMetrics(row.deviceString, row.destination, timeRange, `${row.label}_${field}`, field)) : [];
      return acc.concat(networkApiList);
    }, []);

    Promise.all(promises).then(values => {
      if (!isEmpty(values)) {
        selectedNetworksMetricsData.forEach(network => {
          FIELD_ARRAY.forEach(field => {
            const responseItem = values.find(item => item?.testId === `${network.label}_${field}`);
            if (responseItem) {
              if (field === JITTER) {
                jitterChartData[network.label] = responseItem.metrics.keyedmap.find(item => item.key === JITTER)?.ts || [];
              } else if (field === JITTER_LOWERBOUND) {
                jitterChartData[`${network.label}_lowerbound`] = responseItem.metrics.keyedmap.find(item => item.key === JITTER_LOWERBOUND)?.ts || [];
              } else if (field === JITTER_UPPERBOUND) {
                jitterChartData[`${network.label}_upperbound`] = responseItem.metrics.keyedmap.find(item => item.key === JITTER_UPPERBOUND)?.ts || [];
              } else {
                jitterChartData[`${network.label}_threshold`] = responseItem.metrics.keyedmap.find(item => item.key === JITTER_THRESHOLD)?.ts || [];
              }
            }
          });
        });
      }
      setJitterData(jitterChartData);
    });
  };

  useEffect(() => {
    if (history && history && history.location.state) {
      const state = history.location.state as LocationState;
      if (state.anomalyType === ModelalertType.ANOMALY_JITTER) {
        scrollRef.current.scrollIntoView();
      }
    }
  }, []);

  useEffect(() => {
    if (!isEmpty(selectedNetworksMetricsData) && expandedItem === baseMetricName) {
      const params: NetworkAlertLogParams = {
        alert_type: ModelalertType.ANOMALY_JITTER,
        time_range: timeRange === '-1d' ? GENERAL_TIME_RANGE_QUERY_TYPES.LAST_DAY : GENERAL_TIME_RANGE_QUERY_TYPES.LAST_WEEK,
        alert_state: 'ACTIVE',
      };
      onGetChainData(
        selectedNetworksMetricsData.map(network => AlertApi.getAlertLogsByNetwork(network.value)),
        selectedNetworksMetricsData.map(network => network.value),
        userContext.accessToken!,
        params,
      );

      getJitterMetrics();
    }

    return () => {
      setJitterData({});
    };
  }, [selectedNetworksMetricsData, timeRange, expandedItem]);

  useEffect(() => {
    if (!isEmpty(selectedNetworksMetricsData)) {
      getJitterAnomalies();
    }

    return () => {
      setAnomalyCount(0);
    };
  }, [selectedNetworksMetricsData, timeRange]);

  useEffect(() => {
    const escalationLatencyData: MetricKeyValue = {};
    const totalCorelations: EscalationCorelation[] = [];
    selectedNetworksMetricsData.forEach(network => {
      const networkMetrics: Data[] = response[network.value].alerts.map(alert => ({ time: getCorrectedTimeString(alert.timestamp), value: alert.value.toString() || null }));
      escalationLatencyData[`${network.label}_escalation`] = networkMetrics;
      response[network.value].alerts.forEach(alert => {
        totalCorelations.push({
          networkId: network.value,
          timestamp: getCorrectedTimeString(alert.timestamp),
          corelation: isEmpty(alert.correlations)
            ? { timestamp: '', event: 'No Cellular Failover detected' }
            : { timestamp: getCorrectedTimeString(alert.correlations[0].timestamp), event: 'Cellular Failover' },
        });
      });
    });
    setEscalationJitterData(escalationLatencyData);
    setEscalationCorelation(totalCorelations);
  }, [response]);

  return (
    <>
      <div ref={scrollRef} className={classes.pageComponentTitleContainer}>
        <div className={classes.metricComponentTitleContainer}>
          <div className={classes.pageComponentTitle}>Jitter summary</div>
          <div className={classes.pillContainer}>
            <span className={classes.pillText}>{anomalyCount}</span>
          </div>
        </div>
        <IconButton icon={expandedItem === baseMetricName ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />} onClick={handleExpansionItemChange(baseMetricName)} />
      </div>
      <ChartContainerStyles style={{ maxWidth: '100%', minHeight: 420, maxHeight: 420, display: expandedItem === baseMetricName ? 'block' : 'none' }}>
        {!isEmpty(selectedNetworksMetricsData) ? (
          // goodputData contains 6 keys for each row. One for the data, one for anomaly, one for upperbound,one for lowerbound, one for threshold and one for escalation
          Object.keys({ ...jitterData, ...escalationjitterData, ...anomalyJitterData }).length / 6 === selectedNetworksMetricsData.length ? (
            checkforNoData({ ...jitterData, ...escalationjitterData, ...anomalyJitterData }) ? (
              <EmptyText>No Data</EmptyText>
            ) : (
              <Chart>
                <MetricsLineChart
                  dataValueSuffix="ms"
                  selectedNetworksMetricsData={selectedNetworksMetricsData}
                  inputData={{ ...jitterData, ...escalationjitterData, ...anomalyJitterData }}
                  escalationCorelation={escalationCorelation}
                />
              </Chart>
            )
          ) : (
            <LoadingIndicator margin="10% auto" />
          )
        ) : (
          <EmptyText style={{ margin: '13% auto' }}>To see the data select networks on top</EmptyText>
        )}
      </ChartContainerStyles>
    </>
  );
};
