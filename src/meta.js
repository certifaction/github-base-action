const slugrefs = require("./slugrefs");
const semver = require("semver");

function meta(image, context, default_branche) {
  if (image == "") {
    return;
  }

  if (!context || !context.ref || !context.sha) {
    return;
  }

  const slug = slugrefs(context.ref);
  const sha = `sha-${context.sha.substr(0, 7)}`;

  const partial = [];
  partial.push("latest");

  if (/^refs\/tags\//.test(context.ref)) {
    version = sha;

    const sver = semver.parse(slug, {
      includePrerelease: true,
    });

    if (!sver) {
      partial.push(slug);
      core.warning(
        `${slug} is not a valid semver for a release. More info: https://semver.org/`
      );
    }

    if (sver) {
      version = sver.version;
      partial.push(sha);

      if (sver.prerelease.length > 0) {
        partial.push("staging");
      } else {
        partial.push("production");
      }
    }
  } else if (/^refs\/pull\//.test(context.ref)) {
    version = sha;
    partial.push("pr-" + slug);
  } else if (/^refs\/heads\//.test(context.ref)) {
    version = sha;
    if (slug === default_branche) {
      partial.push("dev");
    } else {
      partial.push(slug);
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
  };
}

module.exports = meta;
