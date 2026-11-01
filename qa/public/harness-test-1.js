// Test 1's checks, as a file so a page reload does not lose them. Run in the Results page:
//   const { tests } = await import('/qa/harness-test-1.js')
// A scratch test tool: it only reads rendered styles and never changes a component.
const art = p => [...document.querySelectorAll('article')].find(x => x.querySelector('h3')?.textContent === p)
const probe = document.createElement('div')
const norm = (a, prop, val, fs) => { a.appendChild(probe); probe.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none;' + (fs ? 'font-size:' + fs + ';' : ''); probe.style[prop] = val; return getComputedStyle(probe)[prop] }
const layers = s => { const out = []; let d = 0, cur = ''; for (const ch of s) { if (ch === '(') d++; if (ch === ')') d--; if (ch === ',' && d === 0) { out.push(cur.trim()); cur = '' } else cur += ch } if (cur.trim()) out.push(cur.trim()); return out.filter(l => !/^rgba\(0, 0, 0, 0\) 0px 0px 0px 0px$/.test(l) && l !== 'none') }
const cell = (a, label, sel) => { const lab = [...a.querySelectorAll('p.text-lg')].find(p => p.textContent === label); return lab && lab.parentElement.querySelector(sel) }
const px = v => Math.round(parseFloat(v) * 10) / 10
const T = (l, c, x) => [l, c, x]
const fam = c => c.fontFamily.split(',')[0].replace(/['"]/g, '').trim()
const fontName = a => norm(a, 'fontFamily', 'var(--font-body)').split(',')[0].replace(/['"]/g, '').trim()
export const tests = []
const add = (path, state, element, expected, run) => tests.push({ path, state, element, expected, run })

// the standard element checks for one rendered element
const std = (path, state, get, s) => {
  const A = () => art(path); const cs = () => getComputedStyle(get())
  add(path, state, 'fill', s.fill[0], () => [cs().backgroundColor === norm(A(), 'backgroundColor', s.fill[1]), 'wrong fill token', cs().backgroundColor])
  add(path, state, 'text colour', s.text[0], () => [cs().color === norm(A(), 'color', s.text[1]), 'wrong text token', cs().color])
  add(path, state, 'border', s.border[0], () => { const c = cs(); const want = norm(A(), 'borderTopColor', s.border[1]); const ok = s.border[2] === 'none' ? (c.borderTopWidth === '0px' || c.borderTopColor === want) : (c.borderTopWidth === (s.border[2] || '1px') && c.borderTopColor === want); return [ok, s.borderCode || 'wrong border token', c.borderTopWidth + ' ' + c.borderTopColor] })
  add(path, state, 'radius', s.radius[0], () => [cs().borderTopLeftRadius === norm(A(), 'borderTopLeftRadius', s.radius[1]), s.radiusCode || 'not using theme radius', cs().borderTopLeftRadius])
  add(path, state, 'shadow', s.shadow[0] + (s.ring ? ' + 3px ring ' + s.ring[0] : ''), () => { const c = cs(); const ls = layers(c.boxShadow); const want = s.shadow[1] === 'none' ? [] : layers(norm(A(), 'boxShadow', s.shadow[1])); let ok = want.length === 0 ? !ls.some(l => !/ 0px 0px 0px 3px$/.test(l)) : want.every(w => ls.includes(w)); if (s.ring) ok = ok && ls.includes(norm(A(), 'boxShadow', '0 0 0 3px ' + s.ring[1])); return [ok, s.shadowCode || 'wrong shadow token', c.boxShadow.replace(/rgba\(0, 0, 0, 0\) 0px 0px 0px 0px,? ?/g, '')] })
  if (s.size) add(path, state, 'typography', '--font-body, ' + s.size + ', weight ' + s.weight + ', line height --font-body-line-height', () => { const c = cs(); const lh = norm(A(), 'lineHeight', 'var(--font-body-line-height, 1.42)', c.fontSize); const famOk = fam(c) === fontName(A()) && c.fontSize === s.size && c.fontWeight === s.weight; const lhOk = c.lineHeight !== 'normal' && Math.abs(parseFloat(c.lineHeight) - parseFloat(lh)) < 0.1; return [famOk && lhOk, famOk && !lhOk ? 'line height not theme token' : 'wrong font token', fam(c) + ' ' + c.fontSize + ' / line ' + c.lineHeight + ' (theme line height ' + lh + ') weight ' + c.fontWeight] })
  if (s.h || s.w || s.padX !== undefined) add(path, state, 'size and spacing', (s.h ? 'height ' + s.h + 'px' : '') + (s.w ? ' width ' + s.w + 'px' : '') + (s.padX !== undefined ? ' padding-x ' + s.padX + 'px' : ''), () => { const e = get(), c = cs(), r = e.getBoundingClientRect(); return [(s.h === undefined || Math.abs(r.height - s.h) < 0.6) && (s.w === undefined || Math.abs(r.width - s.w) < 0.6) && (s.padX === undefined || c.paddingLeft === s.padX + 'px'), 'wrong size scale', px(r.width) + 'x' + px(r.height) + ' pad ' + c.paddingLeft] })
  add(path, state, 'texture', 'no extra texture on the surface (the glass material only textures cards)', () => [cs().backgroundImage === 'none', 'unexpected texture', cs().backgroundImage.slice(0, 40)])
  if (s.icon) add(path, state, 'icon style', 'icon ' + s.icon + 'px, follows the text colour', () => { const e = get(), svg = e.querySelector('svg'), c = cs(); if (!svg) return [false, 'icon missing', '']; const sc = getComputedStyle(svg); return [Math.abs(parseFloat(sc.width) - s.icon) < 0.6 && (sc.fill === c.color || sc.stroke === c.color), s.iconCode || 'wrong icon size', sc.width + ' ' + sc.fill] })
}
const one = (path, sel) => state => () => cell(art(path), state, sel)

// ---------- Button
{ const P = 'components/actions/button', g = one(P, 'button')
  const B = { fill: T('--primary', 'var(--primary)'), text: T('--primary-foreground', 'var(--primary-foreground)'), border: T('1px transparent', 'transparent'), radius: T('--radius', 'var(--radius)'), shadow: T('--shadow-md', 'var(--shadow-md)'), size: '14px', weight: '500', h: 36, padX: 12 }
  const w = o => ({ ...B, ...o })
  const OUT = { fill: T('transparent', 'transparent'), text: T('--foreground', 'var(--foreground)'), border: T('1px --foreground', 'var(--foreground)') }
  const LINK = { fill: T('transparent', 'transparent'), text: T('--primary', 'var(--primary)'), shadow: T('no shadow', 'none') }
  const S = { 'default': B, 'outline': w(OUT), 'secondary': w({ fill: T('--secondary', 'var(--secondary)'), text: T('--secondary-foreground', 'var(--secondary-foreground)') }), 'ghost': w({ fill: T('transparent', 'transparent'), text: T('--foreground', 'var(--foreground)'), shadow: T('no shadow', 'none') }), 'destructive': w({ fill: T('--destructive at 10%', 'color-mix(in oklab, var(--destructive) 10%, transparent)'), text: T('--destructive', 'var(--destructive)') }), 'link': w(LINK),
    'size xs': w({ size: '12px', h: 24, padX: 10 }), 'size lg': w({ h: 40, padX: 16 }), 'icon only': w({ w: 36, h: 36, padX: 0, icon: 16 }), 'icon only xs': w({ w: 24, h: 24, padX: 0, icon: 12 }), 'icon only lg': w({ w: 40, h: 40, padX: 0, icon: 16 }), 'icon + text xs': w({ size: '12px', h: 24, padX: 10, icon: 12 }), 'icon + text lg': w({ h: 40, padX: 16, icon: 16 }),
    'disabled': B, 'link disabled': w(LINK), 'invalid': w({ border: T('1px --destructive', 'var(--destructive)'), ring: T('--destructive at 20%', 'color-mix(in oklab, var(--destructive) 20%, transparent)') }), 'expanded': w({ ...OUT, fill: T('--muted', 'var(--muted)') }), 'hover': w({ fill: T('--primary at 80%', 'color-mix(in oklab, var(--primary) 80%, transparent)') }), 'link hover': w(LINK), 'focus visible': w({ border: T('1px --ring', 'var(--ring)'), ring: T('--ring at 50%', 'color-mix(in oklab, var(--ring) 50%, transparent)') }) }
  for (const [st, sp] of Object.entries(S)) std(P, st, g(st), sp)
  for (const st of ['disabled', 'link disabled']) add(P, st, 'disabled look', 'opacity 0.5, no pointer events', () => { const c = getComputedStyle(g(st)()); return [c.opacity === '0.5' && c.pointerEvents === 'none', 'wrong disabled look', c.opacity + ' ' + c.pointerEvents] })
  add(P, 'link hover', 'hover underline', 'underline (theme link hover)', () => { const c = getComputedStyle(g('link hover')()); return [c.textDecorationLine === 'underline', 'no underline on hover', c.textDecorationLine] })
  add(P, 'link', 'underline at rest', 'no underline until hover', () => { const c = getComputedStyle(g('link')()); return [c.textDecorationLine === 'none', 'underline at rest', c.textDecorationLine] })
}

// ---------- Icon
{ const P = 'components/actions/icon', g = one(P, 'button')
  std(P, 'default', g('default'), { fill: T('--primary', 'var(--primary)'), text: T('--primary-foreground', 'var(--primary-foreground)'), border: T('no visible border, as Button', 'transparent', 'none'), radius: T('--radius, as Button', 'var(--radius)'), radiusCode: 'radius differs from Button', shadow: T('--shadow-md, as Button', 'var(--shadow-md)'), shadowCode: 'shadow differs from Button', w: 36, h: 36, icon: 16 })
  add(P, 'default', 'built on Button', 'uses Button and its variants (data-slot button), not a second copy', () => { const e = g('default')(); return [e.getAttribute('data-slot') === 'button', 'redrawn not inherited', 'data-slot=' + e.getAttribute('data-slot')] })
}

// ---------- Option List
{ const P = 'components/actions/option list', g = one(P, 'button')
  const base = { fill: T('transparent', 'transparent'), text: T('--foreground', 'var(--foreground)'), border: T('1px --foreground', 'var(--foreground)'), radius: T('--radius', 'var(--radius)'), shadow: T('no shadow', 'none'), size: '14px', weight: '400', padX: 12 }
  std(P, 'default', g('default'), base)
  std(P, 'selected', g('selected'), { ...base, fill: T('--foreground', 'var(--foreground)'), text: T('--background', 'var(--background)') })
  std(P, 'hover', g('hover'), { ...base, fill: T('--muted', 'var(--muted)') })
  std(P, 'icons and descriptions', g('icons and descriptions'), { ...base, icon: 16, iconCode: 'icon size not set' })
  add(P, 'icons and descriptions', 'description text', 'secondary text uses --muted-foreground', () => { const e = g('icons and descriptions')(); const d = [...e.querySelectorAll('span')].find(x => /Included/.test(x.textContent)); return [!!d && getComputedStyle(d).color === norm(art(P), 'color', 'var(--muted-foreground)'), 'not using muted text token', d ? getComputedStyle(d).color : 'missing'] })
}

// ---------- Input
{ const P = 'components/inputs/input', g = one(P, 'input')
  const base = { fill: T('--card', 'var(--card)'), text: T('--foreground', 'var(--foreground)'), border: T('1px --muted', 'var(--muted)'), radius: T('--radius', 'var(--radius)'), shadow: T('--shadow-md', 'var(--shadow-md)'), size: '14px', weight: '400', h: 36, padX: 12 }
  for (const st of ['default', 'filled', 'disabled', 'invalid', 'focus', 'file']) {
    const s = { ...base }; if (st === 'invalid') { s.border = T('1px --destructive', 'var(--destructive)'); s.ring = T('--destructive at 20%', 'color-mix(in oklab, var(--destructive) 20%, transparent)') }
    if (st === 'focus') { s.border = T('1px --ring', 'var(--ring)'); s.borderCode = 'focus border differs from Textarea' }
    std(P, st, g(st), s)
  }
  add(P, 'default', 'placeholder colour', 'placeholder uses --muted-foreground', () => [getComputedStyle(g('default')(), '::placeholder').color === norm(art(P), 'color', 'var(--muted-foreground)'), 'placeholder not muted token', getComputedStyle(g('default')(), '::placeholder').color])
  add(P, 'disabled', 'disabled look', 'opacity 0.5, not-allowed cursor', () => { const c = getComputedStyle(g('disabled')()); return [c.opacity === '0.5' && c.cursor === 'not-allowed', 'wrong disabled look', c.opacity + ' ' + c.cursor] })
  add(P, 'file', 'file button', 'file button text --foreground, 14px, weight 500, no fill', () => { const c = getComputedStyle(g('file')(), '::file-selector-button'); return [c.color === norm(art(P), 'color', 'var(--foreground)') && c.fontSize === '14px' && c.fontWeight === '500' && c.backgroundColor === 'rgba(0, 0, 0, 0)', 'wrong file button style', c.color + ' ' + c.fontSize + ' ' + c.fontWeight] })
}

// ---------- Input Group
{ const P = 'components/inputs/input group', G = one(P, '[data-slot=input-group]'), I = one(P, 'input')
  const base = { fill: T('--card', 'var(--card)'), text: T('--foreground', 'var(--foreground)'), border: T('1px --muted', 'var(--muted)'), radius: T('--radius', 'var(--radius)'), shadow: T('--shadow-md', 'var(--shadow-md)'), h: 36 }
  for (const st of ['default', 'focus', 'invalid', 'disabled']) {
    const s = { ...base }; if (st === 'invalid') { s.border = T('1px --destructive', 'var(--destructive)'); s.ring = T('--destructive at 20%', 'color-mix(in oklab, var(--destructive) 20%, transparent)') }
    if (st === 'focus') s.border = T('1px --ring', 'var(--ring)')
    std(P, st, G(st), s)
    add(P, st, 'field inside', 'no fill or border of its own; text --foreground, 14px, weight 400', () => { const c = getComputedStyle(I(st)()); return [c.backgroundColor === 'rgba(0, 0, 0, 0)' && c.borderTopWidth === '0px' && c.color === norm(art(P), 'color', 'var(--foreground)') && c.fontSize === '14px' && c.fontWeight === '400', 'field not clean inside group', c.backgroundColor + ' ' + c.borderTopWidth + ' ' + c.fontSize] })
  }
  add(P, 'default', 'addon text', 'addon text --foreground, --font-body', () => { const e = cell(art(P), 'default', '[data-slot=input-group-addon]'); const c = getComputedStyle(e); return [c.color === norm(art(P), 'color', 'var(--foreground)') && fam(c) === fontName(art(P)), 'wrong addon text token', c.color + ' ' + fam(c)] })
  add(P, 'default', 'placeholder colour', 'placeholder uses --muted-foreground', () => [getComputedStyle(I('default')(), '::placeholder').color === norm(art(P), 'color', 'var(--muted-foreground)'), 'placeholder not muted token', getComputedStyle(I('default')(), '::placeholder').color])
  add(P, 'disabled', 'disabled look', 'field and addon at opacity 0.5', () => { const i = getComputedStyle(I('disabled')()), a = getComputedStyle(cell(art(P), 'disabled', '[data-slot=input-group-addon]')); return [i.opacity === '0.5' && a.opacity === '0.5', 'wrong disabled look', 'field ' + i.opacity + ' addon ' + a.opacity] })
}

// ---------- Textarea
{ const P = 'components/inputs/textarea', g = one(P, 'textarea')
  const base = { fill: T('--card', 'var(--card)'), text: T('--foreground', 'var(--foreground)'), border: T('1px --muted', 'var(--muted)'), radius: T('--radius, as Input', 'var(--radius)'), radiusCode: 'radius differs from Input', shadow: T('--shadow-md', 'var(--shadow-md)'), size: '14px', weight: '400', h: 64, padX: 12 }
  for (const st of ['default', 'invalid', 'focus']) {
    const s = { ...base }; if (st === 'invalid') { s.border = T('1px --destructive', 'var(--destructive)'); s.ring = T('--destructive at 20%', 'color-mix(in oklab, var(--destructive) 20%, transparent)') }
    if (st === 'focus') s.border = T('1px --ring', 'var(--ring)')
    std(P, st, g(st), s)
  }
  add(P, 'default', 'placeholder colour', 'placeholder uses --muted-foreground', () => [getComputedStyle(g('default')(), '::placeholder').color === norm(art(P), 'color', 'var(--muted-foreground)'), 'placeholder not muted token', getComputedStyle(g('default')(), '::placeholder').color])
}

// ---------- Scenarios
const scen = (path, text) => [...art(path).querySelectorAll('p.text-sm')].find(p => p.textContent === text)
const defaults = { 'components/actions/button': ['default', 'button'], 'components/actions/option list': ['default', 'button'], 'components/inputs/input': ['default', 'input'], 'components/inputs/input group': ['default', '[data-slot=input-group]'], 'components/inputs/textarea': ['default', 'textarea'] }
for (const [P, [dst, sel]] of Object.entries(defaults)) {
  const defEl = () => cell(art(P), dst, sel)
  const chips = P.endsWith('option list')
  for (const w of ['full', 'half', 'hug']) {
    const want = chips ? 'chips keep their natural width and wrap inside the container' : w === 'full' ? 'fills the full width of its container' : w === 'half' ? 'fills half the width of its container' : 'keeps its natural width'
    add(P, 'scenario: width ' + w, 'width', want + '; corner radius, side padding and font size stay as the default state', () => {
      const lab = scen(P, 'width ' + w); const wrap = lab.parentElement.lastElementChild; const el = wrap.querySelector(sel); const box = lab.parentElement; const bw = box.getBoundingClientRect().width, er = el.getBoundingClientRect(), ew = er.width
      const c = getComputedStyle(el), d = getComputedStyle(defEl())
      const widthOk = chips ? Math.abs(ew - defEl().getBoundingClientRect().width) < 1.5 && er.right <= wrap.getBoundingClientRect().right + 1 : w === 'full' ? Math.abs(ew - bw) < 1.5 : w === 'half' ? Math.abs(ew - bw / 2) < 1.5 : Math.abs(ew - wrap.getBoundingClientRect().width) < 1.5 && ew < bw * 0.9
      const same = c.borderTopLeftRadius === d.borderTopLeftRadius && c.paddingLeft === d.paddingLeft && c.fontSize === d.fontSize
      return [widthOk && same, !widthOk ? 'wrong width behaviour' : 'style changes with width', Math.round(ew) + 'px of ' + Math.round(bw) + 'px; radius ' + c.borderTopLeftRadius + ' pad ' + c.paddingLeft]
    })
  }
  const wraps = P.endsWith('textarea')
  add(P, 'scenario: long text', wraps ? 'wrapping' : 'ellipsis', wraps ? 'wraps onto more lines and grows; nothing overflows sideways; corner radius unchanged' : 'label cut off with an ellipsis; height, corner radius and container unchanged; nothing overflows', () => {
    const lab = scen(P, 'really long text'); const holder = lab.nextElementSibling; const el = holder.querySelector(sel); const c = getComputedStyle(el), d = getComputedStyle(defEl())
    const r = el.getBoundingClientRect(), hr = holder.getBoundingClientRect(), dh = defEl().getBoundingClientRect().height
    const inside = r.right <= hr.right + 1
    if (wraps) return [el.scrollWidth <= el.clientWidth + 1 && r.height > dh && c.borderTopLeftRadius === d.borderTopLeftRadius, 'wrong long text behaviour', Math.round(r.height) + 'px tall, scrollWidth ' + el.scrollWidth + '/' + el.clientWidth]
    const nodes = [el, ...el.querySelectorAll('span,input')]; const ell = nodes.some(n => { const x = getComputedStyle(n); return x.textOverflow === 'ellipsis' && x.overflow !== 'visible' })
    const heightOk = chips ? true : Math.abs(r.height - dh) < 1
    return [ell && heightOk && inside && c.borderTopLeftRadius === d.borderTopLeftRadius, !ell ? 'no ellipsis, text clipped or wraps' : !inside ? 'overflows its container' : 'height changes', 'text-overflow ' + c.textOverflow + ', overflow ' + c.overflow + ', ' + Math.round(r.height) + 'px tall, ' + (inside ? 'inside' : 'outside') + ' container']
  })
}
