'use client';

import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { IPInstance } from '../sample-data';

interface IPInstanceTreeViewProps {
  rootInstance: IPInstance;
  onSelect?: (hierarchy: string) => void;
}

interface ModelTypeBadgeProps {
  modelType: string;
  isSystem: boolean;
  isComposite: boolean;
  isCustom: boolean;
}

function ModelTypeBadge({ modelType, isSystem, isComposite, isCustom }: ModelTypeBadgeProps) {
  let badgeClass = 'badge-neutral';

  if (isSystem) {
    badgeClass = 'badge-info';
  } else if (isComposite) {
    badgeClass = 'badge-success';
  } else if (isCustom) {
    badgeClass = 'badge-secondary';
  }

  return (
    <div className={`badge badge-xs ${badgeClass} ml-auto`}>
      {modelType}
    </div>
  );
}

function renderTreeItems(instance: IPInstance): React.ReactNode {
  return (
    <TreeItem
      key={instance.hierarchy}
      itemId={instance.hierarchy}
      label={
        <div className="flex items-center justify-between w-full py-1">
          <span className="text-sm font-medium">
            {instance.name}
          </span>
          <ModelTypeBadge
            modelType={instance.model.type}
            isSystem={instance.model.isSystem}
            isComposite={instance.model.isComposite}
            isCustom={instance.model.isCustom}
          />
        </div>
      }
      sx={{
        '& .MuiTreeItem-content': {
          backgroundColor: 'transparent',
          border: 'none',
          borderRadius: 0,
          padding: '4px 8px',
          '&:hover': {
            backgroundColor: 'rgba(94, 143, 222, 0.1)',
          },
          '&.Mui-selected': {
            backgroundColor: '#5E8FDE !important',
          },
          '&.Mui-selected:hover': {
            backgroundColor: '#5E8FDE !important',
          },
          '&.Mui-focused': {
            backgroundColor: 'transparent',
          },
        },
        '& .MuiTreeItem-iconContainer': {
          width: '24px',
          marginRight: '8px',
        },
        '& .MuiTreeItem-label': {
          color: 'white',
          fontFamily: 'Montserrat, sans-serif',
          fontSize: '14px',
          width: '100%',
        },
      }}
    >
      {instance.children.map((child) => renderTreeItems(child))}
    </TreeItem>
  );
}

export default function IPInstanceTreeView({ rootInstance, onSelect }: IPInstanceTreeViewProps) {
  return (
    <div className="w-full h-full bg-background">
      <div className="p-3 border-b border-bd">
        <h2 className="text-sm font-semibold flex items-center gap-2 text-txt">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-highlight" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          </svg>
          Instance Tree
        </h2>
      </div>
      <div className="p-2">
        <SimpleTreeView
          slots={{
            collapseIcon: ChevronDownIcon,
            expandIcon: ChevronRightIcon,
          }}
          onSelectedItemsChange={(event: React.SyntheticEvent, itemId: string | null) => {
            if (itemId && onSelect) {
              onSelect(itemId);
            }
          }}
          sx={{
            height: '100%',
            flexGrow: 1,
            maxWidth: '100%',
            overflowY: 'auto',
            color: '#D1D5DB',
            '& .MuiTreeItem-content': {
              borderRadius: '6px',
              margin: '2px 0',
              '&:hover': {
                backgroundColor: '#1A222D',
              },
              '&.Mui-selected': {
                backgroundColor: '#5E8FDE !important',
              },
              '&.Mui-selected:hover': {
                backgroundColor: '#5E8FDE !important',
              },
            },
            '& .MuiSvgIcon-root': {
              fontSize: '16px',
              color: '#D1D5DB',
            },
          }}
        >
          {renderTreeItems(rootInstance)}
        </SimpleTreeView>
      </div>
    </div>
  );
}