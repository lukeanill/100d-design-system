import { Header, HomeButton, Page, PageTitle } from "./Chrome"

const CARDS = [
  { id: "copy", lines: ["Copy a", "Theme"], image: "card-copy", opacity: 0.3 },
  { id: "build", lines: ["Build from", "Scratch"], image: "card-build", opacity: 0.4 },
  { id: "code", lines: ["Get the", "Code"], image: "card-code", opacity: 0.4 },
] as const

export type LandingChoice = (typeof CARDS)[number]["id"]

export function Landing({ onChoose, onHome }: { onChoose: (choice: LandingChoice) => void; onHome: () => void }) {
  return (
    <Page>
      <Header nav={<HomeButton onClick={onHome} />} title={<PageTitle>Theming</PageTitle>} />
      <div className="grid gap-10 sm:grid-cols-3 max-sm:gap-4">
        {CARDS.map((card) => (
          <button
            key={card.id}
            type="button"
            onClick={() => onChoose(card.id)}
            className="relative flex h-[380px] cursor-pointer flex-col justify-end overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.12] p-10 text-left outline-none backdrop-blur-xl transition-transform focus-visible:ring-[3px] focus-visible:ring-ring/50 max-sm:h-[240px] max-sm:p-6"
          >
            <img
              src={`/themer/${card.image}.jpg`}
              alt=""
              className="pointer-events-none absolute inset-0 size-full object-cover mix-blend-screen"
              style={{ opacity: card.opacity }}
            />
            <span className="relative block text-[48px] leading-[1.22] font-heading max-sm:text-[32px]" style={{ fontWeight: "var(--h2-weight)" }}>
              {card.lines[0]}
              <br />
              {card.lines[1]}
            </span>
          </button>
        ))}
      </div>
    </Page>
  )
}
