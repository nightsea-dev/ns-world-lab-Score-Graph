import React, { useEffect, useState } from "react";
import {
  _cb, _use_state
} from "@ns-sg/types";
import { ScoreGraphView } from "./features";


export const App = () => {



  return (
    <div>
      <ScoreGraphView
        title="Knowledge Graph"
        data="PR, press release, newsroom, analytics, SEO, distribution"
        subject="topics"
      />
    </div>

  );
}
