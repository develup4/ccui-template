import { IPInstance, IPModel } from "../sample-data";

interface IRNode {
  name: string;
  type: string;
  properties?: { [key: string]: any };
  ports?: Array<{ name: string; type: string }>;
  components?: IRNode[];
  bindings?: any;
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
  const ports = generatePorts(modelData);
  if (ports && ports.length > 0) {
    ir.ports = ports;
  }

  // Generate components (children) if they exist
  if (ipInstance.children && ipInstance.children.length > 0) {
    ir.components = ipInstance.children.map((child) => generateIR(child));
  }

  // Generate bindings if model is composite
  if (model.isComposite && ipInstance.bindings) {
    ir.bindings = ipInstance.bindings;
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
    properties[propertyName] =
      instanceValue !== undefined ? instanceValue : defaultValue;
  }

  return Object.keys(properties).length > 0 ? properties : undefined;
}

/**
 * Generates ports from model data
 */
function generatePorts(modelData: any): Array<{ name: string; type: string }> | undefined {
  if (!modelData.ports) {
    return undefined;
  }

  const ports: Array<{ name: string; type: string }> = [];

  for (const [portName, portData] of Object.entries(modelData.ports)) {
    ports.push({
      name: portName,
      type: (portData as any).type,
    });
  }

  return ports.length > 0 ? ports : undefined;
}
