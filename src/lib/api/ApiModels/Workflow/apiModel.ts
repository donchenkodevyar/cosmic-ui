import { IBaseEntity } from 'lib/models/general';
import { IBasePages, IBaseTotalCount } from '../generalApiModel';

export enum ModelalertType {
  UNKNOWN_TYPE = 'UNKNOWN_TYPE', // default
  ANOMALY_LATENCY = 'ANOMALY_LATENCY',
  ANOMALY_PACKETLOSS = 'ANOMALY_PACKETLOSS',
  ANOMALY_GOODPUT = 'ANOMALY_GOODPUT',
  ANOMALY_CATEGORY = 'ANOMALY_CATEGORY',
}

export enum AlertCategory {
  UNKNOWN_CATEGORY = 'UNKNOWN_CATEGORY', // default
  EXPERIENCE = 'EXPERIENCE',
  POLICY = 'POLICY',
  COST = 'COST',
}
export enum AlertSeverity {
  UNKNOWN_SEVERITY = 'UNKNOWN_SEVERITY', // default
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  INFO = 'INFO',
}

export enum AlertConfigState {
  UNKNOWN_CONFIGSTATE = 'UNKNOWN_CONFIGSTATE', // default
  ON = 'ON',
  OFF = 'OFF',
}

export enum AlertChannelType {
  EMAIL = 'EMAIL', // default
  WEBHOOK = 'WEBHOOK',
}

export enum AlertWebhookType {
  UNKNOWN_WEBHOOK = 'UNKNOWN_WEBHOOK', // default
  SLACK = 'SLACK',
}

export enum AlertVerificationStatusTypes {
  UNKNOWN_STATUS = 'UNKNOWN_STATUS', // "default": "UNKNOWN_STATUS"
  NotStarted = 'NotStarted',
  TemporaryFailure = 'TemporaryFailure',
  Success = 'Success',
  Failed = 'Failed',
  Pending = 'Pending',
}

export interface IAlertMeta extends IBaseEntity<string> {
  name: string;
  type: ModelalertType;
  category: AlertCategory;
  severity: AlertSeverity;
  configState: AlertConfigState;
  metaDescString: string;
  channelIds: string[];
  triggerCount: number;
}
export interface IAlertMetaDataRes extends IBaseTotalCount, IBasePages {
  alertMetadata: IAlertMeta[];
  channels: IAlertChannel[];
}

export interface IAlertEmailChannel {
  receiverEmailIds: string[];
  emailSubjectPrefix: string;
}

export interface IAlertWebhookChannel {
  webhookUrl: string;
  webhookType: AlertWebhookType;
}

export interface IEmailStatuses {
  additionalProperties: AlertVerificationStatusTypes;
}
export interface IAlertEmailChannelVerificationStatus {
  emailStatuses: IEmailStatuses;
}

export interface IAlertVerificationStatus {
  emailChannelStatus: IAlertEmailChannelVerificationStatus;
}
export interface IAlertChannel extends IBaseEntity<string> {
  name: string;
  channelType: AlertChannelType;
  emailPolicy?: IAlertEmailChannel;
  webhookPolicy?: IAlertWebhookChannel;
  isDefault: boolean;
  alertMetaIds: string[];
  verificationStatus: IAlertVerificationStatus;
}
export interface IAlertChannelRes extends IBaseTotalCount, IBasePages {
  channels: IAlertChannel[];
}

export const createChannel = (type: AlertChannelType): IAlertChannel => {
  const _obj: IAlertChannel = {
    id: '',
    name: '',
    isDefault: false,
    channelType: type,
    alertMetaIds: [],
    verificationStatus: {
      emailChannelStatus: {
        emailStatuses: {
          additionalProperties: AlertVerificationStatusTypes.UNKNOWN_STATUS,
        },
      },
    },
  };
  if (type === AlertChannelType.EMAIL) {
    _obj.emailPolicy = {
      receiverEmailIds: [],
      emailSubjectPrefix: '',
    };
  }
  if (type === AlertChannelType.WEBHOOK) {
    _obj.webhookPolicy = {
      webhookUrl: '',
      webhookType: AlertWebhookType.SLACK,
    };
  }
  return _obj;
};
