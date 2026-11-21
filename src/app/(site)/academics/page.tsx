import Link from "next/link";
import { ArrowRight, BookOpen, CalendarCheck, CheckCircle2, ClipboardList, GraduationCap, Microscope, NotebookPen } from "lucide-react";
import PageHero from "@/components/site/PageHero";
import RichText from "@/components/site/RichText";
import { getContent, getSubjects } from "@/lib/site";

export const metadata = {
  title: "Academics",
  description:
    "Explore the academic programme at Nuuyoma Senior Secondary School — subjects for Grades 8 to 12, teaching and learning, assessment and examination information.",
};

const streams = [
  ["🗣️", "Languages & Literacy", "English, Oshindonga / Oshikwanyama and literature.", "#ff4b88", "#fff1f7"],
  ["🔬", "Mathematics & Sciences", "Mathematics, physical science, biology and agriculture.", "#9755ec", "#faf2ff"],
  ["💼", "Commerce & Enterprise", "Business studies, accounting and economics.", "#32a9dd", "#eff8ff"],
  ["🌍", "Humanities", "Geography, history and development studies.", "#f0a400", "#fff8e8"],
  ["💻", "Technology & Vocational", "ICT and practical subjects that build employable skills.", "#08be74", "#effff6"],
];

export default function AcademicsPage() {
  const content = getContent();
  const subjects = getSubjects();

  return (
    <div className="bg-[#f8fafc]">
      <PageHero
        eyebrow="Academics"
        title={content["academics.intro_title"]}
        body="A broad, balanced curriculum for Grades 8 to 12, taught with structure, purpose and high expectations."
        breadcrumb="Academics"
      />

      <section className="px-5 py-20">
        <div className="mx-auto grid max-w-[1160px] gap-12 lg:grid-cols-[1.1fr_.9fr]">
          <div>
            <div className="eyebrow">Curriculum</div>
            <h2 className="display mt-4 text-3xl text-[#0f172a] sm:text-4xl">Learning with purpose</h2>
            <RichText text={content["academics.intro_body"]} className="mt-5 text-[15px] text-[#5d6977]" />
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                ["Grades 8–9", "Junior secondary foundations across languages, mathematics, sciences, social sciences and practical subjects."],
                ["Grades 10–11", "Senior secondary subject choices leading toward the National Senior Secondary Certificate."],
                ["Grade 12", "Final-year examination preparation, revision programmes and post-school guidance."],
                ["Boarding study", "Supervised evening study and structured routines for learners living in the hostel."],
              ].map(([title, body]) => (
                <div key={title} className="rounded-2xl border border-[#e2e8f0] bg-white p-5">
                  <div className="flex items-center gap-2 text-sm font-extrabold text-[#0b4f8a]">
                    <GraduationCap size={17} /> {title}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#6a625b]">{body}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative self-start">
            <img
              src="/assets/gallery/science.webp"
              alt="Illustrative science classroom placeholder"
              className="aspect-[4/3] w-full rounded-[1.5rem] border-4 border-white object-cover shadow-xl"
            />
            <div className="mt-5 flex gap-4">
              <img
                src="/assets/gallery/library.webp"
                alt="Illustrative library placeholder"
                className="aspect-square w-1/2 rounded-[1.2rem] object-cover shadow-lg"
              />
              <div className="flex w-1/2 flex-col justify-center rounded-[1.2rem] bg-[#0f172a] p-5 text-white">
                <Microscope size={22} className="text-[#0d6db7]" />
                <p className="mt-2 text-sm font-bold leading-6">Practical work supports theory in every science subject.</p>
              </div>
            </div>
            <p className="mt-3 text-[10px] font-semibold uppercase tracking-[.12em] text-[#94a3b8]">
              Placeholder photographs — replace with official school photos
            </p>
          </div>
        </div>
      </section>

      {/* SUBJECTS */}
      <section id="subjects" className="bg-white px-5 py-20">
        <div className="mx-auto max-w-[1160px]">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="eyebrow">Subjects on Offer</div>
              <h2 className="display mt-3 text-4xl text-[#0f172a]">Subjects & Programmes</h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-[#697584]">
              Subjects are published by the school and may change according to national curriculum requirements and learner demand.
            </p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {subjects.map((subject, index) => (
              <div key={subject.id} className="rounded-[1.3rem] border border-[#e2e8f0] bg-[#f8fafc] p-6 transition hover:-translate-y-0.5 hover:border-[#f2c4ad]">
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#0b4f8a] shadow-sm">
                    {index % 3 === 0 ? <BookOpen size={19} /> : index % 3 === 1 ? <Microscope size={19} /> : <NotebookPen size={19} />}
                  </span>
                  <span className="rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-[.1em] text-[#7c7168]">
                    {subject.level}
                  </span>
                </div>
                <h3 className="display mt-4 text-xl text-[#0f172a]">{subject.name}</h3>
                {subject.description && <p className="mt-2 text-sm leading-6 text-[#6a625b]">{subject.description}</p>}
              </div>
            ))}
            {subjects.length === 0 && (
              <p className="col-span-full rounded-2xl bg-[#f8fafc] p-8 text-center text-sm text-[#7c7168]">
                Subjects will be listed here once published by the school.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* STREAMS */}
      <section id="streams" className="px-5 py-20">
        <div className="mx-auto max-w-[1160px]">
          <div className="text-center">
            <div className="eyebrow">Pathways</div>
            <h2 className="display mt-3 text-4xl text-[#0f172a]">Find your pathway</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#697584]">
              Subject combinations are discussed with learners and guardians during subject-choice sessions.
            </p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {streams.map(([icon, name, description, color, bg]) => (
              <div key={name} className="rounded-[1.4rem] border-2 p-5" style={{ borderColor: color, backgroundColor: bg }}>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl" style={{ backgroundColor: `${color}22` }} aria-hidden>
                  {icon}
                </div>
                <h3 className="display mt-4 text-lg leading-tight" style={{ color }}>{name}</h3>
                <p className="mt-2 text-xs leading-5 text-[#626d77]">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEACHING, EXAMS */}
      <section className="bg-white px-5 py-20">
        <div className="mx-auto grid max-w-[1160px] gap-10 lg:grid-cols-2">
          <div className="rounded-[1.6rem] bg-[#f8fafc] p-8">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0d6db7] text-white"><ClipboardList size={22} /></span>
            <h2 className="display mt-5 text-2xl text-[#0f172a]">{content["academics.approach_title"]}</h2>
            <RichText text={content["academics.approach_body"]} className="mt-4 text-sm text-[#5d6977]" />
          </div>
          <div className="rounded-[1.6rem] bg-[#f8fafc] p-8">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#9755ec] text-white"><CalendarCheck size={22} /></span>
            <h2 className="display mt-5 text-2xl text-[#0f172a]">{content["academics.exams_title"]}</h2>
            <RichText text={content["academics.exams_body"]} className="mt-4 text-sm text-[#5d6977]" />
            <Link href="/news" className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-[#0b4f8a] hover:underline">
              Read examination notices <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* RESULTS */}
      <section className="px-5 py-20">
        <div className="mx-auto max-w-[1160px] overflow-hidden rounded-[2rem] bg-[#0f172a] text-white">
          <div className="grid gap-8 p-8 sm:p-12 lg:grid-cols-[1.2fr_.8fr]">
            <div>
              <div className="text-xs font-extrabold uppercase tracking-[.2em] text-[#0d6db7]">{content["academics.results_title"]}</div>
              <h2 className="display mt-3 text-3xl sm:text-4xl">Achievements, published with care</h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/75">{content["academics.results_body"]}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/admissions" className="pill bg-[#0d6db7] px-6 py-3 text-sm font-bold text-white hover:bg-[#ff9b79]">
                  Join our next intake
                </Link>
                <Link href="/contact" className="pill border border-white/25 px-6 py-3 text-sm font-bold text-white hover:bg-white/10">
                  Ask about results
                </Link>
              </div>
            </div>
            <ul className="grid content-center gap-3 text-sm text-white/80">
              {[
                "No academic results or statistics have been invented for this website.",
                "Verified results and school achievements are added by the administration.",
                "National examination information is published as it is released.",
              ].map((line) => (
                <li key={line} className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[#6fe0b4]" /> {line}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
