# Contributing manual

**Table of contents:**

- [Make a contribution](#make-a-contribution)
- [Coding standards](#coding-standards)
- [Documentation standards](#documentation-standards)
- [Engineering tasks](#engineering-tasks)

## Make a contribution

Here are some ways you can contribute:

- Open a new issue [here](https://github.com/HookTools/eosio-local-ide/issues) (please check the issue does not already exist).
- Work on an existing issue (check out the [good first issues list](https://github.com/HookTools/eosio-local-ide/issues/1) on our public project board).

Please comment on the issue that you're interested in working on. Also, check out the [coding standards](#coding-standards) and [documentation standards](#documentation-standards) before you start working on the pull request.

## Coding standards

This section describes our coding standards.

### Pull requests

**It is important you use the correct commit type**. For minor semver bumps, use `feat`, for patches use `fix`. For a major bump use `feat(scope)!` or `fix(scope)!`. If you use `chore`, `docs`, or `ci`, then it won't result in a release-please PR or version bump.

Specify the scope of your change with a [conventional commit](https://www.conventionalcommits.org/en/v1.0.0/) in the PR title (for example, `feat(scope): description of feature`). This will be squashed and merged into the `main` branch.

Because we squash all of the changes into a single commit, please try to keep the PR limited to the scope specified in the commit message. This commit message will end up in the automated changelog by checking which packages are affected by the commit.

For example, `feat(scope): description of feature` should only impact the `scope` package. If your change is a global one, you can use `feat: description of feature`, for example.

#### Naming conventions

To maintain clarity and consistency across our Solidity codebase, the following naming conventions are to be adhered to:

- **Function Parameters:** Prefix all function parameters with a leading underscore (`_`) to distinguish them from local and global variables and avoid naming conflicts.
- **Function Return Values:** Suffix names of function return variables with an underscore (`_`) to clearly differentiate them from other variables and parameters.
- **Private Functions:** Prefix private function names with a leading underscore (`_`). This convention signals the function's visibility level at a glance.
- **Private State Variables:** Prefix all private state variable names with a leading underscore (`_`), highlighting their limited scope within the contract.

#### Reserved storage slots

To ensure upgradeability and prevent storage collisions in future contract versions, reserve a fixed number of storage slots at the end of each contract. This is achieved by declaring a placeholder array in the contract's storage layout as follows:

> Note: Replace `xx` with the actual number of slots you intend to reserve, as shown in the example above.

#### Single tag

Always use a single tag, for example do not do this:

```
/// @dev Here is a dev comment.
/// @dev Here is another dev comment.
```

Instead, combine them into a single comment.

#### Comment style

Choose `///` over `/** */` for multi-line NatSpec comments for consistency. All NatSpec comments should use `///` instead of `/** */`. Additional explanatory comments should use `//`, even for multi-line comments.

#### Notice tag

Explicitly use `@notice`, don't let the compiler pick it up automatically:

```
/// This is a notice.
```

becomes this:

```
/// @notice This is a notice.
```

#### Annotation indentation

For multi-line annotations, do not "align". For example, this is **wrong**:

```
/**
 * Here is a comment.
 * @param someParam Here is a long parameter blah blah blah
 *        and I wrap it to here.
 * @return someThing Here is a long return parameter blah
 *                   and I wrap it to here.
 */
```

This is **correct**:

```
/**
 * Here is a comment.
 * @param someParam Here is a long parameter blah blah blah
 * and I wrap it to here.
 * @return someThing Here is a long return parameter blah
 * and I wrap it to here.
 */
```

#### Extra line breaks

Use extra line breaks as you see fit. By default, do not use them unless it improves the readability.

This is **preferred**:

```
/**
 * Here is a comment.
 * @param someParam Here is a long parameter blah blah blah
 * and I wrap it to here.
 * @return someThing Here is a long return parameter blah
 * and I wrap it to here.
 */
```

This is also **okay**:

```
/**
 * Here is a comment.
 *
 * @param someParam Here is a long parameter blah blah blah
 * and I wrap it to here.
 * @return someThing Here is a long return parameter blah
 * and I wrap it to here.
 */
```

#### Additional comments

You can use additional comments with `//`. These can be above what it is describing **or** to the side. Try to remain consistent in what you are commenting. Do not use `/* */`. You can align comments on the side or not, whichever improves readability.

This is **correct**:

```
interface Some {
  // This is foo
  number foo;
  number bar; // This is bar
}
```

This is **wrong**:

```
interface Some {
  string foo; /* This is foo */
}
```

#### Periods

Periods are optional for comments, but recommended if it's a proper sentence. However, remain consistent in whatever file or section you are commenting.

This is **correct**:

```
interface Some {
  // This is foo
  number foo;
}
```

This is **wrong**:

```
struct Some {
  // This is foo.
  number foo;
  // This is bar
  number bar;
}

#### Mentioning other files in the repo

To mention another contract file in the repo use the standard like this:

```solidity
/// @notice See the documentation in {eosio}
```

#### Documenting internal functions and structs

Internal functions and structs should commented with a `@dev` tag, and you can also comment the contents of the struct with explanatory comments.

#### Documenting user-facing functions versus internal functions

All user-facing functions should be fully documented with NatSpec. Internal functions should always be commented with a `@dev` tag, not a `@notice` tag.

#### Explanatory comments

Explanatory comments use `//`. There is a common idea that the code describes the documentation. There are pros to this approach. One of the pros is that you remove the coupling between documentation and the code it's describing, that's why we should always strive for the [minimum viable documentation](https://google.github.io/styleguide/docguide/best_practices.html#minimum-viable-documentation) (one of our core documentation [philosophies](#philosophies)). It can also appear cleaner.

### Philosophies

- Create the minimum viable documentation.
- Don't repeat yourself, use links to existing documentation or inherit it.
- Keep documentation close to what it's describing (for example, in the source code).

### Writing style

Use the [Microsoft Writing Style Guide](https://learn.microsoft.com/en-us/style-guide/welcome/) as a base point of reference for writing style. Generally, don't worry too much about things like typos. What's more important is following the basic [philosophies](#philosophies) outlined above and following structural standards for highly readable and minimal documentation.

For consistency throughout the project, please use **American English**.
