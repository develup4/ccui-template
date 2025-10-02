import { generateIR } from './app/utils/ir-generator';
import { sampleIPInstanceHierarchy } from './app/sample-data';

console.log('=== Test 1: No rangedParameter (single IR) ===');
const singleIR = generateIR(sampleIPInstanceHierarchy);
console.log(`Generated ${singleIR.length} IR(s)`);
console.log(JSON.stringify(singleIR, null, 2));

console.log('\n=== Test 2: List constraint - CPU Cluster core_count ===');
const listConstraintIRs = generateIR(
  sampleIPInstanceHierarchy,
  'root.cpu_cluster::core_count',
  ["2", "4", "8", "16"]
);
console.log(`Generated ${listConstraintIRs.length} IR(s)`);
console.log(JSON.stringify(listConstraintIRs, null, 2));

console.log('\n=== Test 3: Range constraint - Root sys_clock_freq with custom values ===');
const rangeConstraintIRs = generateIR(
  sampleIPInstanceHierarchy,
  'root::sys_clock_freq',
  [100, 200, 300]
);
console.log(`Generated ${rangeConstraintIRs.length} IR(s)`);
console.log(JSON.stringify(rangeConstraintIRs, null, 2));
