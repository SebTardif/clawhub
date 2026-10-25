# Package download filenames

Package download responses tell the browser the file name in `Content-Disposition`.

A bundle-plugin version is not semver. The zip download and the npm tarball download used to place that version inside `filename="..."`. A quote in the version ended the name and could add `filename*`, which browsers prefer, so the saved file could be `setup.jar` instead of a `.zip` or `.tgz`.

Those two responses use `contentDispositionAttachment` (`filename*=UTF-8''` plus `encodeURIComponent`). New package versions may only use letters, numbers, dots, underscores, plus, and hyphens. Code plugins and claws still have to be semver. Versions already stored are still served, and the encoded header covers them.

Plugin export zip names are built from the family and the date range. They are not package versions.
