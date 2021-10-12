import styled from 'styled-components';

export const ActionRow = styled.div`
  display: flex;
  padding: 30px 20px;
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  min-height: calc(100% - 100px);
  align-items: flex-start;
  justify-content: flex-start;
  align-content: flex-start;
  padding: 0 20px;
`;

export const ModalHeader = styled.div`
  width: 100%;
  height: 48px;
  flex-shrink: 0;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 0 20px 0;
`;

export const ModalContent = styled.div`
  width: 100%;
  height: calc(100% - 138px);
  flex-shrink: 0;
`;

export const ModalOverflowContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 30px;
  box-sizing: content-box;
`;

export const ModalFooter = styled.div`
  flex-shrink: 0;
  padding: 10px 0 0 0;
`;
