import React from 'react';
import { ISegmentSegmentP, SegmentNetworkSegMatchKey, SegmentSegmentType } from 'lib/api/ApiModels/Policy/Segment';

interface Props {
  dataItem: ISegmentSegmentP;
}

const SeparateTableCell: React.FC<Props> = ({ dataItem }) => {
  if (dataItem.segType === SegmentSegmentType.APPLICATION && dataItem.appSegPol && dataItem.appSegPol.matchRules && dataItem.appSegPol.matchRules.length) {
    const _str = dataItem.appSegPol.matchRules.map(it => `${it.matchValuePrimary}: ${it.matchValueSecondary}`).join(', ');
    return (
      <div className="textOverflowEllips" title={_str}>
        {_str}
      </div>
    );
  }
  if (dataItem.segType === SegmentSegmentType.SITE && dataItem.siteSegPol && dataItem.siteSegPol.matchRules && dataItem.siteSegPol.matchRules.length) {
    const _str = dataItem.siteSegPol.matchRules.map(it => it.matchValuePrimary).join(', ');
    return (
      <div className="textOverflowEllips" title={_str}>
        {_str}
      </div>
    );
  }
  if (dataItem.segType === SegmentSegmentType.NETWORK && dataItem.networkSegPol && dataItem.networkSegPol.matchRules && dataItem.networkSegPol.matchRules.length) {
    const _str = dataItem.networkSegPol.matchRules
      .map(it => {
        if (it.matchKey === SegmentNetworkSegMatchKey.KEY_VNETWORK_EXTID) return it.matchValuePrimary;
        return `${it.matchValuePrimary}: ${it.matchValueSecondary}`;
      })
      .join(', ');
    return (
      <div className="textOverflowEllips" title={_str}>
        {_str}
      </div>
    );
  }
  if (dataItem.segType === SegmentSegmentType.EXTERNAL && dataItem.extSegPol && dataItem.extSegPol.matchRules && dataItem.extSegPol.matchRules.length) {
    const _str = dataItem.extSegPol.matchRules.map(it => it.matchValue).join(', ');
    return (
      <div className="textOverflowEllips" title={_str}>
        {_str}
      </div>
    );
  }
  return null;
};

export default React.memo(SeparateTableCell);
