import { request } from 'umi';

export interface AutoasscParamsType {
  keyword: string;
  weather: string;
}

export interface AutoshuttlebuslineParamsType {
  employeeid_list: string;
  work_mode: string;
}

export interface SearchemployeeParamsType {
    employeeId?:string;
    name?: string;
    dep?: string;
    work_mode?: string;
    transp?: string;
    maxnum?: string;
}

export interface AllworkmodeemParamsType {
  work_mode: string,
  maxnum: string
}

export async function autoassct(params: AutoasscParamsType) {
    return request<API.EmployeeAutoAssc>('/api/autoassct/', {
      method: 'POST',
      data: params,
    });
}

export async function autoshuttlebusline(params: AutoshuttlebuslineParamsType) {
  return request<API.AutoshuttlebuslineQuery>('/api/autoshuttlebusline/', {
    method: 'POST',
    data: params,
  });
}

export async function searchemployee(params: SearchemployeeParamsType) {
  return request<API.SearchemployeeQuery>('/api/searchemployee/', {
    method: 'POST',
    data: params,
  });
}

export async function allworkmodeem(params: AllworkmodeemParamsType) {
  return request<API.SearchemployeeQuery>('/api/allworkmodeem/', {
    method: 'POST',
    data: params,
  });
}