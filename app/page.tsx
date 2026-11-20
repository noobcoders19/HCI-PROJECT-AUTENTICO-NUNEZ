"use client";
import { useRouter } from "next/navigation";

export default function Login() {
  const r = useRouter();
  return (
    <div className="login">
      <div className="left">
        <div className="logo"><img src="/images/cpc.jpg" alt="Cordova Public College logo" /></div>
        <h1>Student Online Application System</h1>
        <p className="muted">Submit your requirements and track your application online.</p>
      </div>
      <div className="right">
        <div className="box">
          <h2>Welcome</h2>
          <p className="muted">Select a portal to continue.</p>
          <button className="role-button" onClick={() => r.push("/student")}>Continue to Student Portal</button>
          <button className="role-button ghost" onClick={() => r.push("/admin")}>Continue to Administrator Portal</button>
        </div>
      </div>
    </div>
  );
}
