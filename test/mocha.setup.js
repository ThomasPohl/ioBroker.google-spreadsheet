"use strict";

// Makes ts-node ignore warnings, so mocha --watch does work
process.env.TS_NODE_IGNORE_WARNINGS = "TRUE";
// Sets the correct tsconfig for testing
process.env.TS_NODE_PROJECT = "tsconfig.json";
// Make ts-node respect the "include" key in tsconfig.json
process.env.TS_NODE_FILES = "TRUE";
// Force CommonJS mode
process.env.TS_NODE_COMPILER_OPTIONS = '{"module":"commonjs"}';

// Mock @iobroker/adapter-core for unit tests
const Module = require('module');
const originalRequire = Module.prototype.require;

Module.prototype.require = function (id) {
    if (id === '@iobroker/adapter-core') {
        // Return a mock adapter-core
        return {
            Adapter: class MockAdapter {
                constructor(options) {
                    this.name = options.name;
                    this.config = {};
                    this.log = {
                        info: () => {},
                        debug: () => {},
                        warn: () => {},
                        error: () => {},
                    };
                }
                on() {}
            },
        };
    }
    return originalRequire.apply(this, arguments);
};

// Don't silently swallow unhandled rejections
process.on("unhandledRejection", (e) => {
    throw e;
});

// enable the should interface with sinon
// and load chai-as-promised and sinon-chai by default
const sinonChai = require("sinon-chai");
const chaiAsPromised = require("chai-as-promised");
const { should, use } = require("chai");

should();
use(sinonChai);
use(chaiAsPromised);