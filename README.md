# git-last-changed-files
Get last changed files from git history commits
Uses `git diff-tree` under the hood.

INSTALL
---
```
npm install git-last-changed-files
```

USAGE
---
```ts
import { lastChangesSync } from 'git-last-changed-files';

lastChangesSync(options: Options): string[]
```

API
---
```ts
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
     */
    recursive?: boolean;
};
```

CHANGELOG
---
See [CHANGELOG.md](CHANGELOG.md)
