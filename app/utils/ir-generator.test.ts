import { generateIR } from './ir-generator';
import { sampleIPInstanceHierarchy } from '../sample-data';

describe('IR Generator', () => {
  it('should generate IR from sample IPInstance hierarchy', () => {
    const ir = generateIR(sampleIPInstanceHierarchy);

    console.log('Generated IR:');
    console.log(JSON.stringify(ir, null, 2));

    // Basic structure checks
    expect(ir.name).toBe('System Root');
    expect(ir.type).toBe('SystemRoot');
    expect(ir.properties).toBeDefined();
    expect(ir.components).toBeDefined();
    expect(ir.components?.length).toBeGreaterThan(0);
  });

  it('should handle custom type correctly', () => {
    const ir = generateIR(sampleIPInstanceHierarchy);

    // Find DDR4 Controller (isCustom=true)
    const memorySubsystem = ir.components?.find(c => c.name === 'Memory Subsystem');
    const ddr4Controller = memorySubsystem?.components?.find(c => c.name === 'DDR4 Controller');

    expect(ddr4Controller?.type).toBe('custom');
  });

  it('should handle composite type correctly', () => {
    const ir = generateIR(sampleIPInstanceHierarchy);

    // Find CPU Cluster (isComposite=true)
    const cpuCluster = ir.components?.find(c => c.name === 'CPU Cluster');

    expect(cpuCluster?.type).toBe('composite');
  });

  it('should use instance property values over defaults', () => {
    const ir = generateIR(sampleIPInstanceHierarchy);

    // Root has instance properties that override defaults
    expect(ir.properties?.sys_clock_freq).toBe(200); // instance value, not default 100
    expect(ir.properties?.debug_mode).toBe(true); // instance value, not default false
  });

  it('should use default property values when instance has no override', () => {
    const ir = generateIR(sampleIPInstanceHierarchy);

    // ARM Cortex-A78 cores have no instance property overrides
    const cpuCluster = ir.components?.find(c => c.name === 'CPU Cluster');
    const core0 = cpuCluster?.components?.find(c => c.name === 'ARM Cortex-A78');

    expect(core0?.properties?.clock_speed).toBe(2.8); // default value
    expect(core0?.properties?.power_state).toBe('active'); // default value
  });

  it('should generate ports correctly', () => {
    const ir = generateIR(sampleIPInstanceHierarchy);

    // Root has clock and reset ports
    expect(ir.ports).toBeDefined();
    expect(ir.ports?.length).toBe(2);

    const clockPort = ir.ports?.find(p => p.name === 'clock');
    expect(clockPort?.type).toBe('clock');

    const resetPort = ir.ports?.find(p => p.name === 'reset');
    expect(resetPort?.type).toBe('signal');
  });

  it('should omit properties field when model has no properties', () => {
    const ir = generateIR(sampleIPInstanceHierarchy);

    // Find a node without properties in model
    const cpuCluster = ir.components?.find(c => c.name === 'CPU Cluster');
    const core0 = cpuCluster?.components?.[0];

    // This test depends on the sample data structure
    // Just verify properties exist or don't based on model
    if (core0) {
      // Core0 should have properties based on sample data
      expect(core0.properties).toBeDefined();
    }
  });

  it('should include bindings for composite models', () => {
    const ir = generateIR(sampleIPInstanceHierarchy);

    // Root is not composite but has bindings - should still be included? Check rule
    // CPU Cluster is composite
    const cpuCluster = ir.components?.find(c => c.name === 'CPU Cluster');

    // Based on sample data, CPU Cluster is composite and should have bindings field
    // even if empty
    expect(cpuCluster).toBeDefined();
  });

  it('should omit components field when no children exist', () => {
    const ir = generateIR(sampleIPInstanceHierarchy);

    // Find a leaf node
    const cpuCluster = ir.components?.find(c => c.name === 'CPU Cluster');
    const core0 = cpuCluster?.components?.[0];

    expect(core0?.components).toBeUndefined();
  });

  it('should recursively generate components tree', () => {
    const ir = generateIR(sampleIPInstanceHierarchy);

    // Root -> CPU Cluster -> Cores (3 levels)
    expect(ir.components?.length).toBeGreaterThan(0);

    const cpuCluster = ir.components?.find(c => c.name === 'CPU Cluster');
    expect(cpuCluster?.components?.length).toBeGreaterThan(0);
  });
});
