import React from 'react';
import { TOPOLOGY_IDS } from '../model';
import { ContainerWithMetrics } from '../styles';
import { TopologyPanelTypes } from 'lib/models/topology';
import { useTopologyV2DataContext } from 'lib/hooks/Topology/useTopologyDataContext';
import { useZoom } from '../hooks/useZoom';
import HeadeerAction from '../HeadeerAction';
import { IPanelBarLayoutTypes } from 'lib/models/general';
import PanelBar from 'app/components/Basic/PanelBar';
import FilterComponent from '../PanelComponents/FilterComponent';
import VpcPanel from '../PanelComponents/NodePanels/VpcPanel';
import DevicePanel from '../PanelComponents/NodePanels/DevicePanel';
import WedgePanel from '../PanelComponents/NodePanels/WedgePanel';
import Map from './Map';
import GroupsComponent from '../PanelComponents/GroupsComponent/GroupsComponent';
import WebAclPanel from '../PanelComponents/NodePanels/WebAclPanel';

interface Props {
  disabledReload: boolean;
  onlyRefreshAvaible: any;
  isFullScreen: boolean;
  onReload: () => void;
  onOpenFullScreen: () => void;
}

const Graph: React.FC<Props> = (props: Props) => {
  const { topology } = useTopologyV2DataContext();
  const { transform, onZoomInit, onZoomIn, onZoomOut, onZoomChange, onCentered, onUnsubscribe } = useZoom({ svgId: TOPOLOGY_IDS.SVG, rootId: TOPOLOGY_IDS.G_ROOT });

  React.useEffect(() => {
    if (!props.onlyRefreshAvaible) {
      onZoomInit();
    }
    return () => {
      onUnsubscribe();
    };
  }, [props.onlyRefreshAvaible]);

  React.useEffect(() => {
    if (topology.originData) {
      onCentered(topology.nodes);
    }
  }, [topology.originData]);

  const onOpenFullScreen = () => {
    props.onOpenFullScreen();
  };

  const onHidePanel = () => {
    topology.onToogleTopoPanel(null, false);
  };

  return (
    <>
      <HeadeerAction
        disabledReload={props.disabledReload}
        onlyRefreshAvaible={props.onlyRefreshAvaible}
        transform={transform}
        isFullScreen={props.isFullScreen}
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
        onZoomChange={onZoomChange}
        onCentered={onCentered}
        onOpenFullScreen={onOpenFullScreen}
        onRefresh={props.onReload}
      />
      {topology.originData && (
        <ContainerWithMetrics>
          <Map />
          <PanelBar show={topology.topoPanel.show} onHidePanel={onHidePanel} type={IPanelBarLayoutTypes.VERTICAL}>
            {topology.topoPanel.type === TopologyPanelTypes.FILTERS && <FilterComponent />}
            {topology.topoPanel.type === TopologyPanelTypes.GROUPS && <GroupsComponent />}
            {topology.topoPanel.type === TopologyPanelTypes.VPC && <VpcPanel dataItem={topology.topoPanel.dataItem} />}
            {topology.topoPanel.type === TopologyPanelTypes.WebAcl && <WebAclPanel dataItem={topology.topoPanel.dataItem} />}
            {topology.topoPanel.type === TopologyPanelTypes.Device && <DevicePanel dataItem={topology.topoPanel.dataItem} />}
            {topology.topoPanel.type === TopologyPanelTypes.Wedge && <WedgePanel dataItem={topology.topoPanel.dataItem} />}
          </PanelBar>
        </ContainerWithMetrics>
      )}
    </>
  );
};

export default React.memo(Graph);
