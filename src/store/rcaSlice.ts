import apiService from '../services/api.service';

const state = { status: 'idle', result : [] , downloading: false };

function download(response:any, filename:string){
    const url = window.URL.createObjectURL(new Blob([response],{type:'application/pdf'}));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
}

const actions = {
    search({ dispatch, commit }:any, { vin, vrn, checkDatetime, is_rg }:any):void {
        commit('searchRequest', { vin, vrn, checkDatetime, is_rg });
    
        apiService.get('search-rca', { vin, vrn, checkDatetime, is_rg })
            .then(
                (result:any) => {
                    commit('searchSuccess', result);
                },
                (error:any) => {
                    commit('searchFailure', error);
                    dispatch('alertSlice/error', error, { root: true }); // add dispatch from root instead from rcaSlice
                }
            );
    },
    print({commit, dispatch}:any, {vuuid}:any):void {
        commit('downloading');
        apiService.get('print-pdf',{}, {}, false, false)
        .then(
            (response) => {
                commit('downloaded');
                return response.blob();}, 
            (error:any) => {
                commit('downloaded');
                dispatch('alertSlice/error', error, { root: true });}
        )
        .then((response) => {
            if (response)
                download(response, 'nabil-attestation-'+vuuid+'.pdf')
        })
    },
    printPDfSigned({commit, dispatch}:any, {vuuid}:any):void {
        commit('downloading');
        apiService.get('print-pdf-signed',{}, {}, false, false)
        .then(
            (response) => {
                commit('downloaded');
                return response.blob();}, 
            (error:any) => {
                commit('downloaded');
                dispatch('alertSlice/error', error, { root: true });}
        )
        .then((response) => {
            if (response)
                download(response, 'nabil-non-couverture-'+vuuid+'.pdf')
        })
    }
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
    },
    downloading(state:any, ) {
        state.downloading = true;
    },
    downloaded(state:any) {
        state.downloading = false;
    }
};

export const rcaSlice = {
    namespaced: true ,   // user true if you want to add namespace/prefix on actions/mutation name ex : rcaSlice/search
    state,
    actions,
    mutations,
    getters
};