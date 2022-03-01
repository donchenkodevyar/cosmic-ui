import { Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { usePagination, useRowSelect, useSortBy, useTable } from 'react-table';
import styled from 'styled-components';
import { PerformanceDashboardStyles } from './PerformanceDashboardStyles';
import { Column } from 'lib/api/http/SharedTypes';
import IndeterminateCheckbox from './IndeterminateCheckbox';
import SortIcon from '../../icons/performance dashboard/sort';
import { isEmpty } from 'lodash';

export interface Data {
  readonly id: string;
  readonly name: string;
  readonly sourceOrg: string;
  readonly sourceNetwork: string;
  readonly sourceDevice: string;
  readonly destination: string;
  readonly description: string;
  readonly averageQoe: JSX.Element;
  readonly hits?: JSX.Element;
  readonly isTestDataInvalid?: boolean;
}

interface TableProps {
  readonly onSelectedRowsUpdate: Function;
  readonly columns: Column[];
  readonly data: Data[];
  readonly selectedRowsObject: Record<string, boolean>;
}

const Styles = styled.div`
  table {
    border-spacing: 0;
    width: 100%;
    text-align: left;
    border: 1px solid #e7edf9;

    tr {
      background-color: white;
      border: 1px solid #e7edf9;
    }
    th {
      background-color: #f3f6fc;
      padding: 10px;
      border: 1px solid #e7edf9;
    }
    td {
      margin-top: 10;
      padding: 10px;
    }
  }
  .pagination {
    padding-top: 0.5rem;
  }
  .hide {
    display: none;
  }
  .flexCenter {
    display: flex;
    justify-content: center;
  }
  .invalidData {
    background-color: rgba(154, 164, 177, 0.1);
  }
`;

const Table: React.FC<TableProps> = ({ onSelectedRowsUpdate, columns, data, selectedRowsObject }) => {
  const classes = PerformanceDashboardStyles();

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    selectedFlatRows,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: {
        selectedRowIds: selectedRowsObject,
      },
    },
    useSortBy,
    usePagination,
    useRowSelect,
    hooks => {
      hooks.visibleColumns.push(columns => [
        {
          id: 'selection',
          Header: ({ toggleRowSelected, isAllPageRowsSelected, page }) => {
            const modifiedOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
              page.forEach(row => {
                //check each row if it is not disabled
                !data[row.index].isTestDataInvalid && toggleRowSelected(row.id, event.currentTarget.checked);
              });
            };

            //Count number of selectable and selected rows in the current page to determine the state of select all checkbox
            let selectableRowsInCurrentPage = 0;
            let selectedRowsInCurrentPage = 0;
            page.forEach(row => {
              row.isSelected && selectedRowsInCurrentPage++;
              !data[row.index].isTestDataInvalid && selectableRowsInCurrentPage++;
            });

            //If there are no selectable rows in the current page select all checkbox will be disabled
            const disabled = selectableRowsInCurrentPage === 0;
            const checked = (isAllPageRowsSelected || selectableRowsInCurrentPage === selectedRowsInCurrentPage) && !disabled;

            return (
              <div>
                <IndeterminateCheckbox onChange={modifiedOnChange} checked={checked} disabled={disabled} />
              </div>
            );
          },
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} disabled={data[row.index].isTestDataInvalid} />
            </div>
          ),
        },
        ...columns,
      ]);
    },
  );

  useEffect(() => {
    const selectedRows = selectedFlatRows.map(row => {
      return row.original;
    });
    onSelectedRowsUpdate(selectedRows);
  }, [selectedFlatRows]);

  return (
    <Styles>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  <div className={classes.tableHeaderText}>
                    {column.render('Header')}
                    <span className={classes.sortIcon}>{column.Header === 'NAME' ? <SortIcon /> : <span />}</span>
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {isEmpty(data) ? (
            <tr>
              <td colSpan={columns.length}>No Data</td>
            </tr>
          ) : (
            page.map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} className={data[i].isTestDataInvalid ? 'invalidData' : ''}>
                  {row.cells.map(cell => {
                    return (
                      <td {...cell.getCellProps()}>
                        <div className={classes.tableRowText}>{cell.render('Cell')}</div>
                      </td>
                    );
                  })}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
      <div className="pagination">
        <div className={data.length < pageSize ? 'flexCenter' : classes.flexContainer}>
          <div hidden={data.length < pageSize}>
            <button className={classes.paginationButton} onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
              <Typography className={classes.paginationText}>{'<<'}</Typography>
            </button>
            <button className={classes.paginationButton} onClick={() => previousPage()} disabled={!canPreviousPage}>
              <Typography className={classes.paginationText}>{'<'}</Typography>
            </button>
            <button className={classes.paginationButton} onClick={() => gotoPage(Number(pageIndex))}>
              <Typography className={classes.activePaginationText}>{Number(pageIndex + 1)}</Typography>
            </button>
            {canNextPage ? (
              <button className={classes.paginationButton} onClick={() => gotoPage(Number(pageIndex + 1))}>
                <Typography className={classes.paginationText}>{Number(pageIndex + 2)}</Typography>
              </button>
            ) : null}
            <button className={classes.paginationButton} onClick={() => nextPage()} disabled={!canNextPage}>
              <Typography className={classes.paginationText}>{'>'}</Typography>
            </button>
            <button className={classes.paginationButton} onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
              <Typography className={classes.paginationText}>{'>>'}</Typography>
            </button>
          </div>
          <div>
            <span className={classes.paginationText}>View</span>
            <select
              className={classes.paginationSelect}
              value={pageSize}
              onChange={e => {
                setPageSize(Number(e.target.value));
              }}
            >
              {[10, 100, 1000].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
            <span className={classes.paginationText}>Items per page</span>
          </div>
          <div hidden={data.length < pageSize}>
            <span className={classes.paginationText}>{`${Number(pageIndex) * pageSize + 1}-${data.length < pageSize * (pageIndex + 1) ? data.length : pageSize * (Number(pageIndex) + 1)} out of ${
              data.length
            } items`}</span>
          </div>
        </div>
      </div>
    </Styles>
  );
};
export default Table;
