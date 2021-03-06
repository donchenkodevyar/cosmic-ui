import styled from 'styled-components';

interface CheckboxProps {
  colorIcon?: string;
  paddingLeft?: string;
  minHeight?: string;
  alignSvg?: string;
  disabled: boolean;
  checked: boolean;
}

interface Props {
  width?: string;
  height?: string;
  margin?: string;
  isChecked?: boolean;
}

export const Input = styled.input<Props>`
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  cursor: inherit;
  height: ${props => props.height || '20px'};
  width: ${props => props.width || '20px'};
  pointer-events: none;
`;

export const Overlay = styled.span<Props>`
  height: ${props => props.height || '20px'};
  width: ${props => props.width || '20px'};
  background-color: var(--primaryBg);
  transition: all 0.1s ease-in-out;
  border: 1px solid;
  border-color: #b4bfcf;
  box-sizing: border-box;
  border-radius: 4px;
  overflow: hidden;
  margin: 0 12px 0 0;
  pointer-events: none;
  svg {
    width: 100%;
    height: 100%;
    rect:not(.interminate) {
      fill: transparent;
    }
    rect.interminate {
      fill: var(--_hoverButtonBg);
    }
    path {
      fill: transparent;
    }
  }
`;

export const Checkbox = styled.div<CheckboxProps>`
  display: inline-flex;
  min-height: ${props => props.minHeight || '20px'};
  align-items: center;
  position: relative;
  font-weight: normal;
  cursor: ${props => (props.disabled ? 'default' : 'pointer')};
  pointer-events: all;
  color: var(--_disabledTextColor);
  &:hover:not(:disabled) {
    ${Overlay} {
      border-color: var(--_hoverButtonBg);
    }
  }
  ${Input} ~ ${Overlay} {
    svg {
      vertical-align: ${props => props.alignSvg || 'top'};
    }
  }
  ${Input}:checked ~ * {
    color: var(--_primaryTextColor);
  }
  ${Input}:checked ~ ${Overlay} {
    border-color: transparent;
    svg {
      vertical-align: ${props => props.alignSvg || 'top'};
      rect:not(.interminate) {
        fill: var(--_hoverButtonBg);
      }
      rect.interminate {
        fill: var(--_primaryBg);
      }
      path {
        fill: var(--_primaryBg);
      }
    }
  }
`;

export const Label = styled.span<Props>`
  display: inline-block;
  white-space: nowrap;
  pointer-events: none;
  color: ${props => (props.isChecked ? 'var(--_primaryTextColor)' : 'var(--_disabledTextColor)')};
`;
