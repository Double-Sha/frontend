import React from 'react';
import Amap from '@/components/Amap'
import styles from './ShuttleBus.less';
import { autoshuttlebusline, allworkmodeem} from '@/services/employee';
import { message, Button} from 'antd';

class SearchMap extends React.Component{

  inputSearch: typeof Search;
  mapElement: typeof Amap;
  employinfos: API.employeeInfo2[];

  constructor(props:any) {
    super(props);
    this.state = {
      loading1:false,
      loading2:false
    };
  }

  componentDidMount(){}

  buttonclick = async ()=>{
    this.setState((prevstate)=>{return {loading1:true, loading2:prevstate.loading2};});
    setTimeout(() => {
      this.setState((prevstate)=>{return {loading1:false, loading2:prevstate.loading2};});
    }, 30000);
    if (this.mapElement.normalmarkers.length <= 0){
      message.warn('请先确定坐班车的员工');
      return;
    }
    this.mapElement.map.remove(this.mapElement.normalrealmarkers);
    this.mapElement.normalrealmarkers.splice(0,this.mapElement.normalrealmarkers.length);
    this.mapElement.normalmarkers.splice(0,this.mapElement.normalmarkers.length);
    let idlist = this.employinfos.map((em:API.employeeInfo2)=>(em.employeeId));
    let idstring  = idlist.join(',');
    let res2 = await autoshuttlebusline({employeeid_list:idstring, work_mode: '1'});
    if (res2.meta.code ==0) {
      let i:any;
      for (i in res2.data){
        let keywords:string[] = [];
        let j:any;
        for (j in res2.data[i].passplace){
          keywords.push(res2.data[i].passplace[j].ppaddr);
        }
        this.mapElement.drawbusline(keywords, res2.data[i].id);
      }
    }else{
      message.error('自动规划失败');
    }
  }

  buttonclick2 = async ()=>{
    this.setState((prevstate)=>{return {loading1:prevstate.loading1, loading2:true};});
    setTimeout(() => {
      this.setState((prevstate)=>{return {loading1:prevstate.loading1, loading2:false};});
    }, 9000);
    if (this.mapElement.normalmarkers.length>0){
      this.mapElement.map.remove(this.mapElement.normalrealmarkers);
      this.mapElement.normalrealmarkers.splice(0,this.mapElement.normalrealmarkers.length);
      this.mapElement.normalmarkers.splice(0,this.mapElement.normalmarkers.length);
    }
    let res1 = await allworkmodeem({work_mode:'1', maxnum:'1000'});
    if (res1.meta.code ==0) {
      this.employinfos = res1.data;
      let idlist = this.employinfos.map((em:API.employeeInfo2)=>(em.address));
      this.mapElement.addNormalMarkers(idlist);
    }else{
      message.error('得到班制人员失败');
    }
  }

  render(){
    return (
      [
      <Amap ref={(ref)=>(this.mapElement=ref)}/>,
      <div className={styles.ft}><Button type='primary' onClick={this.buttonclick} loading={this.state.loading1}>自动规划</Button></div>,
      <div className={styles.ft1}><Button type='primary' onClick={this.buttonclick2} loading={this.state.loading2}>显示坐班车员工</Button></div>
  ]);
  } 
}

export default () : React.ReactNode => {
  return (<SearchMap/>);
};
