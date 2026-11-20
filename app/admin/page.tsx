"use client";
import Link from "next/link";
import Shell, { Badge } from "@/components/Shell";
import { useDB, COURSES } from "@/lib/store";

export default function AdminDashboard() {
  const [db] = useDB();
  const n = (s: string) => db.apps.filter((a) => a.status === s).length;
  const name = (id: string) => db.students.find((s) => s.id === id)?.name ?? "Unknown";
  const pendingFor = (course: string) => db.apps.filter((a) => a.program === course && (a.status === "Submitted" || a.status === "Under Review")).length;
  return (
    <Shell role="admin" title="Admin Dashboard" sub="Manage applications, students, and system settings.">
      <p className="notice notice-panel">This prototype stores records only in this browser. Students using another device will not appear here.</p>
      <div className="cards">
        <div className="card"><b>{db.students.length}</b><span>Total Students</span></div>
        <div className="card"><b>{db.apps.length}</b><span>Total Applications</span></div>
        <div className="card"><b>{n("Submitted") + n("Under Review")}</b><span>Pending Review</span></div>
        <div className="card"><b>{n("Approved")}</b><span>Approved</span></div>
      </div>
      <div className="panel course-summary-panel">
        <div className="row"><h2>Pending by course</h2><Link href="/admin/applications">Review applications</Link></div>
        <div className="course-summary-grid">
          {COURSES.map((course) => {
            const count = pendingFor(course);
            return <Link key={course} className="course-summary" href={`/admin/applications?course=${course}`}>
              <strong>{course}</strong><span className={count ? "course-pending" : "course-clear"}>{count} pending</span>
            </Link>;
          })}
        </div>
      </div>
      <div className="panel">
        <div className="row"><h2>Recent Applications</h2><Link href="/admin/applications">View all</Link></div>
        <table><thead><tr><th>ID</th><th>Name</th><th>Program</th><th>Status</th><th>Date</th></tr></thead>
          <tbody>{[...db.apps].reverse().slice(0, 5).map((a) => <tr key={a.id}><td>{a.id}</td><td>{name(a.studentId)}</td><td>{a.program}</td><td><Badge s={a.status} /></td><td>{a.date}</td></tr>)}</tbody></table>
        {db.apps.length === 0 && <p className="empty-state">New student applications submitted in this browser will appear here.</p>}
      </div>
    </Shell>
  );
}
