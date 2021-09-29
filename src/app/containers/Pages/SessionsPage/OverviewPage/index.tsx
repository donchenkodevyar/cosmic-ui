import React from 'react';
import { CardWrapper, ChartWrapper, ContentWrapper, TableWrapper } from '../../Shared/styles';
import SessionCard from 'app/components/SessionCard';
import { sourcesIcon } from 'app/components/SVGIcons/sessionsIcons/sources';
import { tgwIcon } from 'app/components/SVGIcons/sessionsIcons/tgw';
import { destinationIcon } from 'app/components/SVGIcons/sessionsIcons/destination';
import { dropsIcon } from 'app/components/SVGIcons/sessionsIcons/drops';
import { securityHitsIcon } from 'app/components/SVGIcons/sessionsIcons/securityHits';
import SankeyChart from 'app/components/Charts/SankeyChart';
import Grid from 'app/components/Grid';
import { GridColDef } from '@mui/x-data-grid';
interface IProps {}

const OverviewPage: React.FC<IProps> = (props: IProps) => {
  const columns: GridColDef[] = [
    { field: 'id', headerName: '', minWidth: 40 },
    { field: 'time', headerName: 'Time', minWidth: 120 },
    { field: 'sessionId', headerName: 'Session ID', minWidth: 150 },
    { field: 'sourceIp', headerName: 'Source IP', minWidth: 150 },
    { field: 'destinationIp', headerName: 'Destination IP', minWidth: 200 },
    { field: 'sourcePort', headerName: 'Source Port', minWidth: 150 },
    { field: 'destinationPort', headerName: 'Destination Port', minWidth: 200 },
    { field: 'protocol', headerName: 'Protocol', minWidth: 150 },
    { field: 'x', headerName: 'AWS TGW', minWidth: 150 },
    { field: 'application', headerName: 'Application', minWidth: 200 },
    { field: 'policyId', headerName: 'Policy ID', minWidth: 150 },
  ];

  return (
    <>
      <CardWrapper>
        <SessionCard styles={{ margin: '0 20px 0 0' }} label="Total Sources" value="12" icon={sourcesIcon} valueColor="var(--_successColor)" />
        <SessionCard styles={{ margin: '0 20px 0 0' }} label="TGW" value="3" icon={tgwIcon} valueColor="var(--_hoverButtonBg)" />
        <SessionCard styles={{ margin: '0 20px 0 0' }} label="Destinations" value="10" icon={destinationIcon} valueColor="var(--_warningColor)" />
        <SessionCard styles={{ margin: '0 20px 0 0' }} label="Session Drops" value="5" icon={dropsIcon} valueColor="var(--_errorColor)" />
        <SessionCard label="Security Group Hits" value="6" icon={securityHitsIcon} valueColor="var(--_warningColor)" />
      </CardWrapper>
      <ContentWrapper>
        <ChartWrapper>
          <SankeyChart />
        </ChartWrapper>
        <TableWrapper>
          <Grid checkboxSelection rows={[]} columns={columns} />
        </TableWrapper>
      </ContentWrapper>
    </>
  );
};

export default React.memo(OverviewPage);
