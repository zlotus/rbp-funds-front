import React from 'react';
import {connect} from 'dva';
import {FundValuationG2, FundValueHistoryG2} from '../components/funds_chart';
import FundsTable from '../components/funds_table';
import {Table, Row, Col, Radio} from 'antd';
import {isEmpty} from 'lodash'

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;


const Funds = ({dispatch, funds, loading}) => {
  const handelExpand = (expanded, record) => {
    if (expanded) {
      dispatch({
        type: 'funds/getTransactionHistoryValueList',
        payload: record.fund_code,
      });
      if (funds.valueHistoryQueryTypeDict[record.fund_code] === 'valuation') {
        dispatch({
          type: 'funds/getFundValuationList',
          payload: record.fund_code,
        });

      } else {
        dispatch({
          type: 'funds/getFundValueHistoryList',
          payload: {fundCode: record.fund_code, duration: funds.valueHistoryQueryDurationDict[record.fund_code]},
        });
      }
    }
  };
  const handleQueryTypeRadioChange = (e) => {
    let [fundCode, queryType] = e.target.value.split("-");
    dispatch({
      type: 'funds/updateValueHistoryQueryTypeDict',
      payload: {fundCode: fundCode, queryType: queryType},
    });
    if (queryType === 'valuation') {
      dispatch({
        type: 'funds/getFundValuationList',
        payload: fundCode,
      });
    } else {
      dispatch({
        type: 'funds/getFundValueHistoryList',
        payload: {fundCode: fundCode, duration: funds.valueHistoryQueryDurationDict[fundCode]},
      });
    }
  };
  const handleQueryDurationRadioChange = (e) => {
    let [fundCode, duration] = e.target.value.split("-");
    dispatch({
      type: 'funds/updateValueHistoryQueryDurationDict',
      payload: {fundCode: fundCode, duration: duration},
    });
    dispatch({
      type: 'funds/getFundValueHistoryList',
      payload: {fundCode: fundCode, duration: duration},
    });
  };
  const rowRender = (record) => {
    if (!isEmpty(funds.transactionHistoryDict[record.fund_code])
      &&
      (
        (funds.valueHistoryQueryTypeDict[record.fund_code] === 'valuation' && !isEmpty(funds.valuationDict[record.fund_code]))
        ||
        (funds.valueHistoryQueryTypeDict[record.fund_code] === 'history' && !isEmpty(funds.valueHistoryDict[record.fund_code]))
      )
    ) {
      let transactionList = funds.transactionHistoryDict[record.fund_code];
      let latestValuation = funds.valuationDict[record.fund_code].slice(-1)[0].value;
      return (
        <Row type={'flex'}>
          <Col sm={24} md={18} order={0} style={{marginBottom: 16}}>
            <Row type="flex" justify="center">
              <RadioGroup onChange={handleQueryTypeRadioChange}
                          defaultValue={`${record.fund_code}-${funds.valueHistoryQueryTypeDict[record.fund_code]}`}>
                <RadioButton value={`${record.fund_code}-valuation`}>实时估值</RadioButton>
                <RadioButton value={`${record.fund_code}-history`}>历史净值</RadioButton>
              </RadioGroup>
            </Row>
            {
              funds.valueHistoryQueryTypeDict[record.fund_code] === 'valuation' ?
                <div>
                  <Row>
                    <FundValuationG2 valuationData={funds.valuationDict[record.fund_code]}
                                     eHistoryData={funds.transactionHistoryDict[record.fund_code]}
                    />
                  </Row>
                </div>
                :
                <div>
                  <Row>
                    <FundValueHistoryG2 valueHistoryData={funds.valueHistoryDict[record.fund_code]}
                                        eHistoryData={funds.transactionHistoryDict[record.fund_code]}
                    />
                  </Row>
                  <Row type="flex" justify="center">
                    <RadioGroup onChange={handleQueryDurationRadioChange}
                                defaultValue={`${record.fund_code}-${funds.valueHistoryQueryDurationDict[record.fund_code]}`}>
                      <RadioButton value={`${record.fund_code}-1m`}>一个月</RadioButton>
                      <RadioButton value={`${record.fund_code}-3m`}>三个月</RadioButton>
                      <RadioButton value={`${record.fund_code}-6m`}>六个月</RadioButton>
                      <RadioButton value={`${record.fund_code}-1y`}>一年</RadioButton>
                      <RadioButton value={`${record.fund_code}-2y`}>两年</RadioButton>
                      <RadioButton value={`${record.fund_code}-3y`}>三年</RadioButton>
                    </RadioGroup>
                  </Row>
                </div>
            }
          </Col>
          <Col sm={24} md={6} order={1}>
            <FundsTable transactionList={transactionList} latestValuation={latestValuation}/>
          </Col>
        </Row>
      )
    } else {
      return <div/>
    }
  };


  const columns = [
    {title: '简称', dataIndex: 'abbreviation', key: 'abbreviation', },
    {title: '全称', dataIndex: 'fund_name', key: 'fund_name', },
    {title: '代码', dataIndex: 'fund_code', key: 'fund_code',  },
    {title: '份数', dataIndex: 'own_amount', key: 'own_amount',  },
    {title: '占比', dataIndex: 'proportion', key: 'proportion',  },
    {title: '盈亏', dataIndex: 'floating_pl', key: 'floating_pl', },
  ];

  return (
    <div>
      <Table
        loading={loading.global}
        columns={columns}
        expandedRowRender={rowRender}
        dataSource={funds.fundList}
        onExpand={handelExpand}
        expandRowByClick={true}
      />
    </div>
  );
};

// export default Products;
export default connect(({funds, loading}) => ({funds, loading}))(Funds);
