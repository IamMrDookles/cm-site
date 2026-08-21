# Ceri Mackenzie Hypnotherapy

A custom Hugo site for `cerimackenzie.com`. The project deliberately uses no
third-party theme, JavaScript framework, or Node build step.

## Local development

The deployed site uses Hugo 0.164.0. Start a local preview with:

```powershell
hugo server --disableFastRender
```

Run the same strict checks used by deployment with:

```powershell
hugo --gc --minify --panicOnWarning --printPathWarnings --printUnusedTemplates
```

## Content and shared data

- Editorial copy lives in `content/`.
- Repeated services, testimonials, credentials, and resources live in `data/`.
- Contact, booking, form, and social settings live under `params` in
  `hugo.toml`.
- Reusable presentation lives in `layouts/_partials/` and
  `layouts/_shortcodes/`.

Empty contact or integration settings intentionally render labelled public
placeholders. Set an integration's `enabled` flag only after its URL or endpoint
has been configured and tested.

## Images and fonts

Add page-specific images to the corresponding page bundle and reference them in
front matter. The image partial generates responsive variants; missing images
render a neutral placeholder instead.

Fraunces and Source Sans 3 are self-hosted in `static/fonts/`. Their Open Font
Licence files are stored beside the font files.
