/**
 * ForceGraph2DWrapper.types
 * * PORTABLE TYPES
 */
import {
  _cb
  ,EventWKindMapInfo,GraphData_UI, GraphNode, HasData
  , HasSelected
  , KeyOf
} from "@ns-sg/types";




// ======================================== events
type _EV_INFO = EventWKindMapInfo<{
  select: HasSelected<GraphNode["id"], "_NodeId">
}>
type EvKind = _EV_INFO["EventKind"]
export type ForceGraph2DWrapperEvent
  = _EV_INFO["Events"]

export type ForceGraph2DWrapperEventKind
  = EvKind

export type ForceGraph2DWrapperEventOf<
  K extends EvKind
> = _EV_INFO["Events"][K]

//   = EventTypeFromMap<EvMap>
// export type ForceGraph2DWrapperEventHandler = HasEventHandlerFromMap<EvMap>



// ======================================== props
export type ForceGraph2DWrapperPropsData =
  & HasData<GraphData_UI>
  & Pick<_EV_INFO["_sourceEventsMap"]["select"], "selected_NodeId">


export type ForceGraph2DWrapperProps =
  & Partial<
    & ForceGraph2DWrapperPropsData
    & _EV_INFO["Handlers"]
    & {
      withGrid: boolean
    }
  >

// ========================================
