'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Edit2, Trash2, Shield, Target, BookOpen, AlertCircle, Save, X } from 'lucide-react';
import api from '@/lib/api';

const ACCENT = '#58CC02';

// ─── Interfaces ─────────────────────────────────────────────────────────────

interface Room {
  _id: string;
  roomId: string;
  title: string;
  description: string;
  icon: string;
  active: boolean;
  order: number;
}

interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

interface Question {
  _id?: string;
  itemId?: number;
  data: {
    roomId: string;
    question: string;
    options: QuestionOption[];
  };
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modals / Editors
  const [isEditingRoom, setIsEditingRoom] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<Partial<Room> | null>(null);
  const [isEditingQuestion, setIsEditingQuestion] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Partial<Question> | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null); // To filter questions view

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [roomsRes, qsRes] = await Promise.all([
        api.get('/admin/rooms'),
        api.get('/admin/content?kind=custom-room-question')
      ]);
      setRooms((roomsRes as any).data.rooms);
      setQuestions((qsRes as any).data.content || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentRoom) return;

    try {
      if (currentRoom._id) {
        await api.put(`/admin/rooms/${currentRoom._id}`, currentRoom);
      } else {
        await api.post('/admin/rooms', currentRoom);
      }
      setIsEditingRoom(false);
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to save room');
    }
  };

  const handleDeleteRoom = async (id: string) => {
    if (!window.confirm('Delete this room and all its questions? This cannot be undone.')) return;
    try {
      await api.delete(`/admin/rooms/${id}`);
      if (selectedRoomId === rooms.find(r => r._id === id)?.roomId) {
        setSelectedRoomId(null);
      }
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete room');
    }
  };

  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentQuestion || !currentQuestion.data) return;

    // Validate one correct answer
    const correctCount = currentQuestion.data.options.filter(o => o.isCorrect).length;
    if (correctCount !== 1) {
      alert('You must select exactly one correct option.');
      return;
    }

    try {
      const payload = {
        kind: 'custom-room-question',
        itemId: currentQuestion.itemId || Date.now() + Math.floor(Math.random() * 1000), // simplistic auto-id
        data: currentQuestion.data,
      };

      if (currentQuestion._id) {
        await api.put(`/admin/content/${currentQuestion._id}`, payload);
      } else {
        await api.post('/admin/content', payload);
      }
      setIsEditingQuestion(false);
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to save question');
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    if (!window.confirm('Delete this question?')) return;
    try {
      await api.delete(`/admin/content/${id}`);
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete question');
    }
  };

  if (loading && rooms.length === 0) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-2 border-zinc-700 border-t-[#58CC02] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <header className="mb-10 flex items-center justify-between">
        <div>
          <Link href="/admin" className="text-[12px] font-bold flex items-center gap-2 text-zinc-500 hover:text-zinc-300 transition-colors mb-2">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Custom Rooms</h1>
        </div>
        <button
          onClick={() => {
            setCurrentRoom({ roomId: '', title: '', description: '', icon: 'Shield', active: true, order: 0 });
            setIsEditingRoom(true);
          }}
          className="px-4 py-2 rounded-xl text-[13px] font-bold text-zinc-950 flex items-center gap-2 hover:opacity-90 transition-opacity"
          style={{ backgroundColor: ACCENT }}
        >
          <Plus className="w-4 h-4" /> Create Room
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ROOMS LIST */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-[13px] font-bold uppercase tracking-wider text-zinc-500 mb-4">Available Rooms</h2>
          {rooms.map(room => (
            <div 
              key={room._id} 
              className={`p-5 rounded-2xl border transition-all cursor-pointer ${selectedRoomId === room.roomId ? 'bg-zinc-900 border-zinc-700' : 'bg-zinc-950 border-zinc-800 hover:bg-zinc-900'}`}
              onClick={() => setSelectedRoomId(room.roomId)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                    {room.icon === 'Shield' && <Shield className="w-4 h-4 text-zinc-400" />}
                    {room.icon === 'Target' && <Target className="w-4 h-4 text-zinc-400" />}
                    {room.icon === 'BookOpen' && <BookOpen className="w-4 h-4 text-zinc-400" />}
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold">{room.title}</h3>
                    <p className="text-[12px] text-zinc-500 font-mono">{room.roomId}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setCurrentRoom(room); setIsEditingRoom(true); }}
                    className="p-1.5 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDeleteRoom(room._id); }}
                    className="p-1.5 text-zinc-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <p className="text-[13px] text-zinc-400 line-clamp-2 mt-2">{room.description}</p>
              <div className="flex items-center gap-2 mt-4 text-[12px] font-bold">
                <span className={`px-2 py-0.5 rounded ${room.active ? 'bg-emerald-500/10 text-emerald-500' : 'bg-zinc-800 text-zinc-500'}`}>
                  {room.active ? 'Active' : 'Draft'}
                </span>
                <span className="text-zinc-600 px-2 py-0.5 bg-zinc-900 rounded">
                  {questions.filter(q => q.data.roomId === room.roomId).length} Questions
                </span>
              </div>
            </div>
          ))}
          {rooms.length === 0 && (
            <div className="p-8 text-center border border-dashed border-zinc-800 rounded-2xl text-zinc-500">
              <p className="text-[14px] font-medium mb-4">No custom rooms yet.</p>
            </div>
          )}
        </div>

        {/* QUESTIONS LIST */}
        <div className="lg:col-span-2">
          {selectedRoomId ? (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[13px] font-bold uppercase tracking-wider text-zinc-500">
                  Questions for {rooms.find(r => r.roomId === selectedRoomId)?.title}
                </h2>
                <button
                  onClick={() => {
                    setCurrentQuestion({
                      data: {
                        roomId: selectedRoomId,
                        question: '',
                        options: [
                          { id: 'a', text: '', isCorrect: true, explanation: '' },
                          { id: 'b', text: '', isCorrect: false, explanation: '' }
                        ]
                      }
                    });
                    setIsEditingQuestion(true);
                  }}
                  className="px-3 py-1.5 rounded-lg text-[12px] font-bold bg-zinc-800 text-white flex items-center gap-2 hover:bg-zinc-700 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Question
                </button>
              </div>

              <div className="space-y-4">
                {questions.filter(q => q.data.roomId === selectedRoomId).map((q, idx) => (
                  <div key={q._id} className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-start justify-between group">
                    <div className="pr-8">
                      <p className="text-[12px] font-bold text-zinc-500 mb-1">Question {idx + 1}</p>
                      <h3 className="text-[15px] font-medium mb-4">{q.data.question}</h3>
                      <div className="space-y-2">
                        {q.data.options.map((opt, oIdx) => (
                          <div key={opt.id} className={`p-3 rounded-xl border text-[13px] flex items-start gap-3 ${opt.isCorrect ? 'border-[#58CC02]/30 bg-[#58CC02]/5' : 'border-zinc-800 bg-zinc-900'}`}>
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${opt.isCorrect ? 'bg-[#58CC02] text-zinc-950' : 'bg-zinc-800 text-zinc-400'}`}>
                              {String.fromCharCode(65 + oIdx)}
                            </div>
                            <div>
                              <p className="font-medium mb-1">{opt.text}</p>
                              {opt.explanation && <p className="text-zinc-500 text-[12px]">{opt.explanation}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => { setCurrentQuestion(q); setIsEditingQuestion(true); }}
                        className="p-2 bg-zinc-900 text-zinc-400 hover:text-white rounded-xl transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteQuestion(q._id!)}
                        className="p-2 bg-zinc-900 text-zinc-400 hover:text-rose-500 rounded-xl transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {questions.filter(q => q.data.roomId === selectedRoomId).length === 0 && (
                  <div className="p-12 text-center border border-dashed border-zinc-800 rounded-2xl text-zinc-500">
                    <AlertCircle className="w-8 h-8 mx-auto mb-4 opacity-50" />
                    <p className="text-[14px] font-medium">No questions added yet.</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-12 text-center border border-dashed border-zinc-800 rounded-2xl text-zinc-500">
              <p className="text-[14px] font-medium">Select a room to view or add questions.</p>
            </div>
          )}
        </div>
      </div>

      {/* ROOM MODAL */}
      <AnimatePresence>
        {isEditingRoom && currentRoom && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">{currentRoom._id ? 'Edit Room' : 'New Room'}</h3>
                <button onClick={() => setIsEditingRoom(false)} className="p-2 hover:bg-zinc-900 rounded-full transition-colors"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSaveRoom} className="space-y-4">
                <div>
                  <label className="block text-[12px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Room ID (Slug)</label>
                  <input type="text" required value={currentRoom.roomId || ''} onChange={e => setCurrentRoom({ ...currentRoom, roomId: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#58CC02]" placeholder="e.g. data-privacy" disabled={!!currentRoom._id} />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Title</label>
                  <input type="text" required value={currentRoom.title || ''} onChange={e => setCurrentRoom({ ...currentRoom, title: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#58CC02]" placeholder="e.g. Data Privacy Basics" />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Description</label>
                  <textarea required value={currentRoom.description || ''} onChange={e => setCurrentRoom({ ...currentRoom, description: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#58CC02] min-h-[100px]" placeholder="What will users learn in this room?" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Icon</label>
                    <select value={currentRoom.icon || 'Shield'} onChange={e => setCurrentRoom({ ...currentRoom, icon: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#58CC02]">
                      <option value="Shield">Shield</option>
                      <option value="Target">Target</option>
                      <option value="BookOpen">Book</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Status</label>
                    <label className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 cursor-pointer">
                      <input type="checkbox" checked={currentRoom.active} onChange={e => setCurrentRoom({ ...currentRoom, active: e.target.checked })} className="w-4 h-4 rounded bg-zinc-800 border-zinc-700 text-[#58CC02] focus:ring-[#58CC02]" />
                      <span className="text-[14px] font-medium">Active</span>
                    </label>
                  </div>
                </div>
                <div className="pt-4">
                  <button type="submit" className="w-full py-4 rounded-xl text-[14px] font-bold text-zinc-950 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity" style={{ backgroundColor: ACCENT }}>
                    <Save className="w-4 h-4" /> Save Room
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* QUESTION MODAL */}
      <AnimatePresence>
        {isEditingQuestion && currentQuestion && currentQuestion.data && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-2xl my-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">{currentQuestion._id ? 'Edit Question' : 'New Question'}</h3>
                <button onClick={() => setIsEditingQuestion(false)} className="p-2 hover:bg-zinc-900 rounded-full transition-colors"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSaveQuestion} className="space-y-6">
                <div>
                  <label className="block text-[12px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Question Text</label>
                  <textarea required value={currentQuestion.data.question || ''} onChange={e => setCurrentQuestion({ ...currentQuestion, data: { ...currentQuestion.data!, question: e.target.value } })} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#58CC02] min-h-[80px]" placeholder="Enter the question prompt..." />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-[12px] font-bold text-zinc-500 uppercase tracking-wider">Options</label>
                    <button 
                      type="button" 
                      onClick={() => setCurrentQuestion({ ...currentQuestion, data: { ...currentQuestion.data!, options: [...currentQuestion.data!.options, { id: String.fromCharCode(97 + currentQuestion.data!.options.length), text: '', isCorrect: false, explanation: '' }] } })}
                      className="text-[12px] font-bold text-[#58CC02] flex items-center gap-1 hover:opacity-80"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Option
                    </button>
                  </div>
                  <div className="space-y-4">
                    {currentQuestion.data.options.map((opt, idx) => (
                      <div key={idx} className={`p-4 rounded-xl border ${opt.isCorrect ? 'border-[#58CC02]/50 bg-[#58CC02]/5' : 'border-zinc-800 bg-zinc-900/50'}`}>
                        <div className="flex gap-4">
                          <div className="pt-3">
                            <input 
                              type="radio" 
                              name="correctOption" 
                              checked={opt.isCorrect} 
                              onChange={() => {
                                const newOpts = currentQuestion.data!.options.map((o, i) => ({ ...o, isCorrect: i === idx }));
                                setCurrentQuestion({ ...currentQuestion, data: { ...currentQuestion.data!, options: newOpts } });
                              }}
                              className="w-4 h-4 text-[#58CC02] focus:ring-[#58CC02] bg-zinc-900 border-zinc-700" 
                            />
                          </div>
                          <div className="flex-1 space-y-3">
                            <input type="text" required value={opt.text} onChange={e => {
                                const newOpts = [...currentQuestion.data!.options];
                                newOpts[idx].text = e.target.value;
                                setCurrentQuestion({ ...currentQuestion, data: { ...currentQuestion.data!, options: newOpts } });
                              }} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-[14px] focus:outline-none focus:border-[#58CC02]" placeholder="Option text..." />
                            <input type="text" value={opt.explanation} onChange={e => {
                                const newOpts = [...currentQuestion.data!.options];
                                newOpts[idx].explanation = e.target.value;
                                setCurrentQuestion({ ...currentQuestion, data: { ...currentQuestion.data!, options: newOpts } });
                              }} className="w-full bg-zinc-900/50 border border-zinc-800/50 rounded-lg px-3 py-2 text-[13px] text-zinc-400 focus:outline-none focus:border-zinc-600 focus:text-white" placeholder="Optional explanation when selected..." />
                          </div>
                          {currentQuestion.data!.options.length > 2 && (
                            <button type="button" onClick={() => {
                                const newOpts = currentQuestion.data!.options.filter((_, i) => i !== idx);
                                setCurrentQuestion({ ...currentQuestion, data: { ...currentQuestion.data!, options: newOpts } });
                              }} className="p-2 h-fit text-zinc-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-zinc-800">
                  <button type="submit" className="w-full py-4 rounded-xl text-[14px] font-bold text-zinc-950 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity" style={{ backgroundColor: ACCENT }}>
                    <Save className="w-4 h-4" /> Save Question
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
