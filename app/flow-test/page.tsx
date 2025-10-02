'use client';

import IPInstanceFlowPanel from '../components/IPInstanceFlowPanel';
import { sampleIPInstanceHierarchy } from '../sample-data';

export default function FlowTestPage() {
  return (
    <div className="w-full h-screen bg-background">
      <IPInstanceFlowPanel rootInstance={sampleIPInstanceHierarchy} />
    </div>
  );
}