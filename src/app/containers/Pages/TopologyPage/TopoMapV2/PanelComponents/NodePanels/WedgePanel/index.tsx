import React from 'react';
import { PanelHeader, PanelTabWrapper, PanelTitle, SubPanelTitle } from '../../styles';
import OverflowContainer from 'app/components/Basic/OverflowContainer/styles';
import RoutesTab from './RoutesTab';
import { ITGWNode } from 'lib/hooks/Topology/models';
import { Tab, Tabs } from '@mui/material';
import { TabsStyles } from 'app/components/Tabs/TabsStyles';
import TabPanel from 'app/components/Tabs/TabPanel';
import { TabComponentProps } from 'app/components/Tabs/TabComponentProps';
import MetricsTab from './MetricsTab';
interface IProps {
  dataItem: ITGWNode;
}

const WedgePanel: React.FC<IProps> = (props: IProps) => {
  const [value, setValue] = React.useState(0);
  const classes = TabsStyles();

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => setValue(newValue);
  return (
    <>
      <PanelHeader direction="column" align="unset">
        <PanelTitle>Transit Gateway: {props.dataItem.name ? props.dataItem.name : props.dataItem.extId}</PanelTitle>
        {props.dataItem.description && <SubPanelTitle>{props.dataItem.description}</SubPanelTitle>}
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
          <Tab disableRipple label="Metrics" classes={{ selected: classes.tabSelected }} {...TabComponentProps(0)} className={classes.tab} />
          <Tab disableRipple label="Routes" classes={{ selected: classes.tabSelected }} {...TabComponentProps(1)} className={classes.tab} />
        </Tabs>
      </PanelTabWrapper>
      <OverflowContainer>
        <TabPanel value={value} index={0}>
          <MetricsTab dataItem={props.dataItem} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <RoutesTab dataItem={props.dataItem} />
        </TabPanel>
      </OverflowContainer>
    </>
  );
};

export default React.memo(WedgePanel);
