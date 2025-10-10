'use client';

import { useSelection } from '../../contexts/SelectionContext';

export default function PortInformation() {
    const { selectedPort } = useSelection();

    if (!selectedPort) {
        return null;
    }

    return (
        <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border border-bd rounded-xl p-4 shadow-md">
            <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
                <h1 className="text-lg font-bold text-txt">Port Properties</h1>
            </div>
            <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                    <span className="text-txt/60 font-medium">Instance:</span>
                    <span className="text-txt font-mono">{selectedPort.instanceId}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-txt/60 font-medium">Port:</span>
                    <span className="text-txt font-mono font-semibold">{selectedPort.portName}</span>
                </div>
            </div>
        </div>
    );
}
