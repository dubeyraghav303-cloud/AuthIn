export default function DashboardPage({ params }: { params: { tenantId: string } }) {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
            <p className="text-gray-600">Tenant ID: {params.tenantId}</p>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium">Total Users</h3>
                    <p className="text-3xl font-bold mt-2">1,234</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium">Active Sessions</h3>
                    <p className="text-3xl font-bold mt-2">856</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium">Auth Success Rate</h3>
                    <p className="text-3xl font-bold mt-2">99.9%</p>
                </div>
            </div>
        </div>
    );
}
