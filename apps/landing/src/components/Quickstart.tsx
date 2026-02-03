import { Copy } from "lucide-react";

export function Quickstart() {
    return (
        <section className="py-24 bg-zinc-900/30 border-y border-white/5">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1">
                        <h2 className="text-3xl font-bold text-white mb-6">Ready to ship?</h2>
                        <p className="text-zinc-400 mb-8 leading-relaxed">
                            Clone the repo, start the docker containers, and you have a full authentication system running locally in under 2 minutes.
                        </p>
                        <div className="flex gap-4">
                            <button className="bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-zinc-200 transition-colors">
                                Documentation
                            </button>
                            <button className="text-zinc-400 hover:text-white px-6 py-3 font-medium transition-colors">
                                View on GitHub
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 w-full">
                        <div className="rounded-xl bg-black border border-white/10 overflow-hidden shadow-2xl">
                            <div className="flex items-center px-4 py-3 border-b border-white/10 bg-white/5">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                                </div>
                            </div>
                            <div className="p-6 font-mono text-sm text-zinc-300 space-y-2">
                                <div className="flex gap-2">
                                    <span className="text-purple-400">$</span>
                                    <span className="text-green-400">git</span> clone https://github.com/authkit/authkit
                                </div>
                                <div className="flex gap-2">
                                    <span className="text-purple-400">$</span>
                                    <span className="text-green-400">cd</span> authkit
                                </div>
                                <div className="flex gap-2">
                                    <span className="text-purple-400">$</span>
                                    <span className="text-green-400">docker-compose</span> up -d
                                </div>
                                <div className="flex gap-2 opacity-50">
                                    <span>... Starting redis ... done</span>
                                </div>
                                <div className="flex gap-2 opacity-50">
                                    <span>... Starting postgres ... done</span>
                                </div>
                                <div className="flex gap-2">
                                    <span className="text-purple-400">$</span>
                                    <span className="text-green-400">pnpm</span> dev
                                </div>
                                <div className="flex gap-2 text-blue-400 mt-2">
                                    <span>🚀 Server ready at http://localhost:3000</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
