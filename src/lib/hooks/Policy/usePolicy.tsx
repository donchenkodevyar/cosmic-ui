import React from 'react';
import { ITab } from 'lib/models/tabs';
import { PolicyTabTypes, POLICY_TABS } from './models';

export interface PolicyContextType {
  selectedTab: ITab<PolicyTabTypes>;
  onChangeSelectedTab: (_tabIndex: number) => void;
}
export function usePolicyContext(): PolicyContextType {
  const [selectedTab, setSelectedTab] = React.useState<ITab<PolicyTabTypes>>(POLICY_TABS[0]);

  const onChangeSelectedTab = (_tabIndex: number) => {
    const _tab = POLICY_TABS.find(it => it.index === _tabIndex);
    setSelectedTab(_tab);
  };

  return {
    selectedTab,
    onChangeSelectedTab,
  };
}