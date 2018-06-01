import assert = require('assert');
import * as lib from './index';

it('smoke', () => {
    assert(lib);
});

it('without options first matching file', () => {
    const result = lib.lastChangesSync({ size: 1 });
    assert(result.length > 0);
});

it('empty range', () => {
    const result = lib.lastChangesSync({ from: 1, to: 1 });
    assert.deepEqual(result, []);
});

if (!process.env.CI) {

    it('negative matching', () => {
        const result = lib.lastChangesSync({ test: /^((?!spec\.ts).)*\.ts$/g });
        assert.equal(result.length, 1);
        assert.equal(result[0], 'src/index.ts');
    });

    it('return readme', () => {
        const result = lib.lastChangesSync({ test: 'README.md' });
        assert.equal(result.length, 1);
        assert.equal(result[0], 'README.md');
    });

    it('find file in deep of commits', () => {
        const result = lib.lastChangesSync({ test: '.editorconfig' });
        assert.equal(result.length, 1);
        assert.equal(result[0], '.editorconfig');
    });

}
