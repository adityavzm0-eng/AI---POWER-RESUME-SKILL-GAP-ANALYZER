export interface SkillItem {
  name: string;
  category: string;
  raw_terms: string[];
  count: number;
  evidence: string[];
  sections: string[];
}

export interface MatchedSkill {
  skill: string;
  category: string;
  status: 'matched';
  tier: 'required' | 'preferred';
  priority: 'High' | 'Medium';
  resume_evidence: string[];
  jd_evidence: string[];
  match_confidence: number;
  transferable_note?: string | null;
}

export interface MissingSkill {
  skill: string;
  category: string;
  status: 'missing';
  tier: 'required' | 'preferred';
  priority: 'High' | 'Medium';
  resume_evidence: string[];
  jd_evidence: string[];
  match_confidence: number;
  why_it_matters?: string;
}

export interface PartiallyMatchedSkill {
  skill: string;
  category: string;
  status: 'partially_matched';
  tier: 'required' | 'preferred';
  priority: 'Medium' | 'Low';
  resume_evidence: string[];
  related_skill_found: string;
  transferable_note: string;
  match_confidence: number;
}

export interface AdditionalSkill {
  skill: string;
  category: string;
  status: 'additional';
  resume_evidence: string[];
  value_add: string;
}

export interface SkillGapMatrixRow {
  skill: string;
  category: string;
  job_requirement: string;
  resume_evidence: string;
  status: 'Matched' | 'Partially Matched' | 'Missing';
  priority: 'High' | 'Medium' | 'Low' | 'Satisfied';
}

export interface ScoreBreakdown {
  required_skills_coverage: number;
  preferred_skills_coverage: number;
  semantic_similarity: number;
  project_evidence: number;
  experience_alignment: number;
}

export interface ScoringData {
  overall_score: number;
  score_tier: string;
  verdict: string;
  disclaimer: string;
  breakdown: ScoreBreakdown;
  weights_applied: Record<string, number>;
  strengths: string[];
  improvement_priorities: string[];
}

export interface RoadmapSkillItem {
  skill: string;
  category: string;
  why_it_matters: string;
  resume_status: string;
  topics: string[];
  mini_project: string;
  estimated_hours: string;
  outcome: string;
}

export interface RoadmapWeek {
  week: string;
  phase: string;
  focus: string;
  milestones: string[];
  deliverable: string;
}

export interface PersonalizedRoadmap {
  role_title: string;
  experience_level: string;
  essential_skills: RoadmapSkillItem[];
  practical_skills: RoadmapSkillItem[];
  advanced_skills: RoadmapSkillItem[];
  timeline: RoadmapWeek[];
  total_estimated_weeks: number;
  total_estimated_hours: string;
}

export interface ATSCheck {
  criterion: string;
  passed: boolean;
  detail: string;
}

export interface BulletImprovement {
  id: number;
  original: string;
  improved: string;
  rationale: string;
}

export interface ImprovementStudioData {
  ats_audit: {
    ats_score: number;
    checks: ATSCheck[];
    total_passed: number;
    total_checks: number;
  };
  missing_keywords: Array<{
    keyword: string;
    category: string;
    importance: string;
    usage_tip: string;
  }>;
  summary_improvement: {
    original: string;
    optimized: string;
    key_changes: string[];
  };
  bullet_point_improvements: BulletImprovement[];
}

export interface ProjectRecommendation {
  title: string;
  primary_skill: string;
  tech_stack: string[];
  overview: string;
  architecture_steps: string[];
  resume_bullet_sample: string;
}

export interface InterviewQuestion {
  skill: string;
  category: string;
  theory_question: string;
  model_answer: string;
  coding_challenge: string;
  behavioral_project_question: string;
}

export interface AnalysisResult {
  id?: string | null;
  target_role: string;
  experience_level: string;
  resume_metadata: {
    sections: Record<string, string>;
    contact_info: {
      email?: string | null;
      phone?: string | null;
      linkedin?: string | null;
      github?: string | null;
      portfolio?: string | null;
    };
    education_level: string;
    experience_years: number;
    pdf_info?: {
      filename?: string;
      page_count?: number;
      char_count?: number;
      word_count?: number;
      is_scanned?: boolean;
      warning?: string | null;
    };
  };
  resume_skills: SkillItem[];
  jd_analysis: {
    role_title: string;
    required_skills: Array<{ name: string; category: string; tier: string; count: number; evidence: string[] }>;
    preferred_skills: Array<{ name: string; category: string; tier: string; count: number; evidence: string[] }>;
    all_extracted_skills: SkillItem[];
    categorized_skills: Record<string, string[]>;
    min_experience_years: number;
    education_requirement: string;
    responsibilities: string[];
  };
  comparison: {
    matched_skills: MatchedSkill[];
    missing_skills: MissingSkill[];
    partially_matched_skills: PartiallyMatchedSkill[];
    additional_skills: AdditionalSkill[];
    skill_gap_matrix: SkillGapMatrixRow[];
    semantic_similarity: number;
    total_required_jd_skills: number;
    total_preferred_jd_skills: number;
    total_matched_count: number;
    total_missing_count: number;
    total_partial_count: number;
    total_additional_count: number;
  };
  scoring: ScoringData;
  roadmap: PersonalizedRoadmap;
  improvement_studio: ImprovementStudioData;
  project_recommendations: ProjectRecommendation[];
  interview_prep: InterviewQuestion[];
  llm_insights?: {
    ai_generated: boolean;
    provider: string;
    executive_advice: string;
  };
}

export interface SamplePreset {
  id: string;
  title: string;
  category: string;
  role_title: string;
  experience_level: string;
  resume_text: string;
  job_description: string;
}

export interface HistoryRecord {
  id: string;
  created_at: string;
  target_role: string;
  experience_level: string;
  overall_score: number;
  score_tier: string;
  matched_count: number;
  missing_count: number;
  partial_count: number;
  improvement_priorities: string[];
}
