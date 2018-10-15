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

    *add({ payload, callback }, { call, put }) {
      const response = yield call(addRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
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
