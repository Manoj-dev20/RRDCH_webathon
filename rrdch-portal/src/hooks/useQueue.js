import { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';

export function useQueue(departmentCode) {
  const [currentToken, setCurrentToken] = useState(null);
  const [totalPatients, setTotalPatients] = useState(0);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!departmentCode) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const queueRef = ref(db, `queues/${departmentCode}`);
    
    const unsubscribe = onValue(
      queueRef,
      (snapshot) => {
        try {
          const data = snapshot.val();
          if (data) {
            // Handle currentToken - can be 'A-000' which means queue not started
            const token = data.currentToken;
            setCurrentToken(token || 'A-000');
            
            const patientsData = data.patients || {};
            const today = new Date().toISOString().split('T')[0]; // "2026-04-14"
            
            // Convert patients object to array with token IDs
            const patientList = Object.entries(patientsData).map(([token, patient]) => ({
              token,
              ...patient
            }));
            
            setPatients(patientList);
            
            // Count patients - handle BOTH schema types:
            // - Seed patients: { name, phone, severity, status, symptom, checkedIn } - no date field
            // - App-booked patients: { name, phone, status, tokenId, bookedAt, date, today } - has date field
            const validPatients = patientList.filter((p) => {
              // A patient counts if:
              // 1. Has date matching today (app-booked today)
              // 2. Has today field matching today (app-booked)
              // 3. Has no date/today fields (seed data - assume it's for today)
              const patientDate = p.date || p.today;
              if (!patientDate) {
                // Seed patient - count it
                return true;
              }
              return patientDate === today;
            });
            
            setTotalPatients(validPatients.length);
          } else {
            // No data yet - queue not started for this department
            setCurrentToken(null);
            setPatients([]);
            setTotalPatients(0);
          }
          setLoading(false);
        } catch (err) {
          console.error('Queue data parsing error:', err);
          setError('Failed to parse queue data');
          setLoading(false);
        }
      },
      (err) => {
        console.error('Firebase queue error:', err);
        setError(err.message || 'Failed to connect to queue');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [departmentCode]);

  return { currentToken, totalPatients, patients, loading, error };
}
