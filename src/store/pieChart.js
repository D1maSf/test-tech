import { createStore } from 'vuex';
import VuexPersist from 'vuex-persist';

const vuexPersist = new VuexPersist({
    key: 'my-app',
    storage: localStorage,
    reducer: (state) => ({
        pieData: state.pieData,
    }),
});

export default createStore({
    state: {
        items: [],
        pieData: {
            labels: [],
            datasets: [
                {
                    backgroundColor: [],
                    data: [],
                },
            ],
        },
    },
    mutations: {
        ADD_DATA(state, payload) {
            console.log('[Mutation ADD_DATA] Before:', JSON.stringify(state.pieData));
            state.pieData = {
                labels: [...state.pieData.labels, payload.label],
                datasets: [{
                    data: [...state.pieData.datasets[0].data, payload.value],
                    backgroundColor: [...state.pieData.datasets[0].backgroundColor, payload.color],
                }],
            };
            console.log('[Mutation ADD_DATA] After:', JSON.stringify(state.pieData));
        },
        UPDATE_DATA(state, { index, data }) {
            console.log('[Mutation UPDATE_DATA] Before:', JSON.stringify(state.pieData));
            const labels = [...state.pieData.labels];
            labels[index] = data.label;

            const dataArr = [...state.pieData.datasets[0].data];
            dataArr[index] = data.value;

            const colors = [...state.pieData.datasets[0].backgroundColor];
            colors[index] = data.color;

            state.pieData = {
                labels,
                datasets: [{
                    data: dataArr,
                    backgroundColor: colors,
                }],
            };
            console.log('[Mutation UPDATE_DATA] After:', JSON.stringify(state.pieData));
        },
        REMOVE_DATA(state, index) {
            console.log('[Mutation REMOVE_DATA] Before:', JSON.stringify(state.pieData));
            const labels = state.pieData.labels.filter((_, i) => i !== index);
            const dataArr = state.pieData.datasets[0].data.filter((_, i) => i !== index);
            const colors = state.pieData.datasets[0].backgroundColor.filter((_, i) => i !== index);

            state.pieData = {
                labels,
                datasets: [{
                    data: dataArr,
                    backgroundColor: colors,
                }],
            };
            console.log('[Mutation REMOVE_DATA] After:', JSON.stringify(state.pieData));
        },
        RESET_DATA(state) {
            console.log('[Mutation RESET_DATA] Before:', JSON.stringify(state.pieData));
            state.pieData = {
                labels: [],
                datasets: [{
                    backgroundColor: [],
                    data: [],
                }],
            };
            console.log('[Mutation RESET_DATA] After:', JSON.stringify(state.pieData));
        },
    },
    actions: {
        addData({ commit }, data) {
            console.log('[Action addData]', data);
            commit('ADD_DATA', data);
        },
        updateData({ commit }, payload) {
            console.log('[Action updateData]', payload);
            commit('UPDATE_DATA', payload);
        },
        removeData({ commit }, index) {
            console.log('[Action removeData]', index);
            commit('REMOVE_DATA', index);
        },
        resetData({ commit }) {
            console.log('[Action resetData]');
            commit('RESET_DATA');
        },
    },
    getters: {
        dataCount: (state) => state.pieData.labels.length
    },
    plugins: [vuexPersist.plugin],
});