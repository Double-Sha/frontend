import { Popover, Button } from 'antd';
import React from 'react';

class App extends React.Component {
  state = {
    visible: false,
    employeename: '',
    transp: ''
  };

  hide = () => {
    this.setState({
      visible: false,
    });
  };

  handleVisibleChange = visible => {
    this.setState({ visible });
  };

  render() {
    return (
      <Popover
        content={
            <>
                <p>员工姓名：{this.state.employeename}</p>
                <p>员工出行方式：{this.state.transp}</p>
                <Button type="primary">出发</Button>
                <Button>删除该点</Button>
            </>
        }
        title="Title"
        trigger="click"
        visible={this.state.visible}
        onVisibleChange={this.handleVisibleChange}
      >
        <Button type="primary">删除该点</Button>
      </Popover>
    );
  }
}

ReactDOM.render(<App />, mountNode);