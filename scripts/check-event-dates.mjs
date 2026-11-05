// node scripts/check-event-dates.mjs — asserts the past/upcoming cut-off.
import assert from "node:assert/strict";
import { eventHasEnded } from "../lib/utils.ts";

const now = Date.parse("2026-11-05T12:00:00Z");
assert.equal(eventHasEnded("2026-10-23T19:00:00.000Z", now), true, "Oct 23 show is past");
assert.equal(eventHasEnded("2026-12-12T20:00:00.000Z", now), false, "future show");
assert.equal(eventHasEnded("2026-11-05T02:00:00.000Z", now), false, "started 10h ago: still on");
assert.equal(eventHasEnded("2026-11-04T23:00:00.000Z", now), true, "started 13h ago: over");
assert.equal(eventHasEnded("2026-11-05", now), false, "date-only today: still on");
assert.equal(eventHasEnded("2026-11-03", now), true, "date-only 2 days ago");
assert.equal(eventHasEnded(undefined, now), false, "no date stays upcoming");
assert.equal(eventHasEnded("TBA", now), false, "unparseable stays upcoming");
console.log("event date checks passed");
