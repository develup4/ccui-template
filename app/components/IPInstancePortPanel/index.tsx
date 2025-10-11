'use client';

import { useExplorer } from '../../contexts/ExplorerContext';
import PortInformation from './PortInformation';
import PortConfiguration from './PortConfiguration';
import AddressMapping from './AddressMapping';

export default function IPInstancePortPanel() {
    const { selectedPort } = useExplorer();

    if (!selectedPort) {
        return (
            <div className="w-full h-full p-4 flex items-center justify-center bg-background">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 opacity-50 text-txt">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h2 className="text-lg font-medium mb-2 text-txt">Port Properties Panel</h2>
                    <p className="text-txt/60 text-sm">Select a port to view and edit its properties</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full p-3 bg-background overflow-y-auto">
            <div className="space-y-3">
                <PortInformation />
                <PortConfiguration />
                <AddressMapping />
            </div>
        </div>
    );
}