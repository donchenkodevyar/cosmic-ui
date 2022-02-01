import React from 'react';
import OverflowContainer from 'app/components/Basic/OverflowContainer/styles';
// import { useTopologyV2DataContext } from 'lib/hooks/Topology/useTopologyDataContext';
import { PanelContent } from 'app/components/Basic/PanelBar/styles';
import { PanelHeader, PanelTitle } from '../styles';
import FilterGroup from 'app/components/Basic/FilterComponents/FilterGroup';
import { useTopologyV2DataContext } from 'lib/hooks/Topology/useTopologyDataContext';
import { TopoFilterTypes } from 'lib/hooks/Topology/models';
import FilterEntityGroup from './FilterEntityGroup';
// import FilterSeverityGroup from './FilterSeverityGroup';
import FilterNodesGroup from './FilterNodesGroup';
import { regionFilterIcon, accountFilterIcon } from 'app/components/SVGIcons/topologyIcons/TopoMapV2Icons/filterPanelIcon';
import { ciscoMerakiLogoIcon } from 'app/components/SVGIcons/topologyIcons/ciscoMerakiLogo';

interface IProps {}

const FilterComponent: React.FC<IProps> = (props: IProps) => {
  const { topology } = useTopologyV2DataContext();

  const onSelectFilterOption = (groupType: TopoFilterTypes, type: any, selected: boolean) => {
    topology.onSelectFilterOption(groupType, type, selected);
  };

  return (
    <>
      <PanelHeader direction="column" align="unset">
        <PanelTitle>Filters</PanelTitle>
      </PanelHeader>
      <OverflowContainer>
        <PanelContent>
          <FilterGroup maxGroupHeight="260px" defaultOpen label="Entities" styles={{ margin: '0 0 5px 0' }}>
            <FilterEntityGroup type={TopoFilterTypes.Entities} data={topology.entities} onClick={onSelectFilterOption} />
          </FilterGroup>
          <FilterGroup maxGroupHeight="unset" label="Segments" styles={{ margin: '0' }}>
            <FilterNodesGroup type={TopoFilterTypes.Sites} icon={ciscoMerakiLogoIcon(20)} iconStyles={{ width: '20px', height: '20px' }} data={topology.sites} onClick={onSelectFilterOption} />
          </FilterGroup>
          {/* <FilterGroup maxGroupHeight="260px" label="Health Severity" styles={{ margin: '0 0 5px 0' }}>
            <FilterSeverityGroup type={TopoFilterTypes.Severity} data={topology.severity} onClick={onSelectFilterOption} />
          </FilterGroup> */}
          <FilterGroup maxGroupHeight="unset" label="Regions" styles={{ margin: '0 0 5px 0' }}>
            <FilterNodesGroup type={TopoFilterTypes.Regions} icon={regionFilterIcon} data={topology.regions} onClick={onSelectFilterOption} />
          </FilterGroup>
          <FilterGroup maxGroupHeight="unset" label="Accounts" styles={{ margin: '0 0 5px 0' }}>
            <FilterNodesGroup type={TopoFilterTypes.Accounts} icon={accountFilterIcon} data={topology.accounts} onClick={onSelectFilterOption} />
          </FilterGroup>
        </PanelContent>
      </OverflowContainer>
    </>
  );
};

export default React.memo(FilterComponent);
