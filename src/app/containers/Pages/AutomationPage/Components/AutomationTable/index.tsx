import React from 'react';
import EmptyPage from 'app/components/Basic/EmptyPage';
import { StepperText } from 'app/components/Basic/EmptyPage/styles';
import TableComponent from 'app/components/Basic/Table/TableComponent';
import { ITableColumn } from 'app/components/Basic/Table/model';
import Search from 'app/components/Inputs/Search';
import PrimaryButton from 'app/components/Buttons/PrimaryButton';
import { addIcon } from 'app/components/SVGIcons/addIcon';
import { ActionPart, ActionRowStyles } from 'app/containers/Pages/Shared/styles';
// import { useAutomationDataContext } from 'lib/hooks/Automation/useAutomationDataContext';
import { emptyAutomationIcon } from 'app/components/SVGIcons/emptyPages/emptyAutomation';
interface Props {
  onCreateNew: () => void;
}

const AutomationTable: React.FC<Props> = (props: Props) => {
  // const { automation } = useAutomationDataContext();
  const [data] = React.useState<any>(null);
  const columns: ITableColumn[] = [
    { id: 'automationName', field: 'name', label: 'Name' },
    { id: 'automationDescription', field: 'description', label: 'Description' },
    { id: 'automationStatus', field: 'status', label: 'Status' },
    { id: 'automationAction', field: 'action', label: 'Action' },
    { id: 'automationActionColumn', field: '', label: '', width: 40 },
  ];

  const handleSearchChange = (_value: string | null) => {
    // automation.onChangeSearchQuery(_value);
  };

  const onCreateNew = () => {
    props.onCreateNew();
  };

  if (!data) {
    return (
      <EmptyPage iconStyles={{ width: '196px', height: '209px' }} icon={emptyAutomationIcon} buttonLabel="Create automation" onClick={onCreateNew}>
        <StepperText highLight margin="0 auto 20px auto">
          There is no created automation yet
        </StepperText>
        <StepperText margin="0 auto">To create an automation click on the button below.</StepperText>
      </EmptyPage>
    );
  }
  return (
    <>
      <ActionRowStyles height="40px">
        <ActionPart width="50%" maxWidth="440px" minWidth="200px" margin="0 auto 0 0">
          <Search styles={{ width: '100%' }} searchQuery={''} onChange={handleSearchChange} />
        </ActionPart>
        <ActionPart width="50%" margin="0 0 0 auto" justifyContent="flex-end">
          <PrimaryButton label="Create new" icon={addIcon} onClick={onCreateNew} />
        </ActionPart>
      </ActionRowStyles>
      <TableComponent columns={columns} data={[]} error={null} />
    </>
  );
};

export default React.memo(AutomationTable);
