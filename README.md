![Angular Badge](https://img.shields.io/badge/Angular-v21.0.0-DD0031?style=for-the-badge&logo=angular&logoColor=white)

# Fast Keyboard Portfolio
Stand alone page to learn writing fast in hebrew keyboards.<br />
The MVP was created in 24h using Gemini AI.

## Motivation
I created this project to:
- improve my Angular skills,
- improve my AI utilization in a development context,
- learn to write fast in hebrew keyboards,
- show my skills to recruiters.

## Live Deployment
Available on [https://imimoun.github.io/fast-keyboard-portfolio/](https://imimoun.github.io/fast-keyboard-portfolio/).

## Getting Started (Local Development)
### Prerequisites
- NodeJs v24.11.1
- Angular v21.0.0

### Run the project
```bash
ng serve
```
The server will be running on `http://localhost:4200/`.

## Update GitHub Pages
```bash
ng build --output-path docs --base-href /fast-keyboard-portfolio/
mv docs/browser/* docs/
```

## Running unit tests
To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```
