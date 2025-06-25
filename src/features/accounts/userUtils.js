export const getUserCompany = (userId, companies) => {
    if (!companies || !Array.isArray(companies)) {
        return "Celebrity Systems";
    }
    const company = companies.find(c => 
      c.userList?.some(user => user.id === userId)
    );
    return company?.name || "Celebrity Systems";
  };
  
  export const filterUsersByRole = (users, role) => {
    return role === "ALL" ? users : users.filter(user => user.role === role);
  };
  
  export const searchUsers = (users, query) => {
    return users.filter((user) =>
      user.fullName?.toLowerCase().includes(query.toLowerCase()) ||
      user.email?.toLowerCase().includes(query.toLowerCase()) ||
      user.username?.toLowerCase().includes(query.toLowerCase())
    );
  };