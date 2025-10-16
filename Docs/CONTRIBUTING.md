# Contributing to Company Registration System

Thank you for your interest in contributing to the Company Registration System! We welcome contributions from the community and are excited to work with you.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project team.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title** for the issue to identify the problem.
- **Describe the exact steps which reproduce the problem** in as many details as possible.
- **Provide specific examples to demonstrate the steps**.
- **Describe the behavior you observed after following the steps** and point out what exactly is the problem with that behavior.
- **Explain which behavior you expected to see instead and why.**
- **Include screenshots and animated GIFs** which show you following the described steps and clearly demonstrate the problem.

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Use a clear and descriptive title** for the issue to identify the suggestion.
- **Provide a step-by-step description of the suggested enhancement** in as many details as possible.
- **Provide specific examples to demonstrate the steps**.
- **Describe the current behavior and explain which behavior you expected to see instead** and why.
- **Explain why this enhancement would be useful** to most users.

### Pull Requests

The process described here has several goals:

- Maintain the project's quality
- Fix problems that are important to users
- Engage the community in working toward the best possible product
- Enable a sustainable system for the project's maintainers to review contributions

Please follow these steps to have your contribution considered by the maintainers:

1. Follow all instructions in [the template](PULL_REQUEST_TEMPLATE.md)
2. Follow the [styleguides](#styleguides)
3. After you submit your pull request, verify that all status checks are passing

While the prerequisites above must be satisfied prior to having your pull request reviewed, the reviewer(s) may ask you to complete additional design work, tests, or other changes before your pull request can be ultimately accepted.

## Styleguides

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line
- When only changing documentation, include `[ci skip]` in the commit title

### JavaScript Styleguide

All JavaScript code must adhere to [JavaScript Standard Style](https://standardjs.com/).

- Prefer the object spread operator (`{...anotherObj}`) to `Object.assign()`
- Inline `export`s with expressions whenever possible
- Use `const` for all of your references; avoid using `var`
- If you must reassign references, use `let` instead of `var`

### CSS Styleguide

- Use classes instead of IDs for styling
- Use meaningful class names
- Prefix JavaScript-specific classes with `js-`
- Use kebab-case for class names
- Use shorthand properties where possible

### Documentation Styleguide

- Use [Markdown](https://daringfireball.net/projects/markdown) for documentation
- Reference methods and classes in documentation using backticks (`` `method()` ``)
- Reference issues and pull requests using hashtags (`` #123 ``)

## Development Setup

1. Fork the repository
2. Clone your fork
3. Create a new branch for your feature or bug fix
4. Make your changes
5. Write tests for your changes
6. Ensure all tests pass
7. Commit your changes
8. Push to your fork
9. Create a pull request

## Additional Notes

### Issue and Pull Request Labels

This section lists the labels we use to help us track and manage issues and pull requests.

#### Type of Issue and Issue State

- `bug` - Issues that are bugs
- `enhancement` - Issues that are feature requests
- `documentation` - Issues that are documentation related
- `question` - Issues that are questions
- `help wanted` - Issues that need assistance
- `good first issue` - Good for newcomers

#### Pull Request Labels

- `work in progress` - Pull requests that are not yet ready for review
- `needs review` - Pull requests that need review
- `needs testing` - Pull requests that need testing