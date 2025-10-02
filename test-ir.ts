import { generateIR } from './app/utils/ir-generator';
import { sampleIPInstanceHierarchy } from './app/sample-data';

const ir = generateIR(sampleIPInstanceHierarchy);
console.log(JSON.stringify(ir, null, 2));
