import React from 'react';
import { IMeraki_Account } from 'lib/api/ApiModels/Accounts/apiModel';
import { ModalContent, ModalFooter, ModalOverflowContainer } from '../../styles/styles';
import { StepItemFormRow } from './styles';
import StepItem from './StepItem';
import TextInput from 'app/components/Inputs/TextInput';
import PrimaryButton from 'app/components/Buttons/PrimaryButton';
import { jsonClone } from 'lib/helpers/cloneHelper';
import AccountFormHeader from './AccountFormHeader';
import CheckBox from 'app/components/Inputs/Checkbox/CheckBox';
import { usePost, usePut } from 'lib/api/http/useAxiosHook';
import { AbsLoaderWrapper } from 'app/components/Loading/styles';
import LoadingIndicator from 'app/components/Loading';
import { AccountsApi } from 'lib/api/ApiModels/Accounts/endpoints';
import { useAccountsDataContext } from 'lib/hooks/Accounts/useAccountsDataContext';
interface Props {
  isEditMode: boolean;
  dataItem: IMeraki_Account;
  onClose: () => void;
}

const NewCiscoMerakiAccountForm: React.FC<Props> = (props: Props) => {
  const { accounts } = useAccountsDataContext();
  const { response: postRes, loading: postLoading, onPost } = usePost<IMeraki_Account, IMeraki_Account>();
  const { response: postUpdateRes, loading: postUpdateLoading, onPut: onUpdate } = usePut<IMeraki_Account, IMeraki_Account>();
  const [dataItem, setDataItem] = React.useState<IMeraki_Account>(null);
  const [isValid, setIsValid] = React.useState<boolean>(false);

  React.useEffect(() => {
    const _dataItem: IMeraki_Account = jsonClone(props.dataItem);
    setIsValid(onValidate(_dataItem));
    setDataItem(_dataItem);
  }, []);

  React.useEffect(() => {
    if (postRes) {
      accounts.onCreateAccount(postRes);
    }
  }, [postRes]);

  React.useEffect(() => {
    if (postUpdateRes) {
      accounts.onUpdateAccount(postUpdateRes);
    }
  }, [postUpdateRes]);

  React.useEffect(() => {
    const _dataItem: IMeraki_Account = jsonClone(props.dataItem);
    setIsValid(onValidate(_dataItem));
    setDataItem(_dataItem);
  }, []);

  const onClose = () => {
    props.onClose();
  };

  const onChangeField = (value: string | null, field: string) => {
    const _item: IMeraki_Account = { ...dataItem };
    _item[field] = value;
    setIsValid(onValidate(_item));
    setDataItem(_item);
  };

  const onChangePolicyField = (value: string | null, field: string) => {
    const _item: IMeraki_Account = { ...dataItem };
    _item.merakiPol[field] = value;
    setIsValid(onValidate(_item));
    setDataItem(_item);
  };

  const onEnabledPolicyChange = (checked: boolean) => {
    const _item: IMeraki_Account = { ...dataItem };
    _item.merakiPol.flowlogPol.enableSyslog = checked;
    setDataItem(_item);
  };

  const onValidate = (_item: IMeraki_Account): boolean => {
    if (!_item) return false;
    if (!_item.name) return false;
    if (!_item.merakiPol.apiKey) return false;
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
    await onUpdate(AccountsApi.putUpdateAccount(dataItem.name), dataItem);
  };

  const onCreateGroup = async () => {
    await onPost(AccountsApi.postCreateAccount(), dataItem);
  };

  if (!dataItem) return null;
  return (
    <>
      <AccountFormHeader vendor={dataItem.vendor} isEditMode={props.isEditMode} onClose={onClose} />
      <ModalContent>
        <ModalOverflowContainer>
          <StepItem>
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
            <StepItemFormRow margin="0 auto 0 0">
              <TextInput
                id="editorAccountDescription"
                name="description"
                value={dataItem.description}
                label="Description"
                onChange={v => onChangeField(v, 'description')}
                // styles?: Object;
                area
              />
            </StepItemFormRow>
            <StepItemFormRow>
              <TextInput
                id="editorAccountApiKey"
                name="apiKey"
                value={dataItem.merakiPol.apiKey}
                label="Api key"
                onChange={v => onChangePolicyField(v, 'apiKey')}
                // styles?: Object;
                required
              />
            </StepItemFormRow>
            <StepItemFormRow margin="0">
              <CheckBox label="Enable Syslog Collection" isChecked={dataItem.merakiPol.flowlogPol.enableSyslog} toggleCheckboxChange={onEnabledPolicyChange} />
            </StepItemFormRow>
          </StepItem>
        </ModalOverflowContainer>
        {(postLoading || postUpdateLoading) && (
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

export default React.memo(NewCiscoMerakiAccountForm);