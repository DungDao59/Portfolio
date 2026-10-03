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
      title: "AFF — Food Donation Platform",
      description:
        "A food-donation platform aimed at cutting food waste. People can donate surplus food or list it for free or at low cost, so those in need can find and claim it.",
      tech: ["MongoDB", "Express", "React", "Node.js"],
      live: "https://team3-v4u6.onrender.com/",
    },
    {
      id: "nct-hub",
      title: "NCT Hub",
      description:
        "The official site for RMIT Neo Culture Tech Club — showcasing its achievements and journey, and home to internal tools built along the way like Neo Shortener, Neo Generator, and Neo Scanner.",
      tech: ["Next.js", "Supabase", "Docker"],
      live: "https://rmitnct.club/",
      github: "https://github.com/rmit-nct/hub",
    },
    {
      id: "motul-epr",
      title: "Motul EPR Data Management",
      description:
        "An outsourced platform digitizing Motul's recycled-oil management workflow — tracking collection and the real data collected, and standardizing their process into a clean, reliable web app.",
      tech: ["TypeScript", "Next.js", "Supabase", "Prisma", "Railway"],
    },
  ] satisfies Project[],
  techStack: [
    "TypeScript", "JavaScript", "Python", "Java", "C++",
    "PostgreSQL", "MongoDB",
    "Node.js", "Express.js", "React.js", "Next.js", "Prisma", "Zod",
    "Git", "GitHub", "Docker", "Postman", "Stripe", "Cloudinary",
    "Resend", "Render", "Vercel", "Supabase",
  ],
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
