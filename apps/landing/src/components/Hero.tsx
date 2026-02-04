import { ArrowRight, Terminal } from "lucide-react";
import Link from "next/link";

export function Hero() {
    return (
        <section className="pt-32 pb-20 md:pt-40 md:pb-28">
            <div className="container mx-auto px-6 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium mb-6 border border-blue-500/20">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    v1.0 Public Beta is Live
                </div>

                <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-gradient-to-br from-white to-zinc-500 bg-clip-text text-transparent">
                    The Open Source Auth Platform <br className="hidden md:block" />
                    Built for SaaS.
                </h1>

                <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10">
                    Multi-tenancy, Passkeys, Audit Logs, and RBAC out of the box.
                    Stop building auth from scratch. Start Shipping.
                </p>

                <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                    <Link
                        href="https://auth-in-web-v48i.vercel.app/sign-in"
                        className="h-12 px-8 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-medium flex items-center gap-2 transition-all w-full md:w-auto justify-center"
                    >
                        Get Started <ArrowRight className="w-4 h-4" />
                    </Link>
                    <div className="h-12 px-6 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 font-mono text-sm flex items-center gap-3 w-full md:w-auto justify-center">
                        <span className="text-blue-500">$</span> npx authkit init
                        <div className="w-[1px] h-4 bg-zinc-700 mx-2"></div>
                        <button className="hover:text-white transition-colors">
                            <Terminal className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="mt-20 relative mx-auto max-w-5xl rounded-xl border border-white/10 bg-zinc-900/50 p-2 shadow-2xl backdrop-blur-sm">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-20"></div>
                    <img
                        src="/dashboard-preview.png"
                        alt="Dashboard Preview"
                        className="relative rounded-lg w-full h-auto border border-white/5 shadow-2xl"
                    />
                    {/* Placeholder for now if image doesn't exist */}
                    <div className="absolute inset-0 flex items-center justify-center text-zinc-700 font-mono text-sm pointer-events-none">
                        [Dashboard Preview Image Placeholder]
                    </div>
                </div>
            </div>
        </section>
    );
}
