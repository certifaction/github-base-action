function slugrefs(refs) {
  refs = refs
    .toLowerCase()
    .replace(/^refs\/(heads|tags|pull)\//g, "")
    .replace(/\/merge$/g, "");
  refs = refs.replace(/[^a-zA-Z0-9.]/g, "-");
  refs = refs.replace(/^-*/g, "").replace(/-*$/g, "");
  return refs.substring(0, 64);
}

module.exports = slugrefs;
