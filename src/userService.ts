interface User {
    name: string;
    email: string;
  }
  
  const users: User[] = [];
  
  export const getUsers = (): User[] => users;
  
  export const createUser = (user: User): User => {
    users.push(user);
    return user;
  };

export const getUserByEmail = (email:string):User | undefined => users.find((user:User) => user.email === email );
