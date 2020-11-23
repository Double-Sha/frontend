import React from 'react';
import Amap from '@/components/Amap'
import { Input, AutoComplete} from 'antd';
import styles from './Map.less';
import { autoassct} from '@/services/employee';
import { message} from 'antd';

const { Search } = Input;

class SearchMap extends React.Component{

  inputSearch: typeof Search;
  mapElement: typeof Amap;
  weather: string;
  employinfos: API.employeeInfo[];

  constructor(props:any) {
    super(props);
    this.state = {optionlist: [],
                  searching: false
                 };
  }

  componentDidMount(){}

  handleSearch = async (e) => {
    const { value } = e.target;
    let keyword = value;
    let weather = '1';
    keyword = keyword.replace(/'/g,"");
    if (!this.mapElement.weatherdata) {weather='1'}
    else{
      if (this.mapElement.weatherdata === '晴'||this.mapElement.weatherdata === '少云'||this.mapElement.weatherdata === '晴间多云'
      ||this.mapElement.weatherdata === '多云'||this.mapElement.weatherdata === '阴'||this.mapElement.weatherdata === '有风'
      ||this.mapElement.weatherdata === '平静'||this.mapElement.weatherdata === '微风'
      ||this.mapElement.weatherdata === '和风'||this.mapElement.weatherdata === '清风')
      {
        weather = '1';
      }
      else
      {
        weather = '0';
      }
    }
    let res = await autoassct({keyword: keyword, weather:weather});
    if (res.meta.code != 0) return;
    this.employinfos = res.data;
    this.setState(
      {optionlist : res.data.map(
        (employee: API.employeeInfo)=>
          ({key:employee.employeeId, value:employee.address})
      )
      }
      );
  };

  onSearch = () => {
    let exist:boolean = false;
    let i:any;
    let address:string;
    let employee:API.employeeInfo;
    message.success('当前天气为: '+this.mapElement.weatherdata);
    if (this.inputSearch.state.value == '') return;
    if (this.state.optionlist.length == 0) return;
    this.setState({searching:true});
    for(i in this.state.optionlist){
      if (this.state.optionlist[i].value === this.inputSearch.state.value){
        exist = true;
        break;
      }
    }
    if (exist){
      address = this.inputSearch.state.value;
    }else{
      address = this.state.optionlist[0].value;
    }
    for (i in this.employinfos){
      if (this.employinfos[i].address === address){
        employee = this.employinfos[i];
      }
    }
    this.mapElement.addMarker(address, employee);
    // this.setState({searching:false});
  };

  render(){
    return (
      [<Amap ref={(ref)=>(this.mapElement=ref)}/>,
      <div className={styles.ft}>
        <AutoComplete
          style={{width: 500}}
          autoFocus
          options={this.state.optionlist}
          notFoundContent='暂未发现员工地址'
        >
        <Search ref={(ref)=>(this.inputSearch=ref)}
          placeholder="请搜索员工信息"
          enterButton="搜索"
          size="large"
          onChange={this.handleSearch}
          onSearch={this.onSearch}
        />
        </AutoComplete>
      </div>
  ]);
  } 
}

export default () : React.ReactNode => {
  return <SearchMap/>
};