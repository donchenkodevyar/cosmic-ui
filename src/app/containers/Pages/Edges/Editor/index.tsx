import React from 'react';
import { MainColumn, PanelColumn, Wrapper } from './styles';
import { IStepperItem, StepperItemStateType, valueNumberFormat } from 'app/components/Stepper/model';
import Stepper from 'app/components/Stepper';
import { createNewEdge, EdgesStepperItems, EdgesStepperTypes, IDeleteDataModel } from './model';
import { jsonClone } from 'lib/helpers/cloneHelper';
import { updateStep, updateStepById, updateSteps } from './helper';
import { AbsLoaderWrapper } from 'app/components/Loading/styles';
import LoadingIndicator from 'app/components/Loading';
import FormPanel from './FormPanel';
import EdgesMap from './EdgesMap';
import { DeploymentTypes, IEdgeP, IEdgePolicy, ValidationFields } from 'lib/api/ApiModels/Edges/apiModel';
import { ITopologyGroup, TopologyGroupApi } from 'lib/api/ApiModels/Topology/endpoints';
import { useEdgesDataContext } from 'lib/hooks/Edges/useEdgesDataContext';
import { IBaseEntity, IModal } from 'lib/models/general';
import ModalComponent from 'app/components/Modal';
import { TopologyGroupTypesAsString } from 'lib/models/topology';
import { useDelete, useGet, usePost, usePut } from 'lib/api/http/useAxiosHook';
import { UserContextState, UserContext } from 'lib/Routes/UserProvider';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DeleteGroupComponent from './Components/DeleteGroupComponent';
import { EdgesApi } from 'lib/api/ApiModels/Edges/edpoints';
interface Props {
  dataItem: IEdgeP;
  onClose: () => void;
}

const Editor: React.FC<Props> = (props: Props) => {
  const userContext = React.useContext<UserContextState>(UserContext);
  const { edges } = useEdgesDataContext();
  const { loading: postLoading, error: postError, response: postResponce, onPost } = usePost<IEdgeP, IBaseEntity<string>>();
  const { loading: putLoading, error: putError, response: putResponce, onPut } = usePut<IEdgeP, IBaseEntity<string>>();
  const { loading: getLoading, error: getError, response: resEdge, onGet } = useGet<IEdgeP>();
  const { loading: deleteLoading, error: deleteError, response: resDelete, onDelete: onDeleteGroup } = useDelete<any>();
  const [dataItem, setDataItem] = React.useState<IEdgeP>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [steps, setSteps] = React.useState<IStepperItem<EdgesStepperTypes>[]>([]);
  const [selectedStep, setSelectedStep] = React.useState<IStepperItem<EdgesStepperTypes>>(null);
  const [saveDisabled, setSavedisabled] = React.useState<boolean>(true);
  const [hasChanges, setHasChanges] = React.useState<boolean>(false);
  const [deleteModalData, setDeleteModalData] = React.useState<IModal<IDeleteDataModel>>({ show: false, dataItem: null });
  React.useEffect(() => {
    const _item = props.dataItem || createNewEdge();
    if (_item.deploymentPolicy && _item.deploymentPolicy[0] && !_item.deploymentPolicy[0].type) {
      _item.deploymentPolicy[0].type = DeploymentTypes.Regions;
    }
    const _steps: IStepperItem<EdgesStepperTypes>[] = jsonClone(EdgesStepperItems);
    const _items: IStepperItem<EdgesStepperTypes>[] = updateSteps(_steps, _item);
    setSelectedStep(_items[0]);
    setSteps(_items);
    setDataItem(_item);
    setLoading(false);
  }, []);

  React.useEffect(() => {
    // to do it.id !== EdgesStepperTypes.POLICY => remove after
    const _isSomeStepEmpty = steps.some(it => it.state === StepperItemStateType.EMPTY && it.id !== EdgesStepperTypes.POLICY);
    if (_isSomeStepEmpty) {
      setSavedisabled(true);
    } else {
      setSavedisabled(false);
    }
  }, [steps]);

  React.useEffect(() => {
    if (postResponce && postResponce.id) {
      onTryLoadEdge(postResponce.id);
      return;
    } else if (postResponce && !postResponce.id) {
      toast.error('Something went wrong. Please try Again!');
    }
  }, [postResponce]);

  React.useEffect(() => {
    if (putResponce && putResponce.id) {
      onTryLoadEdge(putResponce.id);
      return;
    } else if (putResponce && !putResponce.id) {
      toast.error('Something went wrong. Please try Again!');
    }
  }, [putResponce]);

  React.useEffect(() => {
    if (resEdge) {
      edges.onUpdateEdges(resEdge);
      props.onClose();
    }
  }, [resEdge]);

  React.useEffect(() => {
    if (getError) {
      toast.error('Something went wrong. Please try Again!');
    }
  }, [getError]);

  React.useEffect(() => {
    if (postError || putError) {
      toast.error('Something went wrong. Please try Again!');
    }
  }, [postError, putError]);

  React.useEffect(() => {
    if (resDelete && deleteModalData && deleteModalData.dataItem) {
      const _dataItem: IEdgeP = jsonClone(dataItem);
      if (deleteModalData.dataItem.type === TopologyGroupTypesAsString.BRANCH_NETWORKS) {
        _dataItem.siteGroupIds = dataItem.siteGroupIds.filter(it => it !== deleteModalData.dataItem.id);
        const _items: IStepperItem<EdgesStepperTypes>[] = updateStepById(steps, EdgesStepperTypes.SITES, _dataItem.siteGroupIds);
        setSteps(_items);
      }
      if (deleteModalData.dataItem.type === TopologyGroupTypesAsString.APPLICATION) {
        _dataItem.appGroupIds = dataItem.appGroupIds.filter(it => it !== deleteModalData.dataItem.id);
        const _items: IStepperItem<EdgesStepperTypes>[] = updateStepById(steps, EdgesStepperTypes.APPS, _dataItem.appGroupIds);
        setSteps(_items);
      }
      toast.success(`Group '${deleteModalData.dataItem.name}' was deleted successfully!`);
      setDataItem(_dataItem);
      setHasChanges(true);
      setDeleteModalData({ show: false, dataItem: null });
      edges.onDeleteGroup(deleteModalData.dataItem.id);
    }
  }, [resDelete]);

  React.useEffect(() => {
    if (deleteError) {
      toast.error('Something went wrong. Please try Again!');
    }
  }, [deleteError]);

  const onSelectStep = (step: IStepperItem<EdgesStepperTypes>) => {
    setSelectedStep(step);
  };

  const onClose = () => {
    props.onClose();
  };

  const onChangeDataField = (value: any, field: string, step: EdgesStepperTypes) => {
    const _dataItem: IEdgeP = { ...dataItem };
    _dataItem[field] = value;
    const _items: IStepperItem<EdgesStepperTypes>[] = updateStepById(steps, step, _dataItem[field]);
    setSteps(_items);
    setDataItem(_dataItem);
    setHasChanges(true);
  };

  const onChangeGeneralField = (value: any, field: string) => {
    const _dataItem: IEdgeP = { ...dataItem };
    _dataItem[field] = value;
    const _items: IStepperItem<EdgesStepperTypes>[] = updateStep(steps, EdgesStepperTypes.GENERAL, _dataItem, [ValidationFields.NAME, ValidationFields.CONNECTION, ValidationFields.TAGS]);
    setSteps(_items);
    setDataItem(_dataItem);
    setHasChanges(true);
  };

  const onChangeTransitionDataField = (value: any, field: string) => {
    const _dataItem: IEdgeP = { ...dataItem };
    _dataItem.deploymentPolicy[0][field] = value;
    const _items: IStepperItem<EdgesStepperTypes>[] = updateStep(steps, EdgesStepperTypes.TRANSIT, _dataItem.deploymentPolicy[0], []);
    setSteps(_items);
    setDataItem(_dataItem);
    setHasChanges(true);
  };

  const onChangeTransitionNetworkField = (value: any, field: string) => {
    const _dataItem: IEdgeP = { ...dataItem };
    _dataItem.nwServicesPolicy[0][field] = value;
    const _items: IStepperItem<EdgesStepperTypes>[] = updateStep(steps, EdgesStepperTypes.TRANSIT, _dataItem.nwServicesPolicy[0], []);
    setSteps(_items);
    setDataItem(_dataItem);
    setHasChanges(true);
  };

  const onChangeRegions = (r: string[], option: DeploymentTypes) => {
    const _dataItem: IEdgeP = { ...dataItem };
    _dataItem.deploymentPolicy[0].type = option;
    if (option === DeploymentTypes.Regions) {
      _dataItem.deploymentPolicy[0].regionCode = r;
      _dataItem.deploymentPolicy[0].wedgeExtIds = [];
    }
    if (option === DeploymentTypes.Wedge) {
      _dataItem.deploymentPolicy[0].regionCode = [];
      _dataItem.deploymentPolicy[0].wedgeExtIds = r;
    }
    const _items: IStepperItem<EdgesStepperTypes>[] = updateStep(steps, EdgesStepperTypes.TRANSIT, _dataItem.deploymentPolicy[0], []);
    setSteps(_items);
    setDataItem(_dataItem);
    setHasChanges(true);
  };

  const onChangePolicyField = (items: IEdgePolicy[]) => {
    const _dataItem: IEdgeP = { ...dataItem };
    _dataItem.policies = items;
    const _items: IStepperItem<EdgesStepperTypes>[] = updateStepById(steps, EdgesStepperTypes.POLICY, _dataItem.policies);
    setSteps(_items);
    setDataItem(_dataItem);
    setHasChanges(true);
  };

  const onChangeSitesField = (value: ITopologyGroup) => {
    const _dataItem: IEdgeP = jsonClone(dataItem);
    const _arrSet = new Set(_dataItem.siteGroupIds);
    _arrSet.add(value.id);
    _dataItem.siteGroupIds = Array.from(_arrSet);
    const _items: IStepperItem<EdgesStepperTypes>[] = updateStepById(steps, EdgesStepperTypes.SITES, _dataItem.siteGroupIds);
    edges.onUpdateGroups(value);
    setSteps(_items);
    setDataItem(_dataItem);
    setHasChanges(true);
  };

  const onSetSitesGroups = (ids: string[]) => {
    const _dataItem: IEdgeP = jsonClone(dataItem);
    _dataItem.siteGroupIds = ids;
    const _items: IStepperItem<EdgesStepperTypes>[] = updateStepById(steps, EdgesStepperTypes.SITES, _dataItem.siteGroupIds);
    setSteps(_items);
    setDataItem(_dataItem);
    setHasChanges(true);
  };

  const onAddExistingApps = (ids: string[]) => {
    const _dataItem: IEdgeP = jsonClone(dataItem);
    _dataItem.appGroupIds = ids;
    const _items: IStepperItem<EdgesStepperTypes>[] = updateStepById(steps, EdgesStepperTypes.APPS, _dataItem.appGroupIds);
    setSteps(_items);
    setDataItem(_dataItem);
    setHasChanges(true);
  };

  const onChangeAppsField = (value: ITopologyGroup) => {
    const _dataItem: IEdgeP = jsonClone(dataItem);
    const _arrSet = new Set(_dataItem.appGroupIds);
    _arrSet.add(value.id);
    _dataItem.appGroupIds = Array.from(_arrSet);
    const _items: IStepperItem<EdgesStepperTypes>[] = updateStepById(steps, EdgesStepperTypes.APPS, _dataItem.appGroupIds);
    edges.onUpdateGroups(value);
    setSteps(_items);
    setDataItem(_dataItem);
    setHasChanges(true);
  };

  const onDeleteSitesGroup = (gr: ITopologyGroup) => {
    setDeleteModalData({
      show: true,
      dataItem: {
        id: gr.id,
        name: gr.name,
        type: TopologyGroupTypesAsString.BRANCH_NETWORKS,
        message: `Are you sure you want to delete “${gr.name}“ group from ${dataItem.name ? `“${dataItem.name}“` : 'this edge'}?`,
      },
    });
  };

  const onDeleteAppsGroup = (gr: ITopologyGroup) => {
    setDeleteModalData({
      show: true,
      dataItem: {
        id: gr.id,
        name: gr.name,
        type: TopologyGroupTypesAsString.APPLICATION,
        message: `Are you sure you want to delete “${gr.name}“ group from ${dataItem.name ? `“${dataItem.name}“` : 'this edge'}?`,
      },
    });
  };

  const onDeleteAccept = (id: string, all: boolean) => {
    if (all) {
      onTryDeleteGroup(id);
      return;
    }
    const _dataItem: IEdgeP = jsonClone(dataItem);
    if (deleteModalData.dataItem.type === TopologyGroupTypesAsString.BRANCH_NETWORKS) {
      _dataItem.siteGroupIds = dataItem.siteGroupIds.filter(it => it !== deleteModalData.dataItem.id);
      const _items: IStepperItem<EdgesStepperTypes>[] = updateStepById(steps, EdgesStepperTypes.SITES, _dataItem.siteGroupIds);
      setSteps(_items);
    }
    if (deleteModalData.dataItem.type === TopologyGroupTypesAsString.APPLICATION) {
      _dataItem.appGroupIds = dataItem.appGroupIds.filter(it => it !== deleteModalData.dataItem.id);
      const _items: IStepperItem<EdgesStepperTypes>[] = updateStepById(steps, EdgesStepperTypes.APPS, _dataItem.appGroupIds);
      setSteps(_items);
    }
    setDataItem(_dataItem);
    setHasChanges(true);
    setDeleteModalData({ show: false, dataItem: null });
  };

  const onCloseDeleteModal = () => {
    setDeleteModalData({ show: false, dataItem: null });
  };

  const onToogleAccordionItem = (id: EdgesStepperTypes) => {
    if (selectedStep && id === selectedStep.id) {
      setSelectedStep(null);
      return;
    }
    const _item: IStepperItem<EdgesStepperTypes> = steps.find(it => it.id === id);
    setSelectedStep(_item);
  };

  const onTryDeleteGroup = async (id: string) => {
    await onDeleteGroup(TopologyGroupApi.deleteGroup(id), userContext.accessToken!);
  };

  const onSave = async () => {
    const _obj: IEdgeP = { ...dataItem };
    if (!_obj.id) {
      delete _obj.id;
      delete _obj.policies;
      await onPost(EdgesApi.postCreateEdge(), { edge_p: _obj }, userContext.accessToken!);
      return;
    }
    await onPut(EdgesApi.putUpdateEdge(_obj.id), { edge_p: _obj }, userContext.accessToken!);
  };

  const onTryLoadEdge = async (id: string) => {
    await onGet(EdgesApi.getEdgeById(id), userContext.accessToken!);
  };

  if (loading) {
    return (
      <Wrapper>
        <AbsLoaderWrapper width="100%" height="100%">
          <LoadingIndicator margin="auto" />
        </AbsLoaderWrapper>
      </Wrapper>
    );
  }

  return (
    <>
      <Wrapper>
        <PanelColumn width="50vw" maxWidth="260px">
          {steps && steps.length && <Stepper formatValue={valueNumberFormat} valueFormattedField="index" selectedStep={selectedStep && selectedStep.id} steps={steps} onSelectStep={onSelectStep} />}
        </PanelColumn>
        <MainColumn>
          {dataItem && (
            <EdgesMap
              name={dataItem.name}
              sites={dataItem.siteGroupIds}
              apps={dataItem.appGroupIds}
              wedges={edges.wedges}
              policies={dataItem.policies}
              transitType={dataItem && dataItem.deploymentPolicy && dataItem.deploymentPolicy.length ? dataItem.deploymentPolicy[0].type : DeploymentTypes.Wedge}
              selectedRegions={dataItem && dataItem.deploymentPolicy && dataItem.deploymentPolicy.length ? dataItem.deploymentPolicy[0].regionCode : null}
              selectedWedgeIds={dataItem && dataItem.deploymentPolicy && dataItem.deploymentPolicy.length ? dataItem.deploymentPolicy[0].wedgeExtIds : null}
            />
          )}
        </MainColumn>
        <PanelColumn width="50vw" maxWidth="680px" padding="0">
          <FormPanel
            onClose={onClose}
            onSave={onSave}
            steps={steps}
            dataItem={dataItem}
            selectedStep={selectedStep}
            saveDisabled={saveDisabled || !hasChanges}
            onChangeSitesField={onChangeSitesField}
            onAddExistingSites={onSetSitesGroups}
            onAddExistingApps={onAddExistingApps}
            onChangeAppsField={onChangeAppsField}
            onChangeField={onChangeDataField}
            onChangeGeneralField={onChangeGeneralField}
            onChangeTransitionNetworkField={onChangeTransitionNetworkField}
            onChangeTransitionDataField={onChangeTransitionDataField}
            onChangeRegions={onChangeRegions}
            onToogleAccordionItem={onToogleAccordionItem}
            onDeleteSitesGroup={onDeleteSitesGroup}
            onDeleteAppsGroup={onDeleteAppsGroup}
            onChangePolicyField={onChangePolicyField}
          />
        </PanelColumn>
        {(postLoading || getLoading || putLoading) && (
          <AbsLoaderWrapper width="100%" height="100%">
            <LoadingIndicator margin="auto" />
          </AbsLoaderWrapper>
        )}
      </Wrapper>
      {deleteModalData && deleteModalData.show && (
        <ModalComponent
          modalStyles={{ maxWidth: '450px', maxHeight: '520px', padding: '40px' }}
          useFadeAnimation
          id="deleteModalWindow"
          open={deleteModalData && deleteModalData.show}
          onClose={onCloseDeleteModal}
        >
          <DeleteGroupComponent data={deleteModalData.dataItem} loading={deleteLoading} onDelete={onDeleteAccept} onClose={onCloseDeleteModal} />
        </ModalComponent>
      )}
      <ToastContainer />
    </>
  );
};

export default React.memo(Editor);
