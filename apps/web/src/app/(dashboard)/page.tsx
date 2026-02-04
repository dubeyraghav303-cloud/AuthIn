"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardRoot() {
    const router = useRouter();
    useEffect(() => {
        // Logic to resolve tenant or redirect to default
        router.push("/dashboard/default");
    }, [router]);
    return null;
}
