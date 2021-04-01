import * as core from '@actions/core';
import * as github from '@actions/github';
const getMeta = require('./src/meta')
const getLabels = require("./src/labels");

async function run() {
  try {
    // Inputs
    const token = core.getInput('token');
    const image = core.getInput('image');

    const octokit = github.getOctokit(token)
    const repo = await octokit.repos.get({
    ...github.context.repo
    });
    if (!repo || !repo.data) {
        throw new Error('Cannot get GitHub repository');
    }

    core.startGroup(`Context info`);
    core.info(`eventName: ${github.context.eventName}`);
    core.info(`sha: ${github.context.sha}`);
    core.info(`ref: ${github.context.ref}`);
    core.info(`workflow: ${github.context.workflow}`);
    core.info(`action: ${github.context.action}`);
    core.info(`actor: ${github.context.actor}`);
    core.info(`runNumber: ${github.context.runNumber}`);
    core.info(`runId: ${github.context.runId}`);
    core.endGroup();

    const meta = getMeta(image, github.context, repo.data.default_branch);

    core.startGroup(`Docker push image`);
    core.info(meta.push || false);
    core.endGroup();
    core.setOutput('push', meta.push || false);

    core.startGroup(`Docker image version`);
    core.info(meta.version || '');
    core.endGroup();
    core.setOutput('version', meta.version || '');

    // Docker tags
    core.startGroup(`Docker tags`);
    for (let tag of meta.tags) {
      core.info(tag);
    }
    core.endGroup();
    core.setOutput('tags', meta.tags.join(`\n`));

    // Docker labels
    const labels = getLabels(github.context, repo.data, meta.version, new Date().toISOString());
    core.startGroup(`Docker labels`);
    for (let label of labels) {
      core.info(label);
    }
    core.endGroup();
    core.setOutput('labels', labels.join(`\n`));

  } catch (error) {
    core.setFailed(error.message);
  }
}
run();
