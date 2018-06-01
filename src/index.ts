import { SpawnSyncReturns } from 'child_process';
import execa = require('execa');
import clamp = require('clamp');
import * as anymatch from 'anymatch';

function countCommits() {
    const { stdout } = execa.sync('git', ['rev-list', '--count', '@']) as SpawnSyncReturns<string>;
    return +stdout;
}

type Options = {
    /**
     * Filter files by this anymatch.Matcher.
     * If not set match to any file.
     * https://github.com/micromatch/anymatch#anymatch-matchers-teststring-returnindex-startindex-endindex
     * Default: null
     */
    test?: anymatch.Matcher;
    /**
     * Page size for checking git history.
     * Default: 10
     */
    size?: number;
    /**
     * Begin from commit.
     */
    from?: number;
    /**
     * End to commit.
     */
    to?: number;
    /**
     * See changes recursively (flag `-r`)
     * Default: true
     */
    recursive?: boolean;
    /** @internal */
    count?: number;
};

export function lastChangesSync({ test, size = 10, from = size, to = 0, count = countCommits(), recursive = true }: Options = {}): string[] {
    const result: string[] = [];
    if (count === 1) {
        // TODO: add --root argument
        return result;
    }
    size = clamp(size, 1, 100);
    from = clamp(from, 0, count - 1);
    const args = ['--diff-filter=AMCR', '--name-status'];
    if (recursive) {
        args.unshift('-r');
    }
    if (from === to) {
        return result;
    }
    const { stdout } = execa.sync('git', ['diff-tree'].concat(args).concat(`@~${from}..@~${to}`)) as SpawnSyncReturns<string>;
    stdout.split('\n').forEach(line => {
        const [, filepath] = line.split('\t');
        if (test != null && !anymatch(test, filepath)) {
            return;
        }
        result.push(filepath);
    });
    if (result.length === 0) {
        return lastChangesSync({ test, size, from: from + size, to: from, count });
    }
    return result;
}
