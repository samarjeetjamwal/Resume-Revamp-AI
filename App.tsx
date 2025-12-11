import React, { useState } from 'react';
import { ResumeData, TemplateType, ProcessingState } from './types';
import { ResumeRenderer } from './components/ResumeRenderer';
import { Editor } from './components/Editor';
import { processResume, processTextResume } from './services/geminiService';
import { generateDocx } from './services/docxService';
import { Upload, FileText, Loader2, Sparkles, Printer, ArrowLeft, Download } from 'lucide-react';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const SAMPLE_RESUME: ResumeData = {
  fullName: "Alex Morgan",
  jobTitle: "Senior Product Manager",
  contact: {
    email: "alex.morgan@example.com",
    phone: "(555) 123-4567",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/alexmorgan",
  },
  summary: "Results-driven Product Manager with 7+ years of experience leading cross-functional teams to build scalable software solutions. Proven track record of increasing user retention by 30% and driving revenue growth through data-driven product strategies.",
  skills: ["Product Strategy", "Agile Methodologies", "User Research", "Data Analysis (SQL, Python)", "Stakeholder Management", "Jira/Confluence"],
  experience: [
    {
      role: "Senior Product Manager",
      company: "TechFlow Solutions",
      dates: "2021 - Present",
      location: "San Francisco, CA",
      description: [
        "Led the end-to-end launch of the company's flagship SaaS platform, acquiring 10k+ users in first 6 months.",
        "Implemented A/B testing frameworks that improved conversion rates by 25% year-over-year.",
        "Mentored 3 junior PMs and established internal best practices for roadmap planning."
      ]
    },
    {
      role: "Product Manager",
      company: "Innovate Corp",
      dates: "2018 - 2021",
      location: "Austin, TX",
      description: [
        "Managed a cross-functional team of 15 engineers and designers to deliver mobile app features.",
        "Reduced churn by 15% through targeted user engagement campaigns and feature optimization.",
        "Collaborated with sales to define go-to-market strategies for enterprise clients."
      ]
    }
  ],
  education: [
    {
      degree: "MBA",
      school: "University of California, Berkeley",
      dates: "2016 - 2018"
    },
    {
      degree: "B.S. Computer Science",
      school: "University of Texas at Austin",
      dates: "2012 - 2016"
    }
  ]
};

const App: React.FC = () => {
  const [step, setStep] = useState<'upload' | 'processing' | 'editor'>('upload');
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>(TemplateType.SOFTWARE_ENGINEER);
  const [processingState, setProcessingState] = useState<ProcessingState>({ status: 'idle' });
  const [jobDesc, setJobDesc] = useState('');
  const [inputText, setInputText] = useState('');
  const [isGeneratingDocx, setIsGeneratingDocx] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStep('processing');
    setProcessingState({ status: 'reading', message: 'Reading file...' });

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const resultStr = reader.result as string;
        if (!resultStr) {
            setProcessingState({ status: 'error', message: 'Failed to read file.' });
            setStep('upload');
            return;
        }
        const base64String = resultStr.split(',')[1];
        setProcessingState({ status: 'processing', message: 'AI is analyzing and upgrading your resume...' });
        
        try {
          const data = await processResume(base64String, file.type, jobDesc);
          setResumeData(data);
          setStep('editor');
        } catch (err) {
            console.error(err);
          setProcessingState({ status: 'error', message: 'Failed to process resume. Please try again.' });
          setStep('upload');
        }
      };
      reader.onerror = () => {
        setProcessingState({ status: 'error', message: 'Error reading file.' });
        setStep('upload');
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setProcessingState({ status: 'error', message: 'Error initiating file upload.' });
      setStep('upload');
    }
  };

  const handleTextSubmit = async () => {
      if(!inputText) return;
      setStep('processing');
      setProcessingState({ status: 'processing', message: 'AI is analyzing and upgrading your resume...' });
      
      try {
        const data = await processTextResume(inputText, jobDesc);
        setResumeData(data);
        setStep('editor');
      } catch (err) {
        console.error(err);
        setProcessingState({ status: 'error', message: 'Failed to process resume. Please try again.' });
        setStep('upload');
      }
  };

  const loadSample = () => {
    setResumeData(SAMPLE_RESUME);
    setStep('editor');
  };

  const handleExportPdf = async () => {
    const element = document.getElementById('resume-preview-content');
    if (!element || !resumeData) return;

    setIsGeneratingPdf(true);

    try {
        // Capture the element as a canvas
        const canvas = await html2canvas(element, {
            scale: 2, // Higher scale for better resolution
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff'
        });

        const imgData = canvas.toDataURL('image/png');
        
        // A4 Dimensions in mm
        const pdfWidth = 210;
        const pdfHeight = 297; 
        
        // Calculate image dimensions to fit A4 width
        const imgProps = { width: canvas.width, height: canvas.height };
        const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        const doc = new jsPDF('p', 'mm', 'a4');
        
        let heightLeft = imgHeight;
        let position = 0;

        // Add first page
        doc.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;

        // Add subsequent pages if content overflows
        while (heightLeft > 0) {
            position = heightLeft - imgHeight; 
            doc.addPage();
            doc.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
            heightLeft -= pdfHeight;
        }

        doc.save(`${resumeData.fullName.replace(/\s+/g, '_')}_Resume.pdf`);

    } catch (error) {
        console.error("PDF generation failed:", error);
        alert("Failed to generate PDF. Please try again.");
    } finally {
        setIsGeneratingPdf(false);
    }
  };

  const handleDownloadDocx = async () => {
    if (resumeData) {
        try {
            setIsGeneratingDocx(true);
            await generateDocx(resumeData);
        } catch (error) {
            console.error("Failed to generate DOCX:", error);
            alert("Failed to generate DOCX. Please try again.");
        } finally {
            setIsGeneratingDocx(false);
        }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 font-sans print:bg-white print:h-auto print:overflow-visible">
      {/* Header - No print */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between no-print sticky top-0 z-50">
        <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded text-white"><Sparkles size={20}/></div>
            <h1 className="text-xl font-bold text-gray-800">ResumeRevamp <span className="text-blue-600">AI</span></h1>
        </div>
        {step === 'editor' && (
            <div className="flex items-center gap-4">
                <button onClick={() => setStep('upload')} className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1">
                    <ArrowLeft size={16}/> Start Over
                </button>
                <button 
                    onClick={handleDownloadDocx} 
                    disabled={isGeneratingDocx}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isGeneratingDocx ? <Loader2 size={16} className="animate-spin"/> : <Download size={16}/>} 
                    Export DOCX
                </button>
                <button 
                    onClick={handleExportPdf} 
                    disabled={isGeneratingPdf}
                    className="bg-slate-800 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-900 transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isGeneratingPdf ? <Loader2 size={16} className="animate-spin"/> : <Printer size={16}/>} 
                    Export PDF
                </button>
            </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col print:h-auto print:overflow-visible print:block">
        {step === 'upload' && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-4xl mx-auto w-full animate-in fade-in duration-500">
            <div className="text-center mb-10 space-y-4">
                <h2 className="text-5xl font-extrabold text-slate-900 tracking-tight">Transform your resume with AI</h2>
                <p className="text-xl text-slate-500 max-w-2xl mx-auto">Upload your old resume, and our AI will parse, rewrite, and format it into 8 professional 2025-ready templates.</p>
            </div>

            <div className="w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100 grid md:grid-cols-2 gap-8">
                {/* Upload Section */}
                <div className="space-y-6">
                    <div className="border-2 border-dashed border-blue-200 rounded-xl p-8 text-center hover:bg-blue-50 transition-colors cursor-pointer relative group">
                        <input 
                            type="file" 
                            accept=".pdf" 
                            onChange={handleFileUpload} 
                            onClick={(e) => (e.currentTarget.value = '')}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                        />
                        <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600 group-hover:scale-110 transition-transform">
                            <Upload size={28} />
                        </div>
                        <h3 className="font-bold text-lg text-gray-800">Upload PDF Resume</h3>
                        <p className="text-sm text-gray-500 mt-1">Drag & drop or click to browse</p>
                    </div>

                    <div>
                         <label className="block text-sm font-medium text-gray-700 mb-2">Target Job Description (Optional)</label>
                         <textarea 
                            className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            placeholder="Paste the job description here for keyword optimization..."
                            rows={3}
                            value={jobDesc}
                            onChange={(e) => setJobDesc(e.target.value)}
                         />
                    </div>
                </div>
                
                {/* Text/Sample Section */}
                <div className="flex flex-col gap-4">
                     <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Or Paste Text</label>
                        <textarea 
                             className="w-full h-40 border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                             placeholder="Paste your raw resume text here..."
                             value={inputText}
                             onChange={(e) => setInputText(e.target.value)}
                        />
                        <button 
                            onClick={handleTextSubmit}
                            disabled={!inputText}
                            className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Analyze & Revamp
                        </button>
                     </div>
                     <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">or</span>
                        </div>
                     </div>
                     <button onClick={loadSample} className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                        Use Sample Resume
                     </button>
                </div>
            </div>
            
            {processingState.status === 'error' && (
                <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
                    {processingState.message}
                </div>
            )}
          </div>
        )}

        {step === 'processing' && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
             <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 max-w-md w-full">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-6" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">{processingState.status === 'reading' ? 'Reading File...' : 'AI Processing...'}</h3>
                <p className="text-gray-500">{processingState.message}</p>
                <div className="mt-6 w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div className="h-full bg-blue-600 animate-pulse w-2/3 rounded-full"></div>
                </div>
             </div>
          </div>
        )}

        {step === 'editor' && resumeData && (
          <div className="flex flex-1 h-[calc(100vh-64px)] overflow-hidden print:h-auto print:overflow-visible print:block print-container-wrapper">
            {/* Sidebar Editor - No print */}
            <div className="w-96 flex-shrink-0 bg-white border-r border-gray-200 overflow-hidden flex flex-col no-print z-10 shadow-lg sidebar-editor">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <h2 className="font-bold text-gray-700 mb-3 text-sm uppercase tracking-wider">Choose Template</h2>
                    <div className="grid grid-cols-2 gap-2">
                        {Object.values(TemplateType).map((t) => (
                            <button
                                key={t}
                                onClick={() => setSelectedTemplate(t)}
                                className={`p-2 text-xs rounded border text-left transition-all ${selectedTemplate === t ? 'border-blue-600 bg-blue-50 text-blue-700 font-medium ring-1 ring-blue-600' : 'border-gray-200 hover:border-gray-300'}`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex-1 overflow-hidden">
                    <Editor data={resumeData} onChange={setResumeData} />
                </div>
            </div>

            {/* Preview Area */}
            <div className="flex-1 overflow-auto bg-gray-500/10 p-8 flex justify-center items-start print:p-0 print:bg-white print:block print:overflow-visible">
              <div className="transform scale-100 origin-top print:transform-none print:w-full">
                 {/* This wrapper ensures the print style sees the content */}
                 <div id="resume-preview-content" className="print-content shadow-2xl print:shadow-none bg-white">
                    <ResumeRenderer data={resumeData} template={selectedTemplate} />
                 </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 text-center text-sm text-gray-500 no-print">
        <p>All Copyrights reserved @2025. Created By Samar Jeet Jamwal</p>
      </footer>
    </div>
  );
};

export default App;