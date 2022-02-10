import { Backdrop, collapseClasses } from '@mui/material';
import React, { ChangeEvent, useContext, useEffect, useMemo, useState } from 'react';
import { PerformanceDashboardStyles } from './PerformanceDashboardStyles';
import Table, { Data } from './Table';
import { CreateSLATest } from './CreateSLATest';
import { Column, FinalTableData, SLATest, UpdateSLATestRequest, ColumnAccessor } from 'lib/api/http/SharedTypes';
import { PacketLoss } from './PacketLoss';
import { Latency } from './Latency';
import Select from 'react-select';
import AverageQoe from './AverageQoe';
import { Goodput } from './Goodput';
import { MetricTabValue } from '../../../DashboardPage/enum/MetricTabValue';
import { UserContext, UserContextState } from 'lib/Routes/UserProvider';
import { createApiClient } from 'lib/api/http/apiClient';
import { Checkbox, FormControlLabel, FormGroup, Popover } from '@mui/material';
import { INetworkOrg } from 'lib/api/ApiModels/Topology/apiModels';
import { addIcon } from 'app/components/SVGIcons/addIcon';
import PrimaryButton from 'app/components/Buttons/PrimaryButton';
import TabsUnstyled from '@mui/base/TabsUnstyled';
import TabsListUnstyled from '@mui/base/TabsListUnstyled';
import TabPanelUnstyled from '@mui/base/TabPanelUnstyled';
import { buttonUnstyledClasses } from '@mui/base/ButtonUnstyled';
import TabUnstyled, { tabUnstyledClasses } from '@mui/base/TabUnstyled';
import { styled } from '@mui/system';
import { CheckboxData } from 'app/containers/Pages/AnalyticsPage/components/Metrics Explorer/Dimensions';
import SecondaryButtonwithEvent from 'app/containers/Pages/AnalyticsPage/components/SecondaryButtonwithEvent';
import ColumnsIcon from '../../icons/performance dashboard/columns';
import SearchIcon from 'app/containers/Pages/AnalyticsPage/icons/metrics explorer/search';

interface SLATestListProps {
  readonly finalTableData: FinalTableData[];
  readonly addSlaTest: Function;
  readonly merakiOrganizations: INetworkOrg[];
  readonly awsOrganizations: INetworkOrg[];
  readonly deleteSlaTest: Function;
  readonly updateSlaTest: (submitData: UpdateSLATestRequest) => void;
}

const Tab = styled(TabUnstyled)`
  color: #848da3;
  cursor: pointer;
  font-size: 12px;
  background: #f3f6fc;
  padding: 15px 40px 15px 40px;
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

const TabPanel = styled(TabPanelUnstyled)`
  width: 100%;
`;

const TabsList = styled(TabsListUnstyled)`
  border-radius: 6px;
  display: flex;
  align-content: space-between;
`;

const columns: Column[] = [
  {
    Header: 'NAME',
    accessor: ColumnAccessor.name,
  },
  {
    Header: 'SOURCE ORGANIZATION',
    accessor: ColumnAccessor.sourceOrg,
  },
  {
    Header: 'SOURCE NETWORK',
    accessor: ColumnAccessor.sourceNetwork,
  },
  {
    Header: 'SOURCE DEVICE',
    accessor: ColumnAccessor.sourceDevice,
  },
  {
    Header: 'DESTINATION',
    accessor: ColumnAccessor.destination,
  },
  {
    Header: 'DESCRIPTION',
    accessor: ColumnAccessor.description,
  },
  {
    Header: 'AVERAGE QOE',
    accessor: ColumnAccessor.averageQoe,
  },
];

const COLUMNS_POPOVER = 'columns-popover';

export const SLATestList: React.FC<SLATestListProps> = ({ updateSlaTest, deleteSlaTest, awsOrganizations, merakiOrganizations, finalTableData, addSlaTest }) => {
  const classes = PerformanceDashboardStyles();

  const [searchText, setSearchText] = useState<string>('');
  const [createToggle, setCreateToggle] = React.useState<boolean>(false);
  const [tab, setTab] = useState<string>(MetricTabValue.latency);
  const [selectedRows, setSelectedRows] = useState<Data[]>([]);
  const [timeRange, setTimeRange] = useState<string>('-7d');
  const [testDataToUpdate, setTestDataToUpdate] = useState<SLATest>({
    testId: '',
    name: '',
    sourceOrgId: '',
    sourceNwExtId: '',
    destination: '',
    interface: '',
    description: '',
  });
  const [filteredTableData, setFilteredTableData] = useState<FinalTableData[]>(finalTableData);

  const initialCheckboxData: CheckboxData = columns.reduce((accu, nextValue) => {
    nextValue.accessor === ColumnAccessor.description ? (accu[nextValue.accessor] = false) : (accu[nextValue.accessor] = true);
    return accu;
  }, {});

  const [updateTestToggle, setUpdateTestToggle] = useState<boolean>(false);
  const [columnCheckboxData, setColumnCheckboxData] = useState<CheckboxData>(initialCheckboxData);
  const [selectedColumns, setSelectedColumns] = useState<Column[]>([]);
  const [columnAnchorEl, setColumnAnchorEl] = useState<HTMLButtonElement | null>(null);

  const escapeRegExp = (value: string) => value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');

  const handleSearchTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
    const searchRegex = new RegExp(escapeRegExp(event.target.value), 'i');
    const filteredRows = finalTableData.filter((row: any) => {
      return Object.keys(row).some((field: any) => {
        if (row[field]) {
          return searchRegex.test(row[field].toString());
        }
        return false;
      });
    });
    setFilteredTableData(filteredRows);
  };

  const handleColmunsClick = (event: React.MouseEvent<HTMLButtonElement>) => setColumnAnchorEl(event.currentTarget);

  const handleColumnsClose = () => setColumnAnchorEl(null);

  const isColumnsPopoverOpen = Boolean(columnAnchorEl);
  const columnsPopoverId = isColumnsPopoverOpen ? COLUMNS_POPOVER : undefined;

  const userContext = useContext<UserContextState>(UserContext);
  const apiClient = createApiClient(userContext.accessToken!);

  const handleTabChange = (event, newValue: string) => setTab(newValue);

  const handleClose = () => {
    setCreateToggle(false);
    setUpdateTestToggle(false);
  };

  const handleToggle = () => setCreateToggle(!createToggle);

  const handleUpdateTestToggle = () => setUpdateTestToggle(!updateTestToggle);

  const addTest = (value: FinalTableData) => {
    addSlaTest(value);
  };

  const onSelectedRowsUpdate = (value: Data[]) => setSelectedRows(value);

  const deleteTest = (testId: string) => deleteSlaTest(testId);

  const getTestDataToUpdate = async (testId: string) => {
    const responseData = await apiClient.getSLATest(testId);
    setTestDataToUpdate(responseData);
    handleUpdateTestToggle();
  };

  useEffect(() => {
    const newSelectedColumns = columns.filter(item => columnCheckboxData[item.accessor]);
    setSelectedColumns(newSelectedColumns);
  }, [columnCheckboxData]);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setColumnCheckboxData({
      ...columnCheckboxData,
      [event.target.name]: event.target.checked,
    });

  const data = useMemo(
    () =>
      filteredTableData.map(item => {
        return {
          id: item.id,
          name: item.name,
          sourceOrg: item.sourceOrg,
          sourceNetwork: item.sourceNetwork,
          sourceDevice: item.sourceDevice,
          destination: item.destination,
          description: item.description,
          averageQoe: <AverageQoe updateTest={getTestDataToUpdate} deleteTest={deleteTest} packetLoss={item.averageQoe.packetLoss} latency={item.averageQoe.latency} testId={item.id} />,
        };
      }),
    [filteredTableData],
  );

  const timeRangeOptions = [
    {
      value: '-1d',
      label: 'Last day',
    },
    {
      value: '-7d',
      label: 'Last 7 days',
    },
  ];

  const dropdownStyle = {
    option: provided => ({
      ...provided,
      color: 'black',
    }),
    control: provided => ({
      ...provided,
      width: 150,
    }),
  };

  return (
    <div className={classes.slaTestListContainer}>
      <div className={classes.itemContainer}>
        <div className={classes.flexContainer}>
          <div>
            <span className={classes.itemTitle}>SLA Tests</span>
          </div>
          <div>
            <span className={classes.marginButton}>
              <input type="text" value={searchText} className={classes.searchBar} onChange={handleSearchTextChange} placeholder="Search" />
              <span className={classes.searchIcon}>
                <SearchIcon />
              </span>
            </span>
            <span className={classes.marginButton}>
              <SecondaryButtonwithEvent
                label={
                  <>
                    <span className={classes.otherButtonText}>COLUMNS</span>
                    <ColumnsIcon />
                  </>
                }
                active={isColumnsPopoverOpen}
                onClick={handleColmunsClick}
              />
            </span>
            <Popover
              id={columnsPopoverId}
              open={isColumnsPopoverOpen}
              onClose={handleColumnsClose}
              anchorEl={columnAnchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
            >
              <FormGroup className={classes.popoverContainer}>
                {columns
                  .filter(column => column.accessor !== ColumnAccessor.name)
                  .map(item => (
                    <FormControlLabel
                      key={item.accessor}
                      className={classes.popoverItem}
                      control={<Checkbox checked={columnCheckboxData[item.accessor]} onChange={handleCheckboxChange} name={item.accessor} />}
                      label={<span className={classes.popoverText}>{item.Header}</span>}
                    />
                  ))}
              </FormGroup>
            </Popover>
            <PrimaryButton height="50px" label="CREATE SLA TEST" icon={addIcon} onClick={handleToggle} />
          </div>
        </div>
        <div>
          <span className={classes.subTitleText}>Select sources for wich you want to view data.</span>
        </div>
        <div className={classes.tableContainer}>
          <Table onSelectedRowsUpdate={onSelectedRowsUpdate} columns={selectedColumns} data={data} />
        </div>
      </div>
      <div className={classes.itemContainer}>
        <TabsUnstyled value={tab} onChange={handleTabChange}>
          <div className={classes.tabTitleContainer}>
            <div className={classes.performanceTabContainer}>
              <TabsList>
                <Tab value={MetricTabValue.packetLoss}>{MetricTabValue.packetLoss.toUpperCase()}</Tab>
                <Tab value={MetricTabValue.latency}>{MetricTabValue.latency.toUpperCase()}</Tab>
                <Tab value={MetricTabValue.goodput}>{MetricTabValue.goodput.toUpperCase()}</Tab>
              </TabsList>
            </div>
            <div className={classes.timeRangeContainer}>
              <span className={classes.timeRangeText}>Time Range:</span>
              <Select label="Single select" styles={dropdownStyle} value={timeRangeOptions.find(time => time.value === timeRange)} options={timeRangeOptions} onChange={e => setTimeRange(e.value)} />
            </div>
          </div>
          <TabPanel value={MetricTabValue.packetLoss}>
            <PacketLoss timeRange={timeRange} selectedRows={selectedRows} />
          </TabPanel>
          <TabPanel value={MetricTabValue.latency}>
            <Latency timeRange={timeRange} selectedRows={selectedRows} />
          </TabPanel>
          <TabPanel value={MetricTabValue.goodput}>
            <Goodput timeRange={timeRange} selectedRows={selectedRows} />
          </TabPanel>
        </TabsUnstyled>
      </div>
      <Backdrop style={{ color: '#fff', zIndex: 5 }} open={createToggle}>
        <CreateSLATest awsOrganizations={awsOrganizations} merakiOrganizations={merakiOrganizations} addSlaTest={addTest} popup={true} closeSlaTest={handleClose} />
      </Backdrop>
      <Backdrop style={{ color: '#fff', zIndex: 5 }} open={updateTestToggle}>
        <CreateSLATest
          updateSlaTest={updateSlaTest}
          slaTestDataToUpdate={testDataToUpdate}
          isUpdateTest={true}
          awsOrganizations={awsOrganizations}
          merakiOrganizations={merakiOrganizations}
          popup={true}
          closeSlaTest={handleClose}
        />
      </Backdrop>
    </div>
  );
};
