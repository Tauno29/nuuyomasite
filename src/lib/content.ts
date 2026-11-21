export type ContentGroup =
  | "Brand"
  | "Homepage"
  | "About"
  | "Academics"
  | "Admissions"
  | "Boarding"
  | "Gallery"
  | "Fees"
  | "Contact / Footer";

export type ContentDefinition = {
  key: string;
  label: string;
  group: ContentGroup;
  type: "text" | "textarea" | "longtext";
  help?: string;
};

export const contentDefinitions: ContentDefinition[] = [
  { key: "site.name", label: "School name", group: "Brand", type: "text" },
  { key: "site.short_name", label: "Short name", group: "Brand", type: "text" },
  { key: "site.tagline", label: "Tagline", group: "Brand", type: "text" },
  { key: "site.about_short", label: "Short description (footer)", group: "Brand", type: "textarea" },
  { key: "site.location", label: "Campus location", group: "Brand", type: "text", help: "Shown in the top bar and footer." },
  { key: "site.region", label: "Region", group: "Brand", type: "text" },
  { key: "site.phone", label: "Phone", group: "Brand", type: "text", help: "Placeholder until the school supplies its number." },
  { key: "site.whatsapp", label: "WhatsApp", group: "Brand", type: "text" },
  { key: "site.email", label: "Email", group: "Brand", type: "text" },
  { key: "site.postal", label: "Postal address", group: "Brand", type: "text" },
  { key: "site.registration", label: "Registration number", group: "Brand", type: "text" },
  { key: "site.hours", label: "Office hours", group: "Brand", type: "text" },
  { key: "site.founded", label: "Year established", group: "Brand", type: "text" },
  { key: "site.principal_name", label: "Principal name", group: "Brand", type: "text", help: "Leave the placeholder until confirmed by the school." },
  { key: "site.principal_title", label: "Principal title", group: "Brand", type: "text" },
  { key: "site.principal_message", label: "Principal welcome message", group: "Brand", type: "longtext" },
  { key: "site.principal_photo", label: "Principal photo URL", group: "Brand", type: "text" },

  { key: "alert.enabled", label: "Show announcement bar", group: "Homepage", type: "text", help: "yes or no" },
  { key: "alert.message", label: "Announcement bar message", group: "Homepage", type: "text" },
  { key: "alert.label", label: "Announcement bar button label", group: "Homepage", type: "text" },
  { key: "alert.url", label: "Announcement bar link", group: "Homepage", type: "text" },

  { key: "home.hero_eyebrow", label: "Hero eyebrow", group: "Homepage", type: "text" },
  { key: "home.hero_line1", label: "Hero line 1", group: "Homepage", type: "text" },
  { key: "home.hero_highlight1", label: "Hero highlighted word 1", group: "Homepage", type: "text" },
  { key: "home.hero_line2", label: "Hero line 2", group: "Homepage", type: "text" },
  { key: "home.hero_highlight2", label: "Hero highlighted word 2", group: "Homepage", type: "text" },
  { key: "home.hero_line3", label: "Hero line 3", group: "Homepage", type: "text" },
  { key: "home.hero_body", label: "Hero introduction", group: "Homepage", type: "textarea" },
  { key: "home.hero_cta_label", label: "Hero button label", group: "Homepage", type: "text" },
  { key: "home.hero_cta_url", label: "Hero button link", group: "Homepage", type: "text" },

  { key: "home.offer_eyebrow", label: "Offer eyebrow", group: "Homepage", type: "text" },
  { key: "home.offer_title", label: "Offer heading", group: "Homepage", type: "text" },
  { key: "home.offer_body", label: "Offer introduction", group: "Homepage", type: "textarea" },

  { key: "home.identity_eyebrow", label: "Identity eyebrow", group: "Homepage", type: "text" },
  { key: "home.identity_title", label: "Identity heading", group: "Homepage", type: "text" },
  { key: "home.vision_title", label: "Vision statement", group: "Homepage", type: "textarea" },
  { key: "home.mission_title", label: "Mission statement", group: "Homepage", type: "textarea" },
  { key: "home.motto_title", label: "Motto", group: "Homepage", type: "text" },

  { key: "home.gallery_eyebrow", label: "Gallery preview eyebrow", group: "Homepage", type: "text" },
  { key: "home.gallery_title", label: "Gallery preview heading", group: "Homepage", type: "text" },
  { key: "home.gallery_body", label: "Gallery preview introduction", group: "Homepage", type: "textarea" },

  { key: "home.news_eyebrow", label: "News eyebrow", group: "Homepage", type: "text" },
  { key: "home.news_title", label: "News heading", group: "Homepage", type: "text" },

  { key: "home.cta_title", label: "Bottom call-to-action heading", group: "Homepage", type: "text" },
  { key: "home.cta_body", label: "Bottom call-to-action body", group: "Homepage", type: "textarea" },

  { key: "about.overview_title", label: "Overview heading", group: "About", type: "text" },
  { key: "about.overview_body", label: "Overview", group: "About", type: "longtext" },
  { key: "about.history_title", label: "History heading", group: "About", type: "text" },
  { key: "about.history_body", label: "History", group: "About", type: "longtext", help: "Only publish verified history. The school was inaugurated in 1985." },
  { key: "about.identity_note", label: "Identity note", group: "About", type: "textarea" },
  { key: "about.leadership_title", label: "Leadership heading", group: "About", type: "text" },
  { key: "about.leadership_body", label: "Leadership introduction", group: "About", type: "longtext" },

  { key: "academics.intro_title", label: "Academics heading", group: "Academics", type: "text" },
  { key: "academics.intro_body", label: "Academics introduction", group: "Academics", type: "longtext" },
  { key: "academics.approach_title", label: "Teaching approach heading", group: "Academics", type: "text" },
  { key: "academics.approach_body", label: "Teaching approach", group: "Academics", type: "longtext" },
  { key: "academics.exams_title", label: "Examinations heading", group: "Academics", type: "text" },
  { key: "academics.exams_body", label: "Examination information", group: "Academics", type: "longtext" },
  { key: "academics.results_title", label: "Results heading", group: "Academics", type: "text" },
  { key: "academics.results_body", label: "Results note", group: "Academics", type: "longtext" },

  { key: "admissions.intro_title", label: "Admissions heading", group: "Admissions", type: "text" },
  { key: "admissions.intro_body", label: "Admissions introduction", group: "Admissions", type: "longtext" },
  { key: "admissions.requirements", label: "Requirements (one per line)", group: "Admissions", type: "longtext" },
  { key: "admissions.procedure", label: "Application procedure (one per line)", group: "Admissions", type: "longtext" },
  { key: "admissions.dates", label: "Important dates (one per line, e.g. Label | Date | Note)", group: "Admissions", type: "longtext" },
  { key: "admissions.note", label: "Admissions notice", group: "Admissions", type: "textarea" },

  { key: "boarding.hero_title", label: "Boarding hero heading", group: "Boarding", type: "text" },
  { key: "boarding.hero_body", label: "Boarding hero introduction", group: "Boarding", type: "longtext" },
  { key: "boarding.note", label: "Boarding notice", group: "Boarding", type: "textarea" },
  { key: "boarding.fee_registration", label: "Registration fee", group: "Boarding", type: "text" },
  { key: "boarding.fee_monthly", label: "Monthly fee", group: "Boarding", type: "text" },

  { key: "gallery.intro_title", label: "Gallery heading", group: "Gallery", type: "text" },
  { key: "gallery.intro_body", label: "Gallery introduction", group: "Gallery", type: "longtext" },

  { key: "fees.intro_title", label: "Fees heading", group: "Fees", type: "text" },
  { key: "fees.intro_body", label: "Fees introduction", group: "Fees", type: "longtext" },
  { key: "fees.note", label: "Fees notice", group: "Fees", type: "textarea" },

  { key: "contact.intro_title", label: "Contact heading", group: "Contact / Footer", type: "text" },
  { key: "contact.intro_body", label: "Contact introduction", group: "Contact / Footer", type: "longtext" },
  { key: "footer.newsletter_text", label: "Newsletter text", group: "Contact / Footer", type: "textarea" },
];

export const contentDefaults: Record<string, string> = {
  "site.name": "Nuuyoma Senior Secondary School",
  "site.short_name": "Nuuyoma SSS",
  "site.tagline": "Knowledge • Discipline • Service",
  "site.about_short":
    "A state senior secondary school in Oshikuku, Omusati Region, serving Grades 8 to 12 with a proud tradition of learning, leadership and community.",
  "site.location": "Oshikuku, Omusati Region",
  "site.region": "Omusati",
  "site.phone": "+264 00 000 0000",
  "site.whatsapp": "+264 00 000 0000",
  "site.email": "office@nuuyomasss.na",
  "site.postal": "P.O. Box 000, Oshikuku",
  "site.registration": "To be confirmed",
  "site.hours": "Monday – Friday, 07:30 – 16:30",
  "site.founded": "1985",
  "site.principal_name": "School Principal",
  "site.principal_title": "Principal",
  "site.principal_message":
    "Welcome to Nuuyoma Senior Secondary School. Our school is a place where learners are challenged to think deeply, act with integrity and serve their community. I invite you to explore this website, learn about our programmes and join us in building a future of which every learner can be proud. This message is a placeholder and can be updated by the school administration.",
  "site.principal_photo": "/assets/principal-placeholder.webp",

  "alert.enabled": "yes",
  "alert.message": "The 2027 admission information page is being updated. Please check back soon.",
  "alert.label": "Admissions",
  "alert.url": "/admissions",

  "home.hero_eyebrow": "Since 1985",
  "home.hero_line1": "WHERE",
  "home.hero_highlight1": "KNOWLEDGE",
  "home.hero_line2": "BUILDS",
  "home.hero_highlight2": "CHARACTER",
  "home.hero_line3": "EVERY DAY",
  "home.hero_body":
    "Welcome to Nuuyoma Senior Secondary School, a community where academic excellence, discipline and leadership grow together. Discover a school dedicated to preparing confident young Namibians for life beyond the classroom.",
  "home.hero_cta_label": "Explore Admissions",
  "home.hero_cta_url": "/admissions",

  "home.offer_eyebrow": "What We Offer",
  "home.offer_title": "A Senior Secondary Journey, Grades 8 to 12",
  "home.offer_body":
    "Nuuyoma Senior Secondary School provides a full secondary education in Oshikuku, Omusati Region. Our subject choices prepare learners for the National Senior Secondary Certificate and for further study, work and life.",

  "home.identity_eyebrow": "Our Identity",
  "home.identity_title": "Our Leader & School Identity",
  "home.vision_title":
    "To be a centre of academic excellence that develops disciplined, innovative and responsible leaders for Namibia.",
  "home.mission_title":
    "To provide quality secondary education through dedicated teaching, strong discipline and meaningful community partnership.",
  "home.motto_title": "Knowledge • Discipline • Service",

  "home.gallery_eyebrow": "School Life",
  "home.gallery_title": "Moments at Nuuyoma",
  "home.gallery_body":
    "A glimpse of learning, sport and culture at our school. These photographs are placeholders and can be replaced with official school photographs in the admin dashboard.",
  "home.news_eyebrow": "News & Notices",
  "home.news_title": "What's Happening at NSSS",
  "home.cta_title": "Ready to Join the Nuuyoma Family?",
  "home.cta_body":
    "Explore our admissions information, download the requirements and submit your application online. Our school office is ready to help.",

  "about.overview_title": "A School Built on Learning and Character",
  "about.overview_body":
    "Nuuyoma Senior Secondary School is a state secondary school located in Oshikuku in the Omusati Region of Namibia. The school provides education from Grade 8 to Grade 12 and offers boarding facilities.\n\nOur school community is committed to academic effort, responsible conduct and service. Learners are supported by teachers and staff who believe that every young person deserves a safe, structured and encouraging environment in which to grow.\n\nThis page is managed by the school administration. Details marked as placeholders should be replaced with official school information.",
  "about.history_title": "Our History",
  "about.history_body":
    "Nuuyoma Senior Secondary School was inaugurated in 1985 and has served generations of learners in the Oshikuku community and surrounding areas.\n\nThe full school history, milestones and archive photographs can be published here by the school administration from the admin dashboard.",
  "about.identity_note":
    "Our vision, mission and values guide the daily life of the school. They are editable placeholders until the school adopts its official statements.",
  "about.leadership_title": "Leadership & Administration",
  "about.leadership_body":
    "The school is led by the Principal, supported by the management team, heads of department and the school board. Official staff names and photographs can be added by the administration from the admin dashboard. No staff details are published until confirmed by the school.",

  "academics.intro_title": "Academic Excellence at NSSS",
  "academics.intro_body":
    "Nuuyoma Senior Secondary School offers a broad, balanced curriculum for Grades 8 to 12. Our teachers focus on strong foundations in languages, mathematics, sciences and the humanities, supported by technology, sport and cultural activities.\n\nSubject offerings may vary from year to year according to national curriculum requirements and learner demand. The subjects listed on this page are published and maintained by the school administration.",
  "academics.approach_title": "Teaching & Learning",
  "academics.approach_body":
    "Teaching at Nuuyoma is structured, purposeful and learner-centred. Teachers use regular assessment, feedback and revision to help learners understand their progress. Structured study time, pastoral support and co-curricular activities help learners develop confidence, organisation and leadership.\n\nOur boarding facilities provide supervised evening study for learners who live on campus.",
  "academics.exams_title": "Examinations & Assessment",
  "academics.exams_body":
    "Continuous assessment takes place throughout each term. Learners in Grade 10 and Grade 12 prepare for national examinations. Examination timetables, entry requirements and relevant notices are published on the News & Notices page when they are released by the school or the Ministry of Education, Arts and Culture.\n\nExamination documents can be downloaded from the Admissions and News pages when uploaded by the school.",
  "academics.results_title": "Academic Achievements",
  "academics.results_body":
    "The school's verified academic results and achievements will be published here as they are confirmed by the administration. No results or statistics have been invented for this website.",

  "admissions.intro_title": "Admission to Nuuyoma Senior Secondary School",
  "admissions.intro_body":
    "Thank you for your interest in Nuuyoma Senior Secondary School. Our admissions information is managed by the school office. The details below are editable placeholders; please confirm all requirements, dates and fees directly with the school before applying.",
  "admissions.requirements":
    "Completed application form\nBirth certificate or national document\nMost recent school report\nTransfer letter from the previous school (where applicable)\nProof of residence or guardian contact details\nHostel application form (if boarding is required)",
  "admissions.procedure":
    "Collect or download the application form\nComplete all sections and attach the required documents\nSubmit the form to the school office or online below\nWait for the school to review the application\nReceive placement or waiting-list feedback from the office\nComplete registration and fee arrangements once accepted",
  "admissions.dates":
    "Applications open | Date to be confirmed | Confirm with the school office\nApplication deadline | Date to be confirmed | Late applications depend on space\nPlacement feedback | Date to be confirmed | The office will contact applicants\nRegistration | Date to be confirmed | Complete registration at the school office",
  "admissions.note":
    "Admission is subject to available places, the school's admission policy and the requirements of the Ministry of Education, Arts and Culture. This online form sends an application to the school office; it does not automatically confirm a place.",

  "boarding.hero_title": "Boarding at Nuuyoma",
  "boarding.hero_body":
    "Nuuyoma Senior Secondary School has a hostel that provides safe accommodation for learners who live far from Oshikuku. Boarding offers a structured routine, meals and supervised study within the school community.",
  "boarding.note":
    "Boarding fees, registration dates and availability are confirmed by the school office. The amounts shown are placeholders and must be updated by the school before publication. Monthly boarding fees are payable by the 7th of each month.",
  "boarding.fee_registration": "TBC",
  "boarding.fee_monthly": "TBC",

  "gallery.intro_title": "Life at Nuuyoma",
  "gallery.intro_body":
    "Explore moments from school life at Nuuyoma Senior Secondary School — learning, sport, culture and community. Photographs are managed by the school administration and can be updated at any time.",

  "fees.intro_title": "School Fees & Payments",
  "fees.intro_body":
    "Nuuyoma Senior Secondary School is a state school. This page lists the payment categories that families may need to plan for, including registration, boarding and school items. The 2026/2027 fee schedule will be published here once it is confirmed by the school office.",
  "fees.note":
    "All amounts on this page are placeholders pending the official fee schedule. Please contact the school office before making any payment. Keep proof of payment and confirm banking details directly with the school.",

  "contact.intro_title": "Contact the School",
  "contact.intro_body":
    "Our school office is ready to assist learners, parents and guardians. Use the details below or send a message. Contact details are managed by the school administration and should be confirmed before publication.",
  "footer.newsletter_text": "Subscribe to receive school news, events and announcements.",
};
