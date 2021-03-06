import React from 'react';
import { ITab } from 'lib/models/tabs';
import { TrafficTabTypes, TRAFFIC_TABS } from './models';
import { TRAFFIC_TRENDS_TIME_RANGE_QUERY_TYPES } from 'lib/api/ApiModels/paramBuilders';
import { getFromBase64, OKULIS_LOCAL_STORAGE_KEYS } from 'lib/api/http/utils';
import { getSessionStoragePreferences, StoragePreferenceKeys, updateSessionStoragePreference } from 'lib/helpers/localStorageHelpers';
import { IFlowPreferenceRange, IUserPreference } from 'lib/api/ApiModels/Policy/Preference';
import { DEFAULT_FLOWS_RANGES } from 'app/containers/Pages/TrafficPage/Trends/Components/FlowsOverviewComponent/models';

const getPeriodFromSessionstorage = () => {
  const _preference = getSessionStoragePreferences(OKULIS_LOCAL_STORAGE_KEYS.OKULIS_PREFERENCE, [StoragePreferenceKeys.TRAFFIC_TRENDS_TIME_PERIOD]);
  if (_preference && _preference[StoragePreferenceKeys.TRAFFIC_TRENDS_TIME_PERIOD]) {
    return _preference[StoragePreferenceKeys.TRAFFIC_TRENDS_TIME_PERIOD];
  }
  return TRAFFIC_TRENDS_TIME_RANGE_QUERY_TYPES.LAST_WEEK;
};

export interface TrafficContextType {
  selectedTab: ITab<TrafficTabTypes>;
  trendsPeriod: TRAFFIC_TRENDS_TIME_RANGE_QUERY_TYPES;
  rangePreference: IFlowPreferenceRange[];
  onSetFlowRangePreference: (res: IUserPreference) => void;
  onUpdatePreferenceRange: (_items: IFlowPreferenceRange[]) => void;
  onChangeSelectedTab: (_tabIndex: number) => void;
  onChangeSelectedPeriod: (_value: TRAFFIC_TRENDS_TIME_RANGE_QUERY_TYPES) => void;
}

export function useTrafficContext(): TrafficContextType {
  const [selectedTab, setSelectedTab] = React.useState<ITab<TrafficTabTypes>>(TRAFFIC_TABS.trends);
  const [trendsPeriod, setTrendsPeriod] = React.useState<TRAFFIC_TRENDS_TIME_RANGE_QUERY_TYPES>(getPeriodFromSessionstorage());
  const [rangePreference, setRangePreference] = React.useState<IFlowPreferenceRange[]>([...DEFAULT_FLOWS_RANGES]);

  const onChangeSelectedTab = (_tabIndex: number) => {
    const key = Object.keys(TRAFFIC_TABS).find(key => TRAFFIC_TABS[key].index === _tabIndex);
    setSelectedTab(TRAFFIC_TABS[key]);
  };

  const onChangeSelectedPeriod = (value: TRAFFIC_TRENDS_TIME_RANGE_QUERY_TYPES) => {
    updateSessionStoragePreference(value, OKULIS_LOCAL_STORAGE_KEYS.OKULIS_PREFERENCE, StoragePreferenceKeys.TRAFFIC_TRENDS_TIME_PERIOD);
    setTrendsPeriod(value);
  };

  const onSetFlowRangePreference = (res: IUserPreference) => {
    if (!res || !res.prefData) {
      setRangePreference([...DEFAULT_FLOWS_RANGES]);
      return;
    }
    const _arr: IFlowPreferenceRange[] = getFromBase64(res.prefData);
    if (!_arr || !_arr.length) {
      setRangePreference([...DEFAULT_FLOWS_RANGES]);
      return;
    }
    setRangePreference(_arr);
  };

  const onUpdatePreferenceRange = (_items: IFlowPreferenceRange[]) => {
    setRangePreference(_items);
  };

  return {
    selectedTab,
    trendsPeriod,
    rangePreference,
    onChangeSelectedTab,
    onChangeSelectedPeriod,
    onSetFlowRangePreference,
    onUpdatePreferenceRange,
  };
}
