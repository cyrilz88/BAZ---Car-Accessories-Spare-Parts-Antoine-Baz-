# BAZ platform - Stage 1
Setup: 1) Create a Supabase project. 2) SQL editor: run supabase/01_schema.sql then 02_seed.sql.
3) Put project URL + anon key in js/config.js. 4) Open the site, create an account, then run the admin SQL line at the bottom of 01_schema.sql.
5) Push this folder to GitHub, connect it to Cloudflare Pages (no build command, output dir "/").
Test locally: `python3 -m http.server` in this folder.
## File -> section map (fix one file, redeploy only it)
js/modules/catalog.js = Shop | inhouse.js = Seat covers | forms.js = Open a shop + Services | js/core.js = login gate/language | js/loader.js = fault isolation
Until the admin panel (Stage 2) is built, edit products in Supabase > Table Editor.
