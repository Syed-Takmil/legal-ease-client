

"use client";

import React, {  useState } from "react";
import { Eye, EyeClosed } from "@gravity-ui/icons";
import Image from "next/image";
import Link from "next/link";
import { authClient } from "../lib/auth-client";

export default function Login() {
    const signIn = async () => {
    const selectedRoleElement = document.querySelector('input[name="role"]:checked');
    const selectedRole = selectedRoleElement ? selectedRoleElement.value : 'user';

    await authClient.signIn.social({
      provider: "google",
      callbackURL: `/dashboard/${selectedRole}`,
    });
  };

  const [isShowPassword, setIsShowPassword] = useState(false);
  const [loading, setLoading] =useState(false);
  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const formdata=new FormData(e.currentTarget);
    const user=Object.fromEntries(formdata)
  const { data, error } = await authClient.signIn.email({
    email: user.email, // required
    password: user.password, // required
    rememberMe: true,
    callbackURL: "/",
});
    }


  return (
    <div className="flex flex-col dark:bg-black md:flex-row-reverse gap-5 items-center justify-items-center justify-evenly w-full p-4 transition-colors duration-200">
      <div className="flex-2">  
        <legend className="text-xl font-bold m-2 text-neutral-900 dark:text-neutral-100">Login</legend>
        <form onSubmit={handleSubmit} className="fieldset bg-base-200 border border-neutral-200 dark:border-neutral-800 rounded-box p-5 shadow-sm dark:shadow-none">
          <h2 className="text-lg text-center font-bold text-neutral-900 dark:text-white">Welcome back!</h2>
          <p className="text-center text-sm text-neutral-500 dark:text-zinc-400 mt-1">
            Please enter your credentials to log in to your account
          </p>
          <div className="h-0.5 my-4 border-t border-neutral-200 dark:border-neutral-800"></div>
          
          <div className="space-y-1.5 mb-4">
            <label className="text-[11px] uppercase tracking-wider text-neutral-500 dark:text-zinc-500 font-bold">Select Account Type</label>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center justify-between p-3 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 cursor-pointer hover:border-orange-500/30 transition-all has-[:checked]:border-orange-500 has-[:checked]:bg-orange-500/5">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-neutral-900 dark:text-white">Regular User</span>
                  <span className="text-[10px] text-neutral-500">Hiring representation</span>
                </div>
                <input 
                  type="radio" 
                  name="role" 
                  value="user" 
                  defaultChecked 
                  className="w-4 h-4 accent-orange-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 cursor-pointer hover:border-orange-500/30 transition-all has-[:checked]:border-orange-500 has-[:checked]:bg-orange-500/5">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-neutral-900 dark:text-white">Lawyer</span>
                  <span className="text-[10px] text-zinc-500">Legal counselor</span>
                </div>
                <input 
                  type="radio" 
                  name="role" 
                  value="lawyer" 
                  className="w-4 h-4 accent-orange-500"
                />
              </label>
            </div>
          </div>

          <fieldset className="fieldset">
            <label className="label text-neutral-700 dark:text-neutral-300">Email</label>
            <input type="email" className="input validator w-full bg-neutral-100 dark:bg-base-300 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100" name='email' placeholder="Email" required />
            <p className="validator-hint hidden">Enter a Valid Email</p>
          </fieldset>

          <div className="fieldset relative">
            <span className="label text-neutral-700 dark:text-neutral-300">Password</span>
            <div className="relative w-full">
              <input 
                type={isShowPassword ? "text" : "password"} 
                className="input validator w-full bg-neutral-100 dark:bg-base-300 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 pr-10" 
                name="password" 
                placeholder="Password" 
                required 
              />
              <button
                type="button"
                onClick={() => setIsShowPassword(!isShowPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                {isShowPassword ? <EyeClosed className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <span className="validator-hint hidden">Required</span>
          </div>

          <button className="btn bg-orange-500 hover:bg-orange-600 text-white border-none mt-5 w-full" type="submit" disabled={loading}>
            {loading ? "Logging In..." : "Login"} 
          </button>
          <button type="button" onClick={signIn} className="btn bg-white text-black border-[#e5e5e5]">
            <svg aria-label="Google logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><path d="m0 0H512V512H0" fill="#fff"></path><path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path><path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path><path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path><path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path></g></svg>
             Login with Google
          </button>
          <p className="text-sm font-medium text-center mt-4 text-neutral-600 dark:text-neutral-400">New to LegalEase? 
            <Link href={"/register"}>   
              <u className="text-orange-600 dark:text-orange-400 ml-1 font-semibold"> Register for Free</u> 
            </Link>
          </p>
        </form>
      </div>
        
      <div className="flex-3">
        <Image className="rounded-xl w-auto border border-neutral-200 dark:border-neutral-800 shadow-md" src={'/slide1.png'} width={700} height={850} alt='slide' priority></Image>
      </div>
    </div>
  );
}