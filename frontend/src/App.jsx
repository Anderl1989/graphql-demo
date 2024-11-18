import { Button, Flex, Input, List, Menu, Space, Spin } from "antd";
import { useState } from "react";

import { LISTS, LIST, CREATE_LIST, DELETE_LIST } from './graphql/List.gql';
import { CREATE_TODO, DELETE_TODO } from './graphql/ToDo.gql';
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";

function App() {
  const [newList, setNewList] = useState('');
  const [newToDo, setNewToDo] = useState('');

  const { loading: listLoading, data: listsData } = useQuery(LISTS);

  const [createList, { loading: createListLoading }] = useMutation(CREATE_LIST, {
    refetchQueries: [LISTS],
  });
  const [deleteList, { loading: deleteListLoading }] = useMutation(DELETE_LIST, {
    refetchQueries: [LISTS, LIST],
  });

  const [getList, { loading: listDetailLoading, data: listDetailData }] = useLazyQuery(LIST);
  const [createToDo, { loading: createToDoLoading }] = useMutation(CREATE_TODO, {
    refetchQueries: [LIST],
  });
  const [deleteToDo, { loading: deleteToDoLoading }] = useMutation(DELETE_TODO, {
    refetchQueries: [LIST],
  });

  const lists = (listsData?.lists || []).map((item) => ({ key: item._id, label: item.name }));

  const toDos = listDetailData?.list?.toDos || [];

  const loading = listLoading || createListLoading || deleteListLoading;
  const detailLoading = listDetailLoading || createToDoLoading || deleteToDoLoading;

  return (
    <Flex gap={24}>
      {loading && <Spin size="large" />}
      {!loading && (
        <Flex vertical gap={24}>
          <Menu
            onClick={(item) => {
              console.log('KEY', item);
              getList({ variables: { id: item.key } });
            }}
            items={lists}
          />
          <Space.Compact style={{ width: '100%' }}>
            <Input
              placeholder="New List..."
              onChange={(e) => setNewList(e.target.value)}
              value={newList}
              onPressEnter={() => {
                createList({ variables: { input: { name: newList }}});
                setNewList('');
              }}
            />
            <Button
              type="primary"
              onClick={() => {
                createList({ variables: { input: { name: newList }}});
                setNewList('');
              }}
            >+</Button>
          </Space.Compact>
        </Flex>
      )}
      {detailLoading && <Spin size="large" />}
      {!detailLoading && listDetailData?.list && (
        <Flex vertical gap={24}>
          <Flex align="center" justify="space-between">
            <div>{listDetailData.list.name}</div>
            <Button
              color="danger"
              variant="outlined"
              onClick={() => {
                deleteList({ variables: { id: listDetailData.list._id }});
              }}
            >
              Delete
            </Button>
          </Flex>
          {toDos.length > 0 && <List
            size="large"
            bordered
            dataSource={toDos}
            renderItem={(toDo) => (
              <List.Item>
                <div>{toDo.message}</div>
                <Button
                  color="danger"
                  variant="outlined"
                  onClick={() => {
                    deleteToDo({ variables: { id: toDo._id }});
                  }}
                >
                  Delete
                </Button>
              </List.Item>
            )}
          />}
          <Space.Compact style={{ width: '100%' }}>
            <Input
              placeholder="New ToDo..."
              onChange={(e) => setNewToDo(e.target.value)}
              value={newToDo}
              onPressEnter={() => {
                createToDo({ variables: { input: { message: newToDo, list_id: listDetailData.list._id }}});
                setNewToDo('');
              }}
            />
            <Button
              type="primary"
              onClick={() => {
                createToDo({ variables: { input: { message: newToDo, list_id: listDetailData.list._id }}});
                setNewToDo('');
              }}
            >+</Button>
          </Space.Compact>
        </Flex>
      )}
    </Flex>
  );
}

export default App;
