import test from "node:test";
import assert from "node:assert/strict";
import { sitePath } from "../lib/site-path.ts";

test("public assets and native links respect Pages base path; anchors/external URLs stay unchanged", () => {
  const previous = process.env.NEXT_PUBLIC_BASE_PATH;
  try {
    process.env.NEXT_PUBLIC_BASE_PATH = "/blueyard";
    assert.equal(sitePath("/"), "/blueyard/");
    assert.equal(sitePath("/en#web"), "/blueyard/en#web");
    assert.equal(sitePath("/brand/emfau-mark.svg"), "/blueyard/brand/emfau-mark.svg");
    assert.equal(sitePath("#web"), "#web");
    assert.equal(sitePath("https://example.com"), "https://example.com");
    assert.equal(sitePath("//example.com"), "//example.com");
    delete process.env.NEXT_PUBLIC_BASE_PATH;
    assert.equal(sitePath("/en"), "/en");
  } finally {
    if (previous === undefined) delete process.env.NEXT_PUBLIC_BASE_PATH;
    else process.env.NEXT_PUBLIC_BASE_PATH = previous;
  }
});
