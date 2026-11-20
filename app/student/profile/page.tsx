"use client";
import { Fragment, useState } from "react";
import Shell from "@/components/Shell";
import { useDB, CURRENT_STUDENT, EMPTY_STUDENT, Student, COURSES, GENDERS } from "@/lib/store";
import { compressImage, MAX_IMAGE_UPLOAD_SIZE } from "@/lib/files";
import ClearableInput from "@/components/ClearableInput";
import ClearableSelect from "@/components/ClearableSelect";

export default function Profile() {
  const [db, up] = useDB();
  const me = db.students.find((s) => s.id === CURRENT_STUDENT) ?? EMPTY_STUDENT;
  const [edit, setEdit] = useState(false);
  const [f, setF] = useState<Student>(me);
  const [error, setError] = useState("");
  const rows: [string, keyof Student][] = [["Full name", "name"], ["Email", "email"], ["Date of birth", "dob"], ["Gender", "gender"], ["Phone", "phone"], ["Address", "address"], ["Course", "course"], ["Year level", "year"]];
  const save = () => {
    if (!f.name.trim() || !f.email.trim()) {
      setError("Enter your full name and email address to save your profile.");
      return;
    }
    up((d) => ({
      ...d,
      students: d.students.some((s) => s.id === CURRENT_STUDENT)
        ? d.students.map((s) => (s.id === CURRENT_STUDENT ? f : s))
        : [...d.students, f],
    }));
    setError("");
    setEdit(false);
  };
  const choosePhoto = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Choose an image file for your profile photo.");
      return;
    }
    if (file.size > MAX_IMAGE_UPLOAD_SIZE) {
      setError("Choose a smaller profile photo.");
      return;
    }
    try {
      const photo = await compressImage(file, 512);
      setF((current) => ({ ...current, photo }));
      setError("");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "The profile photo could not be read. Please try another image.");
    }
  };
  return (
    <Shell role="student" title="Student Profile" sub="View and manage your personal information.">
      <div className="panel">
        <div className="profile-heading">
          <div className="avatar">{me.photo ? <img src={me.photo} alt="Student profile" /> : <span>{me.name ? me.name.charAt(0).toUpperCase() : "?"}</span>}</div>
          <div className="profile-title"><h2>{me.name || "Your profile"}{me.studentNo ? ` (${me.studentNo})` : ""}</h2><p className="muted">{me.email || "Add your information to get started."}</p></div>
          {edit ? <span className="profile-actions">
            <button className="ghost" onClick={() => { setF(me); setError(""); setEdit(false); }}>Cancel</button>
            <button onClick={save}>Save changes</button>
          </span> : <button className="ghost" onClick={() => { setF(me); setError(""); setEdit(true); }}>{me.name ? "Edit profile" : "Create profile"}</button>}
        </div>
        {error && <p className="form-error" role="alert">{error}</p>}
        {edit ? <>
          <div className="field photo-field"><label htmlFor="profile-photo">Profile photo</label><input id="profile-photo" type="file" accept="image/*" onChange={(e) => choosePhoto(e.target.files?.[0])} />
            {f.photo && <button className="link" onClick={() => setF({ ...f, photo: undefined })}>Remove photo</button>}</div>
          <div className="grid2">{rows.map(([l, k]) => <div className="field" key={k}>
            <label>{l}</label>
            {k === "gender" ? <ClearableSelect label={l} value={f.gender} options={GENDERS} placeholder="Select gender" onChange={(value) => setF({ ...f, gender: value })} />
              : k === "course" ? <ClearableSelect label={l} value={f.course} options={COURSES} placeholder="Select course" onChange={(value) => setF({ ...f, course: value })} />
                : <ClearableInput label={l} type={k === "dob" ? "date" : k === "email" ? "email" : "text"} value={f[k] ?? ""} onChange={(value) => setF({ ...f, [k]: value })} />}
          </div>)}
            <div className="field"><label>Student ID (optional)</label><ClearableInput label="Student ID" value={f.studentNo} onChange={(value) => setF({ ...f, studentNo: value })} /></div>
          </div>
        </> : <dl className="detail">{rows.map(([l, k]) => <Fragment key={k}><dt>{l}</dt><dd>{me[k] || "Not provided"}</dd></Fragment>)}</dl>}
      </div>
    </Shell>
  );
}
