import React from 'react';
import { SignUpStyles } from '../SignUpStyles';
import { StepData } from '..';

interface ConnectFormProps {
  readonly title: string;
  readonly img: string;
  readonly subtitle: string;
  readonly edgeName: string;
  readonly steps: StepData[];
  readonly isFormFilled: boolean;
  readonly isUpdateForm: boolean;
  readonly onFormSubmit: (edgeTitle: string) => void;
  readonly onFormUpdate: (edgeTitle: string) => void;
}

export const ConnectSourceForm: React.FC<ConnectFormProps> = ({ title, img, subtitle, edgeName, steps, isFormFilled, isUpdateForm, onFormSubmit, onFormUpdate }) => {
  const classes = SignUpStyles();

  const onSourceFormSubmit = () => onFormSubmit(edgeName);

  const onSourceFormUpdate = () => onFormUpdate(edgeName);

  return (
    <div className={classes.connectFormContainer}>
      <div className={classes.titleContainer}>
        <img className={classes.titleImg} src={img} alt="aws-icon" />
        <span className={classes.title}>{title}</span>
      </div>
      <div className={classes.subTitle}>{subtitle}</div>
      {steps.map((step, index) => (
        <div key={index} className={classes.grayBorderBox}>
          <div className={classes.connectFlexContainer}>
            <div className={classes.stepCountBox}>{index + 1}</div>
            <div>
              <div className={classes.stepTitle}>{`Step ${index + 1}: ${step.title}`}</div>
              <div>{step.content}</div>
            </div>
          </div>
        </div>
      ))}
      <div className={classes.flexContainer}>
        <>
          <button className={isFormFilled ? classes.connectSourceFormButton : classes.startButton} onClick={isUpdateForm ? onSourceFormUpdate : onSourceFormSubmit} disabled={!isFormFilled}>
            {isUpdateForm ? 'UPDATE' : 'CONNECT'}
          </button>
        </>
      </div>
    </div>
  );
};
