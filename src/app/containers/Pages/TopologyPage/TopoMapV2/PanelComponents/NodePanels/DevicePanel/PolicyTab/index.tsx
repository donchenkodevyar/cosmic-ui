import React, { useContext } from 'react';
import { IResourceQueryParam, ControllerKeyTypes, SecurityGroupsResourceTypes, IToposvcListSecurityGroupResponse, PolicyResKeyEnum } from 'lib/api/ApiModels/Metrics/apiModel';
import { INetworkRule } from 'lib/api/ApiModels/Topology/apiModels';
import PolicyTable from './PolicyTable';
import { useGet } from 'lib/api/http/useAxiosHook';
import { getQueryResourceParam } from 'lib/api/ApiModels/Metrics/queryRoutesHelper';
import { useTopologyV2DataContext } from 'lib/hooks/Topology/useTopologyDataContext';
import { UserContextState, UserContext } from 'lib/Routes/UserProvider';
import { TopoApi } from 'lib/api/ApiModels/Services/topo';
import { toTimestamp } from 'lib/api/ApiModels/paramBuilders';
import { IDeviceNode } from 'lib/hooks/Topology/models';

interface IProps {
  dataItem: IDeviceNode;
}

const PolicyTab: React.FC<IProps> = (props: IProps) => {
  const { topology } = useTopologyV2DataContext();
  const userContext = useContext<UserContextState>(UserContext);
  const { response, loading, error, onGet } = useGet<IToposvcListSecurityGroupResponse>();
  const [data, setData] = React.useState<INetworkRule[]>([]);

  React.useEffect(() => {
    const _param: IResourceQueryParam = getQueryResourceParam(SecurityGroupsResourceTypes.VNetwork, props.dataItem.vnetworks[0].extId);
    if (topology.selectedTime) {
      _param.timestamp = toTimestamp(topology.selectedTime);
    }
    getDataAsync(TopoApi.getPolicyByKey(ControllerKeyTypes.SecurityGroups), _param);
  }, [props.dataItem, topology.selectedTime]);

  React.useEffect(() => {
    if (response !== null && response[PolicyResKeyEnum.SecurityGroups] !== undefined) {
      const _data = [];
      response[PolicyResKeyEnum.SecurityGroups].forEach(it => {
        if (!it.rules || !it.rules.length) {
          return;
        }
        it.rules.forEach(rule => {
          _data.push(rule);
        });
      });
      setData(_data);
    }
  }, [response]);

  const getDataAsync = async (url: string, params: any) => {
    if (!url || !params) {
      return;
    }
    await onGet(url, userContext.accessToken!, params);
  };
  // title={PolicyTableKeyEnum.Inbound}
  return (
    <>
      <PolicyTable styles={{ margin: '0 0 20px 0', flexDirection: 'column' }} data={data} showLoader={loading} error={error ? error.message : null} />
    </>
  );
};

export default React.memo(PolicyTab);
