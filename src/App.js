import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Style.css';

function App() {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [grades, setGrades] = useState([]);
  const [newStudentName, setNewStudentName] = useState('');
  const [newGrade, setNewGrade] = useState({ grade: '', weight: '', description: '' });
  const [average, setAverage] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3001/classes').then(response => {
      setClasses(response.data);
    });
  }, []);

  const handleClassSelect = (classId) => {
    setSelectedClass(classId);
    axios.get(`http://localhost:3001/students?class_id=${classId}`).then(response => {
      setStudents(response.data);
    });
  };

  const handleStudentSelect = (studentId) => {
    setSelectedStudent(studentId);
    axios.get(`http://localhost:3001/students/${studentId}/grades`).then(response => {
      setGrades(response.data);
    });
    axios.get(`http://localhost:3001/students/${studentId}/average`).then(response => {
      setAverage(response.data.average);
    });
  };

  const handleAddStudent = () => {
    axios.post('http://localhost:3001/students', { name: newStudentName, class_id: selectedClass }).then(response => {
      setStudents([...students, { id: response.data.studentId, name: newStudentName }]);
      setNewStudentName('');
    });
  };

  const handleAddGrade = () => {
    axios.post('http://localhost:3001/grades', { ...newGrade, student_id: selectedStudent }).then(() => {
      setGrades([...grades, newGrade]);
      setNewGrade({ grade: '', weight: '', description: '' });
    });
  };

  const handleDeleteGrade = (gradeId) => {
    axios.delete(`http://localhost:3001/grades/${gradeId}`).then(() => {
      setGrades(grades.filter(grade => grade.id !== gradeId));
    });
  };

  const handleDeleteStudent = () => {
    if (!selectedStudent) return;

    axios.delete(`http://localhost:3001/students/${selectedStudent}`).then(() => {
      setStudents(students.filter(student => student.id !== selectedStudent));
      setSelectedStudent(null);
      setGrades([]);
      setAverage(null);
    });
  };

  return (
    <div>
      <h1>School Management System</h1>
      <div>
        <h2>Select Class</h2>
        <select onChange={(e) => handleClassSelect(e.target.value)}>
          <option value="">Select a class</option>
          {classes.map(cls => (
            <option key={cls.id} value={cls.id}>
              {cls.name}
            </option>
          ))}
        </select>
      </div>
      {selectedClass && (
        <div>
          <h2>Students</h2>
          <select onChange={(e) => handleStudentSelect(e.target.value)}>
            <option value="">Select a student</option>
            {students.map(student => (
              <option key={student.id} value={student.id}>
                {student.name}
              </option>
            ))}
          </select>
          <div>
            <input
              value={newStudentName}
              onChange={(e) => setNewStudentName(e.target.value)}
              placeholder="New Student Name"
            />
            <button onClick={handleAddStudent}>Add Student</button>
          </div>
          <button onClick={handleDeleteStudent}>Delete Selected Student</button>
        </div>
      )}
      {selectedStudent && (
        <div>
          <h2>Grades</h2>
          <ul>
            {grades.map((grade) => (
              <li key={grade.id}>
                Grade: {grade.grade}, Weight: {grade.weight}, Description: {grade.description}
                <button onClick={() => handleDeleteGrade(grade.id)}>Delete Grade</button>
              </li>
            ))}
          </ul>
          <div>
            <input
              value={newGrade.grade}
              onChange={(e) => setNewGrade({ ...newGrade, grade: e.target.value })}
              placeholder="Grade"
            />
            <input
              value={newGrade.weight}
              onChange={(e) => setNewGrade({ ...newGrade, weight: e.target.value })}
              placeholder="Weight"
            />
            <input
              value={newGrade.description}
              onChange={(e) => setNewGrade({ ...newGrade, description: e.target.value })}
              placeholder="Description"
            />
            <button onClick={handleAddGrade}>Add Grade</button>
          </div>
          {average !== null && (
            <h3>Average Grade: {average}</h3>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
