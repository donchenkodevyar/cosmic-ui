import React from 'react';
import { IWedgeNode } from 'lib/models/topology';
import { IPosition, NODES_CONSTANTS } from 'app/components/Map/model';
import { useDrag } from 'app/components/Map/hooks/useDrag';
import TGW from './TGW';
import { useTopologyDataContext } from 'lib/hooks/useTopologyDataContext';
import TransitionContainer from '../../TransitionContainer';
import NodeName from '../../Shared/NodeName';
// import NodeTooltipPortal from 'components/Basic/NodeTooltipPortal';
// import WedgePopup from '../../Popups/WedgePopup';
// import { IPopupDisplay } from 'lib/models/general';

interface IProps {
  dataItem: IWedgeNode;
  onClick: (vm: IWedgeNode) => void;
}
const WEdgeNode: React.FC<IProps> = (props: IProps) => {
  const { topology } = useTopologyDataContext();
  const { onUpdate, onUnsubscribeDrag } = useDrag(
    {
      id: `${NODES_CONSTANTS.WEDGE.type}${props.dataItem.id}`,
      // popupId: `popupContainer${props.dataItem.id}`,
    },
    (e: IPosition) => onUpdatePosition(e),
  );
  const [pos, setPosition] = React.useState<IPosition>(null);
  const [visible, setVisible] = React.useState<boolean>(false);
  // const [showPopup, setShowPopup] = React.useState<IPopupDisplay>({ show: false, x: 0, y: 0 });

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
    topology?.onUpdateWedgeCoord(props.dataItem, _pos);
  };

  const onClick = () => {
    props.onClick(props.dataItem);
  };
  // const onTogglePopup = (e: React.MouseEvent, show: boolean) => {
  //   if (!showPopup.show && !show) { return; }
  //   const _x = show ? e.clientX : 0;
  //   const _y = show ? e.clientY : 0;
  //   setShowPopup({ show, x: _x, y: _y });
  // };
  if (!pos) {
    return null;
  }
  return (
    <TransitionContainer stateIn={visible}>
      <g id={`${NODES_CONSTANTS.WEDGE.type}${props.dataItem.id}`} className="topologyNode" transform={`translate(${pos.x}, ${pos.y})`} data-type={NODES_CONSTANTS.WEDGE.type}>
        <g>
          <g
            // onMouseEnter={e => onTogglePopup(e, true)}
            // onMouseLeave={e => onTogglePopup(e, false)}
            onClick={onClick}
          >
            {TGW}
          </g>
          <NodeName labelBefore="TGW" name={props.dataItem.name} dx={-NODES_CONSTANTS.WEDGE.r} dy={NODES_CONSTANTS.WEDGE.r * 2 + 10} />
          {/* <text dx={NODES_CONSTANTS.WEDGE.r} dy={NODES_CONSTANTS.WEDGE.r * 2 + 20} fill="var(--_primaryColor)" fontSize="14" textAnchor="middle">
            <tspan>TGW</tspan>
          </text> */}
          {/* <foreignObject pointerEvents="none" x={} y={} width={NODES_CONSTANTS.WEDGE.textWidth} height={NODES_CONSTANTS.WEDGE.textHeight}>
            <div
              style={{
                width: '100%',
                minHeight: '12px',
                fontSize: NODES_CONSTANTS.WEDGE.fontSize,
                textAlign: 'center',
                pointerEvents: 'none',
                color: 'var(--_primaryColor)',
              }}
            >
              {props.dataItem.name}
            </div>
          </foreignObject> */}
        </g>
      </g>
    </TransitionContainer>
  );
};

export default React.memo(WEdgeNode);
