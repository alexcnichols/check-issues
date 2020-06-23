# Check issues

A GitHub Action to check issues against repository guidelines and comment with any corrective steps.

<a href="https://github.com/alexcnichols/check-issues/actions"><img alt="check-issues status" src="https://github.com/alexcnichols/check-issues/workflows/units-test/badge.svg"></a>

---

## Setup

**check-issues** is a GitHub Actions that is designed to work using the [`issues`](https://help.github.com/en/actions/reference/events-that-trigger-workflows#issues-event-issues) event and `opened` activity type.

### Workflow setup

Create a `.github/workflows/check-issues.yml` file like this:

```yaml
name: Check issues
on:
  issues:
    types: [opened]
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: alexcnichols/check-issues@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```
