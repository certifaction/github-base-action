function labels(context, repo, version, date) {
  if (!context || !repo) {
    return [];
  }

  return [
    `org.opencontainers.image.title=${repo.name || ""}`,
    `org.opencontainers.image.description=${repo.description || ""}`,
    `org.opencontainers.image.url=${repo.html_url || ""}`,
    `org.opencontainers.image.source=${repo.html_url || ""}`,
    `org.opencontainers.image.version=${version || ""}`,
    `org.opencontainers.image.created=${date || ""}`,
    `org.opencontainers.image.revision=${context.sha || ""}`,
    `org.opencontainers.image.licenses=${repo.license?.spdx_id || ""}`,
  ];
}

module.exports = labels;
