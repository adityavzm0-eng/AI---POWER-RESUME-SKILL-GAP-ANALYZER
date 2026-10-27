import { AnalysisResult, HistoryRecord, SamplePreset } from '../types/skillsync';

const BASE_URL = '/api';

export async function analyzeResumeApi(formData: FormData): Promise<AnalysisResult> {
  const res = await fetch(`${BASE_URL}/analyze-resume`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: 'Analysis failed' }));
    throw new Error(errorData.detail || 'Analysis request failed.');
  }
  return res.json();
}

export async function extractSkillsApi(text: string) {
  const res = await fetch(`${BASE_URL}/extract-skills`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error('Skill extraction failed.');
  return res.json();
}

export async function analyzeJobDescriptionApi(job_description: string, role_title = 'Target Role') {
  const res = await fetch(`${BASE_URL}/analyze-job-description`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ job_description, role_title }),
  });
  if (!res.ok) throw new Error('Job description parsing failed.');
  return res.json();
}

export async function compareSkillsApi(payload: any) {
  const res = await fetch(`${BASE_URL}/compare-skills`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Skill comparison failed.');
  return res.json();
}

export async function compareMultipleJobsApi(payload: {
  resume_text: string;
  target_role: string;
  jobs: Array<{ title: string; description: string }>;
}) {
  const res = await fetch(`${BASE_URL}/compare-jobs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Multiple job comparison failed.');
  return res.json();
}

export async function compareBeforeAfterApi(payload: {
  original_resume_text: string;
  updated_resume_text: string;
  job_description: string;
  target_role: string;
}) {
  const res = await fetch(`${BASE_URL}/before-after`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Before/after simulation failed.');
  return res.json();
}

export async function getHistoryApi(): Promise<HistoryRecord[]> {
  const res = await fetch(`${BASE_URL}/history`);
  if (!res.ok) throw new Error('Failed to load history.');
  return res.json();
}

export async function getHistoryByIdApi(id: string): Promise<AnalysisResult> {
  const res = await fetch(`${BASE_URL}/history/${id}`);
  if (!res.ok) throw new Error('Failed to load analysis record.');
  return res.json();
}

export async function deleteHistoryApi(id: string) {
  const res = await fetch(`${BASE_URL}/history/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete history record.');
  return res.json();
}

export async function clearAllHistoryApi() {
  const res = await fetch(`${BASE_URL}/history`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to clear history.');
  return res.json();
}

export async function getSettingsApi() {
  const res = await fetch(`${BASE_URL}/settings`);
  if (!res.ok) throw new Error('Failed to load settings.');
  return res.json();
}

export async function getSampleDataApi(): Promise<SamplePreset[]> {
  const res = await fetch(`${BASE_URL}/sample-data`);
  if (!res.ok) throw new Error('Failed to load sample presets.');
  return res.json();
}
