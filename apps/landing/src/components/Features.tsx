import { ShieldCheck, Users, Lock, Server, Fingerprint, Activity } from "lucide-react";

const features = [
    {
        title: "SaaS-Native Multi-Tenancy",
        description: "Built-in organization support. Users can join multiple tenants with different roles (Owner, Admin, Member).",
        icon: Users,
    },
    {
        title: "Passkeys-First",
        description: "Say goodbye to passwords. Enterprise-grade WebAuthn support out of the box.",
        icon: Fingerprint,
    },
    {
        title: "Audit Logs",
        description: "Track every login, failed attempt, and profile change. SOC2 compliance made easy.",
        icon: Activity,
    },
    {
        title: "Secure by Default",
        description: "HTTP-Only cookies, Refresh Token Rotation, and strict Reuse Detection.",
        icon: ShieldCheck,
    },
    {
        title: "Self-Hosted",
        description: "Keep your data. Deploy anywhere (AWS, Vercel, DigitalOcean). No vendor lock-in.",
        icon: Server,
    },
    {
        title: "RBAC & Permissions",
        description: "Granular permission system. define what users can do within their organizations.",
        icon: Lock,
    },
];

export function Features() {
    return (
        <section id="features" className="py-24 bg-zinc-950">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent mb-4">
                        Everything you need for SaaS Auth
                    </h2>
                    <p className="text-zinc-400 max-w-2xl mx-auto">
                        We built the features that usually take months, so you can ship your product this weekend.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((f, i) => (
                        <div key={i} className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-blue-500/20 transition-all group">
                            <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 mb-4 group-hover:scale-110 transition-transform">
                                <f.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-white">{f.title}</h3>
                            <p className="text-zinc-400 text-sm leading-relaxed">{f.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
