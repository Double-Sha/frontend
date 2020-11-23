import {
  LockTwoTone,
  UserOutlined
} from '@ant-design/icons';
import { Alert, message} from 'antd';
import React, { useState } from 'react';
import ProForm, {ProFormText } from '@ant-design/pro-form';
import { history, FormattedMessage} from 'umi';
import Footer from '@/components/Footer';
import { fakeAccountLogin, LoginParamsType } from '@/services/login';

import styles from './index.less';

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

/**
 * 此方法会跳转到 redirect 参数所在的位置
 */
const goto = () => {
  const { query } = history.location;
  const { redirect } = query as { redirect: string };
  window.location.href = redirect || '/map';
};

const Login: React.FC<{}> = () => {
  const [submitting, setSubmitting] = useState(false);
  const [userLoginState, setUserLoginState] = useState<API.LoginStateType>({});
  const [type,] = useState<string>('account');

  const handleSubmit = (values: LoginParamsType) => {
    setSubmitting(true);
    let msg;
    try {
      if (values.password === 'UAES' && values.username === 'DemoHR') {
        msg = {
          status: 'ok',
          type: 'account',
          currentAuthority: 'admin',
        };
      }else{
        msg = {
          status: 'error',
          type: 'account',
          currentAuthority: 'admin',
        };
      }
      if (msg.status === 'ok') {
        message.success('登录成功！');
        goto();
        return;
      }
      // 如果失败去设置用户错误信息 
      setUserLoginState(msg);
    } catch (error) {
      message.error('登录失败，请重试！');
    }
    setSubmitting(false);
  };
  const { status, type: loginType } = userLoginState;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.top}>
          <div className={styles.header}>
            <span className={styles.title}>UAES Intelligent Transportation System</span>
          </div>
          <div className={styles.desc}>
            HR Pro
          </div>
        </div>

        <div className={styles.main}>
          <ProForm
            initialValues={{
              autoLogin: false,
            }}
            submitter={{
              render: (_, dom) => dom.pop(),
              submitButtonProps: {
                loading: submitting,
                size: 'large',
                style: {
                  width: '100%',
                },
              },
            }}
            onFinish={(values) => {
              handleSubmit(values);
            }}
          >

            {status === 'error' && loginType === 'account' && (
              <LoginMessage
                content={ '账户或密码错误（DemoHR/UAES)'}
              />
            )}

            {type === 'account' && (
              <>
                <ProFormText
                  name="username"
                  fieldProps={{
                    size: 'large',
                    prefix: <UserOutlined className={styles.prefixIcon} />,
                  }}
                  placeholder={'账户: DemoHR'}
                  rules={[
                    {
                      required: true,
                      message: (
                        <FormattedMessage
                          id="pages.login.username.required"
                          defaultMessage="请输入用户名!"
                        />
                      ),
                    },
                  ]}
                />
                <ProFormText.Password
                  name="password"
                  fieldProps={{
                    size: 'large',
                    prefix: <LockTwoTone className={styles.prefixIcon} />,
                  }}
                  placeholder={'密码: UAES'}
                  rules={[
                    {
                      required: true,
                      message: (
                        <FormattedMessage
                          id="pages.login.password.required"
                          defaultMessage="请输入密码！"
                        />
                      ),
                    },
                  ]}
                />
              </>
            )}
          </ProForm>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
