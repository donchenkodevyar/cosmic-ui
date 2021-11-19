import { IBaseTotalCount } from 'lib/models/general';
import { IDevice, IVm } from 'lib/models/topology';
import { VendorTypes } from '../Topology/endpoints';

export enum PolicyDestinations {
  DEST_TRUE = 'dest_true',
  DEST_FAlSE = 'dest_false',
}
export enum PolicyActions {
  ALLOW = 'allow',
  CUSTOM = 'custom',
}

export interface IEdgePolicy {
  source: VendorTypes;
  destination: PolicyDestinations;
  action: PolicyActions;
}

export enum ValidationFields {
  // GENERAL
  NAME = 'name',
  CONNECTION = 'connection',
  TAGS = 'tags',
  // DEPLOYMENT
  CONTROLLER_NAME = 'controller_name',
  REGION_CODE = 'region_code',
}

export interface IDeployment {
  controller_name: string;
  region_code: string[];
  firewall: boolean;
  firewallRegion: string;
}

export interface IEdgeModel {
  id?: string;
  name: string;
  description: string;
  deployment: IDeployment;

  price?: number;
  connection: string[];
  tags: string[];
  site_group_ids: string[];
  app_group_ids: string[];
  policies: IEdgePolicy[] | null;
}

export interface ISitesRes extends IBaseTotalCount {
  devices: IDevice[];
  pageSize: number;
  pageNum: number;
}

export interface IAppsRes extends IBaseTotalCount {
  apps: IVm[];
  pageSize: number;
  pageNum: number;
}

export interface IEdgesRes extends IBaseTotalCount {
  edgeps: IEdgeModel[];
}
