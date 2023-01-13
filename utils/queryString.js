import queryString from "query-string";

const QueryStringFunction = (object) => {
  let ResultObjectKeys = Object.keys(object);

  ResultObjectKeys.map((item) => {
    if (
      object[item] === "" ||
      object[item] === null ||
      object[item] === undefined
    ) {
      delete object[item];
    }
  });

  return queryString.stringify(object);
};

export default QueryStringFunction;
