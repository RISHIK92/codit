"use client";

import { useEffect, useRef } from "react";
import { spawnShell } from "../utils/wcUtils";

interface XTermPanelProps {
  visible: boolean;
  wcRef: React.RefObject<import("@webcontainer/api").WebContainer | null>;
}

export function XTermPanel({ visible, wcRef }: XTermPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<import("@xterm/xterm").Terminal | null>(null);
  const fitRef = useRef<import("@xterm/addon-fit").FitAddon | null>(null);

  useEffect(() => {
    let shellProcess: import("@webcontainer/api").WebContainerProcess | null = null;
    let pollInterval: ReturnType<typeof setInterval> | null = null;

    Promise.all([
      import("@xterm/xterm"),
      import("@xterm/addon-fit"),
      import("@xterm/addon-web-links"),
    ]).then(async ([{ Terminal }, { FitAddon }, { WebLinksAddon }]) => {
      if (!containerRef.current || termRef.current) return;

      const term = new Terminal({
        theme: {
          background: "#0d0d0d",
          foreground: "#c8d3f5",
          cursor: "#7fffd4",
          cursorAccent: "#0d0d0d",
          black: "#1b1d2b",
          red: "#ff757f",
          green: "#7fffd4",
          yellow: "#ffc777",
          blue: "#82aaff",
          magenta: "#c099ff",
          cyan: "#86e1fc",
          white: "#c8d3f5",
          brightBlack: "#444a73",
          brightRed: "#ff757f",
          brightGreen: "#7fffd4",
          brightYellow: "#ffc777",
          brightBlue: "#82aaff",
          brightMagenta: "#c099ff",
          brightCyan: "#86e1fc",
          brightWhite: "#c8d3f5",
          selectionBackground: "#2d3f76",
        },
        fontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace",
        fontSize: 12,
        lineHeight: 1.4,
        cursorBlink: true,
        cursorStyle: "bar",
        allowTransparency: true,
        scrollback: 1000,
      });

      const fitAddon = new FitAddon();
      term.loadAddon(fitAddon);
      term.loadAddon(new WebLinksAddon());
      term.open(containerRef.current);
      fitAddon.fit();

      termRef.current = term;
      fitRef.current = fitAddon;

      const resizeObserver = new ResizeObserver(() => fitAddon.fit());
      resizeObserver.observe(containerRef.current);

      if (wcRef.current) {
        shellProcess = await spawnShell(term, fitAddon, wcRef.current);
      } else {
        term.writeln("\x1b[2mWaiting for WebContainer to boot…\x1b[0m");
        pollInterval = setInterval(async () => {
          if (wcRef.current) {
            if (pollInterval) clearInterval(pollInterval);
            term.reset();
            shellProcess = await spawnShell(term, fitAddon, wcRef.current);
          }
        }, 300);
      }
    });

    const handleResize = () => fitRef.current?.fit();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (pollInterval) clearInterval(pollInterval);
      termRef.current?.dispose();
      termRef.current = null;
      fitRef.current = null;
      shellProcess?.kill();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (visible) setTimeout(() => fitRef.current?.fit(), 50);
  }, [visible]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-[#0d0d0d] overflow-hidden"
      style={{ padding: "4px 8px" }}
    />
  );
}
