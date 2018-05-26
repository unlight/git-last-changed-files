import { SpawnSyncReturns } from 'child_process';
import execa = require('execa');
import clamp = require('clamp');
import * as anymatch from 'anymatch';

function countCommits() {
    const { stdout } = execa.sync('git', ['rev-list', '--count', '@{0}']) as SpawnSyncReturns<string>;
    return +stdout;
}

type Options = {
    test?: anymatch.Matcher;
    size?: number;
    from?: number;
    to?: number;
    count?: number;
};

export function lastChangesFilesSync({ test, size = 10, from = size, to = 0, count = countCommits() }: Options = {}): string[] {
    const result: string[] = [];
    if (count === 1) {
        // TODO: add --root argument
        return result;
    }
    size = clamp(size, 1, 100);
    from = clamp(from, 0, count);
    const { stdout } = execa.sync('git', ['diff-tree', '-r', '--diff-filter=AMCR', '--name-status', `@{${from}}..@{${to}}`]) as SpawnSyncReturns<string>;
    stdout.split('\n').forEach(line => {
        const [, filepath] = line.split('\t');
        if (test != null && !anymatch(test, filepath)) {
            return;
        }
        result.push(filepath);
    });
    if (result.length === 0) {
        return lastChangesFilesSync({ test, size, from: from + size, to: from, count });
    }
    return result;
}
