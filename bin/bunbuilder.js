// @bun
var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {
      get: all[name],
      enumerable: true,
      configurable: true,
      set: (newValue) => all[name] = () => newValue
    });
};

// node_modules/serve-static-bun/dist/utils/collapse-slashes.js
var exports_collapse_slashes = {};
__export(exports_collapse_slashes, {
  collapseSlashes: () => collapseSlashes
});
function collapseSlashes(str, options2 = {}) {
  const { keepLeading = true, keepTrailing = true } = options2;
  str = `/${str}/`.replaceAll(/[/]+/g, "/");
  if (!keepLeading) {
    str = str.substring(1);
  }
  if (!keepTrailing) {
    str = str.substring(0, str.length - 1);
  }
  return str;
}
// data/data.json
var data_default = {
  configFileName: "bunbuilder.config.json",
  help: {
    description: "bunbuilder help",
    usage: "$ bunx bunbuilder [OPTIONS] [[FILES][DIRECTORIES]]",
    options: {
      build: "-b, --build     build bun app",
      watch: "-w, --watch     watch source directory for changes",
      serve: "-s, --serve     start http server on localhost:_",
      clean: "-c, --clean     clean dist directory",
      verbose: "-v, --verbose   verbose output",
      help: "-h, --help      print this help"
    },
    examples: {
      build: "$ bunx bunbuilder -b .\\src\\ts\\index.ts",
      watch: "$ bunx bunbuilder -w",
      serve: "$ bunx bunbuilder -s",
      clean: "$ bunx bunbuilder -c",
      combo: "$ bunx bunbuilder -cbswv"
    }
  },
  buildTargets: {
    browser: {
      name: "browser",
      compileExts: [".ts", ".mts"],
      buildOps: {
        copy: "copy",
        compile: "compile"
      },
      buildOptions: {
        bundleImports: false
      }
    }
  },
  options: {
    servePort: 3000,
    watchTimeout: 3000,
    echoHoldTimeout: 50,
    limitTimeoutMultiplier: 4,
    verboseHighlightColor: "cyan",
    noBundleHackImportPrefix: "@"
  }
};

// src/api/io.ts
import { styleText } from "util";
import { stdout } from "process";
var options = {
  echoHoldTimeout: data_default.options.echoHoldTimeout,
  limitTimeoutMultiplier: data_default.options.limitTimeoutMultiplier
};
var newLine = { newLine: true };
var _echoHold = {
  queue: [],
  timeout: undefined,
  limit: options.echoHoldTimeout * options.limitTimeoutMultiplier,
  queueTimer: 0
};
function _closeEchoHoldTimeout() {
  if (_echoHold.timeout && _echoHold.timeout.hasRef()) {
    _echoHold.timeout.close();
    _echoHold.timeout.unref();
  }
}
function _hewEchoStrOpts(str, options2 = undefined) {
  const echoStrOpts = {
    str,
    options: options2
  };
  return echoStrOpts;
}
function _appendEchoHold(echoStrOpts) {
  _echoHold.queue.push(echoStrOpts);
}
function _timeoutLimit() {
  if (_echoHold.queueTimer >= _echoHold.limit) {
    _closeEchoHoldTimeout();
  } else {
    _echoHold.queueTimer += options.echoHoldTimeout;
  }
}
async function _digestEchoHold() {
  const numQueued = _echoHold.queue.length;
  if (numQueued > 0) {
    for (let i = 0;i < numQueued; i++) {
      const echoStrOpts = _echoHold.queue.shift();
      if (echoStrOpts) {
        await _echo(echoStrOpts.str, echoStrOpts.options);
      }
    }
  } else {
    _timeoutLimit();
  }
}
function _queueEcho(str, options2 = undefined) {
  const echoStrOpts = _hewEchoStrOpts(str, options2);
  _appendEchoHold(echoStrOpts);
  _echoHold.queueTimer = 0;
}
function _pollEchoHold() {
  const timeout = setInterval(_digestEchoHold, options.echoHoldTimeout);
  _echoHold.timeout = timeout;
}
function _addEchoOptions(str, options2) {
  const output = { str: str.valueOf() };
  if (options2.color) {
    output.str = styleText(options2.color, str, { stream: stdout, validateStream: true });
  }
  if (options2.newLine) {
    output.str += `
`;
  }
  return output.str;
}
async function _echo(str, options2 = undefined) {
  const output = { str: str.valueOf() };
  if (options2) {
    output.str = _addEchoOptions(str, options2);
  }
  await Bun.write(Bun.stdout, output.str);
}
function _echoSync(str, options2 = undefined) {
  const output = { str: str.valueOf() };
  if (options2) {
    output.str = _addEchoOptions(str, options2);
  }
  const writer = Bun.stdout.writer();
  writer.write(output.str);
  writer.end();
}
_pollEchoHold();
var io = {
  echo: async (str, options2 = undefined) => {
    await _echo(str, options2);
  },
  echoSync: (str, options2 = undefined) => {
    _echoSync(str, options2);
  },
  queueEcho: (str, options2 = undefined) => {
    _queueEcho(str, options2);
  },
  closeEchoHoldTimeout: () => {
    _closeEchoHoldTimeout();
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
  module: "make.ts",
  type: "module",
  scripts: {
    ship: "bun run make && npm pack",
    doc: "rm -rf docs/ && jsdoc -c jsdoc.json"
  },
  bin: "bin/bunbuilder.js",
  devDependencies: {
    "@types/bun": "latest",
    "@typescript-eslint/parser": "^8.33.1",
    "clean-jsdoc-theme": "^4.3.0",
    eslint: "^9.28.0",
    jsdoc: "^4.0.4",
    prettier: "^3.5.3",
    "prettier-eslint": "^16.4.2",
    "serve-static-bun": "^0.5.3",
    typescript: "^5.8.3"
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
  const port = data_default.options.servePort.toString();
  const options2 = { label: "", str: "" };
  const label = Object.keys(data_default.help)[2] ?? "";
  options2.label = _appendHelpStr(options2.label, label.toLocaleUpperCase(), true);
  options2.str = _appendHelpStr(options2.str, data_default.help.options.build);
  options2.str = _appendHelpStr(options2.str, data_default.help.options.watch);
  options2.str = _appendHelpStr(options2.str, data_default.help.options.serve.replace("_", port));
  options2.str = _appendHelpStr(options2.str, data_default.help.options.clean);
  options2.str = _appendHelpStr(options2.str, data_default.help.options.verbose);
  options2.str = _appendHelpStr(options2.str, data_default.help.options.help);
  return options2;
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
  const options2 = _hewHelpOptions();
  const examples = _hewHelpExamples();
  const labelColor = { color: "yellow" };
  await io_default.echo(description.str);
  await io_default.echo(usage.label, labelColor);
  await io_default.echo(usage.str);
  await io_default.echo(options2.label, labelColor);
  await io_default.echo(options2.str);
  await io_default.echo(examples.label, labelColor);
  await io_default.echo(examples.str);
}
function _soloHelpCheckup(actionPlan) {
  const keys = Object.keys(actionPlan.actions);
  const numActions = keys.length;
  const isHelp = keys.includes("help") || keys.includes("?");
  if (numActions == 1 && isHelp) {
    io_default.closeEchoHoldTimeout();
  }
}
var util = {
  greet: () => {
    _greet();
  },
  printHelp: async () => {
    await _printHelp();
  },
  soloHelpCheckup: (actionPlan) => {
    _soloHelpCheckup(actionPlan);
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
  const options2 = {
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
    verbose: {
      type: "boolean",
      short: "v"
    },
    help: {
      type: "boolean",
      short: "h"
    },
    "?": {
      type: "boolean",
      short: "?"
    }
  };
  return options2;
}
function _hewParseArgsConfig() {
  const options2 = _hewParseArgsOptions();
  const config2 = {
    args: Bun.argv,
    strict: true,
    allowPositionals: true,
    options: { ...options2 }
  };
  return config2;
}
function _hewParsedFiles(parsed) {
  if (parsed.positionals.length > 2) {
    const length = parsed.positionals.length;
    const files = parsed.positionals.slice(2, length);
    return files;
  }
  return null;
}
function _hewActionPlan(parsed, files) {
  const actions = { ...parsed.values };
  const actionPlan = {
    actions: { ...actions },
    files: files == null ? undefined : [...files]
  };
  return actionPlan;
}
function _hasArgs(parsed) {
  if (Object.keys(parsed.values).length > 0)
    return true;
  return false;
}
function _processParsed(parsed) {
  if (!_hasArgs(parsed)) {
    Object.assign(parsed.values, {
      serve: true,
      watch: true,
      clean: true,
      build: true,
      verbose: true
    });
  }
  const files = _hewParsedFiles(parsed);
  const actionPlan = _hewActionPlan(parsed, files);
  util_default.soloHelpCheckup(actionPlan);
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

// src/api/buildConfig.ts
var _state = {
  config: null,
  verbose: false
};
function _setState(config2) {
  _state.config = { ...config2 };
}
function _getState() {
  if (_state.config == null) {
    throw new Error("bunbuilder config state was not set");
  } else {
    return _state.config;
  }
}
function _setVerbose(value) {
  _state.verbose = value;
}
function _getVerbose() {
  return _state.verbose;
}
var buildConfig = {
  set state(config2) {
    _setState(config2);
  },
  get state() {
    return _getState();
  },
  set verbose(value) {
    _setVerbose(value);
  },
  get verbose() {
    return _getVerbose();
  }
};
var buildConfig_default = buildConfig;

// src/api/buildOp.ts
import { extname } from "path";
function _hewBrowserCompileExts() {
  const browser = data_default.buildTargets.browser;
  const compileExts = browser.compileExts;
  return compileExts;
}
function _hewBrowserOpMap(ext) {
  const compileExts = _hewBrowserCompileExts();
  const buildOps = data_default.buildTargets.browser.buildOps;
  const opMap = {
    ext: ext.valueOf(),
    op: buildOps.copy
  };
  if (compileExts.includes(ext))
    opMap.op = buildOps.compile;
  return opMap;
}
function _inferBuildOpMap(ext) {
  const config2 = buildConfig_default.state;
  const buildTargets = data_default.buildTargets;
  const retVal = { opMap: {} };
  switch (config2.target) {
    case buildTargets.browser.name:
      const opMap = _hewBrowserOpMap(ext);
      retVal.opMap = opMap;
      break;
  }
  return retVal.opMap;
}
function _listExtensions(files) {
  const extensions = [];
  files.forEach((file) => {
    const ext = extname(file);
    if (!extensions.includes(ext))
      extensions.push(ext);
  });
  return extensions;
}
function _inferOpsMapArray(extensions) {
  const opMapArr = [];
  extensions.forEach((ext) => {
    const opMap = _inferBuildOpMap(ext);
    opMapArr.push(opMap);
  });
  return opMapArr;
}
function _inferOps(files) {
  const extensions = _listExtensions(files);
  const opMapArr = _inferOpsMapArray(extensions);
  return opMapArr;
}
var buildOp = {
  inferOps: (files) => {
    return _inferOps(files);
  }
};
var buildOp_default = buildOp;

// src/api/verbose.ts
var highlight = { color: data_default.options.verboseHighlightColor };
function _applyVerbose() {
  return buildConfig_default.verbose;
}
function _buildStart() {
  if (_applyVerbose()) {
    const config2 = buildConfig_default.state;
    io_default.echoSync("starting build...", newLine);
    io_default.echoSync("target: ");
    io_default.echoSync(config2.target, highlight);
    io_default.echoSync("", newLine);
  }
}
function _copy(file) {
  if (_applyVerbose()) {
    const config2 = buildConfig_default.state;
    io_default.echoSync("copying file ");
    io_default.echoSync(file, highlight);
    io_default.echoSync(" to ");
    io_default.echoSync(config2.options.output, highlight);
    io_default.echoSync("", newLine);
  }
}
function _buildResult(success) {
  if (_applyVerbose()) {
    if (success) {
      const options2 = { newLine: true, color: "green" };
      io_default.echoSync("build successful", options2);
    } else {
      const options2 = { newLine: true, color: "red" };
      io_default.echoSync("build failed", options2);
    }
  }
}
function _compile(file, dest) {
  if (_applyVerbose()) {
    io_default.echoSync("compiling file ");
    io_default.echoSync(file, highlight);
    io_default.echoSync(" to ");
    io_default.echoSync(dest, highlight);
    io_default.echoSync("", newLine);
  }
}
function _sigint() {
  io_default.echoSync("sigint exit cleanup", newLine);
}
function _beforeExit() {
  io_default.echoSync("cleanup", newLine);
}
function _exit() {
  io_default.echoSync("shutting down bunbuilder", newLine);
}
function _serverStart(port) {
  io_default.echoSync("starting http server on ");
  io_default.echoSync(`localhost:${port}`, highlight);
  io_default.echoSync("", newLine);
}
function _serverShutdown() {
  io_default.echoSync("shutting down http server", newLine);
}
function _watcherStart(input) {
  io_default.echoSync("starting watcher on: ");
  io_default.echoSync(input, highlight);
  io_default.echoSync("", newLine);
}
function _watcherShutdown() {
  io_default.echoSync("closing watchers", newLine);
}
function _watcherChange(file) {
  io_default.echoSync("watcher detected change: ");
  io_default.echoSync(file, highlight);
  io_default.echoSync("", newLine);
}
var verbose = {
  buildStart: () => {
    _buildStart();
  },
  buildResult: (success) => {
    _buildResult(success);
  },
  compile: (file, dest) => {
    _compile(file, dest);
  },
  copy: (file) => {
    _copy(file);
  },
  serverStart: (port) => {
    _serverStart(port);
  },
  serverShutdown: () => {
    _serverShutdown();
  },
  watcherStart: (input) => {
    _watcherStart(input);
  },
  watcherShutdown: () => {
    _watcherShutdown();
  },
  watcherChange: (file) => {
    _watcherChange(file);
  },
  sigint: () => {
    _sigint();
  },
  beforeExit: () => {
    _beforeExit();
  },
  exit: () => {
    _exit();
  }
};
var verbose_default = verbose;

// src/api/buildTask.ts
import { cp, existsSync, mkdirSync } from "fs";
import { sep as sep2 } from "path";
import { cwd as cwd2 } from "process";
function _copyFile(dir, file, dest) {
  const out = dest + sep2 + file;
  const src = dir + sep2 + file;
  const options2 = { recursive: true };
  cp(src, out, options2, (err) => {
    if (err)
      throw err;
  });
}
function _makeDestDir(dest) {
  if (!existsSync(dest)) {
    mkdirSync(dest);
  }
}
function _hewVerboseBuildPlugin(dest) {
  const plugin = {
    name: "verbose build output plugin",
    setup(build) {
      const dir = cwd2().split(sep2).pop();
      build.onLoad({ filter: /\.ts/, namespace: "file" }, (args) => {
        const path = args.path;
        const index = path.indexOf(dir);
        const relPath = path.substring(index, path.length).replace(dir, ".");
        verbose_default.compile(relPath, dest);
        return;
      });
    }
  };
  return plugin;
}
function _hewBrowserBuildConfig(files, dest) {
  const bundleImports = data_default.buildTargets.browser.buildOptions.bundleImports;
  const packages = bundleImports ? "bundle" : "external";
  const verbosePlugin = _hewVerboseBuildPlugin(dest);
  const config2 = {
    entrypoints: [...files],
    outdir: dest + sep2 + "js",
    target: "browser",
    format: "esm",
    packages,
    splitting: false,
    plugins: [verbosePlugin]
  };
  return config2;
}
function _compileTargetBrowser(dir, files, dest) {
  const src = { files: [] };
  files.forEach((file) => {
    src.files.push(dir + sep2 + file);
  });
  const buildConfig2 = _hewBrowserBuildConfig(src.files, dest);
  return Bun.build(buildConfig2);
}
function _hewBuildArtifactFiles(buildOutput) {
  const files = [];
  const dir = cwd2().split(sep2).pop();
  buildOutput.outputs.forEach((artifact) => {
    const index = artifact.path.indexOf(dir);
    const relPath = artifact.path.substring(index, artifact.path.length).replace(dir, ".");
    files.push(relPath);
  });
  return files;
}
function _prefixReplace(importString) {
  const prefix = data_default.options.noBundleHackImportPrefix;
  const newImportString = importString.replace(prefix, "./");
  return newImportString;
}
function _addJsExtension(importString) {
  const jsExt = ".js";
  if (!importString.endsWith(jsExt)) {
    importString += jsExt;
  }
  return importString;
}
async function _digestImports(transpiler, file, prefix) {
  const contents = await Bun.file(file).text();
  const newContents = { str: null };
  const newImportLine = { str: "" };
  const imports = transpiler.scanImports(contents);
  imports.forEach((bunImport) => {
    if (bunImport.kind == "import-statement" && bunImport.path.startsWith(prefix)) {
      newImportLine.str = _prefixReplace(bunImport.path);
      newImportLine.str = _addJsExtension(newImportLine.str);
      newContents.str = contents.replace(bunImport.path, newImportLine.str);
    }
  });
  if (newContents.str !== null) {
    await Bun.write(file, newContents.str);
  }
}
function _correctImports(buildOutput) {
  const files = _hewBuildArtifactFiles(buildOutput);
  const transpiler = new Bun.Transpiler;
  const prefix = data_default.options.noBundleHackImportPrefix;
  files.forEach(async (file) => {
    await _digestImports(transpiler, file, prefix);
  });
}
function _digestBuildArtifacts(buildOutput) {
  const config2 = buildConfig_default.state;
  if (config2.options.noBundleHack) {
    _correctImports(buildOutput);
  }
}
function _digestBuildOutput(buildOutput) {
  verbose_default.buildResult(buildOutput.success);
  _digestBuildArtifacts(buildOutput);
}
function _compile2(dir, files, dest) {
  const config2 = buildConfig_default.state;
  const targets = data_default.buildTargets;
  switch (config2.target) {
    case targets.browser.name:
      _compileTargetBrowser(dir, files, dest).then((buildOutput) => {
        _digestBuildOutput(buildOutput);
      });
      break;
  }
}
var buildTask = {
  copyFile: (dir, file, dest) => {
    _copyFile(dir, file, dest);
  },
  makeDestDir: (dest) => {
    _makeDestDir(dest);
  },
  compile: (dir, files, dest) => {
    _compile2(dir, files, dest);
  }
};
var buildTask_default = buildTask;

// src/api/build.ts
import { readdirSync, lstatSync } from "fs";
import { extname as extname2, sep as sep3 } from "path";
function _getFiles(dir) {
  const retVal = { files: [] };
  const files = readdirSync(dir, { encoding: "utf-8", recursive: true });
  files.filter((item) => {
    const relativePath = dir + sep3 + item;
    return lstatSync(relativePath).isFile();
  }).forEach((file) => retVal.files.push(file));
  return retVal.files;
}
function _applyBrowserBuildOp(dir, input, buildOp2) {
  const config2 = buildConfig_default.state;
  const buildOps = data_default.buildTargets.browser.buildOps;
  if (typeof input === "string") {
    switch (buildOp2) {
      case buildOps.copy:
        verbose_default.copy(input);
        buildTask_default.copyFile(dir, input, config2.options.output);
        break;
    }
  } else {
    switch (buildOp2) {
      case buildOps.compile:
        buildTask_default.compile(dir, input, config2.options.output);
        break;
    }
  }
}
function _browserOpMapBuild(dir, files, buildOpMaps) {
  const buildOps = data_default.buildTargets.browser.buildOps;
  buildOpMaps.forEach(async (opMap) => {
    const targets = files.filter((file) => extname2(file) == opMap.ext);
    if (opMap.op == buildOps.compile) {
      _applyBrowserBuildOp(dir, targets, opMap.op);
    } else {
      targets.forEach(async (target) => {
        _applyBrowserBuildOp(dir, target, opMap.op);
      });
    }
  });
}
function _opMapBuild(dir, files, buildOpMaps) {
  const config2 = buildConfig_default.state;
  const targets = data_default.buildTargets;
  switch (config2.target) {
    case targets.browser.name: {
      buildTask_default.makeDestDir(config2.options.output);
      _browserOpMapBuild(dir, files, buildOpMaps);
    }
  }
}
function _digestFiles(dir, files) {
  const buildOpMaps = buildOp_default.inferOps(files);
  _opMapBuild(dir, files, buildOpMaps);
}
function _digestInput(input) {
  for (const src of input) {
    const stat = lstatSync(src);
    if (stat.isDirectory()) {
      const files = _getFiles(src);
      _digestFiles(src, files);
    } else {}
  }
}
function _buildAll() {
  const config2 = buildConfig_default.state;
  _digestInput(config2.options.input);
}
function _inferRootDir(src, file) {
  if (src !== null) {
    const path = src + sep3 + file;
    const stat = lstatSync(path);
    if (stat.isFile()) {
      return src;
    }
  }
  throw new Error("cannot infer root directory");
}
function _buildSingle(src, file) {
  const dir = _inferRootDir(src, file);
  const files = [file];
  _digestFiles(dir, files);
}
var build = {
  all: () => {
    _buildAll();
  },
  single: (src, file) => {
    _buildSingle(src, file);
  }
};
var build_default = build;

// src/api/clean.ts
import { rmSync, readdirSync as readdirSync2 } from "fs";
import path from "path";
function _cleanOutdir() {
  const config2 = buildConfig_default.state;
  const outdir = config2.options.output;
  const options2 = { force: true, recursive: true };
  readdirSync2(outdir).forEach((item) => {
    rmSync(path.join(outdir, item), options2);
  });
}
var clean = {
  outdir: () => {
    _cleanOutdir();
  }
};
var clean_default = clean;

// src/api/shutdown.ts
var _state2 = {
  closers: {
    watchers: undefined,
    server: undefined
  }
};
function _setWatchers(value) {
  _state2.closers.watchers = value;
}
function _setServer(value) {
  _state2.closers.server = value;
}
async function _close() {
  const closers = _state2.closers;
  if (closers.watchers) {
    verbose_default.watcherShutdown();
    closers.watchers.forEach((watcher) => {
      watcher.close();
    });
  }
  if (closers.server) {
    verbose_default.serverShutdown();
    await closers.server.stop(true).then(() => {
      closers.server.unref();
    });
  }
  io_default.closeEchoHoldTimeout();
}
var shutdown = {
  close: async () => {
    await _close();
  },
  set watchers(value) {
    _setWatchers(value);
  },
  set server(value) {
    _setServer(value);
  }
};
var shutdown_default = shutdown;

// node_modules/serve-static-bun/dist/middleware/bao.js
function getBaoMiddleware(getResponse, handleErrors) {
  return async (ctx) => {
    const res = await getResponse(ctx.req);
    switch (res.status) {
      case 403:
      case 404:
        return handleErrors ? ctx.sendRaw(res).forceSend() : ctx;
      default:
        return ctx.sendRaw(res).forceSend();
    }
  };
}

// node_modules/serve-static-bun/dist/types.js
function isErrorlike(error) {
  if (typeof error !== "object" || error === null) {
    return false;
  }
  return Object.hasOwn(error, "code");
}

// node_modules/serve-static-bun/dist/utils/get-file-info.js
function getMimeType({ type }) {
  const charsetIndex = type.indexOf(";charset");
  return charsetIndex !== -1 ? type.substring(0, charsetIndex) : type;
}
async function getFileInfo(path2) {
  const info = {
    blob: Bun.file(path2),
    exists: false,
    isFile: false
  };
  try {
    await info.blob.arrayBuffer();
    info.exists = true;
    info.isFile = true;
    const mimeType = getMimeType(info.blob);
    info.mimeType = mimeType === "application/octet-stream" ? undefined : mimeType;
  } catch (error) {
    if (isErrorlike(error)) {
      switch (error.code) {
        case "EISDIR":
          info.exists = true;
          break;
      }
    }
  }
  return info;
}

// node_modules/serve-static-bun/dist/serve-static.js
function isMiddleware(options2) {
  return Object.hasOwn(options2, "middlewareMode");
}
function getPathname({ pathname }, stripFromPathname) {
  return stripFromPathname ? pathname.replace(stripFromPathname, "") : pathname;
}
async function getRedirectPath(pathname, { isFile }, { collapseSlashes: collapseSlashes2, dirTrailingSlash }) {
  let redirectPath = pathname;
  if (collapseSlashes2) {
    const pkg = await Promise.resolve().then(() => exports_collapse_slashes);
    redirectPath = pkg.collapseSlashes(redirectPath, {
      keepTrailing: redirectPath.endsWith("/")
    });
  }
  if (dirTrailingSlash && !isFile && !redirectPath.endsWith("/")) {
    redirectPath = `${redirectPath}/`;
  }
  return redirectPath;
}
async function getFileToServe(pathname, requestedFile, root, { index, dotfiles }) {
  const isDotfile = pathname.split("/").pop()?.startsWith(".");
  if (requestedFile.isFile && (!isDotfile || dotfiles === "allow")) {
    return requestedFile;
  }
  const indexFile = index === null ? null : await getFileInfo(`${root}/${pathname}/${index}`);
  if (indexFile?.exists && indexFile.isFile) {
    return indexFile;
  }
  return null;
}
function serveStatic(root, options2 = {}) {
  root = `${process.cwd()}/${root}`;
  const { index = "index.html", dirTrailingSlash = true, collapseSlashes: collapseSlashes2 = true, stripFromPathname, headers, dotfiles = "deny", defaultMimeType = "text/plain", charset = "utf-8" } = options2;
  const wantsMiddleware = isMiddleware(options2);
  const getResponse = async (req) => {
    const pathname = getPathname(new URL(req.url), stripFromPathname);
    const requestedFile = await getFileInfo(`${root}/${pathname}`);
    if (!requestedFile.exists) {
      return new Response("404 Not Found", {
        status: 404,
        headers: {
          ...headers,
          "Content-Type": `text/plain; charset=${charset}`
        }
      });
    }
    const redirectPath = await getRedirectPath(pathname, requestedFile, {
      collapseSlashes: collapseSlashes2,
      dirTrailingSlash
    });
    if (redirectPath !== pathname) {
      return new Response(undefined, {
        status: 308,
        headers: {
          ...headers,
          Location: redirectPath
        }
      });
    }
    const fileToServe = await getFileToServe(pathname, requestedFile, root, { index, dotfiles });
    if (fileToServe) {
      return new Response(fileToServe.blob, {
        headers: {
          ...headers,
          "Content-Type": `${fileToServe.mimeType ?? defaultMimeType}; charset=${charset}`
        }
      });
    }
    return new Response("403 Forbidden", {
      status: 403,
      headers: {
        ...headers,
        "Content-Type": `text/plain; charset=${charset}`
      }
    });
  };
  if (wantsMiddleware) {
    const { middlewareMode, handleErrors = false } = options2;
    switch (middlewareMode) {
      case "bao":
        return getBaoMiddleware(getResponse, handleErrors);
    }
  }
  return getResponse;
}

// node_modules/serve-static-bun/dist/index.js
var dist_default = serveStatic;

// src/api/serve.ts
function _setCloser(server) {
  shutdown_default.server = server;
}
function _startServe() {
  const config2 = buildConfig_default.state;
  const port = data_default.options.servePort;
  const server = Bun.serve({
    port,
    fetch: dist_default(config2.options.output)
  });
  _setCloser(server);
  verbose_default.serverStart(port);
}
var serve = {
  start: () => {
    _startServe();
  }
};
var serve_default = serve;

// src/api/watch.ts
import { watch as fsWatch } from "fs";
var _options = {
  timeout: data_default.options.watchTimeout
};
var _state3 = {
  pause: false
};
function _digestWatchEvent(eventType, file, src) {
  if (!_state3.pause) {
    if (eventType == "change" && file !== null) {
      verbose_default.watcherChange(file);
      build_default.single(src, file);
    }
    _state3.pause = true;
    setTimeout(() => {
      _state3.pause = false;
    }, _options.timeout);
  }
}
function _setCloser2(watchers) {
  shutdown_default.watchers = watchers;
}
function _start() {
  const config2 = buildConfig_default.state;
  const input = config2.options.input;
  const options2 = { recursive: true, persistent: true, encoding: "utf-8" };
  const watchers = [];
  input.forEach((src) => {
    verbose_default.watcherStart(src);
    const watcher = fsWatch(src, options2, (eventType, file) => {
      _digestWatchEvent(eventType, file, src);
    });
    watchers.push(watcher);
  });
  _setCloser2(watchers);
}
var watch = {
  start: () => {
    _start();
  }
};
var watch_default = watch;

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
function _takeActionBuild(files) {
  if (!files) {
    build_default.all();
  }
}
function _takeActionClean() {
  clean_default.outdir();
}
function _takeActionServe() {
  serve_default.start();
}
function _takeActionWatch() {
  watch_default.start();
}
async function _digestAction(action, files) {
  switch (action) {
    case ACTION.build:
      await verbose_default.buildStart();
      _takeActionBuild(files);
      break;
    case ACTION.clean:
      _takeActionClean();
      break;
    case ACTION.serve:
      _takeActionServe();
      break;
    case ACTION.watch:
      _takeActionWatch();
      break;
    case ACTION.help:
      await _takeActionHelp();
      break;
    default:
      await _takeActionHelp();
      break;
  }
}
async function _digestActions(actionPlan) {
  for (const action in actionPlan.actions) {
    await _digestAction(action, actionPlan.files);
  }
}
function _filterVerbose(actionPlan) {
  if (actionPlan.actions.verbose) {
    buildConfig_default.verbose = true;
    delete actionPlan.actions.verbose;
  }
}
async function _start2(actionPlan) {
  _filterVerbose(actionPlan);
  await _digestActions(actionPlan);
}
var action = {
  start: async (actionPlan) => {
    await _start2(actionPlan);
  }
};
var action_default = action;

// src/api/osEvents.ts
import process2 from "process";
async function _closer() {
  await shutdown_default.close();
}
async function _handleSigint() {
  verbose_default.sigint();
  await _closer().then(() => {
    process2.exitCode = 0;
    process2.exit();
  });
}
function _handleBeforeExit() {
  verbose_default.beforeExit();
  _closer();
}
function _handleExit() {
  verbose_default.exit();
}
function _addEventListeners() {
  process2.on("SIGINT", _handleSigint);
  process2.on("beforeExit", _handleBeforeExit);
  process2.on("exit", _handleExit);
}
function _handle() {
  _addEventListeners();
}
var osEvents = {
  handle: () => {
    _handle();
  }
};
var osEvents_default = osEvents;

// src/bunbuilder.ts
(async function() {
  function _parseConfig() {
    const conf = config_default.parse();
    buildConfig_default.state = conf;
  }
  async function _startActionPlan() {
    const actionPlan = cli_default.argsParse();
    await action_default.start(actionPlan);
  }
  async function _bunbuilder() {
    osEvents_default.handle();
    util_default.greet();
    _parseConfig();
    await _startActionPlan();
  }
  try {
    await _bunbuilder();
  } catch (e) {
    console.error(e.message);
  }
})();
