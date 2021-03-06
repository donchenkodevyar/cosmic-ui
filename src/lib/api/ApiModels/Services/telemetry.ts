export const TelemetryApi = {
  getSankeyData: (time: string) => 'telemetry/api/v1/sankey?startTime=' + time,
  getAppDetails: (networkName: string, destinationName: string, time: string) => `telemetry/api/v1/appdetail/network/${networkName}/destination/${destinationName}?startTime=${time}`,
  getAllMetrics: () => 'telemetry/api/v1/metrics',
  getMetricsById: (id: string) => 'telemetry/api/v1/metrics/' + id,
  getAuditLogs: () => 'telemetry/api/v1/telemetry/audit-logs',
  getDeviceLoad: (id: string) => `telemetry/api/v1/metrics/device/${id}/load`,
  getNetworkUsage: (id: string) => `telemetry/api/v1/metrics/network/${id}/usage`,
  getDeviceMetrics: () => 'telemetry/api/v1/metrics/devices',
  getAppAccess: () => '/telemetry/api/v1/telemetry/site/appaccess',
  getConnectivityHealth: () => '/telemetry/api/v1/metrics/connectivityhealth',
  getTopologySegments: () => '/telemetry/api/v1/telemetry/metrics/traffic/topology/segments',
  getAggregatedTrafficByNetworkId: (networkId: string) => `/telemetry/api/v1/telemetry/metrics/traffic/aggregated/network/${networkId}`,
  getTrafficDataByNetworkExtIdAppId: (networkId: string, appId: string) => `/telemetry/api/v1/telemetry/metrics/traffic/dests/nw/${networkId}/app/${appId}`,
  getTrafficDataByAppId: (appId: string) => `/telemetry/api/v1/telemetry/metrics/traffic/aggregated/app/${appId}`,
  getAggregatedTraffic: () => '/telemetry/api/v1/telemetry/metrics/traffic/aggregated',
  getPacketLossMetrics: (deviceId: string, destination: string) => `/telemetry/api/v1/metrics/device/${deviceId}/destination/${destination}/packetloss`,
  getLatencyMetrics: (deviceId: string, destination: string) => `/telemetry/api/v1/metrics/device/${deviceId}/destination/${destination}/latency`,
  getJitterMetrics: (deviceId: string, destination: string) => `/telemetry/api/v1/metrics/device/${deviceId}/destination/${destination}/jitter`,
};
