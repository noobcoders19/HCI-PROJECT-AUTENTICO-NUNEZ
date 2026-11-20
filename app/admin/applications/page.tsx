"use client";
import { useEffect, useState } from "react";
import Shell, { Badge } from "@/components/Shell";
import { useDB, STATUSES, Status, Application, COURSES } from "@/lib/store";

export default function Applications() {
  const [db, up] = useDB();
  const [sel, setSel] = useState<Application | null>(null);
  const [courseFilter, setCourseFilter] = useState("All courses");
  useEffect(() => {
    const requestedCourse = new URLSearchParams(window.location.search).get("course");
    const matchingCourse = COURSES.find((course) => course === requestedCourse);
    if (matchingCourse) setCourseFilter(matchingCourse);
  }, []);
  const name = (id: string) => db.students.find((s) => s.id === id)?.name ?? "Unknown";
  const isPending = (application: Application) => application.status === "Submitted" || application.status === "Under Review";
  const pendingFor = (course: string) => db.apps.filter((application) => application.program === course && isPending(application)).length;
  const applications = db.apps.filter((application) => courseFilter === "All courses" || application.program === courseFilter);
  const setStatus = (id: string, status: Status) => { up((d) => ({ ...d, apps: d.apps.map((a) => (a.id === id ? { ...a, status } : a)) })); setSel((s) => (s && s.id === id ? { ...s, status } : s)); };
  return (
    <Shell role="admin" title="Applications" sub="Review the requirements students submitted and update their status.">
      <div className="panel course-filter-panel">
        <div className="row"><h2>Applications by course</h2><span className="pending-total">{db.apps.filter(isPending).length} pending review</span></div>
        <div className="course-filter-list">
          <button type="button" className={`course-filter ${courseFilter === "All courses" ? "selected" : ""}`} aria-pressed={courseFilter === "All courses"} onClick={() => setCourseFilter("All courses")}>
            All courses <span>{db.apps.length}</span>
          </button>
          {COURSES.map((course) => {
            const count = pendingFor(course);
            return <button type="button" key={course} className={`course-filter ${courseFilter === course ? "selected" : ""}`} aria-pressed={courseFilter === course} onClick={() => setCourseFilter(course)}>
              {course} <span className={count ? "course-pending" : "course-clear"}>{count} pending</span>
            </button>;
          })}
        </div>
      </div>
      <div className="panel">
        <div className="row"><h2>{courseFilter === "All courses" ? "All applications" : `${courseFilter} applications`}</h2></div>
        <table><thead><tr><th>ID</th><th>Student</th><th>Course</th><th>Files</th><th>Status</th><th></th></tr></thead>
          <tbody>{applications.map((a) => <tr key={a.id}><td>{a.id}</td><td>{name(a.studentId)}</td><td>{a.program}</td><td>{a.files.length}</td><td><Badge s={a.status} /></td><td><button className="link" onClick={() => setSel(a)}>Review</button></td></tr>)}</tbody></table>
        {applications.length === 0 && <p className="empty-state">{courseFilter === "All courses" ? "No applications have been submitted in this browser yet." : `No ${courseFilter} applications yet.`}</p>}
      </div>
      {sel && <div className="modal"><div className="panel">
        <h2>{sel.id}: {name(sel.studentId)}</h2>
        <p className="muted">{sel.program}, submitted {sel.date}</p>
        <div className="field"><label>Status</label><select value={sel.status} onChange={(e) => setStatus(sel.id, e.target.value as Status)}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select></div>
        <div className="review-actions">
          <button onClick={() => setStatus(sel.id, "Approved")}>Approve application</button>
          <button className="danger" onClick={() => setStatus(sel.id, "Rejected")}>Reject application</button>
          <button className="ghost" onClick={() => setStatus(sel.id, "Under Review")}>Mark under review</button>
        </div>
        <label>Submitted requirements</label>
        <div className="thumbs">{sel.files.length === 0 && <span className="muted">No files attached.</span>}
          {sel.files.map((f, i) => f.data.startsWith("data:image") ? <a key={i} href={f.data} target="_blank" rel="noreferrer"><img src={f.data} alt={f.name} /></a> : <a key={i} className="badge" href={f.data} download={f.name}>{f.name}</a>)}</div>
        <div className="actions"><button onClick={() => setSel(null)}>Done</button></div>
      </div></div>}
    </Shell>
  );
}
