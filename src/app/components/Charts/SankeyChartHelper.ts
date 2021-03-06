import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal } from 'd3-sankey';
import { ISankeyData, SankeyNodeType } from 'lib/api/ApiModels/Sessions/apiModel';
import { jsonClone } from 'lib/helpers/cloneHelper';

export const createSankeyChart = (id: string, data: ISankeyData, linkClickCallBack: (e: any, link: any) => void) => {
  const container = d3.select(`#${id}`);
  container.select(`#sankeyHeader`).attr('opacity', 0);
  container.select('#sankeyChartContainerLinks').selectAll('*').remove();
  container.select('#sankeyChartContainerNodes').selectAll('*').remove();
  if (!data) return;
  const _data: ISankeyData = jsonClone(data);
  const size = container.node().getBoundingClientRect();
  drawSankey(container, size, _data, linkClickCallBack);
  container.select(`#sankeyHeader`).attr('opacity', 1);
};

const drawSankey = (container, size, data: ISankeyData, linkClickCallBack: (e: any, link: any) => void) => {
  const rootG = container.select('#sankeyChartContainerRoot');
  const _sankey = sankey()
    .nodeId(d => d.node)
    .extent([
      [1, 1],
      [size.width - 60, size.height - 82],
    ])
    .nodePadding(10)
    .size([size.width - 60, size.height - 82])
    .iterations(32);
  _sankey(data);
  createLinks(rootG, data.links, linkClickCallBack);
  createNodes(rootG, data.nodes);
};

const createLinks = (g: any, links: any[], linkClickCallBack: (e: any, link: any) => void) => {
  const _linksG = g.select('#sankeyChartContainerLinks');
  const link = _linksG.selectAll('.link').data(links).enter();
  const _pathEl = link.append('path').classed('link', true);
  _pathEl.attr('data-source', d => d.source.node).attr('data-target', d => d.target.node);
  _pathEl.append('title').text(d => d.value);
  _pathEl
    .attr('fill', 'none')
    .attr('stroke', d => {
      if (d.target.type === SankeyNodeType.SANKEY_APPLICATION) return '#F69442';
      if (d.target.type === SankeyNodeType.SANKEY_DESTINATION) return 'var(--_successColor)';
      return 'grey';
    })
    .attr('d', it => {
      let _link = sankeyLinkHorizontal()
        .source(d => [d.source.x1, d.y0])
        .target(d => [d.target.x0, d.y1]);
      return _link(it);
    })

    .attr('stroke-width', d => Math.max(1, d.width));
  _pathEl.on('mouseenter', onRaise).on('mouseleave', onLeave);
  _pathEl.on('click', (e, d) => linkClickCallBack(e, d));

  function onRaise(this: any, e) {
    const _link = d3.select(this);
    _link.raise();
    _link.attr('stroke-width', d => Math.max(4, d.width));
    const _snodeId = _link.attr('data-source');
    const _tnodeId = _link.attr('data-target');
    const _sNode = d3.select(`rect[data-node='${_snodeId}']`);
    const _tNode = d3.select(`rect[data-node='${_tnodeId}']`);
    _sNode
      .attr('height', d => Math.max(4, d.y1 - d.y0))
      .attr('y', d => {
        const _h = Math.max(4, d.y1 - d.y0);
        if (_h === 4) return -2;
        return 0;
      });
    _tNode
      .attr('height', d => Math.max(4, d.y1 - d.y0))
      .attr('y', d => {
        const _h = Math.max(4, d.y1 - d.y0);
        if (_h === 4) return -2;
        return 0;
      });
  }
  function onLeave(this: any, e) {
    const _link = d3.select(this);
    _link.attr('stroke-width', d => Math.max(1, d.width));
    const _snodeId = _link.attr('data-source');
    const _tnodeId = _link.attr('data-target');
    const _sNode = d3.select(`rect[data-node='${_snodeId}']`);
    const _tNode = d3.select(`rect[data-node='${_tnodeId}']`);
    _sNode.attr('height', d => Math.max(1, d.y1 - d.y0)).attr('y', 0);
    _tNode.attr('height', d => Math.max(1, d.y1 - d.y0)).attr('y', 0);
  }
};

const createNodes = (g: any, nodes: any[]) => {
  const _nodesG = g.select('#sankeyChartContainerNodes');
  const node = _nodesG.selectAll('.node').data(nodes).enter();
  const nodeG = node.append('g').attr('class', 'node');
  buildNode(nodeG);
};

const buildNode = (nodeContainer: any) => {
  const rect = nodeContainer.append('rect');
  const textG = nodeContainer.append('g');

  rect
    .attr('width', 24)
    .attr('height', d => Math.max(1, d.y1 - d.y0))
    .attr('rx', 4)
    .attr('ry', 4)
    .attr('fill', d => {
      if (d.type === SankeyNodeType.SANKEY_DESTINATION) return '#52984E';
      if (d.type === SankeyNodeType.SANKEY_APPLICATION) return '#F69442';
      return 'var(--_pButtonBg)';
    })
    .attr('stroke', '#F3F6FC')
    .attr('data-name', d => d.name)
    .attr('data-node', d => d.node)
    .append('title')
    .text(d => d.name || `ID: ${d.node}\nType: ${d.type}`);
  textG
    .append('text')
    .attr('class', d => {
      if (d.type === SankeyNodeType.SANKEY_NETWORK) return 'networkNode';
      if (d.type === SankeyNodeType.SANKEY_DESTINATION) return 'destinationNode';
      if (d.type === SankeyNodeType.SANKEY_APPLICATION) return 'applicationNode';
      return null;
    })
    .attr('text-anchor', d => {
      if (d.type === SankeyNodeType.SANKEY_NETWORK) return 'start';
      if (d.type === SankeyNodeType.SANKEY_DESTINATION) return 'end';
      if (d.type === SankeyNodeType.SANKEY_APPLICATION) return 'end';
      return 'start';
    })
    .attr('y', d => {
      return (d.y1 - d.y0) / 2;
    })
    .attr('dy', '2')
    .attr('x', d => {
      if (d.type === SankeyNodeType.SANKEY_NETWORK) return 28;
      if (d.type === SankeyNodeType.SANKEY_DESTINATION) return -4;
      if (d.type === SankeyNodeType.SANKEY_APPLICATION) return -4;
      return 0;
    })
    .text(d => d.name || d.node);
  nodeContainer.attr('transform', d => `translate(${d.x0}, ${d.y0})`);
  nodeContainer.on('mouseenter', (e, d) => onHighLightLink(e, d));
  nodeContainer.on('mouseleave', (e, d) => onUnHighLightLink(e, d));

  function onHighLightLink(e, d) {
    d3.selectAll(`path[data-source='${d.node}']`).style('opacity', 0.6);
    d3.selectAll(`path[data-target='${d.node}']`).style('opacity', 0.6);
  }
  function onUnHighLightLink(e, d) {
    d3.selectAll(`path[data-source='${d.node}']`).style('opacity', null);
    d3.selectAll(`path[data-target='${d.node}']`).style('opacity', null);
  }
};
