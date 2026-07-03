'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import api from '@/lib/api';
import {
  Plus, Trash2, Pencil, X, Save, Mail, Lock, Users, HelpCircle, Eye, EyeOff,
} from 'lucide-react';

const ACCENT = '#58CC02';

const KINDS = [
  { value: 'quiz-question', label: 'Quiz Questions', icon: HelpCircle },
  { value: 'phishing-email', label: 'Phishing Emails', icon: Mail },
  { value: 'password-challenge', label: 'Password Challenges', icon: Lock },
  { value: 'social-scenario', label: 'Social Engineering', icon: Users },
];

interface ContentItem {
  _id: string;
  kind: string;
  itemId: number;
  data: any;
  order: number;
  active: boolean;
}

export default function AdminContentPage() {
  const [activeKind, setActiveKind] = useState(KINDS[0].value);
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ContentItem | 'new' | null>(null);
  const [jsonDraft, setJsonDraft] = useState('');
  const [jsonError, setJsonError] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchItems = async (kind: string) => {
    setLoading(true);
    try {
      const response: any = await api.get('/admin/content', { params: { kind } });
      setItems(response.data.items);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems(activeKind);
  }, [activeKind]);

  const openEditor = (item: ContentItem | 'new') => {
    setEditing(item);
    setJsonError('');
    setJsonDraft(item === 'new' ? '{\n  \n}' : JSON.stringify(item.data, null, 2));
  };

  const closeEditor = () => {
    setEditing(null);
    setJsonDraft('');
    setJsonError('');
  };

  const handleSave = async () => {
    let parsed;
    try {
      parsed = JSON.parse(jsonDraft);
    } catch {
      setJsonError('Invalid JSON — check for a missing comma or bracket.');
      return;
    }

    setSaving(true);
    try {
      if (editing === 'new') {
        await api.post('/admin/content', { kind: activeKind, data: parsed });
      } else if (editing) {
        await api.put(`/admin/content/${editing._id}`, { data: parsed });
      }
      closeEditor();
      fetchItems(activeKind);
    } catch (err: any) {
      setJsonError(err.message || 'Could not save. Check your JSON matches the expected shape.');
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (item: ContentItem) => {
    try {
      await api.put(`/admin/content/${item._id}`, { active: !item.active });
      setItems((prev) => prev.map((i) => (i._id === item._id ? { ...i, active: !i.active } : i)));
    } catch (err: any) {
      alert(err.message || 'Could not update item.');
    }
  };

  const handleDelete = async (item: ContentItem) => {
    if (!confirm('Delete this item? This cannot be undone.')) return;
    try {
      await api.delete(`/admin/content/${item._id}`);
      setItems((prev) => prev.filter((i) => i._id !== item._id));
    } catch (err: any) {
      alert(err.message || 'Could not delete item.');
    }
  };

  const previewTitle = (item: ContentItem) => {
    const d = item.data;
    return d.title || d.question || d.subject || `Item #${item.itemId}`;
  };

  const previewSubtitle = (item: ContentItem) => {
    const d = item.data;
    if (activeKind === 'phishing-email') return d.senderEmail;
    if (activeKind === 'quiz-question') return d.topic;
    if (activeKind === 'social-scenario') return d.type;
    return d.instruction?.slice(0, 60);
  };

  return (
    <div>
      <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-2">Manage</p>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Rooms &amp; Content</h1>
        </div>
        <button
          onClick={() => openEditor('new')}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-[14px] font-bold text-[#101010] transition-transform hover:scale-[1.02]"
          style={{ backgroundColor: ACCENT }}
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          New item
        </button>
      </header>

      {/* Kind tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {KINDS.map((k) => (
          <button
            key={k.value}
            onClick={() => setActiveKind(k.value)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-[13px] font-bold transition-colors ${
              activeKind === k.value ? 'text-[#101010]' : 'text-zinc-400 bg-zinc-950 border border-zinc-800 hover:text-white'
            }`}
            style={activeKind === k.value ? { backgroundColor: ACCENT } : undefined}
          >
            <k.icon className="w-3.5 h-3.5" strokeWidth={2.25} />
            {k.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-2 border-zinc-700 border-t-[#58CC02] rounded-full animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <p className="text-zinc-500 py-12 text-center">No items yet. Create one to get started.</p>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item._id}
              className={`flex items-center gap-4 p-4 rounded-xl bg-zinc-950 border border-zinc-800 ${!item.active ? 'opacity-50' : ''}`}
            >
              <span className="font-mono text-[12px] text-zinc-600 w-8 flex-shrink-0">#{item.itemId}</span>
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-bold truncate">{previewTitle(item)}</p>
                <p className="text-[12px] text-zinc-500 truncate">{previewSubtitle(item)}</p>
              </div>
              <button
                onClick={() => toggleActive(item)}
                className="text-zinc-500 hover:text-white transition-colors p-2"
                title={item.active ? 'Deactivate (hide from learners)' : 'Activate'}
              >
                {item.active ? <Eye className="w-4 h-4" strokeWidth={2} /> : <EyeOff className="w-4 h-4" strokeWidth={2} />}
              </button>
              <button onClick={() => openEditor(item)} className="text-zinc-500 hover:text-white transition-colors p-2">
                <Pencil className="w-4 h-4" strokeWidth={2} />
              </button>
              <button onClick={() => handleDelete(item)} className="text-zinc-500 hover:text-red-500 transition-colors p-2">
                <Trash2 className="w-4 h-4" strokeWidth={2} />
              </button>
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
              className="fixed inset-x-4 top-[8vh] max-w-2xl mx-auto bg-[#101010] border border-zinc-800 rounded-2xl z-50 max-h-[84vh] flex flex-col"
            >
              <div className="flex items-center justify-between p-5 border-b border-zinc-800">
                <h2 className="font-extrabold">
                  {editing === 'new' ? `New ${KINDS.find((k) => k.value === activeKind)?.label.slice(0, -1)}` : `Edit #${editing.itemId}`}
                </h2>
                <button onClick={closeEditor} className="text-zinc-500 hover:text-white">
                  <X className="w-5 h-5" strokeWidth={2} />
                </button>
              </div>

              <div className="p-5 overflow-y-auto flex-1">
                <p className="text-[12px] text-zinc-500 mb-3">
                  Edit the raw JSON for this item. It must match the shape the room expects (title, question, options, etc.).
                </p>
                <textarea
                  value={jsonDraft}
                  onChange={(e) => setJsonDraft(e.target.value)}
                  spellCheck={false}
                  className="w-full h-80 p-4 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-[13px] text-zinc-200 focus:outline-none focus:border-zinc-600 resize-none"
                />
                {jsonError && <p className="text-red-500 text-[13px] font-medium mt-2">{jsonError}</p>}
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
