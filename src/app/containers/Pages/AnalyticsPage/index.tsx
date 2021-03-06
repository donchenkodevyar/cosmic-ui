import React, { useState } from 'react';
import { Tab, Tabs } from '@mui/material';
import { AnalyticsStyles } from './AnalyticsStyles';
import { Anomalies } from './components/Anomalies/Anomalies';
// import { MetricsExplorer } from './components/Metrics Explorer/MetricsExplorer';
import { PolicyLogs } from '../TroubleshootingPage/PolicyLogs';

interface TabPanelProps {
  readonly title: string;
  readonly value: string;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, title, ...other }) => {
  const classes = AnalyticsStyles();

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

enum TabName {
  Anomalies = 'Anomalies',
  PolicyLogs = 'Policy Logs',
  // MetricsExplorer = 'Metrics Explorer',
}

const AnalyticsPage: React.FC = () => {
  const classes = AnalyticsStyles();

  const [selectedTabName, setSelectedTabName] = useState<TabName>(TabName.Anomalies);

  const handleTabChange = (event: React.SyntheticEvent, newValue: TabName) => setSelectedTabName(newValue);

  return (
    <div className={classes.analyticsContainer}>
      <div className={classes.fixedTabBar}>
        <Tabs value={selectedTabName} onChange={handleTabChange} indicatorColor="primary">
          <Tab
            value={TabName.Anomalies}
            label={<span className={selectedTabName === TabName.Anomalies ? classes.activeTabLabel : classes.tabLabel}>{TabName.Anomalies}</span>}
            wrapped
            disableRipple
            {...a11yProps(TabName.Anomalies)}
          />
          <Tab
            value={TabName.PolicyLogs}
            label={<span className={selectedTabName === TabName.PolicyLogs ? classes.activeTabLabel : classes.tabLabel}>{TabName.PolicyLogs}</span>}
            wrapped
            disableRipple
            {...a11yProps(TabName.PolicyLogs)}
          />
          {/* <Tab
              value={TabName.MetricsExplorer}
              label={<span className={selectedTabName === TabName.MetricsExplorer ? classes.activeTabLabel : classes.tabLabel}>{TabName.MetricsExplorer}</span>}
              wrapped
              {...a11yProps(TabName.MetricsExplorer)}
            /> */}
        </Tabs>
      </div>
      <TabPanel value={selectedTabName} title={TabName.Anomalies}>
        {selectedTabName === TabName.Anomalies && <Anomalies />}
      </TabPanel>
      <TabPanel value={selectedTabName} title={TabName.PolicyLogs}>
        {selectedTabName === TabName.PolicyLogs && <PolicyLogs />}
      </TabPanel>
      {/* <TabPanel value={selectedTabName} title={TabName.MetricsExplorer}>
          <MetricsExplorer />
        </TabPanel> */}
    </div>
  );
};

export default React.memo(AnalyticsPage);
