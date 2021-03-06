import { IGridColumnField } from 'lib/models/grid';

export interface ISiteTrafficColumns {
  network: IGridColumnField;
  sent: IGridColumnField;
  received: IGridColumnField;
  flows: IGridColumnField;
  activeTime: IGridColumnField;
  noOfClients: IGridColumnField;
}

export interface ISiteTrafficNestedColumns extends Omit<ISiteTrafficColumns, 'network'> {
  destination: IGridColumnField;
}

export const SiteTrafficColumns: ISiteTrafficColumns = {
  network: {
    label: 'Network/SITE',
    field: 'name',
    sortable: true,
    resField: 'name',
    minWidth: '80px',
  },
  flows: {
    label: 'Flows',
    field: 'flows',
    sortable: true,
    resField: 'flows',
    minWidth: '30px',
  },
  received: {
    label: 'Received',
    field: 'recv',
    sortable: true,
    resField: 'recv',
    minWidth: '30px',
  },
  sent: {
    label: 'Sent',
    field: 'sent',
    sortable: true,
    resField: 'sent',
    minWidth: '30px',
  },
  activeTime: {
    label: 'Active Time',
    field: 'activeTime',
    sortable: false,
    resField: 'activeTime',
    minWidth: '50px',
  },
  noOfClients: {
    label: 'Clients',
    field: 'noOfClients',
    sortable: true,
    resField: 'noOfClients',
    minWidth: '50px',
  },
};

export const SiteTrafficNestedColumns: ISiteTrafficNestedColumns = {
  ...SiteTrafficColumns,
  destination: {
    label: 'Destination',
    field: 'destination',
    sortable: true,
    resField: 'destination',
    minWidth: '70px',
  },
};
