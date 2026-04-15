import { useState } from 'react';
import { ref, set, get } from 'firebase/database';
import { db } from '../firebase';
import { useQueue } from '../hooks/useQueue';
import { DEPARTMENTS, DEPARTMENT_CODES, getDepartmentName } from '../data/departments';
import { ArrowRight, RotateCcw, AlertTriangle, Loader } from 'lucide-react';
import { t } from '../data/translations';

export default function Admin() {
  const [selectedDept, setSelectedDept] = useState('oral-medicine');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [message, setMessage] = useState(null);

  const { currentToken, patients, loading } = useQueue(selectedDept);

  const getNextToken = (current) => {
    const match = current.match(/A-(\d+)/);
    if (!match) return 'A-001';
    const num = parseInt(match[1]);
    return `A-${String(num + 1).padStart(3, '0')}`;
  };

  const handleNextPatient = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setMessage(null);

    try {
      const nextToken = getNextToken(currentToken);
      const today = new Date().toISOString().split('T')[0];

      // 1. Increment currentToken
      await set(ref(db, `queues/${selectedDept}/currentToken`), nextToken);
      
      // 2. Update previous patient status to "served"
      if (currentToken && currentToken !== 'A-000') {
        await set(ref(db, `queues/${selectedDept}/patients/${currentToken}/status`), 'served');
      }
      
      // 3. Update new current patient status to "serving"
      await set(ref(db, `queues/${selectedDept}/patients/${nextToken}/status`), 'serving');

      setMessage({ type: 'success', text: `Advanced to ${nextToken}` });
    } catch (err) {
      console.error('Error advancing token:', err);
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResetQueue = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setMessage(null);

    try {
      const today = new Date().toISOString().split('T')[0];
      
      await set(ref(db, `queues/${selectedDept}`), {
        currentToken: 'A-000',
        date: today,
        patients: {}
      });

      setShowResetConfirm(false);
      setMessage({ type: 'success', text: 'Queue reset successfully' });
    } catch (err) {
      console.error('Error resetting queue:', err);
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      waiting: 'bg-warning/10 text-warning',
      serving: 'bg-accent/10 text-accent',
      served: 'bg-success/10 text-success'
    };
    const labels = {
      waiting: '⏳ Waiting',
      serving: '🔵 Serving',
      served: '✅ Served'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status] || styles.waiting}`}>
        {labels[status] || status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Simple Header - No Navbar */}
      <header className="bg-primary text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-heading font-semibold text-xl">
            Reception Staff Dashboard — RRDCH
          </h1>
          <p className="text-white/70 text-sm mt-1">Queue Management System</p>
        </div>
      </header>

      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Department Selector */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Select Department
            </label>
            <select
              value={selectedDept}
              onChange={(e) => {
                setSelectedDept(e.target.value);
                setMessage(null);
              }}
              className="input max-w-md"
            >
              {DEPARTMENT_CODES.map((code) => (
                <option key={code} value={code}>
                  {DEPARTMENTS[code].name}
                </option>
              ))}
            </select>
          </div>

          {/* Message */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.type === 'success' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
            }`}>
              {message.text}
            </div>
          )}

          {/* Currently Serving Display */}
          <div className="card mb-8 text-center bg-primary text-white">
            <p className="text-white/80 text-sm mb-2 uppercase tracking-wide">
              {t('currentlyServing', 'en')}
            </p>
            <p className="text-6xl md:text-7xl font-heading font-bold tracking-tight">
              {currentToken || 'A-000'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button
              onClick={handleNextPatient}
              disabled={isProcessing}
              className="btn btn-accent-warm text-lg px-8 flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? (
                <Loader size={20} className="animate-spin" />
              ) : (
                <ArrowRight size={20} />
              )}
              {t('nextPatient', 'en')}
            </button>

            <button
              onClick={() => setShowResetConfirm(true)}
              disabled={isProcessing}
              className="btn btn-outline border-danger text-danger hover:bg-danger hover:text-white flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <RotateCcw size={18} />
              {t('resetQueue', 'en')}
            </button>
          </div>

          {/* Reset Confirmation */}
          {showResetConfirm && (
            <div className="card mb-8 border-danger">
              <div className="flex items-start gap-3">
                <AlertTriangle className="text-danger flex-shrink-0" size={24} />
                <div>
                  <p className="font-semibold text-danger">{t('confirmReset', 'en')}</p>
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={handleResetQueue}
                      disabled={isProcessing}
                      className="btn btn-danger text-sm"
                    >
                      Yes, Reset
                    </button>
                    <button
                      onClick={() => setShowResetConfirm(false)}
                      disabled={isProcessing}
                      className="btn btn-outline text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Patient List */}
          <div className="card">
            <h2 className="font-heading font-semibold text-xl text-primary mb-4">
              {t('patientList', 'en')}
            </h2>

            {loading ? (
              <div className="text-center py-8 text-text-muted">
                <Loader size={32} className="animate-spin mx-auto mb-2" />
                Loading...
              </div>
            ) : patients.length === 0 ? (
              <div className="text-center py-8 text-text-muted">
                No patients in queue
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-2 text-sm font-semibold text-text-secondary">
                        {t('token', 'en')}
                      </th>
                      <th className="text-left py-3 px-2 text-sm font-semibold text-text-secondary">
                        {t('name', 'en')}
                      </th>
                      <th className="text-left py-3 px-2 text-sm font-semibold text-text-secondary">
                        {t('phone', 'en')}
                      </th>
                      <th className="text-left py-3 px-2 text-sm font-semibold text-text-secondary">
                        {t('status', 'en')}
                      </th>
                      <th className="text-left py-3 px-2 text-sm font-semibold text-text-secondary hidden md:table-cell">
                        {t('bookedAt', 'en')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {patients.sort((a, b) => {
                      const aNum = parseInt(a.token.match(/A-(\d+)/)?.[1] || 0);
                      const bNum = parseInt(b.token.match(/A-(\d+)/)?.[1] || 0);
                      return aNum - bNum;
                    }).map((patient) => (
                      <tr key={patient.token} className="border-b border-border/50 last:border-0">
                        <td className="py-3 px-2 font-semibold text-primary">{patient.token}</td>
                        <td className="py-3 px-2">{patient.name}</td>
                        <td className="py-3 px-2 text-text-secondary">{patient.phone}</td>
                        <td className="py-3 px-2">{getStatusBadge(patient.status)}</td>
                        <td className="py-3 px-2 text-text-secondary text-sm hidden md:table-cell">
                          {new Date(patient.bookedAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
