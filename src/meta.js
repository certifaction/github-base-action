const slugrefs = require("./slugrefs");
const semver = require("semver");
const core = require("@actions/core");

function meta(image, context, default_branch) {
  if (image == "") {
    return;
  }

  if (!context || !context.ref || !context.sha) {
    return;
  }

  const slug = slugrefs(context.ref);
  const sha = `sha-${context.sha.substr(0, 7)}`;

  let version = sha;
  let push = false;

  const partial = [];
  partial.push("latest");

  if (/^refs\/tags\//.test(context.ref)) {
    const sver = semver.parse(slug, {
      includePrerelease: true,
    });

    if (!sver) {
      partial.push(slug);
      core.error(
        `${slug} is not a valid semver for a release. More info: https://semver.org/`
      );
      return;
    }

    if (sver) {
      version = sver.version;
      partial.push(sha);

      if (sver.prerelease.length > 0) {
        partial.push("staging");
      } else {
        partial.push("production");
      }

      push = true;
    }
  } else if (/^refs\/pull\//.test(context.ref)) {
    partial.push("pr-" + slug);
  } else if (/^refs\/heads\//.test(context.ref)) {
    partial.push(slug);
    if (slug === default_branch) {
      partial.push("dev");
      push = true;
    }
  }

  const tags = [];
  const imageLc = image.toLowerCase();

  tags.push(`${imageLc}:${version}`);

  for (const p of partial) {
    tags.push(`${imageLc}:${p}`);
  }

  return {
    version: version,
    tags: tags,
    push: push,
  };
}

module.exports = meta;
