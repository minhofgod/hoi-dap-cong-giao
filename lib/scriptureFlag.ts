// Licensing gate for the Scripture popover.
//
// CGKPV verse text is under copyright — the same reason the Kinh Thánh section is off in v1
// (see design/Scripture Popover handoff). While this is false, Scripture references render as
// inert sage chips: no popover, no verse text shipped to the browser. Flip to true (or set
// NEXT_PUBLIC_SCRIPTURE_POPOVER=1) only when CGKPV permission is in hand.
//
// This module is client-safe (no fs) so both server and client code can read the flag.
export const SCRIPTURE_POPOVER_ENABLED =
  process.env.NEXT_PUBLIC_SCRIPTURE_POPOVER === '1' ? true : false;
