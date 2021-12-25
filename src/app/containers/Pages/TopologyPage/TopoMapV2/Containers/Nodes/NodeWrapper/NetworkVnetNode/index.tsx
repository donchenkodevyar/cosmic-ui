import React from 'react';
import { NODES_CONSTANTS } from '../../../../model';
import { INetworkVNetNode } from 'lib/hooks/Topology/models';

interface Props {
  item: INetworkVNetNode;
}

const NetworkVnetNode: React.FC<Props> = (props: Props) => {
  return (
    <g transform={`translate(${props.item.x}, ${props.item.y})`}>
      <use href={`#${NODES_CONSTANTS.NETWORK_VNET.type}`} width={NODES_CONSTANTS.NETWORK_VNET.collapse.width} height={NODES_CONSTANTS.NETWORK_VNET.collapse.height} x={0} y={0} />
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
