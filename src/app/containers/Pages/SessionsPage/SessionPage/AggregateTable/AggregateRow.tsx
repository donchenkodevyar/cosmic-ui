import React from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Collapse from '@mui/material/Collapse';
import { IAggregateRow } from './models';
import VendorTable from './VendorTable';
import { ISessionsGridField } from '../models';
import IconWrapper from 'app/components/Buttons/IconWrapper';
import { arrowBottomIcon } from 'app/components/SVGIcons/arrows';

interface Props {
  row: IAggregateRow;
  columns: ISessionsGridField[];
}
const AggregateRow: React.FC<Props> = (props: Props) => {
  const [open, setOpen] = React.useState(false);
  return (
    <React.Fragment>
      <TableRow className={`bodyRow ${open ? 'expandedRow' : ''}`}>
        {props.columns.map(it => {
          if (it.resField === 'id') {
            return (
              <TableCell key={`tdRow${it.resField}`}>
                <IconWrapper
                  width="12px"
                  height="12px"
                  styles={{ transform: open ? 'rotate(-180deg)' : 'rotate(0)', transition: 'transform 0.3s linear' }}
                  icon={arrowBottomIcon}
                  onClick={() => setOpen(!open)}
                />
              </TableCell>
            );
          }
          return <TableCell>{props.row[it.resField]}</TableCell>;
        })}
      </TableRow>
      <TableRow className={`nestedRow ${!open ? 'rowCollapsed' : ''}`}>
        <TableCell className="nestedTd" style={open ? null : { paddingBottom: 0, paddingTop: 0, border: 'none' }} colSpan={props.columns.length}>
          <Collapse in={open} timeout="auto" easing="linear" unmountOnExit>
            {Object.keys(props.row.data).map((key, index) => (
              <VendorTable key={`${props.row.id}${key}`} isLast={index === Object.keys(props.row.data).length - 1} label={key} data={props.row.data[key]} />
            ))}
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

export default React.memo(AggregateRow);