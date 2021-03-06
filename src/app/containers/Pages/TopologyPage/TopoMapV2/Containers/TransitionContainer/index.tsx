import React from 'react';
import { Transition } from 'react-transition-group';
import { TransitionGContainer } from './styles';

interface Props {
  stateIn: boolean;
  origin?: string;
  transform?: string;
  id?: string;
  timing?: number;
  className?: string;
  children: React.ReactNode;
}
const TransitionContainer: React.FC<Props> = (props: Props) => {
  // if (!props.stateIn) return null;
  // return <g>{props.children}</g>;
  return (
    <Transition mountOnEnter unmountOnExit timeout={props.timing || 100} in={props.stateIn}>
      {state => (
        <TransitionGContainer id={props.id} origin={props.origin} transformStyle={props.transform} className={`${state} ${props.className}`}>
          {props.children}
        </TransitionGContainer>
      )}
    </Transition>
  );
};

export default React.memo(TransitionContainer);
