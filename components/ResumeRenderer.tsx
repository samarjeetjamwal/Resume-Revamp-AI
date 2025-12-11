import React from 'react';
import { ResumeData, TemplateType } from '../types';
import { Mail, Phone, MapPin, Linkedin, Globe, Briefcase, GraduationCap, Award, Code, User } from 'lucide-react';

interface RendererProps {
  data: ResumeData;
  template: TemplateType;
}

export const ResumeRenderer: React.FC<RendererProps> = ({ data, template }) => {
  // Base container: Use min-h for screen to simulate A4, but allow auto height for print to support multiple pages.
  const containerClass = "w-full min-h-[1123px] bg-white text-slate-800 text-sm leading-relaxed p-8 shadow-lg print:shadow-none print:p-0 print:min-h-0 print:h-auto print:overflow-visible";

  const HeaderContact = () => (
    <div className="flex flex-wrap gap-4 text-xs mt-2 opacity-90">
      {data.contact.email && <div className="flex items-center gap-1"><Mail size={12} /> {data.contact.email}</div>}
      {data.contact.phone && <div className="flex items-center gap-1"><Phone size={12} /> {data.contact.phone}</div>}
      {data.contact.location && <div className="flex items-center gap-1"><MapPin size={12} /> {data.contact.location}</div>}
      {data.contact.linkedin && <div className="flex items-center gap-1"><Linkedin size={12} /> {data.contact.linkedin}</div>}
      {data.contact.website && <div className="flex items-center gap-1"><Globe size={12} /> {data.contact.website}</div>}
    </div>
  );

  // Template 1: Software Engineer Chronological (Two Column)
  if (template === TemplateType.SOFTWARE_ENGINEER) {
    return (
      <div className={`${containerClass} grid grid-cols-12 gap-8`}>
        <div className="col-span-8 space-y-6">
          <div className="border-b-2 border-slate-800 pb-4">
            <h1 className="text-4xl font-bold uppercase tracking-tight">{data.fullName}</h1>
            <p className="text-xl font-medium text-slate-600 mt-1">{data.jobTitle}</p>
            <HeaderContact />
          </div>
          
          <section>
            <h2 className="text-lg font-bold uppercase border-b border-slate-300 mb-3 flex items-center gap-2">
              <Briefcase size={18} /> Experience
            </h2>
            <div className="space-y-4">
              {data.experience.map((exp, i) => (
                <div key={i} className="break-inside-avoid">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-base">{exp.role}</h3>
                    <span className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded">{exp.dates}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-600 mb-2 italic">
                    <span>{exp.company}</span>
                    <span>{exp.location}</span>
                  </div>
                  <ul className="list-disc ml-4 space-y-1 text-xs text-slate-700">
                    {exp.description.map((desc, j) => <li key={j}>{desc}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="col-span-4 space-y-6 bg-slate-50 p-4 -my-8 py-8 h-full print:bg-slate-50 print:h-auto">
          <section className="break-inside-avoid">
            <h2 className="text-md font-bold uppercase border-b border-slate-300 mb-3">Summary</h2>
            <p className="text-xs text-slate-600 italic">{data.summary}</p>
          </section>

          <section className="break-inside-avoid">
            <h2 className="text-md font-bold uppercase border-b border-slate-300 mb-3">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, i) => (
                <span key={i} className="bg-white border border-slate-200 px-2 py-1 text-xs rounded shadow-sm font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </section>

          <section className="break-inside-avoid">
            <h2 className="text-md font-bold uppercase border-b border-slate-300 mb-3">Education</h2>
            <div className="space-y-3">
              {data.education.map((edu, i) => (
                <div key={i}>
                  <div className="font-bold text-sm">{edu.school}</div>
                  <div className="text-xs">{edu.degree}</div>
                  <div className="text-xs text-slate-500">{edu.dates}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    );
  }

  // Template 2: Enhanced Chronological (Clean Single Column)
  if (template === TemplateType.ENHANCED_CHRONOLOGICAL) {
    return (
      <div className={`${containerClass} max-w-[210mm] mx-auto`}>
        <div className="text-center border-b pb-6 mb-6">
          <h1 className="text-3xl font-serif font-bold text-slate-900">{data.fullName}</h1>
          <p className="text-lg text-slate-600 mt-2">{data.jobTitle}</p>
          <div className="flex justify-center mt-3">
            <HeaderContact />
          </div>
        </div>

        <div className="space-y-6">
          <section className="break-inside-avoid">
            <h2 className="text-sm font-bold tracking-widest uppercase text-slate-500 mb-3">Professional Summary</h2>
            <p className="text-sm text-slate-800">{data.summary}</p>
          </section>

          <section>
            <h2 className="text-sm font-bold tracking-widest uppercase text-slate-500 mb-3 border-b pb-1">Experience</h2>
            <div className="space-y-5">
              {data.experience.map((exp, i) => (
                <div key={i} className="break-inside-avoid">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>{exp.role}, {exp.company}</span>
                    <span className="text-slate-500 font-normal">{exp.dates}</span>
                  </div>
                  <ul className="list-square ml-4 mt-2 space-y-1 text-slate-700 text-sm">
                    {exp.description.map((desc, j) => <li key={j}>{desc}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-2 gap-6">
            <section className="break-inside-avoid">
              <h2 className="text-sm font-bold tracking-widest uppercase text-slate-500 mb-3 border-b pb-1">Education</h2>
              {data.education.map((edu, i) => (
                <div key={i} className="mb-2">
                  <div className="font-bold">{edu.school}</div>
                  <div className="text-sm">{edu.degree}</div>
                  <div className="text-xs text-slate-500">{edu.dates}</div>
                </div>
              ))}
            </section>
            <section className="break-inside-avoid">
              <h2 className="text-sm font-bold tracking-widest uppercase text-slate-500 mb-3 border-b pb-1">Technical Skills</h2>
              <div className="text-sm text-slate-800 leading-relaxed">
                {data.skills.join(" • ")}
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }

  // Template 4: ATS Optimized (Minimalist)
  if (template === TemplateType.ATS_OPTIMIZED) {
    return (
      <div className={`${containerClass} font-mono text-black`}>
        <div className="mb-6">
          <h1 className="text-2xl font-bold uppercase mb-2">{data.fullName}</h1>
          <div className="text-xs space-y-1">
             <p>{data.contact.location} | {data.contact.phone} | {data.contact.email}</p>
             {data.contact.linkedin && <p>{data.contact.linkedin}</p>}
          </div>
        </div>

        <div className="space-y-6">
          <section className="break-inside-avoid">
            <h3 className="font-bold uppercase border-b border-black mb-2">Summary</h3>
            <p className="text-xs">{data.summary}</p>
          </section>

          <section className="break-inside-avoid">
            <h3 className="font-bold uppercase border-b border-black mb-2">Skills</h3>
            <p className="text-xs">{data.skills.join(", ")}</p>
          </section>

          <section>
            <h3 className="font-bold uppercase border-b border-black mb-2">Work Experience</h3>
            {data.experience.map((exp, i) => (
              <div key={i} className="mb-4 break-inside-avoid">
                <div className="flex justify-between font-bold text-sm">
                  <span>{exp.company}</span>
                  <span>{exp.dates}</span>
                </div>
                <div className="text-sm italic mb-1">{exp.role}</div>
                <ul className="list-disc ml-5 text-xs space-y-1">
                  {exp.description.map((desc, j) => <li key={j}>{desc}</li>)}
                </ul>
              </div>
            ))}
          </section>

          <section className="break-inside-avoid">
            <h3 className="font-bold uppercase border-b border-black mb-2">Education</h3>
            {data.education.map((edu, i) => (
              <div key={i} className="mb-2 text-xs">
                <span className="font-bold">{edu.school}</span>, {edu.degree} ({edu.dates})
              </div>
            ))}
          </section>
        </div>
      </div>
    );
  }

  // Template 3: Strategic Hybrid (Blue Accents)
  if (template === TemplateType.STRATEGIC_HYBRID) {
     return (
      <div className={`${containerClass}`}>
        <header className="border-l-4 border-blue-600 pl-6 mb-8">
            <h1 className="text-4xl font-bold text-slate-900">{data.fullName}</h1>
            <p className="text-xl text-blue-600 font-medium mt-1">{data.jobTitle}</p>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
                {data.contact.email && <span>{data.contact.email}</span>}
                {data.contact.phone && <span>• {data.contact.phone}</span>}
                {data.contact.linkedin && <span>• LinkedIn</span>}
            </div>
        </header>

        <div className="grid grid-cols-3 gap-8">
            <div className="col-span-2 space-y-8">
                <section className="break-inside-avoid">
                    <h2 className="text-blue-700 font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                        <User size={16} /> Professional Profile
                    </h2>
                    <p className="text-slate-700 text-sm leading-relaxed">{data.summary}</p>
                </section>

                <section>
                    <h2 className="text-blue-700 font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Briefcase size={16} /> Experience
                    </h2>
                    <div className="space-y-6">
                        {data.experience.map((exp, i) => (
                            <div key={i} className="relative pl-4 border-l-2 border-slate-200 break-inside-avoid">
                                <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-blue-600"></div>
                                <h3 className="font-bold text-slate-800">{exp.role}</h3>
                                <div className="text-blue-600 text-sm font-medium mb-2">{exp.company} | {exp.dates}</div>
                                <ul className="space-y-1 text-sm text-slate-600">
                                    {exp.description.map((desc, j) => (
                                        <li key={j} className="flex gap-2">
                                            <span className="text-blue-400">›</span> {desc}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <div className="space-y-8">
                <section className="bg-slate-50 p-4 rounded-lg break-inside-avoid">
                    <h2 className="text-blue-700 font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Award size={16} /> Expertise
                    </h2>
                    <div className="flex flex-col gap-2">
                        {data.skills.map((skill, i) => (
                            <span key={i} className="text-sm font-medium text-slate-700 border-b border-slate-200 pb-1">
                                {skill}
                            </span>
                        ))}
                    </div>
                </section>

                <section className="break-inside-avoid">
                     <h2 className="text-blue-700 font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                        <GraduationCap size={16} /> Education
                    </h2>
                    {data.education.map((edu, i) => (
                        <div key={i} className="mb-4">
                            <div className="font-bold text-slate-800">{edu.school}</div>
                            <div className="text-sm text-slate-600">{edu.degree}</div>
                            <div className="text-xs text-slate-400 mt-1">{edu.dates}</div>
                        </div>
                    ))}
                </section>
            </div>
        </div>
      </div>
     );
  }

  // Template 5: Visual Strategic (Dark Header)
  if (template === TemplateType.VISUAL_STRATEGIC) {
    return (
        <div className={`${containerClass} !p-0`}>
            <div className="bg-slate-800 text-white p-10">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">{data.fullName}</h1>
                        <p className="text-xl text-slate-300 font-light tracking-wide">{data.jobTitle}</p>
                    </div>
                    <div className="text-right text-sm text-slate-400 space-y-1">
                         <p>{data.contact.email}</p>
                         <p>{data.contact.phone}</p>
                         <p>{data.contact.location}</p>
                    </div>
                </div>
            </div>
            
            <div className="p-10 grid grid-cols-12 gap-8">
                <div className="col-span-4 space-y-8 border-r border-slate-100 pr-4">
                     <section className="break-inside-avoid">
                        <h3 className="text-slate-800 font-bold uppercase mb-3 text-sm">Skills</h3>
                        <div className="flex flex-wrap gap-1">
                             {data.skills.map((skill, i) => (
                                 <span key={i} className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-semibold">{skill}</span>
                             ))}
                        </div>
                     </section>
                     <section className="break-inside-avoid">
                        <h3 className="text-slate-800 font-bold uppercase mb-3 text-sm">Education</h3>
                        {data.education.map((edu, i) => (
                            <div key={i} className="mb-3">
                                <div className="font-bold text-sm">{edu.school}</div>
                                <div className="text-xs text-slate-600">{edu.degree}</div>
                                <div className="text-xs text-slate-400">{edu.dates}</div>
                            </div>
                        ))}
                     </section>
                </div>

                <div className="col-span-8 space-y-6">
                    <section className="bg-slate-50 p-4 rounded border-l-4 border-slate-800 break-inside-avoid">
                        <h3 className="font-bold text-slate-800 mb-2">Profile</h3>
                        <p className="text-sm text-slate-600 italic">{data.summary}</p>
                    </section>

                    <section>
                         <h3 className="text-2xl font-thin text-slate-400 mb-4 border-b pb-2">Experience</h3>
                         <div className="space-y-8">
                            {data.experience.map((exp, i) => (
                                <div key={i} className="break-inside-avoid">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-bold text-lg text-slate-800">{exp.role}</h4>
                                        <span className="text-xs font-bold text-slate-400 border border-slate-200 px-2 py-1 rounded-full">{exp.dates}</span>
                                    </div>
                                    <div className="text-slate-600 font-medium text-sm mb-2">{exp.company}</div>
                                    <ul className="list-disc ml-4 space-y-1 text-sm text-slate-600">
                                         {exp.description.map((desc, j) => <li key={j}>{desc}</li>)}
                                    </ul>
                                </div>
                            ))}
                         </div>
                    </section>
                </div>
            </div>
        </div>
    );
  }

  // Fallback to Template 1
  return (
    <div className="p-4 text-center">
      <p className="text-red-500 font-bold">Template Not Implemented Yet</p>
      <p>Using default...</p>
      {/* ... render default ... */}
    </div>
  );
};