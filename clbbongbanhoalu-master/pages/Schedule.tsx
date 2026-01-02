import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Users, ChevronRight, MapPin, Loader2, Info, Check, Phone, ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

import SEO from '../components/SEO';

const Schedule: React.FC = () => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [coaches, setCoaches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [coachFilter, setCoachFilter] = useState('all');

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
        supabase.from('training_sessions').select('*, coaches(*), training_groups(*)').order('start_time'),
        supabase.from('coaches').select('*')
      ]);

      if (sRes.data) setSessions(sRes.data);
      if (cRes.data) setCoaches(cRes.data);
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
              <div className="flex items-center gap-2 text-[#4E9F3D] mb-2">
                <Calendar size={18} fill="currentColor" fillOpacity={0.2} />
                <span className="text-xs font-black uppercase tracking-widest">LỊCH TẬP</span>
              </div>
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">LỊCH DẠY CỦA HLV</h2>
            </div>
            <button className="bg-[#4E9F3D] text-white px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-green-200">
              HÔM NAY <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
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
                    ? 'bg-[#4E9F3D] text-white shadow-xl shadow-green-100 scale-105 z-10'
                    : 'text-slate-400 hover:bg-slate-100'
                    }`}
                >
                  <span className="text-sm font-black mb-1">{day.label}</span>
                  <span className={`text-[9px] font-bold ${selectedDay === day.key ? 'text-green-100' : 'text-slate-300'}`}>
                    {getSessionCount(day.key)} lớp
                  </span>
                  {selectedDay === day.key && (
                    <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-white border-2 border-[#4E9F3D] rounded-full flex items-center justify-center text-[#4E9F3D]">
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
              <MapPin size={14} className="text-[#7AC943]" /> Lọc theo HLV:
            </span>
            <button
              onClick={() => setCoachFilter('all')}
              className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${coachFilter === 'all'
                ? 'bg-[#4E9F3D] text-white shadow-lg shadow-green-200'
                : 'bg-white text-slate-400 border border-slate-200 hover:border-[#7AC943] hover:text-[#4E9F3D]'
                }`}
            >
              Tất cả
            </button>
            {coaches.map(coach => (
              <button
                key={coach.id}
                onClick={() => setCoachFilter(coach.id.toString())}
                className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${coachFilter === coach.id.toString()
                  ? 'bg-[#4E9F3D] text-white shadow-lg shadow-green-200'
                  : 'bg-white text-slate-400 border border-slate-200 hover:border-[#7AC943] hover:text-[#4E9F3D]'
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
                <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400 hover:text-[#4E9F3D] shadow-md transition-all">
                  <ArrowLeft size={20} />
                </button>
                <div className="text-center">
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-1">
                    {daysOfWeek.find(d => d.key === selectedDay)?.full}
                  </h3>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{filteredSessions.length} lớp học</span>
                    <span className="px-2 py-0.5 bg-[#4E9F3D] text-white text-[8px] font-black uppercase rounded-md">Hôm nay</span>
                  </div>
                </div>
                <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400 hover:text-[#4E9F3D] shadow-md transition-all">
                  <ArrowRight size={20} />
                </button>
              </div>

              {/* Session List */}
              <div className="space-y-4 p-4 mt-2">
                {loading ? (
                  <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#4E9F3D]" /></div>
                ) : filteredSessions.length > 0 ? (
                  filteredSessions.map(sess => (
                    <div key={sess.id} className="bg-white/70 backdrop-blur-md p-6 rounded-[2rem] flex justify-between items-center hover:bg-white transition-all group">
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-[#4E9F3D]" />
                          <span className="text-lg font-black text-slate-800">{sess.start_time} - {sess.end_time}</span>
                        </div>
                        <div className="h-4 w-px bg-slate-200"></div>
                        <div className="flex items-center gap-2">
                          <User size={14} className="text-slate-400" />
                          <span className="text-sm font-bold text-slate-500">HLV {sess.coaches?.name}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Có lớp</span>
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
                <div className="flex items-center gap-2 text-[#4E9F3D] mb-2">
                  <Users size={18} fill="currentColor" fillOpacity={0.2} />
                  <span className="text-xs font-black uppercase tracking-widest">Đội ngũ</span>
                </div>
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">Huấn Luyện Viên Riêng</h2>
                <p className="text-sm text-slate-500 mt-2">Đăng ký học với huấn luyện viên đi được hướng dẫn 1 kèm 1</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {coaches.map(coach => (
                  <div key={coach.id} className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-all hover:scale-105">
                    {/* Coach Header */}
                    <div className="bg-gradient-to-r from-[#7AC943] to-[#FFD800] h-24 relative">
                      <div className="absolute bottom-0 left-6 -translate-y-1/2">
                        <div className="w-20 h-20 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-200 flex items-center justify-center">
                          {coach.avatar ? (
                            <img src={coach.avatar} alt={coach.name} className="w-full h-full object-cover" />
                          ) : (
                            <User size={40} className="text-gray-400" />
                          )}
                        </div>
                        {coach.is_featured && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full border-2 border-white flex items-center justify-center">
                            <span className="text-xs font-black">⭐</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Coach Info */}
                    <div className="pt-12 px-6 pb-6">
                      <h3 className="text-lg font-black text-slate-800 mb-1">{coach.name}</h3>
                      <p className="text-xs text-slate-400 font-bold mb-4">Huấn luyện viên</p>

                      {/* Rating */}
                      <div className="flex items-center gap-4 mb-4 text-xs">
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-400">⭐</span>
                          <span className="font-bold text-slate-800">{coach.rating || '5.0'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users size={12} className="text-slate-400" />
                          <span className="font-bold text-slate-600">{coach.students_count || '0'} học sinh</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-slate-600">{coach.experience || '5'} năm</span>
                        </div>
                      </div>

                      {/* Pricing */}
                      <div className="bg-slate-50 rounded-2xl p-4 mb-4 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-slate-600">Học phí:</span>
                          <span className="text-sm font-black text-[#4E9F3D]">{coach.hourly_rate ? coach.hourly_rate.toLocaleString() : '250,000'}đ/giờ</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-slate-600">Thử bài:</span>
                          <span className="text-sm font-black text-slate-600">{coach.trial_rate ? coach.trial_rate.toLocaleString() : '50,000'}đ/giờ</span>
                        </div>
                      </div>

                      {/* Schedule */}
                      {coach.schedule && (
                        <div className="text-xs font-bold text-slate-600 mb-4 space-y-1">
                          {Object.entries(coach.schedule).map(([day, times]: any) => (
                            <div key={day}>
                              <span className="font-black text-slate-800">{day}:</span> {times}
                            </div>
                          ))}
                          {coach.additional_schedule && (
                            <div className="text-blue-600 font-black">+{coach.additional_schedule}</div>
                          )}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-4 border-t border-slate-100">
                        <button className="flex-1 bg-white text-slate-600 border border-slate-300 rounded-full py-2.5 text-xs font-black uppercase hover:bg-slate-50 transition-all">
                          Chi tiết
                        </button>
                        <button className="flex-1 bg-[#4E9F3D] text-white rounded-full py-2.5 text-xs font-black uppercase hover:bg-[#3d8230] transition-all shadow-md">
                          Liên hệ
                        </button>
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
                <div className="w-10 h-10 bg-green-50 text-[#4E9F3D] rounded-2xl flex items-center justify-center">
                  <Info size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-800">Lịch dạy cố định hàng tuần</h4>
                  <p className="text-[11px] font-bold text-slate-400">Liên hệ CLB để đăng ký học với HLV</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center gap-5 shadow-sm">
                <div className="w-10 h-10 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
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
    </main>
  );
};

export default Schedule;
