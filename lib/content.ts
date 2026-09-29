export type Project = {
  id: string;
  title: string;
  description: string;
  tech: string[];
  live?: string;
  github?: string;
  image?: string;
};
export type ExperienceItem = {
  id: string; role: string; org: string; period: string; summary: string;
};
export type EducationItem = {
  id: string; school: string; credential: string; period: string;
};
export type SocialLink = { label: string; href: string };

export const SECTIONS = [
  "hero", "about", "projects", "tech", "experience", "education", "contact",
] as const;
export type SectionId = (typeof SECTIONS)[number];

export const content = {
  name: "PLACEHOLDER: Your Name",
  initials: "YN",
  title: "PLACEHOLDER: Software Engineer",
  tagline: "PLACEHOLDER: I build immersive, performant web experiences.",
  about:
    "PLACEHOLDER: Two or three sentences about who you are, how you work, and what you care about as a developer.",
  photo: undefined as string | undefined,
  projects: [
    {
      id: "project-one",
      title: "PLACEHOLDER: Project One",
      description: "PLACEHOLDER: What it does and the impact it had.",
      tech: ["TypeScript", "Next.js", "PostgreSQL"],
      live: "https://example.com",
      github: "https://github.com/you/project-one",
    },
    {
      id: "project-two",
      title: "PLACEHOLDER: Project Two",
      description: "PLACEHOLDER: What it does and the impact it had.",
      tech: ["React", "Node.js"],
      github: "https://github.com/you/project-two",
    },
    {
      id: "project-three",
      title: "PLACEHOLDER: Project Three",
      description: "PLACEHOLDER: What it does and the impact it had.",
      tech: ["Python", "FastAPI"],
      live: "https://example.com",
    },
  ] satisfies Project[],
  techStack: [
    "TypeScript", "React", "Next.js", "Node.js", "Three.js",
    "PostgreSQL", "Tailwind CSS", "Git",
  ],
  experience: [
    {
      id: "exp-one",
      role: "PLACEHOLDER: Senior Engineer",
      org: "PLACEHOLDER: Company",
      period: "2023 — Present",
      summary: "PLACEHOLDER: What you did and shipped.",
    },
    {
      id: "exp-two",
      role: "PLACEHOLDER: Engineer",
      org: "PLACEHOLDER: Company",
      period: "2021 — 2023",
      summary: "PLACEHOLDER: What you did and shipped.",
    },
  ] satisfies ExperienceItem[],
  education: [
    {
      id: "edu-one",
      school: "PLACEHOLDER: University",
      credential: "PLACEHOLDER: B.Sc. Computer Science",
      period: "2017 — 2021",
    },
  ] satisfies EducationItem[],
  email: "placeholder@example.com",
  socials: [
    { label: "GitHub", href: "https://github.com/you" },
    { label: "LinkedIn", href: "https://linkedin.com/in/you" },
  ] satisfies SocialLink[],
};
