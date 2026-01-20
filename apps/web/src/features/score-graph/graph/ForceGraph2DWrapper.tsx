import {
  _cb, _effect, _memo, GraphData_UI, GraphNode, HasSelected

} from "@ns-sg/types";
import React, {
  ComponentProps, useEffect
  , useMemo, useRef, useState
} from "react";
import ForceGraph2D, { ForceGraphMethods } from "react-force-graph-2d";
import { GraphDetails } from "./GraphDetails";
import { ForceGraph2DWrapperProps } from "./ForceGraph2DWrapper.types";


// ======================================== types - internal
type ForceGraph2D_Props
  = ComponentProps<typeof ForceGraph2D>

type ForceGraph2D_GraphData
  = NonNullable<ForceGraph2D_Props["graphData"]>

type ForceGraph2D_GraphData_Node
  = ForceGraph2D_GraphData["nodes"][number]

type ForceGraph2D_GraphData_Link
  = ForceGraph2D_GraphData["links"][number]



// ======================================== helpers

const measureLabel = (ctx: CanvasRenderingContext2D, label: string, fontSize: number) => {
  ctx.font = `${fontSize}px Sans-Serif`
  const textWidth = ctx.measureText(label).width
  return { textWidth };
}

  , _fromUiDataToForceData = ({
    nodes: nodes_IN = []
    , edges: edges_IN = []
  } = {} as GraphData_UI
  ) => {

    return {
      nodes: nodes_IN.map(o => ({ ...o } as ForceGraph2D_GraphData_Node))
      , links: edges_IN.map(o => ({
        id: o.id
        , source: o.source_id
        , target: o.target_id
      } as ForceGraph2D_GraphData_Link))
    } as ForceGraph2D_GraphData

  }




// ======================================== component

export const ForceGraph2DWrapper = ({
  data: graphData
  , selected_NodeId
  , withGrid = false
  , onSelect
}: ForceGraph2DWrapperProps
) => {
  const fgRef = useRef<ForceGraphMethods>()
    , containerRef = useRef<HTMLDivElement>(null)
    , [size, setSize] = useState({ w: 800, h: 520 })
    , {
      forceData
    } = _memo([graphData], () => {

      const forceData = _fromUiDataToForceData(graphData)
      return {
        forceData
      }
    })

    , {
      selectedNode
    } = _memo([
      selected_NodeId
      , forceData
    ], () => {
      const {
        nodes = []
      } = forceData
      return {
        selectedNode: nodes.find(o => o.id === selected_NodeId)
      }

    })
    , _handle_NodeClick = (
      {
        id
      }: { id?: string | number }
    ) => {
      const {
        nodes = []
      } = forceData
        , selectedNode = nodes.find(o => o.id === selected_NodeId)
      onSelect?.({
        selected_NodeId: String(id)
        , __eventKind: "select"
      })

    }

  useEffect(() => {
    if (!containerRef.current) {
      return
    }

    const ro = new ResizeObserver(([entry]) => {
      const w = Math.max(0, Math.floor(entry.contentRect.width));
      const h = Math.max(0, Math.floor(entry.contentRect.height));
      if (!w || !h) return;
      setSize({ w, h });
    });

    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const drawGrid = _cb([withGrid, size]
    , (ctx: CanvasRenderingContext2D, globalScale: number) => {
      if (!withGrid) {
        return
      }

      const base = 60
        , step = Math.max(20, Math.round(base / globalScale))

      ctx.save()
      ctx.strokeStyle = "rgba(148, 163, 184, 0.25)"
      ctx.lineWidth = 1

      const { w, h } = size

      // v-lines
      for (let x = 0; x <= w; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }

      // h-lines
      for (let y = 0; y <= h; y += step) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(w, y)
        ctx.stroke()
      }

      ctx.restore()
    }
  )

  // _effect([[selected_NodeId]], () => {
  //   ; (fgRef.current as { refresh?: () => void })?.refresh?.()
  //   // optional: reheat a bit so it visibly updates even when cooled down
  //   fgRef.current?.d3ReheatSimulation?.()
  // })



  return (
    <div
      data-force-graph-view
      ref={containerRef}
      className="relative h-[calc(100vh-180px)] min-h-[520px] w-full overflow-hidden rounded-lg border border-slate-200 bg-white"
    >
      <div
        data-force-graph-view-header
      >
        <GraphDetails
          data={graphData}
          selected_GraphNode={selectedNode as GraphNode}
        />
      </div>
      <ForceGraph2D
        data-force-graph-2D
        ref={fgRef as any}
        width={size.w}
        height={size.h}
        graphData={forceData}
        nodeLabel={(n: any) => n.label}
        linkLabel={(l: any) => `score: ${Number(l.score).toFixed(2)}`}
        linkWidth={(l: any) => Math.max(1, l.score * 6)}
        onNodeClick={_handle_NodeClick}
        onRenderFramePre={drawGrid}
        nodeCanvasObject={(node: any, ctx, globalScale) => {

          const isActive = (node.id === selected_NodeId)
            , label = node.label
            , fontSize = 12 / globalScale

          // ctx.font = `${fontSize}px Sans-Serif`;
          // const textWidth = ctx.measureText(label).width
          //   , bckgDimensions = [textWidth + fontSize, fontSize + fontSize * 0.6]

          const paddingX = 10 / globalScale
            , paddingY = 5 / globalScale
          ctx.font = `${fontSize}px Sans-Serif`

          const textWidth = ctx.measureText(label).width
            , width = textWidth + paddingX * 2
            , height = fontSize + paddingY * 2



          ctx.fillStyle = isActive ? "#0f172a" : "#111827"
          ctx.fillRect(
            // node.x - bckgDimensions[0] / 2,
            // node.y - bckgDimensions[1] / 2,
            // bckgDimensions[0],
            // bckgDimensions[1]
            node.x - width / 2
            , node.y - height / 2
            , width
            , height
          )

          ctx.textAlign = "center"
          ctx.textBaseline = "middle"
          ctx.fillStyle = "#fff"
          ctx.fillText(label, node.x, node.y)
        }}

        nodePointerAreaPaint={(node: any, color, ctx, globalScale) => {
          const label = node.label
            , fontSize = 12 / globalScale

            , paddingX = 10 / globalScale
            , paddingY = 5 / globalScale

          ctx.font = `${fontSize}px Sans-Serif`

          const textWidth = ctx.measureText(label).width

            , width = textWidth + paddingX * 2
            , height = fontSize + paddingY * 2

          ctx.fillStyle = color
          ctx.fillRect(
            node.x - width / 2,
            node.y - height / 2,
            width,
            height
          )
        }}
      />
    </div>
  );
}
