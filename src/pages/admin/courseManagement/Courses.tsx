import { Button, Modal, Table } from "antd";

import { useState } from "react";

import Uniform from "../../../components/form/Uniform";
import UniSelect from "../../../components/form/UniSelect";
import {
  useAddFacultiesMutation,
  useGetAllCoursesQuery,
} from "../../../redux/features/admin/courseManagement";
import { useGetAllFacultiesQuery } from "../../../redux/features/admin/userManagement.api";

const Courses = () => {
  // const [params, setParams] = useState<TQueryParam[] | undefined>(undefined);

  const { data: courses, isFetching } = useGetAllCoursesQuery(undefined);

  const tableData = courses?.data?.result?.map(
    ({ _id, title, prefix, code }) => ({
      key: _id,
      title,
      code: `${prefix}${code}`,
    })
  );

  const columns = [
    {
      title: "Title",
      key: "title",
      dataIndex: "title",
    },
    {
      title: "Code",
      key: "code",
      dataIndex: "code",
    },
    {
      title: "Action",
      key: "x",
      render: (item: any) => {
        return <AddFacultyModal facultyInfo={item} />;
      },
    },
  ];

  // const onChange: TableProps<TTableData>['onChange'] = (
  //   _pagination,
  //   filters,
  //   _sorter,
  //   extra
  // ) => {
  //   if (extra.action === 'filter') {
  //     const queryParams: TQueryParam[] = [];
  //     setParams(queryParams);
  //   }
  // };

  return (
    <Table
      loading={isFetching}
      columns={columns}
      dataSource={tableData}
      // onChange={onChange}
    />
  );
};

const AddFacultyModal = ({ facultyInfo }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: facultiesData } = useGetAllFacultiesQuery(undefined);
  const [addFaculties] = useAddFacultiesMutation();

  const facultiesOption = facultiesData?.data?.map((item) => ({
    value: item._id,
    label: item.fullName,
  }));

  const handleSubmit = (data) => {
    const facultyData = {
      courseId: facultyInfo.key,
      data,
    };

    console.log(facultyData);

    addFaculties(facultyData);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button onClick={showModal}>Add Faculty</Button>
      <Modal
        title="Basic Modal"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Uniform onSubmit={handleSubmit}>
          <UniSelect
            mode="multiple"
            options={facultiesOption}
            name="faculties"
            label="Faculty"
            disabled={false}
          />
          <Button htmlType="submit">Submit</Button>
        </Uniform>
      </Modal>
    </>
  );
};

export default Courses;
