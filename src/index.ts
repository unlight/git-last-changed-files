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
};

export function lastChangesFilesSync({ test }: Options = {}): string[] {
    const result: string[] = [];
    const count = countCommits();
    let from = clamp(count - 1, 0, 100);
    let to = 0;
    const { stdout } = execa.sync('git', ['diff-tree', '-r', '--diff-filter=AMCR', '--name-status', `@{${from}}..@{${to}}`]) as SpawnSyncReturns<string>;
    stdout.split('\n').forEach(line => {
        const [, filepath] = line.split('\t');
        if (test != null && !anymatch(test, filepath)) {
            return;
        }
        result.push(filepath);
    });
    return result;
}
