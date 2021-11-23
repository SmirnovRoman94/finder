export default {
    state: {
        message: 'hello vuex 123'
    },
    mutations: {
        setMessage(state, message){
            state.message = message
        }
    },
    actions: {
        setMessage({commit}, payload){
            commit('setMessage', payload)
        }
    },
    getters: {
        getMessage(state){
            return state.message
        }
    }
}