'use client';

import { use, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Activity, ShieldAlert } from 'lucide-react';

export default function AuditLogsPage(props: { params: Promise<{ tenantId: string }> }) {
    const params = use(props.params);

    // Mock data
    const logs = [
        { id: '1', action: 'LOGIN_SUCCESS', user: 'alice@example.com', ip: '192.168.1.1', date: '2024-02-04 10:00:00' },
        { id: '2', action: 'INVITE_SENT', user: 'alice@example.com', ip: '192.168.1.1', date: '2024-02-04 10:05:00' },
        { id: '3', action: 'MEMBER_REMOVED', user: 'alice@example.com', ip: '192.168.1.1', date: '2024-02-04 11:20:00' },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Audit Logs</h2>
                <p className="text-muted-foreground">Track security events and actions within your organization.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        Activity History
                    </CardTitle>
                    <CardDescription>Recent actions performed by members.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Action</TableHead>
                                <TableHead>Actor</TableHead>
                                <TableHead>IP Address</TableHead>
                                <TableHead>Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {logs.map(log => (
                                <TableRow key={log.id}>
                                    <TableCell>
                                        <Badge variant="outline" className="font-mono">
                                            {log.action}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{log.user}</TableCell>
                                    <TableCell className="font-mono text-xs text-muted-foreground">{log.ip}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground">{log.date}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
