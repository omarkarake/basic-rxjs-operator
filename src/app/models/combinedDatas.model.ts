// Define types for user details and user posts
interface UserDetails {
    userId: number;
    username: string;
    email: string;
    error?: string; // Optional error field in case of errors
  }
  
  interface UserPost {
    postId: number;
    title: string;
    content: string;
    image: string;
  }
  
  // Define a type that can be either the successful data or an error
  export type CombinedData = { userDetails: UserDetails; userPosts: UserPost[] } | { error: string };
  