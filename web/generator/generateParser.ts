import peg from "pegjs";

export type ParseResult = { functionName: string, parameterList: { name: string, type: string }[] }[];

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
  = functionName:Name _ "(" _ parameterList:ParameterList? _ ")" {
    var parameterList = parameterList || [];
    return {
      functionName,
      parameterList,
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
_ "whitespace"
  = [ \\t\\n\\r]*
`;

export const parser = peg.generate(grammar);