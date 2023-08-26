import { Builder, BuilderInherit, IBuilder } from "../builder";

export const SDKObject = Builder({
    name: "",
    comment: "",
    metadata: [] as string[]
});

const DefaultTestObject = {
    key: "value"
}

export const TestObject = BuilderInherit(DefaultTestObject, SDKObject);