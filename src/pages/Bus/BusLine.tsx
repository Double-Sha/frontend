import React from 'react';
import { message, Select } from 'antd';
import {autoshuttlebusline} from '@/services/bus'

async function DropdownVisibleChange(open) {
  if (open){
    let res = await autoshuttlebusline();
    if (res.meta.code == 0){

    }else{
      message.error('班车信息查询失败');
    }
  }
}

export default () : React.ReactNode => {
    return ([
        <Select style={{width:300}} onDropdownVisibleChange={DropdownVisibleChange} placeholder='线路-出发时间-到达时间'/>
      ]);
  };
  