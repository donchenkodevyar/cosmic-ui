import { Tab, Tabs } from '@mui/material';
import React, { useState } from 'react';
import { TabsWrapperStyles } from '../Shared/styles';
import { PerformanceDashboard } from './components/Performance Dashboard/PerformanceDashboard';
import { MetricsStyles } from './MetricsStyles';

enum TabName {
  Performance = 'Performance',
  Sites = 'Sites',
  Cloud = 'Cloud',
}
interface TabPanelProps {
  readonly title: string;
  readonly value: string;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, title, ...other }) => {
  const classes = MetricsStyles();

  return (
    <div className={classes.tabContainer} role="tabpanel" hidden={value !== title} id={`simple-tabpanel-${title}`} aria-labelledby={`simple-tab-${title}`} {...other}>
      {children}
    </div>
  );
};

function a11yProps(title: string) {
  return {
    id: `simple-tab-${title}`,
    'aria-controls': `simple-tabpanel-${title}`,
  };
}

const MetricsPage: React.FC = () => {
  const classes = MetricsStyles();

  const [selectedTabName, setSelectedTabName] = useState<TabName>(TabName.Performance);

  const handleTabChange = (event: React.SyntheticEvent, newValue: TabName) => setSelectedTabName(newValue);

  return (
    <div className={classes.metricsPageContainer}>
      <TabsWrapperStyles>
        <Tabs value={selectedTabName} onChange={handleTabChange} indicatorColor="primary">
          <Tab
            value={TabName.Performance}
            label={<span className={selectedTabName === TabName.Performance ? classes.activeTabLabel : classes.tabLabel}>{TabName.Performance}</span>}
            wrapped
            {...a11yProps(TabName.Performance)}
          />
        </Tabs>
      </TabsWrapperStyles>
      <TabPanel value={selectedTabName} title={TabName.Performance}>
        <PerformanceDashboard />
      </TabPanel>
    </div>
  );
};
export default MetricsPage;
