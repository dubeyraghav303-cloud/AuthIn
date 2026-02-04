export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen">
            <aside className="w-64 bg-gray-900 text-white p-4 hidden md:block">
                <h2 className="text-xl font-bold mb-6">AuthKit</h2>
                <nav className="space-y-2">
                    <a href="#" className="block py-2 px-4 bg-gray-800 rounded">Overview</a>
                    <a href="#" className="block py-2 px-4 hover:bg-gray-800 rounded">Users</a>
                    <a href="#" className="block py-2 px-4 hover:bg-gray-800 rounded">Settings</a>
                </nav>
            </aside>
            <main className="flex-1 bg-gray-50 p-8">
                {children}
            </main>
        </div>
    );
}
