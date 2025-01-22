import { FieldValues, SubmitHandler } from "react-hook-form";

import { Button, Col, Flex } from "antd";

import {
  useAddCourseMutation,
  useGetAllCoursesQuery,
} from "../../../redux/features/admin/courseManagement";
import { TResponse } from "../../../types";
import { toast } from "sonner";
import UniInput from "../../../components/form/UniInput";

import Uniform from "../../../components/form/Uniform";
import UniSelect from "../../../components/form/UniSelect";

const CreateCourse = () => {
  const [createCourse] = useAddCourseMutation();
  const { data: courses } = useGetAllCoursesQuery(undefined);

  const preRequisiteCoursesOptions = courses?.data?.result?.map((item) => ({
    value: item._id,
    label: item.title,
  }));

  console.log(preRequisiteCoursesOptions);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const toastId = toast.loading("Creating...");

    const courseData = {
      ...data,
      code: Number(data.code),
      credits: Number(data.credits),
      isDeleted: false,
      preRequisiteCourses: data.preRequisiteCourses
        ? data.preRequisiteCourses?.map((item) => ({
            course: item,
            isDeleted: false,
          }))
        : [],
    };

    console.log(courseData);

    try {
      const res = (await createCourse(courseData)) as TResponse<any>;
      console.log(res);
      if (res.error) {
        toast.error(res.error.data.message, { id: toastId });
      } else {
        toast.success("Semester created", { id: toastId });
      }
    } catch (err) {
      toast.error("Something went wrong", { id: toastId });
    }
  };

  return (
    <Flex justify="center" align="center">
      <Col span={6}>
        <Uniform onSubmit={onSubmit}>
          <UniInput type="text" name="title" label="Title" />
          <UniInput type="text" name="prefix" label="Prefix" />
          <UniInput type="text" name="code" label="Code" />
          <UniInput type="text" name="credits" label="Credits" />
          <UniSelect
            mode="multiple"
            options={preRequisiteCoursesOptions}
            name="preRequisiteCourses"
            label="preRequisiteCourses"
            disabled={false}
          />
          <Button htmlType="submit">Submit</Button>
        </Uniform>
      </Col>
    </Flex>
  );
};

export default CreateCourse;
