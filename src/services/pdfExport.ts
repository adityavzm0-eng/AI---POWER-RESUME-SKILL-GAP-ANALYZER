import { jsPDF } from 'jspdf';
import { AnalysisResult } from '../types/skillsync';

export function exportAnalysisToPdf(analysis: AnalysisResult) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  // Header Banner
  doc.setFillColor(11, 15, 25);
  doc.rect(0, 0, pageWidth, 40, 'F');

  doc.setTextColor(6, 182, 212); // Cyan
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('SkillSync AI — Resume Intelligence Report', 14, 20);

  doc.setTextColor(203, 213, 225); // Slate 300
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Target Role: ${analysis.target_role} | Generated: ${new Date().toLocaleDateString()}`, 14, 28);
  doc.text(`Experience Level: ${analysis.experience_level} (~${analysis.resume_metadata.experience_years.toFixed(1)} yrs)`, 14, 34);

  y = 50;

  // Executive Score Card
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(14, y, pageWidth - 28, 26, 3, 3, 'F');

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(`Job Compatibility Fit: ${analysis.scoring.overall_score}% (${analysis.scoring.score_tier})`, 20, y + 10);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  const verdictLines = doc.splitTextToSize(analysis.scoring.verdict, pageWidth - 42);
  doc.text(verdictLines, 20, y + 17);

  y += 36;

  // Skill Summary Metrics
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('1. Skill Match Breakdown', 14, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);

  const matchedNames = analysis.comparison.matched_skills.map(s => s.skill).join(', ') || 'None';
  const missingNames = analysis.comparison.missing_skills.map(s => s.skill).join(', ') || 'None';
  const partialNames = analysis.comparison.partially_matched_skills.map(s => `${s.skill} (via ${s.related_skill_found})`).join(', ') || 'None';

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(16, 185, 129); // Emerald
  doc.text(`[+] Matched Skills (${analysis.comparison.total_matched_count}):`, 14, y);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  const matchedLines = doc.splitTextToSize(matchedNames, pageWidth - 28);
  doc.text(matchedLines, 14, y + 5);
  y += 8 + (matchedLines.length * 4);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(244, 63, 94); // Rose
  doc.text(`[-] Critical Missing Skills (${analysis.comparison.total_missing_count}):`, 14, y);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  const missingLines = doc.splitTextToSize(missingNames, pageWidth - 28);
  doc.text(missingLines, 14, y + 5);
  y += 8 + (missingLines.length * 4);

  if (analysis.comparison.partially_matched_skills.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(217, 119, 6); // Amber
    doc.text(`[~] Partially Matched / Transferable (${analysis.comparison.total_partial_count}):`, 14, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    const partialLines = doc.splitTextToSize(partialNames, pageWidth - 28);
    doc.text(partialLines, 14, y + 5);
    y += 8 + (partialLines.length * 4);
  }

  y += 4;

  // 4-Week Career Growth Roadmap
  if (y > 220) {
    doc.addPage();
    y = 20;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('2. Personalized 4-Week Learning Roadmap', 14, y);
  y += 6;

  analysis.roadmap.timeline.forEach((wk) => {
    if (y > 255) {
      doc.addPage();
      y = 20;
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(37, 99, 235);
    doc.text(`${wk.week}: ${wk.phase}`, 14, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    const focusLines = doc.splitTextToSize(`Focus: ${wk.focus}`, pageWidth - 28);
    doc.text(focusLines, 14, y);
    y += 4 + (focusLines.length * 3.5);

    doc.text(`Deliverable: ${wk.deliverable}`, 14, y);
    y += 6;
  });

  y += 4;

  // Resume Improvement Recommendations
  if (y > 220) {
    doc.addPage();
    y = 20;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('3. ATS Optimization & Google XYZ Bullet Rewrites', 14, y);
  y += 6;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(124, 58, 237);
  doc.text('ATS-Optimized Professional Summary:', 14, y);
  y += 4;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  const summaryLines = doc.splitTextToSize(analysis.improvement_studio.summary_improvement.optimized, pageWidth - 28);
  doc.text(summaryLines, 14, y);
  y += 6 + (summaryLines.length * 3.5);

  analysis.improvement_studio.bullet_point_improvements.slice(0, 2).forEach((bp, idx) => {
    if (y > 255) {
      doc.addPage();
      y = 20;
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`Bullet Revision #${idx + 1}:`, 14, y);
    y += 4;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(`Original: "${bp.original.slice(0, 90)}..."`, 14, y);
    y += 4;

    doc.setTextColor(16, 185, 129);
    const impLines = doc.splitTextToSize(`Enhanced: "${bp.improved}"`, pageWidth - 28);
    doc.text(impLines, 14, y);
    y += 5 + (impLines.length * 3.5);
  });

  // Footer Disclaimer
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('SkillSync AI — Automated Resume Intelligence & Career Growth Platform. Estimated compatibility score does not guarantee employment.', 14, 288);

  const cleanRole = analysis.target_role.replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`SkillSync_Analysis_${cleanRole}.pdf`);
}
