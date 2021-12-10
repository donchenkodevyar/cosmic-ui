import React, { useContext } from 'react';
import { ActionPart, ActionRowStyles, ContentWrapper, PageContentWrapper, TableWrapper } from '../../Shared/styles';
import { useGet } from 'lib/api/http/useAxiosHook';
import { IAggregatedSessionsLogRes, IAllSessionsRes, ISession } from 'lib/api/ApiModels/Sessions/apiModel';
import { SessionsApi } from 'lib/api/ApiModels/Sessions/endpoints';
import Table from './Table';
import Dropdown from 'app/components/Inputs/Dropdown';
import { SessionsSelectValuesTypes, SessionsTabTypes, SESSIONS_SELECT_VALUES } from 'lib/hooks/Sessions/model';
import SessionsSwitch from './SessionsSwitch';
import { ISelectedListItem, ISelectionGridCellValue } from 'lib/models/general';
import { sessionsParamBuilder } from 'lib/api/ApiModels/Sessions/paramBuilder';
import { AbsLoaderWrapper } from 'app/components/Loading/styles';
import LoadingIndicator from 'app/components/Loading';
import ElasticFilter from 'app/components/Inputs/ElasticFilter';
import { FilterOpperatorsList, ISessionsGridField, SessionGridColumnItems } from './models';
import { UserContextState, UserContext } from 'lib/Routes/UserProvider';
import AggregateTable from './AggregateTable';
import { convertStringToNumber } from 'lib/helpers/general';
import { useSessionsDataContext } from 'lib/hooks/Sessions/useSessionsDataContext';

interface IProps {}

const SessionPage: React.FC<IProps> = (props: IProps) => {
  const { sessions } = useSessionsDataContext();
  const userContext = useContext<UserContextState>(UserContext);
  const { response, loading, error, onGet } = useGet<IAllSessionsRes>();
  const { response: aggregRes, loading: loadingAggreg, error: errorAggreg, onGet: onGetAggregatedData } = useGet<IAggregatedSessionsLogRes>();
  const [data, setData] = React.useState<ISession[]>([]);
  const [aggregatedData, setAggregatedData] = React.useState<IAggregatedSessionsLogRes>(null);
  const [totalCount, setTotalCount] = React.useState<number>(0);
  const [aggregCount, setAggregTotalCount] = React.useState<number>(0);

  React.useEffect(() => {
    onTryToLoadData(sessions.sessionsPageSize, sessions.sessionsCurrentPage, sessions.sessionsPeriod, sessions.sessionsStitch, sessions.sessionsFilter);
  }, [sessions.sessionsPageSize, sessions.sessionsCurrentPage, sessions.sessionsStitch, sessions.sessionsPeriod, sessions.sessionsFilter]);

  React.useEffect(() => {
    if (response && response.sessions) {
      const _total = convertStringToNumber(response.count);
      setData(response.sessions);
      setTotalCount(_total);
      setAggregatedData(null);
      setAggregTotalCount(0);
      return;
    }
    setData([]);
    setAggregatedData(null);
    setTotalCount(0);
    setAggregTotalCount(0);
  }, [response]);

  React.useEffect(() => {
    if (aggregRes) {
      const _total = convertStringToNumber(aggregRes.count);
      setData([]);
      setTotalCount(0);
      setAggregatedData(aggregRes);
      setAggregTotalCount(_total);
      return;
    }
    setData([]);
    setAggregatedData(null);
    setTotalCount(0);
    setAggregTotalCount(0);
  }, [aggregRes]);

  const onTryToLoadData = (
    pageSize: number,
    page: number,
    time: SessionsSelectValuesTypes,
    stitch: boolean,
    filterValue: (ISelectionGridCellValue<ISessionsGridField, ISessionsGridField> | string)[],
  ) => {
    const _param = sessionsParamBuilder(pageSize, page, time, stitch, filterValue);
    if (stitch) {
      loadAggregatedData(_param);
      return;
    }
    loadSessionsData(_param);
  };

  const loadAggregatedData = async _param => {
    await onGetAggregatedData(SessionsApi.getAggregatedSessions(), userContext.accessToken!, _param);
  };

  const loadSessionsData = async _param => {
    await onGet(SessionsApi.getAllSessions(), userContext.accessToken!, _param);
  };

  const onChangePageSize = (_size: number, page?: number) => {
    sessions.onChangePageSize(_size, page);
  };

  const onChangeCurrentPage = (_page: number) => {
    sessions.onChangeCurrentPage(_page);
  };

  const onChangePeriod = (_value: ISelectedListItem<SessionsSelectValuesTypes>) => {
    sessions.onChangeSelectedPeriod(_value, SessionsTabTypes.Sessions);
  };

  const onSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    sessions.onChangeSwitch(e.target.checked, SessionsTabTypes.Sessions);
  };

  const onClearFilteredItem = (index: number) => {
    const _items: (ISelectionGridCellValue<ISessionsGridField, ISessionsGridField> | string)[] = sessions.sessionsFilter && sessions.sessionsFilter.length ? sessions.sessionsFilter.slice() : [];
    let stIndex = index;
    let count = 1;
    if (_items.length > 1) {
      if (_items[index + 1] && typeof _items[index + 1] === 'string') {
        count = 2;
      } else if (_items[index - 1] && typeof _items[index - 1] === 'string') {
        stIndex = index - 1;
        count = 2;
      }
    }
    _items.splice(stIndex, count);
    sessions.onChangeFilter(_items);
  };

  const onClearFilter = () => {
    sessions.onChangeFilter([]);
  };

  const onAddFilter = (_item: ISelectionGridCellValue<ISessionsGridField, ISessionsGridField>, index: number | null) => {
    const _items: (ISelectionGridCellValue<ISessionsGridField, ISessionsGridField> | string)[] = sessions.sessionsFilter && sessions.sessionsFilter.length ? sessions.sessionsFilter.slice() : [];
    if (index !== null) {
      _items.splice(index, 1, _item);
    } else {
      if (_items.length >= 1) {
        _items.push(FilterOpperatorsList[0].value);
      }
      _items.push(_item);
    }
    sessions.onChangeFilter(_items);
  };

  const onChangeOperator = (_item: string, index: number) => {
    const _items: (ISelectionGridCellValue<ISessionsGridField, ISessionsGridField> | string)[] = sessions.sessionsFilter && sessions.sessionsFilter.length ? sessions.sessionsFilter.slice() : [];
    _items.splice(index, 1, _item);
    sessions.onChangeFilter(_items);
  };

  return (
    <PageContentWrapper margin="20px 0 0 0">
      <ActionRowStyles margin="0 0 40px 0" zIndex={2}>
        <ActionPart margin="0 auto 0 0">
          <SessionsSwitch checked={sessions.sessionsStitch} onChange={onSwitchChange} />
        </ActionPart>
        <ActionPart margin="0 0 0 auto">
          <Dropdown
            wrapStyles={{ height: '50px', border: '1px solid var(--_primaryButtonBorder)', borderRadius: '6px' }}
            label="Show"
            selectedValue={sessions.sessionsPeriod}
            values={SESSIONS_SELECT_VALUES}
            onSelectValue={onChangePeriod}
          />
        </ActionPart>
      </ActionRowStyles>
      <ElasticFilter
        onChangeOperator={onChangeOperator}
        onClearFilteredItem={onClearFilteredItem}
        placeholder="Search Filter"
        selectionFilterItems={sessions.sessionsFilter}
        fields={SessionGridColumnItems}
        onAddFilter={onAddFilter}
        onClearFilter={onClearFilter}
      />
      <ContentWrapper style={{ flexGrow: 1 }}>
        <TableWrapper style={{ minHeight: 'unset', height: '100%' }}>
          {!sessions.sessionsStitch && (
            <Table
              currentPage={sessions.sessionsCurrentPage}
              onChangeCurrentPage={onChangeCurrentPage}
              logCount={totalCount}
              isError={error}
              data={data}
              pageSize={sessions.sessionsPageSize}
              onChangePageSize={onChangePageSize}
            />
          )}
          {sessions.sessionsStitch && (
            <AggregateTable
              currentPage={sessions.sessionsCurrentPage}
              onChangeCurrentPage={onChangeCurrentPage}
              error={errorAggreg && errorAggreg.message ? errorAggreg.message : null}
              sessions={aggregatedData && aggregatedData.sessions ? aggregatedData.sessions : []}
              buckets={aggregatedData && aggregatedData.buckets ? aggregatedData.buckets : []}
              logCount={aggregCount}
              pageSize={sessions.sessionsPageSize}
              onChangePageSize={onChangePageSize}
            />
          )}
          {(loading || loadingAggreg) && (
            <AbsLoaderWrapper width="100%" height="calc(100% - 50px)" top="50px">
              <LoadingIndicator margin="auto" />
            </AbsLoaderWrapper>
          )}
        </TableWrapper>
      </ContentWrapper>
    </PageContentWrapper>
  );
};

export default React.memo(SessionPage);
