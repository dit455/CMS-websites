import { ArrowLeft, CheckCircle2, FileText, Send, UploadCloud } from "lucide-react";
import { Link } from "react-router-dom";

const grievanceCategories = ["Transfer counselling", "Teacher profile", "Vacancy position", "Helpdesk support", "Circular or order", "Other"];

export function PublicGrievancePage() {
  return (
    <main className="bg-[linear-gradient(135deg,#F8FAFC,#F0FDFA)] px-4 py-10">
      <section className="mx-auto max-w-6xl">
        <Link to="/" className="inline-flex items-center gap-2 rounded-btn border border-slate-200 bg-white px-3 py-2 text-sm font-black text-slate-700 shadow-sm">
          <ArrowLeft size={16} /> Back to homepage
        </Link>
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <form className="rounded-[20px] border border-slate-200 bg-white p-6 shadow-soft">
            <p className="text-xs font-black uppercase text-primary">Public Grievance Portal</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Lodge Grievance</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Submit grievance details with supporting documents. A reference number will be generated for tracking.
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="block text-sm font-bold text-slate-700">
                Name
                <input className="mt-2 w-full rounded-btn border border-slate-200 px-3 py-3" placeholder="Enter full name" />
              </label>
              <label className="block text-sm font-bold text-slate-700">
                Mobile number
                <input className="mt-2 w-full rounded-btn border border-slate-200 px-3 py-3" placeholder="Enter mobile number" />
              </label>
              <label className="block text-sm font-bold text-slate-700">
                Grievance category
                <select className="mt-2 w-full rounded-btn border border-slate-200 px-3 py-3">
                  {grievanceCategories.map((category) => <option key={category}>{category}</option>)}
                </select>
              </label>
              <label className="block text-sm font-bold text-slate-700">
                E-mail
                <input className="mt-2 w-full rounded-btn border border-slate-200 px-3 py-3" placeholder="name@example.com" />
              </label>
              <label className="block text-sm font-bold text-slate-700 md:col-span-2">
                Grievance details
                <textarea className="mt-2 min-h-36 w-full rounded-btn border border-slate-200 px-3 py-3" placeholder="Describe the grievance clearly" />
              </label>
            </div>
            <div className="mt-5 rounded-[18px] border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center">
              <UploadCloud className="mx-auto text-primary" size={32} />
              <strong className="mt-2 block text-slate-950">Upload supporting document</strong>
              <p className="mt-1 text-sm text-slate-500">PDF, JPG, or PNG proof. Demo UI only.</p>
            </div>
            <button className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-btn bg-primary px-4 py-3 font-black text-white" type="button">
              <Send size={18} /> Submit Grievance
            </button>
          </form>
          <aside className="grid content-start gap-4">
            <div className="rounded-[20px] border border-slate-200 bg-white p-5 shadow-soft">
              <FileText className="text-primary" size={28} />
              <h2 className="mt-3 text-xl font-black text-slate-950">What happens next?</h2>
              <ol className="mt-4 grid gap-3 text-sm font-bold text-slate-600">
                <li className="flex gap-2"><CheckCircle2 className="text-emerald-600" size={18} /> Instant acknowledgement number</li>
                <li className="flex gap-2"><CheckCircle2 className="text-emerald-600" size={18} /> Assignment to review cell</li>
                <li className="flex gap-2"><CheckCircle2 className="text-emerald-600" size={18} /> Department remarks and disposal</li>
                <li className="flex gap-2"><CheckCircle2 className="text-emerald-600" size={18} /> Status available on public tracking</li>
              </ol>
            </div>
            <div className="rounded-[20px] border border-primary/20 bg-gradient-to-br from-primary to-secondary p-5 text-white shadow-soft">
              <strong className="text-3xl">95%</strong>
              <p className="mt-2 font-black">Resolution Rate</p>
              <p className="mt-2 text-sm leading-6 text-emerald-50">Most complete grievances are disposed within the standard review period.</p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
