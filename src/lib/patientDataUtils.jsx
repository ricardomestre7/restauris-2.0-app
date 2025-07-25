import { supabase } from './supabaseClient';

export const createInitialPatientPhase = async (patientId) => {
  const { data, error } = await supabase
    .from('patient_current_phase')
    .insert([{ patient_id: patientId, fase_numero: 1, phase_start_date: new Date().toISOString() }])
    .select()
    .single();

  if (error) {
    console.error('Error creating initial patient phase:', error);
  }
  return { data, error };
};

export const getAllPatients = async (therapistId) => {
  if (!therapistId) return { data: [], error: { message: "Therapist ID is required." } };
  
  const { data: patients, error } = await supabase
    .from('patients')
    .select(`*`)
    .eq('therapist_id', therapistId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching patients:', error);
    return { data: [], error };
  }

  if (!patients || patients.length === 0) {
    return { data: [], error: null };
  }

  const patientIds = patients.map(p => p.id);
  const { data: phases, error: phasesError } = await supabase
    .from('patient_current_phase')
    .select('patient_id, id, fase_numero, phase_start_date')
    .in('patient_id', patientIds);

  if (phasesError) {
    console.error('Error fetching patient phases:', phasesError);
  }

  const phasesMap = new Map(phases?.map(p => [p.patient_id, p]));

  const combinedData = patients.map(patient => ({
    ...patient,
    patient_current_phase: [phasesMap.get(patient.id)].filter(Boolean)
  }));

  return { data: combinedData, error: null };
};

export const getPatientById = async (patientId) => {
  const { data, error } = await supabase
    .from('patients')
    .select(`
      *,
      therapists (name)
    `)
    .eq('id', patientId)
    .single();

  if (error) {
    console.error('Error fetching patient by ID:', error);
    return { data: null, error };
  }

  if (!data) {
    return { data: null, error: { message: 'Patient not found' } };
  }

  const { data: phase, error: phaseError } = await getPatientCurrentPhase(patientId);

  if (phaseError) {
    console.error('Error fetching phase for patient:', phaseError);
  }

  const patientData = {
    ...data,
    therapistName: data.therapists ? data.therapists.name : null,
    patient_current_phase: phase ? [phase] : []
  };
  
  delete patientData.therapists;

  return { data: patientData, error: null };
};

export const savePatient = async (patientData) => {
  const { data: patient, error } = await supabase
    .from('patients')
    .insert([patientData])
    .select()
    .single();

  if (error) {
    console.error('Error saving patient:', error);
    return { data: null, error };
  }

  if (patient) {
    await createInitialPatientPhase(patient.id);
  }

  return { data: patient, error };
};

export const updatePatient = async (patientId, patientData) => {
  const { data, error } = await supabase
    .from('patients')
    .update(patientData)
    .eq('id', patientId)
    .select()
    .single();

  if (error) {
    console.error('Error updating patient:', error);
  }
  return { data, error };
};

export const deletePatientById = async (patientId) => {
  const { error } = await supabase
    .from('patients')
    .delete()
    .eq('id', patientId);

  if (error) {
    console.error('Error deleting patient:', error);
  }
  return { error };
};

export const getPatientCurrentPhase = async (patientId) => {
  const { data, error } = await supabase
    .from('patient_current_phase')
    .select('*')
    .eq('patient_id', patientId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') { 
    console.error('Error fetching patient phase:', error);
    return null;
  }
  return data;
};

export const updatePatientCurrentPhase = async (patientId, phaseId, newPhaseNumber) => {
  let currentPhaseId = phaseId;
  if (!currentPhaseId) {
    const currentPhase = await getPatientCurrentPhase(patientId);
    if (currentPhase) {
      currentPhaseId = currentPhase.id;
    } else {
      const { data: newPhase, error: createError } = await createInitialPatientPhase(patientId);
      if (createError) return { data: null, error: createError };
      currentPhaseId = newPhase.id;
    }
  }

  const { data, error } = await supabase
    .from('patient_current_phase')
    .update({ fase_numero: newPhaseNumber, phase_start_date: new Date().toISOString() })
    .eq('id', currentPhaseId)
    .select()
    .single();

  if (error) {
    console.error('Error updating patient phase:', error);
  }
  return { data, error };
};