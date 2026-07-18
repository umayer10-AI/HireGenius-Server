export declare const resumePrompt: (input: {
    name: string;
    education: string;
    experience: string;
    projects: string;
    skills: string[];
    achievements: string;
    targetJob: string;
    preferredCountry: string;
    preferredIndustry: string;
    version: string;
}) => string;
export declare const coverLetterPrompt: (input: {
    jobTitle: string;
    companyName: string;
    resume: string;
    skills: string[];
    experience: string;
    tone: string;
}) => string;
export declare const careerChatPrompt: (context: {
    userName: string;
    role: string;
    skills: string[];
    location?: string;
    resume?: string;
    savedJobsCount: number;
    appliedJobsCount: number;
}) => string;
export declare const recommendationPrompt: (input: {
    skills: string[];
    experience?: string;
    location?: string;
    education: string;
    jobs: Array<{
        id: string;
        title: string;
        company: string;
        skills: string[];
        location: string;
        salary: string;
    }>;
}) => string;
export declare const skillGapPrompt: (input: {
    currentSkills: string[];
    requirements: string[];
    targetRole: string;
}) => string;
export declare const interviewPrepPrompt: (input: {
    jobTitle: string;
    difficulty: string;
    category: string;
}) => string;
export declare const jobDescriptionPrompt: (input: {
    jobTitle: string;
    category: string;
    skills: string[];
    experience: string;
    responsibilities: string;
    benefits: string;
}) => string;
export declare const candidateMatchPrompt: (input: {
    jobTitle: string;
    jobSkills: string[];
    requirements: string[];
    candidate: {
        name: string;
        skills: string[];
        experience: string;
        education: string;
        resume?: string;
    };
}) => string;
//# sourceMappingURL=index.d.ts.map