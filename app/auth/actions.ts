"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { loginFormSchema, signUpFormSchema } from "./formSchema";
import { z } from "zod";
import { registerForEvent } from "@/components/specific/event-list/actions";
import { cookies } from "next/headers";
import { getSupabase } from "@/lib/supabase/server";

export const handleSignUp = async (
  d: z.infer<typeof signUpFormSchema>,
  toRegister?: string | null
) => {
  const { email, password } = signUpFormSchema.parse(d);
  const supabase = getSupabase();
  const { error, data } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) return { message: error.message, status: error.status };
  revalidatePath("/", "layout");
  if (toRegister) {
    registerForEvent(toRegister);
    redirect("/events");
  }
  redirect("/");
};

export const handleLogin = async (
  d: z.infer<typeof loginFormSchema>,
  toRegister?: string | null
) => {
  const { email, password } = loginFormSchema.parse(d);
  const supabase = getSupabase();
  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) return { message: error.message, status: error.status };
  revalidatePath("/", "layout");
  if (toRegister) {
    registerForEvent(toRegister);
    redirect("/events");
  }
  redirect("/");
};
