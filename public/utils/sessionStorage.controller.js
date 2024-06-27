export const addSession = (user)=>{
    sessionStorage.setItem('user', JSON.stringify(user))
}

export const getSession = ()=>{
    return JSON.parse(sessionStorage.getItem('user'))
}