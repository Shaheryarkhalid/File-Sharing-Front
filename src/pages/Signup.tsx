
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { authContext } from '../App';


export default function Signup() {
	const navigate = useNavigate()
	const authStatus = useContext(authContext);
	const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [ mainErrors, setMainErrors ] = useState(null)
  const [isSending, setIsSending] = useState(false)
  //@ts-ignore
  if(authStatus && authStatus.isSignedIn ) navigate('/')
	const validateField = (name: string, value: string) => {
		let error = '';
		switch (name) {
		case 'firstName':
		case 'lastName':
			if (value.length < 4 || value.length > 14) {
			error = `${name === 'firstName' ? 'First name' : 'Last name'} must be between 4 and 14 characters`;
			}
			break;
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
		case 'confirmPassword':
			if (value !== formData.password) {
			error = 'Passwords do not match';
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
	console.log('hit here')
	e.preventDefault();
	validateField('firstName', formData.firstName);
	validateField('lastName', formData.lastName);
	validateField('email', formData.email);
	validateField('password', formData.password);
	validateField('confirmPassword', formData.confirmPassword);
	// @ts-ignore
	if (Object.keys(errors).every((key) => !errors[key])) {
	  setIsSending(true)
	  fetch('http://localhost:8080/auth/register', {
		method: 'POST',
		credentials: 'include',
		headers: {
		  'Content-Type': 'application/json',
		},
		body: JSON.stringify(formData),
	  })
		.then((res) => res.json())
		.then((data) => {
			setIsSending(false)
			setMainErrors(data.error)
			console.log(data)
			if(data.success) navigate('/')
		})
		.catch((err) => {
			setIsSending(false)
			console.error(err);
		});
		// .catch((err) => console.error(err));
	}
  }
  return (
    <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <h2 style={{ color: '#007bff', marginBottom: '1em' }}>Sign up</h2>
      <form style={{ width: '400px', height: '600px', padding: '2em', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 0 10px rgba(0,0,0,0.2)', display: 'fles', alignItems: 'center', justifyContent: 'center' }} onSubmit={handleSubmit}>
        <div  style={{ display: 'flex', flexDirection: 'column', marginBottom: '1em' }}>
          <label style={{ fontSize: '1.2em', color: '#333' }}>First Name</label>
          <input
				type="text"
				name="firstName"
				value={formData.firstName}
				onChange={handleChange}
				style={{ width: '100%', padding: '0.5em', fontSize: '1.2em', border: '1px solid #ccc', borderRadius: '5px' }}
			/>
          {errors.firstName && <span style={{ color: 'red' }}>{errors.firstName}</span>}
        </div>
        <div  style={{ display: 'flex', flexDirection: 'column', marginBottom: '1em' }}>
          <label style={{ fontSize: '1.2em', color: '#333' }}>Last Name</label>
          <input 
				type="text"
				name="lastName" 
				value={formData.lastName} 
				onChange={handleChange}
				style={{ width: '100%', padding: '0.5em', fontSize: '1.2em', border: '1px solid #ccc', borderRadius: '5px' }}
			/>
          {errors.lastName && <span style={{ color: 'red' }}>{errors.lastName}</span>}
        </div>
        <div  style={{ display: 'flex', flexDirection: 'column', marginBottom: '1em' }}>
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
        <div  style={{ display: 'flex', flexDirection: 'column', marginBottom: '1em' }}>
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
        <div  style={{ display: 'flex', flexDirection: 'column', marginBottom: '1em' }}>
          <label style={{ fontSize: '1.2em', color: '#333' }}>Confirm Password</label>
          <input 
		  		type="password" 
				name="confirmPassword" 
				value={formData.confirmPassword} 
				onChange={handleChange} 
				style={{ width: '100%', padding: '0.5em', fontSize: '1.2em', border: '1px solid #ccc', borderRadius: '5px' }}
			/>
          {errors.confirmPassword && <span style={{ color: 'red' }}>{errors.confirmPassword}</span>}
        </div>
		<span style={{ color: 'red' }}>{mainErrors && mainErrors}</span>
        <button type="submit" style={{ width: '100%', padding: '0.5em', fontSize: '1.2em', backgroundColor: '#007bff', color: 'white', borderRadius: '5px', border: 'none' }} disabled={isSending} >{isSending ? 'Sending...' : 'Submit'}</button>
		<p>Already have account <a href='/login'>Login Here</a></p>
	  </form>
    </div>
  );
}
