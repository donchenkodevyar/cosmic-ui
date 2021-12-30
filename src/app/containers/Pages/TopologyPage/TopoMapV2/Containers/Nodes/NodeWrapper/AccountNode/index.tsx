import React from 'react';
import { ITGWNode, ITopoNode } from 'lib/hooks/Topology/models';
import { IPosition } from 'lib/models/general';
import { useDrag } from 'app/containers/Pages/TopologyPage/TopoMapV2/hooks/useDrag';
import { NODES_CONSTANTS } from 'app/containers/Pages/TopologyPage/TopoMapV2/model';
import { useTopologyV2DataContext } from 'lib/hooks/Topology/useTopologyDataContext';
import AccountCollapsedNode from './AccountCollapsedNode';
import { onHoverNode, onUnHoverNode } from '../../../../Graph/helper';
import AccountExpandNode from './AccountExpandNode';
import { TopologyPanelTypes } from 'lib/models/topology';

interface Props {
  dataItem: ITopoNode<ITGWNode>;
}

const AccountNode: React.FC<Props> = (props: Props) => {
  const { topology } = useTopologyV2DataContext();
  const { onUpdate, onUnsubscribeDrag } = useDrag(
    {
      id: `${NODES_CONSTANTS.ACCOUNT.type}${props.dataItem.uiId}`,
      // popupId: `popupContainer${props.dataItem.id}`,
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
  }, [pos]);

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

  const onTgwClick = (item: ITGWNode) => {
    topology.onToogleTopoPanel(TopologyPanelTypes.Wedge, true, item);
  };

  const onMouseEnter = () => {
    onHoverNode(`${NODES_CONSTANTS.ACCOUNT.type}${props.dataItem.uiId}`);
  };

  const onMouseLeave = () => {
    onUnHoverNode(`${NODES_CONSTANTS.ACCOUNT.type}${props.dataItem.uiId}`);
  };

  if (!pos) return null;
  return (
    <g
      id={`${NODES_CONSTANTS.ACCOUNT.type}${props.dataItem.uiId}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="topologyNode"
      transform={`translate(${pos.x}, ${pos.y})`}
      data-type={NODES_CONSTANTS.ACCOUNT.type}
    >
      <AccountCollapsedNode id={props.dataItem.id} name={props.dataItem.name} childrenCount={props.dataItem.children.length} show={props.dataItem.collapsed} onExpand={onExpand} />
      <AccountExpandNode dataItem={props.dataItem} show={!props.dataItem.collapsed} onCollapse={onCollapse} onTgwClick={onTgwClick} />
    </g>
  );
};

export default React.memo(AccountNode);