import React from 'react';
import { UserContext, UserContextState } from 'lib/Routes/UserProvider';
import { ChartContainer, ChartHeader, ChartLabel, ChartWrapper } from '../../styles';
import { useTrafficDataContext } from 'lib/hooks/Traffic/useTrafficDataCont';
import { useGet } from 'lib/api/http/useAxiosHook';
import LoadingIndicator from 'app/components/Loading';
import { AbsLoaderWrapper } from 'app/components/Loading/styles';
import { ErrorMessage } from 'app/components/Basic/ErrorMessage/ErrorMessage';
import DonutChart, { PieDataItem } from 'app/components/Charts/DonutChart';
import { TRAFFIC_TRENDS_TIME_RANGE_QUERY_TYPES } from 'lib/api/ApiModels/paramBuilders';
import { TesseractApi } from 'lib/api/ApiModels/Services/tesseract';
import { ITesseractGetTotalSessionsPerSegmentResponse } from 'lib/api/ApiModels/Sessions/apiModel';
import { TRAFFIC_TABS } from 'lib/hooks/Traffic/models';
import { useSessionsDataContext } from 'lib/hooks/Sessions/useSessionsDataContext';
import { FilterOpperatorsList, SessionElasticFieldItems, SessionGridColumns } from '../../../SessionPage/models';
import { getSearchedFields, ISearchData } from 'app/components/Inputs/ElasticFilter/helper';
interface Props {}

export const DroppedFlowsComponent: React.FC<Props> = (props: Props) => {
  const userContext = React.useContext<UserContextState>(UserContext);
  const { traffic } = useTrafficDataContext();
  const { sessions } = useSessionsDataContext();
  const { response, loading, error, onGet } = useGet<ITesseractGetTotalSessionsPerSegmentResponse>();
  const [data, setData] = React.useState<PieDataItem[]>([]);

  React.useEffect(() => {
    onTryLoadSegments(traffic.trendsPeriod);
  }, [traffic.trendsPeriod]);
  React.useEffect(() => {
    if (response && response.segments) {
      const _data: PieDataItem[] = response.segments.length ? response.segments.map(it => ({ name: it.segmentName, id: it.segmentId, value: it.count, hide: false })) : [];
      // for (let i = 0; i < 50; i++) {
      //   _data.push({ name: `Site _${i}`, id: `Site _${i}`, hide: false, value: Math.floor(Math.random() * 50) });
      // }
      setData(_data);
    }
  }, [response]);

  const onGoToLogs = (d: PieDataItem) => {
    const _policyField: ISearchData = getSearchedFields(SessionGridColumns.policyAction.field, SessionElasticFieldItems);
    const _destSegmentIdField: ISearchData = getSearchedFields(SessionGridColumns.destSegmentId.field, SessionElasticFieldItems);
    const _destId = d.id === 'unknown' || d.id === 'Unknown' || !d.id ? 'unknown' : d.id;
    traffic.onChangeSelectedTab(TRAFFIC_TABS.logs.index);
    sessions.onGoToSession(true, [{ field: _policyField.field, value: 'DROP' }, FilterOpperatorsList[0].value, { field: _destSegmentIdField.field, value: _destId }]);
  };

  const onTryLoadSegments = async (timePeriod: TRAFFIC_TRENDS_TIME_RANGE_QUERY_TYPES) => {
    await onGet(TesseractApi.getSessionsPerSegment(timePeriod || TRAFFIC_TRENDS_TIME_RANGE_QUERY_TYPES.LAST_WEEK), userContext.accessToken!);
  };
  return (
    <ChartContainer margin="0 0 20px 0">
      <ChartHeader>
        <ChartLabel className="textOverflowEllips">Dropped Flows</ChartLabel>
      </ChartHeader>

      <ChartWrapper>
        {!error && data && data.length ? <DonutChart data={data} onItemClick={onGoToLogs} legendPosition="both" /> : null}
        {!error && !data.length ? (
          <ErrorMessage color="var(--_primaryTextColor)" margin="auto" fontSize={20}>
            No data
          </ErrorMessage>
        ) : null}
        {loading && (
          <AbsLoaderWrapper width="100%" height="100%" zIndex={10}>
            <LoadingIndicator margin="auto" />
          </AbsLoaderWrapper>
        )}
        {error && <ErrorMessage>{error.message || 'Something went wrong'}</ErrorMessage>}
      </ChartWrapper>
    </ChartContainer>
  );
};

export default React.memo(DroppedFlowsComponent);
