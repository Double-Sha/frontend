declare namespace API {
  export interface CurrentUser {
    avatar?: string;
    name?: string;
    title?: string;
    group?: string;
    signature?: string;
    tags?: {
      key: string;
      label: string;
    }[];
    userid?: string;
    access?: 'user' | 'guest' | 'admin';
    unreadCount?: number;
  }

  export interface LoginStateType {
    status?: 'ok' | 'error';
    type?: string;
  }

  export interface NoticeIconData {
    id: string;
    key: string;
    avatar: string;
    title: string;
    datetime: string;
    type: string;
    read?: boolean;
    description: string;
    clickClose?: boolean;
    extra: any;
    status: string;
  }

  export interface employeeInfo{
    name:string;
    address:string;
    employeeId:string;
    transp:string;
    extlpn:string;
  }
  
  export interface employeeInfo2{
      employeeId: string;
      name: string;
      dep: string;
      address: string;
      work_mode: string;
      transpsunny: string;
      transpbadweather?: string;
      extlpn: string;
  }

  export interface EmployeeAutoAssc {
    meta: {message: string, code:number}
    data: employeeInfo[];
  }

  export interface EmployeeQuery {
    meta: {message: string, code:number}
    data: { employeeId: string;
            name: string;
            dep: string;
            address: string;
            work_mode: string;
            transpsunny: string;
            transpbadweather?: string;
            extlpn: string;
          }[];
  }

  export interface AutoshuttlebuslineQuery {
    meta: {message: string, code:number}
    data: { id: string;
            linename: string;
            starttime: string;
            startplace: string;
            endtime: string;
            passplace: {ppid:string, ppaddr:string, arrivetime:string, pssngrnum:string}[];
          }[];
  }

  export interface SearchemployeeQuery {
    meta: {message: string, code:number}
    data: employeeInfo2[];
  }

  export interface BuslineQuery {
    meta: {message: string, code:number}
    data: { id: string;
            linename: string;
            starttime: string;
            startplace: string;
            endtime: string;
            passplace: {ppid:string, ppaddr:string, arrivetime:string, pssngrnum:string}[];
          }[];
  }
}
