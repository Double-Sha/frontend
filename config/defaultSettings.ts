import { Settings as LayoutSettings } from '@ant-design/pro-layout';

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: any;
  onMenuHeaderClick?: any;
} = {
  navTheme: 'light',
  // 拂晓蓝
  primaryColor: '#1890ff',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: 'UAES Intelligent Transportation System',
  pwa: false,
  logo: false,
  iconfontUrl: '',
  onMenuHeaderClick: false
};

export default Settings;