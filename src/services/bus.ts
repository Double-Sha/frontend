import { request } from 'umi';


export async function autoshuttlebusline() {
    return request<API.BuslineQuery>('/api/searchshuttlebusline/', {
      method: 'POST',
      data: {},
    });
  }