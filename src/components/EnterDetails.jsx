import React, { useCallback, useEffect, useState } from 'react';
import { useSocket } from '../context/SocketProvider';
import { useNavigate } from 'react-router-dom';

const EnterDetails = () => {

  const socket = useSocket();

  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    roomNo: ''
  });
  
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = useCallback(
    (e) => {
    e.preventDefault();
    setSubmitted(true);
    localStorage.setItem("name",formData.name)
    socket.emit('join-room',formData)
    // console.log('Form submitted:', formData); 
  },[formData,socket]);

  const handleJoinRoom = useCallback((data)=>{
    
    const {name,email,roomNo} = data
    navigate(`/room/${roomNo}`)
  },[navigate])

  useEffect(()=>{
    socket.on('join-room',handleJoinRoom)
    
    return ()=>{
      socket.off('join-room',handleJoinRoom)
    }
  },[socket, handleJoinRoom])

  // Custom color variables based on the provided color scheme
  const colors = {
    darkBlue: '#212A31',
    navyBlue: '#2E3944',
    teal: '#124E66',
    grayTeal: '#748D92',
    lightGray: '#D3D9D4'
  };

  return (
    <div className="flex justify-center items-center min-h-screen" style={{ backgroundColor: colors.lightGray }}>
      <div className="w-full max-w-md p-8 space-y-6 rounded-lg shadow-xl" style={{ backgroundColor: colors.darkBlue, color: 'white', borderColor: colors.grayTeal, borderWidth: '2px' }}>
        <div className="text-center">
          <h2 className="mt-2 text-3xl font-bold" style={{ color: colors.grayTeal }}>Enter Details</h2>
          <p className="mt-2 text-sm" style={{ color: colors.lightGray }}>Please provide your information below</p>
        </div>
        
        { (
          <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium" style={{ color: colors.grayTeal }}>
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none"
                  style={{ 
                    backgroundColor: colors.lightGray, 
                    color: colors.darkBlue,
                    borderColor: colors.grayTeal,
                  }}
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium" style={{ color: colors.grayTeal }}>
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none"
                  style={{ 
                    backgroundColor: colors.lightGray, 
                    color: colors.darkBlue,
                    borderColor: colors.grayTeal,
                  }}
                  placeholder="john@example.com"
                />
              </div>
              
              <div>
                <label htmlFor="roomNo" className="block text-sm font-medium" style={{ color: colors.grayTeal }}>
                  Room Number
                </label>
                <input
                  id="roomNo"
                  name="roomNo"
                  type="text"
                  required
                  value={formData.roomNo}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none"
                  style={{ 
                    backgroundColor: colors.lightGray, 
                    color: colors.darkBlue,
                    borderColor: colors.grayTeal,
                  }}
                  placeholder="101"
                />
              </div>
            </div>
            
            <div>
              <button
                type="submit"
                className="w-full py-3 px-4 text-sm font-medium rounded-md transition-colors duration-200 shadow-md"
                style={{ 
                  backgroundColor: colors.teal, 
                  color: 'white',
                  border: 'none'
                }}
              >
                Submit Details
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EnterDetails;