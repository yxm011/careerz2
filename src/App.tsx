import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Explore from "@/pages/Explore";
import Jobs from "@/pages/Jobs";
import Dashboard from "@/pages/Dashboard";
import SimDetail from "@/pages/SimDetail";
import Workspace from "@/pages/Workspace";
import CompanySignup from "@/pages/company/CompanySignup";
import CompanyDashboard from "@/pages/company/CompanyDashboard";
import CompanySimNew from "@/pages/company/CompanySimNew";
import CompanySimEdit from "@/pages/company/CompanySimEdit";
import CompanyAnalytics from "@/pages/company/CompanyAnalytics";
import CompanySubmissions from "@/pages/company/CompanySubmissions";
import SubmissionDetail from "@/pages/company/SubmissionDetail";
import TalentPool from "@/pages/company/TalentPool";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminTemplates from "@/pages/admin/AdminTemplates";
import AdminReview from "@/pages/admin/AdminReview";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/jobs" element={<Jobs />} />

          {/* User */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/sim/:id" element={<SimDetail />} />
          <Route path="/workspace/:id" element={<Workspace />} />

          {/* Company */}
          <Route path="/company/signup" element={<CompanySignup />} />
          <Route path="/company" element={<CompanyDashboard />} />
          <Route path="/company/simulations/new" element={<CompanySimNew />} />
          <Route path="/company/simulations/:simId/edit" element={<CompanySimEdit />} />
          <Route path="/company/simulations/:id/analytics" element={<CompanyAnalytics />} />
          <Route path="/company/submissions" element={<CompanySubmissions />} />
          <Route path="/company/submissions/:submissionId" element={<SubmissionDetail />} />
          <Route path="/company/talent-pool" element={<TalentPool />} />

          {/* Admin */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/templates" element={<AdminTemplates />} />
          <Route path="/admin/review" element={<AdminReview />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
