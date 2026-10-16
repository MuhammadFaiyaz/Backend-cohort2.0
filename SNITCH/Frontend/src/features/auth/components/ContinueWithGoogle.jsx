import React from 'react'

const ContinueWithGoogle = () => {
  return (
    <div>
      <a
          href="/api/auth/google"
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-slate-400 hover:bg-slate-50 hover:shadow-md active:scale-[0.99] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-600/20"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt=""
            className="h-5 w-5"
          />
          <span>Continue with Google</span>
        </a>

    </div>
  )
}

export default ContinueWithGoogle