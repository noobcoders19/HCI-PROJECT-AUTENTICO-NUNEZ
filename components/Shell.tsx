"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { CURRENT_STUDENT, useDB } from "@/lib/store";

const NAV = {
  student: [["/student", "Dashboard"], ["/student/applications", "My Applications"], ["/student/profile", "Profile"]],
  admin: [["/admin", "Dashboard"], ["/admin/students", "Manage Students"], ["/admin/applications", "Applications"]],
};

export default function Shell({ role, title, sub, children }: { role: "student" | "admin"; title: string; sub?: string; children: ReactNode }) {
  const path = usePathname();
  const [db] = useDB();
  const student = db.students.find((s) => s.id === CURRENT_STUDENT);
  const userName = role === "admin" ? "Administrator" : student?.name || "Student";
  return (
    <div className="shell">
      <aside>
        <div className="brand">
          <img src="/images/cpc.jpg" alt="Cordova Public College logo" />
          <span><strong>Student Online Application System</strong><small>{role === "admin" ? "Admin Portal" : "Student Portal"}</small></span>
        </div>
        <nav>
          {NAV[role].map(([href, label]) => (
            <Link key={href} href={href} className={path === href ? "on" : ""}>{label}</Link>
          ))}
        </nav>
        <Link href="/" className="logout">Logout</Link>
      </aside>
      <main>
        <header><span className="header-user">{student?.photo && role === "student" ? <img src={student.photo} alt="" /> : <span className="header-avatar">{userName.charAt(0).toUpperCase()}</span>}{userName}<small>{role === "admin" ? "Administrator" : "Student"}</small></span></header>
        <div className="content">
          <h1>{title}</h1>
          {sub && <p className="muted">{sub}</p>}
          {children}
        </div>
      </main>
    </div>
  );
}

export function Badge({ s }: { s: string }) {
  return <span className={"badge " + s.replace(" ", "")}>{s}</span>;
}
