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
  let bgColor = 'bg-gray-500';
  
  if (isSystem) {
    bgColor = 'bg-blue-500';
  } else if (isComposite) {
    bgColor = 'bg-green-500';
  } else if (isCustom) {
    bgColor = 'bg-purple-500';
  }

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium text-white ${bgColor} ml-auto`}>
      {modelType}
    </span>
  );
}

function renderTreeItems(instance: IPInstance): React.ReactNode {
  return (
    <TreeItem
      key={instance.hierarchy}
      itemId={instance.hierarchy}
      label={
        <div className="flex items-center justify-between w-full py-1">
          <span className="font-montserrat text-white">
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
    <div className="w-full h-full font-montserrat" style={{ backgroundColor: '#060B15' }}>
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
          backgroundColor: '#060B15',
          color: 'white',
          '& .MuiTreeView-root': {
            backgroundColor: '#060B15',
          },
          '& .MuiTreeItem-root': {
            color: 'white',
          },
          '& .MuiSvgIcon-root': {
            color: 'white',
            fontSize: '18px',
          },
        }}
      >
        {renderTreeItems(rootInstance)}
      </SimpleTreeView>
    </div>
  );
}