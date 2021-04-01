const meta = require("./meta");

test("null", () => {
  expect(meta(null, null, null)).toBeUndefined();
});

test("empty image", () => {
  const context = {
    ref: "",
    sha: "",
  };
  expect(meta("", context, "")).toBeUndefined();
});

test("empty context", () => {
  const context = {
    ref: "",
    sha: "",
  };
  expect(meta("foobar", context, "")).toBeUndefined();
});

test("main branch", () => {
  const context = {
    ref: "refs/heads/main",
    sha: "abcd123456789",
  };
  expect(meta("foobar", context, "main")).toStrictEqual({
    push: true,
    version: "sha-abcd123",
    tags: ["foobar:sha-abcd123", "foobar:latest", "foobar:main", "foobar:dev"],
  });
});

test("pr branch", () => {
  const context = {
    ref: "refs/heads/BP-2060-use-pdf-service-document-locking",
    sha: "abcd123456789",
  };
  expect(meta("foobar", context, "main")).toStrictEqual({
    push: false,
    version: "sha-abcd123",
    tags: [
      "foobar:sha-abcd123",
      "foobar:latest",
      "foobar:bp-2060-use-pdf-service-document-locking",
    ],
  });
});

test("pull refs", () => {
  const context = {
    ref: "refs/pull/3/merge",
    sha: "abcd123456789",
  };
  expect(meta("foobar", context, "main")).toStrictEqual({
    push: false,
    version: "sha-abcd123",
    tags: ["foobar:sha-abcd123", "foobar:latest", "foobar:pr-3"],
  });
});

test("prerelease", () => {
  const context = {
    ref: "refs/tags/v1.2.3-rc.1",
    sha: "abcd123456789",
  };
  expect(meta("foobar", context, "main")).toStrictEqual({
    push: true,
    version: "1.2.3-rc.1",
    tags: [
      "foobar:1.2.3-rc.1",
      "foobar:latest",
      "foobar:sha-abcd123",
      "foobar:staging",
    ],
  });
});

test("erelease", () => {
  const context = {
    ref: "refs/tags/v1.2.3",
    sha: "abcd123456789",
  };
  expect(meta("foobar", context, "main")).toStrictEqual({
    push: true,
    version: "1.2.3",
    tags: [
      "foobar:1.2.3",
      "foobar:latest",
      "foobar:sha-abcd123",
      "foobar:production",
    ],
  });
});
