import { userService } from '../services/user.service';
import router  from '../router';



const userJson:any = sessionStorage.getItem('nabil-user');
const user = JSON.parse(userJson);
const state = user ? { status: { loggedIn: true }, user } : { status: {}, user: {name:"Must loggin !!"} };

const actions = {
    login({ dispatch, commit }:any, { username, password }:any):void {
        commit('loginRequest', { username });
    
        userService.login(username, password)
            .then(
                (user:any) => {
                    commit('loginSuccess', user);
                    router.push('/');
                },
                (error:any) => {
                    commit('loginFailure', error);
                    dispatch('alertSlice/error', error, { root: true });
                }
            );
    },
    logout({ commit }:any):void {
        userService.logout();
        commit('logout');
        router.push('/login');
    }
};

const getters = {
    getLoggedUser(){
        return state.user;
    },
    hasRole(){
        return (roleName:string) => state.user && state.user.roles && state.user.roles.includes(roleName);
    },
    hasOneRoleIn(){
        return (expectedRoles:Array<string>) => state.user && state.user.roles && expectedRoles.some((role)=> state.user.roles.includes(role));

    },
    haAllRoleIn(){
        return (expectedRoles:Array<string>) => state.user && state.user.roles && expectedRoles.some((role)=> !state.user.roles.includes(role));
    }
}

const mutations = {
    loginRequest(state:any, user:any) {
        state.status = { loggingIn: true };
        state.user = user;
    },
    loginSuccess(state:any, user:any) {
        state.status = { loggedIn: true };
        state.user = user;
    },
    loginFailure(state:any) {
        state.status = {};
        state.user = null;
    },
    logout(state:any) {
        state.status = {};
        state.user = null;
    },
};

export const useSlice = {
    namespaced: true ,   // user true if you want to add namespace/prefix on actions/mutation name ex : useSlice/hasRole
    state,
    actions,
    mutations,
    getters
};