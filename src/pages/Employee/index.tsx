import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, message, Input, Drawer } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import ProDescriptions from '@ant-design/pro-descriptions';
import CreateForm from './components/CreateForm';
import UpdateForm, { FormValueType } from './components/UpdateForm';
import { TableListItem } from './data';
import { searchemployeeparam, updateRule, addEmployee, removeRule , AddEmployeeParamType, SimpleResponse} from './service';
import BreadcrumbSeparator from 'antd/lib/breadcrumb/BreadcrumbSeparator';

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: AddEmployeeParamType) => {
  const hide = message.loading('正在添加');
  let res = await addEmployee({ ...fields });
  if (res.meta.code == 0){
    hide();
    message.success('添加成功');
    return true;
  }
  else{
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};

/**
 * 更新节点
 * @param fields
 */
const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('正在配置');
  try {
    await updateRule({
      name: fields.name,
      desc: fields.desc,
      key: fields.key,
    });
    hide();

    message.success('配置成功');
    return true;
  } catch (error) {
    hide();
    message.error('配置失败请重试！');
    return false;
  }
};

/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (selectedRows: TableListItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await removeRule({
      key: selectedRows.map((row) => row.key),
    });
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const TableList: React.FC<{}> = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<TableListItem>();
  const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>([]);
  const columns: ProColumns<AddEmployeeParamType>[] = [
    {
      title: '工号',
      dataIndex: 'employeeId',
      tip: '员工的唯一Id',
      sorter: (a:AddEmployeeParamType, b:AddEmployeeParamType) => parseInt(a.employeeId, 0) - parseInt(b.employeeId, 0),
      render: (dom, entity) => {
        return <a onClick={() => setRow(entity)}>{dom}</a>;
      },
    },
    {
      title: '姓名',
      dataIndex: 'name',
      valueType: 'textarea',
    },
    {
      title: '科室',
      dataIndex: 'dep',
    },
    {
      title: '家庭地址',
      dataIndex: 'address',
      valueType: 'textarea',
    },
    {
      title: '考勤班制',
      dataIndex: 'work_mode',
      filters:[{text: '弹性工作制', value: '0'},{text: '常日班制', value: '1'},{text: '12小时翻班制', value: '2'}],
      onFilter: (value, record)=> (record.work_mode == value),
      valueEnum: {
        '0': { text: '弹性工作制'},
        '1': { text: '常日班制'},
        '2': { text: '12小时翻班制'}
      },
    },
    {
      title: '日常出行方式',
      dataIndex: 'transpsunny',
      filters:[{text: '开车', value: '0'},{text: '步行', value: '1'},{text: '公共交通', value: '2'},
      {text: '骑自行车', value: '3'},{text: '坐班车', value: '4'},{text: '打车', value: '5'},{text: '其它', value: '6'}],
      onFilter: (value, record)=> (record.transpsunny == value),
      valueEnum: {
        '0': { text: '开车'},
        '1': { text: '步行'},
        '2': { text: '公共交通'},
        '3': { text: '骑自行车'},
        '4': { text: '坐班车'},
        '5': { text: '打车'},
        '6': { text: '其它'}
      },
    },
    {
      title: '雨雪雾天出行方式',
      dataIndex: 'transpbadweather',
      filters:[{text: '开车', value: '0'},{text: '步行', value: '1'},{text: '公共交通', value: '2'},
      {text: '骑自行车', value: '3'},{text: '坐班车', value: '4'},{text: '打车', value: '5'},{text: '其它', value: '6'}],
      onFilter: (value, record)=> (record.transpbadweather == value),
      valueEnum: {
        '0': { text: '开车'},
        '1': { text: '步行'},
        '2': { text: '公共交通'},
        '3': { text: '骑自行车'},
        '4': { text: '坐班车'},
        '5': { text: '打车'},
        '6': { text: '其它'}
      },
    },
    {
      title: '外地牌照',
      dataIndex: 'extlpn',
      filters:[{text: '本地', value: '0'},{text: '外地', value: '1'},{text: '不驾车', value: '2'}],
      onFilter: (value, record)=> (record.extlpn == value),
      valueEnum: {
        '0': { text: '本地'},
        '1': { text: '外地'},
        '2': { text: '不驾车'}
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <a
            onClick={() => {
              handleUpdateModalVisible(true);
              setStepFormValues(record);
            }}
          >
            编辑
          </a>
          <Divider type="vertical" />
          <a href="">删除</a>
        </>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<AddEmployeeParamType>
        headerTitle="员工通勤信息"
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button type="primary" onClick={() => handleModalVisible(true)}>
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={(params, sorter, filter) => searchemployeeparam({ ...params, sorter, filter })}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择 <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a> 项&nbsp;&nbsp;
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            批量删除
          </Button>
          <Button type="primary">批量增加</Button>
        </FooterToolbar>
      )}
      <CreateForm onCancel={() => handleModalVisible(false)} modalVisible={createModalVisible}>
        <ProTable<AddEmployeeParamType, AddEmployeeParamType>
          onSubmit={async (value) => {
            const success = await handleAdd(value);
            if (success) {
              handleModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          rowKey="key"
          type="form"
          columns={columns}
        />
      </CreateForm>
      {stepFormValues && Object.keys(stepFormValues).length ? (
        <UpdateForm
          onSubmit={async (value) => {
            const success = await handleUpdate(value);
            if (success) {
              handleUpdateModalVisible(false);
              setStepFormValues({});
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          onCancel={() => {
            handleUpdateModalVisible(false);
            setStepFormValues({});
          }}
          updateModalVisible={updateModalVisible}
          values={stepFormValues}
        />
      ) : null}

      <Drawer
        width={600}
        visible={!!row}
        onClose={() => {
          setRow(undefined);
        }}
        closable={false}
      >
        {row?.name && (
          <ProDescriptions<TableListItem>
            column={2}
            title={row?.name}
            request={async () => ({
              data: row || {},
            })}
            params={{
              id: row?.name,
            }}
            columns={columns}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
