import React from 'react';
import { columnsIcon } from 'app/components/SVGIcons/columnsIcon';
import { GridHeaderWrapper, GridLabelWrapper, GridLabel, GridCount } from './styles';
import ColumnFilter from 'app/components/Basic/ColumnFilter';
import { IColumn } from 'lib/models/grid';
interface Props {
  count: number;
  columns: IColumn[];
  onChangeColumn: (col: IColumn, hide: boolean) => void;
  onChangeOrder: (items: IColumn[]) => void;
}

const TableHeader: React.FC<Props> = (props: Props) => {
  const onColumnChange = (col: IColumn, hide: boolean) => {
    props.onChangeColumn(col, hide);
  };

  const onChangeOrder = (items: IColumn[]) => {
    props.onChangeOrder(items);
  };

  return (
    <>
      <GridHeaderWrapper>
        <GridLabelWrapper>
          <GridLabel>Logs</GridLabel>
          {!props.count ? null : <GridCount>{props.count}</GridCount>}
        </GridLabelWrapper>
        <ColumnFilter label="Columns" popupLabel="Columns" icon={columnsIcon} items={props.columns} draggable onItemClick={onColumnChange} onChangeOrder={onChangeOrder} />
      </GridHeaderWrapper>
    </>
  );
};

export default React.memo(TableHeader);
