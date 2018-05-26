import assert = require('assert');
import * as lib from './index';

it('smoke', () => {
    assert(lib);
});

it('without options first matching file', () => {
    const result = lib.lastChangesFilesSync({ size: 1 });
    assert(result.length > 0);
});

if (!process.env.CI) {

    it('return readme', () => {
        const result = lib.lastChangesFilesSync({ test: 'README.md' });
        assert.equal(result.length, 1);
        assert.equal(result[0], 'README.md');
    });

    it('find file in deep of commits', () => {
        const result = lib.lastChangesFilesSync({ test: '.editorconfig' });
        assert.equal(result.length, 1);
        assert.equal(result[0], '.editorconfig');
    });

}
