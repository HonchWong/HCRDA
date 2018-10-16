import { getFileList, removeRule, addRule, updateRule , download} from '@/services/api';

export default {
  namespace: 'userloglist',

  state: {
    data: {
      list: [],
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getFileList, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *downloadFile({ payload }, { call, put }) {
      const response = yield call(download, payload);
      // yield put({
      //   type: 'save',
      //   payload: response,
      // });
    },
    // *search({ payload }, { call, put }) {
    //   var data = this.state.data;
    //   for(var i = 0; i < data.list.length; i++) {
    //     var fileName = data.list[i].name;
    //     if (fileName.indexOf(payload) == -1) {
    //       data.list.splice(i, 1);
    //     }
    //   }
    //   // this.data.list = fileNames;
    //
    //   const response = yield call(searchFile, payload);
    //   yield put({
    //     type: 'save',
    //     payload: response,
    //   });
    // },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
