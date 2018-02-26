import React from 'react';
import ReactDOM from 'react-dom';
import {Table} from 'antd';
import styles from './funds_table.less'


const FundsTable = ({transactionList, latestValuation}) => {
  const columns = [
    {title: '净值', dataIndex: 'price', key: 'price', width: 70},
    {title: '日期', dataIndex: 'date', key: 'date',},
    {title: '较最新估值的涨幅', dataIndex: 'floatingPL', key: 'floatingPL', width: 150},
  ];
  let sortedTransactionList = transactionList.sort((a, b) => a.price - b.price);
  let enhancedTransactionList = sortedTransactionList.map(
    item => {
      let floatingPL = `${((latestValuation - item.price) * 100 / item.price).toFixed(2)}%`;
      return {...item, floatingPL: floatingPL}
    }
  );
  return (
    <Table
      dataSource={enhancedTransactionList}
      columns={columns}
      rowClassName={(record, index) => {
        if (record.action === 'b') {
          return styles.buyRow
        }
        else if (record.action === 's') {
          return styles.saleRow
        }
        else if (record.action === 'a') {
          return styles.averageRow
        }
        else {
          return styles.latestRow
        }
      }}
      pagination={false}
      size={'small'}
    />
  )
};

export default FundsTable;
