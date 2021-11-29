import apiService from '../services/api.service';

const state = { status: 'idle', result : [] };

const actions = {
    search({ dispatch, commit }:any, { vin, vrn, checkDatetime, is_rg }:any):void {
        commit('searchRequest', { vin, vrn, checkDatetime, is_rg });
    
        apiService.get('search-item2', { vin, vrn })
            .then(
                (result:any) => {
                    commit('searchSuccess', result);
                },
                (error:any) => {
                    commit('searchFailure', error);
                    dispatch('alertSlice/error', error, { root: true });
                }
            );
    },
};

const getters = {
}

const mutations = {
    searchRequest(state:any) {
        state.status = 'pending';
    },
    searchSuccess(state:any, result:any) {
        state.status = 'idle';
        state.result = result;
    },
    searchFailure(state:any) {
        state.status = 'error';
        state.result = [];
    }
};

export const idem2Slice = {
    namespaced: true ,   // user true if you want to add namespace/prefix on actions/mutation name ex : idem2Slice/search
    state,
    actions,
    mutations,
    getters
};