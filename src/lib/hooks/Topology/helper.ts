import { NODES_CONSTANTS } from 'app/containers/Pages/TopologyPage/TopoMapV2/model';
import { ISegmentSegmentP, SegmentSegmentType } from 'lib/api/ApiModels/Policy/Segment';
import { AppNodeType, INetworkOrg, INetworkRegion, TopologySegmentsApiResponse, VendorTypes } from 'lib/api/ApiModels/Topology/apiModels';
import { getChunksFromArray } from 'lib/helpers/arrayHelper';
import { IMapped_Application, IMapped_Segment, INetworkVNetNode, INetworkVNetworkPeeringConnectionNode, INetworkWebAclNode, ITopoAppNode, ITopoLink } from 'lib/hooks/Topology/models';
import { IObject } from 'lib/models/general';
import uuid from 'react-uuid';
import { buildLinks } from './helpers/buildlinkHelper';
import {
  createAccountNode,
  createApplicationNode,
  createDeviceNode,
  createPeerConnectionNode,
  createSitesNode,
  createTopoRegionNode,
  createVnetNode,
  createWebAclNode,
  createWedgeNode,
  updateDeviceNode,
} from './helpers/buildNodeHelpers';
import { updateTopLevelItems } from './helpers/coordinateHelper';
import { getBeautifulRowsCount, getRegionChildrenCounts } from './helpers/rowsHelper';
import {
  DEFAULT_GROUP_ID,
  DEV_IN_PAGE,
  DEV_IN_ROW,
  FilterEntityOptions,
  IDeviceNode,
  ITempSegmentObjData,
  ITGWNode,
  ITopoAccountNode,
  ITopologyPreparedMapDataV2,
  ITopoRegionNode,
  ITopoSitesNode,
  PEER_CONNECTION_IN_ROW,
  VPCS_IN_ROW,
  WEB_ACL_IN_ROW,
} from './models';

// import { jsonClone } from 'lib/helpers/cloneHelper';

export const createAccounts = (accounts: IObject<ITopoAccountNode>, _data: INetworkOrg[]) => {
  if (!_data || !_data.length) return;

  _data.forEach((org, orgI) => {
    if (!org.regions || !org.regions.length) return;

    org.regions.forEach(region => {
      const _name = buildRegionName(org, region);
      if (!region.wedges || !region.wedges.length) return;

      region.wedges.forEach((w, index) => {
        let account: ITopoAccountNode = accounts[org.extId]; // _accounts.findIndex(it => it.dataItem.id === `${w.regionCode}${w.ownerId}`);
        if (account) {
          const _wNode: ITGWNode = createWedgeNode(org.extId, org, orgI, 0, account.totalChildrenCount, w);
          accounts[org.extId].children.push(_wNode);
          accounts[org.extId].totalChildrenCount = accounts[org.extId].children.length;
        } else {
          const _a: ITopoAccountNode = createAccountNode(org.extId, _name, org.extId);
          const _wNode: ITGWNode = createWedgeNode(org.extId, org, orgI, 0, index, w);
          _a.children.push(_wNode);
          _a.totalChildrenCount = _a.children.length;
          accounts[_a.dataItem.extId] = _a;
        }
      });
    });
  });
};

export const createTopology = (filter: FilterEntityOptions, _data: INetworkOrg[], _segments: ISegmentSegmentP[], appNodes: TopologySegmentsApiResponse): ITopologyPreparedMapDataV2 => {
  const regions: IObject<ITopoRegionNode> = {};
  const accounts: IObject<ITopoAccountNode> = {};
  const sites: IObject<ITopoSitesNode> = {};
  const devicesInDefaultSegment: IDeviceNode[] = [];
  const segmentTempObject: ITempSegmentObjData = {};
  const segmentsFilteredOptions: IMapped_Segment[] = [];
  const applicationFilterOptions: IMapped_Application[] = [];
  let applicationNodes: IObject<ITopoAppNode> = {};

  if (_segments && _segments.length) {
    segmentTempObject['test'] = { id: 'test', extId: 'test', dataItem: _segments[0], children: [], type: SegmentSegmentType.NETWORK, uiId: uuid(), selected: true };
    _segments.forEach((s, i) => {
      const _ms: IMapped_Segment = { id: s.id, extId: s.id, dataItem: s, children: [], type: s.segType, uiId: uuid(), selected: true };
      if (s.segType === SegmentSegmentType.SITE) {
        const _segment: ITopoSitesNode = createSitesNode(s);
        sites[_segment.dataItem.extId] = _segment;
      }
      segmentTempObject[_ms.extId] = _ms;
    });
  }

  if (_data && _data.length) {
    createAccounts(accounts, _data);
    _data.forEach((org, orgI) => {
      if (!org.regions || !org.regions.length) return;
      org.regions.forEach((region, i) => {
        let _objR: ITopoRegionNode = null;
        if (org.vendorType !== VendorTypes.MERAKI) {
          _objR = createTopoRegionNode(region, org.extId);
        }
        const max = getRegionChildrenCounts(region.vnets, region.vNetworkPeeringConnections, region.webAcls);
        if (region.vnets && region.vnets.length && org.vendorType !== 'MERAKI') {
          _objR.totalChildrenCount = region.vnets.length;
          const _arr: INetworkVNetNode[][] = getChunksFromArray(region.vnets, Math.min(VPCS_IN_ROW, max));
          _objR.children = _arr.map((row, ri) =>
            row.map((v, i) => {
              const _vnet: INetworkVNetNode = createVnetNode(_objR.dataItem.extId, org, row.length, orgI, ri, i, v, segmentTempObject[v.segmentId]);
              if (segmentTempObject[v.segmentId]) {
                segmentTempObject[v.segmentId].children.push(_vnet);
              } else {
                // for test
                segmentTempObject['test'].children.push(_vnet);
              }
              return _vnet;
            }),
          );
        }
        if (region.vNetworkPeeringConnections && region.vNetworkPeeringConnections.length) {
          const _arr: INetworkVNetworkPeeringConnectionNode[][] = getChunksFromArray(region.vNetworkPeeringConnections, Math.min(PEER_CONNECTION_IN_ROW, max));
          _objR.peerConnections = _arr.map((row, ri) => row.map((v, i) => createPeerConnectionNode(_objR.dataItem.extId, org, row.length, orgI, ri, i, v)));
        }
        if (region.webAcls && region.webAcls.length) {
          const _arr: INetworkWebAclNode[][] = getChunksFromArray(region.webAcls, Math.min(WEB_ACL_IN_ROW, max));
          _objR.webAcls = _arr.map((row, ri) => row.map((v, i) => createWebAclNode(_objR.dataItem.extId, org, row.length, orgI, ri, i, v)));
        }
        if (region.devices && region.devices.length) {
          // // for test
          // for (let j = 0; j < 72; j++) {
          //   const _item1 = jsonClone(region.devices[0]);
          //   _item1.segmentId = '61eaccce820af10f872a9b16';
          //   const _device1: IDeviceNode = createDeviceNode(org, orgI, _item1, sites[region.devices[0].segmentId]);
          //   segmentTempObject[_device1.segmentId].children.push(_device1);
          // }
          // for (let j = 0; j < 45; j++) {
          //   const _item2 = jsonClone(region.devices[0]);
          //   _item2.segmentId = '61eacc5d820af10f872a9b15';
          //   const _device2: IDeviceNode = createDeviceNode(org, orgI, _item2, sites[region.devices[0].segmentId]);
          //   segmentTempObject[_device2.segmentId].children.push(_device2);
          // }
          // for (let j = 0; j < 300; j++) {
          //   const _item3 = jsonClone(region.devices[0]);
          //   _item3.segmentId = '61ea2c4f820af10f872a9b14';
          //   const _device3: IDeviceNode = createDeviceNode(org, orgI, _item3, sites[region.devices[0].segmentId]);
          //   segmentTempObject[_device3.segmentId].children.push(_device3);
          // }
          region.devices.forEach((d, i) => {
            const _device: IDeviceNode = createDeviceNode(org, orgI, d, sites[d.segmentId]);
            if (_device.segmentId && segmentTempObject[_device.segmentId]) {
              segmentTempObject[_device.segmentId].children.push(_device);
            } else {
              devicesInDefaultSegment.push(_device);
            }
          });
        }
        // Do not add global region if it has got 0 vpc
        if (_objR && (_objR.dataItem.name.toLowerCase() !== 'global' || _objR.webAcls.length > 0)) {
          regions[_objR.dataItem.extId] = _objR;
        }
      });
    });
  }

  if (devicesInDefaultSegment && devicesInDefaultSegment.length) {
    const _defGroup: ITopoSitesNode = createSitesNode({
      id: DEFAULT_GROUP_ID,
      extId: DEFAULT_GROUP_ID,
      name: 'Default',
      description: '',
      segType: null,
      networkSegPol: null,
      appSegPol: null,
      extSegPol: null,
      serviceSegPol: null,
      paasSegPol: null,
      siteSegPol: null,
      isSystemSegment: false,
      color: NODES_CONSTANTS.SITES.expanded.marker.bgColor,
    });
    sites[DEFAULT_GROUP_ID] = _defGroup;
    sites[DEFAULT_GROUP_ID].totalChildrenCount = devicesInDefaultSegment.length;
    const _arr = getChunksFromArray(devicesInDefaultSegment, DEV_IN_PAGE);
    const max = _arr && _arr.length ? getBeautifulRowsCount(_arr[0].length, DEV_IN_ROW) : 0;
    sites[DEFAULT_GROUP_ID].children = _arr.map((page, pageI) => {
      const _pageRow = getChunksFromArray(page, max);
      return _pageRow.map((row, rowI) => row.map((v, i) => updateDeviceNode(DEFAULT_GROUP_ID, v, pageI, rowI, row.length, i))).flat();
    });
  }

  if (Object.keys(segmentTempObject).length) {
    Object.keys(segmentTempObject).forEach(key => {
      const _s = segmentTempObject[key];
      if (_s.children && _s.children.length) {
        segmentsFilteredOptions.push(_s);
      }
      if (!_s.type || _s.type !== SegmentSegmentType.SITE || (_s.type === SegmentSegmentType.SITE && (!_s.children || !_s.children.length))) {
        delete sites[_s.extId];
        return;
      }
      sites[_s.extId].totalChildrenCount = _s.children.length;
      const _arr = getChunksFromArray(_s.children, DEV_IN_PAGE);
      const max = _arr && _arr.length ? getBeautifulRowsCount(_arr[0].length, DEV_IN_ROW) : 0;
      sites[_s.extId].children = _arr.map((page, pageI) => {
        const _pageRow = getChunksFromArray(page, max);
        return _pageRow.map((row, rowI) => row.map((v, i) => updateDeviceNode(_s.extId, v, pageI, rowI, row.length, i))).flat();
      });
    });
  }

  // app nodes
  applicationNodes = appNodes.topology.nodes.reduce((accu, nextItem) => {
    if (nextItem.nodeType === AppNodeType.Application) {
      const tempAppNode = createApplicationNode(nextItem);
      tempAppNode.dataItem.name = segmentTempObject[nextItem.nodeId]?.dataItem?.name || 'UNKNOWN';
      tempAppNode.dataItem.description = segmentTempObject[nextItem.nodeId]?.dataItem?.description || '';
      accu[tempAppNode.dataItem.extId] = tempAppNode;
      const _ma: IMapped_Application = {
        id: nextItem.nodeId,
        extId: nextItem.nodeId,
        dataItem: {
          ...nextItem,
          name: tempAppNode.dataItem.name,
          description: tempAppNode.dataItem.description,
        },
        type: nextItem.nodeType,
        uiId: uuid(),
        selected: true,
      };
      applicationFilterOptions.push(_ma);
    }
    return accu;
  }, {});
  updateTopLevelItems(filter, regions, accounts, sites, applicationNodes);
  const _links: IObject<ITopoLink<any, any, any>> = buildLinks(filter, regions, accounts, sites, applicationNodes, appNodes.topology.links);

  return { accounts: accounts, sites: sites, regions: regions, links: _links, segments: segmentsFilteredOptions, appNodes: applicationNodes, applicationFilterOptions };
};

const buildRegionName = (org: INetworkOrg, region: INetworkRegion): string => {
  const { extId, ctrlrName } = org;
  const { extId: regExtId } = region;
  let str = '';
  if (ctrlrName) {
    str = ctrlrName.toUpperCase() + ' ';
  }
  if (extId) {
    str += `(${extId})`;
  }
  if (str.length) return str;
  if (regExtId) return regExtId;
  return 'Unknown region';
};
