import React from 'react';
import { ActionPart, ActionRowStyles } from 'app/containers/Pages/Shared/styles';
import { useTrafficDataContext } from 'lib/hooks/Traffic/useTrafficDataCont';
import { TRAFFIC_TRENDS_TIME_RANGE_QUERY_TYPES } from 'lib/api/ApiModels/paramBuilders';
import MatSelect from 'app/components/Inputs/MatSelect';

interface Props {}

const HeaderActionsRow: React.FC<Props> = (props: Props) => {
  const { traffic } = useTrafficDataContext();
  const onChangePeriod = (_value: TRAFFIC_TRENDS_TIME_RANGE_QUERY_TYPES) => {
    traffic.onChangeSelectedPeriod(_value);
  };

  return (
    <ActionRowStyles margin="0 0 30px 0">
      <ActionPart margin="0 0 0 auto">
        <MatSelect
          id="logsTimePeriod"
          label="Show"
          labelStyles={{ margin: 'auto 10px auto 0' }}
          value={traffic.trendsPeriod}
          options={[
            TRAFFIC_TRENDS_TIME_RANGE_QUERY_TYPES.LAST_HOUR,
            TRAFFIC_TRENDS_TIME_RANGE_QUERY_TYPES.LAST_DAY,
            TRAFFIC_TRENDS_TIME_RANGE_QUERY_TYPES.LAST_WEEK,
            TRAFFIC_TRENDS_TIME_RANGE_QUERY_TYPES.LAST_MONTH,
          ]}
          onChange={onChangePeriod}
          renderValue={(v: TRAFFIC_TRENDS_TIME_RANGE_QUERY_TYPES) => {
            if (v === TRAFFIC_TRENDS_TIME_RANGE_QUERY_TYPES.LAST_HOUR) return 'Last hour';
            if (v === TRAFFIC_TRENDS_TIME_RANGE_QUERY_TYPES.LAST_DAY) return 'Last day';
            if (v === TRAFFIC_TRENDS_TIME_RANGE_QUERY_TYPES.LAST_WEEK) return 'Last week';
            if (v === TRAFFIC_TRENDS_TIME_RANGE_QUERY_TYPES.LAST_MONTH) return 'Last month';
            return v;
          }}
          renderOption={(v: TRAFFIC_TRENDS_TIME_RANGE_QUERY_TYPES) => {
            if (v === TRAFFIC_TRENDS_TIME_RANGE_QUERY_TYPES.LAST_HOUR) return 'Last hour';
            if (v === TRAFFIC_TRENDS_TIME_RANGE_QUERY_TYPES.LAST_DAY) return 'Last day';
            if (v === TRAFFIC_TRENDS_TIME_RANGE_QUERY_TYPES.LAST_WEEK) return 'Last week';
            if (v === TRAFFIC_TRENDS_TIME_RANGE_QUERY_TYPES.LAST_MONTH) return 'Last month';
            return v;
          }}
          styles={{ height: '50px', minHeight: '50px', width: 'auto', display: 'inline-flex', alignItems: 'center' }}
          selectStyles={{ height: '50px', width: 'auto', minWidth: '240px' }}
        />
      </ActionPart>
    </ActionRowStyles>
  );
};

export default React.memo(HeaderActionsRow);