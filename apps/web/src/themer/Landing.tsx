import { LinkTile } from "../LinkTile"
import { Header, HomeButton, Page, PageTitle } from "./Chrome"

const CARDS = [
  { id: "copy", lines: ["Copy a", "Theme"], image: "card-copy", opacity: 0.3 },
  { id: "build", lines: ["Build from", "Scratch"], image: "card-build", opacity: 0.4 },
  { id: "code", lines: ["Get the", "Code"], image: "card-code", opacity: 0.4 },
] as const

export type LandingChoice = (typeof CARDS)[number]["id"]

/** The three ways in: the same tile as the homepage's, each one a button that moves the Themer on. */
export function Landing({ onChoose, onHome }: { onChoose: (choice: LandingChoice) => void; onHome: () => void }) {
  return (
    <Page>
      <Header nav={<HomeButton onClick={onHome} />} />
      <PageTitle>Theming</PageTitle>
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:justify-center sm:gap-4 lg:gap-10">
        {CARDS.map((card) => (
          <LinkTile
            key={card.id}
            image={`/themer/${card.image}.jpg`}
            imageOpacity={card.opacity}
            title={
              <>
                {card.lines[0]}
                <br />
                {card.lines[1]}
              </>
            }
            onClick={() => onChoose(card.id)}
            showArrow={false}
          />
        ))}
      </div>
    </Page>
  )
}
