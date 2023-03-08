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

As you are reading this, the project is still in its very early development phase. This means that the contuinity of the project is not yet guaranteed. I created this project in excitement to test the various ways to integrate OpenAI's GPT-3.5 API into multiple environments. Right now, I still consider this as a hobby project, rather than a long-term project. However, I am very excited about the potential of this project and I am looking forward to seeing where it will go. I will try my best to keep the project alive and continue to develop it. If you are interested in the project, please consider contributing to it! Having people other than me to keep developing the project will have a huge impact on my motivation to keep working on it and prevent it from being another one of my archived projects. 

Additionally, it is also a great time for people invested in the project to become a maintainer and help shape the future of the project. Check out the [Join The Project Team](#join-the-project-team) section for more information.

The following contribution guidelines were created in order to make the process of contributing to this project as smooth and transparent as possible. I hope that the guidelines will also make it easier for you to get involved. If you have any suggestions on how to improve this document, please don't hesitate to open an issue or pull request.

<!-- omit in toc -->
## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Useful links](#useful-links)
- [Testing](#testing)
- [Envrionment](#envrionment)
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

## Useful links

On top of the project's dependencies and devDependencies documentation, here are some useful links:

- [GPT Turbo Library Documentation](./packages/lib/README.md)
- [GPT Turbo Library on NPM](https://www.npmjs.com/package/@maxijonson/gpt-turbo)
- [GPT Turbo CLI Documentation](./packages/cli/README.md)
- [GPT Turbo CLI on NPM](https://www.npmjs.com/package/@maxijonson/gpt-turbo-cli)

## Testing

Admitting it is bad practice, the project currently does not have any tests. If the project becomes more serious, I would like to add tests to the project, especially for the library. If you are interested in helping out with this, your contributions would be greatly appreciated!

## Envrionment

Since this is a JavaScript project, you will need to have Node.js installed on your machine. You can download Node.js [here](https://nodejs.org/en/download/). The project is currently developed using Node.js v19.7.0. However, it should work with any version of Node.js that supports ESM modules, such as Node.js v12.20.0 or higher. Please reach out to me if you have any issues with this.

## I Have a Question

> If you want to ask a question, we assume that you have read the available [Documentation](https://github.com/maxijonson/gpt-turbo#readme).

Before you ask a question, it is best to search for existing [Issues](https://github.com/maxijonson/gpt-turbo/issues) that might help you. In case you have found a suitable issue and still need clarification, you can write your question in this issue. It is also advisable to search the internet for answers first.

If you then still feel the need to ask a question and need clarification, we recommend the following:

- Open an [Issue](https://github.com/maxijonson/gpt-turbo/issues/new).
- Provide as much context as you can about what you're running into.
- Provide project and platform versions (nodejs, npm, etc), depending on what seems relevant.

A `question` label will be added by the project team to your issue if it is determined that it is a question that is not yet answered and deserves to be discussed further. If your question is too out of scope for the project, it will be closed and marked as `invalid`. In that case, we recommend asking your question on Stack Overflow.

## I Want To Contribute

> ### Legal Notice <!-- omit in toc -->
> When contributing to this project, you must agree that you have authored 100% of the content, that you have the necessary rights to the content and that the content you contribute may be provided under the project license.

### Reporting Bugs

<!-- omit in toc -->
#### Before Submitting a Bug Report

A good bug report shouldn't leave others needing to chase you up for more information. Therefore, we ask you to investigate carefully, collect information and describe the issue in detail in your report. Please complete the following steps in advance to help us fix any potential bug as fast as possible.

- Make sure that you are using the latest version.
- Determine if your bug is really a bug and not an error on your side e.g. using incompatible environment components/versions (Make sure that you have read the [documentation](https://github.com/maxijonson/gpt-turbo#readme). If you are looking for support, you might want to check [this section](#i-have-a-question)).
- To see if other users have experienced (and potentially already solved) the same issue you are having, check if there is not already a bug report existing for your bug or error in the [bug tracker](https://github.com/maxijonson/gpt-turboissues?q=label%3Abug).
- Also make sure to search the internet (including Stack Overflow) to see if users outside of the GitHub community have discussed the issue.
- Collect information about the bug:
- Stack trace (Traceback)
- OS, Platform and Version (Windows, Linux, macOS, x86, ARM)
- Version of the interpreter, compiler, SDK, runtime environment, package manager, depending on what seems relevant.
- Possibly your input and the output
- Can you reliably reproduce the issue? And can you also reproduce it with older versions?

<!-- omit in toc -->
#### How Do I Submit a Good Bug Report?

> You must never report security related issues, vulnerabilities or bugs including sensitive information to the issue tracker, or elsewhere in public. Instead sensitive bugs must be sent by email to [tristan.chin@chintristan.io](tristan.chin@chintristan.io).

We use GitHub issues to track bugs and errors. If you run into an issue with the project:

- Open an [Issue](https://github.com/maxijonson/gpt-turbo/issues/new). (Since we can't be sure at this point whether it is a bug or not, we ask you not to talk about a bug yet and not to label the issue.)
- Explain the behavior you would expect and the actual behavior.
- Please provide as much context as possible and describe the *reproduction steps* that someone else can follow to recreate the issue on their own. This usually includes your code. For good bug reports you should isolate the problem and create a reduced test case.
- Provide the information you collected in the previous section.
- It can also be helpful to add screenshots, animated GIFs or even better: a [CodeSandbox](https://codesandbox.io/p/github/maxijonson/gpt-turbo/master)

Once it's filed:

- The project team will label the issue accordingly.
- A team member will try to reproduce the issue with your provided steps. If there are no reproduction steps or no obvious way to reproduce the issue, the team will ask you for those steps and mark the issue as `needs-repro`. Bugs with the `needs-repro` tag will not be addressed until they are reproduced.
- If the team is able to reproduce the issue, it will be marked `needs-fix`, as well as possibly other tags (such as `critical`), and the issue will be left to be [implemented by someone](#your-first-code-contribution).

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion for GPT Turbo, **including completely new features and minor improvements to existing functionality**. Following these guidelines will help maintainers and the community to understand your suggestion and find related suggestions.

<!-- omit in toc -->
#### Before Submitting an Enhancement

- Make sure that you are using the latest version.
- Read the [documentation](https://github.com/maxijonson/gpt-turbo#readme) carefully and find out if the functionality is already covered, maybe by an individual configuration.
- Perform a [search](https://github.com/maxijonson/gpt-turbo/issues) to see if the enhancement has already been suggested. If it has, add a comment to the existing issue instead of opening a new one.
- Check if the enhancement is already implemented in an upcoming version of the project (on the `develop` branch).
- Find out whether your idea fits with the scope and aims of the project. It's up to you to make a strong case to convince the project's developers of the merits of this feature. Keep in mind that we want features that will be useful to the majority of our users and not just a small subset. If you're just targeting a minority of users, consider writing an add-on/plugin library.

<!-- omit in toc -->
#### How Do I Submit a Good Enhancement Suggestion?

Enhancement suggestions are tracked as [GitHub issues](https://github.com/maxijonson/gpt-turbo/issues).

- Use a **clear and descriptive title** for the issue to identify the suggestion.
- Provide a **step-by-step description of the suggested enhancement** in as many details as possible.
- **Describe the current behavior** and **explain which behavior you expected to see instead** and why. At this point you can also tell which alternatives do not work for you.
- You may want to **include screenshots and animated GIFs** which help you demonstrate the steps or point out the part which the suggestion is related to. You can use [this tool](https://www.cockos.com/licecap/) to record GIFs on macOS and Windows, and [this tool](https://github.com/colinkeenan/silentcast) or [this tool](https://github.com/GNOME/byzanz) on Linux. <!-- this should only be included if the project has a GUI -->
- **Explain why this enhancement would be useful** to most GPT Turbo users. You may also want to point out the other projects that solved it better and which could serve as inspiration.

### Your First Code Contribution

The following are required for you to be able to run the project locally and contribute to it:

- [Node.js](https://nodejs.org/en/) (v12.0.0 or higher)
- [Git](https://git-scm.com/)
- NPM, which is installed with Node.js and used by the project to manage dependencies.
- After cloning the repository, run the following commands at the repository root:
  -  `npm install`: install the project dependencies. Then, run 
  -  `npm run bootstrap`: install the dependencies of each package. (or `lerna bootstrap` if you have [Lerna](https://lerna.js.org/) installed globally)
  -  `npm run dev`: if you plan on editing the library and an implementation, this will watch for changes in the library and automatically rebuild it so that the implementation can use the latest version of the library.
- Before submitting your changes, run the following commands to prevent your contribution from being rejected:
  - `npm run lint:fix`: fix linting errors that can be fixed automatically.
  - `npm run lint:strict`: check for linting errors and warnings (warnings are not allowed).

The following are recommendations that may help you setup your development environment and prevent your first contribution from being blocked due to missing or incorrect configuration.

- This project is mainly developped using [VSCode](https://code.visualstudio.com/). It is recommended to use it as well, as some extensions can help you respect the styleguides and automate some tasks.
  - [ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) for enforcing coding practices. 
  - [Prettier extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) for enforcing code formatting.

### Improving The Documentation

Documentation is an important part of any project. It's what makes it easy for new users to get started and for existing users to find the information they need. If you find a typo or a mistake in the documentation, or if you think it can be improved, please open an issue or a pull request.

## Styleguides
### Commit Messages

For the time being, we're not super strict on commit message convetions. However, it can be useful to specify your contribution's scope by prefixing your commit messages with one of the following, whichever is the most appropriate:

- `[library]`: for changes to the library.
- `[cli]`: for changes to the CLI.
- `[docs]`: for changes to the documentation **not related to the library or one of its implementations**. (e.g. changes to the root README.md file or this contributing guide)

## Join The Project Team

We would be glad to have you as a project maintainer! We are looking for people who have solid experience with [TypeScript](https://www.typescriptlang.org/). It's also a plus if you have experience in the technologies used by the library and its implementations, such as [OpenAI's Node.js Library](https://www.npmjs.com/package/openai), [React](https://reactjs.org/) and [Ink](https://github.com/vadimdemedes/ink). If you're interested, please open an issue and tell us a bit about yourself and your experience! We'd love to hear from you.

<!-- omit in toc -->
## Attribution
This guide is based on the **contributing-gen**. [Make your own](https://github.com/bttger/contributing-gen)!