'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import api from '@/lib/api';
import { Plus, Trash2, Pencil, X, Save, Eye, EyeOff, ExternalLink } from 'lucide-react';

const ACCENT = '#58CC02';
const CATEGORIES = ['Reporting Fraud', 'Learning More', 'Password Tools', 'Get Help'];

interface Resource {
  _id: string;
  category: string;
  title: string;
  description: string;
  url: string;
  icon: string;
  order: number;
  active: boolean;
}

const EMPTY_FORM = { category: CATEGORIES[0], title: '', description: '', url: '', icon: 'Globe' };

export default function AdminResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Resource | 'new' | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchResources = async () => {
    try {
      const response: any = await api.get('/admin/resources');
      setResources(response.data.resources);
    } catch {
      setResources([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const openEditor = (item: Resource | 'new') => {
    setEditing(item);
    setError('');
    setForm(
      item === 'new'
        ? EMPTY_FORM
        : { category: item.category, title: item.title, description: item.description, url: item.url, icon: item.icon }
    );
  };

  const closeEditor = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setError('');
  };

  const handleSave = async () => {
    if (!form.title || !form.url || !form.description) {
      setError('Title, description, and URL are required.');
      return;
    }

    setSaving(true);
    try {
      if (editing === 'new') {
        await api.post('/admin/resources', form);
      } else if (editing) {
        await api.put(`/admin/resources/${editing._id}`, form);
      }
      closeEditor();
      fetchResources();
    } catch (err: any) {
      setError(err.message || 'Could not save resource.');
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (item: Resource) => {
    try {
      await api.put(`/admin/resources/${item._id}`, { active: !item.active });
      setResources((prev) => prev.map((r) => (r._id === item._id ? { ...r, active: !r.active } : r)));
    } catch (err: any) {
      alert(err.message || 'Could not update resource.');
    }
  };

  const handleDelete = async (item: Resource) => {
    if (!confirm(`Delete "${item.title}"?`)) return;
    try {
      await api.delete(`/admin/resources/${item._id}`);
      setResources((prev) => prev.filter((r) => r._id !== item._id));
    } catch (err: any) {
      alert(err.message || 'Could not delete resource.');
    }
  };

  const grouped = CATEGORIES.map((cat) => ({
    category: cat,
    items: resources.filter((r) => r.category === cat),
  }));

  return (
    <div>
      <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-2">Manage</p>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Resources</h1>
        </div>
        <button
          onClick={() => openEditor('new')}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-[14px] font-bold text-[#101010] transition-transform hover:scale-[1.02]"
          style={{ backgroundColor: ACCENT }}
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          New resource
        </button>
      </header>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-2 border-zinc-700 border-t-[#58CC02] rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-10">
          {grouped.map((group) => (
            <div key={group.category}>
              <h2 className="text-[13px] font-bold uppercase tracking-wider text-zinc-500 mb-4">{group.category}</h2>
              {group.items.length === 0 ? (
                <p className="text-[13px] text-zinc-600">No resources in this category.</p>
              ) : (
                <div className="space-y-2">
                  {group.items.map((item) => (
                    <div
                      key={item._id}
                      className={`flex items-center gap-4 p-4 rounded-xl bg-zinc-950 border border-zinc-800 ${!item.active ? 'opacity-50' : ''}`}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-[14px] font-bold truncate">{item.title}</p>
                        <p className="text-[12px] text-zinc-500 truncate">{item.description}</p>
                      </div>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-500 hover:text-white transition-colors p-2 flex-shrink-0"
                      >
                        <ExternalLink className="w-4 h-4" strokeWidth={2} />
                      </a>
                      <button
                        onClick={() => toggleActive(item)}
                        className="text-zinc-500 hover:text-white transition-colors p-2 flex-shrink-0"
                      >
                        {item.active ? <Eye className="w-4 h-4" strokeWidth={2} /> : <EyeOff className="w-4 h-4" strokeWidth={2} />}
                      </button>
                      <button onClick={() => openEditor(item)} className="text-zinc-500 hover:text-white transition-colors p-2 flex-shrink-0">
                        <Pencil className="w-4 h-4" strokeWidth={2} />
                      </button>
                      <button onClick={() => handleDelete(item)} className="text-zinc-500 hover:text-red-500 transition-colors p-2 flex-shrink-0">
                        <Trash2 className="w-4 h-4" strokeWidth={2} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Editor modal */}
      <AnimatePresence>
        {editing && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeEditor}
              className="fixed inset-0 bg-black/60 z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              className="fixed inset-x-4 top-[10vh] max-w-lg mx-auto bg-[#101010] border border-zinc-800 rounded-2xl z-50"
            >
              <div className="flex items-center justify-between p-5 border-b border-zinc-800">
                <h2 className="font-extrabold">{editing === 'new' ? 'New resource' : 'Edit resource'}</h2>
                <button onClick={closeEditor} className="text-zinc-500 hover:text-white">
                  <X className="w-5 h-5" strokeWidth={2} />
                </button>
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <label className="text-[12px] font-bold text-zinc-500 mb-1.5 block">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-[14px] text-white focus:outline-none focus:border-zinc-600 appearance-none"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[12px] font-bold text-zinc-500 mb-1.5 block">Title</label>
                  <input
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-[14px] text-white focus:outline-none focus:border-zinc-600"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-bold text-zinc-500 mb-1.5 block">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-[14px] text-white focus:outline-none focus:border-zinc-600 resize-none"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-bold text-zinc-500 mb-1.5 block">URL</label>
                  <input
                    value={form.url}
                    onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
                    placeholder="https://..."
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-[14px] text-white focus:outline-none focus:border-zinc-600"
                  />
                </div>
                {error && <p className="text-red-500 text-[13px] font-medium">{error}</p>}
              </div>

              <div className="p-5 border-t border-zinc-800 flex justify-end gap-3">
                <button
                  onClick={closeEditor}
                  className="px-5 py-2.5 rounded-full text-[13px] font-bold text-zinc-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-bold text-[#101010] disabled:opacity-50 transition-transform hover:scale-[1.02]"
                  style={{ backgroundColor: ACCENT }}
                >
                  <Save className="w-4 h-4" strokeWidth={2.25} />
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
