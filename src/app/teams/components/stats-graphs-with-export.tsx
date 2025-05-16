"use client";

import { useEffect, useRef } from "react";
import { toPng } from "html-to-image";
import StatsGraphs from "./stats-graphs";
import type { StatsGraphsProps } from "../components/stats-graphs";

interface StatsGraphsWithExportProps {
  stats: StatsGraphsProps["stats"];
  onCapture: (img: string) => void;
}

export default function StatsGraphsWithExport({
  stats,
  onCapture,
}: StatsGraphsWithExportProps) {
  const graphRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!graphRef.current) return;

    const capture = async () => {
      const dataUrl = await toPng(graphRef.current!, {
        backgroundColor: "#111827",
      });
      onCapture(dataUrl);
    };

    const timeout = setTimeout(() => {
      capture();
    }, 500);

    return () => clearTimeout(timeout);
  }, [stats]);

  return (
    <div ref={graphRef}>
      <StatsGraphs stats={stats} />
    </div>
  );
}
