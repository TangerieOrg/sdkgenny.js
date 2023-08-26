import { SDKObject, TestObject } from "../src";

console.log(
    SDKObject()
    .comment("TestComment")
    .name("Test Object")
    .metadata("M1", "M2")
    .metadata("M3")
    .children(
        SDKObject().name("TestChild")
    )
    ._asObject()
)

console.log(
    TestObject()
    .key("value")
    .comment("TestComment")
    .name("Test Object")
    .metadata("M1", "M2")
    .metadata("M3")
    .children(
        SDKObject()
    )
    ._asObject()
)