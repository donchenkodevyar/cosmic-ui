import React from 'react';
import { ISelectionGridCellValue } from 'lib/models/general';
import { TagsWrapper } from './styles';
import { ISessionsGridField } from 'app/containers/Pages/SessionsPage/SessionPage/models';
import FieldValueTag from './FieldValueTag';
import uuid from 'react-uuid';
import OperatorTag from './OperatorTag';
import { closeSmallIcon } from 'app/components/SVGIcons/close';
import SecondaryButton from 'app/components/Buttons/SecondaryButton';

interface Props {
  items: (ISelectionGridCellValue<ISessionsGridField, ISessionsGridField> | string)[];
  onRemoveTag: (index: number) => void;
  onClearAll: () => void;
  onSelectTag: (_item: ISelectionGridCellValue<ISessionsGridField, ISessionsGridField>, index: number) => void;
  onChangeOperator: (_item: string, index: number) => void;
}

const Tags: React.FC<Props> = (props: Props) => {
  const onRemoveItem = (index: number) => {
    props.onRemoveTag(index);
  };

  const onSelectTag = (item: ISelectionGridCellValue<ISessionsGridField, ISessionsGridField>, index: number) => {
    props.onSelectTag(item, index);
  };

  const onChangeOperator = (_item: string, index: number) => {
    props.onChangeOperator(_item, index);
  };

  const onClearAll = () => {
    props.onClearAll();
  };

  if (!props.items || !props.items.length) return null;
  return (
    <TagsWrapper>
      {props.items.map((it, index) => {
        if (typeof it === 'string') {
          return <OperatorTag item={it} index={index} onChangeOperator={onChangeOperator} />;
        }
        return (
          <FieldValueTag
            key={`tagFilterItem${uuid()}`}
            index={index}
            item={it as ISelectionGridCellValue<ISessionsGridField, ISessionsGridField>}
            onRemoveTag={onRemoveItem}
            onSelectTag={onSelectTag}
          />
        );
      })}
      {props.items && props.items.length ? (
        <SecondaryButton
          iconWidth="10px"
          iconHeight="10px"
          styles={{ display: 'flex', alignItems: 'center', height: '30px', padding: '4px 12px' }}
          withoutBorder
          label="Clear all"
          icon={closeSmallIcon}
          onClick={onClearAll}
        />
      ) : null}
    </TagsWrapper>
  );
};

export default React.memo(Tags);
