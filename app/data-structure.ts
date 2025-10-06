interface IPModelData {
    [version: string]: IPModelVersionData;
}

interface IPModelVersionData {
    ports?: {[port: string]: IPModelPortData};
    properties?: {[property:string]: IPModelPropertyData};
    display: IPModelDisplayData;
    cModelLib: {nca: boolean; ia: boolean};
}

type PortType = "*" | "tilelink" | "axi" | "ahb" | "apb" | "interrupt" | "clock" | "reset" | "jtag" | "dmi";

type DirectionType = "left" | "right" | "top" | "bottom";

interface IPModelPortSourceType {
    type:string;
    sourceType: PortType;
}

interface IPModelPortData {
    type: PortType;
    sources: IPModelPortSourceType[];
    direction: DirectionType;
}

type PropertyType = "String" | "Number" | "String Select" | "Number Select" | "Boolean" | "Address" | "Complex" | "RegisterMap";

interface NoneConstraintType {
    type: "None",
    value: "None"
}

interface ListConstraintType {
    type: "list",
    value: (string | number)[];
}

interface RangeConstraintType {
    type: "range",
    value: {from: number | string, to: number | string};
}

type IPModelPropertyConstraintType = NoneConstraintType | ListConstraintType | RangeConstraintType;

interface IPModelPropertyData {
    type: PropertyType;
    description: string;
    constraint: IPModelPropertyConstraintType;
    defaultValue: any;
    tag: 'sim' | 'hw';
}

interface IPDisplayColorType {
    port: string;
    title: string;
    titleFont: string;
    primary: string;
}

interface IPModelDisplayData {
    size: {width: number, height: number};
    color: IPDisplayColorType;
    emoji: string;
}

interface IPInstanceData {
    ports?: {[port:string]: IPInstancePortData};
    properties: {[property: string]: string | number | object};
    display: IPInstanceDisplayData;
}

interface IPInstancePortData {
    properties?: {
        mapping?: {
            value: {
                base: { value: string };
                size: { value: string };
                remap: { value: string };
                add_offset: { value: string };
                remove_offset: { value: boolean };
            }
        },
        size?: number;
        bypass_mapping: boolean;
    }
}

interface IPInstanceDisplayData {
    size: {width: number, height: number};
    color: IPDisplayColorType;
    emoji: string;
    position: {x:number, y:number};
}

interface IPInstanceBindingData {
    from: string;
    to: string;
    properties?: {
        mapping?: {
            value: {
                from?: {
                    value: {
                        value: number;
                    }[]
                };
                to?: {
                    value: {
                        value: number;
                    }[]
                }
            }
        },
        crossing?: {
            value: {
                type: {value: "sync" | "async"};
                fifo_size: {value: number};
                direction: {value: "from" | "none"};
                source_sync: {value: number};
                sink_sync: {value: number};
            }
        }
    }
}