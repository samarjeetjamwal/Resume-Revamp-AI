import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  TabStopType,
  TabStopPosition,
  BorderStyle,
} from "docx";
import { ResumeData } from "../types";

export const generateDocx = async (data: ResumeData): Promise<void> => {
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720, // 0.5 inch
              right: 720,
              bottom: 720,
              left: 720,
            },
          },
        },
        children: [
          // Header: Name
          new Paragraph({
            text: data.fullName,
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
          }),
          // Header: Job Title
          new Paragraph({
            text: data.jobTitle,
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          }),
          // Header: Contact Info
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
            children: [
              new TextRun({
                text: [
                  data.contact.email,
                  data.contact.phone,
                  data.contact.location,
                  data.contact.linkedin,
                  data.contact.website,
                ]
                  .filter(Boolean)
                  .join(" | "),
                size: 20, // 10pt
              }),
            ],
            border: {
              bottom: {
                color: "999999",
                space: 12,
                value: BorderStyle.SINGLE,
                size: 6,
              },
            },
          }),

          // Summary
          new Paragraph({
            text: "PROFESSIONAL SUMMARY",
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 200, after: 100 },
          }),
          new Paragraph({
            text: data.summary,
            spacing: { after: 300 },
          }),

          // Skills
          new Paragraph({
            text: "SKILLS",
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 200, after: 100 },
          }),
          new Paragraph({
            text: data.skills.join(", "),
            spacing: { after: 300 },
          }),

          // Experience
          new Paragraph({
            text: "EXPERIENCE",
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 200, after: 200 },
          }),
          ...data.experience.flatMap((exp) => [
            new Paragraph({
              children: [
                new TextRun({
                  text: exp.role,
                  bold: true,
                  size: 24, // 12pt
                }),
                new TextRun({
                  text: `\t${exp.dates}`,
                  bold: true,
                }),
              ],
              tabStops: [
                {
                  type: TabStopType.RIGHT,
                  position: TabStopPosition.MAX,
                },
              ],
              spacing: { before: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: exp.company,
                  italics: true,
                }),
                new TextRun({
                  text: `\t${exp.location || ""}`,
                  italics: true,
                }),
              ],
              tabStops: [
                {
                  type: TabStopType.RIGHT,
                  position: TabStopPosition.MAX,
                },
              ],
              spacing: { after: 100 },
            }),
            ...exp.description.map(
              (desc) =>
                new Paragraph({
                  text: desc,
                  bullet: {
                    level: 0,
                  },
                  spacing: { after: 50 },
                })
            ),
            new Paragraph({ text: "", spacing: { after: 200 } }), // Spacer
          ]),

          // Education
          new Paragraph({
            text: "EDUCATION",
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 100, after: 200 },
          }),
          ...data.education.flatMap((edu) => [
            new Paragraph({
              children: [
                new TextRun({
                  text: edu.school,
                  bold: true,
                }),
                new TextRun({
                  text: `\t${edu.dates}`,
                }),
              ],
              tabStops: [
                {
                  type: TabStopType.RIGHT,
                  position: TabStopPosition.MAX,
                },
              ],
            }),
            new Paragraph({
              text: edu.degree,
              italics: true,
              spacing: { after: 100 },
            }),
          ]),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${data.fullName.replace(/\s+/g, "_")}_Resume.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};
