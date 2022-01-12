import React from 'react';
import { INetworkVNetNode, ITopoNode } from 'lib/hooks/Topology/models';
import { IPosition } from 'lib/models/general';
import { useDrag } from 'app/containers/Pages/TopologyPage/TopoMapV2/hooks/useDrag';
import { NODES_CONSTANTS } from 'app/containers/Pages/TopologyPage/TopoMapV2/model';

import { useTopologyV2DataContext } from 'lib/hooks/Topology/useTopologyDataContext';
import RegionCollapsedNode from './RegionCollapsedNode';
import RegionExpandNode from './RegionExpandNode';
import { onHoverNode, onUnHoverNode } from '../../../../Graph/helper';
import { INetworkRegion } from 'lib/api/ApiModels/Topology/apiModels';
import TransitionContainer from '../../../TransitionContainer';

interface Props {
  dataItem: ITopoNode<INetworkRegion, INetworkVNetNode>;
}

const RegionNodeTopContainer: React.FC<Props> = (props: Props) => {
  const { topology } = useTopologyV2DataContext();
  const { onUpdate, onUnsubscribeDrag } = useDrag(
    {
      id: `${NODES_CONSTANTS.REGION.type}${props.dataItem.uiId}`,
      parentId: `wrapper${NODES_CONSTANTS.REGION.type}${props.dataItem.uiId}`,
      resId: props.dataItem.id,
      linkPrefiks: 'fromparentid',
      nodeType: props.dataItem.type,
    },
    (e: IPosition) => onUpdatePosition(e),
  );

  const [pos, setPosition] = React.useState<IPosition>(null);
  const [visible, setVisible] = React.useState<boolean>(false);

  React.useEffect(() => {
    return () => {
      onUnsubscribeDrag();
    };
  }, []);

  React.useEffect(() => {
    setVisible(props.dataItem.visible);
    setPosition({ x: props.dataItem.x, y: props.dataItem.y });
  }, [props.dataItem]);

  React.useEffect(() => {
    if (visible) {
      if (pos) {
        onUpdate({ x: props.dataItem.x, y: props.dataItem.y }, visible);
      } else {
        onUnsubscribeDrag();
      }
    } else {
      onUnsubscribeDrag();
    }
  }, [pos, visible]);

  const onUpdatePosition = (_pos: IPosition) => {
    if (props.dataItem.x === _pos.x && props.dataItem.y === _pos.y) {
      return;
    }
    setPosition({ x: _pos.x, y: _pos.y });
    topology.onUpdateNodeCoord(props.dataItem, _pos);
  };

  const onExpand = () => {
    topology.onCollapseExpandNode(props.dataItem, false);
  };

  const onCollapse = () => {
    topology.onCollapseExpandNode(props.dataItem, true);
  };

  const onMouseEnter = () => {
    onHoverNode(`wrapper${NODES_CONSTANTS.REGION.type}${props.dataItem.uiId}`);
  };

  const onMouseLeave = () => {
    onUnHoverNode(`wrapper${NODES_CONSTANTS.REGION.type}${props.dataItem.uiId}`);
  };

  if (!pos) return null;
  return (
    <TransitionContainer id={`wrapper${NODES_CONSTANTS.REGION.type}${props.dataItem.uiId}`} stateIn={props.dataItem.visible} origin="unset" transform="none">
      <g
        id={`${NODES_CONSTANTS.REGION.type}${props.dataItem.uiId}`}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className="topologyNode"
        transform={`translate(${pos.x}, ${pos.y})`}
        data-type={NODES_CONSTANTS.REGION.type}
      >
        <RegionCollapsedNode id={props.dataItem.id} name={props.dataItem.name} childrenCount={props.dataItem.children.length} show={props.dataItem.collapsed} onExpand={onExpand} />
        <RegionExpandNode dataItem={props.dataItem} show={!props.dataItem.collapsed} onCollapse={onCollapse} />
      </g>
    </TransitionContainer>
  );
};

export default React.memo(RegionNodeTopContainer);