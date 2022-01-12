import React from 'react';
import { NODES_CONSTANTS } from '../../../../model';
import { INetworkVNetNode, ITopoRegionNode } from 'lib/hooks/Topology/models';
import NodeCounter from '../../Containers/NodeCounter';
import { select } from 'd3-selection';
import { buildVnetTooltip, removeVnetTooltip } from './tooltipHelper';
import { useTopologyV2DataContext } from 'lib/hooks/Topology/useTopologyDataContext';

interface Props {
  parentId: string;
  region: ITopoRegionNode;
  item: INetworkVNetNode;
  onClick: (item: INetworkVNetNode) => void;
}

const NetworkVnetNode: React.FC<Props> = (props: Props) => {
  const { topology } = useTopologyV2DataContext();
  const [isNodeSelected, setIsNodeSelected] = React.useState<boolean>(false);
  const nodeRef = React.useRef(null);

  React.useEffect(() => {
    if (topology.selectedNode && topology.selectedNode.uiId === props.item.uiId && !isNodeSelected) {
      setIsNodeSelected(true);
    } else if (!topology.selectedNode || (topology.selectedNode && topology.selectedNode !== props.item.uiId)) {
      setIsNodeSelected(false);
    }
  }, [topology.selectedNode]);

  const onClick = () => {
    props.onClick(props.item);
  };
  const onMouseEnter = (e: React.BaseSyntheticEvent<MouseEvent>) => {
    const _node = select(nodeRef.current);
    _node.raise();
    buildVnetTooltip(e, props.region, props.item, props.parentId);
  };
  const onMouseLeave = () => {
    removeVnetTooltip(props.parentId);
  };
  return (
    <g
      ref={nodeRef}
      onMouseOver={onMouseEnter}
      onMouseOut={onMouseLeave}
      id={`${props.item.nodeType}${props.item.id}`}
      className={`topoNodeLevel1 vnetNodeWrapper ${isNodeSelected ? 'selectedTopoLevel1' : ''}`}
      transform={`translate(${props.item.x}, ${props.item.y})`}
      data-id={`vnet${props.item.id}`}
      onClick={onClick}
      cursor="pointer"
    >
      <circle
        r={NODES_CONSTANTS.NETWORK_VNET.collapse.r - 1}
        cx={NODES_CONSTANTS.NETWORK_VNET.collapse.r}
        cy={NODES_CONSTANTS.NETWORK_VNET.collapse.r}
        fill="var(--_primaryBg)"
        stroke="var(--_primaryBg)"
        strokeWidth="1"
        className="vpcCollapsedBg eventHandler"
        pointerEvents="all"
      />
      <use
        className="vpsBgIcon"
        href={`#${NODES_CONSTANTS.NETWORK_VNET.type}`}
        width={NODES_CONSTANTS.NETWORK_VNET.collapse.iconWidth}
        height={NODES_CONSTANTS.NETWORK_VNET.collapse.iconHeight}
        x={0}
        y={0}
        color="#7BAB4E"
        pointerEvents="none"
      />
      <NodeCounter pointerEvents="none" label={`${props.item.vms && props.item.vms.length ? props.item.vms.length : 0}`} stylesObj={NODES_CONSTANTS.NETWORK_VNET.countStyles} />
      <foreignObject
        width={NODES_CONSTANTS.NETWORK_VNET.labelHtmlStyles.width}
        height={NODES_CONSTANTS.NETWORK_VNET.labelHtmlStyles.height}
        x={NODES_CONSTANTS.NETWORK_VNET.labelHtmlStyles.x}
        y={NODES_CONSTANTS.NETWORK_VNET.labelHtmlStyles.y}
      >
        <div
          style={{
            display: 'flex',
            width: '100%',
            height: '100%',
          }}
          title={props.item.name}
        >
          <span
            style={{
              display: 'inline-block',
              maxWidth: '100%',
              margin: 'auto',
              color: NODES_CONSTANTS.NETWORK_VNET.labelHtmlStyles.fill,
              fontSize: NODES_CONSTANTS.NETWORK_VNET.labelHtmlStyles.fontSize + 'px',
              textAlign: 'center',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              fontWeight: 500,
              pointerEvents: 'none',
            }}
          >
            {props.item.name}
          </span>
        </div>
      </foreignObject>
    </g>
  );
};

export default React.memo(NetworkVnetNode);
