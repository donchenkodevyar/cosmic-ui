import { Tab, Tabs } from '@mui/material';
import { AccountVendorTypes } from 'lib/api/ApiModels/Accounts/apiModel';
import { TopoApi } from 'lib/api/ApiModels/Services/topo';
import { ModelalertType } from 'lib/api/ApiModels/Workflow/apiModel';
import { Device, MetricsTopoMap, Organization, Vnet } from 'lib/api/http/SharedTypes';
import { useGetChainData } from 'lib/api/http/useAxiosHook';
import { MetricsProvider, useMetricsActions } from 'lib/hooks/Metrics/useMetricsDataContent';
import { IObject } from 'lib/models/general';
import { UserContext, UserContextState } from 'lib/Routes/UserProvider';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { TabsWrapperStyles } from '../Shared/styles';
import { Cloud } from './components/Cloud';
import { PerformanceDashboard } from './components/Performance Dashboard/PerformanceDashboard';
import { Sites } from './components/Sites';
import { MetricsStyles } from './MetricsStyles';

export enum TabName {
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

export interface LocationState {
  readonly tabName: TabName;
  readonly deviceId: string;
  readonly destination: string;
  readonly anomalyType?: ModelalertType;
  readonly networkId?: string;
  readonly timeRange?: string;
}

const getInitialTab = (history: any, vendors: IObject<AccountVendorTypes>) => {
  if (!history || !history.location || !history.location.state) {
    return vendors.hasOwnProperty(AccountVendorTypes.CISCO_MERAKI) ? TabName.Performance : TabName.Cloud;
  }
  const state = history.location.state as LocationState;
  return state.tabName;
};

const MetricsPage: React.FC = () => {
  const classes = MetricsStyles();
  const metricsActions = useMetricsActions();
  const userContext = useContext<UserContextState>(UserContext);
  const { response, loading, error, onGetChainData } = useGetChainData<MetricsTopoMap>();
  const history = useHistory<LocationState>();
  const [networks, setNetworks] = useState<Vnet[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedTabName, setSelectedTabName] = useState<TabName>(getInitialTab(history, userContext.vendors));
  const [isAwsConfigured, setIsAwsConfigured] = useState<boolean>(false);
  const [isMerakiConfigured, setIsMerakiConfigured] = useState<boolean>(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: TabName) => setSelectedTabName(newValue);

  useEffect(() => {
    onGetChainData([TopoApi.getOnPremNetworkList(), TopoApi.getOnPremDeviceList()], ['networks', 'devices'], userContext.accessToken!);
  }, []);

  useEffect(() => {
    if (userContext.vendors) {
      setIsAwsConfigured(userContext.vendors.hasOwnProperty(AccountVendorTypes.AMAZON_AWS));
      setIsMerakiConfigured(userContext.vendors.hasOwnProperty(AccountVendorTypes.CISCO_MERAKI));
    }
  }, [userContext]);

  useEffect(() => {
    if (response) {
      setNetworks(response.networks.networks);
      setDevices(response.devices.devices);
    }
  }, [response]);

  return (
    <MetricsProvider actions={metricsActions}>
      <div className={classes.metricsPageContainer}>
        <div className={classes.fixedTabBar}>
          <TabsWrapperStyles>
            <Tabs value={selectedTabName} onChange={handleTabChange} indicatorColor="primary">
              {isMerakiConfigured && (
                <Tab
                  value={TabName.Performance}
                  label={<span className={selectedTabName === TabName.Performance ? classes.activeTabLabel : classes.tabLabel}>{TabName.Performance}</span>}
                  wrapped
                  {...a11yProps(TabName.Performance)}
                />
              )}
              {isMerakiConfigured && (
                <Tab
                  value={TabName.Sites}
                  label={<span className={selectedTabName === TabName.Sites ? classes.activeTabLabel : classes.tabLabel}>{TabName.Sites}</span>}
                  wrapped
                  {...a11yProps(TabName.Sites)}
                />
              )}
              {isAwsConfigured && (
                <Tab
                  value={TabName.Cloud}
                  label={<span className={selectedTabName === TabName.Cloud ? classes.activeTabLabel : classes.tabLabel}>{TabName.Cloud}</span>}
                  wrapped
                  {...a11yProps(TabName.Cloud)}
                />
              )}
            </Tabs>
          </TabsWrapperStyles>
        </div>
        {isMerakiConfigured && (
          <TabPanel value={selectedTabName} title={TabName.Performance}>
            <PerformanceDashboard selectedTabName={selectedTabName} networks={networks} devices={devices} orgLoading={loading} orgError={error} />
          </TabPanel>
        )}
        {isMerakiConfigured && (
          <TabPanel value={selectedTabName} title={TabName.Sites}>
            <Sites selectedTabName={selectedTabName} networks={networks} devices={devices} orgLoading={loading} orgError={error} />
          </TabPanel>
        )}
        {isAwsConfigured && (
          <TabPanel value={selectedTabName} title={TabName.Cloud}>
            <Cloud selectedTabName={selectedTabName} />
          </TabPanel>
        )}
      </div>
    </MetricsProvider>
  );
};
export default MetricsPage;
