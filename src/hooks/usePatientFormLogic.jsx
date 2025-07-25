import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { getPatientById, savePatient, updatePatient, getAllPatients } from '@/lib/patientDataUtils';
import { getTherapists } from '@/lib/therapistUtils';
import { useAuth } from '@/contexts/AuthContext';
import { format, parse, isValid } from 'date-fns';

export const usePatientFormLogic = (mode = 'create') => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    birth_date: '',
    address: '',
    profession: '',
    gender: '',
    marital_status: '',
    therapist_id: '',
  });
  const [loading, setLoading] = useState(mode === 'edit');
  const [isSaving, setIsSaving] = useState(false);
  const [therapists, setTherapists] = useState([]);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!user) return;
      try {
        const [therapistsData, patientsData] = await Promise.all([
          getTherapists(),
          getAllPatients(user.id)
        ]);

        if (therapistsData.data) {
          setTherapists(therapistsData.data);
          if (mode === 'create' && user.id) {
             const loggedInTherapist = therapistsData.data.find(t => t.id === user.id);
             if (loggedInTherapist) {
                setFormData(prev => ({ ...prev, therapist_id: loggedInTherapist.id }));
             }
          }
        }
        if (patientsData.data) setPatients(patientsData.data);

        if (mode === 'edit' && patientId) {
          setLoading(true);
          const { data: patientData, error } = await getPatientById(patientId);
          if (error || !patientData) {
            toast({
              title: 'Erro ao carregar paciente',
              description: 'Não foi possível encontrar os dados do paciente.',
              variant: 'destructive',
            });
            navigate('/');
          } else {
            const formattedBirthDate = patientData.birth_date 
              ? format(new Date(patientData.birth_date), 'dd/MM/yyyy') 
              : '';
            setFormData({ ...patientData, birth_date: formattedBirthDate });
          }
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
        toast({
          title: 'Erro de Rede',
          description: 'Não foi possível carregar os dados necessários.',
          variant: 'destructive',
        });
        if (mode === 'edit') setLoading(false);
      }
    };

    fetchInitialData();
  }, [patientId, mode, navigate, toast, user]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSelectChange = useCallback((name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleDateChange = useCallback((date) => {
    const formattedDate = date ? format(date, 'dd/MM/yyyy') : '';
    setFormData(prev => ({ ...prev, birth_date: formattedDate }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const isEmailDuplicate = patients.some(
      (p) => p.email === formData.email && p.id !== patientId
    );

    if (isEmailDuplicate) {
      toast({
        title: 'Email já cadastrado',
        description: 'Este email já está sendo utilizado por outro paciente.',
        variant: 'destructive',
      });
      setIsSaving(false);
      return;
    }
    
    let birthDateForDb = null;
    if (formData.birth_date) {
      try {
        const parsedDate = parse(formData.birth_date, 'dd/MM/yyyy', new Date());
        if (isValid(parsedDate)) {
          birthDateForDb = parsedDate.toISOString();
        } else {
          throw new Error('Invalid date');
        }
      } catch (error) {
        toast({
          title: 'Data de Nascimento Inválida',
          description: 'Por favor, use o formato DD/MM/AAAA.',
          variant: 'destructive',
        });
        setIsSaving(false);
        return;
      }
    }

    const dataToSave = { ...formData, birth_date: birthDateForDb };

    if (mode === 'create') {
      if (!user || !user.id) {
        toast({
          title: 'Erro de Autenticação',
          description: 'Nenhum terapeuta logado. Não é possível criar paciente.',
          variant: 'destructive',
        });
        setIsSaving(false);
        return;
      }
      
      dataToSave.therapist_id = user.id;

      const { data, error } = await savePatient(dataToSave);
      if (error) {
        toast({
          title: 'Erro ao Cadastrar',
          description: error.message || 'Não foi possível salvar o paciente.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Paciente Cadastrado!',
          description: `${data.name} foi adicionado(a) com sucesso.`,
        });
        navigate('/');
      }
    } else {
      const { data, error } = await updatePatient(patientId, dataToSave);
      if (error) {
        toast({
          title: 'Erro ao Atualizar',
          description: error.message || 'Não foi possível atualizar os dados do paciente.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Paciente Atualizado!',
          description: `Os dados de ${data.name} foram atualizados.`,
        });
        navigate('/');
      }
    }
    setIsSaving(false);
  };

  return {
    formData,
    loading,
    isSaving,
    therapists,
    handleInputChange,
    handleSelectChange,
    handleDateChange,
    handleSubmit,
  };
};