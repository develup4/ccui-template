
import { IPInstanceBinding } from './types';

interface BindingInformationProps {
  selectedBinding: IPInstanceBinding;
}

export default function BindingInformation({ selectedBinding }: BindingInformationProps) {
  return (
    <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border border-bd rounded-xl p-4 shadow-md">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </div>
        <h1 className="text-lg font-bold text-txt">Binding Properties</h1>
      </div>
      <div className="space-y-1 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-txt/60 font-medium">From:</span>
          <span className="text-txt font-mono">{selectedBinding.from}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-txt/60 font-medium">To:</span>
          <span className="text-txt font-mono">{selectedBinding.to}</span>
        </div>
      </div>
    </div>
  );
}
