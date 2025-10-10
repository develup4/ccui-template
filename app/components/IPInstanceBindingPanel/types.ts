
export interface IPInstanceBinding {
  from: string;
  to: string;
  properties?: {
    mapping?: {
      value: {
        from?: {
          value: {
            value: number;
          }[];
        };
        to?: {
          value: {
            value: number;
          }[];
        };
      };
    };
    crossing?: {
      value: {
        type: { value: "sync" | "async" };
        fifo_size: { value: number };
        direction: { value: "from" | "none" };
        source_sync: { value: number };
        sink_sync: { value: number };
      };
    };
  };
}
