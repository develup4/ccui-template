import { IPInstance, IPModel } from "../sample-data";

interface IRPort {
  name: string;
  type: string;
  properties?: any;
  bypass_mapping?: boolean;
}

interface IRBinding {
  from: string;
  to: string;
  properties?: any;
}

interface IRNode {
  name: string;
  type: string;
  properties?: { [key: string]: any };
  ports?: IRPort[];
  components?: IRNode[];
  bindings?: IRBinding[];
}

/**
 * Generates IR (Intermediate Representation) from IPInstance hierarchy
 * @param ipInstance - Root IPInstance to start generation from
 * @returns IR tree structure
 */
export function generateIR(ipInstance: IPInstance): IRNode {
  const model = ipInstance.model;
  const modelData = model.data[ipInstance.modelVersion];

  if (!modelData) {
    throw new Error(
      `Model version ${ipInstance.modelVersion} not found for instance ${ipInstance.name}`
    );
  }

  const ir: IRNode = {
    name: ipInstance.name,
    type: getType(model),
  };

  // Generate properties if they exist
  const properties = generateProperties(ipInstance, modelData);
  if (properties && Object.keys(properties).length > 0) {
    ir.properties = properties;
  }

  // Generate ports if they exist
  const ports = generatePorts(ipInstance, modelData);
  if (ports && ports.length > 0) {
    ir.ports = ports;
  }

  // Generate components (children) if they exist
  if (ipInstance.children && ipInstance.children.length > 0) {
    ir.components = ipInstance.children.map((child) => generateIR(child));
  }

  // Generate bindings if model is composite
  if (model.isComposite && ipInstance.bindings) {
    ir.bindings = generateBindings(ipInstance.bindings);
  }

  return ir;
}

/**
 * Determines the type field based on model flags
 */
function getType(model: IPModel): string {
  if (model.isCustom) {
    return "custom";
  }
  if (model.isComposite) {
    return "composite";
  }
  return model.type;
}

/**
 * Wraps a value in {value: ...} format recursively
 */
function wrapValue(value: any): any {
  if (value === null || value === undefined) {
    return { value };
  }

  // If it's already wrapped, return as is
  if (typeof value === 'object' && !Array.isArray(value) && 'value' in value && Object.keys(value).length === 1) {
    return value;
  }

  // If it's a primitive (string, number, boolean)
  if (typeof value !== 'object' || value === null) {
    return { value };
  }

  // If it's an array, wrap each element
  if (Array.isArray(value)) {
    return { value: value.map(wrapValue) };
  }

  // If it's an object (Complex type), wrap each property recursively
  const wrappedObject: any = {};
  for (const [key, val] of Object.entries(value)) {
    wrappedObject[key] = wrapValue(val);
  }
  return { value: wrappedObject };
}

/**
 * Generates properties from instance and model data
 */
function generateProperties(
  ipInstance: IPInstance,
  modelData: any
): { [key: string]: any } | undefined {
  if (!modelData.properties) {
    return undefined;
  }

  const properties: { [key: string]: any } = {};

  for (const [propertyName, propertyData] of Object.entries(
    modelData.properties
  )) {
    const instanceValue =
      ipInstance.data?.properties?.[propertyName];
    const defaultValue = (propertyData as any).defaultValue;

    // Use instance value if available, otherwise use default value
    const rawValue = instanceValue !== undefined ? instanceValue : defaultValue;

    // Wrap the value in {value: ...} format
    properties[propertyName] = wrapValue(rawValue);
  }

  return Object.keys(properties).length > 0 ? properties : undefined;
}

/**
 * Generates ports from model and instance data
 */
function generatePorts(ipInstance: IPInstance, modelData: any): IRPort[] | undefined {
  if (!modelData.ports) {
    return undefined;
  }

  const ports: IRPort[] = [];
  const instancePorts = ipInstance.data?.ports || {};

  for (const [portName, portData] of Object.entries(modelData.ports)) {
    const port: IRPort = {
      name: portName,
      type: (portData as any).type,
    };

    // Add instance-specific port data if available
    const instancePortData = instancePorts[portName];
    if (instancePortData) {
      if (instancePortData.properties) {
        port.properties = instancePortData.properties;
      }
      if (instancePortData.bypass_mapping !== undefined) {
        port.bypass_mapping = instancePortData.bypass_mapping;
      }
    }

    ports.push(port);
  }

  return ports.length > 0 ? ports : undefined;
}

/**
 * Generates bindings from instance binding data
 */
function generateBindings(bindings: any): IRBinding[] | undefined {
  if (!bindings || (Array.isArray(bindings) && bindings.length === 0)) {
    return undefined;
  }

  if (!Array.isArray(bindings)) {
    return undefined;
  }

  const irBindings: IRBinding[] = bindings.map((binding: any) => {
    const irBinding: IRBinding = {
      from: binding.from,
      to: binding.to,
    };

    if (binding.properties) {
      irBinding.properties = binding.properties;
    }

    return irBinding;
  });

  return irBindings.length > 0 ? irBindings : undefined;
}
