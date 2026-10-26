import type { Location } from "@workspace/ui/components/ui/map-carousel"

export type Activity = "walk" | "run" | "swim"

/** In the order the Figma draws them. */
export const ACTIVITIES: { id: Activity; label: string }[] = [
  { id: "walk", label: "Walk" },
  { id: "run", label: "Run" },
  { id: "swim", label: "Swim" },
]

/** What the visitor set in the sentence. */
export type Mission = { activity: Activity; km: number; hours: number; minutes: number }

export const DEFAULT_MISSION: Mission = { activity: "walk", km: 20, hours: 1, minutes: 30 }

const mmss = (minutes: number) => {
  const total = Math.round(minutes * 60)
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`
}

/** Four spots, reused for every list: the map is the same city whatever the category. */
const SPOTS: [number, number][] = [
  [37.7935, -122.3938],
  [37.7925, -122.4138],
  [37.8025, -122.4382],
  [37.7599, -122.4148],
]

/** Per activity: the words, the weekly rhythm, the practice list and the places. Made up, and short on purpose. */
const BY_ACTIVITY = {
  walk: {
    verb: "walk",
    unit: "/km",
    perKm: 1,
    sessions: 5,
    days: [1, 2, 3, 4, 5],
    practice: ["Easy 5 km walk", "Brisk intervals", "Hill walk", "Long steady walk"],
    categories: ["Outfits", "Walking Clubs", "Routes"],
    places: {
      outfits: [["Footpath Outfitters", "Merrell Moab 3 walking shoes", 110], ["Steady Steps", "Hoka Bondi 8 walking shoes", 165], ["Long Way Round", "Leki trekking poles", 85], ["The Trail Post", "Osprey 20L day pack", 120]],
      "walking clubs": [["Embarcadero Strollers", "Weekday mornings", 0], ["Presidio Pacers", "Saturday group walks", 0], ["Twin Peaks Trekkers", "Hill walks, Sundays", 0], ["Marina Morning Club", "Daily, 7am", 0]],
      routes: [["Embarcadero Loop", "8 km · flat", 0], ["Presidio Circuit", "12 km · rolling", 0], ["Lake Merced Walk", "9 km · flat", 0], ["Twin Peaks Climb", "6 km · steep", 0]],
    },
  },
  run: {
    verb: "run",
    unit: "/km",
    perKm: 1,
    sessions: 3,
    days: [2, 4, 6],
    practice: ["Easy 5 km run", "Tempo intervals", "Hill repeats", "Long steady run"],
    categories: ["Outfits", "Run Clubs", "Circuits"],
    places: {
      outfits: [["Stride & Sole", "Brooks Ghost 16 trainers", 140], ["Heel & Toe Run Shop", "Nike Pegasus 41 trainers", 145], ["Mile One Running", "Saucony Ride 17 trainers", 140], ["The Finish Line Co.", "Hoka Clifton 9 trainers", 150]],
      "run clubs": [["Golden Gate Striders", "Tuesday track night", 0], ["Mission Run Crew", "Thursday tempo", 0], ["Presidio Pacers", "Saturday long run", 0], ["Marina Morning Club", "Daily, 6:30am", 0]],
      circuits: [["Embarcadero Loop", "10 km · flat", 0], ["Presidio Circuit", "12 km · rolling", 0], ["Lake Merced Loop", "11 km · flat", 0], ["Twin Peaks Repeats", "6 km · steep", 0]],
    },
  },
  swim: {
    verb: "swim",
    unit: "/100 m",
    perKm: 10,
    sessions: 2,
    days: [3, 6],
    practice: ["Easy 500 m swim", "Interval sets", "Kick and pull drills", "Long steady swim"],
    categories: ["Outfits", "Swim Clubs", "Pools"],
    places: {
      outfits: [["Lane Four Swim Shop", "Speedo Vanquisher goggles", 34], ["Deep End Supply", "Arena Cobra Ultra goggles", 60], ["Blue Line Aquatics", "TYR Nest Pro goggles", 28], ["Splash & Co.", "Zoggs Predator goggles", 30]],
      "swim clubs": [["Bay Masters Swim", "Weekday mornings", 0], ["Aquatic Park Dippers", "Open-water, Saturdays", 0], ["Lane Four Club", "Tuesday sets", 0], ["Deep End Squad", "Thursday intervals", 0]],
      pools: [["Aquatic Park Cove", "Open water", 0], ["Embarcadero Pool", "25 m · 6 lanes", 0], ["Marina Pool", "50 m · 8 lanes", 0], ["Sunset Pool", "25 m · 4 lanes", 0]],
    },
  },
} as const

const cap = (s: string) => s[0].toUpperCase() + s.slice(1)

/** The practice days of the month on show: the activity's weekdays, from today to the end of the following fortnight. */
function practiceDays(days: readonly number[]) {
  const out: Date[] = []
  const start = new Date()
  start.setHours(12, 0, 0, 0)
  for (let i = 0; i < 18; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    if (i === 0 || days.includes(d.getDay())) out.push(d)
  }
  return out
}

export function missionContent(mission: Mission) {
  const a = BY_ACTIVITY[mission.activity]
  const km = Math.max(1, mission.km)
  const total = Math.max(1, mission.hours * 60 + mission.minutes)
  const pace = `${mmss(total / (km * a.perKm))} ${a.unit}`
  const weekly = a.sessions * km
  const target = `${km} km in ${mission.hours} hr ${mission.minutes} min`

  // the sentence as it reads once set, split where the Figma breaks it
  const recap = [`I will ${a.verb} ${km} km`, `in under ${mission.hours}h ${mission.minutes}m`]

  // last activity, as if the visitor had just finished one
  const lastKm = Math.max(1, Math.round(km * 0.4))
  const lastMin = (total / km) * lastKm * 1.04
  const lastPace = mmss(lastMin / (lastKm * a.perKm))

  return {
    pace,
    recap,
    practice: a.practice.map((label, i) => ({ id: i + 1, label })),
    analysis: `Your last ${a.verb}: ${lastKm} km at ${lastPace} ${a.unit} — about 4% off the ${pace} you need. Your total so far is ${lastKm * 6} km over six sessions, and your pace has improved every week.`
      .split(" ")
      .map((text) => ({ text })),
    followUps: [`How do I get to ${pace}`, `What should this week look like`],
    paceSeries: Array.from({ length: 8 }, (_, i) => +((total / (km * a.perKm)) * (1.22 - i * 0.031)).toFixed(2)),
    days: practiceDays(a.days),
    faqs: [
      { q: `How fast do I need to go?`, a: `Hold ${pace} to ${a.verb} ${target}.` },
      { q: `How often should I ${a.verb}?`, a: `${a.sessions} sessions a week, with a rest day between hard efforts — about ${weekly} km in total.` },
      { q: `What if I miss a session?`, a: `Pick up where you left off. One missed session doesn't change the plan.` },
      { q: `When will I be ready?`, a: `In about eight weeks, building by roughly 10% a week.` },
      { q: `What should I eat beforehand?`, a: `Something light with carbs, 60 to 90 minutes before you ${a.verb}.` },
      { q: `How do I avoid injury?`, a: `Warm up for ten minutes, build gradually, and stretch afterwards.` },
    ],
    categories: a.categories.map((label) => ({ id: label.toLowerCase(), label })),
    places: (id: string): Location[] =>
      ((a.places as Record<string, readonly (readonly [string, string, number])[]>)[id] ?? []).map(([name, subtitle, price], i) => ({
        coordinates: SPOTS[i],
        name,
        subtitle,
        ...(price ? { price, priceLabel: `$${price}` } : {}),
        priceSubtext: "Close by",
        rating: 8.6 + i * 0.3,
      })),
    tasks: [
      { key: "performance", label: "Performance", amount: pace, details: [{ label: "Pace needed", meta: pace }, { label: "Build plan", meta: "8 weeks" }] },
      { key: "shop", label: "Shop", amount: "12 places", details: [{ label: cap(a.categories[0].toLowerCase()), meta: "4" }, { label: a.categories[1], meta: "4" }] },
      { key: "goals", label: "Goals", amount: `${a.sessions} a week`, details: [{ label: "Weekly target", meta: `${weekly} km` }, { label: "Practice list", meta: "4" }] },
    ],
  }
}

export type MissionContent = ReturnType<typeof missionContent>
