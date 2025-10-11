'use client';

import RegisterMapPanel from './RegisterMapPanel';
import SettingItem from './SettingItem';

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
  const renderInput = () => {
    const { type, constraint } = propertyData;
    const baseClassName = `px-3 py-2 text-sm w-full border rounded focus:outline-none focus:ring-2 bg-background border-bd text-txt focus:ring-blue-500`;

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
            <span className="px-3 py-2 bg-overlay border border-r-0 border-bd rounded-l text-xs text-txt flex items-center">
              0x
            </span>
            <input
              type="text"
              value={addressValue.replace('0x', '')}
              onChange={handleAddressChange}
              maxLength={8}
              className="flex-1 px-3 py-2 text-sm border rounded-r focus:outline-none focus:ring-2 bg-background border-bd text-txt focus:ring-blue-500"
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
            className={baseClassName}
            placeholder="Enter JSON object"
          />
        );

      case 'RegisterMap':
        return (
          <RegisterMapPanel
            propertyKey={propertyKey}
            currentValue={currentValue}
            onValueChange={onValueChange}
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
    <SettingItem
      category="Property"
      name={propertyKey}
      description={propertyData.description}
      isModified={isModified}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs text-txt/60">
          <span className={`px-2 py-0.5 rounded ${
            propertyData.tag === 'sim'
              ? 'bg-green-600/20 text-green-400'
              : 'bg-yellow-600/20 text-yellow-400'
          }`}>
            {propertyData.tag.toUpperCase()}
          </span>
          <span>{propertyData.type}</span>
          {propertyData.constraint.type !== 'None' && (
            <span className="text-txt/40">
              {propertyData.constraint.type === 'range'
                ? `Range: ${propertyData.constraint.value.from} - ${propertyData.constraint.value.to}`
                : `Options: ${propertyData.constraint.value.join(', ')}`
              }
            </span>
          )}
        </div>
        {renderInput()}
        {isModified && (
          <div className="text-xs text-txt/50">
            Default: {JSON.stringify(propertyData.defaultValue)}
          </div>
        )}
      </div>
    </SettingItem>
  );
}
