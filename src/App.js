import axios from 'axios';
import React, { useEffect, useState } from 'react';
import EditScreen from './component/EditScreen';
import { AiOutlineHome, AiOutlineDoubleRight, AiOutlineDelete } from 'react-icons/ai';
import { BiBlock } from 'react-icons/bi';
import { FiEdit } from 'react-icons/fi';

function App() {
  const [data, setData] = useState({studentList: [], commonData: {}, gender: []});
  const [editFlag, setEditFlag] = useState({flag: false, student_data: {}});

  useEffect(() => {
    axios.post(`https://mtml-api.hestawork.com/api/user/filter-students`, { page: "1", limit: "10"})
    .then((res) => {
      const response = res.data.data.docs
      setData(prevState => ({
        ...prevState,
        studentList: response,
        gender: [...new Set(response.map((ele) => ele.student.gender? ele.student.gender: null))],
      }));
    });
    axios.get(`https://mtml-api.hestawork.com/api/userClass/class-details`)
    .then((res) => {
      const response = res.data.data
      let sectionObj = {}
      setData(prevState => ({
        ...prevState,
          commonData: {
            campus: response.campus.map((ele) => ele.campus_name ? ele.campus_name: null),
            classes: response.classes.map((ele) => ele.class_name ? ele.class_name: null),
            section: response.classes.map((ele) => {
              return {...sectionObj, [ele.class_name]: ele.section.map((item) => {
                return item.section
              })}
            }),
          }
      }));
    })
  }, []);

  const handleEdit = (ele) => {
    setEditFlag({flag: true, student_data: ele});
  }
  const handleCancel = () => {
    setEditFlag({flag: false, student_data: {}});
    axios.post(`https://mtml-api.hestawork.com/api/user/filter-students`, { page: "1", limit: "10"})
    .then((res) => {
      const response = res.data.data.docs
      setData(prevState => ({
        ...prevState,
        studentList: response,
        gender: [...new Set(response.map((ele) => ele.student.gender? ele.student.gender: null))],
      }));
    });
  }

  return (
    <div id="container" style={{position: "relative"}}>
      <div id="div1" className={editFlag.flag? "t-div":""}>
        <div className="student-header">
        <span><h1>Student Information</h1></span>
        <span><AiOutlineHome style={{color: 'orange'}}/>  <AiOutlineDoubleRight /> Student Management</span>
        </div>
        <table className="content-table">
        <thead>
          <tr>
            <th><input type="checkbox"></input></th>
            <th>STIDENT ID</th>
            <th>FIRST NAME</th>
            <th>LAST NAME</th>
            <th>CLASS</th>
            <th>SECTION</th>
            <th>EMAIL ADDRESS</th>
            <th>CAMPUS</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {data.studentList.map((ele, index) => {
              return(
                ele.student &&
              <tr key={index}>
                <td><input type="checkbox"></input></td>
                <td>{ele.student.student_id}</td>
                <td>{ele.first_name}</td>
                <td>{ele.last_name}</td>
                <td>{ele.student.class_name}</td>
                <td>{ele.student.section}</td>
                <td>{ele.email}</td>
                <td>{ele.campus}</td>
                <td style={{fontSize: '20px'}}>
                  <FiEdit className="edit-button" onClick={() => handleEdit(ele)}></FiEdit>
                  <BiBlock style={{margin: '0 0.6rem', color: 'orange'}} />
                  <AiOutlineDelete style={{color: 'red'}} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      </div>
      {editFlag.flag && 
        <div id="div2">
          <EditScreen handleCancel={handleCancel} commonData={data.commonData} gender={data.gender} stdData={editFlag.student_data}/>
        </div>
      }
    </div>
  );
}

export default App;
