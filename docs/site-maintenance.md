# Site maintenance guide

This guide explains how to make routine changes to the Ceri Mackenzie
Hypnotherapy website. It is written for someone working locally on Windows with
Git and Hugo. You do not need to understand all of Hugo to update the site, but
you should preview and validate every change before publishing it.

## Before you start

The deployed site uses Hugo **0.164.0**. From PowerShell, check that Hugo and Git
are available:

```powershell
hugo version
git --version
```

Open PowerShell in the repository folder, then check that you are starting from
a clean working tree:

```powershell
git status
```

If `git status` lists changes you did not make, do not delete or overwrite them.
Find out who owns them before continuing.

Start the local preview server with:

```powershell
hugo server --disableFastRender
```

Open the local address shown in the terminal (normally
`http://localhost:1313/`). Keep the server running while editing; Hugo will
usually refresh the preview when a file is saved. Press `Ctrl+C` in the terminal
to stop it.

> Draft pages are hidden by default. To include them temporarily in the local
> preview, use `hugo server --disableFastRender --buildDrafts`.

## Where things live

| Path | What it controls |
| --- | --- |
| `content/` | Page copy, page front matter, and page-specific image resources |
| `data/` | Repeated site-wide records such as services, testimonials, credentials, and resources |
| `layouts/_shortcodes/` | The small adapters that make reusable components available inside Markdown |
| `layouts/_partials/` | Shared HTML for components, images, the header, footer, and page head |
| `assets/css/main.css` | Site styling, font declarations, colours, spacing, and responsive rules |
| `assets/js/site.js` | The small amount of site behaviour, including navigation |
| `static/fonts/` | Self-hosted font files and their licence files |
| `hugo.toml` | Site title, contact/integration settings, navigation, base URL, and other global configuration |
| `.github/workflows/hugo.yaml` | The automatic GitHub Pages build and deployment workflow |

Most editorial changes belong in `content/`, `data/`, or the `[params]` section
of `hugo.toml`. Change a layout or stylesheet only when the presentation or
behaviour needs to change across the site.

## The editing and publishing workflow

1. Run `git status` and make sure existing work is understood.
2. Start `hugo server --disableFastRender` and open the local preview.
3. Make one focused change at a time and save the file.
4. Check the affected page at desktop width and at a narrow mobile width.
5. Follow links and confirm that headings, images, and controls are correct.
6. Stop the preview server and run the strict production build:

   ```powershell
   hugo --gc --minify --panicOnWarning --printPathWarnings --printUnusedTemplates
   ```

7. Review exactly what changed:

   ```powershell
   git status
   git diff
   ```

8. Commit and push the change:

   ```powershell
   git add docs/site-maintenance.md README.md
   git commit -m "Describe the change"
   git push
   ```

   Replace the paths passed to `git add` with the files actually changed. Avoid
   `git add .` when unrelated work is present.

A push to `main` starts the **Build and deploy Hugo site** workflow in GitHub
Actions. Check that both its build and deploy jobs pass, then inspect the live
page. A local success is important, but it does not prove that deployment
completed.

## Add a new page

### 1. Create the content file

For a text-only page, create a Markdown file such as
`content/privacy-policy.md`. Copying a similar existing page is often the
simplest and safest starting point.

You can instead ask Hugo to create it:

```powershell
hugo new content privacy-policy.md
```

The current archetype creates TOML front matter between `+++` markers and sets
`draft = true`. Existing content mostly uses YAML between `---` markers. Both
formats work, but do not mix their syntax or marker styles in one front matter
block.

For consistency with the existing pages, a manually created page can begin:

```yaml
---
title: "Privacy Policy"
description: "How personal information is handled by Ceri Mackenzie Hypnotherapy."
intro: "Information about the personal data collected through this website."
eyebrow: "Website information"
draft: true
---
```

- `title` is the on-page heading and part of the browser title.
- `description` supplies the search and social description for the page.
- `intro` appears below the main heading.
- `eyebrow` is the small label above the heading.
- `draft: true` prevents publication while work is incomplete.

Add ordinary Markdown or the reusable shortcodes described below after the
front matter. A typical page body is:

```markdown
{{< section tone="default" width="narrow" >}}
## What this page covers

Add the page copy here.
{{< /section >}}

{{< cta title="Have a question?" text="Ceri would be happy to help." href="/contact/" label="Contact Ceri" >}}
```

Shortcodes containing body copy, such as `section` and `split`, require matching
closing tags. Standalone shortcodes, such as `button` and `cta`, do not.

### 2. Add it to the navigation if needed

Creating a page does not automatically put it in the main navigation. Add a
menu entry under `[menus]` in `hugo.toml`:

```toml
[[menus.main]]
  name = 'Privacy Policy'
  pageRef = '/privacy-policy'
  weight = 85
```

`pageRef` identifies the Hugo page, without the `.md` extension. `weight`
controls ordering: lower values appear earlier. The current main-menu weights
run from 20 to 90. Only set `params = { cta = true }` when the item should use
the prominent call-to-action styling.

Not every page belongs in the main menu. A legal page, for example, may instead
need a link added to `layouts/_partials/footer.html`.

### 3. Preview and publish it

Preview drafts with:

```powershell
hugo server --disableFastRender --buildDrafts
```

Before publication:

- Read the browser title and page description.
- Check the main navigation, including its mobile menu.
- Test internal and external links.
- Check the page at wide and narrow viewport sizes.
- Confirm that no unintended placeholder text remains.
- Change `draft: true` to `draft: false`, or remove the `draft` line.
- Run the strict production build and follow the publishing workflow above.

## Reusable shortcodes

A shortcode is a reusable component inserted into Markdown using `{{< ... >}}`.
Attribute names are case-sensitive in the examples below. Quote parameter
values, especially values containing spaces, `/`, `&`, or punctuation.

### `section`

Creates a full-width coloured section and renders Markdown and nested
shortcodes inside it.

```markdown
{{< section tone="sage" width="wide" id="what-to-expect" >}}
## What to expect

Section copy goes here.
{{< /section >}}
```

| Parameter | Allowed values | Default | Purpose |
| --- | --- | --- | --- |
| `tone` | `default`, `sage`, `warm` | `default` | Background treatment |
| `width` | `narrow`, `wide` | `narrow` | Reading-width or wide content area |
| `id` | Any useful identifier | none | Optional link target; Hugo normalises it |

The older parameter name `style` is accepted as an alias for `tone`, but new
content should use `tone`. Invalid tones and widths fall back to their defaults.

### `split`

Creates a two-column text-and-image layout. Its body accepts Markdown and
nested shortcodes.

```markdown
{{< split title="Meet Ceri" image="ceri-portrait.jpg" alt="Ceri Mackenzie smiling in her therapy room" label="Portrait of Ceri Mackenzie" ratio="4 / 5" mediaPosition="left" >}}
Ceri works with people locally and online worldwide.

{{< button href="/about/" text="About Ceri" >}}
{{< /split >}}
```

| Parameter | Allowed values/default | Purpose |
| --- | --- | --- |
| `title` | Text; no default | Column heading |
| `image` | Page-resource filename | Image to display |
| `alt` | Meaningful text | Alternative text for the real image |
| `label` | Defaults to `Image to be added` | Text shown by the placeholder and fallback alt text |
| `ratio` | `16 / 9`, `4 / 5`, `16 / 10`, `5 / 1`, `1 / 1`, or `3 / 2`; default `16 / 9` | Display-frame shape |
| `mediaPosition` | `left` or `right`; default `right` | Image column position |

If `image` is missing or cannot be found, the component deliberately displays
a labelled placeholder. `label` does not select an image.

### `button`

```markdown
{{< button href="/contact/" text="Contact Ceri" variant="secondary" >}}
```

`href` and `text` are required for a working link. `variant` accepts `primary`
(the default), `secondary`, or `text`. An invalid variant becomes `primary`.
If the link or text is missing, a visible editorial placeholder is rendered.

### `cta`

Creates the full-width next-step banner normally used at the end of a page.

```markdown
{{< cta title="Ready to make a change?" text="Let's talk about what is happening." href="/contact/" label="Book a consultation" >}}
```

`title` and `text` provide the copy. `href` and `label` are passed to a primary
button and should both be present.

### `card-grid`

Displays a list stored in the current page's front matter. Each item uses
`title` and `text`.

```yaml
approach:
  - title: "Personal"
    text: "Your goals and experiences are at the centre of the work."
  - title: "Practical"
    text: "Sessions focus on changes that matter in everyday life."
```

```markdown
{{< card-grid param="approach" >}}
```

`param` must exactly match the front matter field name. Missing lists or fields
produce labelled placeholders.

### `steps`

Displays a numbered list stored in the current page's front matter. Each item
uses `title` and `text`.

```yaml
steps:
  - title: "Let's talk"
    text: "Begin with an initial consultation."
  - title: "Plan the next step"
    text: "Agree an approach suited to your goals."
```

```markdown
{{< steps param="steps" >}}
```

The numbering follows the order of the front matter list.

### `faq`

Displays expandable questions from the current page's front matter. Each item
must have both `question` and `answer`.

```yaml
faqs:
  - question: "Will I remain in control?"
    answer: "Yes. You remain aware and in control throughout the session."
```

```markdown
{{< faq param="faqs" >}}
```

### `service-grid`

Displays records from `data/services.yaml`; it does not read page front matter.

```markdown
{{< service-grid featured="true" >}}
```

With `featured="true"`, only records whose `featured` field is `true` appear.
With `featured="false"`, or with the parameter omitted, all services appear.
Service records use `id`, `title`, `summary`, `featured`, and `detailed`.
`detailed` is stored for editorial use but is not currently used to filter or
change the grid output.

### `testimonials`

```markdown
{{< testimonials >}}
```

Displays all records from `data/testimonials.yaml`. Each record needs `quote`
and either `name` or `attribution`:

```yaml
- quote: "Client feedback goes here."
  attribution: "Client, Cambridgeshire"
```

The current data file is an empty list (`[]`), so the site intentionally shows
three placeholders until approved testimonials are added.

### `resource-grid`

```markdown
{{< resource-grid >}}
```

Displays all records from `data/resources.yaml`. Records support `type`,
`title`, `summary`, `url`, and `featured`:

```yaml
- type: "Article"
  title: "Resource title"
  summary: "A short explanation of the resource."
  url: "https://example.com/"
  featured: true
```

The `featured` field adds prominent styling; it does not filter the list. A
missing URL produces a visible placeholder. The current data file is empty.

### `booking`

```markdown
{{< booking >}}
```

Reads `[params.booking]` in `hugo.toml`. A live button appears only when
`enabled = true` and `url` is non-empty. Configure and test the booking URL
before enabling it. The existing `embed` setting is reserved for configuration
but the current component always renders a link, not an embedded booking tool.

### `contact-details`

```markdown
{{< contact-details >}}
```

Reads `[params.contact]` in `hugo.toml`: `phone`, `email`, `location`, `hours`,
and `serviceArea`. Empty values show public placeholders. Keep the existing
setting names; Hugo exposes them case-insensitively to the templates.

### `contact-form`

```markdown
{{< contact-form >}}
```

Reads `[params.contactForm]` in `hugo.toml`. The real form appears only when
`enabled = true` and `endpoint` is non-empty. Configure and test the external
form endpoint, submission handling, spam protection, and privacy wording before
enabling it. Never commit a secret API key to `hugo.toml`.

### `placeholder`

Use this only for a deliberately unfinished media area:

```markdown
{{< placeholder label="Professional membership and accreditation marks" ratio="5 / 1" >}}
```

`label` describes what is missing. `ratio` accepts the same supported shapes as
`split`. Replace the entire shortcode when the final component or asset is
available.

## How shortcodes and partials fit together

The layers are intentionally separated:

1. A content author invokes a file in `layouts/_shortcodes/` from Markdown.
2. The shortcode reads named parameters and packages them for a component.
3. A file in `layouts/_partials/components/` renders the component HTML and its
   fallback state.
4. Image components call `layouts/_partials/media/image.html`, which finds the
   resource and creates responsive variants, or calls the placeholder partial.

For example, `{{< button ... >}}` enters
`layouts/_shortcodes/button.html`, which passes `href`, `text`, and `variant` to
`layouts/_partials/components/button.html`.

### Safely update an existing component

- Search for all uses before changing its interface:

  ```powershell
  rg '{{< split' content
  ```

  Replace `split` with the relevant shortcode name.
- Keep existing parameter names and defaults unless every caller will be
  migrated in the same change.
- Preserve the visible fallback or placeholder state. These states prevent an
  empty or broken layout when business content is not yet configured.
- Put parameter-reading logic in the shortcode wrapper and presentation markup
  in the component partial.
- Preserve the `shortcode-output.html` wrapper used by the standalone
  shortcodes. It helps nested shortcodes render in the correct order.
- Escape or let Hugo render user-controlled values using the same conventions
  as neighbouring components. Do not mark arbitrary content as safe HTML.
- Update CSS classes in `assets/css/main.css` if markup changes, then check every
  page found by the search at wide and narrow widths.
- Run the strict Hugo build. `--printUnusedTemplates` is particularly useful
  after renaming or removing templates.

## Add or replace an image

The site expects page-specific images to be Hugo **page resources**. This lets
`layouts/_partials/media/image.html` generate width variants at 480, 768, 1200,
and 1600 pixels when the source is large enough, plus WebP versions. The browser
chooses an appropriate size.

### Prepare a page bundle

A standalone file cannot hold sibling page resources. Before adding an image to
`content/hypnotherapy.md`, for example, convert it to a leaf bundle:

```text
Before                         After
content/hypnotherapy.md        content/hypnotherapy/index.md
                               content/hypnotherapy/session-room.jpg
```

Move the Markdown without changing its front matter or body. Its public URL
remains `/hypnotherapy/`. Do not leave both the old `.md` file and the new
`index.md` in place.

The homepage is already a branch bundle rooted at `content/_index.md`, so its
resources can be placed alongside that file in `content/`:

```text
content/_index.md
content/ceri-home-portrait.jpg
```

Use distinctive filenames so homepage resources are not confused with content
pages.

### Reference the image

For the homepage hero, add these fields to `content/_index.md` front matter:

```yaml
heroImage: "ceri-home-portrait.jpg"
heroImageAlt: "Ceri Mackenzie smiling in her therapy room"
ogImage: "ceri-home-portrait.jpg"
```

`heroImage` controls the visible homepage hero. `heroImageAlt` describes it to
people who cannot see it. `ogImage` is optional and controls the image used in
social-sharing metadata. On other pages, `heroImage` can act as the default
social image, but the standard page layout does not display a visual hero.

For a split component, reference a resource in the same page bundle:

```markdown
{{< split title="A calm, welcoming space" image="session-room.jpg" alt="Two comfortable chairs in Ceri's therapy room" ratio="3 / 2" mediaPosition="right" >}}
Add the accompanying copy here.
{{< /split >}}
```

Always write alt text that communicates the image's relevant meaning. Do not
begin with “Image of”. If an image is purely decorative, the templates would
need to support an explicitly empty alt value before treating it that way; do
not simply omit `alt` because omission currently falls back to `label`.

### Choose and replace source files

- Prefer JPEG for photographs and PNG when transparency or lossless artwork is
  required. WebP is also processable. Supply a clean source at least as wide as
  its largest expected display size; avoid enormous camera originals.
- Crop with the component's frame ratio in mind. CSS may crop the displayed
  image to fit even though Hugo retains the source dimensions.
- Hugo can process JPEG, PNG, WebP, GIF, and TIFF in this template. SVG is
  displayed as supplied but does not receive generated responsive variants or
  intrinsic dimensions from this partial.
- Use lowercase, descriptive filenames without spaces, for example
  `ceri-consultation-room.jpg`.
- Do not manually edit files in `public/` or `resources/_gen/`; Hugo regenerates
  build output.

To replace an image without editing content, overwrite the source with a new
file of the same name and format. Check that the subject and existing alt text
still match. If the filename or format changes, search for and update every
reference:

```powershell
rg 'old-image-name' content layouts
```

If a placeholder remains, check spelling and letter case, confirm that the
image is inside the same page bundle as the Markdown that calls it, and rerun
the preview with `--disableFastRender`.

## Change a self-hosted Google Font

The site currently uses Cormorant Garamond for display text and Source Sans 3 for body
text. Although both are available from Google Fonts, the live site does **not**
contact Google's font CDN. The font files and their Open Font Licence files are
stored in `static/fonts/` and served by this site.

Changing a font involves its font file, licence, CSS declaration, and fallback
stack:

1. Choose a font whose licence permits web self-hosting and whose available
   weights cover the styles used by the site.
2. Download the Latin WOFF2 file from the font's official source. Prefer a
   variable font if it covers the needed range. Also download and retain its
   OFL or other licence text.
3. Put both files in `static/fonts/`, using clear lowercase filenames.
4. Update the appropriate `@font-face` block at the top of
   `assets/css/main.css`. For example:

   ```css
   @font-face {
     font-family: "Example Sans";
     font-style: normal;
     font-weight: 400 700;
     font-display: swap;
     src: url("../fonts/example-sans-latin-variable.woff2") format("woff2");
   }
   ```

   The declared `font-weight` range must match the downloaded file. A static
   font file normally declares one weight, such as `400`; multiple static
   weights need separate `@font-face` blocks.
5. Change one custom property in `:root`:

   ```css
   --font-display: "Example Serif", Georgia, "Times New Roman", serif;
   --font-body: "Example Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
   ```

   Change `--font-display` for headings and branding, or `--font-body` for body
   copy and controls. Keep suitable generic and system fallbacks.
6. Preview headings, paragraphs, buttons, navigation, cards, forms, and the
   footer on desktop and mobile. Look for clipped text, unexpected wrapping,
   missing bold weights, and slow or failed font requests in browser developer
   tools.
7. Run the strict build. Only after the new font is verified, search for the old
   filename and family name. Remove obsolete font and licence files only when
   nothing refers to them and the replacement licence has been retained.

Do not replace self-hosting with an `@import` or `<link>` to Google Fonts unless
the site's privacy and performance policy is intentionally being changed.

## Troubleshooting

### A new page is not visible

- Check whether front matter contains `draft: true` or `draft = true`.
- Use `--buildDrafts` only for preview; remove or disable the draft setting to
  publish.
- Confirm that the filename ends in `.md` or that a page bundle uses
  `index.md`.
- Read the strict build output for front matter and path errors.

### A page is missing from the navigation

- Confirm that it has a `[[menus.main]]` entry in `hugo.toml`.
- Check that `pageRef` matches the content path without `.md`.
- Check that the menu block is below `[menus]`, and compare its TOML syntax with
  a working entry.
- Remember that a valid page can intentionally exist without a menu entry.

### A component shows placeholder text

Placeholders are deliberate warnings, not build failures. Check the fields the
component requires. For site-wide components, inspect `hugo.toml` or the
relevant file under `data/`. For `card-grid`, `steps`, and `faq`, check
that `param` matches a populated front matter list. For buttons and CTAs, check
both the URL and visible label.

### Hugo reports a YAML or TOML error

- Confirm that YAML uses matching `---` markers and spaces for indentation.
- Confirm that TOML uses matching `+++` markers and `key = value` syntax.
- Do not use tabs for YAML indentation.
- Quote text containing punctuation when uncertain.
- Check the lines immediately above the reported line; an unclosed quote or
  incorrectly indented list often causes the next line to be blamed.

### Hugo reports a shortcode error or content disappears

- Confirm the exact shortcode name and parameter spelling.
- Ensure every `section` and `split` opening tag has a corresponding closing
  tag in the correct order.
- Do not add closing tags to standalone shortcodes.
- Use `{{< ... >}}`, as existing pages do, rather than changing delimiter style.
- Compare the failing block with a working example in `content/_index.md`.

### An image is missing

- Check the filename, extension, and letter case in both the folder and content.
- Confirm that the file is a resource of the page bundle that references it.
- Make sure a converted page uses `page/index.md`, not both `page.md` and
  `page/index.md`.
- Check that `image` or `heroImage` selects the file; `label` and `alt` do not.
- Restart the local server if a newly added resource is not detected.

### A font has not changed

- Check that the CSS filename exactly matches the file in `static/fonts/`.
- Remember that `../fonts/...` is intentional: the built stylesheet is served
  from `/css/` and fonts from `/fonts/`.
- Confirm that the `font-family` in `@font-face` exactly matches the family used
  by `--font-display` or `--font-body`.
- Hard-refresh the browser and inspect its Network panel for a failed WOFF2
  request.
- Confirm that the downloaded file contains the weights and character subset
  being requested.

### The strict build or deployment fails

Run the same production command locally:

```powershell
hugo --gc --minify --panicOnWarning --printPathWarnings --printUnusedTemplates
```

Fix the first reported warning or error, rerun the command, and continue until
it exits successfully. If local validation passes but GitHub Actions fails,
open the failed **Build and deploy Hugo site** run and compare its first error
with the committed files. Confirm that all referenced files were committed,
including images and fonts. Do not retry deployment repeatedly without first
understanding the failure.

## Final checklist

Before publishing any maintenance change, confirm:

- The intended page works in the local preview.
- Navigation and links work at desktop and mobile widths.
- Images have accurate alt text and no unintended placeholder remains.
- No contact detail, endpoint, or unpublished testimonial was exposed by
  mistake.
- The strict Hugo build completes without warnings.
- `git diff` contains only the intended changes.
- GitHub Actions completes successfully after the push.
- The live page matches the local result.
