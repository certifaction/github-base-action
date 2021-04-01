const slugrefs = require("./slugrefs");

test("empty", () => {
  expect(slugrefs("")).toBe("");
});

test("non empty", () => {
  expect(slugrefs("foobar")).toBe("foobar");
});

test("branch", () => {
  expect(slugrefs("refs/heads/BP-2060-use-pdf-service-document-locking")).toBe(
    "bp-2060-use-pdf-service-document-locking"
  );
});

test("branch 2", () => {
  expect(
    slugrefs("refs/heads/foobar/BP-2060-use-pdf-service-document-locking/")
  ).toBe("foobar-bp-2060-use-pdf-service-document-locking");
});

test("pull request", () => {
  expect(slugrefs("refs/pull/2/merge")).toBe("2");
});
