import styled from 'styled-components';

export const Label = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  color: inherit;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: calc(100% - 32px);
`;

export const VmWrapStyles = styled.div`
  display: flex;
  width: 100%;
  margin: 0 0 4px 0;
  border-radius: 6px;
  background: var(--_appBg);
  height: 50px;
  padding: 15px 20px;
  align-items: center;
  flex-shrink: 0;
  color: var(--_primaryTextColor);
  flex-wrap: nowrap;
  cursor: pointer;
  opacity: 0.7;
  .inheritFill {
    fill: var(--_defaultIconColor);
  }

  &:hover {
    opacity: 1;
    /* background: var(--_hoverButtonBg);
    color: var(--_primaryWhiteColor);
    .inheritFill {
      fill: var(--_primaryWhiteColor);
    } */
  }
`;

export const BalanceWrapStyles = styled.div`
  display: flex;
  width: 100%;
  margin: 0 0 4px 0;
  border-radius: 6px;
  background: var(--_appBg);
  height: 50px;
  padding: 15px 20px;
  align-items: center;
  flex-shrink: 0;
  color: var(--_primaryTextColor);
  flex-wrap: nowrap;
`;

export const GroupWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 0 4px 0;
  background: var(--_appBg);
  min-height: 50px;
  align-items: center;
  flex-shrink: 0;
  border-radius: 6px;
  padding-bottom: 16px;
  flex-wrap: nowrap;
  ${VmWrapStyles} {
    background: var(--_primaryBg);
    margin: 0 auto 4px auto;
    max-width: calc(100% - 40px);
    .inheritFill {
      fill: var(--_primaryTextColor);
    }
    &:hover {
      background: var(--_hoverButtonBg);
      color: var(--_hoverButtonColor);
      .inheritFill {
        fill: var(--_hoverButtonColor);
      }
    }
  }
`;

export const GroupWrapStyles = styled.div`
  display: flex;
  position: relative;
  width: 100%;
  background: transparent;
  height: 50px;
  padding: 15px 20px;
  border-radius: 6px;
  margin: 0 0 12px 0;
  align-items: center;
  flex-shrink: 0;
  color: var(--_primaryTextColor);
  flex-wrap: nowrap;
  cursor: pointer;
  ${Label} {
    max-width: calc(100% - 52px);
    margin-right: auto;
  }
  .arrow {
    transition: transform 0.5s linear;
    transform: rotate(0deg);
  }
  .arrowTop {
    transition: transform 0.5s linear;
    transform: rotate(-180deg);
  }
  .inheritFill {
    fill: var(--_defaultIconColor);
  }

  &:hover {
    background: var(--_hoverButtonBg);
    color: var(--_hoverButtonColor);
    .inheritFill {
      fill: var(--_hoverButtonColor);
    }
  }
`;

interface IIGARowProps {
  margin?: string;
}
export const InternetGetAwayRow = styled.div<IIGARowProps>`
  display: flex;
  flex-shrink: 0;
  margin: ${props => props.margin || '0 0 10px 0'};
  align-items: center;
  font-size: 16px;
  line-height: 20px;
  flex-wrap: nowrap;
`;
export const InternetGetAwayLabel = styled.span`
  color: var(--_primaryTextColor);
  display: inline-block;
  margin: auto 4px auto 0;
  flex-shrink: 0;
  font-weight: 500;
  white-space: nowrap;
`;
export const InternetGetAwayValue = styled.div`
  color: var(--_disabledTextColor);
  display: inline-block;
  font-weight: normal;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 100%;
`;

interface SColorProps {
  color: string;
}
export const SegmentColorRect = styled.span<SColorProps>`
  margin: auto 0 auto 12px;
  width: 20px;
  height: 20px;
  background: ${props => props.color || 'transparent'};
  border-radius: 6px;
`;
