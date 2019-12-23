// Fixes window.jQuery not declared issue.
if (typeof module === 'object') {
  window.module = module;
  module = undefined;
}
