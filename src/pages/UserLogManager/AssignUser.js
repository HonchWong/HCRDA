import React, { PureComponent } from 'react';
import {
  Card,
  Button,
  Form,
  Icon,
  Col,
  Row,
  DatePicker,
  TimePicker,
  Input,
  Select,
  Popover,
} from 'antd';
import { connect } from 'dva';
import FooterToolbar from '@/components/FooterToolbar';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import TableForm from './AssignUserTable';
import styles from './AssignUser.less';

const { Option } = Select;
const { RangePicker } = DatePicker;

const fieldLabels = {
  name: '仓库名',
  url: '仓库域名',
  owner: '仓库管理员',
  approver: '审批人',
  dateRange: '生效日期',
  type: '仓库类型',
  name2: '任务名',
  url2: '任务描述',
  owner2: '执行人',
  approver2: '责任人',
  dateRange2: '生效日期',
  type2: '任务类型',
};

const tableData = [
  {
    key: '1',
    uin: '625845706',
  },
  {
    key: '2',
    uin: '1234',
  },
  {
    key: '3',
    uin: '5678',
  },
];

@connect(({ assignuser, loading }) => ({
  submitting: loading.effects['assignuser/updateNeedUploadList'],
  fetchNeedUploadListLoading: loading.effects['assignuser/fetchNeedUploadList'],
  data: assignuser.needUploadList,
  // needUploadList,
}))
@Form.create()
class AssignUser extends PureComponent {
  state = {
    width: '100%',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'assignuser/fetchNeedUploadList',
    });

    window.addEventListener('resize', this.resizeFooterToolbar, { passive: true });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

  getErrorInfo = () => {
    const {
      form: { getFieldsError },
    } = this.props;
    const errors = getFieldsError();
    const errorCount = Object.keys(errors).filter(key => errors[key]).length;
    if (!errors || errorCount === 0) {
      return null;
    }
    const scrollToField = fieldKey => {
      const labelNode = document.querySelector(`label[for="${fieldKey}"]`);
      if (labelNode) {
        labelNode.scrollIntoView(true);
      }
    };
    const errorList = Object.keys(errors).map(key => {
      if (!errors[key]) {
        return null;
      }
      return (
        <li key={key} className={styles.errorListItem} onClick={() => scrollToField(key)}>
          <Icon type="cross-circle-o" className={styles.errorIcon} />
          <div className={styles.errorMessage}>{errors[key][0]}</div>
          <div className={styles.errorField}>{fieldLabels[key]}</div>
        </li>
      );
    });
    return (
      <span className={styles.errorIcon}>
        <Popover
          title="表单校验信息"
          content={errorList}
          overlayClassName={styles.errorPopover}
          trigger="click"
          getPopupContainer={trigger => trigger.parentNode}
        >
          <Icon type="exclamation-circle" />
        </Popover>
        {errorCount}
      </span>
    );
  };

  resizeFooterToolbar = () => {
    requestAnimationFrame(() => {
      const sider = document.querySelectorAll('.ant-layout-sider')[0];
      if (sider) {
        const width = `calc(100% - ${sider.style.width})`;
        const { width: stateWidth } = this.state;
        if (stateWidth !== width) {
          this.setState({ width });
        }
      }
    });
  };

  validate = () => {
    const {
      form: { validateFieldsAndScroll },
      dispatch,
    } = this.props;
    validateFieldsAndScroll((error, values) => {
      if (!error) {
        dispatch({
          type: 'assignuser/updateNeedUploadList',
          payload: values,
        });
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      // needUploadList: { needUploadList },
      data,
      submitting,
      fetchNeedUploadListLoading,
    } = this.props;
    const { width } = this.state;

    return (
      <PageHeaderWrapper
        title="高级表单"
        content="高级表单常见于一次性输入和提交大批量数据的场景。"
        wrapperClassName={styles.advancedForm}
      >
        <Card title="指定用户" bordered={false} loading={fetchNeedUploadListLoading}>
          {getFieldDecorator('needUploadList', {
            initialValue: data.needUploadList,
          })(<TableForm />)}
        </Card>
        <FooterToolbar style={{ width }}>
          {this.getErrorInfo()}
          <Button type="primary" onClick={this.validate} loading={submitting}>
            提交
          </Button>
        </FooterToolbar>
      </PageHeaderWrapper>
    );
  }
}

export default AssignUser;
