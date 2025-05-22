import { toast } from 'react-toastify';
import { apiConnector } from './apiConnector';

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

export const loginAPI = async (payload: UserPayload): Promise<UserResponse> => {
  const { email, password } = payload;
  try {
    const response = await apiConnector('POST', '/api/v1/users/sign_in', { user: { email, password } });
    console.log('Login response:', response.data);
    localStorage.setItem('token', response?.data?.token);
    localStorage.setItem('user', JSON.stringify(response?.data));
    const userResponse: UserResponse = { ...response.data };
    return userResponse;
  } catch (error: any) {
    const errorMessage = error.response?.data?.errors;
    console.error('Error Occurred while Signing In: ', errorMessage);
    if (errorMessage) {
      if (Array.isArray(errorMessage) && errorMessage.length > 1) {
        errorMessage.forEach((message: string, index: number) => {
          setTimeout(() => {
            toast.error(message);
          }, index * 2000);
        });
      } else {
        toast.error(Array.isArray(errorMessage) ? errorMessage[0] : errorMessage);
      }
    } else {
      toast.error('An unexpected error occurred during login');
    }
    throw new Error(errorMessage || 'Login failed');
  }
};

export const signup = async (payload: {
  first_name: string;
  email: string;
  password: string;
  mobile_number: string;
  last_name?: string;
}) => {
  const { first_name, email, password, mobile_number, last_name = 'rana' } = payload;
  try {
    const response = await apiConnector('POST', '/api/v1/users', {
      user: { first_name, email, password, mobile_number, last_name },
    });
    console.log('Signup response:', response.data);
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.errors;
    console.error('Error Occurred while Signing Up:', errorMessage);
    if (errorMessage) {
      if (Array.isArray(errorMessage) && errorMessage.length > 1) {
        errorMessage.forEach((message: string, index: number) => {
          setTimeout(() => {
            toast.error(message);
          }, index * 2000);
        });
      } else {
        toast.error(Array.isArray(errorMessage) ? errorMessage[0] : errorMessage);
      }
    } else {
      toast.error('An unexpected error occurred during signup');
    }
    throw new Error(errorMessage || 'Signup failed');
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
    const response = await apiConnector('GET', `/api/v1/movies`, null, null, false, { page });
    const movieData: MovieResponse = {
      movies: response.data.movies || [],
      pagination: response.data.pagination || {
        current_page: page,
        total_pages: 1,
        total_count: response.data.movies?.length || 0,
        per_page: 3,
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

export const getSubscripstionStatus = async (): Promise<SubscriptionStatus> => {
  try {
    const response = await apiConnector('GET', '/api/v1/subscriptions/status');
    console.log('Subscription Status:', response.data.subscription);
    return response.data.subscription;
  } catch (error: any) {
    console.error('Subscription Status Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw new Error(error.response?.data?.error || 'Failed to fetch subscription status');
  }
};

export const createSubscription = async (planType: string): Promise<string> => {
  try {
    const response = await apiConnector('POST', '/api/v1/subscriptions', { plan_type: planType });
    console.log('API Response:', response.data);
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

export const getMoviesById = async (id: number): Promise<Movie | null> => {
  try {
    const response = await apiConnector('GET', `/api/v1/movies/${id}`);
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
    const response = await apiConnector('GET', '/api/v1/movies', null, null, false, { genre, page });
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
    const params: { title: string; page: number; genre?: string } = { title, page };
    if (genre && genre !== 'all') {
      params.genre = genre;
    }
    const response = await apiConnector('GET', '/api/v1/movies', null, null, false, params);
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
  poster: File;
  banner: File;
  isPremium: boolean;
}

export const createMovie = async (formData: MovieFormData): Promise<Movie | null> => {
  try {
    const movieFormData = new FormData();
    movieFormData.append('movie[title]', formData.title);
    movieFormData.append('movie[genre]', formData.genre);
    movieFormData.append('movie[release_year]', formData.releaseYear);
    movieFormData.append('movie[director]', formData.director);
    movieFormData.append('movie[duration]', formData.duration);
    movieFormData.append('movie[description]', formData.description);
    movieFormData.append('movie[main_lead]', formData.mainLead);
    movieFormData.append('movie[streaming_platform]', formData.streamingPlatform);
    movieFormData.append('movie[rating]', formData.rating);
    movieFormData.append('movie[premium]', String(formData.isPremium));
    if (formData.poster) {
      movieFormData.append('movie[poster]', formData.poster);
    }
    if (formData.banner) {
      movieFormData.append('movie[banner]', formData.banner);
    }

    const response = await apiConnector('POST', '/api/v1/movies', movieFormData, null, true);
    const movie: Movie = response.data;
    console.log('Movie created successfully:', movie);
    return movie;
  } catch (error: any) {
    console.error('Error creating movie:', error.message, error.response?.data);
    const errorMessage = error.response?.data?.error || 'Failed to create movie';
    toast.error(errorMessage);
    return null;
  }
};

export const updateMovie = async (id: number, formData: MovieFormData): Promise<Movie | null> => {
  try {
    const movieFormData = new FormData();
    movieFormData.append('movie[title]', formData.title);
    movieFormData.append('movie[genre]', formData.genre);
    movieFormData.append('movie[release_year]', formData.releaseYear);
    movieFormData.append('movie[director]', formData.director);
    movieFormData.append('movie[duration]', formData.duration);
    movieFormData.append('movie[description]', formData.description);
    movieFormData.append('movie[main_lead]', formData.mainLead);
    movieFormData.append('movie[streaming_platform]', formData.streamingPlatform);
    movieFormData.append('movie[rating]', formData.rating);
    movieFormData.append('movie[premium]', String(formData.isPremium));
    if (formData.poster) {
      movieFormData.append('movie[poster]', formData.poster);
    }
    if (formData.banner) {
      movieFormData.append('movie[banner]', formData.banner);
    }

    const response = await apiConnector('PATCH', `/api/v1/movies/${id}`, movieFormData, null, true);
    const movie: Movie = response.data;
    console.log('Movie updated successfully:', movie);
    return movie;
  } catch (error: any) {
    console.error('Error updating movie:', error.message, error.response?.data);
    const errorMessage = error.response?.data?.error || 'Failed to update movie';
    toast.error(errorMessage);
    return null;
  }
};

export const deleteMovie = async (id: number): Promise<boolean> => {
  try {
    await apiConnector('DELETE', `/api/v1/movies/${id}`);
    console.log(`Movie with ID ${id} deleted successfully`);
    return true;
  } catch (error: any) {
    console.error('Error deleting movie:', error.message, error.response?.data);
    const errorMessage = error.response?.data?.error || 'Failed to delete movie';
    toast.error(errorMessage);
    return false;
  }
};

interface UserData {
  token?: string;
  email?: string;
  role?: string;
  first_name: string;
  join_date?: string;
  mobile_number?: string;
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
    const response = await apiConnector('POST', '/api/v1/users/update_device_token', { device_token: token });
    console.log('Device token sent to backend successfully:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error sending device token to backend:', error);
    const errorMessage = error.response?.data?.message || 'Failed to send device token';
    throw new Error(errorMessage);
  }
};

export const verifySubscription = async (sessionId: string) => {
  try {
    const response = await apiConnector('GET', `/api/v1/subscriptions/success`, null, null, false, { session_id: sessionId });
    return response.data;
  } catch (error: any) {
    console.error('Error verifying subscription:', error);
    throw new Error(error.response?.data?.error || 'Failed to verify subscription. Please try again.');
  }
};

export const fetchCurrentUser = async (): Promise<UserData> => {
  try {
    const userId = localStorage.getItem('user.id');
    const response = await apiConnector('GET', '/api/v1/current_user', null, null, true, { id: userId });
    console.log('Fetched user data:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching user data:', error);
    throw new Error('Failed to fetch user data');
  }
};