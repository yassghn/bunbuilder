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
function collapseSlashes(str, options = {}) {
  const { keepLeading = true, keepTrailing = true } = options;
  str = `/${str}/`.replaceAll(/[/]+/g, "/");
  if (!keepLeading) {
    str = str.substring(1);
  }
  if (!keepTrailing) {
    str = str.substring(0, str.length - 1);
  }
  return str;
}

// src/api/io.ts
import { styleText } from "util";
import { stdout } from "process";
var _echoHoldTimeout = 300;
var newLine = { newLine: true };
var _echoHold = {
  queue: [],
  timeout: undefined,
  limit: _echoHoldTimeout * 4,
  queueTimer: 0
};
function _closeEchoHoldTimeout() {
  if (_echoHold.timeout) {
    _echoHold.timeout.close();
  }
}
function _hewEchoStrOpts(str, options = undefined) {
  const echoStrOpts = {
    str,
    options
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
    _echoHold.queueTimer += _echoHoldTimeout;
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
function _queueEcho(str, options = undefined) {
  const echoStrOpts = _hewEchoStrOpts(str, options);
  _appendEchoHold(echoStrOpts);
  _echoHold.queueTimer = 0;
}
function _pollEchoHold() {
  const timeout = setInterval(_digestEchoHold, _echoHoldTimeout);
  _echoHold.timeout = timeout;
}
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
_pollEchoHold();
var io = {
  echo: async (str, options = undefined) => {
    await _echo(str, options);
  },
  queueEcho: (str, options = undefined) => {
    _queueEcho(str, options);
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
    "@typescript-eslint/parser": "^8.33.0",
    "clean-jsdoc-theme": "^4.3.0",
    eslint: "^9.28.0",
    jsdoc: "^4.0.4",
    prettier: "^3.5.3",
    "prettier-eslint": "^16.4.2",
    "serve-static-bun": "^0.5.3",
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
      }
    }
  },
  options: {
    servePort: 3000,
    watchTimeout: 3000
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
  const options = { label: "", str: "" };
  const label = Object.keys(data_default.help)[2] ?? "";
  options.label = _appendHelpStr(options.label, label.toLocaleUpperCase(), true);
  options.str = _appendHelpStr(options.str, data_default.help.options.build);
  options.str = _appendHelpStr(options.str, data_default.help.options.watch);
  options.str = _appendHelpStr(options.str, data_default.help.options.serve.replace("_", port));
  options.str = _appendHelpStr(options.str, data_default.help.options.clean);
  options.str = _appendHelpStr(options.str, data_default.help.options.verbose);
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
function _processParsed(parsed) {
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

// src/api/build.ts
import { readdirSync, lstatSync } from "fs";
import { extname as extname2, sep as sep3 } from "path";

// src/api/buildTask.ts
import { cp, existsSync, mkdirSync } from "fs";
import { sep as sep2 } from "path";
function _copyFile(dir, file, dest) {
  const out = dest + sep2 + file;
  const src = dir + sep2 + file;
  const options = { recursive: true };
  cp(src, out, options, (err) => {
    if (err)
      throw err;
  });
}
function _makeDestDir(dest) {
  if (!existsSync(dest)) {
    mkdirSync(dest);
  }
}
function _compileTargetBrowser(dir, files, dest) {
  const src = { files: [] };
  files.forEach((file) => {
    src.files.push(dir + sep2 + file);
  });
  Bun.build({
    entrypoints: src.files,
    outdir: dest + sep2 + "js"
  });
}
function _compile(dir, files, dest) {
  const config2 = buildConfig_default.state;
  const targets = data_default.buildTargets;
  switch (config2.target) {
    case targets.browser.name:
      _compileTargetBrowser(dir, files, dest);
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
    _compile(dir, files, dest);
  }
};
var buildTask_default = buildTask;

// src/api/verbose.ts
var cyan = { color: "cyan" };
function _applyVerbose() {
  return buildConfig_default.verbose;
}
async function _buildStart() {
  if (_applyVerbose()) {
    const config2 = buildConfig_default.state;
    await io_default.echo("starting build...", newLine);
    await io_default.echo("target: ");
    await io_default.echo(config2.target, cyan);
    await io_default.echo("", newLine);
  }
}
function _copy(file) {
  if (_applyVerbose()) {
    const config2 = buildConfig_default.state;
    io_default.queueEcho("copying file ");
    io_default.queueEcho(file, cyan);
    io_default.queueEcho(" to ");
    io_default.queueEcho(config2.options.output, cyan);
    io_default.queueEcho("", newLine);
  }
}
var verbose = {
  buildStart: async () => {
    await _buildStart();
  },
  copy: (file) => {
    _copy(file);
  }
};
var verbose_default = verbose;

// src/api/build.ts
function _getFiles(dir) {
  const retVal = { files: [] };
  const files = readdirSync(dir, { encoding: "utf-8", recursive: true });
  files.filter((item) => {
    const relativePath = dir + sep3 + item;
    return lstatSync(relativePath).isFile();
  }).forEach((file) => retVal.files.push(file));
  return retVal.files;
}
function _applyBrowserBuildOp(dir, file, buildOp2) {
  const config2 = buildConfig_default.state;
  const buildOps = data_default.buildTargets.browser.buildOps;
  if (typeof file === "string") {
    switch (buildOp2) {
      case buildOps.copy:
        verbose_default.copy(file);
        buildTask_default.copyFile(dir, file, config2.options.output);
        break;
    }
  } else {
    switch (buildOp2) {
      case buildOps.compile:
        buildTask_default.compile(dir, file, config2.options.output);
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
var build = {
  all: () => {
    _buildAll();
  }
};
var build_default = build;

// src/api/clean.ts
import { rmSync, readdirSync as readdirSync2 } from "fs";
import path from "path";
function _cleanOutdir() {
  const config2 = buildConfig_default.state;
  const outdir = config2.options.output;
  const options = { force: true, recursive: true };
  readdirSync2(outdir).forEach((item) => {
    rmSync(path.join(outdir, item), options);
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
    watcher: undefined,
    server: undefined
  }
};
function _setWatcher(value) {
  _state2.closers.watcher = value;
}
function _setServer(value) {
  _state2.closers.server = value;
}
function _close() {
  const closers = _state2.closers;
  if (closers.watcher)
    closers.watcher.close();
  if (closers.server)
    closers.server.stop();
}
var shutdown = {
  close: () => {
    _close();
  },
  set watcher(value) {
    _setWatcher(value);
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
function isMiddleware(options) {
  return Object.hasOwn(options, "middlewareMode");
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
function serveStatic(root, options = {}) {
  root = `${process.cwd()}/${root}`;
  const { index = "index.html", dirTrailingSlash = true, collapseSlashes: collapseSlashes2 = true, stripFromPathname, headers, dotfiles = "deny", defaultMimeType = "text/plain", charset = "utf-8" } = options;
  const wantsMiddleware = isMiddleware(options);
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
    const { middlewareMode, handleErrors = false } = options;
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
}
var serve = {
  start: () => {
    _startServe();
  }
};
var serve_default = serve;

// src/api/types.ts
var ACTION = {
  build: "build",
  watch: "watch",
  serve: "serve",
  clean: "clean",
  help: "help"
};

// src/api/watch.ts
import {
  watch as fsWatch,
  lstatSync as lstatSync2
} from "fs";
var _options = {
  timeout: data_default.options.watchTimeout
};
var _state3 = {
  pause: false
};
function _findFirstDir(input) {
  const dir = input.find((src) => lstatSync2(src).isDirectory());
  if (!dir) {
    const err = `cannot find a directory to watch: ${input}`;
    throw new Error(err);
  }
  return dir;
}
function _digestWatchEvent(eventType, file) {
  if (!_state3.pause) {
    console.log(eventType);
    console.log(file);
    _state3.pause = true;
    setTimeout(() => {
      _state3.pause = false;
    }, _options.timeout);
  }
}
function _setCloser2(watcher) {
  shutdown_default.watcher = watcher;
}
function _start() {
  const config2 = buildConfig_default.state;
  const dir = _findFirstDir(config2.options.input);
  const options = { recursive: true, persistent: true, encoding: "utf-8" };
  const watcher = fsWatch(dir, options, (eventType, file) => {
    _digestWatchEvent(eventType, file);
  });
  _setCloser2(watcher);
}
var watch = {
  start: () => {
    _start();
  }
};
var watch_default = watch;

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
async function _processAction(action, files) {
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
async function _processActions(actionPlan) {
  for (const action in actionPlan.actions) {
    await _processAction(action, actionPlan.files);
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
  await _processActions(actionPlan);
}
var action = {
  start: async (actionPlan) => {
    await _start2(actionPlan);
  }
};
var action_default = action;

// src/api/osEvents.ts
import process2 from "process";
function _closer(code) {
  console.log(code);
  shutdown_default.close();
}
function _addEventListeners() {
  process2.on("SIGINT", _closer);
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
