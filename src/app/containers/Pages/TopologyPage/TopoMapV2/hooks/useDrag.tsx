import React from 'react';
import * as d3 from 'd3';
import { IPosition } from 'lib/models/general';
// import { calculateAttachmentPosition, getPointsData } from '../Containers/Links/Attachment/helper';
import { TopoNodeTypes } from 'lib/hooks/Topology/models';

interface IProps {
  id: string;
  parentId: string;
  resId: string;
  dragId: string;
  linkPrefiks: 'fromparentid' | 'toparentid' | 'fromchildid' | 'tochildid';
  nodeType: TopoNodeTypes;
}
export function useDrag(props: IProps, onUpdateCallBack: (pos: IPosition) => void) {
  const [parentId] = React.useState<string>(props.parentId);
  const [id] = React.useState<string>(props.id);
  const [dragId] = React.useState<string>(props.dragId);
  const [nodeType] = React.useState<TopoNodeTypes>(props.nodeType);
  const [resId] = React.useState<string>(props.resId);
  const [linkPrefiks] = React.useState<string>(props.linkPrefiks);
  const [position, setPosition] = React.useState<IPosition | null>(null);
  const [visible, setVisible] = React.useState<boolean>(true);
  const [isUpdated, setIsUpdated] = React.useState<boolean>(false);
  const positionRef = React.useRef<IPosition>(position);
  const drag = d3
    .drag()
    .on('start', e => onDragStart(e))
    .on('drag', e => onDrag(e), { passive: true })
    .on('end', () => onDragEnd(), { passive: true });
  let translateX = 0;
  let translateY = 0;
  let node: any;
  let childrenContainerNode: any;
  let links = null;
  let isDraggable = false;
  React.useEffect(() => {
    return () => {
      onUnsubscribeDrag();
    };
  }, []);

  React.useEffect(() => {
    if (isUpdated) {
      setIsUpdated(false);
      if (visible) {
        onSubscribeDrag();
      } else {
        onUnsubscribeDrag();
      }
    }
  }, [isUpdated]);

  const onSubscribeDrag = () => {
    const _node = d3.select(`#${id}`);
    _node.on('drag', null);
    _node.call(drag);
  };
  const onUnsubscribeDrag = () => {
    const _node = d3.select(`#${id}`);
    _node.on('drag', null);
  };

  const onUpdate = (pos: IPosition, visible: boolean) => {
    // debugger
    positionRef.current = pos ? { ...pos } : null;
    setVisible(visible);
    setPosition(pos);
    setIsUpdated(true);
  };
  const onDragStart = e => {
    if (e && e.sourceEvent && e.sourceEvent.target && e.sourceEvent.target.id !== dragId) return;
    isDraggable = true;
    translateX = positionRef.current.x || 0;
    translateY = positionRef.current.y || 0;
    node = d3.select(`#${id}`);
    childrenContainerNode = d3.select(`#${id}childrensLayer`);
    links = d3.selectAll(`line[data-${linkPrefiks}='${nodeType}${resId}']`);
    raiseNode(links);
  };

  const raiseNode = (_links: any) => {
    d3.selectAll('.topologyNode').classed('topoDisabledOnDrag', true);
    const parent = d3.select(`#${parentId}`);
    parent.raise();
    d3.select(`#${parentId}childrensLayer`).raise();
    parent.selectAll('.topologyNode').classed('topoDisabledOnDrag', null).classed('topoOnDrag', true);
  };

  // const collisionDetection = (e) => {
  //   console.log(e);
  //   console.log(node);
  //   console.log(allNodes);
  //   allNodes.each(n => {
  //     console.log(n);
  //   });
  // };

  const onDrag = e => {
    if (!node || !e || !isDraggable) return;
    const { dx, dy } = e;
    translateX += dx;
    translateY += dy;
    if (links) {
      links.each(function (this: any) {
        const _l = d3.select(this);
        let x = 0;
        let y = 0;
        if (linkPrefiks === 'fromparentid') {
          x = Number(_l.attr('x1')) + dx;
          y = Number(_l.attr('y1')) + dy;
          _l.attr('x1', x).attr('y1', y);
        }
        if (linkPrefiks === 'toparentid') {
          x = Number(_l.attr('x2')) + dx;
          y = Number(_l.attr('y2')) + dy;
          _l.attr('x2', x).attr('y2', y);
        }
      });
    }
    node.attr('transform', `translate(${translateX}, ${translateY})`);
    childrenContainerNode.attr('transform', `translate(${translateX}, ${translateY})`);
  };

  const onDragEnd = () => {
    if (!isDraggable) return;
    isDraggable = false;
    d3.selectAll('.topologyNode').classed('topoDisabledOnDrag', null).classed('topoOnDrag', null);
    node = null;
    childrenContainerNode = null;
    links = null;
    onUpdateCallBack({ x: translateX, y: translateY });
  };

  return {
    position,
    onUnsubscribeDrag,
    onUpdate,
  };
}
