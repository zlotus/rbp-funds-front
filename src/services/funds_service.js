import request from '../utils/request';
import config from '../utils/config'

export function getEFundsSummaryService() {
  return request(config.wormholeURLPrefix + '/efunds');
}

export function getFundRealTimeValuationsService(fundCode) {
  return request(config.wormholeURLPrefix + `/efunds/${fundCode}/valuations`);
}

export function getTransactionHistoryService(fundCode) {
  return request(config.wormholeURLPrefix + `/efunds/${fundCode}/transactions`);
}

export function getFundValueHistoryService({fundCode, duration}) {
  return request(config.wormholeURLPrefix + `/efunds/${fundCode}/values/${duration}`);
}
