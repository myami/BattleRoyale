# JC3:MP Command Manager
this package provides advanced command management for jc3mp. see the [default package](https://gitlab.nanos.io/jc3mp-packages/server-default-package) for examples.

## Contributing
If you wish to contribute to the default package, please follow this workflow:

1. Look for open, unassigned [issues](https://gitlab.nanos.io/jc3mp-packages/command-manager/issues) and claim them by commenting on the issue whether you can take it on.
1. If you want to implement something new, either create an issue first and wait for the response from a JC3:MP developer or work on your fork and request a merge after that. It might get rejected, however.
2. Fork the Repository
3. Work on your fork
4. Make sure `npm run test` succeeds. If necessary, edit unit tests in a separate(!) commit and explain why you change them in your merge request
4.1 new functionality should also introduce new unit tests.
5. Create a [Merge Request](https://gitlab.nanos.io/jc3mp-packages/command-manager/merge_requests)

### Code Styleguide
A code styleguide will be enforced by `eslint`, the according configuration file is in the repository. Merge requests breaking the styleguide will be rejected.

The merge request will be reviewed by a staff member and according feedback will be given. If you want to open your merge request but have not finished the feature yet, remember to start the merge request's title with `WIP: `.