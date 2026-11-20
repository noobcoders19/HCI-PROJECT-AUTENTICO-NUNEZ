"use client";
import { useState } from "react";
import Shell, { Badge } from "@/components/Shell";
import Link from "next/link";
import { useDB, CURRENT_STUDENT, uid, FileItem, COURSES } from "@/lib/store";
import { compressImage, MAX_IMAGE_UPLOAD_SIZE, MAX_PDF_UPLOAD_SIZE } from "@/lib/files";
import ClearableSelect from "@/components/ClearableSelect";

const toData = async (file: File): Promise<FileItem> => {
  if (file.type.startsWith("image/")) {
    if (file.size > MAX_IMAGE_UPLOAD_SIZE) throw new Error(`${file.name} is too large to upload.`);
    return { name: file.name, data: await compressImage(file) };
  }
  if (file.type !== "application/pdf") throw new Error(`${file.name} is not a supported image or PDF.`);
  if (file.size > MAX_PDF_UPLOAD_SIZE) throw new Error(`${file.name} is too large to upload.`);
  const data = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error(`Could not read ${file.name}.`));
    reader.readAsDataURL(file);
  });
  return { name: file.name, data };
};

export default function MyApplications() {
  const [db, up, loaded] = useDB();
  const [open, setOpen] = useState(false);
  const [program, setProgram] = useState("");
  const [files, setFiles] = useState<FileItem[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [profileNotice, setProfileNotice] = useState("");
  const student = db.students.find((s) => s.id === CURRENT_STUDENT);
  const profileReady = loaded && Boolean(student?.name.trim() && student.email.trim());
  const mine = db.apps.filter((a) => a.studentId === CURRENT_STUDENT);

  const start = (id: string | null) => {
    const a = mine.find((x) => x.id === id);
    setEditId(id); setProgram(a?.program ?? ""); setFiles(a?.files ?? []); setError(""); setProfileNotice(""); setOpen(true);
  };
  const startNewApplication = () => {
    if (!profileReady) {
      setProfileNotice("Create your profile first. Add your name and email before starting an application.");
      return;
    }
    start(null);
  };
  const save = () => {
    if (!profileReady) {
      setError("Complete your name and email in your profile before submitting.");
      return;
    }
    if (!program.trim()) {
      setError("Enter the program or course you are applying for.");
      return;
    }
    if (editId) up((d) => ({ ...d, apps: d.apps.map((a) => (a.id === editId ? { ...a, program, files } : a)) }));
    else up((d) => ({ ...d, apps: [...d.apps, { id: "APP-" + uid().toUpperCase().slice(0, 4), studentId: CURRENT_STUDENT, program, status: "Submitted", date: new Date().toISOString().slice(0, 10), files }] }));
    setOpen(false);
  };

  return (
    <Shell role="student" title="My Applications" sub="Submit requirements such as grades and photos, then track the status.">
      <div className="panel">
        <div className="row"><h2>Your applications</h2><button onClick={startNewApplication} disabled={!loaded} title={!loaded ? "Loading student information" : !profileReady ? "Click to create your profile first" : "Start a new application"}>New application</button></div>
        {!profileReady && profileNotice && (
          <div className="profile-warning" role="alert">
            <span className="warning-mark" aria-hidden="true">!</span>
            <div>
              <strong>Profile required before applying</strong>
              <p>{profileNotice} <Link href="/student/profile">Go to Profile</Link></p>
            </div>
          </div>
        )}
        <table><thead><tr><th>ID</th><th>Program</th><th>Files</th><th>Date</th><th>Status</th><th></th></tr></thead>
          <tbody>{mine.map((a) => (
            <tr key={a.id}><td>{a.id}</td><td>{a.program}</td><td>{a.files.length}</td><td>{a.date}</td><td><Badge s={a.status} /></td>
              <td>{a.status === "Submitted" && <><button className="link" onClick={() => start(a.id)}>Edit</button>
                <button className="link" onClick={() => confirm("Delete this application?") && up((d) => ({ ...d, apps: d.apps.filter((x) => x.id !== a.id) }))}>Delete</button></>}</td></tr>
          ))}</tbody></table>
      </div>
      {open && (
        <div className="modal"><div className="panel">
          <h2>{editId ? "Edit application" : "New application"}</h2>
          <div className="field"><label>Course</label><ClearableSelect label="course" value={program} options={COURSES} placeholder="Select course" onChange={setProgram} /></div>
          <div className="field"><label>Requirements (images or PDF)</label>
            <input type="file" multiple accept="image/*,application/pdf" onChange={async (e) => {
              const added: FileItem[] = [];
              const errors: string[] = [];
              for (const file of Array.from(e.target.files ?? [])) {
                try {
                  added.push(await toData(file));
                } catch (reason) {
                  errors.push(reason instanceof Error ? reason.message : `${file.name} could not be read.`);
                }
              }
              if (added.length) setFiles((current) => [...current, ...added]);
              setError(errors.length ? `Some files were not added:\n${errors.join("\n")}` : "");
              e.target.value = "";
            }} />
            <div className="thumbs">{files.map((f, i) => <div className="file-preview" key={`${f.name}-${i}`}>
              {f.data.startsWith("data:image") ? <img src={f.data} alt={f.name} /> : <span className="badge">{f.name}</span>}
              <button type="button" className="link" onClick={() => setFiles((current) => current.filter((_, index) => index !== i))}>Remove</button>
            </div>)}</div>
          </div>
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="actions"><button className="ghost" onClick={() => setOpen(false)}>Cancel</button><button onClick={save}>{editId ? "Save changes" : "Submit application"}</button></div>
        </div></div>
      )}
    </Shell>
  );
}
