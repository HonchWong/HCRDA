import React, { PureComponent, Fragment } from 'react';
import { Table, Button, Input, message, Popconfirm, Divider, Select } from 'antd';
import isEqual from 'lodash/isEqual';
import styles from './AssignUser.less';

class AssignUserTable extends PureComponent {
  index = 0;

  cacheOriginData = {};

  constructor(props) {
    super(props);

    this.state = {
      data: props.value,
      loading: false,
      /* eslint-disable-next-line react/no-unused-state */
      value: props.value,
    };
  }

  static getDerivedStateFromProps(nextProps, preState) {
    if (isEqual(nextProps.value, preState.value)) {
      return null;
    }
    return {
      data: nextProps.value,
      value: nextProps.value,
    };
  }

  getRowByKey(key, newData) {
    const { data } = this.state;
    return (newData || data).filter(item => item.key === key)[0];
  }

  toggleEditable = (e, key) => {
    e.preventDefault();
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      // 进入编辑状态时保存原始数据
      if (!target.editable) {
        this.cacheOriginData[key] = { ...target };
      }
      target.editable = !target.editable;
      this.setState({ data: newData });
    }
  };

  newMember = () => {
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    var timestampStr = Date.parse(new Date()).toString();
    newData.push({
      key: timestampStr,
      // workId: '',
      uin: '',
      // department: '',
      editable: true,
      isNew: true,
    });
    this.index += 1;
    this.setState({ data: newData });
  };

  remove(key) {
    const { data } = this.state;
    const { onChange } = this.props;
    const newData = data.filter(item => item.key !== key);
    this.setState({ data: newData });
    onChange(newData);
  }

  handleKeyPress(e, key) {
    if (e.key === 'Enter') {
      this.saveRow(e, key);
    }
  }

  handleFieldChange(e, fieldName, key) {
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      if (!e.target) {
        target[fieldName] = e;
      } else {
        target[fieldName] = e.target.value;
      }
      this.setState({ data: newData });
    }
  }

  saveRow(e, key) {
    e.persist();
    this.setState({
      loading: true,
    });
    setTimeout(() => {
      if (this.clickedCancel) {
        this.clickedCancel = false;
        return;
      }
      const target = this.getRowByKey(key) || {};
      if (!target.uin) {
        message.error('请填写用户uin');
        e.target.focus();
        this.setState({
          loading: false,
        });
        return;
      }
      delete target.isNew;
      this.toggleEditable(e, key);
      const { data } = this.state;
      const { onChange } = this.props;
      onChange(data);
      this.setState({
        loading: false,
      });
    }, 500);
  }

  cancel(e, key) {
    this.clickedCancel = true;
    e.preventDefault();
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (this.cacheOriginData[key]) {
      Object.assign(target, this.cacheOriginData[key]);
      delete this.cacheOriginData[key];
    }
    target.editable = false;
    this.setState({ data: newData });
    this.clickedCancel = false;
  }

  render() {
    const columns = [
      {
        title: '用户uin',
        dataIndex: 'uin',
        key: 'uin',
        width: '40%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                autoFocus
                onChange={e => this.handleFieldChange(e, 'uin', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="用户uin"
              />
            );
          }
          return text;
        },
      },
      {
        title: '上传类型',
        dataIndex: 'uploadType',
        key: 'uploadType',
        width: '40%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Select
                placeholder="请选择"
                style={{ width: '100%' }}
                onChange={e => this.handleFieldChange(e, 'uploadType', record.key)}
              >
                <Option value="1">选择日期上传单个日志</Option>
                <Option value="2">上传全部日志</Option>
                <Option value="3">上传数据库</Option>
                <Option value="4">上传全部日志和数据库</Option>
                <Option value="5">选择日期发送单个日志到微信</Option>
                <Option value="6">发送全部日志到微信</Option>
                <Option value="7">发送数据库到微信</Option>
                <Option value="8">发送全部日志和数据库到微信</Option>
              </Select>
            );
          }
          var showText = '上传类型';
          if (text === '1') {
            showText = '选择日期上传单个日志';
          } else if (text === '2') {
            showText = '上传全部日志';
          } else if (text === '3') {
            showText = '上传数据库';
          } else if (text === '4') {
            showText = '上传全部日志和数据库';
          } else if (text === '5') {
            showText = '选择日期发送单个日志到微信';
          } else if (text === '6') {
            showText = '发送全部日志到微信';
          } else if (text === '7') {
            showText = '发送数据库到微信';
          } else if (text === '8') {
            showText = '发送全部日志和数据库到微信';
          }
          return showText;
        },
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => {
          const { loading } = this.state;
          if (!!record.editable && loading) {
            return null;
          }
          if (record.editable) {
            if (record.isNew) {
              return (
                <span>
                  <a onClick={e => this.saveRow(e, record.key)}>添加</a>
                  <Divider type="vertical" />
                  <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key)}>
                    <a>删除</a>
                  </Popconfirm>
                </span>
              );
            }
            return (
              <span>
                <a onClick={e => this.saveRow(e, record.key)}>保存</a>
                <Divider type="vertical" />
                <a onClick={e => this.cancel(e, record.key)}>取消</a>
              </span>
            );
          }
          return (
            <span>
              <a onClick={e => this.toggleEditable(e, record.key)}>编辑</a>
              <Divider type="vertical" />
              <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key)}>
                <a>删除</a>
              </Popconfirm>
            </span>
          );
        },
      },
    ];

    const { loading, data } = this.state;

    return (
      <Fragment>
        <Table
          loading={loading}
          columns={columns}
          dataSource={data}
          pagination={false}
          rowClassName={record => (record.editable ? styles.editable : '')}
        />
        <Button
          style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
          type="dashed"
          onClick={this.newMember}
          icon="plus"
        >
          新增用户
        </Button>
      </Fragment>
    );
  }
}

export default AssignUserTable;
