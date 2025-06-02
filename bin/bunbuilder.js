// @bun
// src/api/io.ts
import { styleText } from "util";
import { stdout } from "process";
function _addEchoOptions(str, options) {
  const output = { str: str.valueOf() };
  if (options.color) {
    output.str = styleText(options.color, str, { stream: stdout, validateStream: true });
  }
  if (options.newLine) {
    output.str += `
`;
  }
  return output.str;
}
async function _echo(str, options = undefined) {
  const output = { str: str.valueOf() };
  if (options) {
    output.str = _addEchoOptions(str, options);
  }
  await Bun.write(Bun.stdout, output.str);
}
var io = {
  echo: async (str, options = undefined) => {
    await _echo(str, options);
  }
};
var io_default = io;
// package.json
var package_default = {
  name: "bunbuilder",
  version: "0.0.1",
  description: "build bun apps",
  author: "yassghn@protonmail.com",
  license: "SEE LICENSE IN license",
  module: "build.ts",
  type: "module",
  scripts: {
    ship: "bun run make && npm pack"
  },
  bin: "bin/bunbuilder.js",
  devDependencies: {
    "@types/bun": "latest",
    "@typescript-eslint/parser": "^8.33.0",
    eslint: "^9.28.0",
    prettier: "^3.5.3",
    "prettier-eslint": "^16.4.2",
    typescript: "^5.8.3"
  }
};
// data/data.json
var data_default = {
  configFileName: "bunbuilder.config.json",
  help: {
    description: "bunbuilder help",
    usage: "$ bunx bunbuilder [OPTIONS] [[FILES][DIRECTORIES]]",
    options: {
      build: "-b, --build   build bun app",
      watch: "-w, --watch   watch source directory for changes",
      serve: "-s, --serve   start http server on localhost:3000",
      clean: "-c, --clean   clean dist directory",
      help: "-h, --help    print this help"
    },
    examples: {
      build: "$ bunx bunbuilder -b .\\src\\ts\\index.ts",
      watch: "$ bunx bunbuilder -w",
      serve: "$ bunx bunbuilder -s",
      clean: "$ bunx bunbuilder -c",
      combo: "$ bunx bunbuilder -cbsw"
    }
  }
};

// src/api/util.ts
function _hewPackageInfoString() {
  const name = package_default.name;
  const version = package_default.version;
  const info = [name, " ", "v", version];
  return info.join("");
}
function _greet() {
  const info = _hewPackageInfoString();
  io_default.echo(info, { newLine: true, color: "green" });
}
function _appendHelpStr(str, add, newLineWrap = false) {
  const retVal = { str: str.valueOf() };
  if (newLineWrap)
    retVal.str += `
`;
  retVal.str += add.valueOf();
  retVal.str += `
`;
  if (newLineWrap)
    retVal.str += `
`;
  return retVal.str;
}
function _hewHelpDescription() {
  const description = { label: "", str: "" };
  description.str += `
`;
  description.str += data_default.help.description;
  description.str += `
`;
  return description;
}
function _hewHelpUsage() {
  const usage = { label: "", str: "" };
  const label = Object.keys(data_default.help)[1] ?? "";
  usage.label = _appendHelpStr(usage.label, label.toUpperCase(), true);
  usage.str = _appendHelpStr(usage.str, data_default.help.usage);
  return usage;
}
function _hewHelpOptions() {
  const options = { label: "", str: "" };
  const label = Object.keys(data_default.help)[2] ?? "";
  options.label = _appendHelpStr(options.label, label.toLocaleUpperCase(), true);
  options.str = _appendHelpStr(options.str, data_default.help.options.build);
  options.str = _appendHelpStr(options.str, data_default.help.options.watch);
  options.str = _appendHelpStr(options.str, data_default.help.options.serve);
  options.str = _appendHelpStr(options.str, data_default.help.options.clean);
  options.str = _appendHelpStr(options.str, data_default.help.options.help);
  return options;
}
function _hewHelpExamples() {
  const examples = { label: "", str: "" };
  const label = Object.keys(data_default.help)[3] ?? "";
  examples.label = _appendHelpStr(examples.label, label.toLocaleUpperCase(), true);
  examples.str = _appendHelpStr(examples.str, data_default.help.examples.build);
  examples.str = _appendHelpStr(examples.str, data_default.help.examples.watch);
  examples.str = _appendHelpStr(examples.str, data_default.help.examples.serve);
  examples.str = _appendHelpStr(examples.str, data_default.help.examples.clean);
  examples.str = _appendHelpStr(examples.str, data_default.help.examples.combo);
  return examples;
}
async function _printHelp() {
  const description = _hewHelpDescription();
  const usage = _hewHelpUsage();
  const options = _hewHelpOptions();
  const examples = _hewHelpExamples();
  const labelColor = { color: "yellow" };
  await io_default.echo(description.str);
  await io_default.echo(usage.label, labelColor);
  await io_default.echo(usage.str);
  await io_default.echo(options.label, labelColor);
  await io_default.echo(options.str);
  await io_default.echo(examples.label, labelColor);
  await io_default.echo(examples.str);
}
var util = {
  greet: () => {
    _greet();
  },
  printHelp: async () => {
    await _printHelp();
  }
};
var util_default = util;

// src/api/config.ts
import { readFileSync } from "fs";
import { cwd } from "process";
import { sep } from "path";
var defaults = {
  name: data_default.configFileName
};
function _hewConfigPath() {
  const absPath = cwd() + sep + defaults.name;
  return absPath;
}
function _importConfig() {
  const configPath = _hewConfigPath();
  const data = readFileSync(configPath, "utf-8");
  const config = JSON.parse(data);
  return config;
}
function _parse() {
  const config = _importConfig();
  return config;
}
var config = {
  parse: () => {
    return _parse();
  }
};
var config_default = config;

// src/api/cli.ts
import { parseArgs } from "util";
function _hewParseArgsOptions() {
  const options = {
    build: {
      type: "boolean",
      short: "b"
    },
    watch: {
      type: "boolean",
      short: "w"
    },
    serve: {
      type: "boolean",
      short: "s"
    },
    clean: {
      type: "boolean",
      short: "c"
    },
    help: {
      type: "boolean",
      short: "h"
    }
  };
  return options;
}
function _hewParseArgsConfig() {
  const options = _hewParseArgsOptions();
  const config2 = {
    args: Bun.argv,
    strict: true,
    allowPositionals: true,
    options: { ...options }
  };
  return config2;
}
function _processParsed(parsed) {
  const actions = { ...parsed.values };
  const files = [];
  if (parsed.positionals.length > 2) {
    const length = parsed.positionals.length;
    const arr = parsed.positionals.slice(2, length);
    files.push(arr);
  }
  const actionPlan = {
    actions: { ...actions },
    files: files[0]
  };
  return actionPlan;
}
function _argsParse() {
  const config2 = _hewParseArgsConfig();
  const parsed = parseArgs(config2);
  const actionPlan = _processParsed(parsed);
  return actionPlan;
}
var cli = {
  argsParse: () => {
    return _argsParse();
  }
};
var cli_default = cli;

// src/api/types.ts
var ACTION = {
  build: "build",
  watch: "watch",
  serve: "serve",
  clean: "clean",
  help: "help"
};

// src/api/action.ts
async function _takeActionHelp() {
  await util_default.printHelp();
}
async function _processAction(action) {
  switch (action) {
    case ACTION.build:
      console.log(action);
      break;
    case ACTION.clean:
      console.log(action);
      break;
    case ACTION.serve:
      console.log(action);
      break;
    case ACTION.watch:
      console.log(action);
      break;
    case ACTION.help:
      await _takeActionHelp();
      break;
  }
}
async function _processActions(actionPlan) {
  for (const action in actionPlan.actions) {
    await _processAction(action);
  }
}
async function _start(actionPlan, config2) {
  await _processActions(actionPlan);
}
var action = {
  start: async (actionPlan, config2) => {
    await _start(actionPlan, config2);
  }
};
var action_default = action;

// src/bunbuilder.ts
(async function() {
  async function _bunbuilder() {
    const conf = config_default.parse();
    const actionPlan = cli_default.argsParse();
    util_default.greet();
    await action_default.start(actionPlan, conf);
  }
  try {
    await _bunbuilder();
  } catch (e) {
    console.error(e.message);
  }
})();
