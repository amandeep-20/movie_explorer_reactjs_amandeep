import { toast } from 'react-toastify';
import axios, { AxiosResponse } from 'axios'; 
const BASE_URL = import.meta.env.VITE_BASE_URL;

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
      const response = await axios.post(`${BASE_URL}/api/v1/users/sign_in`, { user: { email, password } },
          {
              headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
              }
          }
      );
      console.log("helooooooooooooooooooo", response.data);
      localStorage.setItem("token", response?.data?.token);
      localStorage.setItem("user", JSON.stringify(response?.data));
      const userResponse: UserResponse = {
        ...response.data,
      };

      return userResponse;
  } catch (error: any) {
      console.error("Error Occurred while Signing In: ", error);
      const errorMessage = error.response?.data?.errors;
      console.log("ERROR MESSAGE: ", errorMessage);

      if (errorMessage) {
          if (Array.isArray(errorMessage) && errorMessage.length > 1) {
              // Show errors one by one sequentially
              errorMessage.forEach((message: string, index: number) => {
                  setTimeout(() => {
                      toast.error(message);
                  }, index * 2000); // 2-second delay between toasts
              });
          } else {
              // Single error or string error
              toast.error(Array.isArray(errorMessage) ? errorMessage[0] : errorMessage);
          }
      } else {
          // Fallback for unexpected errors
          toast.error("An unexpected error occurred during login");
      }

      throw new Error(errorMessage || "Login failed");
  }
};

export const signup = async (payload: { first_name: string, email: string, password: string, mobile_number: string, last_name?: string }) => {
    const { first_name, email, password, mobile_number, last_name = "rana" } = payload;

    try {
        const response = await axios.post(`${BASE_URL}/api/v1/users`, { user: { first_name, email, password, mobile_number, last_name } },
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
        const errorMessage = error.response?.data?.errors;
        console.log("ERROR MESSAGE: ", errorMessage);

        if (errorMessage) {
            if (Array.isArray(errorMessage) && errorMessage.length > 1) {
                // Show errors one by one sequentially
                errorMessage.forEach((message: string, index: number) => {
                    setTimeout(() => {
                        toast.error(message);
                    }, index * 2000); // 2-second delay between toasts
                });
            } else {
                // Single error or string error
                toast.error(Array.isArray(errorMessage) ? errorMessage[0] : errorMessage);
            }
        } else {
            // Fallback for unexpected errors
            toast.error("An unexpected error occurred during signup");
        }

        throw new Error(errorMessage || "Signup failed");
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

  interface MovieResponse {
    movies: Movie[];
    pagination: {
      current_page: number;
      total_pages: number;
      total_count: number;
      per_page: number;
    };
  }

  export const getAllMovies = async (page: number = 1): Promise<MovieResponse> => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/movies?page=${page}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      const movieData: MovieResponse = {
        movies: response.data.movies || [],
        pagination: response.data.pagination || {
          current_page: page,
          total_pages: 1,
          total_count: response.data.movies?.length || 0,
          per_page: 3 ,
        },
      };
      console.log('Fetched movies:', movieData);
      return movieData;
    } catch (error: any) {
      console.error('Error fetching movies:', error.message);
      return {
        movies: [],
        pagination: {
          current_page: page,
          total_pages: 1,
          total_count: 0,
          per_page: 10,
        },
      };
    }
  };


  interface SubscriptionStatus {
  plan_type: 'premium' | 'none';
  created_at?: string;
  expires_at?: string;
}

interface ApiError {
  error: string;
}

export const getSubscripstionStatus = async (token: string): Promise<SubscriptionStatus> => {
  try {
    if (!token) {
      toast.error('You need to sign in first.');
      throw new Error('No authentication token found');
    }

    const response: AxiosResponse<{ subscription: SubscriptionStatus } | ApiError> = await axios.get(
      `${BASE_URL}/api/v1/subscriptions/status`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if ('error' in response.data) {
      throw new Error(response.data.error);
    }

    console.log('Subscription Status:', response.data.subscription);
    return response.data.subscription;
  } catch (error) {
    console.error('Subscription Status Error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      response: axios.isAxiosError(error) ? error.response?.data : undefined,
      status: axios.isAxiosError(error) ? error.response?.status : undefined,
    });
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Failed to fetch subscription status');
    }
    throw new Error('An unexpected error occurred');
  }
};
  
  
  
  export const createSubscription = async (planType: string): Promise<string> => {
    try {
      const token = localStorage.getItem("token");
      console.log("Retrieved token:", token);
      if (!token) {
        toast.error("You need to sign in first.");
        throw new Error("No authentication token found");
      }

      const response = await axios.post(
        `${BASE_URL}/api/v1/subscriptions`,
        { plan_type: planType },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('API Response:', response.data);

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      const checkoutUrl = response.data.checkoutUrl || response.data.data?.checkoutUrl || response.data.url;
      if (!checkoutUrl) {
        throw new Error('No checkout URL returned from server.');
      }

      return checkoutUrl;
    } catch (error: any) {
      console.error('Error creating subscription:', error);
      throw new Error(error.message || 'Failed to initiate subscription');
    }
};


export const getMoviesById = async (id: number) => {
  const token = localStorage.getItem("token");
    console.log("Retrieved token:", token); // Debug log to check token value
    if (!token) {
      toast.error("You need to sign in first.");
      throw new Error("No authentication token found");
    }
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/movies/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
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

  

export const getMoviesByGenre = async (genre: string, page: number = 1): Promise<MovieResponse> => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/movies`, {
      params: {
        genre,
        page, // Include page in query parameters
      },
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    const movieData: MovieResponse = {
      movies: response.data.movies || [],
      pagination: response.data.pagination || {
        current_page: page,
        total_pages: 1,
        total_count: response.data.movies?.length || 0,
        per_page: 10,
      },
    };

    console.log(`Fetched movies for genre ${genre}, page ${page}:`, movieData);
    return movieData;
  } catch (error: any) {
    console.error(`Error fetching movies for genre ${genre}, page ${page}:`, error.message);
    return {
      movies: [],
      pagination: {
        current_page: page,
        total_pages: 1,
        total_count: 0,
        per_page: 10,
      },
    };
  }
};

export const searchMoviesByTitle = async (title: string, page: number = 1, genre?: string): Promise<MovieResponse> => {
  try {
    const params: { title: string; page: number; genre?: string } = {
      title,
      page,
    };
    if (genre && genre !== 'all') {
      params.genre = genre;
    }
    const response = await axios.get(`${BASE_URL}/api/v1/movies`, {
      params, 
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    const movieData: MovieResponse = {
      movies: response.data.movies || [],
      pagination: response.data.pagination || {
        current_page: page,
        total_pages: 1,
        total_count: response.data.movies?.length || 0,
        per_page: 10,
      },
    };

    console.log(`Fetched movies for title ${title}, page ${page}:`, movieData);
    return movieData;
  } catch (error: any) {
    console.error(`Error fetching movies for title ${title}, page ${page}:`, error.message);
    return {
      movies: [],
      pagination: {
        current_page: page,
        total_pages: 1,
        total_count: 0,
        per_page: 10,
      },
    };
  }
};


interface MovieFormData {
  title: string;
  genre: string;
  releaseYear: string;
  director: string;
  duration: string;
  description: string;
  mainLead: string;
  streamingPlatform: string;
  rating: string;
  poster: File ;
  banner: File ;
  isPremium: boolean;
}

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



export const createMovie = async (formData: MovieFormData): Promise<Movie | null> => {
  try {
    const token = localStorage.getItem("token");
    console.log("Retrieved token:", token); // Debug log to check token value
    if (!token) {
      toast.error("You need to sign in first.");
      throw new Error("No authentication token found");
    }

    const movieFormData = new FormData();
    movieFormData.append("movie[title]", formData.title);
    movieFormData.append("movie[genre]", formData.genre);
    movieFormData.append("movie[release_year]", formData.releaseYear);
    movieFormData.append("movie[director]", formData.director);
    movieFormData.append("movie[duration]", formData.duration);
    movieFormData.append("movie[description]", formData.description);
    movieFormData.append("movie[main_lead]", formData.mainLead);
    movieFormData.append("movie[streaming_platform]", formData.streamingPlatform);
    movieFormData.append("movie[rating]", formData.rating);
    movieFormData.append("movie[premium]", String(formData.isPremium));
    if (formData.poster) {
      movieFormData.append("movie[poster]", formData.poster);
    }
    if (formData.banner) {
      movieFormData.append("movie[banner]", formData.banner);
    }

    const response = await axios.post(`${BASE_URL}/api/v1/movies`, movieFormData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      },
    });

    const movie: Movie = response.data.movie;
    console.log("Movie created successfully:", movie);
    return movie;
  } catch (error: any) {
    console.error("Error creating movie:", error.message, error.response?.data);
    const errorMessage = error.response?.data?.error || "Failed to create movie";
    toast.error(errorMessage);
    return null;
  }
};


export const updateMovie = async (id: number, formData: MovieFormData): Promise<Movie | null> => {
  try {
    const token = localStorage.getItem("token");
    console.log("Retrieved token:", token);
    if (!token) {
      toast.error("You need to sign in first.");
      throw new Error("No authentication token found");
    }

    const movieFormData = new FormData();
    movieFormData.append("movie[title]", formData.title);
    movieFormData.append("movie[genre]", formData.genre);
    movieFormData.append("movie[release_year]", formData.releaseYear);
    movieFormData.append("movie[director]", formData.director);
    movieFormData.append("movie[duration]", formData.duration);
    movieFormData.append("movie[description]", formData.description);
    movieFormData.append("movie[main_lead]", formData.mainLead);
    movieFormData.append("movie[streaming_platform]", formData.streamingPlatform);
    movieFormData.append("movie[rating]", formData.rating);
    movieFormData.append("movie[premium]", String(formData.isPremium));
    if (formData.poster) {
      movieFormData.append("movie[poster]", formData.poster);
    }
    if (formData.banner) {
      movieFormData.append("movie[banner]", formData.banner);
    }

    const response = await axios.patch(`${BASE_URL}/api/v1/movies/${id}`, movieFormData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      },
    });

    const movie: Movie = response.data.movie;
    console.log("Movie updated successfully:", movie);
    return movie;
  } catch (error: any) {
    console.error("Error updating movie:", error.message, error.response?.data);
    const errorMessage = error.response?.data?.error || "Failed to update movie";
    toast.error(errorMessage);
    return null;
  }
};

export const deleteMovie = async (id: number): Promise<boolean> => {
  try {
    const token = localStorage.getItem("token");
    console.log("Retrieved token:", token);
    if (!token) {
      toast.error("You need to sign in first.");
      throw new Error("No authentication token found");
    }

    await axios.delete(`${BASE_URL}/api/v1/movies/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    console.log(`Movie with ID ${id} deleted successfully`);
    toast.success("Movie deleted successfully!");
    return true;
  } catch (error: any) {
    console.error("Error deleting movie:", error.message, error.response?.data);
    const errorMessage = error.response?.data?.error || "Failed to delete movie";
    toast.error(errorMessage);
    return false;
  }
};


interface UserData {
  token?: string;
}

interface ApiErrorResponse {
  message?: string;
}
export const sendTokenToBackend = async (token: string): Promise<any> => {
  try {
    const userData = localStorage.getItem('user');
    if (!userData) {
      throw new Error('No user data found. User might not be logged in.');
    }

    const user: UserData = JSON.parse(userData);
    const authToken = user?.token;
    if (!authToken) {
      throw new Error('No authentication token found in user data.');
    }

    console.log('Sending FCM token to backend:', token);
    console.log('Using auth token:', authToken);

    const response: AxiosResponse = await axios.post(
      `${BASE_URL}/api/v1/users/update_device_token`,
      { device_token: token },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        }
      }
    );

    console.log('Device token sent to backend successfully:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error sending device token to backend:', error);
    if (error.response) {
      const errorData: ApiErrorResponse = error.response.data || {};
      throw new Error(`Failed to send device token: ${error.response.status} ${error.response.statusText} - ${errorData.message || 'Unknown error'}`);
    }
    throw error;
  }
};



export const verifySubscription = async (sessionId: string) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.get(`${BASE_URL}/api/v1/subscriptions/success?session_id=${sessionId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data; 
  } catch (error) {
    throw error || 'Failed to verify subscription. Please try again.';
  }
};


interface UserData {
  email?: string;
  role?: string;
  name?: string;
  join_date?: string;
  mobile_number?: string;
}

export const fetchCurrentUser = async (): Promise<UserData> => {
  try {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('user.id');
    if (!token) {
      throw new Error('No authentication token found');
    }
    const response = await axios.get(`${BASE_URL}/api/v1/current_user`, {
      params :{
        id : userId,
      },
      headers: {
         'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
      },
    });
    console.log('Fetched user dataaaaaaaaaaaaa:', response.data);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch user data');
  }
};