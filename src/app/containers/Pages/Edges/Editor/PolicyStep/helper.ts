import { ISegmentP, ISegmentRuleP, SegmentTargetT } from 'lib/api/ApiModels/Edges/apiModel';
import { ITopologyGroup } from 'lib/api/ApiModels/Topology/apiModels';
import { IObject } from 'lib/models/general';
import { TopologyGroupTypesAsNumber, TopologyGroupTypesAsString } from 'lib/models/topology';
import { IPolicyCombination } from '../../model';

export const getFilteredGroups = (policies: ISegmentRuleP[] | null, groups: ITopologyGroup[], field: string): ITopologyGroup[] => {
  if (!groups || !groups.length) return [];
  if (!policies || !policies.length) return groups;
  const _arr: ITopologyGroup[] = [];
  groups.forEach(gr => {
    const _isGriupUsed = policies.find(policy => policy[field] === gr.id);
    if (_isGriupUsed) return;
    _arr.push(gr);
  });
  return _arr;
};

export const getCartesianValues = (a: ITopologyGroup[], b: ITopologyGroup[]): IPolicyCombination[] => {
  if (!a || !a.length || !b || !b.length) return [];
  return [].concat(
    ...a.map(d =>
      b
        .map(e => [
          { source: d, destination: e },
          { source: e, destination: d },
        ])
        .flat(),
    ),
  );
};

export const getPossibleValues = (policies: ISegmentP[], values: IPolicyCombination[]): IPolicyCombination[] => {
  if (!policies || !policies.length) return values;
  const _arr: IPolicyCombination[] = [];
  values.forEach(v => {
    const _isPresent = checkIsCombinationPresent(policies, v);
    if (_isPresent) return;
    _arr.push(v);
  });
  return _arr;
};

export const getAllValues = (values: IPolicyCombination[]): any[] => {
  if (!values || !values.length) return [];
  const _arr = new Map();
  values.forEach(v => {
    if (!_arr.has(v.source.id)) {
      _arr.set(v.source.id, v.source);
    }
    if (!_arr.has(v.destination.id)) {
      _arr.set(v.destination.id, v.destination);
    }
  });
  return Array.from(_arr, ([name, value]) => value);
};

export const getValues = (values: IPolicyCombination[], id: string, selectedField: string): any[] => {
  if (!values || !values.length) return [];
  const _arr = new Map();
  const _filteredItems = values.filter(it => it[selectedField].id === id);
  let neededField = selectedField === 'source' ? 'destination' : 'source';
  _filteredItems.forEach(v => {
    if (_arr.has(v[neededField].id)) return;
    _arr.set(v[neededField].id, v[neededField]);
  });
  return Array.from(_arr, ([name, value]) => value);
};

const checkIsCombinationPresent = (policies: ISegmentP[], v: IPolicyCombination) => {
  return policies.find(
    it => it.rules && it.rules.length && it.rules.find(r => (r.sourceId === v.source.id && r.destId === v.destination.id) || (r.sourceId === v.destination.id && r.destId === v.source.id)),
  );
};

export const getSegmentType = (gr: ITopologyGroup): SegmentTargetT => {
  if (!gr || !gr.type) return null;
  if (gr.type === TopologyGroupTypesAsString.BRANCH_NETWORKS || gr.type === TopologyGroupTypesAsNumber.BRANCH_NETWORKS) return SegmentTargetT.SITE_GROUP;
  if (gr.type === TopologyGroupTypesAsString.APPLICATION || gr.type === TopologyGroupTypesAsNumber.APPLICATION) return SegmentTargetT.APP_GROUP;
  return null;
};

export const getDifferentSegmentType = (type: SegmentTargetT): SegmentTargetT => {
  if (type === SegmentTargetT.SITE_GROUP) return SegmentTargetT.APP_GROUP;
  if (type === SegmentTargetT.APP_GROUP) return SegmentTargetT.SITE_GROUP;
  return null;
};

export const onValidatePolicy = (policy: ISegmentP): IObject<string> => {
  if (!policy || !policy.rules || !policy.rules.length) return null;
  const _combination: string[][] = [];
  let error: IObject<string> = {};
  for (let i = 0; i < policy.rules.length; i++) {
    const _comb = [policy.rules[i].sourceId, policy.rules[i].destId];
    const present = checkCombination(_combination, _comb);
    if (!present) {
      _combination.push(_comb);
    } else {
      error[i] = `Policy can't contain different rules with the same 'Source - Destination' combination. Please choose another combination.`;
      break;
    }
  }
  if (Object.keys(error).length) return error;
  return null;
};

const checkCombination = (_combination: string[][], newComb: string[]): boolean => {
  return !!_combination.find(it => it[0] === newComb[0] && it[1] === newComb[1]);
};
