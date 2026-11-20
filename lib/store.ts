"use client";
import { useEffect, useState } from "react";

export type Status = "Submitted" | "Under Review" | "Approved" | "Rejected";
export type Student = { id: string; studentNo: string; name: string; email: string; dob: string; gender: string; phone: string; address: string; course: string; year: string; photo?: string };
export type FileItem = { name: string; data: string };
export type Application = { id: string; studentId: string; program: string; status: Status; date: string; files: FileItem[] };
export type DB = { students: Student[]; apps: Application[] };

export const CURRENT_STUDENT = "local-student";
export const EMPTY_STUDENT: Student = {
  id: CURRENT_STUDENT,
  studentNo: "",
  name: "",
  email: "",
  dob: "",
  gender: "",
  phone: "",
  address: "",
  course: "",
  year: "",
};
export const STATUSES: Status[] = ["Submitted", "Under Review", "Approved", "Rejected"];
export const COURSES = ["BSIT", "BSHM", "BEED", "BSED"] as const;
export const GENDERS = ["Male", "Female"] as const;
export const uid = () => Math.random().toString(36).slice(2, 9);

const EMPTY_DB: DB = { students: [], apps: [] };
const KEY = "student-portal-db-v2";

export function useDB(): [DB, (fn: (d: DB) => DB) => void, boolean] {
  const [db, setState] = useState<DB>(EMPTY_DB);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState(JSON.parse(raw) as DB);
    } catch (error) {
      console.error("Could not load saved student portal data.", error);
      alert("Saved data could not be loaded from this browser.");
    } finally {
      setLoaded(true);
    }
  }, []);
  const update = (fn: (d: DB) => DB) => {
    setState((prev) => {
      const next = fn(prev);
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch (error) {
        console.error("Could not save student portal data.", error);
        alert("Your changes could not be saved. Browser storage may be full; try removing large files.");
      }
      return next;
    });
  };
  return [db, update, loaded];
}
