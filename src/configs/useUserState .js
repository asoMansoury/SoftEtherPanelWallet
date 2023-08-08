import { useState, useEffect } from 'react';

export const useUserState = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedIsLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      const storedUserEmail = localStorage.getItem('userEmail') || '';
      setIsLoggedIn(storedIsLoggedIn);
      setUserEmail(storedUserEmail);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {

      localStorage.setItem('isLoggedIn', isLoggedIn ? 'true' : 'false');
      localStorage.setItem('userEmail', userEmail);
    }
  }, [isLoggedIn, userEmail]);

  function getUserInformation(){
    return {
      userEmail,
      isLoggedIn
    }
  }

  return {isLoading, setIsLoading, isLoggedIn, userEmail, setIsLoggedIn, setUserEmail,getUserInformation };
};