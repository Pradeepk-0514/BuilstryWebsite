export const milestones = [
  {
    id: "2024-first-work",
    year: "2024",
    title: "Idea & First Work",
    description: "A shared belief to solve real problems and build what matters. Started working on real-world challenges with early partners and users.",
    phase: "THE FIRST BELIEF",
    anchor: "Journey_2018",
    prop: "orb",
    wide: [-8.15, -2.88, 0],
    desktop: [-5.15, -2.88, 0],
    mobile: [-1.05, -3.62, 0],
  },
  {
    id: "2025-built-and-partnered",
    year: "2025",
    title: "Built & Partnered",
    description: "Turned ideas into working solutions and got them into the real world. Collaborated with forward-thinking organizations to create real impact.",
    phase: "BUILT FOR IMPACT",
    anchor: "Journey_2020",
    prop: "layers",
    wide: [-1.65, -0.80, 0],
    desktop: [-0.86, -0.76, 0],
    mobile: [0, -0.60, 0],
  },
  {
    id: "2026-community",
    year: "2026",
    title: "Hackathons & Community",
    description: "Brought together students, builders and innovators to solve, learn and grow.",
    phase: "BUILDING TOGETHER",
    anchor: "Journey_2022",
    prop: "cubes",
    wide: [2.26, 0.43, 0],
    desktop: [1.72, 0.52, 0],
    mobile: [-1.05, 1.22, 0],
  },
  {
    id: "2026-plus-bigger-impact",
    year: "2026+",
    title: "Bigger Impact",
    description: "Many more problems to solve. Many more to build.",
    phase: "THE NEXT CHAPTER",
    anchor: "Journey_2024",
    prop: "summit",
    wide: [5.45, 1.52, 0],
    desktop: [4.05, 1.62, 0],
    mobile: [0.12, 3.62, 0],
  },
];

export const getJourneyLayout = (aspect) => {
  if (aspect < 0.92) return "mobile";
  if (aspect > 1.88) return "wide";
  return "desktop";
};
