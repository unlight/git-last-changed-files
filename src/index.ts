import { SpawnSyncReturns } from 'child_process';
import execa = require('execa');
import clamp = require('clamp');
import * as anymatch from 'anymatch';

function countCommits() {
    const { stdout } = execa.sync('git', ['rev-list', '--count', '@']) as SpawnSyncReturns<string>;
    return +stdout;
}

type Options = {
    test?: anymatch.Matcher;
    size?: number;
    from?: number;
    to?: number;
    count?: number;
    recursive?: boolean;
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
