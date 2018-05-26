# git-last-changed-files
Get last changed files from git history commits

INSTALL
---
```
npm install git-last-changed-files
```

USAGE
---
```ts
import { lastChangesFilesSync } from 'git-last-changed-files';

lastChangesFilesSync({ test, size = 10, from = size, to = 0, count = countCommits() })
```

CHANGELOG
---
See [CHANGELOG.md](CHANGELOG.md)
