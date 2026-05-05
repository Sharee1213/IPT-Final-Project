'use client';

import { useAuth } from '@/lib/auth-context';
import { DashboardLayout } from '@/components/layout';
import { Card, Button, Input, LoadingSpinner } from '@/components/ui';
import { api } from '@/lib/api';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function StudentProfile() {
  const { user, token, isAuthenticated } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'student') {
      router.push('/login');
      return;
    }

    loadProfile();
  }, [isAuthenticated, user]);

  const loadProfile = async () => {
    try {
      if (token) {
        const data = await api.getProfile(token);
        setProfile(data);
        setFormData(data);
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (token) {
        await api.updateProfile(token, formData);
        setProfile(formData);
        setEditing(false);
        alert('Profile updated successfully');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update profile');
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="student">
        <LoadingSpinner />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="student">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">Your Profile</h1>

        <Card className="mb-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-600 text-sm font-medium">Full Name</label>
              <p className="text-xl font-semibold">{profile?.name}</p>
            </div>
            <div>
              <label className="block text-gray-600 text-sm font-medium">Email</label>
              <p className="text-xl font-semibold">{profile?.email}</p>
            </div>
            <div>
              <label className="block text-gray-600 text-sm font-medium">Student ID</label>
              <p className="text-xl font-semibold">{profile?.student_id}</p>
            </div>
            <div>
              <label className="block text-gray-600 text-sm font-medium">Course</label>
              <p className="text-xl font-semibold">{profile?.course}</p>
            </div>
            <div>
              <label className="block text-gray-600 text-sm font-medium">Year Level</label>
              <p className="text-xl font-semibold">{profile?.year_level}</p>
            </div>
            <div>
              <label className="block text-gray-600 text-sm font-medium">Phone</label>
              <p className="text-xl font-semibold">{profile?.phone || 'Not set'}</p>
            </div>
          </div>

          {!editing && (
            <Button
              variant="primary"
              onClick={() => setEditing(true)}
              className="mt-6"
            >
              Edit Profile
            </Button>
          )}
        </Card>

        {editing && (
          <Card>
            <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
            <div className="space-y-4">
              <Input
                label="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <Input
                label="Phone"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              <div className="flex gap-4">
                <Button variant="primary" onClick={handleSave}>
                  Save Changes
                </Button>
                <Button variant="secondary" onClick={() => setEditing(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
