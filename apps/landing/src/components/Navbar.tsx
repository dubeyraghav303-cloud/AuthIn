import Link from "next/link";
import { Github } from "lucide-react";

export function Navbar() {
    return (
        <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/50 backdrop-blur-md">
            <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        A
                    </div>
                    AuthKit
                </div>
                <div className="flex items-center gap-6 text-sm font-medium">
                    <Link href="#features" className="text-zinc-400 hover:text-white transition-colors">Features</Link>
                    <Link href="#comparison" className="text-zinc-400 hover:text-white transition-colors">Vs Clerk</Link>
                    <Link href="/docs" className="text-zinc-400 hover:text-white transition-colors">Docs</Link>
                    <Link
                        href="https://github.com/your-org/authkit"
                        target="_blank"
                        className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full hover:bg-zinc-200 transition-colors"
                    >
                        <Github className="w-4 h-4" />
                        GitHub
                    </Link>
                </div>
            </div>
        </nav>
    );
}
