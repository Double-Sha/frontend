import AMapLoader from '@amap/amap-jsapi-loader';
import React from 'react';
import styles from './index.less';
import { message} from 'antd';


declare class GaoDeAMap {
    constructor(container: HTMLElement, option: { center: [number, number]; zoom: number });
    public destroy(): void;
    public add(o:object):void;
    public remove(o:object):void;
    public setFitView():void;
    public clearInfoWindow():void;
  }

declare class LngLat {
  constructor(lng:Number,lat:Number,noAutofix?:boolean);
}


declare class Marker {
  constructor(option : {map: GaoDeAMap, position: LngLat, animation?:string, clickable?:boolean, title?:string});
  on: (eventName:string, handler:Function, context?:Object)=> void;
  off: (eventName:string, handler:Function, context?:Object)=> void;
  position: LngLat;
  public setIcon(url:string):void;
}

declare class geocode{
  formatted_address:string;
  country:string;
  province:string;
  city:string;
  citycode:string;
  district:string;
  street:string;
  number:string;
  adcode:string;
  location:string;
  level:string;
}

declare class ReGeocodeResult{
  status:number;
  count:number;
  info:string;
  geocodes:geocode[];
}

declare class Geocoder{
  constructor(opt:{city:string, batch?:boolean});
  getLocation: (keyword:string, cbk:(status:string, result:ReGeocodeResult|string)=>void)=>void;
}

declare class LiveData{
  info:string;
  province:string;
  city:string;
  adcode:string;
  weather:string;
  temperature:string;
  windDirection:string;
  windPower:string;
  humidity:string;
  reportTime:string;
}

declare class Weather{
  constructor();
  getLive: (city:string, callback:(err:object|null, data:LiveData)=>void)=>void;
}

declare class infoWindow{
  constructor(opts:{isCustom:boolean, autoMove:boolean, closeWhenClickMap:boolean, content:string|HTMLDivElement,
    size:{width:number, height:number}, position:LngLat, offset:{x:number, y:number}});
  open: (map:GaoDeAMap, position?:LngLat, height?:number)=>void;
}

declare class DriveRoute{
  distance:number;
}

declare class DrivingResult{
  info:string;
  origin:LngLat;
  destination:LngLat;
  routes:DriveRoute[];
}

declare class Driving{
  constructor(opts:{map:GaoDeAMap, policy:number, showTraffic:boolean, province:string, number:string, autoFitView:boolean, hideMarkers:boolean});
  //search: (origin:LngLat, destination:LngLat, cbk:(status:string, result:string|DrivingResult)=>void, opts?:{waypoints:LngLat[]})=>void;
  search: (points:{keyword:string, city:string}[], cbk:(status:string, result:string|DrivingResult)=>void, opts?:{waypoints:LngLat[]})=>void;
  setProvinceAndNumber: (province:string, number:string)=>void;
  clear: ()=>void;
}

declare class Riding{
  constructor(opts:{map:GaoDeAMap, policy:number, autoFitView:boolean, hideMarkers:boolean});
  search: (points:{keyword:string, city:string}[], cbk:(status:string, result:string|DrivingResult)=>void, opts?:{waypoints:LngLat[]})=>void;
  clear: ()=>void;
}

declare class Walking{
  constructor(opts:{map:GaoDeAMap, policy:number, autoFitView:boolean, hideMarkers:boolean});
  search: (points:{keyword:string, city:string}[], cbk:(status:string, result:string|DrivingResult)=>void, opts?:{waypoints:LngLat[]})=>void;
  clear: ()=>void;
}

declare class Transfer{
  constructor(opts:{map:GaoDeAMap, city:string, policy:number, nightflag:boolean, autoFitView:boolean, hideMarkers:boolean});
  search: (points:{keyword:string, city:string}[], cbk:(status:string, result:string|DrivingResult)=>void, opts?:{waypoints:LngLat[]})=>void;
  clear: ()=>void;
}

declare const AMap: {
  Map: typeof GaoDeAMap;
  Marker: typeof Marker;
  LngLat: typeof LngLat;
  Geocoder: typeof Geocoder;
  Weather: typeof Weather;
  InfoWindow: typeof infoWindow;
  Driving:typeof Driving;
  Riding:typeof Riding;
  Walking:typeof Walking;
  Transfer:typeof Transfer;
};


class MapComponent extends React.Component {
    public mapDom: HTMLDivElement;
    public map: GaoDeAMap;
    public markers: LngLat[];
    public normalmarkers: LngLat[];
    public normalrealmarkers: Marker[];
    public geocoder: Geocoder;
    public weather: Weather;
    public weatherdata:string|false;
    public transpmap:Map<string, Driving|Walking|Riding|Transfer>;
    public buslinemap:Map<string, Driving|Walking|Riding|Transfer>;
    public backaddress:Map<string, string>;
    public umarker: Marker;
    public componentDidMount() {
        AMapLoader.load({
            "key": "07653df58bb7db5c29de64aa46c9b130",
            "version": "2.0",
            "plugins": ['AMap.Weather','AMap.Geocoder', 'AMap.Driving', 'AMap.Riding', 'AMap.Walking', 'AMap.Transfer'],
            "AMapUI": {             
                "version": '1.1',   
                "plugins":[],       
            },
        }).then((AMap)=>{
            this.map = new AMap.Map(this.mapDom,{
                center: [121.473701,31.230416],
                zoom: 11,
              });
            this.geocoder = new AMap.Geocoder({city:"021"});
            this.weather = new AMap.Weather();
            this.getWeather();
            this.umarker = new AMap.Marker({position:new AMap.LngLat(121.627406, 31.26983), title:'联合汽车电子有限公司'});
            this.map.add(this.umarker);
            this.backaddress = new Map<string, string>();
            this.transpmap = new Map<string, Driving|Walking|Riding|Transfer>();
            this.buslinemap = new Map<string, Driving|Walking|Riding|Transfer>();
        }).catch(e => {
            console.log(e);
        })
        this.markers = [];
        this.normalmarkers = [];
        this.normalrealmarkers = [];
        
    }
    public componentWillUnmount() {
      this.map.destroy();
    }
    public render() {
      return <div className={styles.maps} ref={(ref) => (this.mapDom = ref)} />;
    }
    public addMarker(keyword:string, employee:API.employeeInfo){
      let address:LngLat;
      this.geocoder.getLocation(keyword, (status, result)=>{
          if (status === 'error'||status === 'no_data'){
            message.error('查询员工地址失败');
          }else{
            address = result.geocodes[0].location;
            let i:any;
            
            for (i in this.markers){
              if (address.lng == this.markers[i].lng && address.lat == this.markers[i].lat){
                message.info('该点已经存在');
                return;
              }
            }
            let marker = new AMap.Marker({position:address});
            let transptxt:string;
            if (employee.transp == '0'){
              transptxt = '开车';
            }else if (employee.transp == '1'){
              transptxt = '步行';
            }else if (employee.transp == '2'){
              transptxt = '公共交通';
            }else if (employee.transp == '3'){
              transptxt = '骑自行车';
            }else if (employee.transp == '4'){
              transptxt = '班车';
            }else if (employee.transp == '5'){
              transptxt = '打车';
            }else if (employee.transp == '6'){
              transptxt = '其它';
            }
            function createcontent(map:GaoDeAMap, markers:LngLat[], backaddress:Map<string, string>, transpmap:Map<string, Driving|Walking|Riding|Transfer>):HTMLDivElement{
              let root = document.createElement("div");
              let name = document.createElement("p");
              let transp = document.createElement("p");
              let buttondepart = document.createElement("input");
              let buttoncancel = document.createElement("input");
              name.innerHTML = '员工姓名： '+employee.name;
              transp.innerHTML = '员工出行方式： '+transptxt;
              buttondepart.style.cssText= "float:left;background-color:#ffffff;";
              buttondepart.type = "button";
              if (backaddress.has(employee.employeeId)){
                buttondepart.value = "回家";
              }else{
                buttondepart.value = "出发";
              }
              buttondepart.onclick= ()=>{
                  map.clearInfoWindow();
                  if (employee.transp == '0' || employee.transp == '4' ||employee.transp == '5' || employee.transp == '6'){
                    let driving = new AMap.Driving({map:map, policy:0, showTraffic:true, province:'沪', number:'ANH1N1', autoFitView:true, hideMarkers:true});
                    if (employee.extlpn == '0' || employee.extlpn == '2'){
                      driving.setProvinceAndNumber('沪', 'ANH1N1');
                    }else{
                      driving.setProvinceAndNumber('苏', 'ABN458');
                    }
                    if (transpmap.has(employee.employeeId)){
                      let o:Driving|Walking|Riding|Transfer = transpmap.get(employee.employeeId);
                      o.clear();
                      transpmap.delete(employee.employeeId);
                    }
                    if (!backaddress.has(employee.employeeId)){
                      driving.search([{keyword: keyword, city: '上海市'}, {keyword: '联合汽车电子有限公司', city: '上海市'}], (status, data)=>{
                        if (status == 'complete'){
                          backaddress.set(employee.employeeId,keyword);
                        }else{
                          message.error('路线规划错误');
                        }
                      });
                    }else{
                      driving.search([{keyword: '联合汽车电子有限公司', city: '上海市'}, {keyword: keyword, city: '上海市'}], (status, data)=>{
                        if (status == 'complete'){
                          backaddress.delete(employee.employeeId);
                        }else{
                          message.error('路线规划错误');
                        }
                      });
                    }
                    transpmap.set(employee.employeeId,driving);
                  }else if (employee.transp == '1') {
                    let walking = new AMap.Walking({map:map, policy:0, autoFitView:true, hideMarkers:true});
                    if (transpmap.has(employee.employeeId)){
                      let o:Driving|Walking|Riding|Transfer = transpmap.get(employee.employeeId);
                      o.clear();
                      transpmap.delete(employee.employeeId);
                    }
                    if (!backaddress.has(employee.employeeId)){
                      walking.search([{keyword: keyword, city: '上海市'}, {keyword: '联合汽车电子有限公司', city: '上海市'}], (status, data)=>{
                        if (status == 'complete'){
                          backaddress.set(employee.employeeId,keyword);
                        }else{
                          message.error('路线规划错误');
                        }
                      });
                    }else{
                      walking.search([{keyword: '联合汽车电子有限公司', city: '上海市'}, {keyword: keyword, city: '上海市'}], (status, data)=>{
                        if (status == 'complete'){
                          backaddress.delete(employee.employeeId);
                        }else{
                          message.error('路线规划错误');
                        }
                      });
                    }   
                    transpmap.set(employee.employeeId,walking);
                  }else if (employee.transp == '2') {
                    let transfer = new AMap.Transfer({map:map, city:'上海市', policy:0, nightflag:true, autoFitView:true, hideMarkers:true});
                    if (transpmap.has(employee.employeeId)){
                      let o:Driving|Walking|Riding|Transfer = transpmap.get(employee.employeeId);
                      o.clear();
                      transpmap.delete(employee.employeeId);
                    }
                    if (!backaddress.has(employee.employeeId)){
                      transfer.search([{keyword: keyword, city: '上海市'}, {keyword: '联合汽车电子有限公司', city: '上海市'}], (status, data)=>{
                        if (status == 'complete'){
                          backaddress.set(employee.employeeId,keyword);
                        }else{
                          message.error('路线规划错误');
                        }
                      });
                    }else{
                      transfer.search([ {keyword: '联合汽车电子有限公司', city: '上海市'}, {keyword: keyword, city: '上海市'}], (status, data)=>{
                        if (status == 'complete'){
                          backaddress.delete(employee.employeeId);
                        }else{
                          message.error('路线规划错误');
                        }
                      });
                    }
                    transpmap.set(employee.employeeId,transfer);
                  }else if (employee.transp == '3') {
                      let riding = new AMap.Riding({map:map, policy:0, autoFitView:true, hideMarkers:true});
                      if (transpmap.has(employee.employeeId)){
                        let o:Driving|Walking|Riding|Transfer = transpmap.get(employee.employeeId);
                        o.clear();
                        transpmap.delete(employee.employeeId);
                      }
                      if (!backaddress.has(employee.employeeId)){
                        riding.search([{keyword: keyword, city: '上海市'}, {keyword: '联合汽车电子有限公司', city: '上海市'}], (status, data)=>{
                          if (status == 'complete'){
                            backaddress.set(employee.employeeId,keyword);
                          }else{
                            message.error('路线规划错误');
                          }});
                      }else{
                        riding.search([{keyword: '联合汽车电子有限公司', city: '上海市'}, {keyword: keyword, city: '上海市'}], (status, data)=>{
                          if (status == 'complete'){
                            backaddress.delete(employee.employeeId);
                          }else{
                            message.error('路线规划错误');
                          }});
                      }
                    transpmap.set(employee.employeeId,riding);
                  }
              };
              buttoncancel.style.cssText= "float:right;background-color:#ffffff;";
              buttoncancel.type = "button";
              buttoncancel.value = "删除点";
              buttoncancel.onclick= ()=>{map.remove(marker);
                let index = markers.indexOf(address);
                if(index > -1) {
                  if (index > 0 && index < markers.length-1){
                    let left = markers.splice(0,index-1);
                    let right = markers.splice(index+1,markers.length-1);
                    markers = left.concat(right);
                  }else if (index == 0){
                    markers.shift();
                  }else{
                    markers.pop();
                  }
                }
                if (backaddress.has(employee.employeeId) && backaddress.get(employee.employeeId)== employee.address){
                  backaddress.delete(employee.employeeId);
                }
                if (transpmap.has(employee.employeeId)){
                  let o:Driving|Walking|Riding|Transfer = transpmap.get(employee.employeeId);
                  o.clear();
                  transpmap.delete(employee.employeeId);
                }
                map.clearInfoWindow();
              };
              root.appendChild(name);
              root.appendChild(transp);
              root.appendChild(buttondepart);
              root.appendChild(buttoncancel);
              return root;
            }
            marker.on('click', ()=>{
              let infowindow = new AMap.InfoWindow({isCustom:false, autoMove:true, closeWhenClickMap:true, content:createcontent(this.map, this.markers, this.backaddress, this.transpmap), position:address,
                size:{width:500.0, height:200.0}, offset:{x:0, y:-50}});
              infowindow.open(this.map);
            });
            this.map.add(marker);
            this.map.setFitView();
            this.markers.push(address);
          }
      });
    }

    public addNormalMarkers(keywords:string[]){
      let address:LngLat;
      let i:any;
      for (i in keywords){
        this.geocoder.getLocation(keywords[i], (status, result)=>{
          if (status === 'error'||status === 'no_data'){
            message.error('查询员工地址失败');
          }else{
            address = result.geocodes[0].location;
            let i:any;
            
            for (i in this.normalmarkers){
              if (address.lng == this.normalmarkers[i].lng && address.lat == this.normalmarkers[i].lat){
                return;
              }
            }
            let marker = new AMap.Marker({position:address});
            this.map.add(marker);
            this.map.setFitView();
            this.normalmarkers.push(address);
            this.normalrealmarkers.push(marker);
          }
      });
      }
      
    }
    public drawbusline(keywords:string[], id:string){
      let points = keywords.map((keyword:string)=>({keyword:keyword, city:'上海市'}));
      let drivingtmp = new AMap.Driving({map:this.map, policy:0, showTraffic:true, province:'沪', number:'ANH1N1', autoFitView:true, hideMarkers:false});
        drivingtmp.search(points, (status, data)=>{
        if (status == 'complete'){
          this.buslinemap.set(id,drivingtmp);
        }else{
          message.error(data);
        }
      });
    }
    public getWeather()
    {
      let weatherdata:string|false;
      this.weather.getLive('上海',(err,data)=>{
        if (!err){
          weatherdata = data.weather;
        }else{
          weatherdata = false;
        }
        this.weatherdata = weatherdata;
      });
    }
  }

export default MapComponent;