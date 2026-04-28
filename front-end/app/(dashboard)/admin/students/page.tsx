'use client';

import { useAuth } from '@/lib/auth-context';
import { DashboardLayout } from '@/components/layout';
import { Card, Button, Input, LoadingSpinner, Badge } from '@/components/ui';
import { api } from '@/lib/api';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminStudents() {
  const { user, token, isAuthenticated } = useAuth();
  const router = useRouter();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!isAuthenticated || (user?.role !== 'admin' && user?.role !== 'officer')) {
      router.push('/login');
      return;
    }

    loadStudents();
  }, [isAuthenticated, user]);

  const loadStudents = async () => {
    try {
      if (token) {
        const response: any = await api.getUsers(token, { search });
        setStudents(response.data || response);
      }
    } catch (err) {
      console.error('Failed to load students:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (studentId: number) => {
    try {
      if (token) {
        await api.toggleUserActive(token, studentId);
        loadStudents();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to toggle user status');
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="admin">
        <LoadingSpinner />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">
      <h1 className="text-3xl font-bold mb-8">Students</h1>

      <Card className="mb-6">
        <Input
          label="Search Students"
          placeholder="Name or Student ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button variant="primary" onClick={loadStudents} className="mt-4">
          Search
        </Button>
      </Card>

      <Card>
        {students.length === 0 ? (
          <p className="text-gray-500">No students found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Student ID</th>
                  <th className="px-4 py-2 text-left">Course</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{student.name}</td>
                    <td className="px-4 py-3">{student.student_id}</td>
                    <td className="px-4 py-3">{student.course}</td>
                    <td className="px-4 py-3">
                      <Badge variant={student.is_active ? 'green' : 'red'}>
                        {student.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        variant={student.is_active ? 'danger' : 'primary'}
                        size="sm"
                        onClick={() => handleToggleActive(student.id)}
                      >
                        {student.is_active ? 'Deactivate' : 'Activate'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
}
