import assert = require('assert');
import * as lib from './index';

it('smoke', () => {
    assert(lib);
});

it('without options first matching file', () => {
    const result = lib.lastChangesFilesSync();
    assert(result.length > 0);
});

it('return readme', () => {
    const result = lib.lastChangesFilesSync({ test: 'README.md' });
    assert.equal(result.length, 1);
    assert.equal(result[0], 'README.md');
});
