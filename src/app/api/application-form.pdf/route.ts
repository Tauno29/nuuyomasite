import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const navy = rgb(0.09, 0.15, 0.23);
const coral = rgb(0.94, 0.54, 0.38);
const grey = rgb(0.42, 0.44, 0.47);
const light = rgb(0.92, 0.91, 0.9);

export async function GET() {
  const pdf = await PDFDocument.create();
  pdf.setTitle("Nuuyoma Senior Secondary School — Application for Admission");
  pdf.setAuthor("Nuuyoma Senior Secondary School");
  pdf.setSubject("Application for Admission, Grades 8 to 12");

  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const page = pdf.addPage([595.28, 841.89]);
  const { width, height } = page.getSize();
  const margin = 50;
  let y = height - 56;

  page.drawRectangle({ x: 0, y: height - 20, width, height: 20, color: navy });
  page.drawText("NUUYOMA SENIOR SECONDARY SCHOOL", { x: margin, y, size: 17, font: bold, color: navy });
  y -= 16;
  page.drawText("Oshikuku, Omusati Region, Namibia", { x: margin, y, size: 9, font: regular, color: grey });
  y -= 14;
  page.drawText("Knowledge • Discipline • Service", { x: margin, y, size: 9, font: bold, color: coral });
  y -= 26;
  page.drawText("APPLICATION FOR ADMISSION", { x: margin, y, size: 20, font: bold, color: navy });
  y -= 15;
  page.drawText("Grades 8 to 12  |  Official school office form", { x: margin, y, size: 9, font: regular, color: grey });
  y -= 8;
  page.drawLine({ start: { x: margin, y }, end: { x: width - margin, y }, thickness: 2, color: coral });
  y -= 22;

  page.drawText("INSTRUCTIONS", { x: margin, y, size: 10, font: bold, color: navy });
  y -= 13;
  const instructions = [
    "Complete all sections in block letters using a black or blue pen.",
    "Attach a copy of the learner's birth certificate, the most recent school report and a transfer letter (where applicable).",
    "Tick the boarding section only if hostel accommodation is required.",
    "Submit the completed form and supporting documents to the school office.",
    "This form does not confirm a place. Admission is subject to available places and school policy.",
  ];
  for (const line of instructions) {
    page.drawCircle({ x: margin + 3, y: y + 3, size: 1.5, color: grey });
    page.drawText(line, { x: margin + 11, y, size: 8.5, font: regular, color: grey, maxWidth: width - margin * 2 - 11 });
    y -= 15;
  }

  function section(title: string) {
    y -= 6;
    page.drawRectangle({ x: margin, y: y - 3, width: width - margin * 2, height: 17, color: rgb(0.98, 0.96, 0.94) });
    page.drawText(title, { x: margin + 6, y: y + 1, size: 9.5, font: bold, color: navy });
    y -= 24;
  }

  function fieldLine(label: string, x: number, fieldWidth: number) {
    page.drawText(label, { x, y, size: 7.5, font: bold, color: grey });
    page.drawLine({ start: { x, y: y - 6 }, end: { x: x + fieldWidth, y: y - 6 }, thickness: 0.6, color: light });
  }

  function row(cols: { label: string; width: number }[]) {
    let x = margin;
    for (const col of cols) {
      fieldLine(col.label, x, col.width);
      x += col.width + 14;
    }
    y -= 30;
  }

  section("1. LEARNER'S PARTICULARS");
  row([
    { label: "SURNAME", width: 235 },
    { label: "FIRST NAMES", width: 235 },
  ]);
  row([
    { label: "DATE OF BIRTH (DD/MM/YYYY)", width: 150 },
    { label: "GENDER", width: 100 },
    { label: "HOME LANGUAGE", width: 220 },
  ]);
  row([{ label: "POSTAL ADDRESS", width: 483 }]);
  row([
    { label: "GRADE APPLYING FOR (8 – 12)", width: 150 },
    { label: "PREVIOUS SCHOOL ATTENDED", width: 150 },
    { label: "YEAR COMPLETED", width: 150 },
  ]);

  section("2. GUARDIAN / PARENT DETAILS");
  row([
    { label: "GUARDIAN FULL NAME", width: 235 },
    { label: "RELATIONSHIP TO LEARNER", width: 235 },
  ]);
  row([
    { label: "CONTACT NUMBER", width: 235 },
    { label: "ALTERNATIVE NUMBER", width: 235 },
  ]);
  row([
    { label: "EMAIL ADDRESS", width: 235 },
    { label: "OCCUPATION", width: 235 },
  ]);

  section("3. BOARDING & TRANSPORT");
  page.drawText("Does the learner require hostel accommodation?", { x: margin, y, size: 8.5, font: regular, color: navy });
  page.drawRectangle({ x: margin + 300, y: y - 2, width: 11, height: 11, borderColor: grey, borderWidth: 0.8 });
  page.drawText("YES", { x: margin + 316, y, size: 8.5, font: regular, color: grey });
  page.drawRectangle({ x: margin + 350, y: y - 2, width: 11, height: 11, borderColor: grey, borderWidth: 0.8 });
  page.drawText("NO", { x: margin + 366, y, size: 8.5, font: regular, color: grey });
  y -= 24;
  row([{ label: "TRANSPORT ARRANGEMENTS / DAY LEARNER DETAILS", width: 483 }]);

  section("4. MEDICAL, LEARNING SUPPORT & OTHER INFORMATION");
  page.drawText("List any medical condition, allergy, learning support need or other information the school should know.", {
    x: margin,
    y,
    size: 8,
    font: regular,
    color: grey,
  });
  y -= 18;
  for (let i = 0; i < 4; i += 1) {
    page.drawLine({ start: { x: margin, y }, end: { x: width - margin, y }, thickness: 0.6, color: light });
    y -= 22;
  }

  section("5. DECLARATION");
  const declaration =
    "I confirm that the information supplied in this application is true and complete. I understand that submitting this form does not guarantee placement and that admission is subject to available places and the admission policy of Nuuyoma Senior Secondary School and the Ministry of Education, Arts and Culture.";
  page.drawText(declaration, { x: margin, y: y + 2, size: 8, font: regular, color: grey, maxWidth: width - margin * 2, lineHeight: 11 });
  y -= 46;
  row([
    { label: "GUARDIAN SIGNATURE", width: 235 },
    { label: "DATE", width: 235 },
  ]);

  section("OFFICE USE ONLY");
  row([
    { label: "DATE RECEIVED", width: 150 },
    { label: "RECEIVED BY", width: 150 },
    { label: "APPLICATION STATUS", width: 150 },
  ]);
  page.drawText("Documents received:  [  ] Birth certificate   [  ] School report   [  ] Transfer letter   [  ] Hostel form   [  ] Other:", {
    x: margin,
    y,
    size: 7.8,
    font: regular,
    color: grey,
  });

  page.drawLine({ start: { x: margin, y: 66 }, end: { x: width - margin, y: 66 }, thickness: 0.8, color: light });
  page.drawText("Nuuyoma Senior Secondary School  |  Contact details to be confirmed by the school office", {
    x: margin,
    y: 52,
    size: 7.5,
    font: regular,
    color: grey,
  });
  page.drawText("This form is a printable placeholder generated by the school website. It contains no personal data.", {
    x: margin,
    y: 41,
    size: 7.5,
    font: regular,
    color: grey,
  });

  const bytes = await pdf.save();
  return new Response(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="NSSS-Application-for-Admission.pdf"',
      "Cache-Control": "public, max-age=3600",
    },
  });
}
