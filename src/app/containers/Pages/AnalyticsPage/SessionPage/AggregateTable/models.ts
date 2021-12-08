import { ISession } from 'lib/api/ApiModels/Sessions/apiModel';

export interface IState {
  icon: any;
  label: string;
}

export interface IGroupedData {
  [key: string]: ISession[];
}

export interface IAggregateRow extends ISession {
  data: IGroupedData;
  vendors: IState[];
}