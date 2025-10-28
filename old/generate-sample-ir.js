const { generateIR } = require('../app/utils/ir-generator.ts');
const { sampleIPInstanceHierarchy } = require('../app/sample-data.ts');

const ir = generateIR(sampleIPInstanceHierarchy);
console.log(JSON.stringify(ir, null, 2));
