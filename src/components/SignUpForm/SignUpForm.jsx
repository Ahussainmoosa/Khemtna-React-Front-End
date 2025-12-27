import { useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import { signUp } from '../../services/authService';
import { UserContext } from '../../contexts/UserContext';

const SignUpForm = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    ContactNumber: '',
    password: '',
    passwordConf: '',
    role: 'user',
  });

  const handleChange = (e) => {
    setMessage('');
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await signUp(formData);
      setUser(user);
      navigate('/');
    } catch (err) {
      setMessage(err.message);
    }
  };

  const isFormInvalid = () =>
    !(
      formData.username &&
      formData.email &&
      formData.ContactNumber &&
      formData.password &&
      formData.password === formData.passwordConf
    );

  return (
    <main>
      <h1>Create an Account</h1>
      <p>{message}</p>

      <form onSubmit={handleSubmit}>
        <input name="username" placeholder="Username" onChange={handleChange} />
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input name="ContactNumber" placeholder="Phone Number" onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} />
        <input
          type="password"
          name="passwordConf"
          placeholder="Confirm Password"
          onChange={handleChange}
        />

        <button disabled={isFormInvalid()}>Sign Up</button>
        <button type="button" onClick={() => navigate('/')}>Cancel</button>
      </form>
    </main>
  );
};

export default SignUpForm;
