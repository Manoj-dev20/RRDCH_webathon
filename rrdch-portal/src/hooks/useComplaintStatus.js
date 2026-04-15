import { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';

export function useComplaintStatus(complaintId) {
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!complaintId) {
      setLoading(false);
      return;
    }
    
    const complaintRef = ref(db, `complaints/${complaintId}`);
    const unsubscribe = onValue(complaintRef, (snapshot) => {
      try {
        const data = snapshot.val();
        if (data) {
          setComplaint(data);
        } else {
          setComplaint(null);
        }
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }, (err) => {
      setError(err.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [complaintId]);

  return { complaint, loading, error };
}
