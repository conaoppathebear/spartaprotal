import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Briefcase, User, LogOut, Building, PlusCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const isEmployer = user?.role === "employer";
  const isAdmin = user?.role === "admin";

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 h-16">
      <div className="container-width h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group cursor-pointer">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white shadow-emerald-200 shadow-lg group-hover:scale-110 transition-transform">
            <Briefcase size={20} strokeWidth={2.5} />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-slate-800">
            Sparta Telecom Career Portal
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/jobs" className={`text-sm font-medium transition-colors hover:text-emerald-600 ${location === '/jobs' ? 'text-emerald-600' : 'text-slate-600'}`}>
            Find Jobs
          </Link>
          
          {isEmployer && (
            <Link href="/post-job" className={`text-sm font-medium transition-colors hover:text-emerald-600 ${location === '/post-job' ? 'text-emerald-600' : 'text-slate-600'}`}>
              Post a Job
            </Link>
          )}

          <div className="h-4 w-px bg-slate-200" />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full ring-2 ring-slate-100 hover:ring-emerald-200 transition-all">
                  <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center overflow-hidden">
                    {user.profileImageUrl ? (
                      <img src={user.profileImageUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-bold text-slate-500 text-xs">{user.username?.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name || user.username}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    <span className="text-xs text-emerald-600 font-medium capitalize mt-1">{user.role}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="cursor-pointer w-full flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                {isEmployer && (
                  <DropdownMenuItem asChild>
                    <Link href="/company/new" className="cursor-pointer w-full flex items-center">
                      <Building className="mr-2 h-4 w-4" />
                      <span>Create Company</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()} className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/api/login">
                <Button variant="ghost" className="font-semibold text-slate-600 hover:text-slate-900">
                  Log in
                </Button>
              </Link>
              <Link href="/api/login">
                <Button className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold shadow-emerald-200 shadow-md">
                  Sign up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
