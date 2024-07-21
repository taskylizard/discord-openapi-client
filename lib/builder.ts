import {
  type ClientBuilder,
  type ClientGeneratorsBuilder,
  type GeneratorOptions,
  type GeneratorVerbOptions,
  GetterPropType,
  camel,
  generateBodyOptions,
  generateFormDataAndUrlEncodedFunction,
  generateVerbImports,
  isObject,
  pascal,
  stringify,
  toObjectString,
  jsDoc,
} from "@orval/core";

export const generateRequestFunction = (
  {
    queryParams,
    operationName,
    response,
    mutator,
    body,
    props,
    verb,
    doc,
    summary,
    deprecated,
    formData,
    formUrlEncoded,
    override,
  }: GeneratorVerbOptions,
  { route }: GeneratorOptions,
) => {
  const isRequestOptions = override?.requestOptions !== false;
  const isFormData = override?.formData !== false;
  const isFormUrlEncoded = override?.formUrlEncoded !== false;

  const getUrlFnName = camel(`get-${operationName}-url`);
  const getUrlFnProps = toObjectString(
    props.filter(
      (prop) =>
        prop.type === GetterPropType.PARAM ||
        prop.type === GetterPropType.NAMED_PATH_PARAMS ||
        prop.type === GetterPropType.QUERY_PARAM,
    ),
    "implementation",
  );
  const getUrlFnImplementation = `export const ${getUrlFnName} = (${getUrlFnProps}) => {
${
  queryParams
    ? `
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {
    if (value === null) {
      normalizedParams.append(key, 'null');
    } else if (value !== undefined) {
      normalizedParams.append(key, value.toString());
    }
  });`
    : ""
}

  ${
    queryParams
      ? `return normalizedParams.size ? \`${route}${"?${normalizedParams.toString()}"}\` : \`${route}\``
      : `return \`${route}\``
  }
}\n`;

  const responseTypeName = pascal(
    fetchResponseTypeName(operationName),
  ).replaceAll("200", "Success");
  const responseTypeImplementation = `export type ${responseTypeName} = {
  data: ${response.definition.success || "unknown"};
  status: number;
}`;

  const getUrlFnProperties = props
    .filter(
      (prop) =>
        prop.type === GetterPropType.PARAM ||
        prop.type === GetterPropType.QUERY_PARAM ||
        prop.type === GetterPropType.NAMED_PATH_PARAMS,
    )
    .map((param) => {
      if (param.type === GetterPropType.NAMED_PATH_PARAMS) {
        return param.destructured;
      }
      return param.name;
    })
    .join(",");

  const args = `${toObjectString(props, "implementation")} ${isRequestOptions ? `options?: RequestInit` : ""}`;
  const returnType = `Promise<${responseTypeName}>`;

  const globalFetchOptions = isObject(override?.requestOptions)
    ? `${stringify(override?.requestOptions)?.slice(1, -1)?.trim()}`
    : "";
  const fetchMethodOption = `method: '${verb.toUpperCase()}'`;

  const requestBodyParams = generateBodyOptions(
    body,
    isFormData,
    isFormUrlEncoded,
  );
  const fetchBodyOption = requestBodyParams
    ? `body: JSON.stringify(${requestBodyParams})`
    : "";

  const fetchFnOptions = `${getUrlFnName}(${getUrlFnProperties}),
  {${globalFetchOptions ? "\n" : ""}      ${globalFetchOptions}
    ${isRequestOptions ? "...options," : ""}
    ${fetchMethodOption}${fetchBodyOption ? "," : ""}
    ${fetchBodyOption}
  }
`;
  const fetchResponseImplementation = `const res = await fetch(${fetchFnOptions}
  )
  const data = await res.json()

  return { status: res.status, data }
`;
  const customFetchResponseImplementation = `return ${mutator?.name}<${returnType}>(${fetchFnOptions});`;

  const bodyForm = generateFormDataAndUrlEncodedFunction({
    formData,
    formUrlEncoded,
    body,
    isFormData,
    isFormUrlEncoded,
  });

  const fetchImplementationBody = mutator
    ? customFetchResponseImplementation
    : `${bodyForm ? `  ${bodyForm}\n` : ""}` +
      `  ${fetchResponseImplementation}`;

  const fetchImplementationJsDoc = jsDoc({
    description: doc,
    deprecated,
    summary,
  });

  const fetchImplementation = `${fetchImplementationJsDoc}\nexport const ${operationName} = async (${args}): ${returnType} => {\n${fetchImplementationBody}}`;

  const implementation =
    `${responseTypeImplementation}\n\n` +
    `${getUrlFnImplementation}\n` +
    `${fetchImplementation}\n`;

  return implementation;
};

export const fetchResponseTypeName = (operationName: string) =>
  `${operationName}Response`;

export const generateClient: ClientBuilder = (verbOptions, options) => {
  const imports = generateVerbImports(verbOptions).map((generator) => {
    generator.name = generator.name.replaceAll("200", "Response");
    return generator;
  });

  const functionImplementation = generateRequestFunction(verbOptions, options);

  return {
    implementation: `${functionImplementation}\n`,
    imports,
  };
};

const fetchClientBuilder: ClientGeneratorsBuilder = {
  client: generateClient,
  dependencies: () => [],
};

export const builder = () => () => fetchClientBuilder;

export default builder;
