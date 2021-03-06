import React from 'react';
import { useDelete, useGet } from 'lib/api/http/useAxiosHook';
import { UserContextState, UserContext } from 'lib/Routes/UserProvider';
import LoadingIndicator from 'app/components/Loading';
import { AbsLoaderWrapper } from 'app/components/Loading/styles';
import { useEdgesDataContext } from 'lib/hooks/Edges/useEdgesDataContext';
import { IEdgeP, IEdgesRes } from 'lib/api/ApiModels/Edges/apiModel';
import Editor from '../Editor';
import { useBreadCrumbDataContext } from 'lib/hooks/Breadcrumb/useBreadcrumbDataContext';
import { EdgesBreadCrumbItemsType } from 'lib/hooks/Breadcrumb/models';
import { IAccountsRes, IAwsRegionsRes } from 'lib/api/ApiModels/Accounts/apiModel';
import EdgeList from '../EdgeList';
import { ITopologyGroupsData, IWEdgesRes } from 'lib/api/ApiModels/Topology/apiModels';
import EmptyPage from 'app/components/Basic/EmptyPage';
import { StepperText } from 'app/components/Basic/EmptyPage/styles';
import imgBg from 'app/images/EdgesMap.png';
import { PolicyApi } from 'lib/api/ApiModels/Services/policy';
import { TopoApi } from 'lib/api/ApiModels/Services/topo';

interface Props {}

const MainPage: React.FC<Props> = (props: Props) => {
  const userContext = React.useContext<UserContextState>(UserContext);
  const { breadcrumb } = useBreadCrumbDataContext();
  const { loading, error, response, onGet } = useGet<IEdgesRes>();
  const { response: resGroupds, onGet: onGetGroups } = useGet<ITopologyGroupsData>();
  const { response: resRegions, onGet: onGetRegions } = useGet<IAwsRegionsRes>();
  const { response: resAccounts, onGet: onGetAccounts } = useGet<IAccountsRes>();
  const { response: resWedges, onGet: onGetWedges } = useGet<IWEdgesRes>();
  const { response: resDelete, onDelete: onDeleteEedge } = useDelete<any>();
  const { edges } = useEdgesDataContext();
  const [showEditorPage, setShowEditorPage] = React.useState(false);
  const [tempItem, setTempItem] = React.useState<IEdgeP>(null);
  React.useEffect(() => {
    onTryLoadEdges();
    onTryLoadGroups();
    onTryLoadRegions();
    onTryLoadAccounts();
    onTryLoadWedges();
  }, []);

  React.useEffect(() => {
    if (response && response.edgeps) {
      edges.onSetData(response.edgeps);
    }
  }, [response]);

  React.useEffect(() => {
    if (resGroupds && resGroupds.groups) {
      edges.onSetGroups(resGroupds.groups);
    }
  }, [resGroupds]);

  React.useEffect(() => {
    if (resRegions && resRegions.awsRegions) {
      edges.onSetRegions(resRegions.awsRegions);
    }
  }, [resRegions]);

  React.useEffect(() => {
    if (resAccounts && resAccounts.controllers) {
      edges.onSetAccounts(resAccounts.controllers);
    }
  }, [resAccounts]);

  React.useEffect(() => {
    if (resWedges && resWedges.wEdges) {
      edges.onSetWedges(resWedges.wEdges);
    }
  }, [resWedges]);

  React.useEffect(() => {
    if (resDelete && tempItem) {
      setTempItem(null);
      edges.onDeleteEdge(tempItem.id);
    }
  }, [resDelete]);

  React.useEffect(() => {
    // TO DO
    if (error) {
      edges.onSetData(null);
    }
  }, [error]);

  React.useEffect(() => {
    if (showEditorPage && !breadcrumb.edgesBreadCrumbItems.length) {
      edges.onClearEditEdgeContext();
      setShowEditorPage(false);
      return;
    }
    if (!showEditorPage && breadcrumb.edgesBreadCrumbItems.length) {
      setShowEditorPage(true);
    }
  }, [breadcrumb.edgesBreadCrumbItems]);

  const onTryLoadEdges = async () => {
    await onGet(TopoApi.getEdges(), userContext.accessToken!);
  };

  const onTryLoadRegions = async () => {
    await onGetRegions(PolicyApi.getAllAwsRegions(), userContext.accessToken!);
  };

  const onTryLoadAccounts = async () => {
    await onGetAccounts(PolicyApi.getAccounts(), userContext.accessToken!);
  };

  const onTryLoadGroups = async () => {
    await onGetGroups(PolicyApi.getAllGroups(), userContext.accessToken!);
  };

  const onTryLoadWedges = async () => {
    await onGetWedges(TopoApi.getWedges(), userContext.accessToken!);
  };

  const onOpenEditor = (_item?: IEdgeP) => {
    const _bredCrumbState = _item && _item.id ? EdgesBreadCrumbItemsType.EDIT : EdgesBreadCrumbItemsType.CREATE;
    edges.onSetEditEdge(_item || null);
    breadcrumb.onGoToEdges(_bredCrumbState);
  };

  const onCloseEditor = () => {
    setShowEditorPage(false);
    edges.onClearEditEdgeContext();
    breadcrumb.onGoToEdges(EdgesBreadCrumbItemsType.EDGES);
  };

  const onDeleteEdge = (_item: IEdgeP) => {
    onTryDeleteEdge(_item);
  };

  const onTryDeleteEdge = async (_item: IEdgeP) => {
    setTempItem(_item);
    await onDeleteEedge(TopoApi.deleteEdge(_item.id), userContext.accessToken!);
  };

  if (loading) {
    return (
      <AbsLoaderWrapper width="100%" height="100%">
        <LoadingIndicator margin="auto" />
      </AbsLoaderWrapper>
    );
  }

  if (showEditorPage) {
    return <Editor onClose={onCloseEditor} />;
  }
  if (edges.dataReadyToShow) {
    return (
      <>
        {!edges.data || !edges.data.length ? (
          <EmptyPage iconStyles={{ width: '80vw', maxWidth: '834px', height: '50vw', maxHeight: '416px' }} iconAsString={imgBg} buttonLabel="Create Transit" onClick={() => onOpenEditor()}>
            <StepperText highLight margin="0 auto 20px auto">
              There are no created transits yet
            </StepperText>
            <StepperText margin="0 auto">To create a transit click on the button below.</StepperText>
          </EmptyPage>
        ) : null}
        {edges.data && edges.data.length ? <EdgeList data={edges.data} onCreate={onOpenEditor} onEdit={onOpenEditor} onDelete={onDeleteEdge} /> : null}
      </>
    );
  }

  return null;
};

export default React.memo(MainPage);
