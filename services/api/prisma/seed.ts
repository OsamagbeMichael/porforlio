import { PrismaClient, ProjectStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Project/Note have no unique fields, so createMany({ skipDuplicates })
  // can't actually dedupe — reset and reseed instead so this script is
  // safe to run repeatedly during development.
  await prisma.project.deleteMany({});
  await prisma.note.deleteMany({});

  await prisma.project.createMany({
    data: [
      {
        name: "Runtime — countdown app",
        description: "A shared countdown tool for teams racing a deadline together.",
        stack: ["TypeScript", "Express", "Postgres"],
        status: ProjectStatus.LIVE,
        url: "https://example.com/runtime",
        sortOrder: 1,
      },
      {
        name: "Suspense — narrative engine",
        description: "A tool for pacing out story beats so readers stay hooked.",
        stack: ["Python", "FastAPI"],
        status: ProjectStatus.IN_PROGRESS,
        sortOrder: 2,
      },
      {
        name: "Many Interests — media wall",
        description: "A personal media wall that pulls from several of my hobbies at once.",
        stack: ["TypeScript", "Postgres"],
        status: ProjectStatus.SHIPPED,
        sortOrder: 3,
      },
      {
        name: "Field Notes — writing log",
        description: "A lightweight log for dated process notes and half-ideas.",
        stack: ["Python", "SQLite"],
        status: ProjectStatus.SHIPPED,
        sortOrder: 4,
      },
    ],
  });

  await prisma.note.createMany({
    data: [
      {
        title: "on shipping unfinished things",
        body: "Half of what's on this site isn't done. I'm starting to think that's the point — the site should feel like it's still being built, because it is.",
      },
      {
        title: "wallpaper as a feature",
        body: "Made the desktop background generate itself per visit. Small thing, but it makes the site feel alive instead of static.",
      },
    ],
  });

  const today = new Date();
  const slotDates: Date[] = [];
  for (let i = 1; i <= 21; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    if (d.getDay() === 0 || d.getDay() === 6) continue;
    slotDates.push(d);
  }

  for (const date of slotDates) {
    await prisma.availabilitySlot.upsert({
      where: { date },
      update: {},
      create: { date, available: Math.random() > 0.4 },
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
