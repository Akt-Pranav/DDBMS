import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import logo from "../images/logo_1.png"; 

const Dashboard = () => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [submissionCounts, setSubmissionCounts] = useState([]);
  const [totalAssignmentsCount, setTotalAssignmentsCount] = useState(0);
  const [trendingAssignments, setTrendingAssignments] = useState([]);
  const [missedSubmissions, setMissedSubmissions] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [courseWork, setCourseWork] = useState([]); 
  const [teacherName, setTeacherName] = useState("");
  const [currentView, setCurrentView] = useState('classes'); 
  const [classCount, setClassCount] = useState(0); // Fetch class count dynamically
  const [studentCount, setStudentCount] = useState(0);// 'classes' or 'students'
  
  const token = new URLSearchParams(window.location.search).get("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    
    const fetchData = async (classId) => {
      console.log("Fetching data...");
      try {
        // Fetch students
        const studentsResponse = await axios.get(
          `https://classroom.googleapis.com/v1/courses/${classId}/students`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Students fetched:", studentsResponse.data);

        // Fetch course work
        const courseWorkResponse = await axios.get(
          `https://classroom.googleapis.com/v1/courses/${classId}/courseWork`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("CourseWork fetched:", courseWorkResponse.data);

        const students = studentsResponse.data.students || [];
        const courseWork = courseWorkResponse.data.courseWork || [];

        setStudents(students);
        setCourseWork(courseWork);
        setTotalAssignmentsCount(courseWork.length);

        if (courseWork.length > 0) {
          console.log("Fetching submissions...");
          await fetchAllSubmissions(classId);
          console.log("Submissions fetched.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchClasses = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://classroom.googleapis.com/v1/courses",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setClasses(response.data.courses || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching classes:", error);
        setLoading(false);
      }
    };

    fetchClasses();
  }, [token, navigate]);

  const fetchStudents = async (classId) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://classroom.googleapis.com/v1/courses/${classId}/students`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStudents(response.data.students || []);
      setSelectedClass(classId);

      await Promise.all([fetchAssignments(classId), fetchAllSubmissions(classId)]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching students:", error);
      setLoading(false);
    }
  };

  const fetchAllSubmissions = async (classId) => {
    try {
      const submissionsCount = {};

      await Promise.all(
        assignments.map(async (assignment) => {
          const response = await axios.get(
            `https://classroom.googleapis.com/v1/courses/${classId}/courseWork/${assignment.id}/studentSubmissions`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          response.data.studentSubmissions.forEach((submission) => {
            const userId = submission.userId;
            if (!submissionsCount[userId]) {
              submissionsCount[userId] = { submitted: 0, total: 0 };
            }
            submissionsCount[userId].total += 1;

            if (
              submission.state === "TURNED_IN" ||
              submission.state === "RETURNED"
            ) {
              submissionsCount[userId].submitted += 1;
            }
          });
        })
      );

      const updatedSubmissionCounts = Object.entries(submissionsCount).map(
        ([userId, counts]) => ({
          userId,
          submitted: counts.submitted,
          total: counts.total,
        })
      );

      setSubmissionCounts(updatedSubmissionCounts);
    } catch (error) {
      console.error("Error fetching submissions:", error);
    }
  };

  const fetchAssignments = async (classId) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://classroom.googleapis.com/v1/courses/${classId}/courseWork`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAssignments(response.data.courseWork || []);
      setTotalAssignmentsCount(response.data.courseWork.length);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching assignments:", error);
      setLoading(false);
    }
  };

  const fetchSubmissions = async (classId, studentId) => {
    setLoading(true);
    try {
      const submissionsData = [];
      await Promise.all(
        assignments.map(async (assignment) => {
          const response = await axios.get(
            `https://classroom.googleapis.com/v1/courses/${classId}/courseWork/${assignment.id}/studentSubmissions`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const submission = response.data.studentSubmissions.find(
            (sub) => sub.userId === studentId
          );
          if (submission) {
            const files = submission.assignmentSubmission?.attachments
              ?.map((attachment) => {
                if (attachment.driveFile) {
                  return {
                    title: attachment.driveFile.title,
                    link: attachment.driveFile.alternateLink,
                  };
                }
                return null;
              })
              .filter(Boolean);

            submissionsData.push({
              assignment: assignment.title,
              state: submission.state || "Not Submitted",
              files: files || [],
            });
          }
        })
      );
      setSubmissions(submissionsData);
      setSelectedStudent(studentId);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      setLoading(false);
    }
  };


  const renderStudentList = () => (
    <div className="students-section">
      <button className="back-button" onClick={() => setSelectedClass(null)}>
        Back to Classes
      </button>
      <h2 className="section-title">
        Students in {classes.find((c) => c.id === selectedClass)?.name}
      </h2>
      {students.length === 0 && <p>No students found.</p>}
      <ul className="students-list">
        {students.map((student) => {
          const submissionCount = submissionCounts.find(
            (sc) => sc.userId === student.userId
          ) || { submitted: 0, total: totalAssignmentsCount };
          return (
            <li key={student.userId} className="student-item">
              <button
                className="student-button"
                onClick={() => fetchSubmissions(selectedClass, student.userId)}
              >
                {student.profile.name.fullName} - {submissionCount.submitted}/
                {submissionCount.total}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
  

  return (
    <div className="dashboard-container">
      <img src={logo} alt="Logo" className="logo" />
      <h1 className="dashboard-title">Dashboard</h1> {/* Display teacher's name */}
     
      {loading && (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      )}

      {/* Display list of classes */}
      {!selectedClass && !selectedStudent && !loading && (
        <div className="classes-section">
          <h2 className="section-title">Classes</h2>
          {classes.length === 0 && <p>No classes found.</p>}
          <ul className="classes-list">
            {classes.map((classItem) => (
              <li key={classItem.id} className="class-item">
                <button
                  className="class-button"
                  onClick={() => fetchStudents(classItem.id)}
                >
                  {classItem.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Display list of students in a selected class */}
      {selectedClass && !selectedStudent && !loading && renderStudentList()}

      {/* Display list of assignments and submitted files for a selected student */}
      {selectedStudent && !loading && (
        <div className="assignments-section">
          <button
            className="back-button"
            onClick={() => setSelectedStudent(null)}
          >
            Back to Students
          </button>
          <h2 className="section-title">
            Assignments submitted by{" "}
            {
              students.find((s) => s.userId === selectedStudent)?.profile.name
                .fullName
            }
          </h2>
          {submissions.length === 0 && <p>No submissions found.</p>}
          <ul className="submissions-list">
            {submissions.map((submission) => (
              <li key={submission.assignment} className="submission-item">
                <p className="assignment-title">{submission.assignment}</p>
                {submission.files.length > 0 && (
                  <ul className="files-list">
                    {submission.files.map((file) => (
                      <li key={file.title} className="file-item">
                        <a
                          href={file.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {file.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
