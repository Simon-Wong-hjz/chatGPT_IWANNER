import {useState} from 'react';
import {useLocalStorage} from '../../hooks/useLocalStorage';
import { 
  DatePicker,
  Input,
  Button,
  Tag,
  Spin,
  message,
} from 'antd';
import dayjs from 'dayjs';

import { 
  UserOutlined,
  PayCircleOutlined,
  EnvironmentOutlined,
  SearchOutlined,
  } from '@ant-design/icons';
  import 'dayjs/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import './index.css';
const { RangePicker } = DatePicker;

function Home() {
  const navigate = useNavigate();
  const [azureFormDataStore, setAzureFormDataStore] = useLocalStorage('azureFormDataStore', {});
  const [placeValue, setPlaceValue] = useState(azureFormDataStore.placeValue ?? '');
  const [peopleNumber, setPeopleNumber] = useState(azureFormDataStore.peopleNumber ?? '');
  const [budget, setBudget] = useState(azureFormDataStore.budget ?? '');
  const [startDate, setStartDate] = useState(azureFormDataStore.startDate ?? '');
  const [endDate, setEndDate] = useState(azureFormDataStore.endDate ?? '');
  const [wants, setWants] = useState(azureFormDataStore.wants ?? '');
  const [loading, setLoading] = useState(azureFormDataStore.loading ?? false);
  const [errorStatus, setErrorStatus] = useState(azureFormDataStore.errorStatus ?? '');
  const [messageApi, contextHolder] = message.useMessage();

  // const formData = {
  //   "model": "gpt-3.5-turbo",
  //   "messages": [
  //     {
  //       "role": "user", 
  //       "content": `你是一名专业的旅行规划师。你在帮助我规划我的旅行。
  //       参与的人数是${peopleNumber}个成人。
  //       旅行从${startDate}开始，${endDate}结束。
  //       我想从${placeValue}出发，进行国内旅行，
  //       总预算约为人民币${budget}元。
  //       在旅行期间，我希望${wants}。
  //       \n\n请为我推荐一个目的地，并提供一份详尽的旅行计划，包括每天的行程地点和时间安排，和具体的酒店、航空公司和餐厅推荐，费用应在预算范围内。
  //       计划应包括早餐、午餐和晚餐的地点。如果可能的话，请在同一家酒店住宿。
  //       \n\n最后，请根据计划用markdown格式制作一张时间表并附在最后，
  //       时间表需符合以下要求：\n\n总共4列\n第一列是日期\n第二列是时间段\n第三列是活动\n第四列是预算`
  //     }
  //   ]
  // };

  const azureFormData = {
    "messages": [
        {
            "role": "user",
            "content": `你是一名专业的旅行规划师，你在帮助我规划我的旅行，全文请使用中文；
            旅行的人数是${peopleNumber}个成人；
            旅行从${dayjs(startDate).format('YYYY年M月D日')}开始，${dayjs(endDate).format('YYYY年M月D日')}结束；
            我想从${placeValue}出发，进行国内旅行，总预算约为人民币${budget}元，但你可以选择留出一定的自由预算；
            行程必须优先保证这些活动：${wants}，如果存在你无法规划在行程内的活动，请列出并说明原因；
            \n\n你必须为我推荐一个目的地，并提供一份详尽的旅行计划，包括每天的行程地点和时间安排，和具体的酒店、航空公司和餐厅推荐，费用应计入预算。
            计划应包括早餐、午餐和晚餐的地点。如果可能的话，请在同一家酒店住宿。
            \n\n最后，请告诉我行程花费掉的总预算，包括机票、酒店和在当地的活动花费，并根据计划用markdown格式制作一张时间表附在最后，时间表需符合以下要求：\n总共4列\n第一列是日期\n第二列是时间段\n第三列是活动\n第四列是预算`
        }
    ]
}

  const handlePlaceValue = (e) => {
    setPlaceValue(e.target.value);
  };

  const handlePeopleNumber = (e) => {
    setPeopleNumber(e.target.value);
  }

  const handleBudget = (e) => {
    setBudget(e.target.value);
  }

  const handleDate = (date, dateString) => {
    if (date) {
      setStartDate(date[0]);
      setEndDate(date[1]);
    }
  }

  const handleWants = (e) => {
    setWants(e.target.value);
  }

  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < dayjs().endOf('day');
  };

  const clickConfirm = () => {
    console.log('azureFormData:', azureFormData.messages[0].content);
    if (!placeValue || !peopleNumber || !budget || !startDate || !endDate || !wants) {
      setErrorStatus('error');
      messageApi.open({
        type: 'error',
        content: '请填写所有输入框!',
      });
    } else {
        setLoading(true);
        const storeData = {
          peopleNumber,
          startDate,
          endDate,
          placeValue,
          budget,
          wants,
        }
        setAzureFormDataStore(storeData);
        // const plusToken = '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';
        // const defaultToken = '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';
        // axios({
        //   url: "https://api.openai.com/v1/chat/completions",
        //   method: "POST",
        //   headers: {
        //     // authorization: `Bearer ${plusToken}`,
        //     authorization: `Bearer ${defaultToken}`,
        //   },
        //   data: formData,
        // })
        // .then((res) => {
        //   console.log('res', res);
        //   setLoading(false);
        //   console.log('res.data.choices[0].message.content',res.data.choices[0].message.content);
        //   if (res && res.data && res.data.choices && res.data.choices[0] && res.data.choices[0].message && res.data.choices[0].message.content) {
        //     localStorage.setItem('data', res.data.choices[0].message.content);
        //     navigate('/plan');
        //   }
        // })
        // .catch((err) => { 
        //   console.log('err', err);
        // });

        // azure API
        const azureApiKey = '';
        axios({
          url: "https://aigcopencommunity.openai.azure.com/openai/deployments/gpt_35_turbo/chat/completions?api-version=2023-05-15",
          method: "POST",
          headers: {
            'api-key': `${azureApiKey}`,
          },
          data: azureFormData,
        })
        .then((res) => {
          console.log('res', res);
          if (res.status === 200) {
            setLoading(false);
            if (res && res.data && res.data.choices && res.data.choices[0] && res.data.choices[0].message && res.data.choices[0].message.content) {
              localStorage.setItem('data', res.data.choices[0].message.content);
              navigate('/plan');
            }
          }
        })
        .catch((err) => { 
          setLoading(false);
          messageApi.open({
            type: 'error',
            content: err.message,
            duration: 6,
          });
          console.log('err', err);
        });
        }
  };

const handleClick = (e) => {
  // console.log('e.target', e.target.dataset.value);
  const value = e.target.dataset.value;
  setWants((prevState) => {
    if (prevState.includes(value)) {
      return prevState;
    }
    if (prevState) {
      return prevState + '、' + value;
    };
    return  value;
  });
};
 
  return (
    <Spin spinning={loading} tip="加载中..." size="large">
      {contextHolder}
      <div className="Home">
        <div className='home-wrapper'>
        <div className='header-wrapper'>
          <Input placeholder="出发地" className='hader-input' prefix={<EnvironmentOutlined/>} onChange={handlePlaceValue} value={placeValue}/>
          <div className='header-time'>
            <RangePicker className='header-time-range' locale={locale} onChange={handleDate} disabledDate={disabledDate} value={(startDate && endDate) ? [dayjs(startDate), dayjs(endDate)] : undefined}/>
          </div>
          <Input placeholder="人数" className='hader-input' prefix={<UserOutlined />} onChange={handlePeopleNumber} value={peopleNumber}/>
          <Input placeholder="预算" className='hader-input' prefix={<PayCircleOutlined />} onChange={handleBudget} value={budget}/>
        </div>
        <div className='main-wrapper'>
          <div className='title'>我想。。。</div>
          <div className='search-wrapper'>
            <Input placeholder="请以顿号分隔" className='main-input' prefix={<SearchOutlined />}  value={wants} onChange={handleWants} allowClear status={errorStatus}/>
            <Button type="primary" className='confiim-button' onClick={clickConfirm}>确认</Button>
          </div>
          <div className='tag-list'>
            <Tag color="red" className='tag-item' onClick={handleClick} data-value='烧烤'>烧烤</Tag>
            <Tag color="red" className='tag-item' onClick={handleClick} data-value='购物'>购物</Tag>
            <Tag color="volcano" className='tag-item' onClick={handleClick} data-value='看日出'>看日出</Tag>
            <Tag color="orange" className='tag-item' onClick={handleClick} data-value='吃海鲜'>吃海鲜</Tag>
            <Tag color="gold" className='tag-item' onClick={handleClick} data-value='登山'>登山</Tag>
            <Tag color="lime" className='tag-item' onClick={handleClick} data-value='游泳'>游泳</Tag>
            <Tag color="purple" className='tag-item' onClick={handleClick} data-value='露营'>露营</Tag>
            <Tag color="geekblue" className='tag-item' onClick={handleClick} data-value='滑雪'>滑雪</Tag>
            <Tag color="blue" className='tag-item' onClick={handleClick} data-value='潜水'>潜水</Tag>
            <Tag color="green" className='tag-item' onClick={handleClick} data-value='徒步'>徒步</Tag>
            <Tag color="red" className='tag-item' onClick={handleClick} data-value='喝奶茶'>喝奶茶</Tag>
            <Tag color="red" className='tag-item' onClick={handleClick} data-value='逛街'>逛街</Tag>
            <Tag color="volcano" className='tag-item' onClick={handleClick} data-value='赶海'>赶海</Tag>
            <Tag color="orange" className='tag-item' onClick={handleClick} data-value='密室逃脱'>密室逃脱</Tag>
            <Tag color="gold" className='tag-item' onClick={handleClick} data-value='唱K'>唱K</Tag>
            <Tag color="lime" className='tag-item' onClick={handleClick} data-value='吃火锅'>吃火锅</Tag>
          </div>
        </div>
        </div>
    </div>
    </Spin>
  );
}

export default Home;
