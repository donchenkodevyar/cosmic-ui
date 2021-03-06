import React, { useContext, useEffect, useState } from 'react';
import { createApiClient } from 'lib/api/http/apiClient';
import LoadingIndicator from 'app/components/Loading';
import isEmpty from 'lodash/isEmpty';
import { UserContext, UserContextState } from 'lib/Routes/UserProvider';
import { Chart, ChartContainerStyles } from 'app/components/ChartContainer/styles';
import { EmptyText } from 'app/components/Basic/NoDataStyles/NoDataStyles';
import { checkforNoData } from '../Performance Dashboard/filterFunctions';
import { MetricKeyValue } from '../Performance Dashboard/PacketLoss';
import { TransitMetricsLineChart } from './TransitMetricsLineChart';
import { ErrorMessage } from 'app/components/Basic/ErrorMessage/ErrorMessage';
import { TransitSelectOption } from './Transit';
import { TransitMetricsParams } from 'lib/api/http/SharedTypes';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import IconButton from 'app/components/Buttons/IconButton';
import { MetricsStyles } from '../../MetricsStyles';

interface TransitMetricChartProps {
  readonly selectedTGW: TransitSelectOption[];
  readonly timeRange: string;
  readonly metricNames: string[];
  readonly chartDataSuffix: string;
  readonly chartTitle: string;
  readonly baseMetricName: string;
  readonly expandedItem: string;
  readonly onExpandedItemChange: (value: string) => void;
}

export const TransitMetricChart: React.FC<TransitMetricChartProps> = ({ selectedTGW, timeRange, metricNames, chartDataSuffix, chartTitle, baseMetricName, expandedItem, onExpandedItemChange }) => {
  const classes = MetricsStyles();
  const [transitMetricsData, setTransitMetricsData] = useState<MetricKeyValue>({});
  const [anomalyCount, setAnomalyCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  const userContext = useContext<UserContextState>(UserContext);
  const apiClient = createApiClient(userContext.accessToken!);

  const handleExpansionItemChange = (value: string) => () => onExpandedItemChange(value);

  useEffect(() => {
    if (!isEmpty(selectedTGW) && expandedItem === baseMetricName) {
      const promises = selectedTGW.reduce((acc, item) => {
        const itemPromiseList = metricNames.map(metric => {
          const params: TransitMetricsParams = {
            startTime: timeRange,
            endTime: '-0m',
            type: item.type,
            metricNames: [metric],
            cloudExtId: item.value,
          };
          return apiClient.getTelemetryMetrics(item.label, params);
        });
        return acc.concat(itemPromiseList);
      }, []);
      setIsLoading(true);
      Promise.all(promises)
        .then(responses => {
          const newTransitMetricsData: MetricKeyValue = {};
          responses.forEach(response => {
            if (response.metrics.length > 0) {
              response.metrics.forEach(item => {
                newTransitMetricsData[`${response.name}_${item.key}`] = item.ts;
                if (item.key.includes('_anomaly')) {
                  setAnomalyCount(anomalyCount + item.ts.length);
                }
              });
            }
          });
          setIsLoading(false);
          setTransitMetricsData(newTransitMetricsData);
        })
        .catch(() => {
          setIsLoading(false);
          setIsError(true);
        });
    }

    return () => {
      setTransitMetricsData({});
      setAnomalyCount(0);
    };
  }, [timeRange, selectedTGW, expandedItem]);

  return (
    <>
      <div className={classes.pageComponentTitleContainer}>
        <div className={classes.metricComponentTitleContainer}>
          <div className={classes.pageComponentTitle}>{chartTitle}</div>
          <div className={classes.pillContainer} style={{ display: expandedItem === baseMetricName ? 'block' : 'none' }}>
            <span className={classes.pillText}>{anomalyCount}</span>
          </div>
        </div>
        <IconButton icon={expandedItem === baseMetricName ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />} onClick={handleExpansionItemChange(baseMetricName)} />
      </div>
      <ChartContainerStyles style={{ maxWidth: '100%', minHeight: 420, maxHeight: 420, display: expandedItem === baseMetricName ? 'block' : 'none' }}>
        {isEmpty(selectedTGW) ? (
          <EmptyText>To see the data select TGW</EmptyText>
        ) : isLoading ? (
          <LoadingIndicator margin="15% auto" />
        ) : isError ? (
          <ErrorMessage>Something went wrong.Please Try again</ErrorMessage>
        ) : checkforNoData(transitMetricsData) ? (
          <EmptyText>No Data</EmptyText>
        ) : (
          <Chart>
            <TransitMetricsLineChart dataValueSuffix={chartDataSuffix} selectedTGW={selectedTGW} inputData={transitMetricsData} baseMetricName={baseMetricName} />
          </Chart>
        )}
      </ChartContainerStyles>
    </>
  );
};
