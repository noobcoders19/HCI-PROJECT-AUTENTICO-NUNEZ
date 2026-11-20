"use client";
import Link from "next/link";
import Shell, { Badge } from "@/components/Shell";
import { useDB, CURRENT_STUDENT } from "@/lib/store";

export default function StudentDashboard() {
  const [db] = useDB();
  const student = db.students.find((s) => s.id === CURRENT_STUDENT);
  const mine = db.apps.filter((a) => a.studentId === CURRENT_STUDENT);
  const count = (s: string) => mine.filter((a) => a.status === s).length;
  return (
    <Shell role="student" title={student?.name ? `Hello, ${student.name}!` : "Student dashboard"} sub="View your applications and track their status.">
      {!student?.name && <div className="notice notice-panel">Start by adding your information in <Link href="/student/profile">your profile</Link>. An administrator can review applications submitted in this browser.</div>}
      <div className="cards">
        <div className="card"><b>{count("Submitted")}</b><span>Submitted</span></div>
        <div className="card"><b>{count("Under Review")}</b><span>Under Review</span></div>
        <div className="card"><b>{count("Approved")}</b><span>Approved</span></div>
        <div className="card"><b>{count("Rejected")}</b><span>Rejected</span></div>
      </div>
      <div className="panel">
        <div className="row"><h2>Recent Applications</h2><Link href="/student/applications">View all</Link></div>
        <table><thead><tr><th>ID</th><th>Program</th><th>Date</th><th>Status</th></tr></thead>
          <tbody>{mine.map((a) => <tr key={a.id}><td>{a.id}</td><td>{a.program}</td><td>{a.date}</td><td><Badge s={a.status} /></td></tr>)}</tbody></table>
        {mine.length === 0 && <p className="muted">No applications yet. Submit your first one under My Applications.</p>}
      </div>
    </Shell>
  );
}
