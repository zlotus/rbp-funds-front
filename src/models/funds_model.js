import dva from 'dva';
import {cloneDeep} from 'lodash'
import * as fundService from '../services/funds_service'

export default {
  namespace: 'funds',
  state: {
    fundList: [],
    transactionHistoryDict: {},
    valuationDict: {},
    valueHistoryDict: {},
    valueHistoryQueryTypeDict: {},
    valueHistoryQueryDurationDict: {},
  },
  reducers: {
    initialEFundList(state, {payload: fundList}) {
      return {...state, fundList};
    },
    initialValueHistoryQueryTypeDict(state, {payload: fundList}) {
      let d = {};
      fundList.forEach((item) => {
        d[item.fund_code] = 'valuation';
      });
      return {...state, valueHistoryQueryTypeDict: d};
    },
    initialValueHistoryQueryDurationDict(state, {payload: fundList}) {
      let d = {};
      fundList.forEach((item) => {
        d[item.fund_code] = '1m';
      });
      return {...state, valueHistoryQueryDurationDict: d};
    },
    updateFundValuationsDict(state, {payload: {realTimeValuationsList, fundCode}}) {
      let newState = cloneDeep(state);
      newState.valuationDict[fundCode] = realTimeValuationsList;
      return newState
    },
    updateTransactionHistoryDict(state, {payload: {transactionHistoryList, fundCode}}) {
      let newState = cloneDeep(state);
      newState.transactionHistoryDict[fundCode] = transactionHistoryList;
      return newState
    },
    updateValueHistoryDict(state, {payload: {historyValueList, fundCode}}) {
      let newState = cloneDeep(state);
      newState.valueHistoryDict[fundCode] = historyValueList;
      return newState
    },
    updateValueHistoryQueryTypeDict(state, {payload: {fundCode, queryType}}) {
      let newState = cloneDeep(state);
      newState.valueHistoryQueryTypeDict[fundCode] = queryType;
      return newState
    },
    updateValueHistoryQueryDurationDict(state, {payload: {fundCode, duration}}) {
      let newState = cloneDeep(state);
      newState.valueHistoryQueryDurationDict[fundCode] = duration;
      return newState
    },
  },
  effects: {
    * getEFundsSummary({payload: id}, {put, call}) {
      let result = yield call(fundService.getEFundsSummaryService);
      yield put({type: 'initialEFundList', payload: result.data.funds_summary});
      yield put({type: 'initialValueHistoryQueryTypeDict', payload: result.data.funds_summary});
      yield put({type: 'initialValueHistoryQueryDurationDict', payload: result.data.funds_summary});
    },
    * getFundValuationList({payload: fundCode}, {put, call}) {
      let result = yield call(fundService.getFundRealTimeValuationsService, fundCode);
      yield put({
        type: 'updateFundValuationsDict',
        payload: {realTimeValuationsList: result.data.fund_real_time_valuation, fundCode: fundCode}
      });
    },
    * getTransactionHistoryValueList({payload: fundCode}, {put, call}) {
      let result = yield call(fundService.getTransactionHistoryService, fundCode);
      yield put({
        type: 'updateTransactionHistoryDict',
        payload: {transactionHistoryList: result.data.transaction_history, fundCode: fundCode}
      });
    },
    * getFundValueHistoryList({payload: {fundCode, duration}}, {put, call}) {
      let result = yield call(fundService.getFundValueHistoryService, {fundCode, duration});
      yield put({
        type: 'updateValueHistoryDict',
        payload: {historyValueList: result.data.value_history, fundCode: fundCode}
      });
    },
  },
  subscriptions: {
    setup({history, dispatch}) {
      // 监听 history 变化，当进入 `/` 时触发 `load` action
      return history.listen(({pathname}) => {
        if (pathname === '/funds') {
          dispatch({type: 'getEFundsSummary'});
        }
      });
    },
  },
};
