import styled from 'styled-components';

interface IProps {
  width?: string;
  height?: string;
  disabled?: boolean;
}
export const Icon = styled.span<IProps>`
  display: inline-block;
  width: ${props => props.width || '16px'};
  height: ${props => props.height || '16px'};
  flex-shrink: 0;
  cursor: pointer;
  opacity: ${props => (props.disabled ? 0.4 : 1)};
  svg {
    width: 100%;
    height: 100%;
    vertical-align: top;
  }
  img {
    width: 100%;
    height: 100%;
    vertical-align: top;
  }
  &:hover .inheritHoverFill {
    fill: var(--_hoverButtonBg);
  }
  &.disabled .inheritFill {
    fill: var(--_defaultInputBorder);
  }
  &.inheritRemoveFill:hover .inheritFill {
    fill: var(--_errorColor);
  }
  &.arrow svg {
    transition: transform 0.5s linear;
    transform: rotate(0deg);
  }
  &.arrowTop svg {
    transition: transform 0.5s linear;
    transform: rotate(-180deg);
  }
`;
