const core = require('@actions/core');
const { GitHub, context } = require('@actions/github');
const getMessage = require('./get-message');

// most @actions toolkit packages have async methods
async function run() {
  try { 
    // Get authenticated GitHub client (Ocktokit) and other context
    const github = new GitHub(process.env.GITHUB_TOKEN);
    const { owner, repo } = context.repo;
    const actor = context.actor;
    
    // TO DO: Collect message as input parameter

    core.debug("Event name: " + context.eventName);
    core.debug("Workflow: " + context.workflow);
    core.debug("Action: " + context.action);
    core.debug("Owner: " + owner);
    core.debug("Repo: " + repo);
    core.debug("Actor: " + actor);

    // Check if issue event
    if (context.eventName === 'issues') {
      core.debug("Valid event: " + context.eventName);
    } else {
      core.debug("Invalid event: " + context.eventName);
      return;
    }

    // Check if issue event opened activity
    if (context.payload.action === 'opened') {
      core.debug("Valid event: " + context.payload.action);
    } else {
      core.debug("Invalid event: " + context.payload.action);
      return;
    }

    // Check if issue payload
    const isIssue = !!context.payload.issue;
    if (isIssue) {
      core.debug("Valid payload: " + context.payload.issue.number)
    } else {
      core.debug("Invalid payload");
      return;
    }

    // Check if issue is on specified project board
    // TO DO
    // If not, add to output message

    // Post comment using output message
    github.issues.createComment({
      repo,
      issue_number: context.payload.issue.number,
      body: `${getMessage(actor)}`
    })
  } 
  catch (error) {
    core.setFailed(error.message);
  }
}

run()
