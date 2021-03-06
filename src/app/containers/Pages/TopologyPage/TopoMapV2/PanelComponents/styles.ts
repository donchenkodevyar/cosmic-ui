import styled from 'styled-components';
import { InputWrapper, InputSearch } from 'app/components/Inputs/Search/styles';

export const PanelTabWrapper = styled.div<Props>`
  display: flex;
  white-space: nowrap;
  width: 100%;
  height: 40px;
  margin-bottom: 20px;
`;

interface Props {
  direction?: 'row' | 'column';
  align?: 'center' | 'unset';
  margin?: string;
}
export const PanelHeader = styled.div<Props>`
  display: flex;
  flex-direction: ${props => props.direction || 'row'};
  white-space: nowrap;
  width: 100%;
  margin: ${props => props.margin || '0 0 20px 0'};
  align-items: ${props => props.align || 'center'};
  ${InputSearch} {
    border-color: var(--_disabledButtonColor);
    width: 100%;
    min-width: unset;
    max-width: 100%;
    flex-shrink: 0;
  }
  ${InputWrapper} {
    margin-top: 20px;
  }
`;

interface TitleProps {
  maxWidth?: string;
  margin?: string;
}
export const PanelTitle = styled.div<TitleProps>`
  font-style: normal;
  font-weight: normal;
  font-size: 22px;
  color: var(--_primaryTextColor);
  white-space: pre-line;
  word-break: break-word;
  text-overflow: ellipsis;
  flex-shrink: 0;
  max-width: ${props => props.maxWidth || '100%'};
  margin: ${props => props.margin || '0'};
`;

export const SubPanelTitle = styled.div`
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 21px;
  color: var(--_disabledTextColor);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-shrink: 0;
  max-width: 100%;
`;

export const PanelBarContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100%;
  .VMChart > div {
    width: 100%;
  }
`;
