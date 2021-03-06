import { ControllerKeyTypes } from 'lib/api/ApiModels/Metrics/apiModel';
import { ToposvcRuleType } from '../Topology/apiModels';

export const TopoApi = {
  getAllOrganizations: () => 'topo/api/v1/topology/organizations',
  getRoutesByKey: (key: ControllerKeyTypes) => 'topo/api/v1/topology/' + key,
  getPolicyByKey: (key: ControllerKeyTypes) => 'topo/api/v1/topology/' + key,

  getEdges: () => 'topo/api/v1/topology/cloud/edges', // IEdgesRes
  getEdgeById: (id: string) => 'topo/api/v1/topology/cloud/edges/' + id, // IEdgesP
  deleteEdge: (id: string) => 'topo/api/v1/topology/cloud/edges/' + id,
  postCreateEdge: () => 'topo/api/v1/topology/cloud/edges',
  putUpdateEdge: (id: string) => 'topo/api/v1/topology/cloud/edges/' + id,
  getSites: () => 'topo/api/v1/topology/onprem/devices',
  getVms: () => 'topo/api/v1/topology/inventory/cloud/vms', // => IVmsRes
  getWedges: () => 'topo/api/v1/topology/wedges', // => IWEdgesRes
  getVnetworks: () => 'topo/api/v1/topology/inventory/cloud/vnetworks', // => IVnetworksRes
  getTags: () => 'topo/api/v1/topology/tags', // => INetworkTagsRes

  getPolicyLogs: () => 'topo/api/v1/topology/policy-logs',

  getOnPremOrgList: () => 'topo/api/v1/topology/onprem/orgs',
  getOnPremNetworkList: () => 'topo/api/v1/topology/onprem/networks',
  getOnPremDeviceList: () => 'topo/api/v1/topology/onprem/devices',

  getRouteTables: () => 'topo/api/v1/topology/route-tables', // res => IToposvcListRouteTableResponse
  getRouteTableByExtId: (extId: string) => `topo/api/v1/topology/route-tables/${extId}`, // res => IToposvcGetRouteTableByExtIdResponse
  getSecurityGroups: () => 'topo/api/v1/topology/security-groups', // res => IToposvcListSecurityGroupResponse
  getSecurityGroupsByExtId: (extId: string) => `topo/api/v1/topology/security-groups/${extId}`, // res => IToposvcGetSecurityGroupByExtIdResponse
  getRules: (type?: ToposvcRuleType) => (type ? `topo/api/v1/topology/rules?ruleType=${type}` : `topo/api/v1/topology/rules`), // res => IToposvcGetRulesResponse
  getL7Rules: () => 'topo/api/v1/topology/l7rules', // res => IToposvcGetL7RulesResponse

  getRulesCount: (type: ToposvcRuleType) => `topo/api/v1/topology/rule/count?ruleType=${type}`, // res => IToposvcGetCountResponse
  getConfigDrift: () => 'topo/api/v1/topology/config-drift/count', // res => IToposvcGetCountResponse
};
