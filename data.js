// Edit this file to update your portfolio content — no HTML/CSS knowledge needed.
// Each section below feeds directly into the page.

const PORTFOLIO_DATA = {

  metrics: [
    { count: 87, unit: "%", label: "Faster carry-forward processing", before: "120 min", after: "15 min" },
    { count: 70, unit: "%", label: "Smaller production database", before: "78 GB", after: "20\u201324 GB" },
    { count: 100, unit: "%", label: "Entity-linking accuracy (OCR/AI)", before: "manual", after: "fully automated" },
    { count: 170, unit: "+", label: "Production tickets resolved", before: "data fixes", after: "error resolution" }
  ],

  experience: [
    {
      tag: "CURRENT",
      role: "Database Developer, Bayasys Infotech",
      meta: "Kochi &middot; Jan 2025 &ndash; Present",
      bullets: [
        "Diagnosed and fixed a Cartesian Product bottleneck in a decade-old Logistics ERP &mdash; <strong>87% faster</strong> carry-forward processing.",
        "Rebuilt log retention strategy, cutting production database size by <strong>70%</strong> with no performance trade-off.",
        "Designed a branch-to-head-office sync framework with direct-insert logic and a config-driven, extensible table list.",
        "Proposed a metadata-driven attribute framework during HRMS's build phase, preventing table sprawl &mdash; now serving 200+ employees.",
        "Closed <strong>170+</strong> production tickets across data correction, procedure fixes, error resolution, and estimation."
      ]
    },
    {
      tag: "ONBOARDING",
      role: "Programmer Trainee, Bayasys Infotech",
      meta: "Kochi &middot; Sep 2024 &ndash; Dec 2024",
      bullets: [
        "Went from onboarding to writing production-ready T-SQL and PostgreSQL stored procedures and triggers within 90 days.",
        "Reverse-engineered a large-scale ERP logistics platform to map business logic to backend data flows."
      ]
    }
  ],

  skills: [
    { category: "Databases", tags: ["MS SQL Server", "PostgreSQL", "MySQL"] },
    { category: "SQL Development", tags: ["T-SQL", "PL/pgSQL", "Stored Procedures", "Functions", "Triggers", "Views", "Window Functions", "CTEs"] },
    { category: "Performance", tags: ["Execution Plans", "Index Tuning", "Query Profiling"] },
    { category: "Data Engineering", tags: ["JSON Processing", "Data Modeling", "Relational Design", "ETL Concepts"] },
    { category: "Tools", tags: ["SSMS", "SQL Server Agent", "pgAdmin", "SQL Server Profiler", "Git"] }
  ],

  projects: [
    {
      tag: "CONCURRENCY & CORRECTNESS",
      title: "Concurrency-Safe Seat Booking System",
      desc: "A PostgreSQL project built to prove &mdash; not just explain &mdash; how race conditions happen in booking/inventory systems, and how to eliminate them with atomic conditional updates instead of separate read-then-write steps.",
      proof: "50 concurrent booking attempts, same seat:<br>naive version &rarr; <span class=\"bad\">multiple bookings created (race condition confirmed)</span><br>fixed version &rarr; <span class=\"ok\">exactly 1 booking, every run</span>",
      link: "https://github.com/Nihalurrahiyan/concurrent-booking-demo"
    },
    {
      tag: "SCHEMA DESIGN",
      title: "Metadata-Driven Attribute Framework",
      desc: "Designed during a new HRMS build to replace what would have become dozens of module-specific configuration tables with a single reusable <code>attribute_definition</code> / <code>attribute_value</code> structure &mdash; cutting future schema changes down to data entries instead of migrations.",
      proof: null,
      link: null
    },
    {
      tag: "DATA SYNCHRONIZATION",
      title: "Branch&ndash;Head Office Sync Framework",
      desc: "Built a conflict-free synchronization framework so a head office server can safely receive read-only voucher data from a branch office, using direct-insert logic and a config-driven table list so new tables can join the sync scope without a code change.",
      proof: null,
      link: null
    }
  ],

  education: [
    { name: "KMCT College of Engineering &mdash; B.Tech, Computer Science", meta: "Nov 2020 &ndash; May 2024" },
    { name: "GBHSS Manjeri &mdash; Higher Secondary, Computer Science", meta: "Jul 2018 &ndash; Mar 2020" }
  ],

  awards: [
    { name: "Winner &mdash; \u201CUntangle\u201D Inter-College Debugging Competition", desc: "KMCT CEW, 2023" },
    { name: "Winner &mdash; Code Debugging Competition", desc: "G20 TechnoFrenzy, 2023" },
    { name: "Performance Merit", desc: "Independent architectural design and rapid deployment of the Carry-Forward Automation system, Bayasys Infotech" }
  ],

  contact: {
    email: "nihalurrahiyan@gmail.com",
    linkedin: "https://www.linkedin.com/in/nihalurrahiyan/",
    github: "https://github.com/Nihalurrahiyan",
    location: "Payyanad, Manjeri, Malappuram Dist, Kerala"
  }
};
