import { Device, Organization, Vnet } from 'lib/api/http/SharedTypes';
import isEmpty from 'lodash/isEmpty';

export const GetSelectedOrganizationName = (organizations: Organization[], orgId: string) => {
  const selectedOrganization = organizations.find(organization => organization.extId === orgId);
  return selectedOrganization?.name || orgId;
};

export const GetSelectedNetworkName = (networks: Vnet[], networkId: string) => {
  const selectedNetwork = networks.find(network => network.extId === networkId);
  return selectedNetwork?.name || networkId;
};

export const GetDevicesString = (devices: Device[], sourceNetworkExtId: string) => {
  if (!isEmpty(devices)) {
    return devices
      .filter(device => device.networkId === sourceNetworkExtId)
      .map(device => device.extId)
      .join(',');
  } else {
    return '';
  }
};

export const getTestSegmentIds = (devices: Device[], sourceNetworkExtId: string) => {
  if (isEmpty(devices)) {
    return [];
  } else {
    return devices.filter(device => device.networkId === sourceNetworkExtId).map(device => device.segmentId);
  }
};
