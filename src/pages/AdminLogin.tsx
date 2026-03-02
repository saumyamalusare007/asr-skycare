import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Mail, AlertCircle, UserPlus, LogIn, Eye, EyeOff } from "lucide-react";
import logo from "@/assets/logo-asr.png";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const verifyAdminAndNavigate = async (userId: string) => {
    const { data: roleData, error: roleError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();

    if (roleError || !roleData) {
      setError("Access denied. You are not authorized as an administrator.");
      await supabase.auth.signOut();
      return false;
    }

    navigate("/internal-admin");
    return true;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (isSignUp) {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      // Auto-confirm is enabled for new signups; try immediate sign-in.
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError || !loginData.user) {
        const loginMessage = loginError?.message?.toLowerCase() ?? "";

        if (loginMessage.includes("email not confirmed")) {
          await supabase.auth.resend({ type: "signup", email });
          setError("This email is still unconfirmed. We sent a new confirmation email. For instant access now, sign up with a new email.");
        } else {
          setError(loginError?.message || "Unable to sign in right now. Please try again.");
        }

        setLoading(false);
        return;
      }

      await verifyAdminAndNavigate(loginData.user.id);
      setLoading(false);
      return;
    }

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !data.user) {
      const authMessage = authError?.message?.toLowerCase() ?? "";

      if (authMessage.includes("email not confirmed")) {
        await supabase.auth.resend({ type: "signup", email });
        setError("Email not confirmed. We sent a fresh confirmation email. If you need instant access, create a new account from Sign Up.");
      } else {
        setError(authError?.message || "Invalid credentials.");
      }

      setLoading(false);
      return;
    }

    await verifyAdminAndNavigate(data.user.id);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <img src={logo} alt="ASR Aviation" className="h-14 mx-auto mb-6 brightness-0 invert" />
          <h1 className="font-display text-2xl font-bold text-white mb-2">
            Admin Portal
          </h1>
          <p className="text-white/60 text-sm">
            {isSignUp ? "Create a new admin account" : "Authorized personnel only"}
          </p>
        </div>

        <form onSubmit={handleLogin} className="bg-card rounded-2xl p-8 shadow-xl space-y-6">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-success/10 text-success text-sm">
              {success}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="admin@asraviation.com"
                className="pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pl-10 pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" variant="aviation" className="w-full" disabled={loading}>
            {loading ? (
              isSignUp ? "Creating account..." : "Signing in..."
            ) : (
              <span className="flex items-center gap-2">
                {isSignUp ? <UserPlus className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
                {isSignUp ? "Create Account" : "Sign In"}
              </span>
            )}
          </Button>

          <button
            type="button"
            onClick={() => { setIsSignUp(!isSignUp); setError(""); setSuccess(""); }}
            className="w-full text-sm text-center text-muted-foreground hover:text-foreground transition-colors"
          >
            {isSignUp ? "Already have an account? Sign In" : "Need an account? Sign Up"}
          </button>

          <p className="text-xs text-center text-muted-foreground">
            Contact your system administrator for access credentials.
          </p>
        </form>
      </motion.div>
    </div>
  );
}
