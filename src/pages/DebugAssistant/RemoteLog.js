import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Card, Select, List, Button, Input } from 'antd';

import StandardFormRow from '@/components/StandardFormRow';
import styles from './RemoteLog.less';
import DescriptionList from '@/components/DescriptionList';

const { Description } = DescriptionList;
const { Option } = Select;
const FormItem = Form.Item;

@connect()
@Form.create()
class RemoteLog extends Component {
  constructor(props) {
    super(props);

    const urlParams = new URL(window.location.href);
    this.state = {
      logList: [],
      formVals: {
        hostName: urlParams.hostname,
        port: '9001',
        device: 'iOS',
      },
      connectIp: '',
      connectStatus: '',
    };

    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 15 },
    };
  }

  componentDidMount() {
    this.logList = [];

    this.openLogWebSocket();
  }

  openLogWebSocket = () => {
    if (this.socket && this.socket.readyState === 1) {
      this.socket.close();
    }
    const { formVals } = this.state;
    const { port, device, hostName } = formVals;
    const wsURL = `ws://${hostName}:${port}/hclog`;
    const connectResult = `${device} ${hostName}:${port}`;
    if (this.isValdIP(hostName)) {
      this.setState({
        connectStatus: '连接失败',
        connectIp: 'IP无效',
      });
      return;
    }
    if (this.isValdPort(port)) {
      this.setState({
        connectStatus: '连接失败',
        connectIp: '端口无效',
      });
      return;
    }
    this.socket = new WebSocket(wsURL);
    this.setState({
      connectStatus: '连接中',
      connectIp: connectResult,
    });
    this.socket.onopen = () => {
      this.setState({
        formVals: {
          hostName: hostName,
          port,
          device,
        },
        connectStatus: '连接成功',
        connectIp: connectResult,
      });
    };
    this.socket.onmessage = e => {
      if (typeof e.data === 'string') {
        this.logList.unshift(e.data);
        this.setState({ logList: this.logList });
      }
    };
    this.socket.onerror = () => {
      this.setState({
        connectStatus: '连接失败',
        connectIp: connectResult,
      });
    };
    this.socket.onclose = () => {};
  };

  handleFormStart = () => {
    this.openLogWebSocket();
  };

  handleFormClear = () => {
    this.logList = [];
    this.setState({ logList: this.logList });
  };

  handleDeviceSeleced = data => {
    this.state.formVals.device = data;
  };

  handleHostNameInput = e => {
    this.state.formVals.hostName = e.target.value;
  };

  handlePortInput = e => {
    this.state.formVals.port = e.target.value;
  };

  /* 端口号校验 */
  isValdPort = port => {
    const parten = /^(\d)+$/g;
    if (parten.test(port) && parseInt(port, 10) <= 65535 && parseInt(port, 10) >= 0) {
      return false;
    }
    return true;
  };

  /* ipv4校验 */
  isValdIP = hostname => {
    const val = /([0-9]{1,3}\.{1}){3}[0-9]{1,3}/;
    const vald = val.exec(hostname);
    if (vald === null) {
      this.setState({
        connectStatus: '连接失败',
        connectIp: 'IP无效',
      });
      return true;
    }
    if (vald !== '') {
      if (vald[0] !== hostname) {
        return true;
      }
    }

    return false;
  };

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { formVals, connectStatus, connectIp, logList } = this.state;

    const ListContent = data => (
      <div className={styles.listContent}>
        <div className={styles.description}>{data.data}</div>
      </div>
    );

    return (
      <Fragment>
        <Card bordered={false}>
          <Form layout="inline">
            <StandardFormRow>
              <FormItem key="hostName" {...this.formLayout} label="IP地址">
                {getFieldDecorator('hostName', {
                  rules: [{ required: true, message: '请输入IP地址名称！' }],
                  initialValue: formVals.hostName,
                })(<Input placeholder="请输入" onChange={this.handleHostNameInput} />)}
              </FormItem>
              <FormItem key="port" {...this.formLayout} label="端口号">
                {getFieldDecorator('port', {
                  rules: [{ required: true, message: '请输入端口号！' }],
                  initialValue: formVals.port,
                })(<Input placeholder="请输入" onChange={this.handlePortInput} />)}
              </FormItem>
              <FormItem key="device" label="设备">
                {getFieldDecorator('device', {
                  rules: [{ required: true, message: '请输入端口号！' }],
                  initialValue: formVals.device,
                })(
                  <Select
                    style={{ width: 100 }}
                    placeholder="设备类型"
                    onSelect={this.handleDeviceSeleced}
                  >
                    <Option value="iOS">iOS</Option>
                    <Option value="Andriod">Andriod</Option>
                  </Select>
                )}
              </FormItem>
              <Button type="primary" htmlType="submit" onClick={this.handleFormStart}>
                连接
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                style={{ marginLeft: 8 }}
                onClick={this.handleFormClear}
              >
                清空
              </Button>
            </StandardFormRow>
          </Form>
          <DescriptionList size="large" title="" style={{ marginBottom: 0, marginTop: 12 }}>
            <Description term={connectStatus}>{connectIp}</Description>
          </DescriptionList>
        </Card>
        <Card
          style={{ marginTop: 24 }}
          bordered={false}
          bodyStyle={{ padding: '8px 32px 32px 32px' }}
        >
          <List
            size="large"
            rowKey="id"
            itemLayout="vertical"
            dataSource={logList}
            renderItem={item => <ListContent data={item} />}
          />
        </Card>
      </Fragment>
    );
  }
}

export default RemoteLog;
