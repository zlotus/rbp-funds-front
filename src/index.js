import dva from 'dva';
import './index.css';
import createLoading from 'dva-loading';

// 1. Initialize
const app = dva();

// 1.5 Initialize with data
// const app = dva({
//   initialState: {
//     funds: [
//       {name: 'dva', id: 1},
//       {name: 'antd', id: 2},
//     ],
//   },
// });

// 2. Plugins
// app.use({});
app.use(createLoading());

// 3. Model
app.model(require('./models/funds_model').default);

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');
