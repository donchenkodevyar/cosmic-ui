import React from 'react';
import { ITopoNode, TopoNodeTypes } from 'lib/hooks/Topology/models';
import RegionNode from './RegionNode/RegionNode';
import AccountNode from './AccountNode/AccountNode';
import DataCenter from './DataCenter';
import SitesNode from './SitesNode/SitesNode';
import AccountNodeTopContainer from './AccountNode/AccountNodeTopContainer';
import RegionNodeTopContainer from './RegionNode/RegionNodeTopContainer';
import SitesNodeTopContainer from './SitesNode/SitesNodeTopContainer';

interface Props {
  isTopLayer?: boolean;
  nodes: ITopoNode<any, any>[];
}

const NodesWrapper: React.FC<Props> = (props: Props) => {
  if (!props.nodes || !props.nodes.length) return null;
  return (
    <>
      {props.nodes.map(it => {
        if (it.type === TopoNodeTypes.ACCOUNT) {
          if (props.isTopLayer) {
            return <AccountNodeTopContainer key={`nodeWrapperTopLayer${it.uiId}`} dataItem={it} />;
          }
          return <AccountNode key={`nodeWrapper${it.uiId}`} dataItem={it} />;
        }

        if (it.type === TopoNodeTypes.REGION) {
          if (props.isTopLayer) {
            return <RegionNodeTopContainer key={`nodeWrapperTopLayer${it.uiId}`} dataItem={it} />;
          }
          return <RegionNode key={`nodeWrapper${it.uiId}`} dataItem={it} />;
        }

        if (it.type === TopoNodeTypes.DATA_CENTER) {
          return <DataCenter key={`nodeWrapper${it.uiId}`} dataItem={it} />;
        }

        if (it.type === TopoNodeTypes.SITES) {
          if (props.isTopLayer) {
            return <SitesNodeTopContainer key={`nodeWrapperTopLayer${it.uiId}`} dataItem={it} />;
          }
          return <SitesNode key={`nodeWrapper${it.uiId}`} dataItem={it} />;
        }
        return null;
      })}
    </>
  );
};

export default React.memo(NodesWrapper);
