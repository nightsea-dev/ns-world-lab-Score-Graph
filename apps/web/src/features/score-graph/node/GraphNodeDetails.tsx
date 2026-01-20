import React from "react";
import { HasData, GraphNodeWithDetails, HasTitle, HasDisabled } from "@ns-sg/types";


export type GraphNodeDetailsProps =
  & Partial<
    & HasData<GraphNodeWithDetails>
    & HasTitle
    & HasDisabled
  >

/**
 * @depredated
 */
export const GraphNodeDetails = ({
  data
  , title = "Node details"
  , data: {
    node
    , outgoingEdges = []
  } = {} as GraphNodeWithDetails
}: GraphNodeDetailsProps
) => {
  // if (!data) {
  //   return (
  //     <div
  //       data-node-details-header
  //       style={{ padding: 12, border: "1px solid #ddd", borderRadius: 8 }}>
  //       <div style={{ fontWeight: 600 }}>{title}</div>
  //       <div style={{ marginTop: 8, color: "#555" }}>Click a node to see related topics.</div>
  //     </div>
  //   );
  // }
  return (
    <div
      data-graph-node-details
      className="inline-flex items-center gap-3 px-3 py-2 border border-gray-300 rounded-md"
    >
      <div
        data-node-details-header
        style={{ padding: 12, border: "1px solid #ddd", borderRadius: 8 }}>
        <div style={{ fontWeight: 600 }}>{title}</div>
        <div style={{ marginTop: 8, color: "#555" }}>Click a node to see related topics.</div>
      </div>
      {data && (<div
        data-node-details-content
      >
        <div className="font-semibold whitespace-nowrap">
          {data.node.label}
        </div>

        <div className="flex items-center gap-2 whitespace-nowrap">
          <span className="font-semibold text-sm text-gray-700">
            Related:
          </span>

          {data.outgoingEdges.length === 0 ? (
            <span className="text-sm text-gray-500">
              none
            </span>
          ) : (
            <ul className="flex items-center gap-2 list-none m-0 p-0">
              {data.outgoingEdges.map(({ id, label, edge_score }) => (
                <li
                  key={id}
                  className="flex items-center gap-1 px-2 py-0.5 text-sm border border-gray-200 rounded whitespace-nowrap"
                >
                  <span>{label}</span>
                  <span className="text-gray-500">
                    {edge_score.toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>)}
    </div>


  );
}


// ======================================== w/rsuite
import { Panel, List, Divider } from "rsuite";

export const GraphNodeDetailsPanel = ({
  data: nodeData
  , title = "Node Details"
  , disabled
  , ...rest
}: GraphNodeDetailsProps
) => (
  <Panel
    {...rest}
    className={`
      ${disabled ? "opacity-[.2]" : ""}
      `}
    bordered
    data-graph-node-details
    header={
      <div style={{ fontWeight: 600 }}>
        {title}
        {/* {nodeData?.node.label} */}
      </div>
    }
  >
    {!nodeData ? "---"//"/-- NO DATA --/"
      : (
        <div
          data-node-details-content-container
        >
          <div 
          className="text-2xl font-bold"
          // style={{ fontWeight: 600 }}
          >
            {nodeData?.node.label}
          </div>

          <Divider />

          <div style={{ fontWeight: 600, marginBottom: 6 }}>
            Related topics
          </div>

          {nodeData?.outgoingEdges.length === 0 ? (
            <div style={{ color: "#777" }}>
              No related topics above threshold.
            </div>
          ) : (
            <List size="sm" bordered={false}>
              {nodeData?.outgoingEdges.map(
                ({ id, label, edge_score }) => (
                  <List.Item key={id}>
                    <span>{label}</span>
                    <span style={{ float: "right", opacity: 0.7 }}>
                      {edge_score.toFixed(2)}
                    </span>
                  </List.Item>
                )
              )}
            </List>
          )}
        </div>)}
  </Panel>
);
