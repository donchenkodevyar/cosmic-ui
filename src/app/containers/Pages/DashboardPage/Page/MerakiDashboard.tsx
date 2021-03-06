import React, { useCallback, useContext, useEffect, useState } from 'react';
import { DashboardStyles } from '../DashboardStyles';
import '../react-grid-layout.css';
import TabsListUnstyled from '@mui/base/TabsListUnstyled';
import { buttonUnstyledClasses } from '@mui/base/ButtonUnstyled';
import TabUnstyled, { tabUnstyledClasses } from '@mui/base/TabUnstyled';
import { styled } from '@mui/system';
import { TabsUnstyled } from '@mui/material';
import { DashboardItemContainer, DashboardItemContent, DashboardItemLabel, GridContainer, GridItemContainer } from '../styles/ChartContainer';
import InOutBound from '../components/ManagmentItem/InOutBound';
import ManagementLayer7 from '../components/ManagmentItem/ManagementLayer7';
import ManagementDrifts from '../components/ManagmentItem/ManagementDrifts';
import {
  AnomaliesResponse,
  AnomalySummary,
  AvailabilityMetric,
  DashboardSitesViewTab,
  Device,
  DeviceEscalationsResponse,
  DeviceMetrics,
  DeviceMetricsResponse,
  EscalationData,
  OnPremDevicesResponse,
  SitesData,
  SITES_COLUMNS,
} from '../enum';
import { Feature, Map } from '../components/Map/Map';
import { useGet } from 'lib/api/http/useAxiosHook';
import { UserContext, UserContextState } from 'lib/Routes/UserProvider';
import { TopoApi } from 'lib/api/ApiModels/Services/topo';
import LoadingIndicator from 'app/components/Loading';
import { TableWrapper } from 'app/components/Basic/Table/PrimeTableStyles';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Paging from 'app/components/Basic/Paging';
import { PAGING_DEFAULT_PAGE_SIZE } from 'lib/models/general';
import { AlertApi } from 'lib/api/ApiModels/Services/alert';
import isEmpty from 'lodash/isEmpty';
import { EmptyText } from 'app/components/Basic/NoDataStyles/NoDataStyles';
import { TelemetryApi } from 'lib/api/ApiModels/Services/telemetry';
import { DateTime } from 'luxon';
import { getCorrectedTimeString } from '../../MetricsPage/components/Utils';
import { downGreenArrow, downRedArrow, upGreenArrow, upRedArrow } from 'app/components/SVGIcons/arrows';
import { ROUTE } from 'lib/Routes/model';
import history from 'utils/history';
import { AlertSeverity, IAlertMeta, IAlertMetaDataRes, ModelalertType } from 'lib/api/ApiModels/Workflow/apiModel';
import { LocationState, TabName } from '../../MetricsPage';
import { ArrowContainer, SeverityLabelContainer } from '../styles/DashboardStyledComponents';
import { ALERT_TIME_RANGE_QUERY_TYPES, GENERAL_TIME_RANGE_QUERY_TYPES, paramBuilder } from 'lib/api/ApiModels/paramBuilders';
import { isNumber } from 'lodash';

const Tab = styled(TabUnstyled)`
  color: #848da3;
  cursor: pointer;
  font-size: 12px;
  background: #f3f6fc;
  padding: 6px 40px 6px 40px;
  border: none;
  border-radius: 6px;
  display: flex;

  &.Mui-selected {
    color: #437fec;
    font-weight: bold;
  }

  &:hover {
    color: #437fec;
  }

  &.${buttonUnstyledClasses.focusVisible} {
    color: #437fec;
  }

  &.${tabUnstyledClasses.selected} {
    background-color: white;
  }

  &.${buttonUnstyledClasses.disabled} {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const TabsList = styled(TabsListUnstyled)`
  border-radius: 6px;
  display: flex;
  align-content: space-between;
`;

enum EscalationResult {
  downGreen = 'downGreen',
  upRed = 'upRed',
  showSeverity = 'showSeverity',
}

const BASE_ANOMALIES_PAGE_SIZE = 10;

export const INPUT_TIME_FORMAT = 'yyyy-MM-dd HH:mm:ss ZZZ z';

export const AVAILABILITY_TIME_FORMAT = 'EEE, MMM dd yyyy, hh:mm a';

export const getAvailabilityArray = (availabilityArray: AvailabilityMetric[]): AvailabilityMetric[] => {
  if (isEmpty(availabilityArray)) {
    const availability: AvailabilityMetric[] = [];
    const time = DateTime.now().minus({ days: 1 });
    for (let index = 0; index < 48; index++) {
      availability.push({ time: time.toFormat(INPUT_TIME_FORMAT), value: '0' });
      time.plus({ minutes: 30 });
    }
    return availability;
  }
  return availabilityArray;
};

const dashboardHeaderStyle: React.CSSProperties = { fontSize: '12px', color: '#848DA3', fontWeight: 700, wordBreak: 'normal' };
const getDashboardRowStyle = (minWidth: string): React.CSSProperties => ({
  minWidth: minWidth,
  padding: 5,
  fontSize: 14,
  wordWrap: 'break-word',
  wordBreak: 'break-all',
});

export const MerakiDashboard: React.FC = () => {
  const classes = DashboardStyles();
  const userContext = useContext<UserContextState>(UserContext);
  const [sitesViewTabName, setSitesViewTabName] = useState<DashboardSitesViewTab>(DashboardSitesViewTab.Map);

  const [totalCount, setTotalCount] = React.useState<number>(0);
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [pageSize, setPageSize] = React.useState<number>(PAGING_DEFAULT_PAGE_SIZE);
  const [anomalies, setAnomalies] = useState<AnomalySummary[]>([]);
  const [alertMetadata, setAlertMetadata] = useState<IAlertMeta[]>([]);
  const [anomaliesPageSize, setAnomaliesPageSize] = useState<number>(BASE_ANOMALIES_PAGE_SIZE);

  const { response: devicesResponse, loading: devicesLoading, error: devicesError, onGet: getDevices } = useGet<OnPremDevicesResponse>();
  const { response: deviceMetricsResponse, loading: deviceMetricsLoading, onGet: getDeviceMetrics } = useGet<DeviceMetricsResponse>();
  const { response: anomaliesResponse, loading: anomaliesLoading, error: anomaliesError, onGet: getAnomalies } = useGet<AnomaliesResponse>();
  const { loading: alertMetadataLoading, response: alertMetadaResponse, onGet: GetAlertMetadata } = useGet<IAlertMetaDataRes>();
  const { response: deviceEscalationResponse, onGet: GetDeviceEscalations } = useGet<DeviceEscalationsResponse>();

  const onTabChange = (event: React.SyntheticEvent<Element, Event>, value: string | number) => {
    setSitesViewTabName(value as DashboardSitesViewTab);
  };

  const getAnomalySummaryPage = (pageSize: number) => getAnomalies(AlertApi.getAnomalies(), userContext.accessToken!, { pageSize: pageSize });

  useEffect(() => {
    getDevices(TopoApi.getOnPremDeviceList(), userContext.accessToken!);
    getDeviceMetrics(TelemetryApi.getDeviceMetrics(), userContext.accessToken!, { startTime: '-1d', endTime: '-0m' });
    getAnomalySummaryPage(anomaliesPageSize);
    const _param = paramBuilder(50, 1, ALERT_TIME_RANGE_QUERY_TYPES.LAST_DAY);
    GetAlertMetadata(AlertApi.getAllMetadata(), userContext.accessToken!, _param);
    const deviceEscalationParams = { time_range: GENERAL_TIME_RANGE_QUERY_TYPES.LAST_DAY };
    GetDeviceEscalations(AlertApi.getDeviceEscalations(), userContext.accessToken!, deviceEscalationParams);
  }, []);

  const convertDataToFeatures = useCallback(
    (devices: Device[] = [], escalationData: EscalationData[] = []): Feature[] => {
      return devices.map(device => {
        const deviceEscalationData = escalationData.find(item => item.objectExtId === device.extId);
        return {
          type: 'Feature',
          properties: { title: device.extId, uplinks: device.uplinks, name: device.vnetworks.reduce((acc, cur) => acc + cur.name, '') },
          geometry: {
            deviceEscalationData: deviceEscalationData,
            coordinates: [device.lon, device.lat],
            type: 'Point',
            name: device.id,
          },
        };
      });
    },
    [devicesResponse, deviceEscalationResponse],
  );

  const convertDataToSitesData = useCallback(
    (devices: Device[] = [], deviceMetrics: DeviceMetrics[] = []): SitesData[] => {
      return devices.map(device => {
        const selectedDeviceMetric = deviceMetrics.find(metric => metric.extId === device.extId);
        const tagArray = device.vnetworks.reduce((acc, vnetwork) => acc.concat(vnetwork.tags), []).map(tag => tag.value);
        const bytesSent = selectedDeviceMetric?.bytesSendUsage / 1000000;
        const bytesRecieved = selectedDeviceMetric?.bytesReceivedUsage / 1000000;
        const availabilityArray = getAvailabilityArray(selectedDeviceMetric?.availabilityMetrics);
        return {
          name: device.vnetworks.reduce((acc, cur) => acc + cur.name, '') || '',
          totalUsage: (
            <div className={classes.troubleshootContainer}>
              <div>
                <span className={classes.totalUsageIcon}>{upGreenArrow}</span>
                <span title="Bytes Sent">{`${bytesSent > 0 ? bytesSent.toFixed(2) : 0} MB`}</span>
              </div>
              <div>
                <span className={classes.totalUsageIcon}>{downRedArrow}</span>
                <span title="Bytes Recieved">{`${bytesRecieved > 0 ? bytesRecieved.toFixed(2) : 0} MB`}</span>
              </div>
            </div>
          ),
          avgBandwidth: '',
          latency: selectedDeviceMetric?.latency ? `${selectedDeviceMetric?.latency.toFixed(2)} ms` : 'NaN',
          packetLoss: isNumber(selectedDeviceMetric?.packetloss) ? `${selectedDeviceMetric?.packetloss > 0 ? selectedDeviceMetric?.packetloss.toFixed(2) : selectedDeviceMetric?.packetloss}%` : 'NaN',
          goodput: selectedDeviceMetric?.goodput ? `${selectedDeviceMetric?.goodput / 1000} mbps` : 'NaN',
          jitter: '',
          clients: device.vnetworks.reduce((acc, vnetwork) => acc + vnetwork.numberOfOnetClients, 0),
          tags: tagArray.join(', '),
          uplinks: device.uplinks.map(uplink => uplink.name).join(', '),
          availability: (
            <div className={classes.connectivityContainer}>
              {availabilityArray?.map((item, index) => {
                const timestamp = DateTime.fromFormat(getCorrectedTimeString(item.time), INPUT_TIME_FORMAT).toFormat(AVAILABILITY_TIME_FORMAT);
                if (Number(item.value) > 0) {
                  return <div title={timestamp} key={index} className={classes.connectivityUnavailableItem} />;
                }
                return <div title={timestamp} key={index} className={classes.connectivityAvailableItem} />;
              })}
            </div>
          ),
        };
      });
    },
    [devicesResponse, deviceMetricsResponse],
  );

  const loadMoreAnomalies = () => {
    const newPageSize = anomaliesPageSize + BASE_ANOMALIES_PAGE_SIZE;
    setAnomaliesPageSize(newPageSize);
    getAnomalySummaryPage(newPageSize);
  };

  useEffect(() => {
    if (anomaliesResponse && anomaliesResponse.anomalySummary && anomaliesResponse.anomalySummary.length) {
      setAnomalies(anomaliesResponse.anomalySummary);
    }
  }, [anomaliesResponse]);

  useEffect(() => {
    if (alertMetadaResponse && alertMetadaResponse.alertMetadata && alertMetadaResponse.alertMetadata.length) {
      setAlertMetadata(alertMetadaResponse.alertMetadata);
    }
  }, [alertMetadaResponse]);

  const onChangeCurrentPage = (_page: number) => {
    setCurrentPage(_page);
    // TODO: Modify this
    // onTryLoadAlertMetaData(size, page, selectedPeriod);
  };

  const onChangePageSize = (size: number, page?: number) => {
    if (page) {
      setCurrentPage(page);
      setPageSize(size);
      // TODO: Modify this
      // onTryLoadAlertMetaData(size, page, selectedPeriod);
      return;
    }
    setPageSize(size);
    // onTryLoadAlertMetaData(size, currentPage, selectedPeriod);
  };

  const onAnomalyClick = (deviceId: string, destinationIp: string, anomalyType: ModelalertType) => {
    const locationState: LocationState = { anomalyType: anomalyType, destination: destinationIp, deviceId: deviceId, tabName: TabName.Performance, timeRange: '-7d' };
    history.push(ROUTE.app + ROUTE.metrics, locationState);
  };

  const getSeverityColour = (anomalyType: ModelalertType) => {
    const selectedAlert = alertMetadata.find(alert => alert.type === anomalyType);
    if (selectedAlert) {
      return selectedAlert.severity === AlertSeverity.LOW ? 'var(--_successColor)' : selectedAlert.severity === AlertSeverity.MEDIUM ? 'var(--_warningColor)' : 'var(--_errorColor)';
    }
    return 'var(--_disabledTextColor)';
  };

  const getSeverityText = (anomalyType: ModelalertType) => {
    const selectedAlert = alertMetadata.find(alert => alert.type === anomalyType);
    if (selectedAlert) {
      return selectedAlert.severity === AlertSeverity.LOW ? 'L' : selectedAlert.severity === AlertSeverity.MEDIUM ? 'M' : 'H';
    }
    return '?';
  };

  const checkAnomalyDescString = (anomalyString: string) => {
    if (anomalyString.includes('occurred once') || anomalyString.includes('occured once') || anomalyString.includes('increased') || anomalyString.includes('went up')) {
      return EscalationResult.upRed;
    }
    if (anomalyString.includes('decreased') || anomalyString.includes('went down')) {
      return EscalationResult.downGreen;
    }
    return EscalationResult.showSeverity;
  };

  const getEscalationHeader = (anomaly: AnomalySummary) => {
    const escalationResult = checkAnomalyDescString(anomaly.descString);
    return escalationResult === EscalationResult.showSeverity ? (
      <SeverityLabelContainer color={getSeverityColour(anomaly.anomalyType)}>
        <span className={classes.severityLabel}>{getSeverityText(anomaly.anomalyType)}</span>
      </SeverityLabelContainer>
    ) : escalationResult === EscalationResult.upRed ? (
      <ArrowContainer>{upRedArrow(20, 20)}</ArrowContainer>
    ) : (
      <ArrowContainer>{downGreenArrow(20, 20)}</ArrowContainer>
    );
  };

  return (
    <GridContainer>
      <GridItemContainer gridArea="1 / 1 / 3 / 2" minResponciveHeight="500px">
        <DashboardItemContainer>
          <div className={classes.sitesHeader}>
            <div className={classes.sitesHeaderLeftSection}>
              <span className={classes.sites}>Sites</span>
              <div className={classes.pillContainer}>
                <span className={classes.pillText}>{devicesResponse?.totalCount}</span>
              </div>
            </div>
            <TabsUnstyled value={sitesViewTabName} onChange={onTabChange}>
              <div className={classes.tabListContainer}>
                <TabsList>
                  <Tab value={DashboardSitesViewTab.Map}>{DashboardSitesViewTab.Map.toUpperCase()}</Tab>
                  <Tab value={DashboardSitesViewTab.List}>{DashboardSitesViewTab.List.toUpperCase()}</Tab>
                </TabsList>
              </div>
            </TabsUnstyled>
          </div>
          {devicesLoading && <LoadingIndicator margin="auto" />}

          {devicesError && <div>Something went wrong. Please try again</div>}

          {!devicesLoading && sitesViewTabName === DashboardSitesViewTab.Map && (
            <div className={classes.mapContainerMain}>
              <Map features={convertDataToFeatures(devicesResponse?.devices, deviceEscalationResponse?.escalationData)} deviceMetrics={deviceMetricsResponse?.deviceMetrics || []} />
            </div>
          )}

          {!devicesLoading && sitesViewTabName === DashboardSitesViewTab.List && (
            <>
              <TableWrapper className={classes.tableWrapper}>
                <DataTable
                  className="tableSM fixedToParentHeight"
                  id="meraki_sites"
                  responsiveLayout="scroll"
                  value={convertDataToSitesData(devicesResponse?.devices || [], deviceMetricsResponse?.deviceMetrics || [])}
                  scrollable
                >
                  <Column headerStyle={dashboardHeaderStyle} style={getDashboardRowStyle(SITES_COLUMNS.name.minWidth)} field={SITES_COLUMNS.name.field} header={SITES_COLUMNS.name.label}></Column>
                  <Column
                    headerStyle={dashboardHeaderStyle}
                    style={getDashboardRowStyle(SITES_COLUMNS.uplinks.minWidth)}
                    field={SITES_COLUMNS.uplinks.field}
                    header={SITES_COLUMNS.uplinks.label}
                  ></Column>
                  <Column
                    headerStyle={dashboardHeaderStyle}
                    style={getDashboardRowStyle(SITES_COLUMNS.totalUsage.minWidth)}
                    field={SITES_COLUMNS.totalUsage.field}
                    header={SITES_COLUMNS.totalUsage.label}
                  ></Column>
                  <Column
                    headerStyle={dashboardHeaderStyle}
                    style={getDashboardRowStyle(SITES_COLUMNS.clients.minWidth)}
                    field={SITES_COLUMNS.clients.field}
                    header={SITES_COLUMNS.clients.label}
                  ></Column>
                  <Column headerStyle={dashboardHeaderStyle} style={getDashboardRowStyle(SITES_COLUMNS.tags.minWidth)} field={SITES_COLUMNS.tags.field} header={SITES_COLUMNS.tags.label}></Column>
                  <Column
                    headerStyle={dashboardHeaderStyle}
                    style={getDashboardRowStyle(SITES_COLUMNS.latency.minWidth)}
                    field={SITES_COLUMNS.latency.field}
                    header={SITES_COLUMNS.latency.label}
                  ></Column>
                  <Column
                    headerStyle={dashboardHeaderStyle}
                    style={getDashboardRowStyle(SITES_COLUMNS.packetLoss.minWidth)}
                    field={SITES_COLUMNS.packetLoss.field}
                    header={SITES_COLUMNS.packetLoss.label}
                  ></Column>
                  <Column
                    headerStyle={dashboardHeaderStyle}
                    style={getDashboardRowStyle(SITES_COLUMNS.goodput.minWidth)}
                    field={SITES_COLUMNS.goodput.field}
                    header={SITES_COLUMNS.goodput.label}
                  ></Column>
                  <Column
                    headerStyle={dashboardHeaderStyle}
                    style={getDashboardRowStyle(SITES_COLUMNS.availability.minWidth)}
                    field={SITES_COLUMNS.availability.field}
                    header={SITES_COLUMNS.availability.label}
                  ></Column>
                </DataTable>
              </TableWrapper>
              <Paging
                disabled={totalCount === 0}
                hideRange={1024}
                count={totalCount}
                pageSize={pageSize}
                currentPage={currentPage}
                onChangePage={onChangeCurrentPage}
                onChangePageSize={onChangePageSize}
                pagingWrapStyles={{ display: totalCount < pageSize ? 'none' : '' }}
              />
            </>
          )}
        </DashboardItemContainer>
      </GridItemContainer>
      <GridItemContainer gridArea="1 / 2 / 2 / 3">
        <DashboardItemContainer>
          <DashboardItemLabel>Management</DashboardItemLabel>
          <DashboardItemContent>
            <ManagementDrifts />
            <InOutBound styles={{ margin: '0 20px' }} />
            <ManagementLayer7 />
          </DashboardItemContent>
        </DashboardItemContainer>
      </GridItemContainer>
      <GridItemContainer gridArea="2 / 2 / 3 / 3">
        <DashboardItemContainer>
          <div className={classes.dashboardLabelContainer}>
            <DashboardItemLabel style={{ marginBottom: '0px' }}>Escalations</DashboardItemLabel>
          </div>
          <div className={classes.anomaliesRowsContainer}>
            {anomaliesLoading && alertMetadataLoading && (
              <div className={classes.verticalCenter}>
                <LoadingIndicator margin="auto" />
              </div>
            )}

            {anomaliesError && <div>Something went wrong. Please try again</div>}

            {!anomaliesLoading && !alertMetadataLoading && isEmpty(anomalies) && (
              <div className={classes.verticalCenter}>
                <EmptyText>No Data</EmptyText>
              </div>
            )}
            {!anomaliesLoading &&
              !alertMetadataLoading &&
              !anomaliesError &&
              anomalies.map(anomaly => {
                const now = DateTime.now();
                const timestamp = DateTime.fromFormat(getCorrectedTimeString(anomaly.timestamp), INPUT_TIME_FORMAT);
                const diff = now.diff(timestamp, ['years', 'months', 'days', 'hours', 'minutes']).toObject();
                let diffString: string[] = [];
                ['years', 'months', 'days', 'hours', 'minutes'].forEach(item => {
                  if (diff[item] > 0) {
                    diffString.push(`${Math.round(diff[item])} ${item} ago`);
                    return;
                  }
                });
                return (
                  <div
                    key={`${anomaly.timestamp}_${anomaly.descString}_${anomaly.boldDescString}_${anomaly.regularDescString}`}
                    className={classes.anomalyRow}
                    onClick={() => onAnomalyClick(anomaly.deviceId, anomaly.destinationIp, anomaly.anomalyType)}
                  >
                    <div className={classes.troubleshootContainer}>
                      {getEscalationHeader(anomaly)}
                      {anomaly.boldDescString && anomaly.regularDescString ? (
                        <div>
                          <span>{anomaly.boldDescString}</span>
                          <span>{anomaly.regularDescString}</span>
                        </div>
                      ) : (
                        <div>
                          <span>{anomaly.descString}</span>
                        </div>
                      )}
                    </div>
                    <div className={classes.timeDiffContainer}>
                      <span className={classes.timeDiffText}>{diffString[0]}</span>
                    </div>
                  </div>
                );
              })}
            <div hidden={anomaliesLoading ? true : anomaliesResponse?.totalCount < anomaliesPageSize} className={`${classes.horizontalCenter} ${classes.loadMoreButton}`} onClick={loadMoreAnomalies}>
              Load More
            </div>
          </div>
        </DashboardItemContainer>
      </GridItemContainer>
    </GridContainer>
  );
};
