import React, { useContext } from 'react';
import { ContainerWithFooter, TopoContainer, MapContainer } from './styles';
import LoadingIndicator from 'app/components/Loading';
import { AbsLoaderWrapper } from 'app/components/Loading/styles';
import { ITopologyDataRes } from 'lib/api/ApiModels/Topology/apiModels';
import FooterAction from './FooterAction';
import Graph from './Graph';
import { useGetChainData } from 'lib/api/http/useAxiosHook';
import { UserContextState, UserContext } from 'lib/Routes/UserProvider';
import { PolicyApi } from 'lib/api/ApiModels/Services/policy';
import { createTopologyQueryParam, ITopologyQueryParam } from 'lib/api/ApiModels/paramBuilders';
import { TopoApi } from 'lib/api/ApiModels/Services/topo';
import { ErrorMessage } from 'app/components/Basic/ErrorMessage/ErrorMessage';
import { useTopologyV2DataContext } from 'lib/hooks/Topology/useTopologyDataContext';
import { TelemetryApi } from 'lib/api/ApiModels/Services/telemetry';
import { AlertApi } from 'lib/api/ApiModels/Services/alert';

interface IProps {}

const TopoMapV2: React.FC<IProps> = (props: IProps) => {
  const { topology } = useTopologyV2DataContext();
  const userContext = useContext<UserContextState>(UserContext);
  const { response, loading, error, onGetChainData } = useGetChainData<ITopologyDataRes>();
  const [isFullScreen, setIsFullScreen] = React.useState<boolean>(false);
  React.useEffect(() => {
    onTryLoadData();
  }, []);

  React.useEffect(() => {
    if (response !== null) {
      topology.onSetData(response);
    }
  }, [response]);

  React.useEffect(() => {
    let interval = null;
    if (error) {
      topology.onSetData(null);
      interval = setInterval(() => {
        onTryLoadData();
      }, 60000);
    } else if (interval) {
      clearInterval(interval);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [error]);

  const onOpenFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const onTryLoadData = async () => {
    const _st = topology.selectedTime || null;
    let param: ITopologyQueryParam = createTopologyQueryParam(_st);
    const escalationParam = { objectType: 'tgw' };

    await onGetChainData(
      [PolicyApi.getSegments(), TopoApi.getAllOrganizations(), TelemetryApi.getTopologySegments(), AlertApi.getDeviceEscalations()],
      ['segments', 'organizations', 'topology', 'escalations'],
      userContext.accessToken!,
      { ...param, ...escalationParam },
    );
  };

  const onReloadData = async (startTime: Date | null) => {
    let param: ITopologyQueryParam = createTopologyQueryParam(startTime);
    const escalationParam = { objectType: 'tgw' };
    await onGetChainData(
      [PolicyApi.getSegments(), TopoApi.getAllOrganizations(), TelemetryApi.getTopologySegments(), AlertApi.getDeviceEscalations()],
      ['segments', 'organizations', 'topology', 'escalations'],
      userContext.accessToken!,
      { ...param, ...escalationParam },
    );
  };

  return (
    <>
      <TopoContainer className={isFullScreen ? 'fullscreen' : ''}>
        <ContainerWithFooter>
          <MapContainer height={error || (loading && !topology.originData) ? '100%' : null}>
            <Graph disabledReload={loading} onlyRefreshAvaible={!!error || !topology.originData} isFullScreen={isFullScreen} onReload={onTryLoadData} onOpenFullScreen={onOpenFullScreen} />
            {loading && (
              <AbsLoaderWrapper>
                <LoadingIndicator margin="auto" />
              </AbsLoaderWrapper>
            )}
            {error && (
              <AbsLoaderWrapper width="100%" height="100%">
                <ErrorMessage fontSize={28} margin="auto">
                  {error && error.message ? 'Something went wrong' : 'Something went wrong'}
                </ErrorMessage>
              </AbsLoaderWrapper>
            )}
          </MapContainer>
          {topology.originData && <FooterAction show onTryLoadData={onReloadData} isMetricks={topology.topoPanel && topology.topoPanel.show} />}
        </ContainerWithFooter>
      </TopoContainer>
    </>
  );
};

export default React.memo(TopoMapV2);
