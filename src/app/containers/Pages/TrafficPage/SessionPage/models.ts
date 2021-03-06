import { ISelectedListItem } from 'lib/models/general';
import { IElasticField } from 'lib/api/ApiModels/paramBuilders';

export enum IQuryFieldtype {
  STRING = 'string',
  NUMBER = 'number',
}
export interface ISessionsGridField {
  id: string;
  field: string;
  searchField: string;
  queryType?: IQuryFieldtype;
  label: string;
  headerName: string;
  minWidth: number;
  flex: number;
  resizable: boolean;
  hide: boolean;
}

export interface ISessionGridColumns {
  [key: string]: ISessionsGridField;
}

export const SessionGridColumns: ISessionGridColumns = {
  collapseColumn: {
    id: 'aggregatedId',
    field: 'id',
    searchField: '',
    queryType: null,
    label: '',
    headerName: '',
    minWidth: 0,
    flex: 0,
    resizable: false,
    hide: false,
  },
  vendorsColumn: {
    id: 'aggregatedVendors',
    field: 'vendors',
    searchField: '',
    queryType: null,
    label: 'Vendor',
    headerName: 'Vendor',
    minWidth: 200,
    flex: 0.25,
    resizable: false,
    hide: false,
  },
  timestamp: {
    id: 'aggregatedTimestamp',
    field: 'timestamp',
    searchField: '@timestamp',
    queryType: IQuryFieldtype.STRING,
    label: 'Time',
    headerName: 'Time',
    minWidth: 240,
    flex: 0.25,
    resizable: false,
    hide: false,
  },
  startTime: {
    id: 'aggregatedstartTime',
    field: 'startTime',
    searchField: 'start_time',
    queryType: IQuryFieldtype.STRING,
    label: 'Start Time',
    headerName: 'Start Time',
    minWidth: 200,
    flex: 0.25,
    resizable: false,
    hide: true,
  },
  endTime: {
    id: 'aggregatedendTime',
    field: 'endTime',
    searchField: 'end_time',
    queryType: IQuryFieldtype.STRING,
    label: 'End Time',
    headerName: 'End Time',
    minWidth: 200,
    flex: 0.25,
    resizable: false,
    hide: true,
  },
  sessionId: {
    id: 'aggregatedSessionId',
    field: 'sessionId',
    searchField: 'sessionid',
    queryType: IQuryFieldtype.STRING,
    label: 'Session ID',
    headerName: 'Session ID',
    minWidth: 200,
    flex: 0.25,
    resizable: false,
    hide: false,
  },
  flowId: {
    id: 'aggregatedFlowId',
    field: 'flowId',
    searchField: 'flowid',
    queryType: IQuryFieldtype.STRING,
    label: 'Flow ID',
    headerName: 'Flow ID',
    minWidth: 200,
    flex: 0.25,
    resizable: false,
    hide: true,
  },
  flowDirection: {
    id: 'aggregatedflowDirection',
    field: 'flowDirection',
    searchField: 'flow_direction',
    queryType: IQuryFieldtype.STRING,
    label: 'Flow Direction',
    headerName: 'Flow Direction',
    minWidth: 300,
    flex: 0.25,
    resizable: false,
    hide: true,
  },
  sourceIp: {
    id: 'aggregatedSourceIp',
    field: 'sourceIp',
    searchField: 'source_ip',
    queryType: IQuryFieldtype.STRING,
    label: 'Source IP',
    headerName: 'Source IP',
    minWidth: 180,
    flex: 0.25,
    resizable: false,
    hide: false,
  },
  sourcePort: {
    id: 'aggregatedSourcePort',
    field: 'sourcePort',
    searchField: 'source_port',
    queryType: IQuryFieldtype.NUMBER,
    label: 'Source Port',
    headerName: 'Source Port',
    minWidth: 180,
    flex: 0.25,
    resizable: false,
    hide: false,
  },
  sourceOrgid: {
    id: 'aggregatedsourceOrgid',
    field: 'sourceOrgid',
    searchField: 'source_orgid',
    queryType: IQuryFieldtype.STRING,
    label: 'Source Organization ID',
    headerName: 'Source Organization ID',
    minWidth: 240,
    flex: 0.25,
    resizable: false,
    hide: true,
  },
  sourceVnetworkExtid: {
    id: 'aggregatedsourceVnetworkExtid',
    field: 'sourceVnetworkExtid',
    searchField: 'source_vnetwork_extid',
    queryType: IQuryFieldtype.STRING,
    label: 'Source VPC ID',
    headerName: 'Source VPC ID',
    minWidth: 240,
    flex: 0.25,
    resizable: false,
    hide: true,
  },
  sourceVnetworkName: {
    id: 'aggregatedsourceVnetworkName',
    field: 'sourceVnetworkName',
    searchField: 'source_vnetwork_name',
    queryType: IQuryFieldtype.STRING,
    label: 'Source VPC Name',
    headerName: 'Source VPC Name',
    minWidth: 240,
    flex: 0.25,
    resizable: false,
    hide: true,
  },
  sourceSubnetExtid: {
    id: 'aggregatedsourceSubnetExtid',
    field: 'sourceSubnetExtid',
    searchField: 'source_subnet_extid',
    queryType: IQuryFieldtype.STRING,
    label: 'Source Subnet ID',
    headerName: 'Source Subnet ID',
    minWidth: 240,
    flex: 0.25,
    resizable: false,
    hide: true,
  },
  sourceVmExtid: {
    id: 'aggregatedsourceVmExtid',
    field: 'sourceVmExtid',
    searchField: 'source_vm_extid',
    queryType: IQuryFieldtype.STRING,
    label: 'Source VM ID',
    headerName: 'Source VM ID',
    minWidth: 240,
    flex: 0.25,
    resizable: false,
    hide: true,
  },
  sourceVmName: {
    id: 'aggregatedsourceVmName',
    field: 'sourceVmName',
    searchField: 'source_vm_name',
    queryType: IQuryFieldtype.STRING,
    label: 'Source VM Name',
    headerName: 'Source VM Name',
    minWidth: 240,
    flex: 0.25,
    resizable: false,
    hide: true,
  },
  sourceRegion: {
    id: 'aggregatedsourceRegion',
    field: 'sourceRegion',
    searchField: 'source_region',
    queryType: IQuryFieldtype.STRING,
    label: 'Source Region',
    headerName: 'Source Region',
    minWidth: 240,
    flex: 0.25,
    resizable: false,
    hide: true,
  },
  sourceControllerName: {
    id: 'aggregatedsourceControllerName',
    field: 'sourceControllerName',
    searchField: 'source_controller_name',
    queryType: IQuryFieldtype.STRING,
    label: 'Source Account Name',
    headerName: 'Source Account Name',
    minWidth: 240,
    flex: 0.25,
    resizable: false,
    hide: true,
  },
  sourceControllerId: {
    id: 'aggregatedsourceControllerId',
    field: 'sourceControllerId',
    searchField: 'source_controller_id',
    queryType: IQuryFieldtype.STRING,
    label: 'Source Account ID',
    headerName: 'Source Account ID',
    minWidth: 240,
    flex: 0.25,
    resizable: false,
    hide: true,
  },
  sourceSegmentId: {
    id: 'aggregatedsourceSegmentId',
    field: 'sourceSegmentId',
    searchField: 'source_segment_id',
    queryType: IQuryFieldtype.STRING,
    label: 'Source Segment ID',
    headerName: 'Source Segment ID',
    minWidth: 240,
    flex: 0.25,
    resizable: false,
    hide: true,
  },
  sourceSegmentName: {
    id: 'aggregatedsourceSegmentName',
    field: 'sourceSegmentName',
    searchField: 'source_segment_name',
    queryType: IQuryFieldtype.STRING,
    label: 'Source Segment Name',
    headerName: 'Source Segment Name',
    minWidth: 240,
    flex: 0.25,
    resizable: false,
    hide: false,
  },
  sourceSegmentType: {
    id: 'aggregatedsourceSegmentType',
    field: 'sourceSegmentType',
    searchField: 'source_segment_type',
    queryType: IQuryFieldtype.STRING,
    label: 'Source Segment Type',
    headerName: 'Source Segment Type',
    minWidth: 240,
    flex: 0.25,
    resizable: false,
    hide: false,
  },
  destIp: {
    id: 'aggregatedDestIp',
    field: 'destIp',
    searchField: 'dest_ip',
    queryType: IQuryFieldtype.STRING,
    label: 'Destination IP',
    headerName: 'Destination IP',
    minWidth: 180,
    flex: 0.25,
    resizable: false,
    hide: false,
  },
  destPort: {
    id: 'aggregatedDestPort',
    field: 'destPort',
    searchField: 'dest_port',
    queryType: IQuryFieldtype.NUMBER,
    label: 'Destination Port',
    headerName: 'Destination Port',
    minWidth: 180,
    flex: 0.25,
    resizable: false,
    hide: false,
  },
  destOrgid: {
    id: 'aggregateddestOrgid',
    field: 'destOrgid',
    searchField: 'dest_orgid',
    queryType: IQuryFieldtype.STRING,
    label: 'Destination Organization ID',
    headerName: 'Destination Organization ID',
    minWidth: 240,
    flex: 0.25,
    resizable: false,
    hide: true,
  },
  destVnetworkExtid: {
    id: 'aggregateddestVnetworkExtid',
    field: 'destVnetworkExtid',
    searchField: 'dest_vnetwork_extid',
    queryType: IQuryFieldtype.STRING,
    label: 'Destination VPC ID',
    headerName: 'Destination VPC ID',
    minWidth: 240,
    flex: 0.25,
    resizable: false,
    hide: true,
  },
  destVnetworkName: {
    id: 'aggregateddestVnetworkName',
    field: 'destVnetworkName',
    searchField: 'dest_vnetwork_name',
    queryType: IQuryFieldtype.STRING,
    label: 'Destination VPC Name',
    headerName: 'Destination VPC Name',
    minWidth: 240,
    flex: 0.25,
    resizable: false,
    hide: true,
  },
  destSubnetExtid: {
    id: 'aggregateddestSubnetExtid',
    field: 'destSubnetExtid',
    searchField: 'dest_subnet_extid',
    queryType: IQuryFieldtype.STRING,
    label: 'Destination Subnet ID',
    headerName: 'Destination Subnet ID',
    minWidth: 240,
    flex: 0.25,
    resizable: false,
    hide: true,
  },
  destVmExtid: {
    id: 'aggregateddestVmExtid',
    field: 'destVmExtid',
    searchField: 'dest_vm_extid',
    queryType: IQuryFieldtype.STRING,
    label: 'Destination VM ID',
    headerName: 'Destination VM ID',
    minWidth: 240,
    flex: 0.25,
    resizable: false,
    hide: true,
  },
  destVmName: {
    id: 'aggregateddestVmName',
    field: 'destVmName',
    searchField: 'dest_vm_name',
    queryType: IQuryFieldtype.STRING,
    label: 'Destination VM Name',
    headerName: 'Destination VM Name',
    minWidth: 240,
    flex: 0.25,
    resizable: false,
    hide: true,
  },
  destRegion: {
    id: 'aggregateddestRegion',
    field: 'destRegion',
    searchField: 'dest_region',
    queryType: IQuryFieldtype.STRING,
    label: 'Destination Region',
    headerName: 'Destination Region',
    minWidth: 240,
    flex: 0.25,
    resizable: false,
    hide: true,
  },
  destControllerName: {
    id: 'aggregateddestControllerName',
    field: 'destControllerName',
    searchField: 'dest_controller_name',
    queryType: IQuryFieldtype.STRING,
    label: 'Destination Account Name',
    headerName: 'Destination Account Name',
    minWidth: 240,
    flex: 0.25,
    resizable: false,
    hide: true,
  },
  destControllerId: {
    id: 'aggregateddestControllerId',
    field: 'destControllerId',
    searchField: 'dest_controller_id',
    queryType: IQuryFieldtype.STRING,
    label: 'Destination Account ID',
    headerName: 'Destination Account ID',
    minWidth: 240,
    flex: 0.25,
    resizable: false,
    hide: true,
  },
  destSegmentId: {
    id: 'aggregateddestSegmentId',
    field: 'destSegmentId',
    searchField: 'dest_segment_id',
    queryType: IQuryFieldtype.STRING,
    label: 'Destination Segment ID',
    headerName: 'Destination Segment ID',
    minWidth: 240,
    flex: 0.25,
    resizable: false,
    hide: true,
  },
  destSegmentName: {
    id: 'aggregateddestSegmentName',
    field: 'destSegmentName',
    searchField: 'dest_segment_name',
    queryType: IQuryFieldtype.STRING,
    label: 'Destination Segment Name',
    headerName: 'Destination Segment Name',
    minWidth: 240,
    flex: 0.25,
    resizable: false,
    hide: false,
  },
  destSegmentType: {
    id: 'aggregateddestSegmentType',
    field: 'destSegmentType',
    searchField: 'dest_segment_type',
    queryType: IQuryFieldtype.STRING,
    label: 'Destination Segment Type',
    headerName: 'Destination Segment Type',
    minWidth: 240,
    flex: 0.25,
    resizable: false,
    hide: false,
  },
  natSourceIp: {
    id: 'aggregatedNatSourceIp',
    field: 'natSourceIp',
    searchField: 'nat_source_ip',
    queryType: IQuryFieldtype.STRING,
    label: 'Nat Source IP',
    headerName: 'Nat Source IP',
    minWidth: 240,
    flex: 0.25,
    resizable: false,
    hide: true,
  },
  natSourcePort: {
    id: 'aggregatedNatSourcePort',
    field: 'natSourcePort',
    searchField: 'nat_source_port',
    queryType: IQuryFieldtype.NUMBER,
    label: 'Nat Source Port',
    headerName: 'Nat Source Port',
    minWidth: 240,
    flex: 0.25,
    resizable: false,
    hide: true,
  },
  natDestIp: {
    id: 'aggregatedNatDestIp',
    field: 'natDestIp',
    searchField: 'nat_dest_ip',
    queryType: IQuryFieldtype.STRING,
    label: 'Nat Destination IP',
    headerName: 'Nat Destination IP',
    minWidth: 240,
    flex: 0.25,
    resizable: false,
    hide: false,
  },
  natDestPort: {
    id: 'aggregatedNatDestPort',
    field: 'natDestPort',
    searchField: 'nat_dest_port',
    queryType: IQuryFieldtype.NUMBER,
    label: 'Nat Destination Port',
    headerName: 'Nat Destination Port',
    minWidth: 240,
    flex: 0.25,
    resizable: false,
    hide: true,
  },
  device: {
    id: 'aggregatedDevice',
    field: 'device',
    searchField: 'device',
    queryType: IQuryFieldtype.STRING,
    label: 'Device',
    headerName: 'Device',
    minWidth: 240,
    flex: 0.25,
    resizable: false,
    hide: true,
  },
  deviceName: {
    id: 'aggregatedDeviceName',
    field: 'deviceName',
    searchField: 'device_name',
    queryType: IQuryFieldtype.STRING,
    label: 'Device Name',
    headerName: 'Device Name',
    minWidth: 240,
    flex: 0.25,
    resizable: false,
    hide: false,
  },
  deviceExtId: {
    id: 'aggregatedDeviceExtId',
    field: 'deviceExtId',
    searchField: 'device_extid',
    queryType: IQuryFieldtype.STRING,
    label: 'Device ID',
    headerName: 'Device ID',
    minWidth: 240,
    flex: 0.25,
    resizable: false,
    hide: false,
  },
  deviceVendor: {
    id: 'aggregatedDeviceVendor',
    field: 'deviceVendor',
    searchField: 'device_vendor',
    queryType: IQuryFieldtype.STRING,
    label: 'Vendor',
    headerName: 'Vendor',
    minWidth: 240,
    flex: 0.25,
    resizable: false,
    hide: false,
  },
  deviceNetworkExtid: {
    id: 'aggregateddeviceNetworkExtid',
    field: 'deviceNetworkExtid',
    searchField: 'device_network_extid',
    queryType: IQuryFieldtype.STRING,
    label: 'Device Network ID',
    headerName: 'Device Network ID',
    minWidth: 240,
    flex: 0.25,
    resizable: false,
    hide: true,
  },
  deviceControllerId: {
    id: 'aggregateddeviceControllerId',
    field: 'deviceControllerId',
    searchField: 'device_controller_id',
    queryType: IQuryFieldtype.STRING,
    label: 'Device Account ID',
    headerName: 'Device Account ID',
    minWidth: 240,
    flex: 0.25,
    resizable: false,
    hide: true,
  },
  deviceControllerName: {
    id: 'aggregateddeviceControllerName',
    field: 'deviceControllerName',
    searchField: 'device_controller_name',
    queryType: IQuryFieldtype.STRING,
    label: 'Device Account Name',
    headerName: 'Device Account Name',
    minWidth: 240,
    flex: 0.25,
    resizable: false,
    hide: true,
  },
  bytes: {
    id: 'aggregatedDeviceBytes',
    field: 'bytes',
    searchField: 'bytes',
    queryType: IQuryFieldtype.NUMBER,
    label: 'Bytes',
    headerName: 'Bytes',
    minWidth: 160,
    flex: 0.25,
    resizable: false,
    hide: false,
  },
  packets: {
    id: 'aggregatedDevicePackets',
    field: 'packets',
    searchField: 'packets',
    queryType: IQuryFieldtype.NUMBER,
    label: 'Packets',
    headerName: 'Packets',
    minWidth: 160,
    flex: 0.25,
    resizable: false,
    hide: false,
  },
  action: {
    id: 'aggregatedDeviceAction',
    field: 'action',
    searchField: 'action',
    queryType: IQuryFieldtype.STRING,
    label: 'Action',
    headerName: 'Action',
    minWidth: 160,
    flex: 0.25,
    resizable: false,
    hide: false,
  },
  tcpFlags: {
    id: 'aggregatedDeviceTcpFlags',
    field: 'tcpFlags',
    searchField: 'tcp_flags',
    queryType: IQuryFieldtype.STRING,
    label: 'TCP Flags',
    headerName: 'TCP Flags',
    minWidth: 160,
    flex: 0.25,
    resizable: false,
    hide: true,
  },
  trafficType: {
    id: 'aggregatedDeviceTrafficType',
    field: 'trafficType',
    searchField: 'traffic_type',
    queryType: IQuryFieldtype.STRING,
    label: 'Traffic Type',
    headerName: 'Traffic Type',
    minWidth: 160,
    flex: 0.25,
    resizable: false,
    hide: true,
  },
  vnetworkExtId: {
    id: 'aggregatedDeviceVnetworkExtId',
    field: 'vnetworkExtId',
    searchField: 'vnetwork_extid',
    queryType: IQuryFieldtype.STRING,
    label: 'VPC ID',
    headerName: 'VPC ID',
    minWidth: 240,
    flex: 0.25,
    resizable: false,
    hide: true,
  },
  vnetworkName: {
    id: 'aggregatedDeviceVnetworkName',
    field: 'vnetworkName',
    searchField: 'vnetwork_name',
    queryType: IQuryFieldtype.STRING,
    label: 'VPC Name',
    headerName: 'VPC Name',
    minWidth: 240,
    flex: 0.25,
    resizable: false,
    hide: true,
  },
  subnetExtId: {
    id: 'aggregatedDeviceSubnetExtId',
    field: 'subnetExtId',
    searchField: 'subnet_extid',
    queryType: IQuryFieldtype.STRING,
    label: 'Subnet ID',
    headerName: 'Subnet ID',
    minWidth: 240,
    flex: 0.25,
    resizable: false,
    hide: true,
  },
  subnetName: {
    id: 'aggregatedDeviceSubnetName',
    field: 'subnetName',
    searchField: 'subnet_name',
    queryType: IQuryFieldtype.STRING,
    label: 'Subnet Name',
    headerName: 'Subnet Name',
    minWidth: 240,
    flex: 0.25,
    resizable: false,
    hide: true,
  },
  vmExtId: {
    id: 'aggregatedDeviceVmExtId',
    field: 'vmExtId',
    searchField: 'vm_extid',
    queryType: IQuryFieldtype.STRING,
    label: 'VM ID',
    headerName: 'VM ID',
    minWidth: 240,
    flex: 0.25,
    resizable: false,
    hide: true,
  },
  vmName: {
    id: 'aggregatedDeviceVmName',
    field: 'vmName',
    searchField: 'vm_name',
    queryType: IQuryFieldtype.STRING,
    label: 'VM Name',
    headerName: 'VM Name',
    minWidth: 240,
    flex: 0.25,
    resizable: false,
    hide: true,
  },
  region: {
    id: 'aggregatedDeviceRegion',
    field: 'region',
    searchField: 'region',
    queryType: IQuryFieldtype.STRING,
    label: 'Region',
    headerName: 'Region',
    minWidth: 240,
    flex: 0.25,
    resizable: false,
    hide: true,
  },
  azId: {
    id: 'aggregatedDeviceAzId',
    field: 'azId',
    searchField: 'az_id',
    queryType: IQuryFieldtype.STRING,
    label: 'AZ ID',
    headerName: 'AZ ID',
    minWidth: 240,
    flex: 0.25,
    resizable: false,
    hide: true,
  },
  protocol: {
    id: 'aggregatedProtocol',
    field: 'protocol',
    searchField: 'protocol',
    queryType: IQuryFieldtype.STRING,
    label: 'Protocol',
    headerName: 'Protocol',
    minWidth: 140,
    flex: 0.25,
    resizable: false,
    hide: true,
  },
  policyAction: {
    id: 'aggregatedpolicyAction',
    field: 'policyAction',
    searchField: 'policy_action',
    queryType: IQuryFieldtype.STRING,
    label: 'Policy Action',
    headerName: 'Policy Action',
    minWidth: 160,
    flex: 0.25,
    resizable: false,
    hide: true,
  },
};

export const SessionElasticFieldItems: IElasticField[] = [
  {
    resField: SessionGridColumns.timestamp.field,
    searchField: SessionGridColumns.timestamp.searchField,
    queryType: SessionGridColumns.timestamp.queryType,
    label: SessionGridColumns.timestamp.label,
    isField: true,
  },
  {
    resField: SessionGridColumns.sessionId.field,
    searchField: SessionGridColumns.sessionId.searchField,
    queryType: SessionGridColumns.sessionId.queryType,
    label: SessionGridColumns.sessionId.label,
    isField: true,
  },
  {
    resField: SessionGridColumns.flowId.field,
    searchField: SessionGridColumns.flowId.searchField,
    queryType: SessionGridColumns.flowId.queryType,
    label: SessionGridColumns.flowId.label,
    isField: true,
  },
  {
    resField: SessionGridColumns.sourceIp.field,
    searchField: SessionGridColumns.sourceIp.searchField,
    queryType: SessionGridColumns.sourceIp.queryType,
    label: SessionGridColumns.sourceIp.label,
    isField: true,
  },
  {
    resField: SessionGridColumns.sourcePort.field,
    searchField: SessionGridColumns.sourcePort.searchField,
    queryType: SessionGridColumns.sourcePort.queryType,
    label: SessionGridColumns.sourcePort.label,
    isField: true,
  },
  {
    resField: SessionGridColumns.destIp.field,
    searchField: SessionGridColumns.destIp.searchField,
    queryType: SessionGridColumns.destIp.queryType,
    label: SessionGridColumns.destIp.label,
    isField: true,
  },
  {
    resField: SessionGridColumns.destPort.field,
    searchField: SessionGridColumns.destPort.searchField,
    queryType: SessionGridColumns.destPort.queryType,
    label: SessionGridColumns.destPort.label,
    isField: true,
  },
  {
    resField: SessionGridColumns.natSourceIp.field,
    searchField: SessionGridColumns.natSourceIp.searchField,
    queryType: SessionGridColumns.natSourceIp.queryType,
    label: SessionGridColumns.natSourceIp.label,
    isField: true,
  },
  {
    resField: SessionGridColumns.natSourcePort.field,
    searchField: SessionGridColumns.natSourcePort.searchField,
    queryType: SessionGridColumns.natSourcePort.queryType,
    label: SessionGridColumns.natSourcePort.label,
    isField: true,
  },
  {
    resField: SessionGridColumns.natDestIp.field,
    searchField: SessionGridColumns.natDestIp.searchField,
    queryType: SessionGridColumns.natDestIp.queryType,
    label: SessionGridColumns.natDestIp.label,
    isField: true,
  },
  {
    resField: SessionGridColumns.natDestPort.field,
    searchField: SessionGridColumns.natDestPort.searchField,
    queryType: SessionGridColumns.natDestPort.queryType,
    label: SessionGridColumns.natDestPort.label,
    isField: true,
  },
  {
    resField: SessionGridColumns.deviceName.field,
    searchField: SessionGridColumns.deviceName.searchField,
    queryType: SessionGridColumns.deviceName.queryType,
    label: SessionGridColumns.deviceName.label,
    isField: true,
  },
  {
    resField: SessionGridColumns.deviceExtId.field,
    searchField: SessionGridColumns.deviceExtId.searchField,
    queryType: SessionGridColumns.deviceExtId.queryType,
    label: SessionGridColumns.deviceExtId.label,
    isField: true,
  },
  {
    resField: SessionGridColumns.device.field,
    searchField: SessionGridColumns.device.searchField,
    queryType: SessionGridColumns.device.queryType,
    label: SessionGridColumns.device.label,
    isField: true,
  },
  {
    resField: SessionGridColumns.deviceVendor.field,
    searchField: SessionGridColumns.deviceVendor.searchField,
    queryType: SessionGridColumns.deviceVendor.queryType,
    label: SessionGridColumns.deviceVendor.label,
    isField: true,
  },
  {
    resField: SessionGridColumns.bytes.field,
    searchField: SessionGridColumns.bytes.searchField,
    queryType: SessionGridColumns.bytes.queryType,
    label: SessionGridColumns.bytes.label,
    isField: true,
  },
  {
    resField: SessionGridColumns.packets.field,
    searchField: SessionGridColumns.packets.searchField,
    queryType: SessionGridColumns.packets.queryType,
    label: SessionGridColumns.packets.label,
    isField: true,
  },
  {
    resField: SessionGridColumns.action.field,
    searchField: SessionGridColumns.action.searchField,
    queryType: SessionGridColumns.action.queryType,
    label: SessionGridColumns.action.label,
    isField: true,
    valueTransform: v => v.toUpperCase(),
  },
  {
    resField: SessionGridColumns.tcpFlags.field,
    searchField: SessionGridColumns.tcpFlags.searchField,
    queryType: SessionGridColumns.tcpFlags.queryType,
    label: SessionGridColumns.tcpFlags.label,
    isField: true,
  },
  {
    resField: SessionGridColumns.trafficType.field,
    searchField: SessionGridColumns.trafficType.searchField,
    queryType: SessionGridColumns.trafficType.queryType,
    label: SessionGridColumns.trafficType.label,
    isField: true,
  },
  {
    resField: SessionGridColumns.vnetworkExtId.field,
    searchField: SessionGridColumns.vnetworkExtId.searchField,
    queryType: SessionGridColumns.vnetworkExtId.queryType,
    label: SessionGridColumns.vnetworkExtId.label,
    isField: true,
  },
  {
    resField: SessionGridColumns.vnetworkName.field,
    searchField: SessionGridColumns.vnetworkName.searchField,
    queryType: SessionGridColumns.vnetworkName.queryType,
    label: SessionGridColumns.vnetworkName.label,
    isField: true,
  },
  {
    resField: SessionGridColumns.subnetExtId.field,
    searchField: SessionGridColumns.subnetExtId.searchField,
    queryType: SessionGridColumns.subnetExtId.queryType,
    label: SessionGridColumns.subnetExtId.label,
    isField: true,
  },

  {
    resField: SessionGridColumns.vmExtId.field,
    searchField: SessionGridColumns.vmExtId.searchField,
    queryType: SessionGridColumns.vmExtId.queryType,
    label: SessionGridColumns.vmExtId.label,
    isField: true,
  },
  {
    resField: SessionGridColumns.vmName.field,
    searchField: SessionGridColumns.vmName.searchField,
    queryType: SessionGridColumns.vmName.queryType,
    label: SessionGridColumns.vmName.label,
    isField: true,
  },
  {
    resField: SessionGridColumns.region.field,
    searchField: SessionGridColumns.region.searchField,
    queryType: SessionGridColumns.region.queryType,
    label: SessionGridColumns.region.label,
    isField: true,
  },
  {
    resField: SessionGridColumns.azId.field,
    searchField: SessionGridColumns.azId.searchField,
    queryType: SessionGridColumns.azId.queryType,
    label: SessionGridColumns.azId.label,
    isField: true,
  },
  {
    resField: SessionGridColumns.protocol.field,
    searchField: SessionGridColumns.protocol.searchField,
    queryType: SessionGridColumns.protocol.queryType,
    label: SessionGridColumns.protocol.label,
    isField: true,
  },
  {
    resField: SessionGridColumns.policyAction.field,
    searchField: SessionGridColumns.policyAction.searchField,
    queryType: SessionGridColumns.policyAction.queryType,
    label: SessionGridColumns.policyAction.label,
    isField: true,
  },
  {
    resField: SessionGridColumns.flowDirection.field,
    searchField: SessionGridColumns.flowDirection.searchField,
    queryType: SessionGridColumns.flowDirection.queryType,
    label: SessionGridColumns.flowDirection.label,
    isField: true,
  },
  {
    resField: SessionGridColumns.startTime.field,
    searchField: SessionGridColumns.startTime.searchField,
    queryType: SessionGridColumns.startTime.queryType,
    label: SessionGridColumns.startTime.label,
    isField: true,
  },
  {
    resField: SessionGridColumns.endTime.field,
    searchField: SessionGridColumns.endTime.searchField,
    queryType: SessionGridColumns.endTime.queryType,
    label: SessionGridColumns.endTime.label,
    isField: true,
  },
  {
    resField: SessionGridColumns.deviceNetworkExtid.field,
    searchField: SessionGridColumns.deviceNetworkExtid.searchField,
    queryType: SessionGridColumns.deviceNetworkExtid.queryType,
    label: SessionGridColumns.deviceNetworkExtid.label,
    isField: true,
  },
  {
    resField: SessionGridColumns.deviceControllerId.field,
    searchField: SessionGridColumns.deviceControllerId.searchField,
    queryType: SessionGridColumns.deviceControllerId.queryType,
    label: SessionGridColumns.deviceControllerId.label,
    isField: true,
  },
  {
    resField: SessionGridColumns.deviceControllerName.field,
    searchField: SessionGridColumns.deviceControllerName.searchField,
    queryType: SessionGridColumns.deviceControllerName.queryType,
    label: SessionGridColumns.deviceControllerName.label,
    isField: true,
  },
  {
    resField: SessionGridColumns.sourceOrgid.field,
    searchField: SessionGridColumns.sourceOrgid.searchField,
    queryType: SessionGridColumns.sourceOrgid.queryType,
    label: SessionGridColumns.sourceOrgid.label,
    isField: true,
  },
  {
    resField: SessionGridColumns.sourceVnetworkExtid.field,
    searchField: SessionGridColumns.sourceVnetworkExtid.searchField,
    queryType: SessionGridColumns.sourceVnetworkExtid.queryType,
    label: SessionGridColumns.sourceVnetworkExtid.label,
    isField: true,
  },
  {
    resField: SessionGridColumns.sourceVnetworkName.field,
    searchField: SessionGridColumns.sourceVnetworkName.searchField,
    queryType: SessionGridColumns.sourceVnetworkName.queryType,
    label: SessionGridColumns.sourceVnetworkName.label,
    isField: true,
  },
  {
    resField: SessionGridColumns.sourceSubnetExtid.field,
    searchField: SessionGridColumns.sourceSubnetExtid.searchField,
    queryType: SessionGridColumns.sourceSubnetExtid.queryType,
    label: SessionGridColumns.sourceSubnetExtid.label,
    isField: true,
  },
  {
    resField: SessionGridColumns.sourceVmExtid.field,
    searchField: SessionGridColumns.sourceVmExtid.searchField,
    queryType: SessionGridColumns.sourceVmExtid.queryType,
    label: SessionGridColumns.sourceVmExtid.label,
    isField: true,
  },
  {
    resField: SessionGridColumns.sourceVmName.field,
    searchField: SessionGridColumns.sourceVmName.searchField,
    queryType: SessionGridColumns.sourceVmName.queryType,
    label: SessionGridColumns.sourceVmName.label,
    isField: true,
  },
  {
    resField: SessionGridColumns.sourceRegion.field,
    searchField: SessionGridColumns.sourceRegion.searchField,
    queryType: SessionGridColumns.sourceRegion.queryType,
    label: SessionGridColumns.sourceRegion.label,
    isField: true,
  },
  {
    resField: SessionGridColumns.sourceControllerName.field,
    searchField: SessionGridColumns.sourceControllerName.searchField,
    queryType: SessionGridColumns.sourceControllerName.queryType,
    label: SessionGridColumns.sourceControllerName.label,
    isField: true,
  },
  {
    resField: SessionGridColumns.sourceControllerId.field,
    searchField: SessionGridColumns.sourceControllerId.searchField,
    queryType: SessionGridColumns.sourceControllerId.queryType,
    label: SessionGridColumns.sourceControllerId.label,
    isField: true,
  },
  {
    resField: SessionGridColumns.sourceSegmentId.field,
    searchField: SessionGridColumns.sourceSegmentId.searchField,
    queryType: SessionGridColumns.sourceSegmentId.queryType,
    label: SessionGridColumns.sourceSegmentId.label,
    isField: true,
  },
  {
    resField: SessionGridColumns.destOrgid.field,
    searchField: SessionGridColumns.destOrgid.searchField,
    queryType: SessionGridColumns.destOrgid.queryType,
    label: SessionGridColumns.destOrgid.label,
    isField: true,
  },
  {
    resField: SessionGridColumns.destVnetworkExtid.field,
    searchField: SessionGridColumns.destVnetworkExtid.searchField,
    queryType: SessionGridColumns.destVnetworkExtid.queryType,
    label: SessionGridColumns.destVnetworkExtid.label,
    isField: true,
  },
  {
    resField: SessionGridColumns.destVnetworkName.field,
    searchField: SessionGridColumns.destVnetworkName.searchField,
    queryType: SessionGridColumns.destVnetworkName.queryType,
    label: SessionGridColumns.destVnetworkName.label,
    isField: true,
  },
  {
    resField: SessionGridColumns.destSubnetExtid.field,
    searchField: SessionGridColumns.destSubnetExtid.searchField,
    queryType: SessionGridColumns.destSubnetExtid.queryType,
    label: SessionGridColumns.destSubnetExtid.label,
    isField: true,
  },
  {
    resField: SessionGridColumns.destVmExtid.field,
    searchField: SessionGridColumns.destVmExtid.searchField,
    queryType: SessionGridColumns.destVmExtid.queryType,
    label: SessionGridColumns.destVmExtid.label,
    isField: true,
  },
  {
    resField: SessionGridColumns.destVmName.field,
    searchField: SessionGridColumns.destVmName.searchField,
    queryType: SessionGridColumns.destVmName.queryType,
    label: SessionGridColumns.destVmName.label,
    isField: true,
  },
  {
    resField: SessionGridColumns.destRegion.field,
    searchField: SessionGridColumns.destRegion.searchField,
    queryType: SessionGridColumns.destRegion.queryType,
    label: SessionGridColumns.destRegion.label,
    isField: true,
  },
  {
    resField: SessionGridColumns.destControllerName.field,
    searchField: SessionGridColumns.destControllerName.searchField,
    queryType: SessionGridColumns.destControllerName.queryType,
    label: SessionGridColumns.destControllerName.label,
    isField: true,
  },
  {
    resField: SessionGridColumns.destControllerId.field,
    searchField: SessionGridColumns.destControllerId.searchField,
    queryType: SessionGridColumns.destControllerId.queryType,
    label: SessionGridColumns.destControllerId.label,
    isField: true,
  },
  {
    resField: SessionGridColumns.destSegmentId.field,
    searchField: SessionGridColumns.destSegmentId.searchField,
    queryType: SessionGridColumns.destSegmentId.queryType,
    label: SessionGridColumns.destSegmentId.label,
    isField: true,
  },
  {
    resField: SessionGridColumns.sourceSegmentName.field,
    searchField: SessionGridColumns.sourceSegmentName.searchField,
    queryType: SessionGridColumns.sourceSegmentName.queryType,
    label: SessionGridColumns.sourceSegmentName.label,
    isField: true,
  },
  {
    resField: SessionGridColumns.sourceSegmentType.field,
    searchField: SessionGridColumns.sourceSegmentType.searchField,
    queryType: SessionGridColumns.sourceSegmentType.queryType,
    label: SessionGridColumns.sourceSegmentType.label,
    isField: true,
  },
  {
    resField: SessionGridColumns.destSegmentName.field,
    searchField: SessionGridColumns.destSegmentName.searchField,
    queryType: SessionGridColumns.destSegmentName.queryType,
    label: SessionGridColumns.destSegmentName.label,
    isField: true,
  },
  {
    resField: SessionGridColumns.destSegmentType.field,
    searchField: SessionGridColumns.destSegmentType.searchField,
    queryType: SessionGridColumns.destSegmentType.queryType,
    label: SessionGridColumns.destSegmentType.label,
    isField: true,
  },
];

export enum FilterOpperatorTypes {
  AND = 'AND',
  OR = 'OR',
}

export const FilterOpperatorsList: ISelectedListItem<FilterOpperatorTypes>[] = [
  {
    id: FilterOpperatorTypes.AND,
    label: 'And',
    value: FilterOpperatorTypes.AND,
  },
  {
    id: FilterOpperatorTypes.OR,
    label: 'Or',
    value: FilterOpperatorTypes.OR,
  },
];
