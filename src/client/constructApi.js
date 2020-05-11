import getParamNames from "./getParamNames"

export default function constructApi(funcs) {
    // build api from an array of functions
    let api = "";
    let handlers = {};
    let docs = {};

    funcs.forEach((func) => {
      if (typeof func !== "function") throw "Parameter is not a function";
      if (func.name === "" || func.name == "anonymous")
        throw "Function has no name";

      const name = func.name;
      const params = getParamNames(func).join(", ");
      const body = `self.postMessage({ name: "${name}", params: [${params}] })`;

      api += `function ${name}(${params}) { ${body} };` + "\n";
      handlers[name] = func;
    })

    return [api, handlers]
}
