// @bun
// src/bunbuilder.ts
import util from "api/util";
import config from "api/config";
import cli from "api/cli";
import action from "api/action";
import buildConfig from "api/buildConfig";
import osEvents from "api/osEvents";
(async function() {
  function _parseConfig() {
    const conf = config.parse();
    buildConfig.obj = conf;
  }
  async function _startActionPlan() {
    const actionPlan = cli.argsParse();
    await action.start(actionPlan);
  }
  async function _bunbuilder() {
    osEvents.handle();
    util.greet();
    _parseConfig();
    await _startActionPlan();
  }
  try {
    await _bunbuilder();
  } catch (e) {
    console.error(e.message);
  }
})();
