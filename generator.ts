import openapiTS, { astToString } from "openapi-typescript";
import ts from "typescript";
import fs from "node:fs";

const DATE = ts.factory.createTypeReferenceNode(ts.factory.createIdentifier("Date")); // `Date`
const NULL = ts.factory.createLiteralTypeNode(ts.factory.createNull()); // `null`

const schema = new URL('./openapi/specs/openapi.json', import.meta.url)

const ast = await openapiTS(schema, {
  transform(schemaObject, metadata) {
    if (schemaObject.format === "date-time") {
      return schemaObject.nullable
        ? ts.factory.createUnionTypeNode([DATE, NULL])
        : DATE;
    }
  },
})

const contents = astToString(ast);

fs.writeFileSync("./src/schema.ts", contents);
console.log("Done");
