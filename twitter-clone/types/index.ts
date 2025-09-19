export interface User {
  id: string;
  clerkId: string;
  username: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: User;
}

export interface Post {
  id: string;
  content: string;
  image?: string;
  createdAt: string;
  user: User;
  likes: string[];
  comments: Comment[];
}

export interface Notification {
  id: string;
  from: {
    username: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
  };
  to: string;
  type: "like" | "comment" | "follow";
  post?: {
    id: string;
    content: string;
    image?: string;
  };
  comment?: {
    id: string;
    content: string;
  };
  createdAt: string;
}


export interface LikeUser {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  profilePicture: string;
  createdAt: string; // or Date if you parse it
  updatedAt: string; // or Date if you parse it
}
