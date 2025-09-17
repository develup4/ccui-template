'use client';

import FullscreenLayout from '../(layouts)/fullscreen';

export default function TestTreePage() {
  return (
    <FullscreenLayout>
      <div className="flex-1 flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">TreeView Test Page</h1>
          <p className="text-gray-300">Check the left panel for the IPInstance TreeView</p>
        </div>
      </div>
    </FullscreenLayout>
  );
}