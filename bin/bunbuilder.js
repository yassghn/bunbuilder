// @bun
// api/io.ts
var io = {
  echo: (str, newline = false) => {
    const output = { str: str.valueOf() };
    if (newline) {
      output.str += `
`;
    }
    Bun.write(Bun.stdout, output.str);
  }
};
var io_default = io;

// api/build.ts
var build = {
  greet: () => {
    const greeting = ["bunbuilder", "greet"];
    greeting.forEach((str) => io_default.echo(str));
  },
  buildAll: (options) => {
    console.log(options);
  }
};
var build_default = build;
// package.json
var package_default = {
  name: "bunbuilder",
  version: "0.0.1",
  description: "build bun apps",
  author: "yassghn@protonmail.com",
  license: "SEE LICENSE IN license",
  module: "index.ts",
  type: "module",
  scripts: {},
  bin: "dist/bunbuilder.exe",
  devDependencies: {
    "@types/bun": "latest",
    "@typescript-eslint/parser": "^8.33.0",
    eslint: "^9.27.0",
    prettier: "^3.5.3",
    "prettier-eslint": "^16.4.2",
    tar: "^7.4.3",
    typescript: "^5.8.3"
  }
};

// build/bunbuilder.ts
function _hewPackageInfoString() {
  const info = [package_default.name, "-", "v", package_default.version];
  return info.join("");
}
function _bunbuilder(options) {
  console.log(_hewPackageInfoString());
  console.log(options);
}
function bunbuilder(options) {
  _bunbuilder(options);
  build_default.buildAll(options);
}
var bunbuilder_default = bunbuilder;

// index.ts
console.log("bunbuilder");
var bunbuilder_default2 = bunbuilder_default;
export {
  bunbuilder_default2 as default
};
