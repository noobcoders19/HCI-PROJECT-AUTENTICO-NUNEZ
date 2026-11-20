"use client";
import { Fragment, useState } from "react";
import Shell from "@/components/Shell";
import { useDB, uid, Student, COURSES, GENDERS } from "@/lib/store";
import ClearableInput from "@/components/ClearableInput";
import ClearableSelect from "@/components/ClearableSelect";

const blank: Student = { id: "", studentNo: "", name: "", email: "", dob: "", gender: "", phone: "", address: "", course: "", year: "" };
const fields: [string, keyof Student, string?][] = [["Full name", "name"], ["Email", "email", "email"], ["Date of birth", "dob", "date"], ["Gender", "gender"], ["Phone", "phone"], ["Address", "address"], ["Course", "course"], ["Year level", "year"], ["Student ID", "studentNo"]];

export default function Students() {
  const [db, up] = useDB();
  const [q, setQ] = useState("");
  const [form, setForm] = useState<Student | null>(null);
  const [view, setView] = useState<Student | null>(null);
  const [del, setDel] = useState<Student | null>(null);
  const list = db.students.filter((s) => (s.name + s.studentNo).toLowerCase().includes(q.toLowerCase()));

  const save = () => {
    if (!form || !form.name.trim() || !form.email.trim()) return alert("Full name and email are required.");
    up((d) => ({ ...d, students: form.id ? d.students.map((s) => (s.id === form.id ? form : s)) : [...d.students, { ...form, id: uid() }] }));
    setForm(null);
  };

  return (
    <Shell role="admin" title="Student List" sub="Manage all registered students.">
      <div className="panel">
        <div className="row" style={{ marginBottom: 12 }}>
          <div style={{ maxWidth: 280, width: "100%" }}><ClearableInput label="student search" placeholder="Search by name or ID" value={q} onChange={setQ} /></div>
          <button onClick={() => setForm(blank)}>Add student</button>
        </div>
        <table><thead><tr><th>ID</th><th>Name</th><th>Course</th><th>Year</th><th></th></tr></thead>
          <tbody>{list.map((s) => (
            <tr key={s.id}><td>{s.studentNo || "-"}</td><td><span className="student-cell"><span className="small-avatar">{s.photo ? <img src={s.photo} alt="" /> : s.name.charAt(0).toUpperCase()}</span>{s.name}</span></td><td>{s.course || "-"}</td><td>{s.year || "-"}</td>
              <td><button className="link" onClick={() => setView(s)}>View</button><button className="link" onClick={() => setForm(s)}>Edit</button><button className="link" onClick={() => setDel(s)}>Delete</button></td></tr>
          ))}</tbody></table>
        {list.length === 0 && <p className="muted">No students found.</p>}
      </div>

      {form && <div className="modal"><div className="panel">
        <h2>{form.id ? "Edit student" : "Add new student"}</h2>
        <div className="grid2">{fields.map(([l, k, t]) => <div className="field" key={k}>
          <label>{l}</label>
          {k === "gender" ? <ClearableSelect label={l} value={form.gender} options={GENDERS} placeholder="Select gender" onChange={(value) => setForm({ ...form, gender: value })} />
            : k === "course" ? <ClearableSelect label={l} value={form.course} options={COURSES} placeholder="Select course" onChange={(value) => setForm({ ...form, course: value })} />
              : <ClearableInput label={l} type={t ?? "text"} value={form[k] ?? ""} onChange={(value) => setForm({ ...form, [k]: value })} />}
        </div>)}</div>
        <div className="actions"><button className="ghost" onClick={() => setForm(null)}>Cancel</button><button onClick={save}>Save student</button></div>
      </div></div>}

      {view && <div className="modal"><div className="panel">
        <div className="profile-heading"><div className="avatar">{view.photo ? <img src={view.photo} alt={`${view.name} profile`} /> : <span>{view.name.charAt(0).toUpperCase()}</span>}</div><h2>{view.name}</h2></div>
        <dl className="detail">{fields.map(([l, k]) => <Fragment key={k}><dt>{l}</dt><dd>{view[k]}</dd></Fragment>)}</dl>
        <h2 style={{ marginTop: 16 }}>Application history</h2>
        <table><tbody>{db.apps.filter((a) => a.studentId === view.id).map((a) => <tr key={a.id}><td>{a.id}</td><td>{a.program}</td><td>{a.status}</td><td>{a.date}</td></tr>)}</tbody></table>
        <div className="actions"><button className="ghost" onClick={() => setView(null)}>Close</button></div>
      </div></div>}

      {del && <div className="modal"><div className="panel" style={{ maxWidth: 400 }}>
        <h2>Confirm deletion</h2>
        <p>Delete <b>{del.name}</b> ({del.studentNo})? This also removes their applications and cannot be undone.</p>
        <div className="actions"><button className="ghost" onClick={() => setDel(null)}>Cancel</button>
          <button className="danger" onClick={() => { up((d) => ({ students: d.students.filter((s) => s.id !== del.id), apps: d.apps.filter((a) => a.studentId !== del.id) })); setDel(null); }}>Delete</button></div>
      </div></div>}
    </Shell>
  );
}
