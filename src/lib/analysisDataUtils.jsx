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

export const saveQuantumAnalysis = async (patientId, answers, results, recommendations) => {
  const analysisData = {
    patient_id: patientId,
    answers: answers,
    results: results,
    recommendations: recommendations,
  };

  const { data, error } = await supabase
    .from('quantum_analyses')
    .insert([analysisData])
    .select()
    .single();

  if (error) {
    console.error('Error saving quantum analysis:', error);
    return { data: null, error };
  }

  if (data) {
    const { error: patientUpdateError } = await supabase
      .from('patients')
      .update({ has_analysis: true })
      .eq('id', patientId);

    if (patientUpdateError) {
      console.error('Error updating patient has_analysis flag:', patientUpdateError);
    }
  }

  return { data, error };
};