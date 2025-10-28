import {
  Architecture,
  BaselineArchitecture,
  IPInstance,
  Project,
  Simulation,
  User,
} from "@prisma/client";

export type ArchitectureWith = Architecture & {
  baseline: BaselineArchitecture;
};
export type ArchitectureWithProject = Architecture & {
  baseline: BaselineArchitecture;
  project: Project & { members: User[] };
  ipInstance: IPInstance;
};
export type ProjectWith = Project & {
  members: User[];
  architectures: ArchitectureWith[];
  simulations: Simulation[];
};

export type SimulationWith = Simulation & { project: Project };

export type ProjectWithMemberArch = Project & {
  members: User[];
  architectures: Architecture[];
};

export interface SimulationExecutionInfo {
  simulator: string;
  paramExploration: boolean;
}

export type ArchitectureInPage = Architecture & {
  baseline: BaselineArchitecture;
  creator: User;
};

export type ProjectInPage = Project & {
  architectures: ArchitectureInPage[];
  members: User[];
};
