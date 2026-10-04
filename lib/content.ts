export type Project = {
  id: string;
  title: string;
  name: string; // short label shown on the accordion panel
  role: string; // your role on the project
  highlight: string; // the one impact/contribution line to lead with
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
export type TechGroupId = "lang" | "framework" | "tool";
export type TechGroup = { id: TechGroupId; label: string; hue: string };
export type Tech = { name: string; icon: string; group: TechGroupId; x: number; y: number };

export const SECTIONS = [
  "hero", "about", "projects", "tech", "experience", "education", "contact",
] as const;
export type SectionId = (typeof SECTIONS)[number];

export const content = {
  name: "Dao Tien Dung",
  heroName: "Dung Dao",
  handle: "DungDao59",
  initials: "DTD",
  title: "Full-Stack Developer",
  location: "Ho Chi Minh City",
  tagline: "I build software that solves real problems.",
  status: "Available for internship",
  statusWords: ["AVAILABLE", "OPEN TO WORK", "LET'S BUILD"],
  headline:
    "Turning complex challenges into clean, reliable web applications — from database to interface.",
  roles: [
    "full-stack web apps",
    "reliable APIs & data models",
    "internal tools that automate work",
    "software that solves real problems",
  ],
  codeLines: [
    "const dev = {",
    "  name: 'Dao Tien Dung',",
    "  role: 'Full-Stack Developer',",
    "  stack: ['ts','next','node'],",
    "  ship: () => true,",
    "};",
  ],
  about:
    "Hi, I'm Dao Tien Dung, a full-stack developer with two years of experience building web applications with PostgreSQL, Express, React/Next.js, and Node.js. I enjoy backend work most: designing the logic and data flow that make an app reliable. One project I'm proud of is automating my university club's workflow, so tech and non-tech members could finally work from the same process. Outside of code, you'll usually find me on the football pitch.",
  photo: "/profile.jpg" as string | undefined,
  avatar: "/profile-avatar.jpg", // pre-cropped square (head → mid-chest) for the About circle
  cv: "/Dung-Dao-CV.pdf",
  aboutPhotos: [
    { src: "/about/1.jpg", portrait: true, rotate: -7, caption: "" },
    { src: "/about/2.jpg", portrait: true, rotate: 5, caption: "" },
    { src: "/about/3.jpg", portrait: false, rotate: -4, caption: "" },
    { src: "/about/4.jpg", portrait: false, rotate: 6, caption: "" },
    { src: "/about/5.jpg", portrait: false, rotate: -3, caption: "" },
    { src: "/about/6.jpg", portrait: false, rotate: 4, caption: "" },
    { src: "/about/7.jpg", portrait: false, rotate: -5, caption: "" },
    { src: "/about/8.jpg", portrait: false, rotate: 3, caption: "" },
    { src: "/about/9.jpg", portrait: false, rotate: -4, caption: "" },
  ],
  projects: [
    {
      id: "aff",
      title: "AFF — Affordable Food Federation",
      name: "AFF",
      role: "Full-Stack Developer",
      highlight:
        "Owned auth, profiles & payments — secured 19 REST endpoints and shipped idempotent Stripe/wallet checkout.",
      description:
        "A food-donation platform connecting donors with recipients to cut food waste, built by a 4-person team with React, Node.js, and MongoDB.",
      tech: ["MongoDB", "Express", "React", "Node.js", "Stripe", "JWT"],
      live: "https://team3-v4u6.onrender.com/",
      image: "/projects/aff.png",
    },
    {
      id: "nct-hub",
      title: "NCT Hub",
      name: "NCT Hub",
      role: "Full-Stack Developer",
      highlight:
        "Coordinated 10+ projects across 11 teams in 2 months, shipping 100% on time.",
      description:
        "The official site for RMIT Neo Culture Tech Club, where 50+ members showcase the club, record achievements, and use in-house tools like Neo Shortener, Generator, and Scanner.",
      tech: ["Next.js", "Supabase", "Docker"],
      live: "https://rmitnct.club/",
      github: "https://github.com/rmit-nct/hub",
      image: "/projects/nct-hub.png",
    },
    {
      id: "motul-epr",
      title: "Motul EPR Compliance Platform",
      name: "Motul EPR",
      role: "Backend Developer",
      highlight:
        "Built REST APIs, business rules, and a Supabase-Auth password-reset flow with Zod validation.",
      description:
        "A platform digitizing Motul's used-oil EPR workflow — tracking waste-oil collection from owners to recyclers for 100+ registered accounts.",
      tech: ["TypeScript", "Express", "Supabase", "Prisma", "Zod"],
      image: "/projects/motul.png",
    },
    {
      id: "neo-weather",
      title: "Neo What Weather",
      name: "Neo What Weather",
      role: "Frontend Developer ",
      highlight:
        "Built the 5-day forecast card and resolved the final merge conflicts.",
      description:
        "A responsive weather app with real-time conditions, a five-day forecast, and interactive charts — built with the RMIT Neo Culture Tech team using React, TypeScript, and the OpenWeather API.",
      tech: ["React", "TypeScript", "Vite", "Chart.js", "TanStack Query"],
      github: "https://github.com/rmit-nct/neo-what-weather",
      image: "/projects/neo-weather.png",
    },
  ] satisfies Project[],
  techGroups: [
    { id: "lang", label: "Languages & Databases", hue: "#7c5cff" },
    { id: "framework", label: "Frameworks & Libraries", hue: "#38bdf8" },
    { id: "tool", label: "Tools & Services", hue: "#f472b6" },
  ] satisfies TechGroup[],
  // Ordered within each group so consecutive same-group nodes are neighbours —
  // the constellation lines simply connect each node to the next in its group.
  techStack: [
    // Languages & Databases
    { name: "JavaScript", icon: "/tech/javascript.svg", group: "lang", x: 24, y: 13 },
    { name: "TypeScript", icon: "/tech/typescript.svg", group: "lang", x: 11, y: 22 },
    { name: "C++", icon: "/tech/cplusplus.svg", group: "lang", x: 35, y: 25 },
    { name: "Java", icon: "/tech/java.svg", group: "lang", x: 21, y: 40 },
    { name: "Python", icon: "/tech/python.svg", group: "lang", x: 7, y: 45 },
    { name: "MongoDB", icon: "/tech/mongodb.svg", group: "lang", x: 31, y: 58 },
    { name: "PostgreSQL", icon: "/tech/postgresql.svg", group: "lang", x: 14, y: 65 },
    // Frameworks & Libraries
    { name: "Express.js", icon: "/tech/express.svg", group: "framework", x: 79, y: 14 },
    { name: "React.js", icon: "/tech/react.svg", group: "framework", x: 55, y: 16 },
    { name: "Next.js", icon: "/tech/nextjs.svg", group: "framework", x: 68, y: 27 },
    { name: "Prisma", icon: "/tech/prisma.svg", group: "framework", x: 83, y: 35 },
    { name: "Node.js", icon: "/tech/nodejs.svg", group: "framework", x: 62, y: 45 },
    { name: "Zod", icon: "/tech/zod.svg", group: "framework", x: 73, y: 56 },
    // Tools & Services
    { name: "Cloudinary", icon: "/tech/cloudinary.svg", group: "tool", x: 89, y: 66 },
    { name: "Stripe", icon: "/tech/stripe.svg", group: "tool", x: 77, y: 78 },
    { name: "Resend", icon: "/tech/resend.svg", group: "tool", x: 91, y: 87 },
    { name: "Render", icon: "/tech/render.svg", group: "tool", x: 65, y: 90 },
    { name: "Vercel", icon: "/tech/vercel.svg", group: "tool", x: 59, y: 73 },
    { name: "Postman", icon: "/tech/postman.svg", group: "tool", x: 46, y: 71 },
    { name: "Supabase", icon: "/tech/supabase.svg", group: "tool", x: 49, y: 88 },
    { name: "Docker", icon: "/tech/docker.svg", group: "tool", x: 34, y: 86 },
    { name: "GitHub", icon: "/tech/github.svg", group: "tool", x: 22, y: 77 },
    { name: "Git", icon: "/tech/git.svg", group: "tool", x: 9, y: 85 },
  ] satisfies Tech[],
  experience: [
    {
      id: "exp-nct",
      role: "Head of Technology",
      org: "RMIT Neo Culture Tech Club",
      period: "Jun 2026 — Present",
      summary:
        "Lead the club's technology department — managing projects and members, identifying real problems within the club, and automating them by building tools integrated into a larger internal ecosystem.",
    },
    {
      id: "exp-neoleague",
      role: "Organizer",
      org: "RMIT Neo League — Season 2",
      period: "Mar 2026 — May 2026",
      summary:
        "Helped organize the RMIT Neo League competition — designing problems for contestants to solve and preparing the supporting documentation.",
    },
  ] satisfies ExperienceItem[],
  education: [
    {
      id: "edu-rmit",
      school: "RMIT University, Ho Chi Minh City",
      credential: "Bachelor of Engineering (Software Engineering)",
      period: "Oct 2024 — Oct 2028",
    },
  ] satisfies EducationItem[],
  email: "dungdao.work@gmail.com",
  socials: [
    { label: "GitHub", href: "https://github.com/DungDao59" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/tien-dung-dao-a2281a370/" },
    { label: "Facebook", href: "https://www.facebook.com/aotiendung.986613/" },
    { label: "Instagram", href: "https://www.instagram.com/_dtdx.24_/" },
  ] satisfies SocialLink[],
};
