import React from 'react';
import OverflowContainer from 'app/components/Basic/OverflowContainer/styles';
// import { useTopologyV2DataContext } from 'lib/hooks/Topology/useTopologyDataContext';
// import MetricsTab from './MetricsTab';
import { PanelHeader, PanelTabWrapper, PanelTitle } from '../../styles';
import { Tabs, Tab } from '@mui/material';
import { TabComponentProps } from 'app/components/Tabs/TabComponentProps';
import TabPanel from 'app/components/Tabs/TabPanel';
import { TabsStyles } from 'app/components/Tabs/TabsStyles';
import PolicyTab from './PolicyTab';
import { IDeviceNode } from 'lib/hooks/Topology/models';
import { ApplicationTab } from './ApplicationTab';

interface IProps {
  dataItem: IDeviceNode;
}

const DevicePanel: React.FC<IProps> = (props: IProps) => {
  const [value, setValue] = React.useState(0);
  // const [policyDisabled, setPolicyDisabled] = React.useState<boolean>(false);
  const classes = TabsStyles();

  // React.useEffect(() => {
  //   if (props.dataItem && props.dataItem.vnetworks && props.dataItem.vnetworks.length && policyDisabled) {
  //     setPolicyDisabled(false);
  //   }
  //   if (props.dataItem && (!props.dataItem.vnetworks || !props.dataItem.vnetworks.length) && !policyDisabled) {
  //     setPolicyDisabled(true);
  //     // setValue(0);
  //   }
  // }, [props.dataItem]);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };
  return (
    <>
      <PanelHeader direction="column" align="unset">
        {props.dataItem.vnetworks && props.dataItem.vnetworks.length && (
          <PanelTitle>{props.dataItem.vnetworks[0].name.length > 60 ? props.dataItem.vnetworks[0].name.substr(0, 58) + '...' : props.dataItem.vnetworks[0].name}</PanelTitle>
        )}
      </PanelHeader>
      <PanelTabWrapper>
        <Tabs
          value={value}
          onChange={handleChange}
          className={classes.tabs}
          TabIndicatorProps={{
            style: {
              background: 'var(--_hoverButtonBg)',
              boxShadow: '0px 4px 7px rgba(67, 127, 236, 0.15)',
              borderRadius: '100px',
            },
          }}
        >
          {/* <Tab disableRipple label="Metrics" classes={{ selected: classes.tabSelected }} {...TabComponentProps(0)} className={classes.tab} /> */}
          <Tab disableRipple label="Policy" classes={{ selected: classes.tabSelected }} {...TabComponentProps(0)} className={classes.tab} />
          <Tab disableRipple label="Traffic" classes={{ selected: classes.tabSelected }} {...TabComponentProps(1)} className={classes.tab} />
        </Tabs>
      </PanelTabWrapper>

      <OverflowContainer>
        <TabPanel value={value} index={0}>
          <PolicyTab dataItem={props.dataItem} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <ApplicationTab dataItem={props.dataItem} />
        </TabPanel>
      </OverflowContainer>
    </>
  );
};

export default React.memo(DevicePanel);
