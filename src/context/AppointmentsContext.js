import React, { createContext, useState, useContext } from 'react';

// Cria o contexto que irá guardar os nossos dados
const AppointmentsContext = createContext();

// Cria o "provedor" que disponibiliza os dados para o resto do aplicativo
export const AppointmentsProvider = ({ children }) => {
  const [appointments, setAppointments] = useState([]);

  // Função para adicionar um novo agendamento à lista
  const addAppointment = (appointmentData) => {
    const newAppointment = {
      ...appointmentData,
      id: Date.now().toString(), // Adiciona um ID único
    };
    setAppointments(prevAppointments => [...prevAppointments, newAppointment]);
  };

  return (
    <AppointmentsContext.Provider value={{ appointments, addAppointment }}>
      {children}
    </AppointmentsContext.Provider>
  );
};

// Hook customizado para facilitar o uso do contexto
export const useAppointments = () => useContext(AppointmentsContext);
