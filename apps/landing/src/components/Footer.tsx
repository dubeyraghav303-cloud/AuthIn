import { Github, Twitter } from "lucide-react";
import Link from "next/link";

export function Footer() {
    return (
        <footer className="py-12 border-t border-white/5 bg-black">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-4 gap-8 mb-12">
                    <div className="col-span-2">
                        <div className="flex items-center gap-2 font-bold text-xl mb-4 text-white">
                            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-xs">A</div>
                            AuthKit
                        </div>
                        <p className="text-zinc-500 text-sm max-w-xs">
                            The open source authentication platform for modern SaaS applications.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-white mb-4">Product</h4>
                        <ul className="space-y-2 text-sm text-zinc-500">
                            <li><Link href="#" className="hover:text-blue-400">Features</Link></li>
                            <li><Link href="#" className="hover:text-blue-400">Security</Link></li>
                            <li><Link href="#" className="hover:text-blue-400">Roadmap</Link></li>
                            <li><Link href="#" className="hover:text-blue-400">Comparison</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-white mb-4">Community</h4>
                        <ul className="space-y-2 text-sm text-zinc-500">
                            <li><Link href="#" className="hover:text-blue-400">GitHub</Link></li>
                            <li><Link href="#" className="hover:text-blue-400">Discord</Link></li>
                            <li><Link href="#" className="hover:text-blue-400">Twitter</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5 text-sm text-zinc-600">
                    <div>
                        © 2024 AuthKit. MIT License.
                    </div>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <Link href="#"><Github className="w-5 h-5 hover:text-white transition-colors" /></Link>
                        <Link href="#"><Twitter className="w-5 h-5 hover:text-white transition-colors" /></Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
