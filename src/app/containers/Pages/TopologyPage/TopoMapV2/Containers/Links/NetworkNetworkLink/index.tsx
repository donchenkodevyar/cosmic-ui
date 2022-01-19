import React from 'react';
// import { select } from 'd3-selection';
import { INetworkVNetNode, ITGWNode, ITopoLink, ITopoAccountNode, ITopoRegionNode } from 'lib/hooks/Topology/models';
import { INetworkNetworkLink } from 'lib/api/ApiModels/Topology/apiModels';
import { useTopologyV2DataContext } from 'lib/hooks/Topology/useTopologyDataContext';
import TransitionContainer from '../../TransitionContainer';

interface IProps {
  offsetY: number;
  dataItem: ITopoLink<ITopoRegionNode, INetworkVNetNode, ITopoAccountNode, ITGWNode, INetworkNetworkLink>;
}
const NetworkNetworkLink: React.FC<IProps> = (props: IProps) => {
  const { topology } = useTopologyV2DataContext();
  const [isSelected, setIsSelected] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (topology.selectedNode && (topology.selectedNode.uiId === props.dataItem.fromNode.child.uiId || topology.selectedNode.uiId === props.dataItem.toNode.child.uiId)) {
      setIsSelected(true);
    } else if (isSelected) {
      setIsSelected(false);
    }
  }, [topology.selectedNode]);
  return (
    <TransitionContainer id={`networkNetworkLink${props.dataItem.id}`} stateIn={props.dataItem.visible}>
      <line
        className={`topologyLink ${isSelected ? 'selectedTopoLevel1Link' : ''}`}
        fill="var(--_defaultLinkFill)"
        stroke="var(--_defaultLinkFill)"
        strokeWidth="1"
        data-fromchildid={`${props.dataItem.fromNode.child.nodeType}${props.dataItem.fromNode.child.id}`}
        data-tochildid={`${props.dataItem.toNode.child.nodeType}${props.dataItem.toNode.child.id}`}
        data-fromparentid={`${props.dataItem.fromNode.parent.type}${props.dataItem.fromNode.parent.dataItem.id}`}
        data-toparentid={`${props.dataItem.toNode.parent.type}${props.dataItem.toNode.parent.dataItem.id}`}
        x1={props.dataItem.fromX}
        y1={props.offsetY + props.dataItem.fromY}
        x2={props.dataItem.toX}
        y2={props.dataItem.toY}
      />
    </TransitionContainer>
  );
};

export default React.memo(NetworkNetworkLink);
