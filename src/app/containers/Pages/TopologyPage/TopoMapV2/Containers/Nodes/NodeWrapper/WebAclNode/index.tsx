import React from 'react';
import { NODES_CONSTANTS } from '../../../../model';
import { INetworkWebAclNode, ITopoRegionNode } from 'lib/hooks/Topology/models';
import { useTopologyV2DataContext } from 'lib/hooks/Topology/useTopologyDataContext';

interface Props {
  parentId: string;
  region: ITopoRegionNode;
  item: INetworkWebAclNode;
  onClick: (item: INetworkWebAclNode) => void;
}

const WebAclNode: React.FC<Props> = (props: Props) => {
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

  return (
    <g ref={nodeRef} className="webaclNodeWrapper">
      <g transform={`translate(${props.item.x}, ${props.item.y})`}>
        <circle
          fill={NODES_CONSTANTS.WEB_ACL.collapse.bgColor}
          r={NODES_CONSTANTS.WEB_ACL.collapse.r}
          cx={NODES_CONSTANTS.WEB_ACL.collapse.r}
          cy={NODES_CONSTANTS.WEB_ACL.collapse.r}
          className="webAclNode"
          pointerEvents="all"
        />
        <use
          href={`#${NODES_CONSTANTS.WEB_ACL.type}`}
          width={NODES_CONSTANTS.WEB_ACL.collapse.iconWidth}
          height={NODES_CONSTANTS.WEB_ACL.collapse.iconHeight}
          x={0}
          y={0}
          color="#D6242D"
          pointerEvents="none"
          className="webAclNodeIcon"
        />
      </g>
    </g>
  );
};

export default React.memo(WebAclNode);
