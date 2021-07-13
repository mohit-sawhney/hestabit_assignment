import React, { useState } from 'react';
import Axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

toast.configure()
export default function EditScreen({handleCancel, commonData, gender, stdData}) {

    const payload = {
        "first_name": stdData.first_name,
        "last_name": stdData.last_name,
        "campus": stdData.campus,
        "user_id": stdData._id,
        "student_id": stdData.student.student_id,
        "dob": new Date(stdData.student.dob),
        "gender": stdData.student.gender,
        "email": stdData.email,
        "mobile_number": stdData.mobile_number,
        "class_name": stdData.student.class_name,
        "section": stdData.student.section,
    };

    const [postData, setPostData] = useState(payload)    

    const handleOnChange = (id, e) => {
        setPostData(prevState => ({
            ...prevState,
            [id]: e.target.value
        }));
    }

    const handleEditButton = async () => {
        try {
            const response = await Axios({
                method: 'PUT',
                url: 'https://mtml-api.hestawork.com/api/user/update-student',
                data: postData
            })
            toast.success(response.data.message)
        } catch(e) {
            toast.error(e.message)
        }
        handleCancel()
    }
    const handleCancelButton = () => {
        handleCancel()
    }
    return(
        <div>
            {/* <ToastContainer /> */}
            <div style={{marginTop: '20px'}}>
                <span style={{margin: '10px'}}>EDIT STUDENT</span>
                <button type='submit' className="cross-button" onClick={handleCancelButton}>X</button>
            </div>
            <hr />
            <div className="form">
                <label>First Name*</label><br/>
                <input required type="text" value={postData.first_name} maxLength='50' onChange={(e) => handleOnChange('first_name', e)} /><br/>

                <label>Last Name*</label><br/>
                <input required type="text" value={postData.last_name} maxLength='50' onChange={(e) => setPostData('last_name', e)} /><br/>

                <label>Campus</label><br/>
                <select value={postData.campus} onChange={(e) => handleOnChange('campus', e)} >
                    {commonData.campus.map((item, idx) => <option key={`${item}_${idx}`} value={item}>{item}</option>)}
                </select><br/>

                <label>Student Id*</label><br />
                <input required type="text" disabled value={postData.student_id} /><br/>

                <label>Date of Birth</label><br />
                <DatePicker selected={postData.dob} onChange={(date) => setPostData(prevState => ({...prevState, 'dob': date}))} />

                <label>Gender</label><br />
                <select value={postData.gender} onChange={(e) => handleOnChange('gender', e)}>
                    {gender.map((item, idx) => <option key={`${item}_${idx}`} value={item}>{item}</option>)}
                </select><br/>

                <label>Email Address</label><br />
                <input required type="email" disabled value={postData.email} /><br />

                <label>Mobile No.</label><br />
                <input required type="number" value={postData.mobile_number} maxLength='10' onChange={(e) => handleOnChange('mobile_number', e)}/><br />

                <label>Class</label><br />
                <select value={postData.class_name} onChange={(e) => handleOnChange('class_name', e)}>
                    {commonData.classes.map((item, idx) => <option key={`${item}_${idx}`} value={item}>{item}</option>)}
                </select><br/>

                <label>Section</label><br />
                <select value={postData.section} onChange={(e) => handleOnChange('section', e)} >
                    {commonData.section.filter((item) => Object.keys(item)[0]===postData.class_name)[0][postData.class_name].map((cls, idx) => <option key={`${cls}_${idx}`} value={cls}>{cls}</option>)
                    })
                </select><br/>
            </div>
            <hr />
            <button type="submit" className='save-button' onClick={handleEditButton}>Save</button>
            <button type="submit" className='cancel-button' onClick={handleCancelButton}>Cancel</button>
        </div>
    )
}
