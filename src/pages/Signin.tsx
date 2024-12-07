import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { authContext } from '../App';

export default function Signin() {
	const navigate = useNavigate();
	const [authStatus, setAuthStatus] = useContext(authContext);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });
  const [ mainErrors, setMainErrros ] = useState(null)
  const [isSending, setIsSending] = useState(false)
  if(authStatus && authStatus.isSignedIn ) navigate('/')
  const validateField = (name: string, value: string) => {
    let error = '';
    switch (name) {
      case 'email':
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value)) {
          error = 'Invalid email address';
        }
        break;
      case 'password':
        if (value.length < 8) {
          error = 'Password must be at least 8 characters';
        }
        break;
      default:
        break;
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    validateField('email', formData.email);
    validateField('password', formData.password);
	//@ts-ignore
    if (Object.keys(errors).every((key) => !errors[key])) {
		setIsSending(true)
      fetch('/api/auth/login', {
        method: 'POST',
		credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
        .then((res) => res.json())
        .then((data) =>{ 
			console.log(data)
			setMainErrros(data.error ? data.error :  '')
			if(data.success)
			{
				//@ts-ignore
				setAuthStatus({isSignedIn: true})
			}
		})
        .catch((err) => console.error(err))
		.finally(() => setIsSending(false))
    }
  };

  return (
    <div  style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
	  <h2 style={{ color: '#007bff', marginBottom: '1em' }}>Sign In</h2>
      <form onSubmit={handleSubmit} style={{ width: '400px', height: '300px', padding: '2em', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 0 10px rgba(0,0,0,0.2)' }} >
        <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '1em' }}>
          <label style={{ fontSize: '1.2em', color: '#333' }}>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.5em', fontSize: '1.2em', border: '1px solid #ccc', borderRadius: '5px' }}
          />
          {errors.email && <span style={{ color: 'red' }}>{errors.email}</span>}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '1em' }}>
          <label style={{ fontSize: '1.2em', color: '#333' }}>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.5em', fontSize: '1.2em', border: '1px solid #ccc', borderRadius: '5px' }}
          />
          {errors.password && <span style={{ color: 'red' }}>{errors.password}</span>}
        </div>
		{isSending ? <p style={{ textAlign: 'center', color: '#007bff' }}>Sending request...</p> : null}
          {mainErrors && <span style={{ color: 'red' }}>{mainErrors}</span>}
        <button type="submit" style={{ width: '100%', padding: '0.5em', fontSize: '1.2em', backgroundColor: '#007bff', color: 'white', borderRadius: '5px', border: 'none' }}>Sign In</button>
		<p>New <a href='/register'>Register Here</a></p>
	  </form>
    </div>
  )
}