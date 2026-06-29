'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { authClient } from '../lib/auth-client';

export default function Register() {
  const [loading, setLoading] = useState(false);
  const signIn = async () => {
    const selectedRoleElement = document.querySelector('input[name="role"]:checked');
    const selectedRole = selectedRoleElement ? selectedRoleElement.value : 'user';

    await authClient.signIn.social({
      provider: "google",
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

     const Formdata = new FormData(e.currentTarget);
    const userdata = Object.fromEntries(Formdata);
        if (userdata.password !== userdata.confirm) {
      toast.error("Passwords do not match!");
      setLoading(false);
      return;
    }
console.log(userdata)
    const { data, error } = await authClient.signUp.email({
    name: userdata.name, // required
    email: userdata.email, // required
    password: userdata.password, // required
    role:userdata.role,
    image: userdata.imageUrl ||"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKaiKiPcLJj7ufrj6M2KaPwyCT4lDSFA5oog&s",
    callbackURL: "/",
});

      toast.success("Registration Successful");
      setLoading(false);
      
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-[#0a0a0a] p-3 transition-colors duration-200 dark:text-warning">
      <div className="w-full max-w-md h-fit rounded-2xl bg-base-300 border border-neutral-800 p-6 space-y-4 shadow-2xl text-black dark:text-white">
        
        <form onSubmit={handleSubmit} className="space-y-4 w-full">
          <div>
            <h2 className='text-2xl font-bold text-center dark:text-warning text-black'>
              {loading ? "Creating Account..." : "Create Account"}
            </h2>
            <p className='text-center text-xs text-zinc-600 mt-1'>
              Fill in the fields below to create your account for free
            </p>
          </div>

          <div className='h-px bg-neutral-800 w-full'></div>

          {/* ROLE SELECTION */}
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider text-zinc-700 font-bold">Select Account Type</label>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center justify-between p-3 rounded-xl bg-white-900/50 border dark:text-warning border-neutral-800 cursor-pointer hover:border-orange-500/30 transition-all has-[:checked]:border-orange-500 has-[:checked]:bg-orange-500/5">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-black dark:text-warning">Client</span>
                  <span className="text-[10px] dark:text-white text-zinc-700">Hiring representation</span>
                </div>
                <input 
                  type="radio" 
                  name="role" 
                  value="user" 
                  defaultChecked 
                  className="w-4 h-4 accent-orange-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-white-900/50 border border-neutral-800 cursor-pointer hover:border-orange-500/30 transition-all has-[:checked]:border-orange-500 has-[:checked]:bg-orange-500/5">
                <div className="flex flex-col">
                  <span className="text-sm font-bold dark:text-warning text-black">Lawyer</span>
                  <span className="text-[10px] dark:text-white text-zinc-700">Legal counselor</span>
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

          {/* USER NAME */}
          <div className="space-y-1">
            <label className="text-xs text-zinc-400 font-medium">User Name</label>
            <input 
              type="text" 
              name='name'
              className="w-full bg-white border border-neutral-800 focus:border-orange-500 focus:outline-none p-2.5 rounded-xl text-sm text-black placeholder-zinc-600 transition-colors" 
              placeholder="John Doe" 
              required 
            />
          </div>

          {/* EMAIL */}
          <div className="space-y-1">
            <label className="text-xs text-zinc-400 font-medium">Email Address</label>
            <input 
              type="email" 
              name="email"
              className="w-full bg-white border border-neutral-800 focus:border-orange-500 focus:outline-none p-2.5 rounded-xl text-sm text-black placeholder-zinc-600 transition-colors" 
              placeholder="name@example.com" 
              required 
            />
          </div>

          {/* OPTIONAL AVATAR PHOTO URL INPUT */}
          <div className="space-y-1">
            <label className="text-xs text-zinc-400 font-medium">Image URL <span className="text-zinc-500 text-[10px] lowercase">(optional)</span></label>
            <input 
              type="url" 
              name="imageUrl"
              className="w-full bg-white border border-neutral-800 focus:border-orange-500 focus:outline-none p-2.5 rounded-xl text-sm text-black placeholder-zinc-600 transition-colors" 
              placeholder="https://example.com/profile.png" 
            />
          </div>

          {/* PASSWORD FIELDS */}
          <div className='grid grid-cols-2 gap-3'>
            <div className="space-y-1">
              <label className="text-xs text-zinc-400 font-medium">Password</label>
              <input 
                type="password" 
                name="password"
                className="w-full bg-white border border-neutral-800 focus:border-orange-500 focus:outline-none p-2.5 rounded-xl text-sm text-black placeholder-zinc-600 transition-colors" 
                placeholder="••••••••" 
                required 
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-zinc-400 font-medium">Confirm</label>
              <input 
                type="password" 
                name="confirm"
                className="w-full bg-white border border-neutral-800 focus:border-orange-500 focus:outline-none p-2.5 rounded-xl text-sm text-black placeholder-zinc-600 transition-colors" 
                placeholder="••••••••" 
                required 
              />
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-2">
            <button 
              className="w-full bg-orange-500 py-2.5 text-black font-bold rounded-xl hover:bg-orange-400 disabled:bg-neutral-800 disabled:text-zinc-500 transition-colors text-sm" 
              type="submit" 
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </div>

          <button type="button" onClick={signIn} className="btn w-full rounded-xl border border-ora bg-white transition-colors text-black border-[#e5e5e5]">
            <svg aria-label="Google logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><path d="m0 0H512V512H0" fill="#fff"></path><path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path><path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path><path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path><path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path></g></svg>
            Continue with Google
          </button>

          <p className="text-xs text-center text-zinc-400 mt-2">
            Already have an account?
            <Link href="/login">
              <span className="text-orange-400 hover:underline cursor-pointer font-medium">Log In</span>
            </Link>
          </p>
        </form>

      </div>
    </div>
  );
}