import { generateIR } from "../app/(commons)/utilities/ir-generator";
import { sampleIPInstanceHierarchy } from "./sample-data";

const ir = generateIR(sampleIPInstanceHierarchy);
console.log(JSON.stringify(ir, null, 2));
