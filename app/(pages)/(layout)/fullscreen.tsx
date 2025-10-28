"use client";

import { useState, useCallback, useEffect } from "react";
import IPInstanceTreeView from "../components/IPInstanceTreeView";
import IPInstancePropertyPanel from "../components/IPInstancePropertyPanel";
import IPInstancePortPanel from "../components/IPInstancePortPanel";
import IPInstanceBindingPanel from "../components/IPInstanceBindingPanel";
import Console from "../components/Console";
import { sampleIPInstanceHierarchy, IPInstance } from "../../../old/sample-data";
import { IPInstancePort, IPInstanceBinding } from "../../../prisma/ir-types";
import { ExplorerContext } from "../contexts/ExplorerContext";
import { logGuiAction } from "../lib/console/commandExecutor";

type SelectionType = "instance" | "port" | "edge";

export default function FullscreenLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [selectionType, setSelectionType] = useState<SelectionType>("instance");
  const [selectedNode, setSelectedNodeState] = useState<IPInstance | null>(
    null
  );
  const [selectedPort, setSelectedPortState] = useState<IPInstancePort | null>(
    null
  );
  const [selectedBinding, setSelectedBindingState] =
    useState<IPInstanceBinding | null>(null);
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const [consoleOpen, setConsoleOpen] = useState(false);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [portVisibility, setPortVisibility] = useState<Record<string, boolean>>(
    {}
  );

  // Helper function to find instance by hierarchy
  const findInstanceByHierarchy = (
    instance: IPInstance,
    hierarchy: string
  ): IPInstance | null => {
    if (instance.hierarchy === hierarchy) {
      return instance;
    }

    for (const child of instance.children) {
      const found = findInstanceByHierarchy(child, hierarchy);
      if (found) return found;
    }

    return null;
  };

  const handleNodeSelect = (hierarchy: string) => {
    const instance = findInstanceByHierarchy(
      sampleIPInstanceHierarchy,
      hierarchy
    );
    setSelectedNodeState(instance);
    setSelectionType("instance");

    // Log GUI action to console
    if (instance) {
      logGuiAction(`current_instance ${instance.hierarchy}`);
    }
  };

  // Wrapper functions that trigger server action after state update
  const setSelectedNode = useCallback((node: IPInstance | null) => {
    setSelectedNodeState(node);
    setUpdateTrigger((prev) => prev + 1);

    if (node) {
      // Log GUI action to console
      logGuiAction(`current_instance ${node.hierarchy}`);
      // TODO: Call server action to update IPInstance
      // await updateIPInstance(node);
    }
  }, []);

  const setSelectedPort = useCallback(
    (port: IPInstancePort | null) => {
      setSelectedPortState(port);
      setUpdateTrigger((prev) => prev + 1);

      if (port && selectedNode) {
        // TODO: Call server action to update IPInstance with port changes
        // await updateIPInstance(selectedNode);
      }
    },
    [selectedNode]
  );

  const setSelectedBinding = useCallback(
    (binding: IPInstanceBinding | null) => {
      setSelectedBindingState(binding);
      setUpdateTrigger((prev) => prev + 1);

      if (binding && selectedNode) {
        // TODO: Call server action to update IPInstance with binding changes
        // await updateIPInstance(selectedNode);
      }
    },
    [selectedNode]
  );

  const triggerUpdate = useCallback(() => {
    setUpdateTrigger((prev) => prev + 1);

    if (selectedNode) {
      // TODO: Call server action to update IPInstance
      // await updateIPInstance(selectedNode);
    }
  }, [selectedNode]);

  // These will be exposed globally so canvas can trigger port/binding selection
  if (typeof window !== "undefined") {
    (window as any).selectPort = (port: IPInstancePort) => {
      setSelectedPortState(port);
      setSelectionType("port");
    };
    (window as any).selectBinding = (binding: IPInstanceBinding) => {
      setSelectedBindingState(binding);
      setSelectionType("edge");
    };
  }

  // Sample data for testing - properties are optional, demonstrating toggle feature
  const samplePort: IPInstancePort = {
    instanceId: "top.cpu",
    portName: "axi_master",
    properties: {
      // Initially only size is set, others can be toggled on
      size: 4096,
      bypass_mapping: false,
    },
  };

  const sampleBinding: IPInstanceBinding = {
    from: "top.cpu.axi_master",
    to: "top.memory.axi_slave",
    properties: {
      // Initially empty, properties can be toggled on
    },
  };

  // Handle keyboard shortcut for console (Ctrl+`)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "`") {
        e.preventDefault();
        setConsoleOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <ExplorerContext.Provider
      value={{
        selectedNode,
        setSelectedNode,
        selectedPort,
        setSelectedPort,
        selectedBinding,
        setSelectedBinding,
        triggerUpdate,
      }}
    >
      <div className="w-full h-screen bg-background flex flex-col">
        <div className="w-full min-h-[8rem] bg-overlay"></div>
        <div className="flex-1 flex overflow-hidden">
          <div className="w-[28rem] bg-background border-r border-bd">
            <IPInstanceTreeView
              rootInstance={sampleIPInstanceHierarchy}
              onSelect={handleNodeSelect}
            />
          </div>
          {children}
          <div className="w-[28rem] bg-background border-l border-bd flex flex-col">
            {/* Tab Bar */}
            <div className="flex border-b border-bd bg-overlay">
              <button
                onClick={() => setSelectionType("instance")}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  selectionType === "instance"
                    ? "bg-background text-txt border-b-2 border-blue-500"
                    : "text-txt/60 hover:text-txt hover:bg-background/50"
                }`}
              >
                Instance
              </button>
              <button
                onClick={() => {
                  setSelectionType("port");
                  setSelectedPortState(samplePort);
                }}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  selectionType === "port"
                    ? "bg-background text-txt border-b-2 border-blue-500"
                    : "text-txt/60 hover:text-txt hover:bg-background/50"
                }`}
              >
                Port
              </button>
              <button
                onClick={() => {
                  setSelectionType("edge");
                  setSelectedBindingState(sampleBinding);
                }}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  selectionType === "edge"
                    ? "bg-background text-txt border-b-2 border-blue-500"
                    : "text-txt/60 hover:text-txt hover:bg-background/50"
                }`}
              >
                Edge
              </button>
            </div>

            {/* Panel Content */}
            <div className="flex-1 overflow-hidden">
              {selectionType === "instance" && <IPInstancePropertyPanel />}
              {selectionType === "port" && <IPInstancePortPanel />}
              {selectionType === "edge" && <IPInstanceBindingPanel />}
            </div>
          </div>
        </div>

        {/* Console */}
        <Console
          isOpen={consoleOpen}
          onToggle={() => setConsoleOpen(!consoleOpen)}
        />
      </div>
    </ExplorerContext.Provider>
  );
}
