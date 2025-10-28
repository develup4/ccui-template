import { findInstanceWithContext, HierarchyResult } from "./hierarchy-utils";
import { sampleIPInstanceHierarchy } from "../sample-data";

/**
 * Test cases for the hierarchy API
 * These tests verify that the findInstanceWithContext function correctly:
 * - Finds instances by exact hierarchy path match
 * - Returns the target instance, its parent, and direct children only
 * - Handles edge cases like root instance and invalid paths
 */

export function runHierarchyTests(): void {
  console.log("Running hierarchy API tests...\n");

  const tests = [
    {
      name: "Find root instance",
      path: "root",
      expectedTarget: "System Root",
      expectedParent: null,
      expectedChildrenCount: 5, // CPU, Memory, IO, heart, and others
    },
    {
      name: "Find CPU cluster",
      path: "root.cpu_cluster",
      expectedTarget: "CPU Cluster",
      expectedParent: "System Root",
      expectedChildrenCount: 2, // core0 and core1
    },
    {
      name: "Find leaf node (core0)",
      path: "root.cpu_cluster.core0",
      expectedTarget: "ARM Cortex-A78",
      expectedParent: "CPU Cluster",
      expectedChildrenCount: 0, // no children
    },
    {
      name: "Find memory subsystem",
      path: "root.memory",
      expectedTarget: "Memory Subsystem",
      expectedParent: "System Root",
      expectedChildrenCount: 1, // DDR4 controller
    },
    {
      name: "Find DDR4 controller",
      path: "root.memory.ddr4_ctrl",
      expectedTarget: "DDR4 Controller",
      expectedParent: "Memory Subsystem",
      expectedChildrenCount: 0, // no children
    },
    {
      name: "Find IO subsystem",
      path: "root.io",
      expectedTarget: "IO Subsystem",
      expectedParent: "System Root",
      expectedChildrenCount: 2, // UART and GPIO
    },
    {
      name: "Find UART controller",
      path: "root.io.uart",
      expectedTarget: "UART Controller",
      expectedParent: "IO Subsystem",
      expectedChildrenCount: 0,
    },
    {
      name: "Find heart controller",
      path: "root.heart",
      expectedTarget: "heart",
      expectedParent: "System Root",
      expectedChildrenCount: 0,
    },
    {
      name: "Invalid hierarchy path",
      path: "root.nonexistent",
      expectedTarget: null,
      expectedParent: null,
      expectedChildrenCount: 0,
    },
    {
      name: "Empty hierarchy path",
      path: "",
      expectedTarget: null,
      expectedParent: null,
      expectedChildrenCount: 0,
    },
  ];

  let passedTests = 0;
  let totalTests = tests.length;

  tests.forEach((test, index) => {
    console.log(`Test ${index + 1}: ${test.name}`);
    const result = findInstanceWithContext(
      sampleIPInstanceHierarchy,
      test.path
    );

    const targetName = result.target?.name || null;
    const parentName = result.parent?.name || null;
    const childrenCount = result.children.length;

    const targetMatch = targetName === test.expectedTarget;
    const parentMatch = parentName === test.expectedParent;
    const childrenMatch = childrenCount === test.expectedChildrenCount;

    if (targetMatch && parentMatch && childrenMatch) {
      console.log("✅ PASS");
      passedTests++;
    } else {
      console.log("❌ FAIL");
      console.log(
        `  Expected: target="${test.expectedTarget}", parent="${test.expectedParent}", children=${test.expectedChildrenCount}`
      );
      console.log(
        `  Got:      target="${targetName}", parent="${parentName}", children=${childrenCount}`
      );
    }
    console.log("---\n");
  });

  console.log(`Tests completed: ${passedTests}/${totalTests} passed`);

  if (passedTests === totalTests) {
    console.log("🎉 All tests passed!");
  } else {
    console.log("⚠️  Some tests failed. Please check the implementation.");
  }
}

// Export for use in other modules
export default runHierarchyTests;
