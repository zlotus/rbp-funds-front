import React from 'react';
import ReactDOM from 'react-dom';
import {Chart, Geom, Axis, Tooltip, Guide} from 'bizcharts';

const Line = Guide.Line;

const FundValuationG2 = ({valuationData, eHistoryData}) => {
  let average = eHistoryData.filter(item => item.action === 'a')[0];
  let latest = eHistoryData.filter(item => item.action === 'y')[0];

  let sortedEHistoryData = eHistoryData.filter(item => item.action === 'b' || item.action === 's').sort((a, b) => a.price - b.price);
  let historyGroupByPrice = [];
  for (let i = 0; i < sortedEHistoryData.length;) {
    let iPrice = sortedEHistoryData[i].price;
    let iPriceList = sortedEHistoryData.filter(item => item.price === iPrice);
    let sortedIPriceTransactionList = iPriceList.map(
      item => {
        return {action: item.action, date: item.date}
      }
    ).sort((a, b) => a.date > b.date ? 1 : -1);
    historyGroupByPrice.push({price: sortedEHistoryData[i].price, transaction: sortedIPriceTransactionList});
    i += iPriceList.length
  }
  // let eHistoryMax = sortedEHistoryData[0].price;
  // let eHistoryMin = sortedEHistoryData.slice(-1)[0].price;
  let valuationMax = Math.max(...valuationData.map(item => item.value));
  let valuationMin = Math.min(...valuationData.map(item => item.value));
  // let today = valuationData[0].time.split(' ')[0];
  console.log(valuationMin, valuationMax, latest.price);
  const scale = {
    time: {
      alias: '时间',
      type: 'cat',
      value: ['09:30', '09:31', '09:32', '09:33', '09:34', '09:35', '09:36', '09:37', '09:38', '09:39', '09:40', '09:41', '09:42', '09:43', '09:44', '09:45', '09:46', '09:47', '09:48', '09:49', '09:50', '09:51', '09:52', '09:53', '09:54', '09:55', '09:56', '09:57', '09:58', '09:59', '10:00', '10:01', '10:02', '10:03', '10:04', '10:05', '10:06', '10:07', '10:08', '10:09', '10:10', '10:11', '10:12', '10:13', '10:14', '10:15', '10:16', '10:17', '10:18', '10:19', '10:20', '10:21', '10:22', '10:23', '10:24', '10:25', '10:26', '10:27', '10:28', '10:29', '10:30', '10:31', '10:32', '10:33', '10:34', '10:35', '10:36', '10:37', '10:38', '10:39', '10:40', '10:41', '10:42', '10:43', '10:44', '10:45', '10:46', '10:47', '10:48', '10:49', '10:50', '10:51', '10:52', '10:53', '10:54', '10:55', '10:56', '10:57', '10:58', '10:59', '11:00', '11:01', '11:02', '11:03', '11:04', '11:05', '11:06', '11:07', '11:08', '11:09', '11:10', '11:11', '11:12', '11:13', '11:14', '11:15', '11:16', '11:17', '11:18', '11:19', '11:20', '11:21', '11:22', '11:23', '11:24', '11:25', '11:26', '11:27', '11:28', '11:29', '11:30', '13:00', '13:01', '13:02', '13:03', '13:04', '13:05', '13:06', '13:07', '13:08', '13:09', '13:10', '13:11', '13:12', '13:13', '13:14', '13:15', '13:16', '13:17', '13:18', '13:19', '13:20', '13:21', '13:22', '13:23', '13:24', '13:25', '13:26', '13:27', '13:28', '13:29', '13:30', '13:31', '13:32', '13:33', '13:34', '13:35', '13:36', '13:37', '13:38', '13:39', '13:40', '13:41', '13:42', '13:43', '13:44', '13:45', '13:46', '13:47', '13:48', '13:49', '13:50', '13:51', '13:52', '13:53', '13:54', '13:55', '13:56', '13:57', '13:58', '13:59', '14:00', '14:01', '14:02', '14:03', '14:04', '14:05', '14:06', '14:07', '14:08', '14:09', '14:10', '14:11', '14:12', '14:13', '14:14', '14:15', '14:16', '14:17', '14:18', '14:19', '14:20', '14:21', '14:22', '14:23', '14:24', '14:25', '14:26', '14:27', '14:28', '14:29', '14:30', '14:31', '14:32', '14:33', '14:34', '14:35', '14:36', '14:37', '14:38', '14:39', '14:40', '14:41', '14:42', '14:43', '14:44', '14:45', '14:46', '14:47', '14:48', '14:49', '14:50', '14:51', '14:52', '14:53', '14:54', '14:55', '14:56', '14:57', '14:58', '14:59', '15:00'],
      min: '09:30',
      max: '15:00',
    },
    value: {
      alias: '净值',
      max: Math.max(valuationMax + (valuationMax - valuationMin) * 0.2, latest.price),
      min: Math.min(valuationMin - (valuationMax - valuationMin) * 0.2, latest.price),
    }
  };
  let guideLines = [];
  historyGroupByPrice.forEach(
    (element, index, array) => {
      let transactionList = element.transaction;
      let buys = transactionList.filter(item => item.action === 'b');
      let sales = transactionList.filter(item => item.action === 's');
      let buyText = buys.length > 0 ? `主理人买入${buys.length}份：净值${element.price}：${buys.map(item => item.date)}` : '';
      let saleText = sales.length > 0 ? `主理人卖出${sales.length}份：净值${element.price}：${sales.map(item => item.date)}` : '';
      guideLines.push(
        <Line
          top={true}
          lineStyle={{stroke: '#531dab'}}
          key={`guidLine-${index}`}
          start={{time: valuationData[0].time, value: element.price}}
          end={{time: valuationData.slice(-1)[0].time, value: element.price}}
          text={{content: buyText + saleText, position: '70%'}}
        />
      )
    }
  );
  return (
    <Chart height={500} data={valuationData} scale={scale} padding={{top: 15, right: 0, bottom: 5, left: 50}}
           forceFit>
      <Axis name="value"/>
      <Axis name="time" visible={false}/>
      <Tooltip crosshairs={{type: "y"}}/>
      <Geom type="line" position="time*value" size={2}/>
      <Guide>
        <Line
          top={true}
          lineStyle={{stroke: '#d4b106'}}
          start={{time: valuationData[0].time, value: average.price}}
          end={{time: valuationData.slice(-1)[0].time, value: average.price}}
          text={{content: `主理人持有均值：${average.price}`, position: '20%'}}
        />
        <Line
          top={true}
          start={{time: valuationData[0].time, value: latest.price}}
          end={{time: valuationData.slice(-1)[0].time, value: latest.price}}
          text={{content: `上个交易日净值：${latest.price}`, position: '20%'}}
        />
        {guideLines}
      </Guide>
      {/*<Geom type='point' position="time*value" size={4} shape={'circle'} style={{ stroke: '#fff', lineWidth: 1}} />*/}
    </Chart>
  )
};

const FundValueHistoryG2 = ({valueHistoryData, eHistoryData}) => {
  let average = eHistoryData.filter(item => item.action === 'a')[0];
  let latest = eHistoryData.filter(item => item.action === 'y')[0];
  let startDay = valueHistoryData.slice(-1)[0].date;
  let endDay = valueHistoryData[0].date;

  let sortedEHistoryData = eHistoryData
    .filter(item => (item.action === 'b' || item.action === 's') && item.date >= startDay)
    .sort((a, b) => a.date > b.date ? 1 : -1);
  let historyGroupByDate = [];
  for (let i = 0; i < sortedEHistoryData.length;) {
    let currentDay = sortedEHistoryData[i];
    let date = currentDay.date;
    let transactionCount = sortedEHistoryData.filter(item => item.date === date).length;
    let action = currentDay.action;
    historyGroupByDate.push({date: date, action: action, transactionCount: transactionCount, price: currentDay.price});
    i += transactionCount
  }
  const scale = {
    date: {
      alias: '日期',
      type: 'timeCat'
    },
    value: {
      alias: '净值',
      // max: Math.max(valueHistoryMax + (valueHistoryMax - valueHistoryMin) * 0.2, latest.price),
      // min: Math.min(valueHistoryMin - (valueHistoryMax - valueHistoryMin) * 0.2, latest.price),
    },
    transactionDate: {
      alias: '交易日期'
    },
    price: {
      alias: '成交净值',
    },
    action: {
      alias: '交易动作',
    }
  };
  let guideLines = [];
  historyGroupByDate.forEach(
    (element, index, array) => {
      guideLines.push(
        <Line
          top={true}
          lineStyle={element.action === 'b' ? {stroke: '#f5222d'} : {stroke: '#52c41a'}}
          key={`guidLine-${index}`}
          start={[element.date, 'max']}
          end={[element.date, 'min']}
          text={{
            content: `${element.date}` + (element.action === 'b' ? '买入' : '卖出') + `${element.transactionCount}份，净值${element.price}`,
            position: '20%'
          }}
        />
      )
    }
  );
  return (
    <Chart height={400} data={valueHistoryData} scale={scale} padding={{top: 15, right: 0, bottom: 5, left: 50}}
           forceFit>
      <Axis name="value"/>
      <Axis name="date" visible={false}/>
      <Tooltip crosshairs={{type: "y"}}/>
      <Geom type="line" position="date*value" size={2}/>
      {/*<Geom type="point" position="transactionDate*price" size={4}/>*/}
      <Guide>
        <Line
          top={true}
          lineStyle={{stroke: '#722ed1'}}
          start={{date: startDay, value: average.price}}
          end={{date: endDay, value: average.price}}
          text={{content: `主理人持有均值：${average.price}`, position: '20%'}}
        />
        <Line
          top={true}
          start={{date: startDay, value: latest.price}}
          end={{date: endDay, value: latest.price}}
          text={{content: `上个交易日净值：${latest.price}`, position: '20%'}}
        />
        {guideLines}
      </Guide>
    </Chart>
  )
};

export {FundValuationG2, FundValueHistoryG2};
