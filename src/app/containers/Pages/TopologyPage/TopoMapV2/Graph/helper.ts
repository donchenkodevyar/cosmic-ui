import * as d3 from 'd3';
import { TOPOLOGY_IDS } from '../model';

const onHoverNode = (id: string) => {
  const svg = d3.select(`#${TOPOLOGY_IDS.SVG}`);
  svg.select(`#${id}`).classed('hoverNode', true);
  svg.select(`#${id}childrensLayer`).classed('hoverNode', true);
  svg.selectAll('.topologyNode:not(.hoverNode)').classed('unHoverNode', true);
};

const onUnHoverNode = (id: string) => {
  const svg = d3.select(`#${TOPOLOGY_IDS.SVG}`);
  svg.selectAll('.hoverNode').classed('hoverNode', false);
  svg.selectAll('.unHoverNode').classed('unHoverNode', false);
};

export { onHoverNode, onUnHoverNode };
