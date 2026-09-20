# Guide for AI Agents

This file describes how to implement a feature in the `ioBroker.google-spreadsheet` adapter completely. A feature is usually a vertical contract: a `sendTo` command, its validation and API operation, public documentation, an optional Blockly block, and matching tests.

## Quick orientation

| Area | Source | Responsibility |
| --- | --- | --- |
| Public API | `src/main.ts` | Register the command, call the handler, and return callbacks and errors |
| Message logic | `src/lib/messageHandlers/*.ts` | Read the payload, validate fields and values, and forward aliases |
| Google API | `src/lib/google.ts` | Build the Google client and execute the Sheets/Drive operation |
| Handler exports | `src/lib/messageHandlers/index.ts` | Export handlers for `main.ts` |
| Blockly group | `admin/blockly.js` | Register the Blockly category, instance/alias selection, and block files |
| Blockly block | `admin/blocks/<feature>.js` | Define the block and generate JavaScript for `sendTo` |
| Translations | `admin/blocks/<feature>.js`, `admin/i18n/*/translations.json` | Localize block text and admin text |
| Feature docs | `docs/features/<feature>.md` | Document parameters, results, Blockly notes, and JavaScript examples |
| API overview | `docs/sendTo-API.md` | Maintain the command table and feature links |
| README | `README.md` | Maintain the feature list and general usage documentation |
| Changelogs | `README.md`, `io-package.json` | Record feature changes in the README changelog and the matching adapter release news |
| Tests | `test/unit/**/*.test.ts` | Verify handler, validation, and Google API behavior |
| Build output | `build/` | Generated JavaScript files; never edit these as the primary source |

## Before editing

1. Find a similar feature. `append` is a good example of a simple operation; `writeCells` demonstrates a Blockly block with nested inputs.
2. Define the public contract first: command name, payload fields, optional `alias` semantics, callback result, and error cases.
3. Check the naming conventions in the existing API. Newer cell commands use `sheet`, `cell`, and `value`; some handlers still accept `sheetName` and `data` as deprecated names.
4. Determine whether the Google endpoint uses a `values.*` call or `spreadsheets.batchUpdate`. The API documentation must name the endpoint that the implementation actually uses.

## Implementation flow

### 1. Core operation

Add a public method to `src/lib/google.ts` with clear parameters and a `Promise` return type. The method should:

- use `this.init()` to create the Google client;
- use `getSpreadsheetId(alias)` for the configured spreadsheet;
- use `prepareValues()` to create the two-dimensional format expected by Google where appropriate;
- log Google errors and reject with a readable `Error` message;
- contain no adapter-dispatch or Blockly code.

Alias resolution and authentication belong in this layer. A feature must not interpret adapter configuration or private keys itself.

### 2. Message handler

Add the domain-specific handler to `src/lib/messageHandlers/`, or create a new file for a new category. The handler must:

- read payload data from `message.message`;
- validate required fields before calling Google;
- validate format constraints that belong to message handling, such as A1 cell references;
- log missing or invalid parameters;
- call exactly one `SpreadsheetUtils` method and forward `alias`;
- reject invalid input with `Promise.reject(new Error(...))`.

Export the handler from `src/lib/messageHandlers/index.ts`.

### 3. Adapter dispatch

Register the command in the local `handlers` map inside `onMessage` in `src/main.ts`. The existing dispatch handles logging, promise resolution, and error responses. Successful callback results are sent with `sendTo`; errors are returned as `{ error: error.message }`.

`io-package.json` already enables `messagebox: true`. Change this file only when the adapter capability itself changes.

### 4. Blockly

If the feature should be available in Blockly:

1. Define the block in `admin/blocks/<feature>.js` under `Blockly.Blocks[...]`.
2. Implement its generator under `Blockly.JavaScript.forBlock[...]`.
3. Use `getInstances()` for instance/alias selection and `getInstanceAndAlias()` to read it.
4. Generated JavaScript must use exactly the public `sendTo` payload. Blockly must not call the internal Google API directly.
5. Load the file from `admin/blockly.js` with `loadJS('../google-spreadsheet/blocks/<feature>.js')`.
6. For complex inputs, such as `writeCells`, register helper blocks and toolbox entries in the same block file.
7. Add asynchronous waiting only when it matches the existing blocks and the feature's intended behavior.

Block text is currently defined directly in block files as `Blockly.Words` entries in English and German. If new admin configuration keys are needed, maintain them in the language files under `admin/i18n/` as well.

### 5. Documentation

For every new public feature:

- create `docs/features/<feature>.md`;
- name the Google API endpoint used;
- document required and optional parameters, including `alias`;
- document callback success and error formats;
- explain Blockly behavior and special cases;
- include a realistic `sendTo` example;
- update the command table and feature links in `docs/sendTo-API.md`;
- update the feature list in `README.md`.
- add the feature to the `WORK IN PROGRESS` changelog in `README.md`;
- add the corresponding English release note to `common.news` in `io-package.json` when preparing the release.

Documentation must reflect the payload actually generated by the block and accepted by the handler. Pay particular attention to differences between legacy parameters (`sheetName`, `data`) and current parameters (`sheet`, `value`).

### 6. Tests

Cover at least these layers:

- handler tests under `test/unit/messageHandlers/`: required fields, invalid formats, aliases, and forwarding to `SpreadsheetUtils`;
- Google API tests under `test/unit/google.test.ts`: concrete request, range, payload, alias, and relevant errors;
- `test/unit/main.test.ts` when dispatch, callback responses, or adapter behavior are affected;
- manually verify the Blockly generator, or add a test when the block creates a complex payload structure.

Google calls are mocked in unit tests. Never use real Google credentials or network access in unit tests.

## Build, validation, and artifacts

Typical local validation order:

```sh
npm run check
npm run test:unit
npm run test:package
npm run lint
npm run build
```

`build/` is generated from `src/` by `npm run build` and must not be edited manually as a substitute for changing source files. Do not reset pre-existing local changes in `build/` without explicit permission. After a build, verify that only expected generated files changed.

For documentation-only changes, `npm run check` and `npm run test:unit` are usually sufficient; `npm run test:package` is important when new files are added to the package. For Blockly or package-file changes, also run `npm run build` and the package test.

## Pull request checklist

- [ ] Public command and payload are defined.
- [ ] `src/lib/google.ts` executes the concrete Google operation.
- [ ] The handler validates input and is exported.
- [ ] The command is registered in `src/main.ts`.
- [ ] The Blockly block is loaded and creates the same payload as the API docs.
- [ ] New visible text is localized.
- [ ] Feature docs, API overview, and README are synchronized.
- [ ] Affected unit tests and package checks pass.
- [ ] No secrets, credentials, or manually generated build files were added as source.
