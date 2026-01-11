import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Users, ChevronRight, MapPin, Loader2, Info, Check, Phone, ArrowLeft, ArrowRight, X, Star, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

import SEO from '../components/SEO';

const Schedule: React.FC = () => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [coaches, setCoaches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [coachFilter, setCoachFilter] = useState('all');
  const [selectedCoach, setSelectedCoach] = useState<any | null>(null);

  const daysOfWeek = [
    { key: 'Monday', label: 'T2', full: 'Thứ 2' },
    { key: 'Tuesday', label: 'T3', full: 'Thứ 3' },
    { key: 'Wednesday', label: 'T4', full: 'Thứ 4' },
    { key: 'Thursday', label: 'T5', full: 'Thứ 5' },
    { key: 'Friday', label: 'T6', full: 'Thứ 6' },
    { key: 'Saturday', label: 'T7', full: 'Thứ 7' },
    { key: 'Sunday', label: 'CN', full: 'Chủ nhật' }
  ];

  useEffect(() => {
    initSchedule();
  }, []);

  const initSchedule = async () => {
    setLoading(true);
    try {
      const [sRes, cRes] = await Promise.all([
        supabase.from('training_sessions').select('*').order('start_time'),
        supabase.from('coaches').select('*')
      ]);

      const loadedCoaches = cRes.data || [];
      const loadedSessions = sRes.data || [];

      // Manually join coaches to sessions since foreign key join might fail
      const enrichedSessions = loadedSessions.map(session => ({
        ...session,
        coaches: loadedCoaches.find(c => c.id === session.coach_id) || null
      }));

      setSessions(enrichedSessions);
      setCoaches(loadedCoaches);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredSessions = sessions.filter(s =>
    s.day === selectedDay &&
    (coachFilter === 'all' || s.coach_id.toString() === coachFilter)
  );

  const getSessionCount = (dayKey: string) => sessions.filter(s => s.day === dayKey).length;

  // New helper to fetch dynamic schedule for a coach from the sessions list
  const getCoachSchedule = (coachId: number) => {
    const coachSessions = sessions.filter(s => s.coach_id === coachId);
    if (coachSessions.length === 0) return null;

    // Group by day to avoid duplicates if multiple slots in one day
    const scheduleByDay: { [key: string]: string[] } = {};
    
    coachSessions.forEach(session => {
       // Convert English Day to Vietnamese Short Label
       const dayLabel = daysOfWeek.find(d => d.key === session.day)?.label || session.day;
       if (!scheduleByDay[dayLabel]) scheduleByDay[dayLabel] = [];
       // Format time from "18:00:00" to "18:00"
       const start = session.start_time.slice(0, 5);
       const end = session.end_time.slice(0, 5);
       scheduleByDay[dayLabel].push(`${start}-${end}`);
    });

    return scheduleByDay;
  };

  return (
    <main className="bg-[#f8fafc] min-h-screen pb-20">
      <SEO
        title="Bảng Giá & Lịch Tập - CLB Bóng Bàn Hoa Lư"
        description="Bảng giá dịch vụ và lịch dạy chi tiết của các huấn luyện viên tại CLB Hoa Lư."
      />

      {/* Schedule Section */}
      <section className="bg-white pt-20 pb-40">
        <div className="max-w-[1200px] mx-auto px-6">
          <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center gap-2 text-[#0891b2] mb-2">
                <Calendar size={18} fill="currentColor" fillOpacity={0.2} />
                <span className="text-xs font-black uppercase tracking-widest">LỊCH TẬP</span>
              </div>
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">LỊCH DẠY CỦA HLV</h2>
            </div>
            <button className="bg-[#bdffff] text-[#0891b2] px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-cyan-200">
              HÔM NAY <div className="w-1.5 h-1.5 bg-[#0891b2] rounded-full animate-pulse"></div>
            </button>
          </header>

          {/* Day Selector */}
          <div className="flex justify-center mb-10">
            <div className="bg-slate-50 p-2 rounded-[2rem] flex gap-2 overflow-x-auto no-scrollbar max-w-full">
              {daysOfWeek.map((day) => (
                <button
                  key={day.key}
                  onClick={() => setSelectedDay(day.key)}
                  className={`flex flex-col items-center min-w-[70px] py-3 rounded-2xl transition-all relative ${selectedDay === day.key
                    ? 'bg-[#bdffff] text-[#0891b2] shadow-xl shadow-cyan-100 scale-105 z-10'
                    : 'text-slate-400 hover:bg-slate-100'
                    }`}
                >
                  <span className="text-sm font-black mb-1">{day.label}</span>
                  <span className={`text-[9px] font-bold ${selectedDay === day.key ? 'text-[#0e1b3c]' : 'text-slate-300'}`}>
                    {getSessionCount(day.key)} lớp
                  </span>
                  {selectedDay === day.key && (
                    <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-white border-2 border-[#bdffff] rounded-full flex items-center justify-center text-[#0891b2]">
                      <Check size={8} strokeWidth={4} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* HLV Filter */}
          <div className="flex flex-wrap justify-center items-center gap-3 mb-16">
            <span className="text-xs font-black text-slate-400 mr-2 flex items-center gap-1">
              <MapPin size={14} className="text-[#0891b2]" /> Lọc theo HLV:
            </span>
            <button
              onClick={() => setCoachFilter('all')}
              className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${coachFilter === 'all'
                ? 'bg-[#bdffff] text-[#0891b2] shadow-lg shadow-cyan-200'
                : 'bg-white text-slate-400 border border-slate-200 hover:border-[#bdffff] hover:text-[#0891b2]'
                }`}
            >
              Tất cả
            </button>
            {coaches.map(coach => (
              <button
                key={coach.id}
                onClick={() => setCoachFilter(coach.id.toString())}
                className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${coachFilter === coach.id.toString()
                  ? 'bg-[#bdffff] text-[#0891b2] shadow-lg shadow-cyan-200'
                  : 'bg-white text-slate-400 border border-slate-200 hover:border-[#bdffff] hover:text-[#0891b2]'
                  }`}
              >
                {coach.name.split(' ').pop()}
              </button>
            ))}
          </div>

          {/* Main Dashboard Card */}
          <div className="max-w-[800px] mx-auto">
            <div className="bg-[#f0f4f8] p-4 rounded-[3rem] border-4 border-white shadow-2xl overflow-hidden relative">
              {/* Dashboard Header */}
              <div className="flex justify-between items-center py-6 px-4">
                <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400 hover:text-[#0891b2] shadow-md transition-all">
                  <ArrowLeft size={20} />
                </button>
                <div className="text-center">
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-1">
                    {daysOfWeek.find(d => d.key === selectedDay)?.full}
                  </h3>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{filteredSessions.length} lớp học</span>
                    <span className="px-2 py-0.5 bg-[#bdffff] text-[#0891b2] text-[8px] font-black uppercase rounded-md">Hôm nay</span>
                  </div>
                </div>
                <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400 hover:text-[#0891b2] shadow-md transition-all">
                  <ArrowRight size={20} />
                </button>
              </div>

              {/* Session List */}
              <div className="space-y-4 p-4 mt-2">
                {loading ? (
                  <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#0891b2]" /></div>
                ) : filteredSessions.length > 0 ? (
                  filteredSessions.map(sess => (
                    <div key={sess.id} className="bg-white/70 backdrop-blur-md p-6 rounded-[2rem] flex justify-between items-center hover:bg-white transition-all group">
                      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-[#0891b2]" />
                          <span className="text-lg font-black text-slate-800">{sess.start_time.slice(0, 5)} - {sess.end_time.slice(0, 5)}</span>
                        </div>
                        <div className="hidden md:block h-4 w-px bg-slate-200"></div>
                        <div className="flex items-center gap-2">
                          <User size={14} className="text-slate-400" />
                          <span className="text-sm font-bold text-slate-500">HLV {sess.coaches?.name}</span>
                        </div>
                        <div className="hidden md:block h-4 w-px bg-slate-200"></div>
                        <div className="flex items-center gap-2 text-blue-500">
                          <MapPin size={14} />
                          <span className="text-[10px] font-black uppercase tracking-widest">{sess.location}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
                        <span className="text-[10px] font-bold text-cyan-600 uppercase tracking-widest">Có lớp</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white/50 backdrop-blur-md p-20 rounded-[2rem] flex flex-col items-center justify-center text-slate-300">
                    <Calendar size={60} strokeWidth={1} />
                    <p className="mt-4 font-black uppercase text-xs tracking-widest">Chưa có lịch dạy</p>
                  </div>
                )}
              </div>

              {/* Swipe hint */}
              <div className="text-center py-8">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-3">
                  <ChevronRight size={10} className="rotate-180" /> Vuốt hoặc nhấn mũi tên để xem ngày khác <ChevronRight size={10} />
                </p>
              </div>
            </div>

            {/* Coaches Team Section */}
            <div className="mt-16">
              <div className="flex flex-col items-center md:items-start mb-10">
                <div className="flex items-center gap-2 text-[#0891b2] mb-2">
                  <Users size={18} fill="currentColor" fillOpacity={0.2} />
                  <span className="text-xs font-black uppercase tracking-widest">Đội ngũ</span>
                </div>
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">Huấn Luyện Viên Riêng</h2>
                <p className="text-sm text-slate-500 mt-2">Đăng ký học với huấn luyện viên đi được hướng dẫn 1 kèm 1</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {coaches.map(coach => (
                  <div key={coach.id} className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group border border-slate-100">
                    {/* Coach Header - Improved Gradient */}
                    <div className="bg-gradient-to-br from-[#0891b2] via-[#bdffff] to-[#e0fafa] h-28 relative overflow-hidden">
                      {/* Decorative circles */}
                      <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full"></div>
                      <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/10 rounded-full"></div>

                      {/* Avatar */}
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                        <div className="w-24 h-24 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          {coach.avatar ? (
                            <img src={coach.avatar} alt={coach.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-[#bdffff]/20 to-[#FFD800]/20 flex items-center justify-center">
                              <User size={44} className="text-[#0891b2]" strokeWidth={1.5} />
                            </div>
                          )}
                        </div>
                        {coach.is_featured && (
                          <div className="absolute -top-1 -right-1 w-7 h-7 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full border-2 border-white flex items-center justify-center shadow-lg">
                            <span className="text-sm">⭐</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Coach Info */}
                    <div className="pt-16 px-6 pb-6 text-center">
                      <h3 className="text-xl font-black text-slate-800 mb-1">{coach.name}</h3>
                      <p className="text-xs text-[#0891b2] font-bold mb-5 uppercase tracking-wider">Huấn luyện viên</p>

                      {/* Stats Row */}
                      <div className="flex items-center justify-center gap-6 mb-5">

                        <div className="flex flex-col items-center">
                          <span className="text-lg font-black text-slate-800">{coach.students_count || '0'}</span>
                          <span className="text-[10px] text-slate-400 font-medium">Học sinh</span>
                        </div>
                        <div className="w-px h-8 bg-slate-200"></div>
                        <div className="flex flex-col items-center">
                          <span className="text-lg font-black text-slate-800">{coach.experience || '1'}+</span>
                          <span className="text-[10px] text-slate-400 font-medium">Năm KN</span>
                        </div>
                      </div>

                      {/* Pricing - Better Design */}
                      <div className="bg-gradient-to-r from-[#bdffff]/10 to-[#0891b2]/10 rounded-2xl p-4 mb-4 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-slate-500">Học phí:</span>
                          <span className="text-lg font-black text-[#0891b2]">{coach.hourly_rate ? coach.hourly_rate.toLocaleString() : '250,000'}đ<span className="text-xs text-slate-400 font-medium">/giờ</span></span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-600">Thuê bàn/giờ:</span>
                          <span className="text-sm font-black text-slate-600">{coach.trial_rate ? coach.trial_rate.toLocaleString() : '50,000'}đ<span className="text-xs text-slate-400 font-medium">/giờ</span></span>
                        </div>
                      </div>

                      {/* Dynamic Schedule from Admin Panel */}
                      {getCoachSchedule(coach.id) && (
                        <div className="text-xs font-bold text-slate-600 mb-4 space-y-1 text-left bg-slate-50 rounded-xl p-3">
                          {Object.entries(getCoachSchedule(coach.id) || {}).map(([day, times]) => (
                            <div key={day} className="flex gap-2">
                              <span className="font-black text-[#0891b2] min-w-[24px]">{day}:</span>
                              <span className="text-slate-500">{(times as string[]).join(', ')}</span>
                            </div>
                          ))}
                        </div>
                      )}


                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-4">
                        <button
                          onClick={() => setSelectedCoach(coach)}
                          className="flex-1 bg-white text-slate-600 border-2 border-slate-200 rounded-full py-3 text-xs font-black uppercase hover:bg-slate-50 hover:border-slate-300 transition-all"
                        >
                          Chi tiết
                        </button>
                        <a
                          href="tel:0913909012"
                          className="flex-1 bg-gradient-to-r from-[#bdffff] to-[#0891b2] text-white rounded-full py-3 text-xs font-black uppercase hover:shadow-lg hover:shadow-cyan-200 transition-all text-center"
                        >
                          Liên hệ
                        </a>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add Coach Button */}
                {coaches.length === 0 && (
                  <div className="col-span-full bg-white rounded-3xl p-12 flex flex-col items-center justify-center text-center">
                    <Users size={60} className="text-slate-300 mb-4" />
                    <p className="text-slate-500 font-bold">Chưa có huấn luyện viên nào</p>
                    <p className="text-xs text-slate-400 mt-2">Vui lòng quay lại sau</p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Info */}
            <div className="mt-12 space-y-4">
              <div className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center gap-5 shadow-sm">
                <div className="w-10 h-10 bg-cyan-50 text-[#0891b2] rounded-2xl flex items-center justify-center">
                  <Info size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-800">Lịch dạy cố định hàng tuần</h4>
                  <p className="text-[11px] font-bold text-slate-400">Liên hệ CLB để đăng ký học với HLV</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center gap-5 shadow-sm">
                <div className="w-10 h-10 bg-cyan-50 text-cyan-600 rounded-2xl flex items-center justify-center">
                  <Phone size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-800">Hotline: 0913 909 012</h4>
                  <p className="text-[11px] font-bold text-slate-400">Sắp xếp lịch học riêng ngoài giờ trên</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coach Detail Modal */}
      {selectedCoach && (
        <div
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedCoach(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-br from-[#0891b2] via-[#bdffff] to-[#e0fafa] p-8 rounded-t-3xl relative">
              <button
                onClick={() => setSelectedCoach(null)}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 p-2 rounded-full text-white transition-all"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white flex items-center justify-center">
                  {selectedCoach.avatar ? (
                    <img src={selectedCoach.avatar} alt={selectedCoach.name} className="w-full h-full object-cover" />
                  ) : (
                    <User size={40} className="text-[#0891b2]" />
                  )}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white mb-1">{selectedCoach.name}</h3>
                  <p className="text-white/80 text-sm font-medium">Huấn luyện viên</p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Stats */}
              <div className="flex justify-around py-4 bg-slate-50 rounded-2xl">

                <div className="text-center">
                  <div className="text-xl font-black text-slate-800">{selectedCoach.students_count || '0'}</div>
                  <p className="text-xs text-slate-400 font-medium">Học sinh</p>
                </div>
                <div className="text-center">
                  <div className="text-xl font-black text-slate-800">{selectedCoach.experience || '1'}+</div>
                  <p className="text-xs text-slate-400 font-medium">Năm KN</p>
                </div>
              </div>

              {/* Bio */}
              {selectedCoach.bio && (
                <div>
                  <h4 className="font-black text-slate-800 mb-2 flex items-center gap-2">
                    <Award size={16} className="text-[#0891b2]" /> Giới thiệu
                  </h4>
                  <p className="text-slate-600 text-sm leading-relaxed">{selectedCoach.bio}</p>
                </div>
              )}

              {/* Pricing */}
              <div className="bg-gradient-to-r from-[#bdffff]/10 to-[#0891b2]/10 rounded-2xl p-5">
                <h4 className="font-black text-slate-800 mb-3">💰 Học phí</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Học phí/giờ:</span>
                    <span className="text-lg font-black text-[#0891b2]">
                      {selectedCoach.hourly_rate ? selectedCoach.hourly_rate.toLocaleString() : '250,000'}đ
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Thuê bàn/giờ:</span>
                    <span className="text-lg font-black text-slate-600">
                      {selectedCoach.trial_rate ? selectedCoach.trial_rate.toLocaleString() : '50,000'}đ
                    </span>
                  </div>
                </div>
              </div>




              {/* Dynamic Schedule in Modal */}
              {getCoachSchedule(selectedCoach.id) && (
                <div>
                  <h4 className="font-black text-slate-800 mb-3">📅 Lịch dạy (Cập nhật từ Admin)</h4>
                  <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                    {Object.entries(getCoachSchedule(selectedCoach.id) || {}).map(([day, times]) => (
                      <div key={day} className="flex gap-3 text-sm">
                        <span className="font-black text-[#0891b2] min-w-[30px]">{day}:</span>
                        <span className="text-slate-600">{(times as string[]).join(', ')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Buttons */}
              <div className="flex gap-3 pt-4">
                <a
                  href="tel:0913909012"
                  className="flex-1 bg-gradient-to-r from-[#bdffff] to-[#0891b2] text-white rounded-full py-4 text-sm font-black uppercase text-center hover:shadow-lg hover:shadow-cyan-200 transition-all flex items-center justify-center gap-2"
                >
                  <Phone size={18} /> Gọi ngay
                </a>
                <a
                  href="https://zalo.me/0913909012"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-blue-500 text-white rounded-full py-4 text-sm font-black uppercase text-center hover:shadow-lg hover:shadow-blue-200 transition-all"
                >
                  Chat Zalo
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Schedule;
