import { request } from 'umi';
import { TableListParams, TableListItem } from './data';

export interface AddEmployeeParamType{
  employeeId:string;
  name:string;
  dep: string;
  address: string;
  work_mode: string;
  transpsunny: string;
  transpbadweather: string;
  extlpn: string;
}

export interface QueryEmployeeParamType{
  pageSize?:number;
  current?:number;
  keyword?:string;
  employeeId?:string;
  name?:string;
  dep?: string;
  work_mode?: string;
  transp?: string;
  maxnum?: string;
  filter?: { [key: string]: any[] };
  sorter?: { [key: string]: any };
}

export interface QueryEmployeeType{
  employeeId:string;
  name:string;
  dep: string;
  address: string;
  work_mode: string;
  transpsunny: string;
  transpbadweather: string;
  extlpn: string;
}

export interface QueryEmployeeReturnType{
  meta:{message:string, code:number},
  data:QueryEmployeeType[];
}

export interface SimpleResponse{
  meta:{code:number, message:string};
}

export async function searchemployeeparam(params?: QueryEmployeeParamType){
  let tmp:QueryEmployeeParamType = {
    employeeId:'',
    name:'',
    dep: '',
    work_mode: '',
    transp: '',
    maxnum: ''
  };
  if (!params.employeeId){
    tmp.employeeId = '10250';
  }else{
    tmp.employeeId = params.employeeId;
  }
  if (!params.name){
    tmp.name = '鲁荷';
  }else{
    tmp.name = params.name;
  }
  if (!params.dep){
    tmp.dep = '科室－24';
  }else{
    tmp.dep = params.dep;
  }
  if (!params.work_mode){
    tmp.work_mode = '1';
  }else{
    tmp.work_mode = params.work_mode;
  }
  if (!params.transp){
    tmp.transp = '2';
  }else{
    tmp.transp = params.transpsunny;
  }
  if (!params.maxnum){
    tmp.maxnum = '2';
  }else{
    tmp.maxnum = params.maxnum;
  }
  let res = await searchemployee(tmp);
  if (res.meta.code == 0){
    return {
      data: res.data,
      success: true,
      total: res.data.length
    };
  }else{
    return {
      data: [],
      success: false,
      total: 0
    };
  }
}
export async function searchemployee(params?: QueryEmployeeParamType) {
  return request<QueryEmployeeReturnType>('/api/searchemployee/', {
    method: 'POST',
    data: params
  });
}

export async function removeRule(params: { key: number[] }) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addEmployee(params: AddEmployeeParamType) {
  return request<SimpleResponse>('/api/addemployee/', {
    method: 'POST',
    data: params,
  });
}

export async function updateRule(params: TableListParams) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'update',
    },
  });
}
