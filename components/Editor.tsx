import React from 'react';
import { ResumeData } from '../types';
import { Plus, Trash2 } from 'lucide-react';

interface EditorProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

export const Editor: React.FC<EditorProps> = ({ data, onChange }) => {
  
  const handleChange = (field: keyof ResumeData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handleContactChange = (field: string, value: string) => {
    onChange({ ...data, contact: { ...data.contact, [field]: value } });
  };

  const handleExperienceChange = (index: number, field: string, value: any) => {
    const newExp = [...data.experience];
    newExp[index] = { ...newExp[index], [field]: value };
    onChange({ ...data, experience: newExp });
  };

  const handleSkillChange = (index: number, value: string) => {
    const newSkills = [...data.skills];
    newSkills[index] = value;
    onChange({ ...data, skills: newSkills });
  };
  
  return (
    <div className="h-full overflow-y-auto p-4 space-y-6 bg-white border-r border-gray-200">
      <div className="space-y-4">
        <h2 className="font-bold text-lg text-gray-800 border-b pb-2">Personal Info</h2>
        <div className="grid grid-cols-1 gap-3">
          <input 
            className="border p-2 rounded text-sm w-full" 
            value={data.fullName} 
            onChange={(e) => handleChange('fullName', e.target.value)} 
            placeholder="Full Name" 
          />
          <input 
            className="border p-2 rounded text-sm w-full" 
            value={data.jobTitle} 
            onChange={(e) => handleChange('jobTitle', e.target.value)} 
            placeholder="Job Title" 
          />
          <textarea 
            className="border p-2 rounded text-sm w-full" 
            value={data.summary} 
            onChange={(e) => handleChange('summary', e.target.value)} 
            placeholder="Professional Summary" 
            rows={4}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="font-bold text-lg text-gray-800 border-b pb-2">Contact</h2>
        <div className="grid grid-cols-2 gap-3">
           <input className="border p-2 rounded text-sm" value={data.contact.email} onChange={(e) => handleContactChange('email', e.target.value)} placeholder="Email" />
           <input className="border p-2 rounded text-sm" value={data.contact.phone} onChange={(e) => handleContactChange('phone', e.target.value)} placeholder="Phone" />
           <input className="border p-2 rounded text-sm" value={data.contact.location} onChange={(e) => handleContactChange('location', e.target.value)} placeholder="Location" />
           <input className="border p-2 rounded text-sm" value={data.contact.linkedin} onChange={(e) => handleContactChange('linkedin', e.target.value)} placeholder="LinkedIn" />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="font-bold text-lg text-gray-800 border-b pb-2 flex justify-between items-center">
            Skills
            <button onClick={() => onChange({...data, skills: [...data.skills, "New Skill"]})} className="text-blue-600 hover:bg-blue-50 p-1 rounded"><Plus size={16}/></button>
        </h2>
        <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, i) => (
                <div key={i} className="flex items-center gap-1">
                    <input 
                        className="border p-1 rounded text-sm w-32" 
                        value={skill} 
                        onChange={(e) => handleSkillChange(i, e.target.value)} 
                    />
                    <button onClick={() => onChange({...data, skills: data.skills.filter((_, idx) => idx !== i)})} className="text-red-400"><Trash2 size={14}/></button>
                </div>
            ))}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="font-bold text-lg text-gray-800 border-b pb-2">Experience</h2>
        {data.experience.map((exp, i) => (
            <div key={i} className="bg-gray-50 p-3 rounded space-y-2 border">
                <div className="flex justify-between">
                    <input className="font-bold bg-transparent text-sm w-full" value={exp.role} onChange={(e) => handleExperienceChange(i, 'role', e.target.value)} />
                    <button onClick={() => {
                        const newExp = data.experience.filter((_, idx) => idx !== i);
                        onChange({...data, experience: newExp});
                    }} className="text-red-500"><Trash2 size={14}/></button>
                </div>
                <input className="text-xs w-full bg-transparent" value={exp.company} onChange={(e) => handleExperienceChange(i, 'company', e.target.value)} />
                <input className="text-xs w-full bg-transparent text-gray-500" value={exp.dates} onChange={(e) => handleExperienceChange(i, 'dates', e.target.value)} />
                <textarea 
                    className="w-full text-xs p-2 border rounded" 
                    rows={4} 
                    value={exp.description.join('\n')} 
                    onChange={(e) => handleExperienceChange(i, 'description', e.target.value.split('\n'))}
                />
            </div>
        ))}
        <button 
            onClick={() => onChange({
                ...data, 
                experience: [...data.experience, { role: "New Role", company: "Company", dates: "2023-Present", description: ["Did cool things"] }]
            })}
            className="w-full py-2 bg-blue-50 text-blue-600 rounded text-sm font-medium hover:bg-blue-100 transition-colors"
        >
            + Add Position
        </button>
      </div>
    </div>
  );
};
