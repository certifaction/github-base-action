const labels = require("./labels");

test("null", () => {
  expect(labels(null, null, null)).toStrictEqual([]);
});

test("empty", () => {
  const context = {};
  const repo = {};
  expect(labels(context, repo, "", "")).toStrictEqual([
    "org.opencontainers.image.title=",
    "org.opencontainers.image.description=",
    "org.opencontainers.image.url=",
    "org.opencontainers.image.source=",
    "org.opencontainers.image.version=",
    "org.opencontainers.image.created=",
    "org.opencontainers.image.revision=",
    "org.opencontainers.image.licenses=",
  ]);
});

test("non empty", () => {
  const context = {
    ref: "refs/tags/v1.2.3",
    sha: "abcd123456789",
  };
  const repo = {
    name: "repo-name",
    description: "this is the description",
    html_url: "html_url",
    license: {
      spdx_id: "bar",
    },
  };
  expect(labels(context, repo, "v1.2.3", "12/02/2021")).toStrictEqual([
    "org.opencontainers.image.title=repo-name",
    "org.opencontainers.image.description=this is the description",
    "org.opencontainers.image.url=html_url",
    "org.opencontainers.image.source=html_url",
    "org.opencontainers.image.version=v1.2.3",
    "org.opencontainers.image.created=12/02/2021",
    "org.opencontainers.image.revision=abcd123456789",
    "org.opencontainers.image.licenses=bar",
  ]);
});
