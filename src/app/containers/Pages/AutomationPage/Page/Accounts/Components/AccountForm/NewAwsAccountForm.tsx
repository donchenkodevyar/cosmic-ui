import React, { useContext } from 'react';
import { AwsLogStorageType, IAWS_Account } from 'lib/api/ApiModels/Accounts/apiModel';
import { ModalContent, ModalFooter, ModalOverflowContainer } from '../../styles/styles';
import { StepItemFormRow } from './styles';
import StepItem from './StepItem';
import { StepperItemStateType } from 'app/components/Stepper/model';
import TextInput from 'app/components/Inputs/TextInput';
import PrimaryButton from 'app/components/Buttons/PrimaryButton';
import { jsonClone } from 'lib/helpers/cloneHelper';
import AccountFormHeader from './AccountFormHeader';
import CheckBox from 'app/components/Inputs/Checkbox/CheckBox';
// import MultipleDropdown from 'app/components/Inputs/MultipleDropdown';
import { useAccountsDataContext } from 'lib/hooks/Accounts/useAccountsDataContext';
import { useGet, usePost, usePut } from 'lib/api/http/useAxiosHook';
import { AbsLoaderWrapper } from 'app/components/Loading/styles';
import LoadingIndicator from 'app/components/Loading';
import { IBaseEntity, ISelectedListItem } from 'lib/models/general';
import { UserContextState, UserContext } from 'lib/Routes/UserProvider';
import MatMultipleSelect from 'app/components/Inputs/MatSelect/MatMultipleSelect';
import MatSelect from 'app/components/Inputs/MatSelect';
import { PolicyApi } from 'lib/api/ApiModels/Services/policy';
import { GetControllerVendorResponse } from 'lib/api/http/SharedTypes';

interface Props {
  isEditMode: boolean;
  dataItem: IAWS_Account;
  regions: ISelectedListItem<string>[];
  onClose: () => void;
}

const NewAwsAccountForm: React.FC<Props> = (props: Props) => {
  const { accounts } = useAccountsDataContext();
  const userContext = useContext<UserContextState>(UserContext);
  const { response: getResById, loading: getLoading, onGet } = useGet<IAWS_Account>();
  const { response: postRes, loading: postLoading, onPost } = usePost<IAWS_Account, IBaseEntity<string>>();
  const { response: postUpdateRes, loading: postUpdateLoading, onPut: onUpdate } = usePut<IAWS_Account, IBaseEntity<string>>();
  const [dataItem, setDataItem] = React.useState<IAWS_Account>(null);
  const [isValid, setIsValid] = React.useState<boolean>(false);
  const { response: vendorResponse, onGet: onGetVendors } = useGet<GetControllerVendorResponse>();

  React.useEffect(() => {
    const _dataItem: IAWS_Account = jsonClone(props.dataItem);
    setIsValid(onValidate(_dataItem));
    setDataItem(_dataItem);
  }, []);

  React.useEffect(() => {
    if (postRes) {
      onGetAccountById(postRes.id);
    }
  }, [postRes]);

  React.useEffect(() => {
    if (postUpdateRes) {
      onGetAccountById(postUpdateRes.id);
    }
  }, [postUpdateRes]);

  React.useEffect(() => {
    if (getResById) {
      accounts.onAddAccount(getResById);
      onTryLoadVendors();
    }
  }, [getResById]);

  React.useEffect(() => {
    if (vendorResponse && vendorResponse.vendors) {
      userContext.setUserVendors(vendorResponse.vendors);
      onClose();
    }
  }, [vendorResponse]);

  const onClose = () => {
    props.onClose();
  };

  const onChangeField = (value: string | null, field: string) => {
    const _item: IAWS_Account = { ...dataItem };
    _item[field] = value;
    setIsValid(onValidate(_item));
    setDataItem(_item);
  };

  const onChangePolicyField = (value: string | null, field: string) => {
    const _item: IAWS_Account = { ...dataItem };
    _item.awsPol[field] = value;
    setIsValid(onValidate(_item));
    setDataItem(_item);
  };

  const onEnabledPolicyChange = (checked: boolean) => {
    const _item: IAWS_Account = { ...dataItem };
    _item.awsPol.flowlogPol.enable = checked;
    setIsValid(onValidate(_item));
    setDataItem(_item);
  };

  const onFlowLogChange = (value: string | null, field: string) => {
    const _item: IAWS_Account = { ...dataItem };
    _item.awsPol.flowlogPol[field] = value;
    setIsValid(onValidate(_item));
    setDataItem(_item);
  };

  const onRegionsChange = (_items: string[]) => {
    const _item: IAWS_Account = { ...dataItem };
    _item.awsPol.regions = _items;
    setIsValid(onValidate(_item));
    setDataItem(_item);
  };

  const onChangeStorageType = (value: AwsLogStorageType) => {
    const _item: IAWS_Account = { ...dataItem };
    _item.awsPol.flowlogPol.logStorageType = value;
    if (value === AwsLogStorageType.CLOUD_WATCH) {
      _item.awsPol.flowlogPol.storageBucketName = '';
    }
    if (value === AwsLogStorageType.S3) {
      _item.awsPol.flowlogPol.logGroupName = '';
    }
    setIsValid(onValidate(_item));
    setDataItem(_item);
  };

  const onValidate = (_item: IAWS_Account): boolean => {
    if (!_item) return false;
    if (!_item.name) return false;
    if (!_item.awsPol.accessKey) return false;
    if (!_item.awsPol.secret) return false;
    if (!_item.awsPol.username) return false;
    if (!_item.awsPol.regions.length) return false;
    if (_item.awsPol.flowlogPol.enable) {
      if (!_item.awsPol.flowlogPol.logStorageType) return false;
      if (_item.awsPol.flowlogPol.logStorageType === AwsLogStorageType.CLOUD_WATCH) {
        if (!_item.awsPol.flowlogPol.logGroupName) return false;
        return true;
      }
      if (_item.awsPol.flowlogPol.logStorageType === AwsLogStorageType.S3) {
        if (!_item.awsPol.flowlogPol.storageBucketName) return false;
        return true;
      }
    }
    return true;
  };

  const onSave = () => {
    if (!props.isEditMode) {
      onCreateGroup();
      return;
    }
    onUpdateGroup();
  };

  const onUpdateGroup = async () => {
    await onUpdate(PolicyApi.putUpdateAccount(dataItem.id), { controller: dataItem }, userContext.accessToken!);
  };

  const onCreateGroup = async () => {
    await onPost(PolicyApi.postCreateAccount(), { controller: dataItem }, userContext.accessToken!);
  };

  const onGetAccountById = async (id: string) => {
    await onGet(PolicyApi.getAccountsById(id), userContext.accessToken!);
  };

  const onTryLoadVendors = async () => {
    await onGetVendors(PolicyApi.getControllerVendors(), userContext.accessToken!);
  };

  if (!dataItem) return null;
  return (
    <>
      <AccountFormHeader vendor={dataItem.vendor} isEditMode={props.isEditMode} onClose={onClose} />
      <ModalContent>
        <ModalOverflowContainer>
          <StepItem index="1" state={StepperItemStateType.EMPTY} label="Step 1: Add name and description">
            <StepItemFormRow>
              <TextInput
                id="editorAccountName"
                name="name"
                value={dataItem.name}
                label="Name"
                onChange={v => onChangeField(v, 'name')}
                // styles?: Object;
                required
              />
            </StepItemFormRow>
            <StepItemFormRow>
              <TextInput
                id="editorAccountDescription"
                name="description"
                value={dataItem.description}
                label="Description"
                onChange={v => onChangeField(v, 'description')}
                // styles?: Object;
                type="textarea"
              />
            </StepItemFormRow>
            <StepItemFormRow>
              <TextInput
                id="editorAccountUsername"
                name="username"
                value={dataItem.awsPol.username}
                label="User name"
                onChange={v => onChangePolicyField(v, 'username')}
                // styles?: Object;
                required
              />
            </StepItemFormRow>
            <StepItemFormRow>
              <TextInput
                id="editorAccountAccessKey"
                type="password"
                name="accessKey"
                value={dataItem.awsPol.accessKey}
                label="Access key"
                onChange={v => onChangePolicyField(v, 'accessKey')}
                // styles?: Object;
                required
              />
            </StepItemFormRow>
            <StepItemFormRow>
              <TextInput
                id="editorAccountSecretKey"
                name="secret"
                type="password"
                value={dataItem.awsPol.secret}
                label="Secret key"
                onChange={v => onChangePolicyField(v, 'secret')}
                // styles?: Object;
                required
              />
            </StepItemFormRow>
            <StepItemFormRow>
              <MatMultipleSelect
                id="regions"
                label="Regions"
                value={dataItem.awsPol.regions}
                options={props.regions}
                onChange={onRegionsChange}
                styles={{ height: '72px', minHeight: '72px', margin: '0 0 20px 0' }}
                selectStyles={{ height: '50px', width: '100%' }}
                selectClaassName="withLabel"
                required
                optionCheckMark
              />
            </StepItemFormRow>
            <StepItemFormRow>
              <CheckBox label="Enable Flowlog Collection" isChecked={dataItem.awsPol.flowlogPol.enable} toggleCheckboxChange={onEnabledPolicyChange} />
            </StepItemFormRow>
            {dataItem.awsPol.flowlogPol.enable && (
              <>
                <StepItemFormRow>
                  <MatSelect
                    id="selectAwsLogStorageType"
                    label="Storage Type"
                    value={dataItem.awsPol.flowlogPol && dataItem.awsPol.flowlogPol.logStorageType ? dataItem.awsPol.flowlogPol.logStorageType : ''}
                    options={[AwsLogStorageType.CLOUD_WATCH, AwsLogStorageType.S3]}
                    onChange={onChangeStorageType}
                    renderValue={(v: AwsLogStorageType) => {
                      if (v === AwsLogStorageType.CLOUD_WATCH) return <>Cloud Watch</>;
                      if (v === AwsLogStorageType.S3) return <>S3</>;
                      return null;
                    }}
                    renderOption={(v: AwsLogStorageType) => {
                      if (v === AwsLogStorageType.CLOUD_WATCH) return <>Cloud Watch</>;
                      if (v === AwsLogStorageType.S3) return <>S3</>;
                      return null;
                    }}
                    required
                    styles={{ height: '72px', minHeight: '72px' }}
                    selectStyles={{ height: '50px', width: '100%' }}
                  />
                </StepItemFormRow>
                <StepItemFormRow margin="0">
                  {dataItem.awsPol.flowlogPol.logStorageType === AwsLogStorageType.CLOUD_WATCH && (
                    <TextInput
                      id="flowGroupName"
                      name="groupName"
                      value={dataItem.awsPol.flowlogPol.logGroupName}
                      label="Group Name"
                      onChange={v => onFlowLogChange(v, 'logGroupName')}
                      // styles?: Object;
                      required
                    />
                  )}
                  {dataItem.awsPol.flowlogPol.logStorageType === AwsLogStorageType.S3 && (
                    <TextInput
                      id="flowStorageBucketName"
                      name="storageBucketName"
                      value={dataItem.awsPol.flowlogPol.logGroupName}
                      label="Storage Bucket Name"
                      onChange={v => onFlowLogChange(v, 'storageBucketName')}
                      // styles?: Object;
                      required
                    />
                  )}
                </StepItemFormRow>
              </>
            )}
          </StepItem>
        </ModalOverflowContainer>
        {(postLoading || postUpdateLoading || getLoading) && (
          <AbsLoaderWrapper>
            <LoadingIndicator margin="auto" />
          </AbsLoaderWrapper>
        )}
      </ModalContent>
      <ModalFooter>
        <PrimaryButton label={props.isEditMode ? 'Update Account' : 'Create Account'} onClick={onSave} disabled={!isValid} styles={{ width: '100%', height: '60px' }} />
      </ModalFooter>
    </>
  );
};

export default React.memo(NewAwsAccountForm);
