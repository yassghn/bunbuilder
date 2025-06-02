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
    ship: "bun run build && npm pack"
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

// src/api/util.ts
function _hewPackageInfoString() {
  const name = package_default.name;
  const version = package_default.version;
  const info = [name, " ", "v", version];
  return info.join("");
}
var util = {
  hewPackageInfoString: () => {
    return _hewPackageInfoString();
  }
};
var util_default = util;

// src/api/build.ts
function _buildGreet() {
  const info = util_default.hewPackageInfoString();
  io_default.echo(info, { newLine: true, color: "green" });
}
function _buildAll() {}
var build = {
  greet: () => {
    _buildGreet();
  },
  all: () => {
    _buildAll();
  }
};
var build_default = build;
// data/data.json
var data_default = {
  configFileName: "bunbuilder.config.json"
};

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

// src/bunbuilder.ts
(async function() {
  function _bunbuilder() {
    build_default.greet();
    const conf = config_default.parse();
    console.dir(conf);
  }
  try {
    _bunbuilder();
  } catch (e) {
    console.error(e);
  }
})();
