import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const DEMO_STUDENTS = {
  'student@edu.com': {
    password: 'password123',
    name: 'Arjun Sharma',
    id: 'STU2024001',
    dept: 'Computer Science',
    year: 3,
    cgpa: 8.7,
    dob: '2002-05-15',
    phone: '9876543210',
    address: '42 MG Road, Chennai',
    feesPaid: true,
    scholarshipApplied: true,
    courses: [
      { code: 'CS301', name: 'Data Structures', credits: 4, grade: 'A' },
      { code: 'CS302', name: 'Algorithms', credits: 4, grade: 'A+' },
      { code: 'CS303', name: 'Database Systems', credits: 3, grade: 'B+' },
      { code: 'CS304', name: 'Operating Systems', credits: 4, grade: 'A' },
      { code: 'CS305', name: 'Computer Networks', credits: 3, grade: 'A-' },
    ]
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [students, setStudents] = useState(DEMO_STUDENTS);

  const login = (email, password) => {
    const found = students[email];
    if (found && found.password === password) {
      setUser({ ...found, email });
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials' };
  };

  const register = (data) => {
    if (students[data.email]) return { success: false, error: 'Email already registered' };
    const newStudent = {
      password: data.password,
      name: data.name,
      id: 'STU2024' + String(Object.keys(students).length + 1).padStart(3, '0'),
      dept: data.dept,
      year: parseInt(data.year),
      cgpa: 0,
      dob: data.dob,
      phone: data.phone,
      address: data.address,
      feesPaid: false,
      scholarshipApplied: false,
      courses: []
    };
    setStudents(prev => ({ ...prev, [data.email]: newStudent }));
    setUser({ ...newStudent, email: data.email });
    return { success: true };
  };

  const updateUser = (updates) => {
    setUser(prev => ({ ...prev, ...updates }));
    setStudents(prev => ({
      ...prev,
      [user.email]: { ...prev[user.email], ...updates }
    }));
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
