# kishor-portfolio-dark

A dark‑mode personal website for Kishor Joshi built for GitHub Pages.

## Deploy on GitHub Pages

1. Create a new public repository named `<yourusername>.github.io`.
2. Upload the contents of this folder to the repo (index.html, styles.css, site.js, projects.js, and the `assets/` directory).
3. Commit to the `main` branch.
4. In **Settings → Pages**, set Source to **Deploy from branch**, Branch to **main / root**.
5. Wait ~1 minute and open `https://<yourusername>.github.io`.

### Update links
- GitHub link (Contact section) points to github.com/joshik319.
- The CV download is `assets/Kishor_Joshi_CV.pdf`; replace it with the latest CV as needed.

### Customize
- Edit colors in `styles.css` under the `:root` variables.
- Replace `assets/profile.jpg` with a different photo if desired (recommended size: 480×480).

### Add or edit project details
All projects live in `projects.js` (the `PROJECTS` list at the top); the cards and the pop-up detail view are built from it.
- Fill in any of: `problem`, `overview`, `specs`, `team`, `role`, `system`, `approach`, `results`, `images`, `documents`, `links`. Fields left out are simply hidden.
- `images` is the project slideshow (first image = card cover); add as many `{ src, caption }` entries as you like. It auto-advances every 5 s and can be clicked, swiped or driven with arrow keys.
- Each project has a shareable link: `https://joshik319.github.io/#project-<id>`.
- **Sample values:** text wrapped in `[[double brackets]]` in `projects.js` shows on the site with a dashed underline and a "sample figure" note. Replace each with the real value and remove the brackets. The advisor/committee line under Education in `index.html` uses `<mark class="ph">` the same way.
- **Sample pictures, figures and documents:** everything in `assets/projects/` and `assets/docs/` is a placeholder labeled "SAMPLE". Replace with real photos/plots/PDFs, update the paths, and delete `sample: true` from a project once it has no sample material left.
