import { generateIR } from './app/utils/ir-generator';
import { sampleIPInstanceHierarchy } from './app/sample-data';

console.log('=== Test 1: No rangedParameter (single IR) ===');
const singleIR = generateIR(sampleIPInstanceHierarchy);
console.log(`Generated ${singleIR.length} IR(s)`);
console.log(JSON.stringify(singleIR[0], null, 2));

console.log('\n=== Test 2: List constraint - CPU Cluster core_count ===');
const listConstraintIRs = generateIR(
  sampleIPInstanceHierarchy,
  'root.cpu_cluster::core_count'
);
console.log(`Generated ${listConstraintIRs.length} IR(s)`);
listConstraintIRs.forEach((ir, index) => {
  const cpuCluster = ir.components?.find(c => c.name === 'CPU Cluster');
  console.log(`IR ${index + 1}: core_count = ${JSON.stringify(cpuCluster?.properties?.core_count)}`);
});

console.log('\n=== Test 3: Range constraint - Root sys_clock_freq with custom values ===');
const rangeConstraintIRs = generateIR(
  sampleIPInstanceHierarchy,
  'root::sys_clock_freq',
  [100, 200, 300, 400, 500]
);
console.log(`Generated ${rangeConstraintIRs.length} IR(s)`);
rangeConstraintIRs.forEach((ir, index) => {
  console.log(`IR ${index + 1}: sys_clock_freq = ${JSON.stringify(ir.properties?.sys_clock_freq)}`);
});

console.log('\n=== Test 4: Full IR with rangedParameter ===');
console.log('First IR with core_count="2":');
console.log(JSON.stringify(listConstraintIRs[0], null, 2));
