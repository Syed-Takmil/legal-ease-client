import React from 'react';
import { authClient } from '../auth-client';




const GetUser = () => {

    const {data:session,isPending}=authClient.useSession();
    const user=session?.user
    return user;
};

export default GetUser;