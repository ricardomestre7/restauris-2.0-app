import { supabase } from './supabaseClient';

export const getAnalysesForPatient = async (patientId) => {
  const { data, error } = await supabase
    .from('quantum_analyses')
    .select('*')
    .eq('patient_id', patientId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching analyses for patient:', error);
  }

  return { data, error };
};