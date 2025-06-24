## Routing Base Path in Vite + React Router

**Date:** 2025-06-24  
**Issue:** Accessing `/` was redirecting to `/admin-ui`.  
**Root Cause:** Vite was configured with a `base` in `vite.config.mjs`.

**Lesson Learned:**
To change the default base path, update the `vite.config.mjs`:
```js
export default defineConfig({
  base: '/', // Changed from '/admin-ui/' to '/'
  ...
});
