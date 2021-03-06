import React from 'react';
import {
  // CollapseExpandState,
  IPosition,
} from 'lib/models/general';
// import { useDrag } from 'app/containers/Pages/TopologyPage/TopoMapV2/hooks/useDrag';
import { NODES_CONSTANTS } from 'app/containers/Pages/TopologyPage/TopoMapV2/model';
import { useTopologyV2DataContext } from 'lib/hooks/Topology/useTopologyDataContext';
// import { onHoverNode, onUnHoverNode } from '../../../../Graph/helper';
import SitesExpandNode from './SitesExpandNode';
import { ITopoSitesNode } from 'lib/hooks/Topology/models';
// import CollapseExpandButton from '../../Containers/CollapseExpandButton';

interface Props {
  site: ITopoSitesNode;
}

const SitesNodeTopContainer: React.FC<Props> = (props: Props) => {
  const { topology } = useTopologyV2DataContext();
  // const { onUpdate, onUnsubscribeDrag } = useDrag(
  //   {
  //     id: `${NODES_CONSTANTS.SITES.type}${props.site.uiId}`,
  //     parentId: `wrapper${NODES_CONSTANTS.SITES.type}${props.site.uiId}`,
  //     dragId: `drag${NODES_CONSTANTS.SITES.type}${props.site.uiId}`,
  //     resId: props.site.dataItem.id,
  //     linkPrefiks: 'fromparentid',
  //     nodeType: props.site.type,
  //   },
  //   (e: IPosition) => onUpdatePosition(e),
  // );

  const [pos, setPosition] = React.useState<IPosition>(null);
  // const [visible, setVisible] = React.useState<boolean>(false);
  // React.useEffect(() => {
  //   return () => {
  //     onUnsubscribeDrag();
  //   };
  // }, []);

  React.useEffect(() => {
    // setVisible(props.site.visible);
    setPosition({ x: props.site.x, y: props.site.y });
  }, [props.site]);

  // React.useEffect(() => {
  //   if (visible) {
  //     if (pos) {
  //       onUpdate({ x: props.site.x, y: props.site.y }, visible);
  //     } else {
  //       onUnsubscribeDrag();
  //     }
  //   } else {
  //     onUnsubscribeDrag();
  //   }
  // }, [pos, visible]);

  // const onUpdatePosition = (_pos: IPosition) => {
  //   if (props.site.x === _pos.x && props.site.y === _pos.y) {
  //     return;
  //   }
  //   setPosition({ x: _pos.x, y: _pos.y });
  //   topology.onUpdateNodeCoord(props.site, _pos);
  // };

  // const onExpandCollapse = (type: CollapseExpandState) => {
  //   onUnHoverNode(`${NODES_CONSTANTS.REGION.type}${props.dataItem.uiId}`);
  //   if (type === CollapseExpandState.COLLAPSE) {
  //     onCollapse();
  //     return;
  //   }
  //   onExpand();
  // };

  // const onExpand = () => {
  //   topology.onCollapseExpandNode(props.dataItem, true);
  // };

  // const onCollapse = () => {
  //   topology.onCollapseExpandNode(props.dataItem, false);
  // };

  // const onMouseEnter = () => {
  //   onHoverNode(`${NODES_CONSTANTS.SITES.type}${props.site.uiId}`);
  // };

  // const onMouseLeave = () => {
  //   onUnHoverNode(`${NODES_CONSTANTS.SITES.type}${props.site.uiId}`);
  // };

  const onPrev = () => {
    const page = props.site.currentPage === 0 ? props.site.children.length - 1 : props.site.currentPage - 1;
    topology.onChangeSitesPage(props.site.dataItem.id, page);
  };

  const onNext = () => {
    const page = props.site.currentPage === props.site.children.length - 1 ? 0 : props.site.currentPage + 1;
    topology.onChangeSitesPage(props.site.dataItem.id, page);
  };

  if (!pos || !props.site.visible) return null;
  return (
    <g
      id={`${NODES_CONSTANTS.SITES.type}${props.site.uiId}`}
      // onMouseEnter={onMouseEnter}
      // onMouseLeave={onMouseLeave}
      className="topologyNode"
      transform={`translate(${pos.x}, ${pos.y})`}
      data-type={NODES_CONSTANTS.SITES.type}
    >
      <SitesExpandNode dragId={`drag${NODES_CONSTANTS.SITES.type}${props.site.uiId}`} site={props.site} show={!props.site.collapsed} onPrev={onPrev} onNext={onNext} />
      {/* <CollapseExpandButton
          id={`expandCollapse${props.dataItem.uiId}`}
          isCollapse={!props.dataItem.collapsed}
          onClick={onExpandCollapse}
          x={!props.dataItem.collapsed ? props.dataItem.expandedSize.width - NODES_CONSTANTS.COLLAPSE_EXPAND.r : NODES_CONSTANTS.SITES.collapse.width - NODES_CONSTANTS.COLLAPSE_EXPAND.r}
          y={!props.dataItem.collapsed ? props.dataItem.expandedSize.height / 2 - NODES_CONSTANTS.COLLAPSE_EXPAND.r : NODES_CONSTANTS.SITES.collapse.height / 2 - NODES_CONSTANTS.COLLAPSE_EXPAND.r}
        /> */}
    </g>
  );
};

export default React.memo(SitesNodeTopContainer);
