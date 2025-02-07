import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { LogOut, User, Plus, Pencil, Trash2, X, Loader2, Upload } from 'lucide-react';
import type { Perfume, PerfumeFormData } from '../types/perfume';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [adminData, setAdminData] = useState<{ username: string; last_login: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPerfume, setEditingPerfume] = useState<Perfume | null>(null);
  const [formError, setFormError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const navigate = useNavigate();

  const initialFormData: PerfumeFormData = {
    name: '',
    category: '',
    price: 0,
    image_url: '',
    description: '',
    notes: [],
  };

  const [formData, setFormData] = useState<PerfumeFormData>(initialFormData);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    checkAdmin();
    fetchPerfumes();
  }, []);

  const checkAdmin = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/admin/login');
        return;
      }

      const { data: adminUser, error } = await supabase
        .from('admin_users')
        .select('username, last_login')
        .eq('email', user.email)
        .single();

      if (error || !adminUser) {
        throw new Error('Unauthorized access');
      }

      setAdminData(adminUser);
    } catch (err) {
      navigate('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchPerfumes = async () => {
    try {
      const { data, error } = await supabase
        .from('perfumes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPerfumes(data || []);
    } catch (error) {
      console.error('Error fetching perfumes:', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `perfumes/${fileName}`;

    try {
      setUploadProgress(0);
      const { error: uploadError, data } = await supabase.storage
        .from('perfume-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          onUploadProgress: (progress) => {
            const percent = (progress.loaded / progress.total) * 100;
            setUploadProgress(Math.round(percent));
          },
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('perfume-images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image');
    } finally {
      setUploadProgress(null);
    }
  };

  const openModal = (perfume?: Perfume) => {
    if (perfume) {
      setEditingPerfume(perfume);
      setFormData({
        name: perfume.name,
        category: perfume.category,
        price: perfume.price,
        image_url: perfume.image_url,
        description: perfume.description,
        notes: perfume.notes,
      });
      setPreviewUrl(perfume.image_url);
    } else {
      setEditingPerfume(null);
      setFormData(initialFormData);
      setPreviewUrl(null);
    }
    setSelectedImage(null);
    setIsModalOpen(true);
    setFormError('');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPerfume(null);
    setFormData(initialFormData);
    setFormError('');
    setSelectedImage(null);
    setPreviewUrl(null);
    if (previewUrl && !previewUrl.startsWith('http')) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setIsSaving(true);

    try {
      if (!formData.name || !formData.category || !formData.price) {
        throw new Error('Please fill in all required fields');
      }

      let imageUrl = formData.image_url;
      if (selectedImage) {
        imageUrl = await uploadImage(selectedImage);
      } else if (!imageUrl) {
        throw new Error('Please select an image');
      }

      const perfumeData = {
        ...formData,
        image_url: imageUrl,
        notes: formData.notes.filter(note => note.trim() !== ''),
      };

      if (editingPerfume) {
        const { error } = await supabase
          .from('perfumes')
          .update(perfumeData)
          .eq('id', editingPerfume.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('perfumes')
          .insert([perfumeData]);

        if (error) throw error;
      }

      await fetchPerfumes();
      closeModal();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this perfume?')) return;

    try {
      const { error } = await supabase
        .from('perfumes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchPerfumes();
    } catch (error) {
      console.error('Error deleting perfume:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream p-8">
      <div className="max-w-7xl mx-auto">
        <div className="glossy-card p-8 rounded-3xl">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-stone-800 rounded-full flex items-center justify-center">
                <User className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-cormorant">Welcome, {adminData?.username}</h1>
                <p className="text-sm text-stone-500">
                  Last login: {adminData?.last_login ? new Date(adminData.last_login).toLocaleString() : 'First login'}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-stone-200 hover:border-stone-400 transition-colors"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>

          {/* Perfumes Management */}
          <div className="bg-white rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-cormorant">Manage Perfumes</h2>
              <button
                onClick={() => openModal()}
                className="btn-primary flex items-center gap-2"
              >
                <Plus size={18} />
                Add New Perfume
              </button>
            </div>

            {/* Perfumes Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-stone-200">
                    <th className="text-left py-4 px-4">Image</th>
                    <th className="text-left py-4 px-4">Name</th>
                    <th className="text-left py-4 px-4">Category</th>
                    <th className="text-left py-4 px-4">Price</th>
                    <th className="text-left py-4 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {perfumes.map((perfume) => (
                    <tr key={perfume.id} className="border-b border-stone-100 hover:bg-stone-50">
                      <td className="py-4 px-4">
                        <img
                          src={perfume.image_url}
                          alt={perfume.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      </td>
                      <td className="py-4 px-4">{perfume.name}</td>
                      <td className="py-4 px-4">{perfume.category}</td>
                      <td className="py-4 px-4">${perfume.price}</td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openModal(perfume)}
                            className="p-2 rounded-full hover:bg-stone-100"
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(perfume.id)}
                            className="p-2 rounded-full hover:bg-stone-100 text-red-500"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-cormorant">
                {editingPerfume ? 'Edit Perfume' : 'Add New Perfume'}
              </h3>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-stone-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            {formError && (
              <div className="mb-6 p-4 bg-red-50 rounded-2xl text-red-600 text-sm">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Image *
                </label>
                <div className="mt-2 flex flex-col items-center justify-center">
                  {previewUrl ? (
                    <div className="relative group">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-64 object-cover rounded-2xl"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                        <label className="cursor-pointer p-4 bg-white rounded-full">
                          <Upload size={24} />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <label className="w-full h-64 border-2 border-dashed border-stone-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-stone-400 transition-colors">
                      <Upload size={32} className="text-stone-400 mb-2" />
                      <span className="text-sm text-stone-600">Click to upload image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                  {uploadProgress !== null && (
                    <div className="w-full mt-2">
                      <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-stone-800 transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                      <p className="text-sm text-stone-600 text-center mt-1">
                        Uploading: {uploadProgress}%
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-stone-400 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-stone-400 outline-none"
                  required
                >
                  <option value="">Select a category</option>
                  <option value="Floral">Floral</option>
                  <option value="Oriental">Oriental</option>
                  <option value="Fresh">Fresh</option>
                  <option value="Woody">Woody</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Price * ($)
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-stone-400 outline-none"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-stone-400 outline-none"
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Notes (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.notes.join(', ')}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value.split(',').map(note => note.trim()) })}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-stone-400 outline-none"
                  placeholder="e.g., Rose, Jasmine, Bergamot"
                />
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-2 rounded-full border border-stone-200 hover:border-stone-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn-primary flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      {editingPerfume ? 'Update' : 'Create'} Perfume
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}