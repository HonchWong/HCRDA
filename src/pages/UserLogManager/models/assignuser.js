import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { updateNeedUploadListApi , needUploadList} from '@/services/api';

export default {
  namespace: 'assignuser',

  state: {
    needUploadList: {
      needUploadList : [
        {
          key:"123",
          uin:"625845706"
        },
        {
          key:"456",
          uin:"777777"
        }
      ]
    }
  },

  effects: {
    *updateNeedUploadList({ payload }, { call }) {
      yield call(updateNeedUploadListApi, payload);
      message.success('提交成功');
      console.log("assignuser.js updateNeedUploadListApi");
    },

    *fetchNeedUploadList({ payload }, { call, put }) {
      console.log("fetchNeedUploadList");
      const response = yield call(needUploadList, payload);
      yield put({
        type: 'updateList',
        payload: response,
      });
      console.log("fetchNeedUploadList response" + response);
    },
  },

  reducers: {
    updateList(state, action) {
      return {
        ...state,
        needUploadList: action.payload,
      };
    },
  },
};
