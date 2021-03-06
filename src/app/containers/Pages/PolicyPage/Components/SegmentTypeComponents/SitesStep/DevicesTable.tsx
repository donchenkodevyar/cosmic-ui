import React from 'react';
import { GridWrapper } from 'app/containers/Pages/Edges/Editor/Components/styles';
import { DataGrid, GridColDef, GridColumnHeaderParams, GridRowParams, GridSelectionModel } from '@mui/x-data-grid';
import SimpleCheckbox from 'app/components/Inputs/Checkbox/SimpleCheckbox';
import { GridStyles } from 'app/components/Grid/GridStyles';
import Paging from 'app/components/Basic/Paging';
import { ErrorMessage } from 'app/components/Basic/ErrorMessage/ErrorMessage';
import LoadingIndicator from 'app/components/Loading';
import { AbsLoaderWrapper } from 'app/components/Loading/styles';
import { INetworkDevice, ISitesRes } from 'lib/api/ApiModels/Topology/apiModels';
import { IUiPagingData } from 'lib/api/ApiModels/generalApiModel';
import { ISegmentSiteSegmentMatchRuleP, SegmentSegmentType, SegmentSiteSegmentMatchKey } from 'lib/api/ApiModels/Policy/Segment';
import * as helper from '../../helper';
import { paramBuilder } from 'lib/api/ApiModels/paramBuilders';
import { TopoApi } from 'lib/api/ApiModels/Services/topo';
import { useGet } from 'lib/api/http/useAxiosHook';
import { UserContextState, UserContext } from 'lib/Routes/UserProvider';

interface Props {
  matchRules: ISegmentSiteSegmentMatchRuleP[];
  selectedMatchKey: SegmentSiteSegmentMatchKey;
  onSelectChange: (type: SegmentSegmentType, rule: ISegmentSiteSegmentMatchRuleP) => void;
  onSelectAll: (type: SegmentSegmentType, rules: ISegmentSiteSegmentMatchRuleP[]) => void;
}

const DevicesTable: React.FC<Props> = (props: Props) => {
  const userContext = React.useContext<UserContextState>(UserContext);
  const { loading: deviceLoading, response: deviceRes, error: deviceError, onGet: onGetDevices } = useGet<ISitesRes>();
  const [columns, setColumns] = React.useState<GridColDef[]>([
    {
      field: 'networkId',
      headerName: 'Network ID',
      width: 220,
      disableColumnMenu: true,
      resizable: false,
      editable: false,
      sortable: false,
      hideSortIcons: true,
      filterable: false,
      disableReorder: true,
      disableExport: true,
      hide: false,
    },
    {
      field: 'serial',
      headerName: 'Serial',
      width: 220,
      disableColumnMenu: true,
      resizable: false,
      editable: false,
      sortable: false,
      hideSortIcons: true,
      filterable: false,
      disableReorder: true,
      disableExport: true,
      hide: true,
    },
    {
      field: 'model',
      headerName: 'Model',
      width: 220,
      disableColumnMenu: true,
      resizable: false,
      editable: false,
      sortable: false,
      hideSortIcons: true,
      filterable: false,
      disableReorder: true,
      disableExport: true,
      hide: true,
    },
    {
      field: 'extId',
      headerName: 'Ext ID',
      width: 220,
      disableColumnMenu: true,
      resizable: false,
      editable: false,
      sortable: false,
      hideSortIcons: true,
      filterable: false,
      disableReorder: true,
      disableExport: true,
    },
    {
      field: 'ownerId',
      headerName: 'Owner ID',
      width: 160,
      disableColumnMenu: true,
      resizable: false,
      editable: false,
      sortable: false,
      hideSortIcons: true,
      filterable: false,
      disableReorder: true,
      disableExport: true,
    },
  ]);
  const [devices, setDevices] = React.useState<INetworkDevice[]>([]);
  const [devicesPagingData, setDevicesPagingData] = React.useState<IUiPagingData>({
    totalCount: 0,
    pageOffset: 1,
    pageSize: 10,
  });
  const gridStyles = GridStyles();
  const [selectionModel, setSelectionModel] = React.useState<GridSelectionModel>([]);

  React.useEffect(() => {
    onTryLoadDevices(devicesPagingData);
  }, []);

  React.useEffect(() => {
    if (deviceRes) {
      if (deviceRes.devices && deviceRes.devices.length) {
        setDevices(deviceRes.devices);
      } else {
        setDevices([]);
      }
    }
  }, [deviceRes]);

  React.useEffect(() => {
    const _ids = [];
    if (devices && devices.length && props.matchRules && props.matchRules.length) {
      props.matchRules.forEach(it => {
        const field = helper.getSitesFieldFromRuleKey(it.matchKey);
        const _el = devices.find(item => it.matchKey === props.selectedMatchKey && item[field] === it.matchValuePrimary);
        if (_el) {
          _ids.push(_el.id);
        }
      });
    }
    setSelectionModel(_ids);
  }, [props.matchRules, devices, props.selectedMatchKey]);

  React.useEffect(() => {
    const _items: GridColDef[] = columns.map(col => {
      if (col.field === 'model') {
        col.hide = props.selectedMatchKey === SegmentSiteSegmentMatchKey.SITE_SEG_MATCH_KEY_MODEL ? false : true;
      }
      if (col.field === 'serial') {
        col.hide = props.selectedMatchKey === SegmentSiteSegmentMatchKey.SITE_SEG_MATCH_KEY_SERIAL_NUM ? false : true;
      }
      if (col.field === 'networkId') {
        col.hide = props.selectedMatchKey === SegmentSiteSegmentMatchKey.SITE_SEG_MATCH_KEY_NETWORK ? false : true;
      }
      return col;
    });
    setColumns(_items);
  }, [props.selectedMatchKey]);

  const onRowClick = (params: GridRowParams) => {
    const _item = params.row as INetworkDevice;
    const _value = helper.getSitesFieldValueFromRuleKey(props.selectedMatchKey, _item);
    const rule: ISegmentSiteSegmentMatchRuleP = {
      matchKey: props.selectedMatchKey,
      matchValuePrimary: _value,
    };
    props.onSelectChange(SegmentSegmentType.SITE, rule);
  };

  const onColumnHeaderClick = (params: GridColumnHeaderParams) => {
    if (params.field === '__check__') {
      const _items: ISegmentSiteSegmentMatchRuleP[] = [];
      const _field = helper.getSitesFieldFromRuleKey(props.selectedMatchKey);
      devices.forEach(it => {
        const rule: ISegmentSiteSegmentMatchRuleP = {
          matchKey: props.selectedMatchKey,
          matchValuePrimary: it[_field],
        };
        _items.push(rule);
      });
      props.onSelectAll(SegmentSegmentType.SITE, _items);
    }
  };

  const onChangePage = (page: number) => {
    const _obj: IUiPagingData = { ...devicesPagingData, pageOffset: page };
    setDevicesPagingData(_obj);
    onTryLoadDevices(_obj);
  };
  const onChangePageSize = (size: number, page?: number) => {
    const _obj: IUiPagingData = { ...devicesPagingData, pageSize: size };
    if (page) {
      _obj.pageOffset = page;
    }
    setDevicesPagingData(_obj);
    onTryLoadDevices(_obj);
  };

  const onTryLoadDevices = async (pageData: IUiPagingData) => {
    const _param = paramBuilder(pageData.pageSize, pageData.pageOffset);
    await onGetDevices(TopoApi.getSites(), userContext.accessToken!, _param);
  };
  return (
    <>
      <GridWrapper>
        <DataGrid
          disableColumnFilter
          className={gridStyles.borderedRow}
          headerHeight={50}
          rowHeight={50}
          hideFooter
          rowCount={devicesPagingData.totalCount}
          rows={devices}
          columns={columns}
          checkboxSelection
          onRowClick={onRowClick}
          onColumnHeaderClick={onColumnHeaderClick}
          selectionModel={selectionModel}
          loading={deviceLoading}
          error={deviceError ? deviceError.message : null}
          components={{
            NoRowsOverlay: () => (
              <AbsLoaderWrapper width="100%" height="100%">
                <ErrorMessage color="var(--_primaryTextColor)" margin="auto">
                  No data
                </ErrorMessage>
              </AbsLoaderWrapper>
            ),
            ErrorOverlay: () => <ErrorMessage margin="auto">{deviceError ? deviceError.message : null}</ErrorMessage>,
            LoadingOverlay: () => (
              <AbsLoaderWrapper width="100%" height="calc(100% - 50px)" top="50px">
                <LoadingIndicator margin="auto" />
              </AbsLoaderWrapper>
            ),
            BaseCheckbox: React.forwardRef(({ checked, onChange, indeterminate }, ref) => (
              <SimpleCheckbox ref={ref} isChecked={checked} toggleCheckboxChange={onChange} indeterminate={indeterminate} />
            )),
          }}
        />
      </GridWrapper>
      <Paging
        count={devicesPagingData.totalCount}
        disabled={!devices.length || devicesPagingData.totalCount === 0}
        pageSize={devicesPagingData.pageSize}
        currentPage={devicesPagingData.pageOffset}
        onChangePage={onChangePage}
        onChangePageSize={onChangePageSize}
        boundaryCount={0}
        siblingCount={0}
        pageSizeValues={[5, 10, 20, 50]}
        hideLabelAfter
        showFirstButton={false}
        showLastButton={false}
        pagingWrapStyles={{ height: '52px', paddingTop: '12px' }}
        selectWrapStyles={{ maxWidth: '150px' }}
        hideRange={680}
      />
    </>
  );
};

export default React.memo(DevicesTable);
