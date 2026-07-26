# PR #3267 UI proof

Status: pass

The baseline at `upstream/main@f92495fc` visibly renders native scrollbars in
the homepage Content type and Layout segmented controls. The candidate at
`11a7840` removes both scrollbars while preserving the same controls and
layout.

Both lanes were built from their exact revisions and captured from real
ClawHub instances in the in-app Chromium browser at a 1440×900 viewport. The
instances used the public read backend at
`https://wry-manatee-359.convex.cloud`; no synthetic HTML or composed UI was
used.
