#!/usr/bin/env python3
"""Builds docs/component-theming-guidelines.html from the guidelines in component-theming-guidelines.md.

The rules' text comes from the markdown, so the two never drift. The visual examples under each rule are
drawn from custom properties only: the theme files in packages/ui/tokens, the Timing durations in
packages/ui/src/styles/tokens.css, the Glass sheet's weights in packages/ui/src/components/liquid-glass.tsx and
docs/figma-size-tokens.json. Change a token, run this again, and the examples follow.

    python3 docs/build-guidelines-page.py
"""
import html
import json
import re
from pathlib import Path

DOCS = Path(__file__).parent
ROOT = DOCS.parent
TOKENS = ROOT / "packages/ui/tokens"
MD = DOCS / "component-theming-guidelines.md"
OUT = DOCS / "component-theming-guidelines.html"

# --- the tokens the page is drawn from -------------------------------------------------------------

themes = sorted((json.loads(p.read_text()) for p in TOKENS.glob("*.json")), key=lambda t: t["order"])
sizes = json.loads((DOCS / "figma-size-tokens.json").read_text())


def font_stack(name, serif=False):
    return f'"{name}", {"serif" if serif else "sans-serif"}'


def theme_css(t):
    lines = [f"color-scheme: {t['colorMode']};"]
    for k, v in t["tokens"].items():
        lines.append(f"--{k}: {v};")
    f = t["fonts"]
    lines.append(f"--font-body: {font_stack(f['body'])};")
    lines.append(f"--font-heading: {font_stack(f['primary'], True)};")
    return f".th-{t['name']} {{\n  " + "\n  ".join(lines) + "\n}"


def durations():
    css = (ROOT / "packages/ui/src/styles/tokens.css").read_text()
    return re.findall(r"--duration-(\w+):\s*([\d.]+s);", css)


def glass_weights():
    src = (ROOT / "packages/ui/src/components/liquid-glass.tsx").read_text()
    out = {}
    for name in ("soft", "medium", "heavy"):
        m = re.search(name + r": \{([^}]*)\}", src)
        out[name] = {k: float(v) for k, v in re.findall(r"(\w+): ([\d.]+)", m.group(1))}
    return out


def size_css():
    sc = sizes["size-controls"]
    return "\n".join(
        [
            f"--control-h: {sc['interactive-component/min-height/component']}px;",
            f"--control-h-inner: {sc['interactive-component/min-height/component-within-component']}px;",
            f"--icon-box: {sc['interactive-component/min-height/icon-within-component']}px;",
            f"--pad-min: {sc['interactive-component/min-padding/component']}px;",
            f"--pad-card: {sc['card/padding/padding-md']}px;",
            f"--pad-popup: {sizes['spacing']['padding/sm']}px;",
            f"--border-w: {sizes['radius']['border-width/md']}px;",
        ]
    )


def glass_css():
    g = glass_weights()
    lines = []
    for name, w in g.items():
        lines.append(f"--glass-{name}-blur: {w['fallbackBlur']:g}px;")
        lines.append(f"--glass-{name}-dark: rgba(0,0,0,{w['dark']:g});")
        lines.append(f"--glass-{name}-light: rgba(255,255,255,{w['light']:g});")
    return "\n".join(lines)


# --- the rules, from the markdown --------------------------------------------------------------------


def inline(text):
    text = html.escape(text)
    text = re.sub(r"`([^`]+)`", r"<code>\1</code>", text)
    text = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", text)
    return text


def parse_md():
    """("h1", group) | ("h2", topic) | ("h3", application) | ("p", text) | ("rule", number, text, subs, star)."""
    parts = []
    skipping = False
    seen_title = False
    for line in MD.read_text().splitlines():
        if line.startswith("# "):
            skipping = False
            if not seen_title:  # the document's own title is the page's
                seen_title = True
                continue
            parts.append(("h1", line[2:]))
        elif line.startswith("## "):
            # how to leave feedback on the markdown is of no use on the page
            skipping = line[3:].startswith("How to leave feedback")
            if not skipping:
                parts.append(("h2", line[3:]))
        elif skipping:
            continue
        elif line.startswith("### "):
            parts.append(("h3", line[4:]))
        else:
            m = re.match(r"- \*\*([\d.]+)(\\\*|\?)?\*\* (.*)", line)
            sub = re.match(r"  - (.*)", line)
            if m:
                parts.append(("rule", m.group(1), m.group(3), [], (m.group(2) or "").replace("\\", "")))
            elif sub and parts and parts[-1][0] == "rule":
                parts[-1][3].append(sub.group(1))
            elif line.strip() and not line.startswith(("-", " ", "---")) and parts:
                parts.append(("p", line))
    return parts


# --- the visual examples ----------------------------------------------------------------------------
# Every example is markup that uses classes defined in CSS below, and the classes read custom properties.

def meta(t):
    """The texture and the tone a theme renders with, from its own tokens (the fill formula says which wash it uses)."""
    fill = t["tokens"]["control-fill"]
    texture = t["figma"]["material"]
    if texture == "glass":
        tone = "light" if t["colorMode"] == "light" else "dark"
    else:
        tone = "light" if "alpha-light" in fill else "dark"
    return texture, tone


META = {t["name"]: meta(t) for t in themes}
FIX = {"sharp": "fabrik", "subtle": "berghain", "strong": "illuzion", "rounded": "pacha"}
LIGHT, DARK = "illuzion", "berghain"


DEFAULT = "illuzion"


def themed(inner, cls="", fixed=None, busy=False):
    """A box in a theme's own background. `busy` is kept for the callers but draws nothing: the examples use the themes' real backgrounds."""
    fixed = fixed or DEFAULT
    return f'<div class="demo th-{fixed} {cls}" data-texture="{META[fixed][0]}" data-tone="{META[fixed][1]}">{inner}</div>'


def caption(text):
    return f'<p class="cap">{inline(text)}</p>'


CARET = '<svg class="ico" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"/></svg>'
CHECK = '<svg class="ico" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"/></svg>'


def row(*items):
    return '<div class="row">' + "".join(items) + "</div>"


def cell(label, inner):
    return f'<figure class="cell">{inner}<figcaption>{inline(label)}</figcaption></figure>'


def four_themes(build, label=lambda k, n: f"{n}: `radius={k}`"):
    return row(*[cell(label(k, n), themed(build(k), fixed=n)) for k, n in FIX.items()])


def nav(extra=""):
    return f'<div class="navbar {extra}"><span class="tab on">Look</span><span class="tab">Feel</span><span class="tab">Rules</span></div>'


def chip(text="Chip", cls=""):
    return f'<span class="chip {cls}">{text}</span>'


def fill_matrix(kind):
    """Texture rows: the same texture in a dark colour-mode and a light one."""
    out = []
    for mode, name in (("dark", DARK), ("light", LIGHT)):
        out.append(cell(f"colour-mode `{mode}`", themed(f'<div class="swatch fill-{kind}-{mode}"><span>Component</span></div>', fixed=name, busy=True)))
    return row(*out)


def texture_matrix():
    """One illustration: a component in each texture, in a light colour-mode and a dark one, in a real theme that has it."""
    head = '<div class="mh"></div><div class="mh">Light colour-mode</div><div class="mh">Dark colour-mode</div>'
    cells = []
    for kind, label in (("solid", "Solid"), ("gradient", "Gradient"), ("glass", "Glass")):
        cells.append(f'<div class="ml">{label}</div>')
        for tone in ("light", "dark"):
            theme = next((t for t in themes if META[t["name"]] == (kind, tone)), None)
            if theme is None:
                cells.append('<div class="mempty">No theme has this combination yet</div>')
                continue
            comp = f'<div class="navbar">{nav_tabs()}</div>'
            cells.append(f'<div class="mwrap">{themed(comp, fixed=theme["name"], cls="mcell")}<span class="mname">{html.escape(theme["label"])}</span></div>')
    return (
        f'<div class="matrix">{head}{"".join(cells)}</div>'
        + caption("Each cell is a real theme with its own background, drawn with its own tokens. Glass is an approximation of the Glass sheet: a tint and a blur, without the refraction.")
    )


def ladder(mode):
    steps = ["none", "xs", "sm", "md", "lg", "xl"]
    boxes = "".join(f'<div class="step"><i style="background:var(--alpha-{mode}-{s})"></i><span>{s}</span></div>' for s in steps if not (mode == "light" and s == "none"))
    return f'<div class="ladder checker">{boxes}</div>'


def popup(opener_shadow="xs", glass=False, blur=True, rows=("today", "this month", "this year"), extra=""):
    items = "".join(f'<div class="prow{" sel" if i == 1 else ""}">{r}{CHECK if i == 1 else ""}</div>' for i, r in enumerate(rows))
    return f'<div class="popup {"glass" if glass else ""} {"" if blur else "noblur"}">{items}{extra}</div>'


def examples():
    E = {}
    E["T4"] = [
        themed(
            row(
                chip("Button"),
                '<div class="field">Write a message…</div>',
                f'<div class="nativewrap"><select class="native"><option>this month</option></select><span class="caret">{CARET}</span></div>',
                nav(),
            )
        ) + caption("Each of these reads `(body) md` from the theme."),
        themed('<p class="t-md">A paragraph of text, in the theme\'s body font and weight, at the same size as the controls above.</p>'),
    ]
    E["T5"] = [themed(type_spec("illuzion"))]
    E["B2"] = [
        themed('<div class="popup small"><div class="prow">today</div><div class="rule-line"></div><div class="prow foot">Type to search</div></div>', fixed="amnesia") + caption("The divider is the border colour (Amnesia)."),
        themed('<div class="popup small"><div class="prow">today</div><div class="prow sel">this month</div></div>', fixed="amnesia") + caption("The outline is the border colour (Amnesia)."),
    ]
    E["T2"] = [
        four_themes(lambda k: row(chip("Button"), '<div class="card-ex mini">Card</div>'), lambda k, n: f"{n}: `radius={k}`"),
        row(
            cell("Illuzion: `shadow=none`", themed('<div class="elev e-sm">Card</div>', fixed="illuzion", cls="stage")),
            cell("Ushuaia: `shadow=strong`", themed('<div class="elev e-sm">Card</div>', fixed="ushuaia", cls="stage")),
        ),
        themed(
            '<div class="trow"><code>Laroc · motion=none</code><div class="track"><i class="dot" style="transition-duration:var(--duration-instant)"></i></div></div>'
            '<div class="trow"><code>Illuzion · motion=ease</code><div class="track"><i class="dot" style="transition-duration:var(--duration-fast)"></i></div></div>'
        ) + '<button class="play" onclick="playTiming(this)">Play</button>',
    ]
    E["X1"] = [themed('<div class="ring spin"><span>Metal</span></div>', fixed=DARK) + caption("The ring's animation is part of what the component is.")]
    E["C1"] = texture_matrix()
    E["B1"] = row(
        cell("Light colour-mode: `alpha/dark/xs` (Illuzion)", themed('<div class="shell">Component</div>', fixed=LIGHT)),
        cell("Dark colour-mode: `alpha/light/xs` (Fabrik)", themed('<div class="shell">Component</div>', fixed="fabrik")),
        cell("Glass: no border (Berghain)", themed('<div class="shell">Component</div>', fixed=DARK)),
        cell("Centred on the edge, zoomed: half the line is outside the box, half inside, and the padding (shaded) is measured from the edge", themed('<div class="shell centred"><div class="padband"><span>padding</span></div></div>', fixed=LIGHT)),
    )
    E["B6"] = row(
        cell("Ring on a light surface, with the darker line outside", themed('<div class="ring on-light"><span>Upgrade</span></div>', fixed=LIGHT)),
        cell("Ring on a dark surface", themed('<div class="ring"><span>Upgrade</span></div>', fixed=DARK)),
    ) + caption("An illustration: the real effect is the metal-fx shader.")
    E["R1"] = four_themes(lambda k: chip("Control"), lambda k, n: f"`radius={k}`: `radius/button`")
    E["R2"] = four_themes(lambda k: '<div class="card-ex tall">Card</div>', lambda k, n: f"`radius={k}`: `radius/md`")
    E["R4"] = [
        four_themes(lambda k: nav(), lambda k, n: f"`radius={k}`: `radius/button` + padding"),
        four_themes(lambda k: '<div class="card-ex pic"><i class="photo"></i><span>Card</span></div>', lambda k, n: f"`radius={k}`: `radius/xs` + padding"),
    ]
    E["R5"] = [
        themed(nav(), fixed="fabrik") + caption("Fabrik: the padding never rounds it."),
        themed(nav(), fixed="pacha") + caption("Pacha: it stays a pill."),
    ]
    E["R6"] = themed('<div class="card-ex guide"><span class="padtag">card padding</span>Card content</div>')
    E["S1"] = themed('<div class="navbar guide"><span class="tab on">Look</span><span class="tab">Feel</span></div>') + caption("The shaded band is the padding: at least `size-controls/interactive-component/min-padding/component`.")
    E["S2"] = themed(
        '<div class="navbar bar guide"><span class="plus">+</span><span class="input">Write a message…</span></div>'
    ) + caption("The input's own side padding (marked) is twice the bar's padding.")
    E["I1"] = themed(
        f'<div class="iconrow"><span class="iconbox">{CARET}</span><span class="iconbox">{CHECK}</span><span class="note">Each icon sits in an <code>icon-within-component</code> box (outlined). The weight comes from the theme and is drawn by the app.</span></div>'
    )
    E["H1"] = row(
        cell("Light colour-mode: `alpha/dark/sm`", themed(row(chip("Rest"), chip("Hover", "hov")), fixed=LIGHT)),
        cell("Dark colour-mode: `alpha/light/sm`", themed(row(chip("Rest"), chip("Hover", "hov")), fixed=DARK, busy=True)),
    )
    E["H2"] = themed(row(nav(), nav("hovered"))) + caption("Left: rest. Right: hovering the second tab. The text, the icon and the border are untouched; only the background gains the wash.")
    E["M1"] = timing_demo()
    E["M3"] = themed('<div class="ring spin"><span>Metal</span></div>', fixed=DARK, busy=True) + caption("The ring's own animation is the component's identity, so it keeps its own timing.")
    E["E1"] = themed(row(*[f'<div class="elev e-{s}">{s}</div>' for s in ("xs", "sm", "md", "lg")]), cls="stage", fixed="ushuaia") + caption("The theme's `shadow` setting picks how strong these are (Ushuaia). A theme with `shadow=none` draws none.")
    E["E3"] = themed(
        '<div class="stack"><div class="elev e-xs wide">Component · <code>xs</code></div><div class="elev e-sm wide up">Its popup · <code>sm</code></div></div>', cls="stage", fixed="ushuaia"
    )
    E["X2"] = row(
        cell("Translucent fill: the effect shows", themed('<div class="ring"><span>Metal</span></div>', fixed=DARK)),
        cell("Solid white fill: the effect is hidden", themed('<div class="ring solid"><span>Metal</span></div>', fixed=DARK)),
    )
    E["K1"] = themed(
        '<div class="heights"><div class="h44"><span class="tag">component height</span><div class="navbar">' + nav_tabs() + "</div></div></div>"
    ) + caption("The nav bar, the prompt bar and the metal buttons are all `size-controls/interactive-component/min-height/component`.")
    E["K2"] = themed(
        '<div class="heights"><div class="h44"><span class="tag">component</span><div class="navbar tall">'
        + '<span class="tab on h36">Look<em>within component</em></span><span class="tab h36">Feel</span><span class="tab h36">Rules</span></div></div></div>'
    ) + caption("The tabs inside the nav bar are `component-within-component`.")
    E["K3"] = themed(row(nav(), chip("Button", "ctl"))) + caption("Body md, from the theme, in every control.")
    E["P1"] = E["E3"]
    E["P2"] = themed('<div class="stage"><div class="popup guide">' + "".join(f'<div class="prow">{r}</div>' for r in ("today", "this month")) + "</div></div>")
    E["P3"] = themed(
        '<div class="stage"><div class="opener">Component</div><div class="popup halfw">' + "".join(f'<div class="prow">{r}</div>' for r in ("today", "this month")) + "</div></div>"
    ) + caption("The popup is at least half the width of the component that opens it (never narrower than its own rows).")
    E["P4"] = row(
        cell("Solid (Fabrik): the fill, then the fill + `alpha/dark/sm`", themed('<div class="stack"><div class="navbar">' + nav_tabs() + '</div><div class="popup">' + popup_rows() + "</div></div>", fixed="fabrik")),
        cell("Gradient (Ushuaia): the same", themed('<div class="stack"><div class="navbar">' + nav_tabs() + '</div><div class="popup">' + popup_rows() + "</div></div>", fixed="ushuaia")),
        cell("Glass (Berghain): one weight up, no wash", themed('<div class="stack"><div class="navbar">' + nav_tabs() + '</div><div class="popup">' + popup_rows() + "</div></div>", fixed=DARK)),
    )
    E["P5"] = themed(
        '<div class="behind"><p>Behind the popup: a paragraph of the page&#x27;s own text, so the blur has something to soften.</p><p>The quick brown fox jumps over the lazy dog, and the popup blurs all of it.</p></div><div class="popup frost">' + popup_rows() + "</div>"
    ) + caption("The blur is `alpha/blur/320/sm` on a page narrower than the width in its name, and `alpha/blur/1200/sm` from that width up. This page is using the one for its current width.")
    E["P6"] = four_themes(lambda k: '<div class="popup small">' + '<div class="prow">today</div><div class="prow sel">this month</div></div>', lambda k, n: f"`radius={k}`: popup `radius/md`, rows `radius/button`")
    E["B3"] = row(cell("A divider and the outline of a popup follow the border colour rule", themed('<div class="popup small">' + '<div class="prow">today</div><div class="rule-line"></div><div class="prow foot">Type to search</div></div>')))
    E["P7"] = row(cell("Outline and divider follow the border rules", themed('<div class="popup small">' + '<div class="prow">today</div><div class="rule-line"></div><div class="prow foot">Type to search</div></div>')))
    E["P8"] = themed('<div class="popup">' + '<div class="prow">Add photos &amp; files</div><div class="prow">Gmail<span class="linkbtn">Connect</span></div></div>') + caption("A link or ghost button inside a popup: `primary` background, `primary-foreground` text.")
    E["P9"] = open_close_demo()
    E["P10"] = themed(
        f'<div class="nativewrap"><select class="native"><option>today</option><option selected>this month</option><option>this year</option></select><span class="caret">{CARET}</span></div>'
    ) + caption("The chip is themed; open it to see the dropdown the browser draws.")
    return E


def nav_tabs():
    return '<span class="tab on">Look</span><span class="tab">Feel</span><span class="tab">Rules</span>'


def type_spec(name):
    """The four theme variables `body/sans/md/regular` is made of, read from the theme's own tokens."""
    th = next(x for x in themes if x["name"] == name)
    tk = th["tokens"]
    rows = [
        ("Font/Sans/font", th["fonts"]["body"]),
        ("Font/Sans/weight", tk["font-body-weight"]),
        ("Font/Sans/line-height", tk["font-body-line-height"]),
        ("Font/Sans/letter-spacing", tk["font-body-letter-spacing"]),
    ]
    spec = "".join(f"<div class=\"spec\"><code>{k}</code><span>{html.escape(str(v))}</span></div>" for k, v in rows)
    return f'<p class="t-md">body/sans/md/regular: the sentence you are reading, in {html.escape(th["label"])}.</p><div class="specs">{spec}</div>'


def popup_rows():
    return "".join(f'<div class="prow{" sel" if i == 1 else ""}">{r}</div>' for i, r in enumerate(("today", "this month", "this year")))


def timing_demo():
    rows = []
    for name, _ in durations():
        rows.append(f'<div class="trow"><code>Timing/{name}</code><div class="track"><i class="dot" style="transition-duration:var(--duration-{name})"></i></div></div>')
    return themed("".join(rows)) + '<button class="play" onclick="playTiming(this)">Play</button>'


def open_close_demo():
    return (
        themed(
            '<div class="stage"><button class="opener click" onclick="this.nextElementSibling.classList.toggle(\'open\')">Click to open and close</button>'
            + '<div class="popup anim"><div class="prow">today</div><div class="prow sel">this month</div></div></div>'
        )
        + caption("Opens at `Timing/faster`, closes at `Timing/fast`.")
    )


# --- the page ----------------------------------------------------------------------------------------

PAGE_CSS = r"""
:root {
  color-scheme: light dark;
  --page: #f4f3f1; --ink: #1c1b1a; --muted: #6a6762; --line: #dcdad5; --card-bg: #ffffff; --accent: #2b2a8f;
  --duration-none: 0s;
  __DURATIONS__
  __SIZES__
  __GLASS__
  --popup-blur: var(--alpha-blur-320-sm, 40px);
}
@media (prefers-color-scheme: dark) {
  :root { --page: #161514; --ink: #ecebe8; --muted: #9a968f; --line: #34322f; --card-bg: #201f1d; --accent: #aab0ff; }
}
@media (min-width: 1200px) { .th, [class*="th-"] { --popup-blur: var(--alpha-blur-1200-sm, 120px); } }
* { box-sizing: border-box; }
body { margin: 0; background: var(--page); color: var(--ink); font: 16px/1.55 ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif; }
h1.title { font-size: 26px; margin: 0 0 8px; }
.layout { display: grid; grid-template-columns: 220px minmax(0, 1fr); gap: 32px; max-width: 1180px; margin: 0 auto; padding: 24px; }
nav.toc { position: sticky; top: 24px; align-self: start; max-height: calc(100vh - 48px); overflow: auto; font-size: 13px; }
nav.toc a { display: block; color: var(--muted); text-decoration: none; padding: 3px 0; }
nav.toc a:hover { color: var(--ink); }
nav.toc .g { margin-top: 12px; font-weight: 650; color: var(--ink); text-transform: uppercase; font-size: 11px; letter-spacing: .06em; }
main { min-width: 0; }
main > p.lede { color: var(--muted); max-width: 70ch; }
h2.group { font-size: 13px; letter-spacing: .08em; text-transform: uppercase; color: var(--muted); margin: 56px 0 4px; padding-top: 16px; border-top: 2px solid var(--ink); }
h3.sub { font-size: 22px; margin: 36px 0 8px; }
.rule { background: var(--card-bg); border: 1px solid var(--line); border-radius: 12px; padding: 16px 18px; margin: 12px 0; }
.rule .head { display: flex; gap: 12px; align-items: baseline; } .pair { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 2fr); gap: 18px; align-items: start; margin: 14px 0; } .extext { margin: 0; font-size: 14px; } .extext span { display: block; font-size: 11px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); margin-bottom: 2px; } @media (max-width: 700px) { .pair { grid-template-columns: 1fr; } } .rule.exception { border-left: 4px solid #b45309; } h4.app { font-size: 15px; margin: 22px 0 4px; color: var(--muted); font-weight: 650; } .topic-eg { background: transparent; border-style: dashed; }
.rid { font: 600 12px ui-monospace, monospace; background: var(--ink); color: var(--page); border-radius: 6px; padding: 1px 7px; flex: none; }
.intro { max-width: 70ch; color: var(--muted); } .rule p { margin: 0; } .rule ul { margin: 8px 0 0; padding-left: 20px; } .rule li { margin: 5px 0; }
.rule code, .cap code, .note code { font: 12.5px ui-monospace, monospace; background: color-mix(in srgb, var(--ink) 9%, transparent); border-radius: 4px; padding: 1px 5px; }
.open { border-style: dashed; }
.tbd { display: inline-block; font-size: 11px; font-weight: 650; letter-spacing: .04em; text-transform: uppercase; color: #b45309; margin-right: 6px; }
.eg { margin-top: 14px; }
.cap { font-size: 13px; color: var(--muted); margin: 8px 0 0; }
.row { display: flex; flex-wrap: wrap; gap: 14px; align-items: flex-start; }
.cell { margin: 0; flex: 1 1 200px; min-width: 0; }
.cell figcaption { font-size: 12.5px; color: var(--muted); margin-top: 6px; }
.flags li { margin: 8px 0; }
footer { color: var(--muted); font-size: 13px; padding: 40px 0 80px; }

/* ---- the examples: only custom properties from the theme, the Timing set and the size tokens ---- */
.demo { background: var(--background); color: var(--foreground); font-family: var(--font-body); font-weight: var(--font-body-weight); line-height: var(--font-body-line-height); letter-spacing: var(--font-body-letter-spacing); padding: 20px; border-radius: var(--radius); position: relative; isolation: isolate; overflow: hidden; }
.demo.tight { padding: 16px; }
.demo[data-texture="glass"] :is(.navbar, .shell, .card-ex, .elev) { background: var(--glass-soft-dark); backdrop-filter: blur(var(--glass-soft-blur)); outline: none; }
.demo[data-texture="glass"][data-tone="light"] :is(.navbar, .shell, .card-ex, .elev) { background: var(--glass-soft-light); }
.demo[data-texture="glass"] .popup { background: var(--glass-medium-dark); backdrop-filter: blur(var(--popup-blur)); outline: none; }
.demo[data-texture="glass"][data-tone="light"] .popup { background: var(--glass-medium-light); }
.behind { padding-bottom: 8px; } .behind p { margin: 0 0 .4em; max-width: 46ch; } .behind + .popup { margin-top: -54px; margin-left: 40px; }
.t-md { font-size: 1rem; margin: 0 0 .4em; } .t-sm { font-size: .875rem; margin: 0; }
.swatches { display: flex; gap: 8px; flex-wrap: wrap; } .swatches span { padding: 14px 12px; border-radius: var(--radius-xs); font-size: 12px; border: 1px solid var(--border); }
.chip { display: inline-flex; align-items: center; height: var(--control-h-inner); padding: 0 calc(var(--pad-min) * 2); border-radius: var(--radius-button); background: var(--secondary); color: var(--secondary-foreground); position: relative; isolation: isolate; font-size: 1rem; }
.chip.hov::before, .hov.shell::before { content: ""; position: absolute; inset: 0; border-radius: inherit; background: var(--control-hover); z-index: -1; }
.chip.ctl { background: var(--secondary); }
.card-ex { position: relative; isolation: isolate; border-radius: var(--radius-md); padding: var(--pad-card); background: var(--control-fill); box-shadow: var(--shadow-xs); outline: var(--border-w) solid var(--control-edge); outline-offset: calc(var(--border-w) / -2); min-width: 140px; }
.card-ex.mini { padding: 8px 14px; min-width: 0; min-height: 72px; display: flex; align-items: center; } .card-ex.tall { min-height: 110px; display: flex; align-items: center; }
.card-ex.pic { display: flex; gap: 12px; align-items: center; max-width: 340px; min-width: 0; border-radius: min(var(--radius-outer-max), calc(var(--radius-xs) + var(--pad-card))); } .photo { width: 64px; height: 64px; flex: none; border-radius: var(--radius-xs); background: linear-gradient(135deg, var(--primary), var(--secondary)); }
.card-ex.guide, .navbar.guide { background-image: linear-gradient(color-mix(in srgb, var(--primary) 22%, transparent), color-mix(in srgb, var(--primary) 22%, transparent)); background-clip: padding-box; }
.padtag { position: absolute; top: 2px; right: 8px; font-size: 11px; opacity: .8; }
.navbar { display: inline-flex; gap: calc(var(--pad-min) / 2); padding: var(--pad-min); height: var(--control-h); align-items: center; border-radius: min(var(--radius-outer-max), calc(var(--radius-button) + var(--pad-min))); background: var(--control-fill); outline: var(--border-w) solid var(--control-edge); outline-offset: calc(var(--border-w) / -2); box-shadow: var(--shadow-sm); position: relative; isolation: isolate; }
.tab { height: var(--control-h-inner); padding: 0 calc(var(--pad-min) * 3); display: inline-flex; align-items: center; gap: 4px; border-radius: var(--radius-button); position: relative; isolation: isolate; font-size: 1rem; }
.tab.on { background: var(--foreground); color: var(--background); }
.navbar.hovered .tab:nth-child(2)::before { content: ""; position: absolute; inset: 0; border-radius: inherit; background: var(--control-hover); z-index: -1; }
.navbar .input { padding: 0 calc(var(--pad-min) * 2); outline: 1px dashed var(--primary); height: var(--control-h-inner); display: inline-flex; align-items: center; opacity: .85; min-width: 180px; } .navbar .plus { width: var(--control-h-inner); text-align: center; }
.heights .h44 { position: relative; } .tag { display: block; font-size: 11px; opacity: .7; margin-bottom: 4px; } .tab.h36 em { font-size: 10px; margin-left: 6px; opacity: .7; font-style: normal; }
.swatch { height: 76px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; font-size: 13px; outline: var(--border-w) solid var(--control-edge); outline-offset: calc(var(--border-w) / -2); }
.field { height: var(--control-h); display: inline-flex; align-items: center; padding: 0 calc(var(--pad-min) * 3); border-radius: var(--radius-button); background: var(--control-fill); outline: var(--border-w) solid var(--control-edge); outline-offset: calc(var(--border-w) / -2); min-width: 190px; opacity: .9; } .specs { display: grid; gap: 4px; margin-top: 10px; font-size: 13px; } .spec { display: flex; gap: 10px; align-items: baseline; } .spec code { font: 12px ui-monospace, monospace; opacity: .8; min-width: 190px; } .stack { display: grid; gap: 10px; } .matrix { display: grid; grid-template-columns: 90px 1fr 1fr; gap: 8px; align-items: stretch; } .mh { font-size: 12.5px; color: var(--muted); font-weight: 600; } .ml { font-size: 13px; font-weight: 600; align-self: center; } .demo.mcell { padding: 22px 16px; display: flex; justify-content: center; } .mwrap { display: grid; gap: 4px; } .mname { font-size: 12px; color: var(--muted); } .mempty { border: 1px dashed var(--line); border-radius: 10px; display: grid; place-items: center; font-size: 12.5px; color: var(--muted); padding: 16px; text-align: center; }
.ladder { display: flex; gap: 6px; padding: 10px; border-radius: 8px; } .checker { background: repeating-conic-gradient(#bbb 0 25%, #eee 0 50%) 0 0 / 16px 16px; }
.step { text-align: center; font-size: 11px; color: #222; } .step i { display: block; width: 40px; height: 40px; border-radius: 6px; margin-bottom: 3px; }
.shell { position: relative; isolation: isolate; padding: 20px; border-radius: var(--radius-md); background: var(--control-fill); outline: var(--border-w) solid var(--control-edge); outline-offset: calc(var(--border-w) / -2); text-align: center; }
.shell.glassy { background: var(--glass-soft-dark); backdrop-filter: blur(var(--glass-soft-blur)); outline: none; }
.shell.centred { height: 110px; outline-width: 3px; outline-offset: -1.5px; outline-color: var(--primary); padding: 0; } .padband { position: absolute; inset: 0; border-radius: inherit; box-shadow: inset 0 0 0 var(--pad-card) color-mix(in srgb, var(--primary) 18%, transparent); display: grid; place-items: center; font-size: 12px; } .padband span { background: var(--background); padding: 0 6px; }
.iconrow { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; } .iconbox { width: var(--icon-box); height: var(--icon-box); outline: 1px dashed var(--primary); display: inline-flex; } .ico { width: 100%; height: 100%; } .note { font-size: 13px; opacity: .8; }
.timing, .trow { display: grid; grid-template-columns: 150px 1fr; gap: 10px; align-items: center; margin: 6px 0; } .track { height: 16px; border-radius: var(--radius-button); background: color-mix(in srgb, var(--foreground) 10%, transparent); position: relative; } .dot { position: absolute; left: 0; top: 2px; width: 12px; height: 12px; border-radius: var(--radius-button); background: var(--primary); transition-property: left; transition-timing-function: linear; } .dot.noanim { transition: none !important; } .track.go .dot, .go .dot { left: calc(100% - 12px); } .trow code { font-size: 12px; }
.play { margin-top: 10px; font: inherit; padding: 4px 14px; border-radius: 999px; border: 1px solid var(--line); background: var(--card-bg); color: var(--ink); cursor: pointer; }
.stage { display: flex; gap: 14px; flex-wrap: wrap; align-items: flex-start; padding: 24px; border-radius: var(--radius); }
.elev { padding: 18px 22px; border-radius: var(--radius-md); background: var(--control-fill); outline: var(--border-w) solid var(--control-edge); outline-offset: calc(var(--border-w) / -2); }
.e-xs { box-shadow: var(--shadow-xs); } .e-sm { box-shadow: var(--shadow-sm); } .e-md { box-shadow: var(--shadow-md); } .e-lg { box-shadow: var(--shadow-lg); } .elev.wide { min-width: 230px; } .elev.up { margin-left: 24px; }
.ring { position: relative; display: inline-flex; align-items: center; justify-content: center; height: var(--control-h); padding: 0 24px; border-radius: var(--radius-button); background: color-mix(in srgb, var(--foreground) 8%, transparent); isolation: isolate; }
.ring::before { content: ""; position: absolute; inset: 0; padding: 2px; border-radius: inherit; background: conic-gradient(from 0deg, #fff, #8cf, #f9c, #fc8, #fff); -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); -webkit-mask-composite: xor; mask-composite: exclude; z-index: 1; }
.ring.on-light { outline: var(--border-w) solid var(--alpha-dark-xs); outline-offset: 0; } .ring.solid { background: #fff; color: #222; } @property --a { syntax: '<angle>'; initial-value: 0deg; inherits: false; } .ring::before { background: conic-gradient(from var(--a), #fff, #8cf, #f9c, #fc8, #fff); } .ring.spin::before { animation: spin 3s linear infinite; } @keyframes spin { to { --a: 360deg; } }
.opener { position: relative; padding: 12px 18px; border-radius: var(--radius-md); background: var(--control-fill); outline: var(--border-w) solid var(--control-edge); outline-offset: calc(var(--border-w) / -2); min-width: 200px; border: 0; color: inherit; font: inherit; text-align: left; box-shadow: var(--shadow-xs); }
.popup { position: relative; isolation: isolate; padding: var(--pad-popup); border-radius: var(--radius-md); min-width: 180px; background: linear-gradient(var(--alpha-dark-sm), var(--alpha-dark-sm)), var(--control-fill); backdrop-filter: blur(var(--popup-blur)); box-shadow: var(--shadow-sm); outline: var(--border-w) solid var(--control-edge); outline-offset: calc(var(--border-w) / -2); }
.popup.noblur { backdrop-filter: none; } .popup.small { min-width: 140px; } .popup.halfw { min-width: 100px; width: 50%; }
.prow { display: flex; justify-content: space-between; align-items: center; height: var(--control-h-inner); padding: 0 var(--pad-popup); border-radius: var(--radius-button); position: relative; gap: 12px; } .prow.sel::before, .prow:hover::before { content: ""; position: absolute; inset: 0; border-radius: inherit; background: var(--control-hover); z-index: -1; } .prow .ico { width: var(--icon-box); }
.popup.guide { background-image: linear-gradient(color-mix(in srgb, var(--primary) 22%, transparent), color-mix(in srgb, var(--primary) 22%, transparent)); }
.rule-line { height: var(--border-w); background: var(--control-edge); margin: 4px 0; } .prow.foot { opacity: .75; }
.linkbtn { background: var(--primary); color: var(--primary-foreground); border-radius: var(--radius-button); padding: 2px calc(var(--pad-min) * 2); font-size: 14px; }
.popup.anim { position: absolute; margin-top: 8px; opacity: 0; transform: translateY(-4px); pointer-events: none; transition: opacity var(--duration-fast), transform var(--duration-fast); } .popup.anim.open { opacity: 1; transform: none; pointer-events: auto; transition-duration: var(--duration-faster); } .stage:has(.popup.anim) { min-height: 190px; display: block; }
.nativewrap { position: relative; display: inline-block; isolation: isolate; border-radius: var(--radius-button); background: var(--secondary); color: var(--secondary-foreground); } .nativewrap .native { appearance: none; border: 0; background: transparent; color: inherit; font: inherit; height: var(--control-h-inner); padding: 0 calc(var(--pad-min) * 7) 0 calc(var(--pad-min) * 2); border-radius: inherit; } .nativewrap .caret { position: absolute; right: calc(var(--pad-min) * 2); top: 50%; width: var(--icon-box); height: var(--icon-box); transform: translateY(-50%); pointer-events: none; }
@media (max-width: 860px) { .layout { grid-template-columns: 1fr; } nav.toc { display: none; } }
"""

JS = r"""
function playTiming(btn) {
  // back to the start with no transition, then run: so each press shows the whole move, however fast it is
  const rows = btn.previousElementSibling;
  const tracks = [...rows.querySelectorAll('.track')];
  tracks.forEach(t => { t.querySelector('.dot').classList.add('noanim'); t.classList.remove('go'); });
  void rows.offsetWidth;
  tracks.forEach(t => t.querySelector('.dot').classList.remove('noanim'));
  requestAnimationFrame(() => tracks.forEach(t => t.classList.add('go')));
}
"""


# the examples were drawn under the old rule names; here is where each one sits now
ALIAS = {
    "T2": "1.1.2", "T4": "1.2.1", "T5": "1.2.2", "B2": "3.2.1", "X1": "1.1.3", "R1": "4.1.1", "R2": "4.1.2", "R4": "4.1.3", "R5": "4.1.4", "S1": "5.1.1", "S2": "5.1.2", "R6": "5.1.3",
    "I1": "6.1.1", "H1": "7.1.1", "H2": "7.1.2", "M1": "8.1.1", "M3": "8.1.3", "E1": "9.1.1", "E3": "9.1.3",
    "K1": "10.1.1", "K2": "10.1.2", "P2": "11.1.1", "P3": "11.1.2", "P6": "11.1.3", "P4": "11.2.1", "P5": "11.2.2",
    "P8": "11.2.3", "P9": "11.3.1", "P10": "11.4.1", "B6": "12.1.1", "X2": "12.2.1",
    "C1": "topic:2", "B1": "topic:3",
}


def slug(text):
    return re.sub(r"\W+", "-", text.lower()).strip("-")


def build():
    parts = parse_md()
    old = examples()
    eg = {ALIAS[k]: v for k, v in old.items() if k in ALIAS}
    toc, body = [], []
    topic = None

    def flush():
        if topic is not None and f"topic:{topic}" in eg:
            body.append(f'<div class="rule topic-eg"><div class="eg">{eg[f"topic:{topic}"]}</div></div>')

    for p in parts:
        if p[0] == "h1":
            flush(); topic = None
            gid = slug(p[1])
            toc.append(f'<a class="g" href="#{gid}">{html.escape(p[1].title() if p[1].isupper() else p[1])}</a>')
            body.append(f'<h2 class="group" id="{gid}">{html.escape(p[1])}</h2>')
        elif p[0] == "h2":
            flush()
            m = re.match(r"(\d+) ", p[1])
            topic = m.group(1) if m else None
            toc.append(f'<a href="#t{slug(p[1])}">{html.escape(p[1])}</a>')
            body.append(f'<h3 class="sub" id="t{slug(p[1])}">{html.escape(p[1])}</h3>')
        elif p[0] == "h3":
            body.append(f'<h4 class="app">{html.escape(p[1])}</h4>')
        elif p[0] == "p":
            body.append(f'<p class="intro">{inline(p[1])}</p>')
        else:
            rid, text, subs, mark = p[1], p[2], p[3], p[4]
            label = rid + mark
            cls = "rule open" if mark == "?" else ("rule exception" if mark == "*" else "rule")
            text_html = inline(text).replace("<strong>To define:</strong>", '<span class="tbd">To define</span>')
            ex_text = [x[len("Example:"):].strip() for x in subs if x.startswith("Example:")]
            subs = [x for x in subs if not x.startswith("Example:")]
            if subs:
                text_html += "<ul>" + "".join(f"<li>{inline(x)}</li>" for x in subs) + "</ul>"
            example = ""
            illus = eg.get(rid)
            if ex_text and illus is not None:
                # examples are written next to the illustration that shows them, not in the rule's text
                pieces = illus if isinstance(illus, list) else [illus]
                if len(pieces) == len(ex_text):
                    example = '<div class="eg">' + "".join(f'<div class="pair"><p class="extext"><span>Example</span>{inline(x)}</p><div>{y}</div></div>' for x, y in zip(ex_text, pieces)) + "</div>"
                else:
                    example = '<div class="eg"><div class="pair"><div class="extext">' + "".join(f"<p><span>Example</span>{inline(x)}</p>" for x in ex_text) + f'</div><div>{"".join(pieces)}</div></div></div>'
            elif ex_text:
                text_html += "<ul>" + "".join(f"<li>Example: {inline(x)}</li>" for x in ex_text) + "</ul>"
            elif illus is not None:
                example = f'<div class="eg">{"".join(illus) if isinstance(illus, list) else illus}</div>'
            body.append(f'<div class="{cls}" id="r{rid.replace(".", "-")}"><div class="head"><span class="rid">{label}</span><div class="rtext">{text_html}</div></div>{example}</div>')
    flush()
    fonts = sorted({f for t in themes for f in t["fonts"].values()})
    gf = "&".join("family=" + f.replace(" ", "+") for f in fonts)
    css = (
        PAGE_CSS.replace("__DURATIONS__", "\n  ".join(f"--duration-{n}: {v};" for n, v in durations()))
        .replace("__SIZES__", size_css())
        .replace("__GLASS__", glass_css())
    )
    theme_block = "\n".join(theme_css(t) for t in themes)
    script = JS
    page = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Component theming guidelines</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{gf}&display=swap">
<style>
{theme_block}
{css}
</style>
</head>
<body>
<div class="layout">
<nav class="toc" aria-label="Contents">{"".join(toc)}</nav>
<main>
<h1 class="title">Component theming guidelines</h1>
<p class="lede">The guidelines, with an example under each point where one can be drawn. The examples are built from the theme files, the Timing set and the size tokens, so they change when the tokens do. Each example is a real theme drawn with its own tokens, named where it matters. Glass and the metal ring are approximations, not the real effects.</p>
{"".join(body)}
<footer>Built by docs/build-guidelines-page.py from component-theming-guidelines.md and the token files. Run it again after changing either.</footer>
</main>
</div>
<script>
{script}
</script>
</body>
</html>
"""
    OUT.write_text(page)
    print("wrote", OUT, len(page) // 1024, "KB;", sum(1 for p in parts if p[0] == "rule"), "rules;", len(eg), "examples")


if __name__ == "__main__":
    build()
