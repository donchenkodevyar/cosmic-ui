import React from 'react';
import { NODES_CONSTANTS } from 'app/containers/Pages/TopologyPage/TopoMapV2/model';
import { ITopoAppNode } from 'lib/hooks/Topology/models';
import TransitionContainer from '../../../TransitionContainer';
import NodeMarker from '../../Containers/NodeMarker';
import NodeExpandedName from '../../Containers/NodeName/NodeExpandedName';
import { ExtraSpaceBreeze } from './icons/ExtraSpaceBreeze';
import { MsTeams } from './icons/MsTeams';
import { Microsoft } from './icons/Microsoft';
import { Google } from './icons/Google';
import { CiscoMeraki } from './icons/CiscoMeraki';
import { Salesforce } from './icons/Salesforce';
import { Workday } from './icons/Workday';
import { RingCentral } from './icons/Ringcentral';
import { Smartsheet } from './icons/Smatsheet';
import { Pactsafe } from './icons/Pactsafe';
import { Noke } from './icons/Noke';

interface Props {
  dragId: string;
  application: ITopoAppNode;
  show: boolean;
}

const ApplicationCollapsedNode: React.FC<Props> = (props: Props) => {
  return (
    <TransitionContainer id={`expandNodeWrapper${props.application.dataItem.id}`} stateIn={props.show} origin="unset" transform="none">
      <g style={{ cursor: 'pointer' }}>
        <rect
          id={props.dragId}
          fill={NODES_CONSTANTS.SITES.expanded.bgColor}
          width={props.application.width}
          height={props.application.height}
          rx={NODES_CONSTANTS.SITES.expanded.borderRadius}
          ry={NODES_CONSTANTS.SITES.expanded.borderRadius}
          pointerEvents="all"
        />
        <g transform="translate(0, 0)">
          <NodeMarker iconId={NODES_CONSTANTS.APPLICATION.iconId} fill={'#05143A'} stylesObj={NODES_CONSTANTS.SITES.expanded.marker} />
          <NodeExpandedName
            name={props.application.dataItem.name}
            nodeWidth={props.application.width}
            markerWidth={NODES_CONSTANTS.SITES.expanded.marker.width}
            height={NODES_CONSTANTS.SITES.expanded.marker.height}
            stylesObj={NODES_CONSTANTS.SITES.labelExpandedStyles}
          />
        </g>
        {props.application.dataItem.name.toLowerCase() === 'extraspace breeze' && <ExtraSpaceBreeze />}
        {props.application.dataItem.name.toLowerCase() === 'microsoft teams' && <MsTeams />}
        {props.application.dataItem.name.toLowerCase() === 'microsoft.com' && <Microsoft />}
        {props.application.dataItem.name.toLowerCase() === 'google' && <Google />}
        {props.application.dataItem.name.toLowerCase() === 'meraki https' && <CiscoMeraki />}
        {props.application.dataItem.name.toLowerCase() === 'salesforce.com' && <Salesforce />}
        {props.application.dataItem.name.toLowerCase() === 'workday' && <Workday />}
        {props.application.dataItem.name.toLowerCase() === 'ringcentral' && <RingCentral />}
        {props.application.dataItem.name.toLowerCase() === 'smartsheet.com' && <Smartsheet />}
        {props.application.dataItem.name.toLowerCase() === 'pactsafe' && <Pactsafe />}
        {props.application.dataItem.name.toLowerCase() === 'noke' && <Noke />}
      </g>
    </TransitionContainer>
  );
};

export default React.memo(ApplicationCollapsedNode);
