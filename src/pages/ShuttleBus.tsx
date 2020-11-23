import React from 'react';
import Amap from '@/components/Amap'
import { Input, AutoComplete} from 'antd';
import styles from './ShuttleBus.less';
import { autoassct, autoshuttlebusline, allworkmodeem} from '@/services/employee';
import { message, Button} from 'antd';

const { Search } = Input;

class SearchMap extends React.Component{

  inputSearch: typeof Search;
  mapElement: typeof Amap;
  weather: string;
  employinfos: API.employeeInfo2[];
  employeeIdList:string[];

  constructor(props:any) {
    super(props);
    this.state = {optionlist: [],
                  searching: false
                 };
  }

  componentDidMount(){
    this.employeeIdList = [];
  }

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
        this.employeeIdList.push(employee.employeeId);
      }
    }
    this.mapElement.addNormalMarker(address, employee);
    this.setState({searching:false});
  };

  buttonclick = async ()=>{
    let res1 = await allworkmodeem({work_mode:'1', maxnum:'1000'});
    if (res1.meta.code ==0) {
      this.employinfos = res1.data;
    }else{
      message.error('得到班制人员失败');
      return;
    }
    let idlist = this.employinfos.map((em:API.employeeInfo2)=>(em.employeeId));
    let idstring  = idlist.join(',');
    let res2 = await autoshuttlebusline({employeeid_list:idstring, work_mode: '1'});
    console.log(res2.meta);
    if (res2.meta.code ==0) {
      let i:any;
      for (i in res2.data){
        let keywords:string[] = [];
        keywords.push(res2.data[i].startplace);
        let j:any;
        // for (j in res2.data[i].passplace){
        //   keywords.push(j.ppaddr);
        // }
        keywords.push('联合汽车电子有限公司');
        this.mapElement.drawbusline(keywords);
      }
      
    }else{
      message.error('自动规划失败');
      return;
    }
  }

  render(){
    return (
      [
      <Amap ref={(ref)=>(this.mapElement=ref)}/>,
      <div className={styles.ft}><Button type='primary' onClick={this.buttonclick}>自动规划</Button></div>
  ]);
  } 
}

export default () : React.ReactNode => {
  return <SearchMap/>
};
