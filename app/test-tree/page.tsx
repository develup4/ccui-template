'use client';

import FullscreenLayout from '../(layouts)/fullscreen';
import IPInstanceFlowPanel from '../components/IPInstanceFlowPanel';
import { sampleIPInstanceHierarchy } from '../sample-data';

export default function TestTreePage() {
  return (
    <FullscreenLayout>
      <div className="flex-1 bg-background">
        <IPInstanceFlowPanel rootInstance={sampleIPInstanceHierarchy} />
      </div>
    </FullscreenLayout>
  );
}