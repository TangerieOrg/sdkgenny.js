import { cloneDeep, isObject } from "lodash";

export type IBuilder<T> = {
    [K in keyof T]: T[K] extends Array<any> ? (...values : T[K]) => IBuilder<T> : (value : T[K]) => IBuilder<T>;
} & { 
    _asObject() : T & { children: unknown[] };
    children: (...values: IBuilder<unknown>[]) => IBuilder<T>;
}

export function Builder<T extends { [key : string]: unknown }>(template : T) {
    type BuilderWithChildren = T & {children: IBuilder<unknown>[]};
    const createTemplate = () => cloneDeep<BuilderWithChildren>({...template, children: []});

    const valueToObject = (value : any) : any => {
        if(Array.isArray(value)) {
            return value.map(valueToObject);
        }
        // @ts-ignore
        if(isObject(value) && value._asObject) {
            // @ts-ignore
            return value._asObject();
        }
        return value;
    }

    return () => {
        const built = createTemplate();

        const builder = new Proxy({}, {
            get(target, key) {
                if(key === "_asObject") return () => {
                    // @ts-ignore
                    const output : T & { children: unknown[] } = {}

                    for(const [key, value] of Object.entries(built)) {
                        // @ts-ignore
                        output[key] = valueToObject(value);
                    }

                    return output;
                };

                return (...args : unknown[]) : unknown => {
                    if(Array.isArray(built[key as string])) {
                        // @ts-ignore
                        built[key as string].push(...args);
                    } else {
                        // @ts-ignore
                        built[key] = args[0];
                    }
                    return builder;
                }
            }
        });

        return builder as IBuilder<T>;
    }
}

export function BuilderInherit<T extends { [key : string]: unknown }, I extends { [key : string]: unknown }>(template : T, ctor: () => IBuilder<I>) { 
    return Builder({...ctor()._asObject(), ...template})
}