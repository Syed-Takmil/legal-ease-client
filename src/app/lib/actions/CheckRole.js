import GetUser from "./GetUser";





const CheckRole = (role) => {

    const user=GetUser();
    const realRole=user?.role;

    if(!user) return false;

    if(role!==realRole) return false
    return true
};

export default CheckRole;