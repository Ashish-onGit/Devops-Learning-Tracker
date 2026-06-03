import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Award,
  Calendar,
  BookOpen,
  Check,
  ExternalLink,
  CheckCircle2,
  Compass,
  AlertCircle,
  Save,
} from "lucide-react";
import { api } from "../../utils/api";
import {
  toggleDomainCheck,
  setExamDate,
} from "../../store/slices/certificationsSlice";
import { useToast } from "../../hooks/useToast";

const Certifications = () => {
  const dispatch = useDispatch();
  const toast = useToast();

  // Redux state
  const checkedDomains = useSelector(
    (state) => state.certifications?.checkedDomains || {},
  );
  const examDates = useSelector(
    (state) => state.certifications?.examDates || {},
  );

  // Component state
  const [certs, setCerts] = useState([]);
  const [selectedCertCode, setSelectedCertCode] = useState(null);
  const [loading, setLoading] = useState(true);

  // Input state for date
  const [targetDate, setTargetDate] = useState("");

  useEffect(() => {
    const fetchCerts = async () => {
      setLoading(true);
      const data = await api.getCertifications();
      setCerts(data);
      if (data.length > 0) {
        setSelectedCertCode(data[0].code);
        setTargetDate(examDates[data[0].code] || "");
      }
      setLoading(false);
    };
    fetchCerts();
  }, []);

  // Update date input when cert code changes
  useEffect(() => {
    if (selectedCertCode) {
      setTargetDate(examDates[selectedCertCode] || "");
    }
  }, [selectedCertCode, examDates]);

  const handleDomainToggle = (certCode, domainName) => {
    dispatch(toggleDomainCheck({ certCode, domainName }));
  };

  const handleSaveExamDate = (e) => {
    e.preventDefault();
    if (selectedCertCode && targetDate) {
      dispatch(setExamDate({ certCode: selectedCertCode, date: targetDate }));
      toast.success("Exam target date saved successfully!");
    }
  };

  const activeCert = certs.find((c) => c.code === selectedCertCode);
  const checkedList = activeCert ? checkedDomains[activeCert.code] || [] : [];
  const certProgressPct =
    activeCert?.domains?.length > 0
      ? Math.round((checkedList.length / activeCert.domains.length) * 100)
      : 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">
          Cloud & Kubernetes Certifications Hub
        </h2>
        <p className="text-xs text-slate-500">
          Track exam blueprints, test domains, and target study dates for
          industry-standard certs.
        </p>
      </div>

      {loading ? (
        <div className="h-48 bg-slate-200 dark:bg-slate-850 rounded-lg animate-pulse" />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Column 1: Certification paths choice */}
          <div className="md:col-span-1 rounded-xl glass-panel overflow-hidden h-fit">
            <div className="p-4 border-b border-slate-200/50 dark:border-[#202020]">
              <h3 className="font-bold text-sm flex items-center gap-1.5">
                <Award className="w-4 h-4 text-blue-500" /> Paths
              </h3>
            </div>
            <div className="p-2 space-y-1">
              {certs.map((c) => {
                const isSelected = c.code === selectedCertCode;
                const checked = checkedDomains[c.code] || [];
                const progressPct =
                  c.domains?.length > 0
                    ? Math.round((checked.length / c.domains.length) * 100)
                    : 0;

                return (
                  <button
                    key={c.code}
                    onClick={() => setSelectedCertCode(c.code)}
                    className={`w-full text-left px-4 py-3.5 rounded-lg text-xs font-bold transition flex items-center justify-between select-none ${
                      isSelected
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/10"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-550 dark:hover:bg-[#151515]"
                    }`}
                  >
                    <div className="space-y-0.5">
                      <p className="truncate max-w-[150px]">{c.name}</p>
                      <p
                        className={`text-[9px] ${isSelected ? "text-blue-100" : "text-slate-450"}`}
                      >
                        {c.provider} • {c.code}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-black ${isSelected ? "text-white" : "text-blue-600"}`}
                    >
                      {progressPct}%
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Column 2 & 3: active certification blueprint details */}
          <div className="lg:col-span-2 rounded-xl glass-panel p-6 space-y-6">
            {activeCert ? (
              <>
                {/* Header overview */}
                <div className="space-y-3 border-b border-slate-200/50 dark:border-[#202020] pb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold px-2 py-0.5 rounded uppercase">
                      {activeCert.provider} • {activeCert.level}
                    </span>
                    {examDates[activeCert.code] && (
                      <span className="text-[10px] text-orange-500 font-bold flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> Exam:{" "}
                        {new Date(
                          examDates[activeCert.code],
                        ).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <h3 className="font-extrabold text-base md:text-lg">
                    {activeCert.name} ({activeCert.code})
                  </h3>

                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold">
                      <span className="text-slate-450">
                        Blueprint domains checked
                      </span>
                      <span>{certProgressPct}% Complete</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 transition-all duration-300"
                        style={{ width: `${certProgressPct}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Exam domains checklist */}
                {activeCert.domains?.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Exam Domains Weight checklist
                    </h4>
                    <div className="space-y-2 select-none">
                      {activeCert.domains.map((dom, dIdx) => {
                        const isChecked = checkedList.includes(dom.name);
                        return (
                          <div
                            key={dIdx}
                            onClick={() =>
                              handleDomainToggle(activeCert.code, dom.name)
                            }
                            className={`p-3.5 rounded-lg border cursor-pointer flex justify-between items-center transition ${
                              isChecked
                                ? "border-emerald-500/20 bg-emerald-500/5 text-slate-700 dark:text-slate-200"
                                : "border-slate-200/50 dark:border-[#202020] hover:bg-slate-50 dark:hover:bg-[#101010]"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                                  isChecked
                                    ? "bg-emerald-500 border-emerald-500 text-white"
                                    : "border-slate-300 dark:border-[#202020]"
                                }`}
                              >
                                {isChecked && (
                                  <Check className="w-3 h-3 stroke-[3]" />
                                )}
                              </div>
                              <span className="text-[11px] font-semibold">
                                {dom.name}
                              </span>
                            </div>
                            <span className="text-[10px] font-bold text-slate-400">
                              weight: {dom.weight}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Study resources */}
                {activeCert.resources?.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-slate-200/50 dark:border-[#202020]">
                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Recommended Exam resources
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {activeCert.resources.map((res) => (
                        <span
                          key={res}
                          className="bg-slate-50/50 dark:bg-[#111111]/30 border border-slate-200/50 dark:border-[#202020] px-3 py-1 rounded-lg text-[10px] font-bold text-slate-500 flex items-center gap-1"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-slate-400" />{" "}
                          {res}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Date scheduling scheduler widget */}
                <div className="p-4 rounded-xl border border-slate-200/50 dark:border-[#202020] bg-slate-50/50 dark:bg-[#111111]/30 space-y-3">
                  <h4 className="text-xs font-bold flex items-center gap-1.5 text-orange-500">
                    <Calendar className="w-4 h-4" /> Schedule target exam date
                  </h4>
                  <form
                    onSubmit={handleSaveExamDate}
                    className="flex flex-col sm:flex-row gap-3"
                  >
                    <input
                      type="date"
                      value={targetDate}
                      onChange={(e) => setTargetDate(e.target.value)}
                      className="p-2 rounded-lg border border-slate-200/50 dark:border-[#202020] bg-white dark:bg-[#0A0A0A] text-xs focus:outline-none flex-1"
                    />
                    <button
                      type="submit"
                      disabled={!targetDate}
                      className="px-5 py-2 bg-blue-600 disabled:opacity-55 disabled:cursor-not-allowed hover:bg-blue-500 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition"
                    >
                      <Save className="w-3.5 h-3.5" /> Save Target Date
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <p className="text-center py-12 text-slate-500 text-xs">
                No certification details loaded.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Certifications;
