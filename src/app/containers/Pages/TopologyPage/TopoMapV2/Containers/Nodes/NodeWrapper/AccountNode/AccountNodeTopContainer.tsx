import React from 'react';
import { ITGWNode, ITopoNode } from 'lib/hooks/Topology/models';
import { CollapseExpandState, IPosition } from 'lib/models/general';
import { useDrag } from 'app/containers/Pages/TopologyPage/TopoMapV2/hooks/useDrag';
import { NODES_CONSTANTS } from 'app/containers/Pages/TopologyPage/TopoMapV2/model';
import { useTopologyV2DataContext } from 'lib/hooks/Topology/useTopologyDataContext';
import AccountCollapsedNode from './AccountCollapsedNode';
import { onHoverNode, onUnHoverNode } from '../../../../Graph/helper';
import AccountExpandNode from './AccountExpandNode';
import TransitionContainer from '../../../TransitionContainer';
import CollapseExpandButton from '../../Containers/CollapseExpandButton';

interface Props {
  dataItem: ITopoNode<any, ITGWNode>;
}

const AccountNodeTopContainer: React.FC<Props> = (props: Props) => {
  const { topology } = useTopologyV2DataContext();
  const { onUpdate, onUnsubscribeDrag } = useDrag(
    {
      id: `${NODES_CONSTANTS.ACCOUNT.type}${props.dataItem.uiId}`,
      parentId: `wrapper${NODES_CONSTANTS.ACCOUNT.type}${props.dataItem.uiId}`,
      expandCollapseId: `expandCollapse${props.dataItem.id}`,
      resId: props.dataItem.id,
      linkPrefiks: 'toparentid',
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

  const onExpandCollapse = (type: CollapseExpandState) => {
    onUnHoverNode(`${NODES_CONSTANTS.REGION.type}${props.dataItem.uiId}`);
    if (type === CollapseExpandState.COLLAPSE) {
      onCollapse();
      return;
    }
    onExpand();
  };

  const onExpand = () => {
    topology.onCollapseExpandNode(props.dataItem, true);
  };

  const onCollapse = () => {
    topology.onCollapseExpandNode(props.dataItem, false);
  };

  const onMouseEnter = () => {
    onHoverNode(`${NODES_CONSTANTS.ACCOUNT.type}${props.dataItem.uiId}`);
  };

  const onMouseLeave = () => {
    onUnHoverNode(`${NODES_CONSTANTS.ACCOUNT.type}${props.dataItem.uiId}`);
  };

  if (!pos) return null;
  return (
    <TransitionContainer id={`wrapper${NODES_CONSTANTS.ACCOUNT.type}${props.dataItem.uiId}`} stateIn={props.dataItem.visible} origin="unset" transform="none">
      <g
        id={`${NODES_CONSTANTS.ACCOUNT.type}${props.dataItem.uiId}`}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className="topologyNode"
        transform={`translate(${pos.x}, ${pos.y})`}
        data-type={NODES_CONSTANTS.ACCOUNT.type}
      >
        <AccountCollapsedNode id={props.dataItem.id} name={props.dataItem.name} childrenCount={props.dataItem.children.length} show={props.dataItem.collapsed} />
        <AccountExpandNode dataItem={props.dataItem} show={!props.dataItem.collapsed} />
        <CollapseExpandButton
          id={`expandCollapse${props.dataItem.id}`}
          isCollapse={!props.dataItem.collapsed}
          onClick={onExpandCollapse}
          x={!props.dataItem.collapsed ? props.dataItem.expandedSize.width - NODES_CONSTANTS.COLLAPSE_EXPAND.r : NODES_CONSTANTS.ACCOUNT.collapse.width - NODES_CONSTANTS.COLLAPSE_EXPAND.r}
          y={!props.dataItem.collapsed ? props.dataItem.expandedSize.height / 2 - NODES_CONSTANTS.COLLAPSE_EXPAND.r : NODES_CONSTANTS.ACCOUNT.collapse.height / 2 - NODES_CONSTANTS.COLLAPSE_EXPAND.r}
        />
      </g>
    </TransitionContainer>
  );
};

export default React.memo(AccountNodeTopContainer);
