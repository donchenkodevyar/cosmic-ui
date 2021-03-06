import React from 'react';
import { AnalyticsStyles } from '../../AnalyticsStyles';
import { DimensionOptions } from './Dimensions';
import { Button, Typography } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { getDimensionCount } from './MetricsExplorer';
import { MetricsTable } from './MetricsTable';
import { MetricsExplorerTableData } from 'lib/api/http/SharedTypes';

interface MetricsChartProps {
  readonly dimensions: DimensionOptions[];
  readonly tableData: MetricsExplorerTableData[];
  readonly dataUnit: string;
  readonly lookback: string;
}

const DEFAULT_CONTAINER_TITLE = 'Metrics';

export const MetricsChart: React.FC<MetricsChartProps> = ({ dimensions, tableData, dataUnit, lookback }) => {
  const classes = AnalyticsStyles();

  const getChartContainerTitle = (dimensions: DimensionOptions[]) => {
    if (getDimensionCount(dimensions) === 0) {
      return DEFAULT_CONTAINER_TITLE;
    }
    const allSources: string[] = dimensions.reduce((acc, nextValue) => acc.concat(nextValue.source.map(item => `${item.label} Source`)), []);
    const allDestinations: string[] = dimensions.reduce((acc, nextValue) => acc.concat(nextValue.destination.map(item => `${item.label} Destination`)), []);
    const allDimensions = allSources.concat(allDestinations);
    return allDimensions.join(',');
  };

  return (
    <>
      <div className={classes.fixedPosition}>
        <div className={classes.metricsChartTitleContainer}>
          <div className={`${classes.leftContainerTitle} ${classes.overflowXHide}`}>{getChartContainerTitle(dimensions)}</div>
          <div>
            <Button className={classes.otherButton} variant="contained" disableElevation>
              <Typography className={classes.otherButtonText} noWrap>
                REFRESH
              </Typography>
              <RefreshIcon />
            </Button>
          </div>
        </div>
        <div className={classes.metricsChartSubtitle}>{lookback}</div>
      </div>
      <div className={classes.metricsChartContents}>
        {getDimensionCount(dimensions) === 0 ? (
          <div className={classes.noChartContainer}>
            <Typography className={classes.noChartText}>To see the data select dimensions on the right.</Typography>
          </div>
        ) : (
          <div>
            <div className={classes.noChartContainer}>Placeholder for Chart</div>
            <MetricsTable dimensions={dimensions} tableData={tableData} dataUnit={dataUnit} />
          </div>
        )}
      </div>
    </>
  );
};
