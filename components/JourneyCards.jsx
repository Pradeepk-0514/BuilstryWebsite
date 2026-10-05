import { Layers, Lightbulb, Rocket, UsersRound } from "lucide-react";
import { milestones } from "./journeyData";

const milestoneIcons = [Lightbulb, Layers, UsersRound, Rocket];
const stageClasses = ["is-origin", "is-building", "is-expanding", "is-future"];

export default function JourneyCards({ currentIndex, activeIndex, setActiveIndex, containerRef }) {
  return (
    <div ref={containerRef} className="journey3d-card-stack" role="group" aria-label="Builstry journey milestone cards">
      {milestones.map((item, index) => {
        const Icon = milestoneIcons[index];
        const isCurrent = currentIndex === index;
        const scrollState = isCurrent ? " is-scroll-current" : index === currentIndex - 1 ? " is-scroll-secondary" : index < currentIndex ? " is-scroll-past" : "";
        return (
          <button
            key={item.id}
            type="button"
            data-milestone-index={index}
            className={`journey3d-sign journey3d-deck-card ${stageClasses[index]}${scrollState}${activeIndex === index ? " is-active" : ""}`}
            style={{ zIndex: isCurrent ? 4 : index === currentIndex - 1 ? 3 : index < currentIndex ? 2 : 1 }}
            tabIndex={isCurrent ? 0 : -1}
            aria-hidden={isCurrent ? undefined : "true"}
            aria-pressed={isCurrent}
            aria-label={`${item.year}: ${item.title}. ${item.description}`}
            onPointerEnter={() => setActiveIndex(index)}
            onPointerLeave={() => setActiveIndex(null)}
            onFocus={() => setActiveIndex(index)}
            onBlur={() => setActiveIndex(null)}
            onClick={() => setActiveIndex(index)}
          >
            <span className="journey3d-sign-icon journey3d-card-visual" aria-hidden="true">
              <Icon size={22} strokeWidth={2} />
            </span>
            <span className="journey3d-sign-year">{item.year}</span>
            <strong>{item.title}</strong>
            <span className="journey3d-sign-description">{item.description}</span>
            <span className="journey3d-sign-phase"><i />{item.phase}</span>
          </button>
        );
      })}
    </div>
  );
}
