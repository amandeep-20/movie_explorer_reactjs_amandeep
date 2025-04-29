import toast from 'react-hot-toast';
import axios, { AxiosResponse } from 'axios';

const BASE_URL = 'https://movie-explorer-ror-aalekh-2ewg.onrender.com'; // Replace with your actual API base URL

interface UserResponse {
  id: number;
  email: string;
  role: string;
  token: string;
}

interface UserPayload {
  email: string;
  password: string;
}

export const loginAPI = async (payload: { email: string, password: string }) => {
  const { email, password } = payload;

  try {
      const response = await axios.post(`${BASE_URL}/users/sign_in`, { user: {email, password} },
          {
              headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
              }
          }
      );
      console.log("helooooooooooooooooooo",response.data);
      const token =localStorage.setItem("token", response?.data?.token);
      console.log(token);
      localStorage.setItem("user", JSON.stringify(response?.data));
      const userResponse : UserResponse ={
        ...response.data,
      }

      return userResponse;
  }
  catch (error) {
      console.log("Error Occurred while Signing In: ", error);
  }
}


export const signup = async (payload: { name: string, email: string, password: string, mobile_number: string }) => {
    const { name, email, password, mobile_number } = payload;

    try {
        const response = await axios.post(`${BASE_URL}/users`,{ user: { name, email, password, mobile_number } },
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

interface Movie {
    id: number;
    title: string;
    genre: string;
    release_year: number;
    rating: number;
    director: string;
    duration: number;
    description: string;
    premium: boolean;
    main_lead: string;
    streaming_platform: string;
    poster_url: string;
    banner_url: string;
  } 

export const getAllMovies = async()=>{
    try{
        const response = await axios.get(`${BASE_URL}/api/v1/movies`,
            {
                headers:{
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            const movies : Movie[] = response.data;
            console.log("fetched movies", movies);

            return movies;
    }
    catch(error : any){
        console.log("error ", error.message);
    }
}


export const getMoviesById = async (id: number) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/movies/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    const movie: Movie = response.data; 
    console.log('Fetched movie by ID:', movie);
    return movie;
  } catch (error: any) {
    console.error(`Error fetching movie with ID ${id}:`, error.message);
    return null;
  }
};

  

export const getMoviesByGenre = async (genre: string): Promise<Movie[]> => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/movies`, {
        params: {
          genre,  
        },
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      const movies: Movie[] = response.data.movies || [];
      console.log(`Fetched movies for genre ${genre}:`, movies);
      return movies;
    } catch (error: any) {
      console.error(`Error fetching movies for genre ${genre}:`, error.message);
      return [];
    }
  };