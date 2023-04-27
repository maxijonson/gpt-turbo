<!-- omit in toc -->
# Contributing to GPT Turbo

First off, thanks for taking the time to contribute! ❤️

All types of contributions are encouraged and valued. See the [Table of Contents](#table-of-contents) for different ways to help and details about how this project handles them. Please make sure to read the relevant section before making your contribution. It will make it a lot easier for us maintainers and smooth out the experience for all involved. The community looks forward to your contributions. 🎉

> And if you like the project, but just don't have time to contribute, that's fine. There are other easy ways to support the project and show your appreciation, which we would also be very happy about:
>
> - Star the project
> - Tweet about it
> - Refer this project in your project's readme
> - Mention the project at local meetups and tell your friends/colleagues

<!-- omit in toc -->
## ⚠⚠⚠ Early Development Phase ⚠⚠⚠

As I write this, my project is still in its early stages and its future is uncertain. I started this project as a hobby to experiment with OpenAI's GPT Chat Completion API across multiple environments, and while I'm excited about its potential, I'm not yet committed to it as a long-term project. However, I'm eager to see where it goes and will do my best to continue developing it. I encourage others to contribute to the project as well, as it will motivate me and prevent it from becoming another abandoned project. If you're interested in joining the project team, consult the last section of the contribution guidelines for more information. If you have suggestions for improving the guidelines, you are welcome to open an issue or pull request.

<!-- omit in toc -->
## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [I Have a Question](#i-have-a-question)
- [I Want To Contribute](#i-want-to-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Enhancements](#suggesting-enhancements)
  - [Your First Code Contribution](#your-first-code-contribution)
  - [Improving The Documentation](#improving-the-documentation)
- [Styleguides](#styleguides)
  - [Commit Messages](#commit-messages)
- [Join The Project Team](#join-the-project-team)

## Code of Conduct

This project and everyone participating in it is governed by the [GPT Turbo Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to [tristan.chin@chintristan.io](mailto:tristan.chin@chintristan.io).

## I Have a Question

> Before asking a question through the issues, please read the available [Documentation](https://github.com/maxijonson/gpt-turbo#readme).

Before you ask a question, it is best to search for existing [Issues](https://github.com/maxijonson/gpt-turbo/issues) that might help you. In case you have found a suitable issue and still need clarification, you can write your question in this issue. It is also advisable to search the internet for answers first.

If you then still feel the need to ask a question and need clarification, here's how you can reach out:

- [Open an Issue](https://github.com/maxijonson/gpt-turbo/issues/new/choose).
- Provide as much context as you can about what you're running into.
- Provide project and platform versions (nodejs, npm, etc), depending on what seems relevant.

A `question` label will be added by the project team to your issue if it is determined that it is a question that is not yet answered and deserves to be discussed further. If your question is too out of scope for the project, it will be closed and marked as `invalid`. In that case, its is recommended to ask your question on Stack Overflow.

## I Want To Contribute

> ### Legal Notice <!-- omit in toc -->
> When contributing to this project, you must agree that you have authored 100% of the content, that you have the necessary rights to the content and that the content you contribute may be provided under the project license.

### Reporting Bugs

<!-- omit in toc -->
#### Before Submitting a Bug Report

A good bug report shouldn't leave others needing to chase you up for more information. Therefore, please investigate carefully, collect information and describe the issue in detail in your report. Please complete the following steps in advance to help us fix any potential bug as fast as possible.

- Make sure that you are using the latest version.
- Rule out that the issue is not caused by any of your customizations e.g. customized configurations.
- Avoid opening duplicate issues by searching through the [existing bugs](https://github.com/maxijonson/gpt-turbo/issues?q=label:bug).
- Make sure that your bug can be **reproduced**.
- Collect information about the bug:
  - Input / Output
  - Stack trace (Traceback)
  - Screenshots
  - If relevant, your configuration parameters (e.g. for the `Conversation` class, without your API key of course)

<!-- omit in toc -->
#### How Do I Submit a Good Bug Report?

> **Never report security issues publicly**. Instead, send the details of the issue by email, to [tristan.chin@chintristan.io](mailto:tristan.chin@chintristan.io).

If you run into an issue with the project:

- [Open an Issue](https://github.com/maxijonson/gpt-turbo/issues/new/choose) using the "Bug Report" issue template.

Once it's filed:

- The project team will label the issue accordingly.
- A team member will try to reproduce the issue with your provided steps. If there are no reproduction steps or no obvious way to reproduce the issue, the team will ask you for those steps and mark the issue as `needs-repro`. Bugs with the `needs-repro` tag will not be addressed until they are reproduced.
- If the team is able to reproduce the issue, it will be marked `bug`, as well as possibly other tags (such as `critical`), and the issue will be left to be [implemented by someone](#your-first-code-contribution).

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion for GPT Turbo, **including completely new features and minor improvements to existing functionality**. Following these guidelines will help maintainers and the community to understand your suggestion and find related suggestions.

<!-- omit in toc -->
#### Before Submitting an Enhancement

- Make sure that you are using the latest version. Maybe the feature you are looking for has already been implemented.
- Perform a [search](https://github.com/maxijonson/gpt-turbo/issues?q=label:enhancement) to see if the enhancement has already been suggested. If it has, add a comment to the existing issue instead of opening a new one.
- Take some time to think whether your idea fits within the scope of the project. New features should benefit the majority of our users and not just a small subset. If you're just targeting a minority of users, consider writing an add-on/plugin library. If you're unsure, you can open an issue and ask for feedback.

<!-- omit in toc -->
#### How Do I Submit a Good Enhancement Suggestion?

Enhancement suggestions are tracked as [GitHub enhancement issues](https://github.com/maxijonson/gpt-turbo/issues?q=label:enhancement).

- [Open an Issue](https://github.com/maxijonson/gpt-turbo/issues/new/choose) using the "Feature Request" issue template.

Once it's filed:

- The project team will label the issue accordingly.
- The enhancement will be evaluated to determine whether it is within the scope of the project. 
- If the enhancement is within the scope of the project, it will be marked `enhancement` and the issue will be left to be [implemented by someone](#your-first-code-contribution).

### Your First Code Contribution

The following are required for you to be able to run the project locally and contribute to it:

- [Node.js](https://nodejs.org/en/) (v12.0.0 or higher)
- [Git](https://git-scm.com/)
- NPM, which is installed with Node.js and used by the project to manage dependencies.

Follow these steps to get your development environment set up:

1. Fork the repository. (`develop` branch)
2. Clone your forked repository locally.
3. Create a new branch for your changes.
4. Run the following commands at the repository root:
   1. `npm install`: install the mono-repo dependencies.
   2. `npm run bootstrap`: install the dependencies of each package. (or `lerna bootstrap` if you have [Lerna](https://lerna.js.org/) installed globally)
   3. `npm run dev`: if you plan on editing both the library and an implementation, this will watch for changes in the library and automatically rebuild it so that the implementation can use the latest version of the library.

You're now all set to start contributing! Make your changes, commit them and push them to your forked repository. Then, open a pull request to the `develop` branch of the main repository.

Before submitting your changes, run the following commands to prevent your contribution from being rejected:

1. `npm run lint:fix`: fix linting errors that can be fixed automatically.
2. `npm run lint:strict`: check for linting errors and warnings (warnings are not allowed).

> This project is mainly developped using [VSCode](https://code.visualstudio.com/). It is recommended to use it as well, as some extensions can help you respect the styleguides and automate some tasks.
> - [ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) for enforcing coding practices. 
> - [Prettier extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) for enforcing code formatting.

### Improving The Documentation

Documentation is an important part of any project. It's what makes it easy for new users to get started and for existing users to find the information they need. If you find a typo or a mistake in the documentation, or if you think it can be improved, please open an issue or a pull request.

## Styleguides
### Commit Messages

Since commits are squashed when merged into the `develop` branch, there are no strict rules for commit messages. However, if your PR is pretty big, contains many commits and/or affects multiple packages, it is recommended to use the following prefixes for your commit messages:

- `[library]`: for changes to the library or its documentation.
- `[cli]`: for changes to the CLI implementation or its documentation.
- `[web]`: for changes to the Web implementation or its documentation.
- `[nest]`: for changes to the Nest implementation or its documentation.
- `[discord]`: for changes to the Discord implementation or its documentation.
- `[docs]`: for changes to the documentation **not related to the library or one of its implementations**. (e.g. changes to the root README.md file or this contributing guide)

## Join The Project Team

Are you interested in becoming a maintainer of this project? As of now, the project is maintained by a single person, and it would be great to have more people involved beyond contributors! The only requirement I am looking for is a solid experience with [TypeScript](https://www.typescriptlang.org/), since it is at the core of the project. 

It's also a plus if you have experience in the technologies used by the library and its implementations:
- [OpenAI's API](https://platform.openai.com/docs/api-reference/chat)
- [React](https://reactjs.org/)
- [Ink](https://github.com/vadimdemedes/ink)
- and more
 
If you're interested, please [open an issue](https://github.com/maxijonson/gpt-turbo/issues/new/choose) (or email [tristan.chin@chintristan.io](mailto:tristan.chin@chintristan.io) with the same fields as the maintainer application template) and tell us a bit about yourself and your experience! We'd love to hear from you.

<!-- omit in toc -->
## Attribution
This guide is based on the **contributing-gen**. [Make your own](https://github.com/bttger/contributing-gen)!