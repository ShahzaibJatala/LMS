import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import axios from 'axios'
import { useDispatch } from 'react-redux';
import { setUserData } from '../Redux/userSlice';

function getCurrentUser() {

    const dispatch = useDispatch();

    useEffect(() => {

      const fetchUser = async () => {
        try {
          const result = await axios.get(serverUrl + "/api/user/getcurrentuser",
          {withCredentials: true})
          dispatch(setUserData(result.data))

        } catch (error) {
          dispatch(setUserData(null))          
          
        }
        
      }
      fetchUser();
    },[dispatch])

}

export default getCurrentUser