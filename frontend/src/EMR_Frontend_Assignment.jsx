import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar as CalendarIcon, Clock, Video, MapPin, CheckCircle, XCircle,
  ChevronLeft, ChevronRight, Search, Filter,
  User, LogOut, FileText, Mail
} from 'lucide-react';

/* ===================================================================
   MOCK DATA LAYER
   =================================================================== */
const MOCK_DB = [
    {
        "id": "1",
        "patientName": "Surender",
        "date": "2025-12-10",
        "time": "09:00 AM",
        "duration": 30,
        "doctorName": "Dr. Rakesh Kumar",
        "status": "Confirmed",
        "mode": "In-Person",
        "type": "Follow-up",
        "description": "Resume Diabetes Management",
        "patientEmail": "sarah@email.com"
    },
    {
        "id": "2",
        "patientName": "Satendra",
        "date": "2025-12-10",
        "time": "10:00 AM",
        "duration": 45,
        "doctorName": "Dr. Sandeep N",
        "status": "Scheduled",
        "mode": "In-Person",
        "type": "Consultation",
        "description": "Annual Physical Examination",
        "patientEmail": "michael@email.com"
    },
    {
        "id": "3",
        "patientName": "Dipti",
        "date": "2025-12-10",
        "time": "11:30 AM",
        "duration": 30,
        "doctorName": "Dr. Rohit Bhakar",
        "status": "Confirmed",
        "mode": "Video Call",
        "type": "Follow-up",
        "description": "Follow-up for Persistent Cough",
        "patientEmail": "emily@email.com"
    },
    {
        "id": "4",
        "patientName": "Vinay",
        "date": "2025-12-11",
        "time": "08:30 AM",
        "duration": 60,
        "doctorName": "Dr. Akhilesh Mathur",
        "status": "Upcoming",
        "mode": "In-Person",
        "type": "Consultation",
        "description": "Cardiology Consultation",
        "patientEmail": "robert@email.com"
    },
    {
        "id": "5",
        "patientName": "Mona Lisa",
        "date": "2025-12-11",
        "time": "02:00 PM",
        "duration": 45,
        "doctorName": "Dr. Akhilesh Mathur",
        "status": "Scheduled",
        "mode": "Video Call",
        "type": "Follow-up",
        "description": "Post-op Follow-up",
        "patientEmail": "lisa@email.com"
    },
    {
        "id": "6",
        "patientName": "David Miller",
        "date": "2025-12-08",
        "time": "10:00 AM",
        "duration": 30,
        "doctorName": "Dr. Sandeep N",
        "status": "Completed",
        "mode": "In-Person",
        "type": "Check-up",
        "description": "Routine Check-up",
        "patientEmail": "david@email.com"
    },
    {
        "id": "7",
        "patientName": "Maria",
        "date": "2025-12-06",
        "time": "03:30 PM",
        "duration": 60,
        "doctorName": "Dr. Rohit Bhakar",
        "status": "Completed",
        "mode": "In-Person",
        "type": "Consultation",
        "description": "Heart Condition Review",
        "patientEmail": "maria@email.com"
    },
    {
        "id": "8",
        "patientName": "James Taylor",
        "date": "2025-12-07",
        "time": "09:30 AM",
        "duration": 30,
        "doctorName": "Dr. Sandeep N",
        "status": "Cancelled",
        "mode": "Video Call",
        "type": "Follow-up",
        "description": "Medication Review",
        "patientEmail": "james@email.com"
    },
    {
        "id": "9",
        "patientName": "Jennifer Lawrence",
        "date": "2025-12-07",
        "time": "11:00 AM",
        "duration": 45,
        "doctorName": "Dr. Akhilesh Mathur",
        "status": "Upcoming",
        "mode": "In-Person",
        "type": "Consultation",
        "description": "New Patient Assessment",
        "patientEmail": "jennifer@email.com"
    },
    {
        "id": "10",
        "patientName": "Thomas Edison",
        "date": "2025-12-06",
        "time": "01:00 PM",
        "duration": 60,
        "doctorName": "Dr. Rohit Bhakar",
        "status": "Scheduled",
        "mode": "In-Person",
        "type": "Consultation",
        "description": "Cardiac Stress Test Review",
        "patientEmail": "thomas@email.com"
    }
];

/* ===================================================================
   SERVICE ADAPTER
   =================================================================== */
const AppointmentService = {
  get_appointments: async (filters = {}) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let results = [...MOCK_DB];
        if (filters.date) results = results.filter(app => app.date === filters.date);
        resolve(results);
      }, 300);
    });
  },
   
  update_appointment_status: async (id, newStatus) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = MOCK_DB.findIndex(app => app.id === id);
        if (index !== -1) {
          MOCK_DB[index].status = newStatus;
          resolve(MOCK_DB[index]);
        }
      }, 200);
    });
  }
};

/* ===================================================================
   UI COMPONENTS
   =================================================================== */

const Sidebar = () => (
  <div className="w-16 md:w-20 bg-white border-r border-slate-200 flex flex-col items-center py-6 gap-8 shadow-sm z-20 shrink-0 hidden md:flex h-full">
    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-indigo-200 shadow-lg cursor-pointer tracking-tighter">
      EMR
    </div>
    <nav className="flex flex-col gap-6 w-full items-center">
      <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 cursor-pointer hover:scale-105 shadow-sm transition-all">
        <CalendarIcon size={22} />
      </div>
    </nav>
  </div>
);

const Header = () => (
  <header className="h-16 md:h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shrink-0">
    <div>
      <h1 className="text-xl md:text-2xl font-bold text-slate-800">Appointment Management</h1>
      <p className="text-xs md:text-sm text-slate-500 mt-0.5 hidden sm:block">Schedule and manage patient appointments</p>
    </div>
    <div className="flex items-center gap-3"></div>
  </header>
);

const StatsWidget = ({ appointments, activeTab, selectedDate }) => {
    const totalCount = appointments.length;
    const confirmedCount = appointments.filter(a => a.status === 'Confirmed').length;

    let countLabel = "";
    if (activeTab === 'Date') {
        countLabel = `Total Appointments on ${selectedDate}`;
    } else {
        countLabel = `Total ${activeTab} Appointments`;
    }

    return (
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between h-28 md:h-32 hover:border-blue-100 transition-colors">
          <div className="flex justify-between items-start">
             <div className="bg-blue-50 w-8 h-8 rounded-lg flex items-center justify-center text-blue-600">
                <CalendarIcon size={16}/>
             </div>
             <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">Total</span>
          </div>
          <div>
            <span className="text-2xl md:text-3xl font-bold text-slate-800">{totalCount}</span>
            <p className="text-xs font-medium text-slate-400 mt-1">{countLabel}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between h-28 md:h-32 hover:border-emerald-100 transition-colors">
           <div className="flex justify-between items-start">
             <div className="bg-emerald-50 w-8 h-8 rounded-lg flex items-center justify-center text-emerald-600">
                <CheckCircle size={16}/>
             </div>
             <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">Confirmed</span>
           </div>
           <div>
            <span className="text-2xl md:text-3xl font-bold text-slate-800">{confirmedCount}</span>
            <p className="text-xs font-medium text-slate-400 mt-1">Confirmed Appointments</p>
          </div>
        </div>
      </div>
    );
};

// --- MAIN CONTAINER ---
const EMR_Frontend_Assignment = () => {
  const getLocalTodayDate = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(getLocalTodayDate()); 
  const [currentMonth, setCurrentMonth] = useState(new Date()); 
  const [activeTab, setActiveTab] = useState("Today");

  // --- FILTERS STATE ---
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modeFilter, setModeFilter] = useState("All"); // Changed from doctorFilter to modeFilter

  const getDaysInMonth = (dateObj) => new Date(dateObj.getFullYear(), dateObj.getMonth() + 1, 0).getDate();
  const handleMonthChange = (inc) => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + inc, 1));

  // Extract unique modes for the dropdown
  const uniqueModes = useMemo(() => {
    return [...new Set(MOCK_DB.map(a => a.mode))];
  }, []);

  const fetchAppointments = async (date = null, filterType = null) => {
    setLoading(true);
    let filters = {};
    const systemTodayStr = getLocalTodayDate();

    if (filterType === 'Date' && date) {
      filters.date = date;
    } else if (filterType === 'Today') {
       filters.date = systemTodayStr;
    }

    try {
        let data = await AppointmentService.get_appointments(filters);

        // --- TAB LOGIC ---
        if (filterType === 'Today') {
            data = data.filter(app => app.date === systemTodayStr);
        } else if (filterType === 'Upcoming') {
            data = data.filter(app => app.date >= systemTodayStr);
        } else if (filterType === 'Past') {
            data = data.filter(app => app.date < systemTodayStr);
        }
        
        setAppointments(data);
    } catch (error) {
        console.error("Fetch error:", error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => { 
      const today = getLocalTodayDate();
      fetchAppointments(today, 'Today'); 
  }, []);

  // --- FILTER LOGIC ---
  const filteredAppointments = useMemo(() => {
    return appointments.filter(app => {
      // 1. Search Filter
      const matchesSearch = 
        app.patientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
        app.doctorName.toLowerCase().includes(searchQuery.toLowerCase());
      
      // 2. Status Filter
      const matchesStatus = statusFilter === 'All' || app.status === statusFilter;

      // 3. Mode Filter (Updated)
      const matchesMode = modeFilter === 'All' || app.mode === modeFilter;

      return matchesSearch && matchesStatus && matchesMode;
    });
  }, [appointments, searchQuery, statusFilter, modeFilter]);

  const handleDateClick = (day) => {
    const year = currentMonth.getFullYear();
    const month = (currentMonth.getMonth() + 1).toString().padStart(2, '0');
    const dayStr = day.toString().padStart(2, '0');
    const fullDate = `${year}-${month}-${dayStr}`;

    setSelectedDate(fullDate);
    setActiveTab('Date');
    fetchAppointments(fullDate, 'Date');
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setSearchQuery("");
    
    if (tab === 'All') fetchAppointments(null, null);
    else if (tab === 'Date') fetchAppointments(selectedDate, 'Date');
    else if (tab === 'Today') {
        const today = getLocalTodayDate();
        setSelectedDate(today);
        setCurrentMonth(new Date()); 
        fetchAppointments(today, 'Today');
    }
    else fetchAppointments(null, tab);
  };

  const handleStatusUpdate = async (id, newStatus) => {
    await AppointmentService.update_appointment_status(id, newStatus);
    if (activeTab === 'Date') fetchAppointments(selectedDate, 'Date');
    else if (activeTab === 'Today') fetchAppointments(getLocalTodayDate(), 'Today');
    else fetchAppointments(null, activeTab);
  };

  const getStatusStyle = (status) => {
    switch(status) {
      case 'Confirmed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Upcoming': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Cancelled': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Completed': return 'bg-gray-100 text-gray-600 border-gray-200';
      case 'Scheduled': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default: return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  const getDateDotColor = (dateStr) => {
    const dayAppointments = MOCK_DB.filter(a => a.date === dateStr);
    if (dayAppointments.length === 0) return null;
    if (dayAppointments.some(a => a.status === 'Confirmed')) return 'bg-emerald-500';
    if (dayAppointments.some(a => a.status === 'Scheduled')) return 'bg-indigo-500';
    if (dayAppointments.some(a => a.status === 'Upcoming')) return 'bg-blue-500';
    if (dayAppointments.some(a => a.status === 'Cancelled')) return 'bg-rose-500';
    return 'bg-slate-400';
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col h-full min-w-0">
        <Header />

        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden p-4 lg:p-6 gap-6">

           {/* --- LEFT PANEL --- */}
           <div className="w-full lg:w-80 flex flex-col shrink-0 h-full overflow-y-auto pr-1">
              <StatsWidget 
                appointments={filteredAppointments} 
                activeTab={activeTab} 
                selectedDate={selectedDate} 
              />

              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-fit">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-slate-700 text-sm">
                    {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </h3>
                  <div className="flex gap-1">
                    <button onClick={() => handleMonthChange(-1)} className="p-1 hover:bg-slate-50 rounded text-slate-400 hover:text-indigo-600"><ChevronLeft size={16}/></button>
                    <button onClick={() => handleMonthChange(1)} className="p-1 hover:bg-slate-50 rounded text-slate-400 hover:text-indigo-600"><ChevronRight size={16}/></button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-y-4 gap-x-2 text-center text-sm">
                  {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => <span key={d} className="text-slate-400 font-semibold text-xs">{d}</span>)}
                  {[...Array(getDaysInMonth(currentMonth))].map((_, i) => {
                    const day = i + 1;
                    const year = currentMonth.getFullYear();
                    const month = (currentMonth.getMonth() + 1).toString().padStart(2, '0');
                    const dayStr = day.toString().padStart(2, '0');
                    const currentGridDate = `${year}-${month}-${dayStr}`;
                    const isSelected = selectedDate === currentGridDate && (activeTab === 'Date' || activeTab === 'Today');
                    const dotColor = getDateDotColor(currentGridDate);

                    return (
                      <button
                        key={day}
                        onClick={() => handleDateClick(day)}
                        className={`
                          h-8 w-8 mx-auto flex items-center justify-center rounded-full text-xs font-medium transition-all relative
                          ${isSelected
                            ? 'bg-slate-900 text-white shadow-md'
                            : 'text-slate-600 hover:bg-slate-100'}
                          ${dotColor && !isSelected ? 'font-bold' : ''}
                        `}
                      >
                        {day}
                        {dotColor && !isSelected && (
                            <span className={`absolute bottom-1 w-1 h-1 rounded-full ${dotColor}`}></span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
           </div>

           {/* --- RIGHT PANEL --- */}
           <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col overflow-hidden">
              <div className="px-4 md:px-8 pt-6 border-b border-slate-100 overflow-x-auto">
                <div className="flex gap-8 min-w-max">
                  {['Upcoming', 'Today', 'Past', 'All'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => handleTabClick(tab)}
                      className={`pb-4 text-sm font-semibold transition-all border-b-2 ${
                        activeTab === tab
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                  {(activeTab === 'Date') && (
                      <button className="pb-4 text-sm font-semibold border-b-2 border-blue-600 text-blue-600 whitespace-nowrap">
                        {selectedDate}
                      </button>
                  )}
                </div>
              </div>

              {/* --- SEARCH AND FILTER CONTROLS --- */}
              <div className="px-4 md:px-8 py-4 bg-white flex flex-col sm:flex-row gap-4 sm:items-center">
                
                {/* Search Bar */}
                <div className="relative flex-1">
                   <Search size={16} className="absolute left-4 top-3 text-slate-400"/>
                   <input
                     type="text"
                     placeholder="Search patient or doctor..."
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="w-full pl-11 pr-4 py-2.5 text-sm bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-100 text-slate-600 placeholder:text-slate-400 outline-none"
                   />
                </div>

                {/* Filters */}
                <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                    {/* Status Filter Dropdown */}
                    <div className="relative">
                        <select 
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="appearance-none pl-4 pr-8 py-2.5 bg-slate-50 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer outline-none focus:ring-2 focus:ring-blue-100 border-none"
                        >
                            <option value="All">All Status</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Scheduled">Scheduled</option>
                            <option value="Upcoming">Upcoming</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                        <Filter size={14} className="absolute right-3 top-3 text-slate-400 pointer-events-none"/>
                    </div>

                    {/* Mode Filter Dropdown (Replaced Doctor Filter) */}
                    <div className="relative">
                        <select 
                            value={modeFilter}
                            onChange={(e) => setModeFilter(e.target.value)}
                            className="appearance-none pl-4 pr-8 py-2.5 bg-slate-50 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer outline-none focus:ring-2 focus:ring-blue-100 border-none"
                        >
                            <option value="All">All Modes</option>
                            {uniqueModes.map(mode => (
                                <option key={mode} value={mode}>{mode}</option>
                            ))}
                        </select>
                        {/* Using Video icon as a generic indicator for Mode */}
                        <Video size={14} className="absolute right-3 top-3 text-slate-400 pointer-events-none"/>
                    </div>
                </div>
              </div>

              {/* --- LIST --- */}
              <div className="flex-1 overflow-y-auto px-4 md:px-8 py-2">
                {loading ? (
                  <div className="flex flex-col items-center justify-center h-64 text-slate-400 animate-pulse">
                    <p>Loading appointments...</p>
                  </div>
                ) : filteredAppointments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-slate-400 border-2 border-dashed border-slate-50 rounded-xl m-4">
                    <p className="font-medium">No appointments found</p>
                    <p className="text-xs mt-2">
                        {searchQuery || statusFilter !== 'All' || modeFilter !== 'All' 
                            ? "Try adjusting your filters." 
                            : "Try selecting a different date."}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 pb-8">
                    {filteredAppointments.map((app) => (
                      <div key={app.id} className="group bg-white border border-slate-100 rounded-xl p-5 hover:shadow-md transition-all duration-200 flex flex-col relative">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex gap-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0
                                    ${app.mode.includes('Video') ? 'bg-blue-500' : 'bg-indigo-500'}`}>
                                    {app.patientName.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 text-base">{app.patientName}</h4>
                                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 flex-wrap">
                                        <span className="flex items-center gap-1"><Clock size={12}/> {app.date} • {app.time}</span>
                                        <span className="text-slate-300 hidden sm:inline">|</span>
                                        <span>{app.duration} min</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                        {app.mode.includes('Video') ? <Video size={12} className="text-blue-500"/> : <MapPin size={12} className="text-indigo-500"/>}
                                        <span>{app.doctorName}</span>
                                    </div>
                                </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusStyle(app.status)}`}>
                                {app.status}
                            </span>
                        </div>
                        <div className="pl-16 border-l-2 border-slate-50 ml-6 space-y-2 mb-2">
                            <div className="flex items-center gap-2 text-xs text-slate-600">
                                <span className="p-1 bg-slate-100 rounded text-slate-500"><FileText size={10}/></span>
                                <span className="font-medium">{app.type}</span>
                            </div>
                            <div className="text-xs text-slate-500">
                                <span className="font-semibold">Reason:</span> {app.description}
                            </div>
                             <div className="text-xs text-slate-400 flex items-center gap-1">
                                <Mail size={10}/> {app.patientEmail}
                            </div>
                        </div>
                        {app.status !== 'Cancelled' && app.status !== 'Completed' && (
                             <div className="sm:absolute sm:bottom-5 sm:right-5 flex gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity mt-4 sm:mt-0">
                               <button onClick={() => handleStatusUpdate(app.id, 'Confirmed')} className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-lg hover:bg-emerald-600 hover:text-white transition"><CheckCircle size={14} /> Confirm</button>
                               <button onClick={() => handleStatusUpdate(app.id, 'Cancelled')} className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-1.5 bg-rose-50 text-rose-600 text-xs font-bold rounded-lg hover:bg-rose-600 hover:text-white transition"><XCircle size={14} /> Cancel</button>
                             </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default EMR_Frontend_Assignment;