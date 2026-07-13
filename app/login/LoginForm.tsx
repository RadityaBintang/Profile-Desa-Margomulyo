"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Lock, User } from "lucide-react";
import { loginAdmin, type LoginState } from "./actions";

const initialState: LoginState = { error: null };

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className="login-submit-button" disabled={pending}>
      {pending ? "Memproses..." : "Masuk"}
    </button>
  );
}

export function LoginForm({ redirectTo }: { redirectTo: string }) {
  const [state, formAction] = useActionState(loginAdmin, initialState);

  return (
    <form action={formAction} className="login-form">
      <input type="hidden" name="redirectTo" value={redirectTo} />

      {state.error && <p className="login-error">{state.error}</p>}

      <div className="activity-input-group">
        <label htmlFor="username">Username</label>
        <div className="login-input-wrapper">
          <User size={18} className="login-input-icon" />
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Masukkan username"
            autoComplete="username"
            required
          />
        </div>
      </div>

      <div className="activity-input-group">
        <label htmlFor="password">Password</label>
        <div className="login-input-wrapper">
          <Lock size={18} className="login-input-icon" />
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Masukkan password"
            autoComplete="current-password"
            required
          />
        </div>
      </div>

      <SubmitButton />
    </form>
  );
}
