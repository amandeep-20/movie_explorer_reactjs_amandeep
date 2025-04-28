import toast from 'react-hot-toast';
import axios, { AxiosResponse } from 'axios';

const BASE_URL = 'https://movie-explorer-ror-aalekh-2ewg.onrender.com'; // Replace with your actual API base URL

interface UserResponse {
  id: number;
  email: string;
  role: string;
  token: string;
}

// Interface for the request payload
interface UserPayload {
  email: string;
  password: string;
}

// API function to handle user login and store data in local storage
export const loginAPI = async (payload: UserPayload) => {
  const { email, password } = payload;

  try {
    const response: AxiosResponse<Omit<UserResponse, 'token'>> = await axios.post(
      `${BASE_URL}/users/sign_in`,
      {
        user: { email, password },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      }
    );

    // Extract token from response headers
    const token = response.headers['access-token'] || ''; 

    // Construct the full UserResponse object
    const userResponse: UserResponse = {
      ...response.data,
      token,
    };

    console.log('Response from API:', userResponse);
    console.log('Response from API:', token);

    // Store token and user data in local storage
    localStorage.setItem('authToken', token);
    localStorage.setItem('userData', JSON.stringify(userResponse));

    return { ...response, data: userResponse };
  } catch (error) {
    console.error('Error occurred while fetching user data:', error);
    return undefined;
  }
};


export const signup = async (payload: { name: string, email: string, password: string, mobile_number: string }) => {
    const { name, email, password, mobile_number } = payload;

    try {
        console.log('Payload sent to API:', { user: { name, email, password, mobile_number } });
        const response = await axios.post(`${BASE_URL}/auth/sign_up`,{ user: { name, email, password, mobile_number } },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            }
        );
        console.log('Signup response:', response);
        return response.data;
    } catch (error: any) {
        console.error('Error Occurred while Signing Up:', error);
        const errorMessage = error.response?.data?.errors ;
        console.log("ERROR MESSAGE: ", error.response?.data?.errors);

        if(errorMessage.length>1){
            toast.error(errorMessage[0]);
        }
        else{
            toast.error(errorMessage);
        }
        throw new Error(errorMessage);
    }
};