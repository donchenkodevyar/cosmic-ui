import { Checkbox } from '@mui/material';
import React, { useState } from 'react';
import { AnalyticsStyles } from '../AnalyticsStyles';
import Select from 'react-select';
import { SelectOption } from './MetricsExplorer';

interface CustomTimeTabProps {
  readonly fromDate: string;
  readonly toDate: string;
  readonly onFromDateChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  readonly onToDateChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  readonly timeRange: SelectOption;
  readonly onTimeRangeChange: (value: SelectOption) => void;
}

const TIME_RANGE_OPTIONS: SelectOption[] = [
  {
    label: 'Hour',
    value: '-1h',
  },
  {
    label: 'Day',
    value: '-1d',
  },
  {
    label: 'Week',
    value: '-7d',
  },
  {
    label: 'Month',
    value: '-30d',
  },
];

const SHOW_NEXT = 'SHOW THE NEXT';
const SHOW_PREVIOUS = 'SHOW THE PREVIOUS';
const DEFAULT_SHOW = 'SHOW';

export const CustomTimeTab: React.FC<CustomTimeTabProps> = ({ fromDate, toDate, onFromDateChange, onToDateChange, timeRange, onTimeRangeChange }) => {
  const classes = AnalyticsStyles();
  const [isFromDateChecked, setIsFromDateChecked] = useState<boolean>(false);
  const [isToDateChecked, setIsToDateChecked] = useState<boolean>(true);

  const handleFromCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => setIsFromDateChecked(event.target.checked);

  const handleToCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => setIsToDateChecked(event.target.checked);

  const getSelectTitle = () => {
    if (isFromDateChecked && !isToDateChecked) {
      return SHOW_NEXT;
    }
    if (!isFromDateChecked && isToDateChecked) {
      return SHOW_PREVIOUS;
    }
    return DEFAULT_SHOW;
  };

  return (
    <div className={classes.customContainer}>
      <div className={classes.blockContainer}>
        <Checkbox checked={isFromDateChecked} onChange={handleFromCheckboxChange} />
        <div className={classes.labelContainer}>
          <span className={classes.dateTimeLabelText}>From:</span>
        </div>
        <input value={fromDate} disabled={!isFromDateChecked} className={classes.dateTimeInput} type="datetime-local" id="customFromDate" onChange={onFromDateChange} />
      </div>
      <div className={isFromDateChecked && isToDateChecked ? classes.hidden : classes.selectBlockContainer}>
        <div className={classes.tableHeaderText}>{getSelectTitle()}</div>
        <Select className={classes.showSelect} label="lookup select" value={timeRange} options={TIME_RANGE_OPTIONS} onChange={onTimeRangeChange} />
      </div>
      <div className={classes.blockContainer}>
        <Checkbox checked={isToDateChecked} onChange={handleToCheckboxChange} />
        <div className={classes.labelContainer}>
          <span className={classes.dateTimeLabelText}>To:</span>
        </div>
        <input value={toDate} disabled={!isToDateChecked} className={classes.dateTimeInput} type="datetime-local" id="customToDate" onChange={onToDateChange} />
      </div>
    </div>
  );
};
