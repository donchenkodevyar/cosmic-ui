import React from 'react';
import IconWrapper from '../IconWrapper';
import { Label } from '../styles/styles';
import { SecondaryButtonStyles } from './styles';

interface IProps {
  label: JSX.Element | string;
  icon?: JSX.Element;
  onClick: () => void;
  disabled?: boolean;
  styles?: Object;
  withoutBorder?: boolean;
  active?: boolean;
  iconWidth?: string;
  iconHeight?: string;
  width?: string;
  height?: string;
}

const SecondaryButton: React.FC<IProps> = (props: IProps) => {
  return (
    <SecondaryButtonStyles
      className={props.active ? 'active' : ''}
      width={props.width}
      height={props.height}
      withoutBorder={props.withoutBorder}
      style={props.styles}
      disabled={props.disabled}
      onClick={props.onClick}
    >
      <Label margin={props.icon ? '0 12px 0 0' : '0'}>{props.label}</Label>
      {props.icon && <IconWrapper width={props.iconWidth || '16px'} height={props.iconHeight || '16px'} icon={props.icon} />}
    </SecondaryButtonStyles>
  );
};

export default React.memo(SecondaryButton);
