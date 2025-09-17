'use client';

interface PropertyInputProps {
  propertyKey: string;
  propertyData: any;
  currentValue: any;
  isModified: boolean;
  isRanged: boolean;
  onValueChange: (value: any) => void;
  onRangedChange: (ranged: boolean) => void;
}

export default function PropertyInput({
  propertyKey,
  propertyData,
  currentValue,
  isModified,
  isRanged,
  onValueChange,
  onRangedChange
}: PropertyInputProps) {
  const renderConstraintTooltip = () => {
    const { constraint } = propertyData;
    if (constraint.type === 'None') return null;

    let tooltipText = '';
    if (constraint.type === 'range') {
      tooltipText = `Range: ${constraint.value.from} - ${constraint.value.to}`;
    } else if (constraint.type === 'list') {
      tooltipText = `Options: ${constraint.value.join(', ')}`;
    }

    return (
      <div className="tooltip tooltip-left" data-tip={tooltipText}>
        <span className="text-warning cursor-help text-xs">ⓘ</span>
      </div>
    );
  };

  const renderInput = () => {
    const { type, constraint } = propertyData;
    const baseClassName = `px-3 py-2 text-sm w-full border rounded focus:outline-none focus:ring-2 ${
      isModified
        ? 'bg-orange-900/20 border-orange-600/50 text-orange-200 focus:ring-orange-500'
        : 'bg-background border-bd text-txt focus:ring-highlight'
    }`;

    switch (type) {
      case 'String':
        return (
          <input
            type="text"
            value={currentValue || ''}
            onChange={(e) => onValueChange(e.target.value)}
            className={baseClassName}
            placeholder="Enter string value"
          />
        );

      case 'Number':
        const numProps: any = { type: 'number' };
        if (constraint.type === 'range') {
          numProps.min = constraint.value.from;
          numProps.max = constraint.value.to;
        }
        return (
          <input
            {...numProps}
            value={currentValue || 0}
            onChange={(e) => onValueChange(Number(e.target.value))}
            className={baseClassName}
            placeholder="Enter number"
          />
        );

      case 'String Select':
      case 'Number Select':
        const options = constraint.type === 'list' ? constraint.value : [];
        return (
          <select
            value={currentValue || ''}
            onChange={(e) => onValueChange(e.target.value)}
            className={baseClassName}
          >
            {options.map((option: any) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'Boolean':
        return (
          <select
            value={currentValue ? 'true' : 'false'}
            onChange={(e) => onValueChange(e.target.value === 'true')}
            className={baseClassName}
          >
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        );

      case 'Address':
        const addressValue = currentValue || '0x00000000';
        const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          let value = e.target.value;
          if (!value.startsWith('0x')) {
            value = '0x' + value;
          }
          if (constraint.type === 'range') {
            const numValue = parseInt(value, 16);
            const minValue = parseInt(constraint.value.from.toString(), 16);
            const maxValue = parseInt(constraint.value.to.toString(), 16);
            if (numValue >= minValue && numValue <= maxValue) {
              onValueChange(value);
            }
          } else {
            onValueChange(value);
          }
        };

        return (
          <div className="flex w-full">
            <span className="px-3 py-2 bg-gray-overlay border border-r-0 border-bd rounded-l text-xs text-txt flex items-center">
              0x
            </span>
            <input
              type="text"
              value={addressValue.replace('0x', '')}
              onChange={handleAddressChange}
              maxLength={8}
              className={`flex-1 px-3 py-2 text-sm border rounded-r focus:outline-none focus:ring-2 ${
                isModified
                  ? 'bg-orange-900/20 border-orange-600/50 text-orange-200 focus:ring-orange-500'
                  : 'bg-background border-bd text-txt focus:ring-highlight'
              }`}
              placeholder="00000000"
            />
          </div>
        );

      case 'Complex':
        return (
          <textarea
            value={typeof currentValue === 'object' ? JSON.stringify(currentValue, null, 2) : currentValue || '{}'}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                onValueChange(parsed);
              } catch {
                onValueChange(e.target.value);
              }
            }}
            rows={3}
            className={`px-3 py-2 text-sm w-full border rounded focus:outline-none focus:ring-2 ${
              isModified
                ? 'bg-orange-900/20 border-orange-600/50 text-orange-200 focus:ring-orange-500'
                : 'bg-background border-bd text-txt focus:ring-highlight'
            }`}
            placeholder="Enter JSON object"
          />
        );

      default:
        return (
          <input
            type="text"
            value={currentValue || ''}
            onChange={(e) => onValueChange(e.target.value)}
            className={baseClassName}
          />
        );
    }
  };

  return (
    <div className="bg-overlay border border-bd rounded-lg shadow-sm">
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-medium text-txt">{propertyKey}</h4>
            {renderConstraintTooltip()}
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-xs text-txt">Ranged</span>
            <input
              type="checkbox"
              checked={isRanged}
              onChange={(e) => onRangedChange(e.target.checked)}
              className="w-3 h-3 text-highlight bg-background border-bd rounded focus:ring-highlight focus:ring-1"
            />
          </label>
        </div>

        {propertyData.description && (
          <p className="text-xs text-txt/70 mb-2">{propertyData.description}</p>
        )}

        {renderInput()}

        {isModified && (
          <div className="flex items-center gap-2 p-2 mt-2 bg-orange-900/20 border border-orange-600/30 rounded">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.314 19c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span className="text-xs text-orange-400">Default: {JSON.stringify(propertyData.defaultValue)}</span>
          </div>
        )}

        <div className="flex gap-2 mt-2">
          <div className={`px-2 py-1 text-xs rounded ${
            propertyData.tag === 'sim'
              ? 'bg-green-600 text-white'
              : 'bg-yellow-600 text-white'
          }`}>
            {propertyData.tag.toUpperCase()}
          </div>
          <div className="px-2 py-1 text-xs bg-background border border-bd rounded text-txt">
            {propertyData.type}
          </div>
        </div>
      </div>
    </div>
  );
}