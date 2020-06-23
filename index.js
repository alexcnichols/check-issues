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
    // If not, add to output message
    let found = false;
    const columns = await github.projects.listColumns({
      project_id: 1
    });
    for (const column of columns) {
      core.debug("Reading column: " + column.name + " " + column.id + " " + column.node_id);
      let cards = await github.projects.listCards({
        column_id: column.node_id,
        per_page: 100
      });
      cards = cards.data.filter((card) => card["content_url"] != undefined);
      for (const card of cards) {
        const { content_url } = card;
        const issueNumber = content_url.split("issues/")[1];
        if (issueNumber == content_url.payload.issue.number) {
          found = true;
        }
      }
    }

    if (found) {
      core.debug("Found issue in project already.");
    } else {
      core.debug("Issue not found in project, posting comment.");
      // Post comment using output message
      await github.issues.createComment({
        owner: owner,
        repo: repo,
        issue_number: context.payload.issue.number,
        body: `${getMessage(actor)}`
      });
    }
  } 
  catch (error) {
    core.setFailed(error.message);
  }
}

run()
