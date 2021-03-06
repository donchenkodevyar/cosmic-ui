import styled from 'styled-components';

export const TextInputWrapper = styled.div`
  position: relative;
  width: 100%;
  flex-shrink: 0;
  overflow: hidden;
  min-height: 60px;
  & .MuiSelect-root,
  & .MuiInputBase-root {
    font-family: 'DMSans';
    font-size: 14px;
    line-height: normal;
    border-radius: 6px;
    width: 100%;
    color: var(--_primaryTextColor);
    background: var(--_primaryBg);
    border: 1px solid var(--_defaultInputBorder);
    box-sizing: border-box;
    & .icon svg {
      transform: rotate(0deg);
      transition: all 0.2s linear;
    }
    & .open svg {
      transform: rotate(180deg);
    }
    & .open .inheritFill {
      fill: var(--_sHoverButtonColor);
    }
    &.fullHeight {
      height: 100%;
      & .MuiSelect-select {
        height: 100% !important;
        background: var(--_primaryBg) !important;
        &.Mui-disabled {
          opacity: 0.5;
          cursor: not-allowed;
          * {
            cursor: not-allowed;
          }
        }
      }
    }
    &.withLabel {
      height: calc(100% - 22px);
      & .MuiSelect-select {
        height: 100% !important;
        background: var(--_primaryBg) !important;
        &.Mui-disabled {
          opacity: 0.5;
          cursor: not-allowed;
          * {
            cursor: not-allowed;
          }
        }
      }
    }
    &.Mui-disabled {
      opacity: 0.5;
      border-color: var(--_disabledTextColor) !important;
      cursor: not-allowed;
      * {
        cursor: not-allowed;
      }
    }
  }
  & .MuiOutlinedInput-notchedOutline {
    display: none !important;
  }
  & .MuiSelect-select {
    padding-top: 8px !important;
    padding-bottom: 8px !important;
    padding-left: 16px !important;
    min-height: 38px !important;
    box-sizing: border-box !important;
    color: var(--_primaryTextColor) !important;
    font-size: 14px !important;
    font-family: 'DMSans' !important;
    font-weight: 500 !important;
    line-height: 18px;
    background: var(--_primaryBg) !important;
    border-radius: 6px;
    border: none !important;
    &.Mui-disabled {
      opacity: 0.5;
      cursor: not-allowed;
      * {
        cursor: not-allowed;
      }
    }
  }
`;

export const DisplayValue = styled.div`
  display: inline-flex;
  align-items: center;
  height: 100%;
  width: 100%;
  vertical-align: middle;
`;
export const ValueLabel = styled.span`
  max-width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  display: inline-block;
`;
