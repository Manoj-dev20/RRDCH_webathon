import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Home from './pages/Home';
import Appointment from './pages/Appointment';
import Queue from './pages/Queue';
import Admin from './pages/Admin';
import FollowUp from './pages/FollowUp';
import Departments from './pages/Departments';
import HostelComplaint from './pages/HostelComplaint';
import About from './pages/About';
import Academics from './pages/Academics';
import Admissions from './pages/Admissions';
import Contact from './pages/Contact';
import News from './pages/News';
import Doctor from './pages/Doctor';
import DoctorDashboard from './pages/DoctorDashboard';

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/appointment" element={<Appointment />} />
          <Route path="/queue" element={<Queue />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/followup" element={<FollowUp />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/hostel-complaint" element={<HostelComplaint />} />
          <Route path="/about" element={<About />} />
          <Route path="/academics" element={<Academics />} />
          <Route path="/admissions" element={<Admissions />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/news" element={<News />} />
          <Route path="/doctor" element={<Doctor />} />
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App
