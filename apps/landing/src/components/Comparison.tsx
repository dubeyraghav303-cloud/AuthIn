import { Check, X, Minus } from "lucide-react";

export function Comparison() {
    return (
        <section id="comparison" className="py-24 border-t border-white/5 bg-black">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-white mb-4">Why builders choose AuthKit</h2>
                    <p className="text-zinc-400">Stop paying per MAU. Own your auth.</p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full max-w-4xl mx-auto border-collapse">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="py-4 text-left text-zinc-500 font-medium">Feature</th>
                                <th className="py-4 text-center text-blue-500 font-bold text-lg">AuthKit</th>
                                <th className="py-4 text-center text-zinc-500 font-medium">Clerk</th>
                                <th className="py-4 text-center text-zinc-500 font-medium">Auth0</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {[
                                { name: "Pricing", authkit: "Free (MIT)", clerk: "$35/mo+", auth0: "$$$" },
                                { name: "Self-Hosted", authkit: true, clerk: false, auth0: false },
                                { name: "Multi-Tenancy", authkit: true, clerk: true, auth0: "Complex" },
                                { name: "Passkeys", authkit: true, clerk: true, auth0: true },
                                { name: "Audit Logs", authkit: true, clerk: "$$$", auth0: "$$$" },
                                { name: "Data Ownership", authkit: "100%", clerk: "0%", auth0: "0%" },
                            ].map((row, i) => (
                                <tr key={i} className="hover:bg-white/5 transition-colors">
                                    <td className="py-4 px-4 text-zinc-300 font-medium">{row.name}</td>
                                    <td className="py-4 text-center">
                                        {row.authkit === true ? (
                                            <Check className="w-5 h-5 text-blue-500 mx-auto" />
                                        ) : (
                                            <span className="text-blue-400 font-bold">{row.authkit}</span>
                                        )}
                                    </td>
                                    <td className="py-4 text-center">
                                        {row.clerk === true ? <Check className="w-5 h-5 text-zinc-600 mx-auto" /> :
                                            row.clerk === false ? <X className="w-5 h-5 text-red-500/50 mx-auto" /> :
                                                <span className="text-zinc-500">{row.clerk}</span>}
                                    </td>
                                    <td className="py-4 text-center">
                                        {row.auth0 === true ? <Check className="w-5 h-5 text-zinc-600 mx-auto" /> :
                                            row.auth0 === false ? <X className="w-5 h-5 text-red-500/50 mx-auto" /> :
                                                <span className="text-zinc-500">{row.auth0}</span>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}
