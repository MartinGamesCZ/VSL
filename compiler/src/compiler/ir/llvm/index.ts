import { log, LogType } from "../../../utils/log";
import llvmCall from "./call";
import llvmConstant, { llvmStringifyConstant, processString } from "./constant";
import llvmDeclaration, { llvmStringifyDeclaration } from "./declaration";
import llvmFunction, { llvmStringifyFunction } from "./function";

export default class LLVM {
  constants = new Map<
    string,
    {
      name: string;
      id: string;
      type: "string";
      value: string;
    }
  >();
  functions = new Map<
    string,
    {
      name: string;
      id: string;
      out_type: "string" | "void";
      body: any;
      args: any;
    }
  >();
  declarations = new Map<
    string,
    {
      name: string;
      out_type: "string" | "void";
      args: string[];
    }
  >();
  headers: string[] = [];

  config: { [key: string]: any } = {};

  constructor() {}

  declareValue(type: "string", value: string) {
    value = processString(value).str;
    const con = llvmConstant(`_val`, type, value);

    this.constants.set(con.value, con);
  }

  declareFunction(
    name: string,
    out_type: "string" | "void",
    body: any,
    args: any,
  ) {
    const fun = llvmFunction(name, out_type, args, body);

    this.functions.set(name, fun);
  }

  declare(name: string, out_type: "string" | "void", args: string[]) {
    const dec = llvmDeclaration(name, out_type, args);

    this.declarations.set(name, dec);
  }

  addHeader(header: string) {
    this.headers.push(header);
  }

  callFunction(name: string, args: any[]) {
    return llvmCall(name, args, this);
  }

  addFunctionBody(parentFun: string, name: string, args: any[]) {
    const fun = this.functions.get(parentFun);

    if (!fun) {
      log(LogType.ERROR, `Function '${parentFun}' not found!`);

      return process.exit();
    }

    fun.body.push(this.callFunction(name, args));
  }

  setConfig(config: { [key: string]: any } = {}) {
    this.config = config;
  }

  _stringifyConstants() {
    const out: string[] = [];

    this.constants.forEach((value, key) => {
      out.push(llvmStringifyConstant(value));
    });

    return out.join("\n");
  }

  _stringifyHeaders() {
    return this.headers.join("\n\n");
  }

  _stringifyFunctions() {
    const out: string[] = [];

    this.functions.forEach((value, key) => {
      out.push(llvmStringifyFunction(value, this));
    });

    return out.join("\n\n");
  }

  _stringifyDeclarations() {
    const out: string[] = [];

    this.declarations.forEach((value, key) => {
      out.push(llvmStringifyDeclaration(value));
    });

    return out.join("\n\n");
  }

  get() {
    const functions = this._stringifyFunctions();
    const constants = this._stringifyConstants();
    const headers = this._stringifyHeaders();
    const declarations = this._stringifyDeclarations();

    return `${headers.length > 0 ? `${headers}\n\n` : ""}${constants.length > 0 ? `${constants}\n\n` : ""}${declarations.length > 0 ? `${declarations}\n\n` : ""}${functions.length > 0 ? `${functions}\n\n` : ""}`;
  }
}
