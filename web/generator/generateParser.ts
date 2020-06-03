import peg from "pegjs";

export type ParseResult = { functionName: string, parameterList: { name: string, type: string }[], categoryList: string[] }[];

const grammar = `
start
  = Functions
  / _

Functions
  = _ func:Function _ funcs:Functions _ {
    return [func, ...funcs];
  }
  / _ func:Function _ {
    return [func];
  }

Function
  = functionName:Name _ "(" _ parameterList:ParameterList? _ ")" categoryList:CategoryList? {
    var parameterList = parameterList || [];
    var categoryList = categoryList || [];
    return {
      functionName,
      parameterList,
      categoryList,
    }
  }

  TypeName
  = Name ("<" TypeName ">")? { return text(); }

  Name
  = [a-zA-Z_$][a-zA-Z_$0-9]* { return text(); }

ParameterList
  = param:Parameter _ "," _ paramList:ParameterList {
    var paramList = paramList || [];
    return [param, ...paramList];
  }
  / param:Parameter {
    return [param];
  }

Parameter
  = name:Name _ ":" _ type:TypeName {
    return {
      name,
      type,
    };
  }

CategoryList
  = _ category:Category _ categories:CategoryList _ {
    return [category, ...categories];
  }
  / _ category:Category _ {
    return [category];
  }

Category
  = "-" categoryName:[a-zA-Z0-9]+ {
    return categoryName.join("");
  }

_ "whitespace"
  = [ \\t\\n\\r]*
`;

export const parser = peg.generate(grammar);