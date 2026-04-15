import { useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, BookOpen, Clock, Award, FileText, ExternalLink, Users, Building, Library, Utensils, Dumbbell, Trophy, Bus, School, Home, Phone, Info, AlertCircle } from 'lucide-react';
import { useLang } from '../context/LanguageContext';
import { t } from '../data/translations';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { DEPARTMENTS } from '../data/departments';

// Fee Structure Data
const feeData = [
  { course: 'BDS', govt: '₹96,058/year', private: '₹4,12,700/year', nri: '₹5,12,700–7,53,750/year' },
  { course: 'MDS - Oral Surgery', govt: '₹3,72,576/year', private: '₹6,20,676/year', nri: '₹12,15,500/year' },
  { course: 'MDS - Orthodontics', govt: '₹3,72,576/year', private: '₹6,20,676/year', nri: '₹14,15,500/year' },
  { course: 'MDS - Conservative Dentistry', govt: '₹3,72,576/year', private: '₹6,20,676/year', nri: '₹14,15,500/year' },
  { course: 'MDS - Periodontology', govt: '₹3,72,576/year', private: '₹6,20,676/year', nri: '—' },
  { course: 'MDS - Pedodontics', govt: '₹3,72,576/year', private: '₹6,20,676/year', nri: '—' }
];

// Faculty Data
const FACULTY = {
  'orthodontics': {
    hod: { name: 'Dr. Raj Kumar S. Alle', designation: 'Principal, Professor & HOD' },
    others: [],
    description: 'Specializes in correcting teeth and jaw alignment using braces, aligners, and other orthodontic appliances.',
    treats: ['Crooked teeth', 'Jaw misalignment', 'Braces & retainers', 'Spacing issues', 'Bite correction']
  },
  'pedodontics': {
    hod: { name: 'Dr. Shakuntala B.S.', designation: 'Professor & HOD' },
    others: [{ name: 'Dr. Mamatha N.S.', designation: 'Faculty' }],
    description: 'Dedicated to dental care for children and adolescents, with 37 child-friendly dental chairs.',
    treats: ["Children's tooth problems", 'Milk teeth issues', 'Fluoride treatment', 'Dental habits', 'School dental health']
  },
  'oral-surgery': {
    hod: { name: 'Dr. Krishna Kumar U.', designation: 'Professor & HOD' },
    others: [],
    description: 'Handles complex surgical procedures of the mouth, jaw, and face.',
    treats: ['Tooth extractions', 'Wisdom teeth', 'Jaw surgery', 'Facial trauma', 'Implant surgery']
  },
  'prosthetics': {
    hod: { name: 'Dr. Madhumathi Singh', designation: 'Professor & HOD' },
    others: [],
    description: 'Restores and replaces missing teeth with crowns, bridges, dentures and implant-supported prostheses.',
    treats: ['Missing teeth', 'Dentures', 'Crowns & bridges', 'Dental implants', 'Full mouth rehabilitation']
  },
  'conservative-dentistry': {
    hod: { name: 'Dr. Geeta Sanjeev', designation: 'Professor & HOD' },
    others: [],
    description: 'Treats tooth decay, cavities and performs root canal treatments to save natural teeth.',
    treats: ['Tooth decay', 'Cavities', 'Root canal treatment', 'Tooth sensitivity', 'Tooth-coloured fillings']
  },
  'periodontology': {
    hod: { name: 'Dr. R. Vinaychandra', designation: 'Professor & HOD' },
    others: [],
    description: 'Treats diseases of the gums and supporting structures of the teeth.',
    treats: ['Bleeding gums', 'Gum disease', 'Loose teeth', 'Deep cleaning', 'Bone grafting']
  },
  'oral-medicine': {
    hod: null,
    others: [],
    description: 'Diagnoses and manages diseases affecting the oral and maxillofacial region.',
    treats: ['Mouth ulcers', 'Oral lesions', 'Jaw pain', 'General assessment', 'X-rays & imaging']
  },
  'oral-pathology': {
    hod: null,
    others: [],
    description: 'Identifies diseases of the oral cavity through biopsy and laboratory investigation.',
    treats: ['Biopsy', 'Oral cancer screening', 'Cyst analysis', 'Tumour diagnosis']
  },
  'public-health': {
    hod: null,
    others: [],
    description: 'Focuses on community dental health, prevention and dental camps.',
    treats: ['Community screenings', 'Preventive care', 'School dental programs', 'Rural health camps']
  },
  'implantology': {
    hod: null,
    others: [],
    description: 'Specialised department for dental implants and advanced prosthetic reconstruction.',
    treats: ['Single implants', 'Full arch implants', 'Bone grafting', 'Implant-supported dentures']
  }
};

// OPD Schedule
const opdSchedule = [
  { dept: 'Oral Medicine & Radiology', mon: '9AM–4PM', tue: '9AM–4PM', wed: '9AM–4PM', thu: '9AM–4PM', fri: '9AM–4PM', sat: '9AM–1PM' },
  { dept: 'Conservative Dentistry', mon: '9AM–4PM', tue: '9AM–4PM', wed: '9AM–4PM', thu: '9AM–4PM', fri: '9AM–4PM', sat: '9AM–1PM' },
  { dept: 'Periodontology', mon: '9AM–4PM', tue: '9AM–4PM', wed: '9AM–4PM', thu: '9AM–4PM', fri: '9AM–4PM', sat: '9AM–1PM' },
  { dept: 'Pedodontics', mon: '9AM–4PM', tue: '9AM–4PM', wed: '9AM–4PM', thu: '9AM–4PM', fri: '9AM–4PM', sat: '9AM–1PM' },
  { dept: 'Orthodontics', mon: '9AM–4PM', tue: '9AM–4PM', wed: '9AM–4PM', thu: '9AM–4PM', fri: '9AM–4PM', sat: '9AM–1PM' },
  { dept: 'Oral Surgery', mon: '9AM–1PM', tue: '9AM–1PM', wed: '9AM–1PM', thu: '9AM–1PM', fri: '9AM–1PM', sat: 'Closed' },
  { dept: 'Prosthodontics', mon: '9AM–4PM', tue: '9AM–4PM', wed: '9AM–4PM', thu: '9AM–4PM', fri: '9AM–4PM', sat: '9AM–1PM' },
  { dept: 'Implantology', mon: 'By Appt', tue: 'By Appt', wed: 'By Appt', thu: 'By Appt', fri: 'By Appt', sat: 'Closed' }
];

// Facilities Data
const FACILITIES = [
  { name: 'Digital Library', icon: Library, description: 'Fully equipped digital library with access to dental journals, e-books, and research databases. Open Mon–Sat 8AM–8PM.', highlight: '24/7 digital access available' },
  { name: 'Auditorium', icon: Building, description: 'Modern auditorium hosting guest lectures, convocations, workshops, and inter-college events.', highlight: 'Seats 500+ attendees' },
  { name: 'Cafeteria', icon: Utensils, description: 'On-campus cafeteria serving hygienic meals and refreshments for students, staff and patients.', highlight: 'Open all weekdays' },
  { name: 'Gymnasium', icon: Dumbbell, description: 'Well-equipped gym for physical fitness available to all enrolled students.', highlight: 'Morning & evening slots' },
  { name: 'Sports & Recreation', icon: Trophy, description: 'Outdoor sports facilities including cricket, volleyball and basketball courts. Annual sports events held.', highlight: 'Inter-college competitions' },
  { name: 'Hostel', icon: Home, description: 'Separate hostel accommodation for boys and girls with 24/7 security, mess facility and Wi-Fi.', highlight: 'On-campus housing available' },
  { name: 'Transportation', icon: Bus, description: 'College buses operating on major routes connecting Bangalore city, Kengeri, and Mysore Road corridor.', highlight: 'Multiple routes available' },
  { name: 'Classrooms', icon: School, description: 'Air-conditioned lecture halls with modern AV equipment, smart boards and comfortable seating.', highlight: 'Fully air-conditioned' }
];

// Tab component
function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-3 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
        active
          ? 'bg-primary text-white'
          : 'bg-white text-text-secondary hover:bg-primary/5 hover:text-primary'
      }`}
    >
      {children}
    </button>
  );
}

export default function Academics() {
  const { lang } = useLang();
  const [activeTab, setActiveTab] = useState('courses');

  const tabs = [
    { id: 'courses', label: lang === 'kn' ? 'ಕೋರ್ಸ್ & ಶುಲ್ಕ' : 'Courses & Fees' },
    { id: 'faculty', label: lang === 'kn' ? 'ವಿಭಾಗ & ಸಿಬ್ಬಂದಿ' : 'Departments & Faculty' },
    { id: 'schedule', label: lang === 'kn' ? 'ವೇಳಾಪಟ್ಟಿ' : 'Schedule' },
    { id: 'syllabus', label: lang === 'kn' ? 'ಪಠ್ಯಕ್ರಮ' : 'Syllabus' },
    { id: 'research', label: lang === 'kn' ? 'ಸಂಶೋಧನೆ' : 'Research' },
    { id: 'facilities', label: lang === 'kn' ? 'ಸೌಕರ್ಯಗಳು' : 'Facilities' },
    { id: 'hostel', label: lang === 'kn' ? 'ವಸತಿ ನಿಲಯ' : 'Hostel' }
  ];

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      
      <main>
        {/* Hero */}
        <section className="bg-primary text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className={`font-heading font-bold text-3xl md:text-4xl mb-4 ${lang === 'kn' ? 'kannada' : ''}`}>
              {t('academics', lang)}
            </h1>
            <p className="text-white/90 text-lg">
              {lang === 'kn'
                ? 'ರಾಜೀವ್ ಗಾಂಧಿ ಆರೋಗ್ಯ ವಿಶ್ವವಿದ್ಯಾಲಯದೊಂದಿಗೆ ಅನುಮೋದಿತ ಶೈಕ್ಷಣಿಕ ಕಾರ್ಯಕ್ರಮಗಳು'
                : 'Academic programs recognized by Rajiv Gandhi University of Health Sciences'}
            </p>
          </div>
        </section>

        {/* Tabs Navigation */}
        <section className="py-6 bg-surface border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {tabs.map((tab) => (
                <TabButton
                  key={tab.id}
                  active={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </TabButton>
              ))}
            </div>
          </div>
        </section>

        {/* Tab Content */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Courses & Fees Tab */}
            {activeTab === 'courses' && (
              <div className="space-y-8">
                {/* BDS Info */}
                <div className="card">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="text-accent" size={28} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-heading font-semibold text-xl text-primary mb-2">BDS (Bachelor of Dental Surgery)</h3>
                      <div className="flex flex-wrap gap-4 text-sm text-text-secondary mb-3">
                        <span className="flex items-center gap-1"><Clock size={14} /> 4 years + 1 year compulsory internship</span>
                        <span className="flex items-center gap-1"><Award size={14} /> 100 seats</span>
                      </div>
                      <p className="text-text-secondary mb-4">
                        Comprehensive undergraduate program covering all aspects of dental sciences with clinical training. 
                        Affiliated to RGUHS, recognized by DCI, Govt. of Karnataka, and Govt. of India.
                      </p>
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <p className="text-amber-800 text-sm font-medium">
                          📢 Certificate Course in Implantology (2026-27) — Applications Open!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* MDS Info */}
                <div className="card">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Award className="text-primary" size={28} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-heading font-semibold text-xl text-primary mb-2">MDS (Master of Dental Surgery)</h3>
                      <div className="flex flex-wrap gap-4 text-sm text-text-secondary mb-3">
                        <span className="flex items-center gap-1"><Clock size={14} /> 3 years</span>
                        <span className="flex items-center gap-1"><Users size={14} /> 72 seats across 10 specialties</span>
                      </div>
                      <p className="text-text-secondary mb-4">
                        Postgraduate programs available in Oral Medicine, Conservative Dentistry, Periodontology, 
                        Pedodontics, Orthodontics, Oral Surgery, Prosthodontics, Public Health, Oral Pathology, and Implantology.
                      </p>
                    </div>
                  </div>
                </div>

                {/* PhD Programs */}
                <div className="card">
                  <h3 className="font-heading font-semibold text-lg text-primary mb-3">PhD Programs Available</h3>
                  <p className="text-text-secondary mb-3">Doctoral programs offered in:</p>
                  <div className="flex flex-wrap gap-2">
                    {['Public Health Dentistry', 'Oral & Maxillofacial Surgery', 'Prosthodontics', 'Periodontology', 'Orthodontics'].map((dept) => (
                      <span key={dept} className="px-3 py-1 bg-primary/5 text-primary text-sm rounded-full">
                        {dept}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Fee Structure Table */}
                <div className="card">
                  <h3 className="font-heading font-semibold text-xl text-primary mb-6">Fee Structure</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-primary/5">
                          <th className="text-left py-3 px-4 font-semibold text-primary rounded-tl-lg">Course</th>
                          <th className="text-left py-3 px-4 font-semibold text-primary">Govt Quota</th>
                          <th className="text-left py-3 px-4 font-semibold text-primary">Private Quota</th>
                          <th className="text-left py-3 px-4 font-semibold text-primary rounded-tr-lg">NRI Quota</th>
                        </tr>
                      </thead>
                      <tbody>
                        {feeData.map((row, idx) => (
                          <tr key={idx} className="border-b border-border/50 last:border-0">
                            <td className="py-3 px-4 font-medium">{row.course}</td>
                            <td className="py-3 px-4 text-text-secondary">{row.govt}</td>
                            <td className="py-3 px-4 text-text-secondary">{row.private}</td>
                            <td className="py-3 px-4 text-text-secondary">{row.nri}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Admission Requirements */}
                <div className="card bg-accent/5 border-accent/20">
                  <h3 className="font-heading font-semibold text-lg text-primary mb-4">Admission Requirements</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-primary mb-2">BDS Eligibility</h4>
                      <ul className="text-sm text-text-secondary space-y-1">
                        <li>• Pass 10+2 Science (PCB)</li>
                        <li>• Valid NEET score</li>
                        <li>• Apply through COMEDK / RGUHS counselling</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary mb-2">MDS Eligibility</h4>
                      <ul className="text-sm text-text-secondary space-y-1">
                        <li>• BDS degree recognized by DCI</li>
                        <li>• Valid NEET-MDS score</li>
                        <li>• Apply through RGUHS counselling</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Faculty Tab */}
            {activeTab === 'faculty' && (
              <div className="space-y-6">
                {/* Principal Card */}
                <div className="card bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                      <Users className="text-white" size={32} />
                    </div>
                    <div>
                      <p className="text-sm text-accent font-medium">Principal</p>
                      <h3 className="font-heading font-semibold text-xl text-primary">Dr. S. Savita</h3>
                      <p className="text-text-secondary">RajaRajeswari Dental College & Hospital</p>
                    </div>
                  </div>
                </div>

                {/* Vice Principal */}
                <div className="card bg-gradient-to-r from-accent/5 to-primary/5 border-accent/20">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center">
                      <Users className="text-white" size={32} />
                    </div>
                    <div>
                      <p className="text-sm text-accent font-medium">Vice Principal / HOD Orthodontics</p>
                      <h3 className="font-heading font-semibold text-xl text-primary">Dr. Raj Kumar S. Alle</h3>
                      <p className="text-text-secondary">Professor & Head of Department</p>
                    </div>
                  </div>
                </div>

                <h3 className="font-heading font-semibold text-xl text-primary mt-8 mb-4">Department Heads</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries(FACULTY).filter(([_, data]) => data.hod).map(([code, data]) => (
                    <div key={code} className="card hover:shadow-card-hover transition-all">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <GraduationCap className="text-primary" size={24} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-primary">{DEPARTMENTS[code]?.name || code}</h4>
                          <p className="text-accent text-sm font-medium">{data.hod.name}</p>
                          <p className="text-text-secondary text-sm">{data.hod.designation}</p>
                          <p className="text-text-muted text-xs mt-2">{data.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Schedule Tab */}
            {activeTab === 'schedule' && (
              <div className="card">
                <h3 className="font-heading font-semibold text-xl text-primary mb-6">OPD Schedule</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-primary/5">
                        <th className="text-left py-3 px-3 font-semibold text-primary">Department</th>
                        <th className="text-left py-3 px-3 font-semibold text-primary">Mon</th>
                        <th className="text-left py-3 px-3 font-semibold text-primary">Tue</th>
                        <th className="text-left py-3 px-3 font-semibold text-primary">Wed</th>
                        <th className="text-left py-3 px-3 font-semibold text-primary">Thu</th>
                        <th className="text-left py-3 px-3 font-semibold text-primary">Fri</th>
                        <th className="text-left py-3 px-3 font-semibold text-primary">Sat</th>
                      </tr>
                    </thead>
                    <tbody>
                      {opdSchedule.map((row, idx) => (
                        <tr key={idx} className="border-b border-border/50 last:border-0">
                          <td className="py-3 px-3 font-medium">{row.dept}</td>
                          <td className="py-3 px-3 text-text-secondary">{row.mon}</td>
                          <td className="py-3 px-3 text-text-secondary">{row.tue}</td>
                          <td className="py-3 px-3 text-text-secondary">{row.wed}</td>
                          <td className="py-3 px-3 text-text-secondary">{row.thu}</td>
                          <td className="py-3 px-3 text-text-secondary">{row.fri}</td>
                          <td className="py-3 px-3 text-text-secondary">{row.sat}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-text-muted text-sm mt-4">
                  For the official academic timetable, visit the <a href="http://rguhs.ac.in" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">RGUHS website</a>.
                </p>
              </div>
            )}

            {/* Syllabus Tab */}
            {activeTab === 'syllabus' && (
              <div className="space-y-6">
                <div className="card bg-blue-50 border-blue-200">
                  <div className="flex items-start gap-3">
                    <Info className="text-blue-600 flex-shrink-0" size={24} />
                    <div>
                      <p className="text-blue-800 font-medium">Official Syllabus Documents</p>
                      <p className="text-blue-600 text-sm">
                        All syllabus documents are maintained by Rajiv Gandhi University of Health Sciences (RGUHS), Bangalore. 
                        Click below to access official documents.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { title: 'BDS Syllabus', desc: 'Bachelor of Dental Surgery — All years' },
                    { title: 'MDS Syllabus', desc: 'Master of Dental Surgery — All specialties' },
                    { title: 'PhD Dental Sciences', desc: 'Doctoral programs — Regulations & syllabus' },
                    { title: 'Certificate Courses', desc: 'Implantology and other short-term courses' }
                  ].map((item) => (
                    <a
                      key={item.title}
                      href="http://rguhs.ac.in"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="card group hover:shadow-card-hover transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <FileText className="text-primary" size={24} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-primary">{item.title}</h3>
                          <p className="text-sm text-text-secondary">{item.desc}</p>
                        </div>
                        <span className="text-xs text-accent flex items-center gap-1">
                          <ExternalLink size={12} /> RGUHS
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Research Tab */}
            {activeTab === 'research' && (
              <div className="space-y-6">
                {/* Glasgow Highlight */}
                <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Award className="text-white" size={28} />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-xl text-primary mb-2">
                        Royal College Affiliation
                      </h3>
                      <p className="text-text-secondary mb-2">
                        RRDCH is recognized as a centre for MFDS Part 1 & Part 2 examinations by the 
                        <strong> Royal College of Physicians and Surgeons of Glasgow, UK</strong> (since 2014).
                      </p>
                      <p className="text-accent text-sm font-medium">
                        International collaboration for dental education excellence.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Achievements Grid */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="card">
                    <h4 className="font-semibold text-primary mb-3">Research Highlights</h4>
                    <ul className="space-y-2 text-sm text-text-secondary">
                      <li className="flex items-start gap-2">
                        <span className="text-accent">✓</span>
                        <span>Collaboration with Sri Lanka Medical Council (SLMC)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-accent">✓</span>
                        <span>CBCT imaging unit installed (2015) — one of the first in Karnataka</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-accent">✓</span>
                        <span>Orthognathic Surgery Workshop with Prof. Dr. David Koppel, Glasgow (2014)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-accent">✓</span>
                        <span>Regular publication ethics workshops for PG students</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-accent">✓</span>
                        <span>MoU with Central Research Unit, Rajarajeswari Medical College</span>
                      </li>
                    </ul>
                  </div>
                  <div className="card">
                    <h4 className="font-semibold text-primary mb-3">Research Stats</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-surface rounded-lg">
                        <p className="text-3xl font-heading font-bold text-accent">200+</p>
                        <p className="text-sm text-text-secondary">Publications</p>
                      </div>
                      <div className="text-center p-4 bg-surface rounded-lg">
                        <p className="text-3xl font-heading font-bold text-accent">50+</p>
                        <p className="text-sm text-text-secondary">Ongoing Projects</p>
                      </div>
                      <div className="text-center p-4 bg-surface rounded-lg">
                        <p className="text-3xl font-heading font-bold text-accent">15+</p>
                        <p className="text-sm text-text-secondary">Awards Won</p>
                      </div>
                      <div className="text-center p-4 bg-surface rounded-lg">
                        <p className="text-3xl font-heading font-bold text-accent">100+</p>
                        <p className="text-sm text-text-secondary">Workshops</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Facilities Tab */}
            {activeTab === 'facilities' && (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {FACILITIES.map((facility) => (
                  <div key={facility.name} className="card hover:shadow-card-hover transition-all">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl flex items-center justify-center mb-3">
                      <facility.icon className="text-primary" size={24} />
                    </div>
                    <h4 className="font-semibold text-primary mb-1">{facility.name}</h4>
                    <p className="text-text-secondary text-sm mb-2">{facility.description}</p>
                    <span className="text-xs text-accent font-medium">{facility.highlight}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Hostel Tab */}
            {activeTab === 'hostel' && (
              <div className="space-y-6">
                <div className="card">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center">
                      <Home className="text-accent" size={32} />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-xl text-primary mb-2">Hostel Accommodation</h3>
                      <p className="text-text-secondary mb-4">
                        Separate hostel blocks for boys and girls with modern amenities and 24/7 security.
                      </p>
                      <div className="grid md:grid-cols-2 gap-3">
                        {['Wi-Fi Connectivity', 'Mess/Dining Facility', '24/7 Security', 'Laundry Service', 'Common Room', 'Indoor Games'].map((amenity) => (
                          <div key={amenity} className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-accent rounded-full"></span>
                            <span className="text-sm text-text-secondary">{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="card bg-amber-50 border-amber-200">
                    <h4 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
                      <AlertCircle size={18} />
                      Submit a Complaint
                    </h4>
                    <p className="text-amber-700 text-sm mb-4">
                      Facing issues with hostel facilities? Submit your complaint and track its status online.
                    </p>
                    <Link to="/hostel-complaint" className="btn btn-accent-warm text-sm">
                      Submit Complaint →
                    </Link>
                  </div>
                  <div className="card bg-blue-50 border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                      <Phone size={18} />
                      Contact Warden
                    </h4>
                    <p className="text-blue-700 text-sm mb-2">For hostel-related inquiries:</p>
                    <p className="text-blue-800 font-medium">principalrrdch@gmail.com</p>
                    <p className="text-blue-600 text-sm">+91-80-2843 7150</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
