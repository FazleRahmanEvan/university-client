import { useState } from "react";
import {
  useCreateOfferedCourseMutation,
  useGetAllCoursesQuery,
  useGetAllRegisteredSemestersQuery,
  useGetCourseFacultiesQuery,
} from "../../../redux/features/admin/courseManagement";
import {
  useGetAcademicDepartmentsQuery,
  useGetAcademicFacultiesQuery,
} from "../../../redux/features/admin/academicManagement.api";
import { FieldValues, SubmitHandler } from "react-hook-form";
import moment from "moment";
import { Button, Col, Flex } from "antd";
import Uniform from "../../../components/form/Uniform";
import UniSelect from "../../../components/form/UniSelect";
import UniSelectWithWatch from "../../../components/form/UniSelectWithWatch";
import UniInput from "../../../components/form/UniInput";
import UniTimePicker from "../../../components/form/UniTimePicker";
import { weekDaysOptions } from "../../../constants/global";

const OfferCourse = () => {
  const [courseId, setCourseId] = useState("");

  const [addOfferedCourse] = useCreateOfferedCourseMutation();

  const { data: semesterRegistrationData } = useGetAllRegisteredSemestersQuery([
    { name: "sort", value: "year" },
    { name: "status", value: "UPCOMING" },
  ]);

  const { data: academicFacultyData } = useGetAcademicFacultiesQuery(undefined);

  const { data: academicDepartmentData } =
    useGetAcademicDepartmentsQuery(undefined);

  const { data: coursesData } = useGetAllCoursesQuery(undefined);

  const { data: facultiesData, isFetching: fetchingFaculties } =
    useGetCourseFacultiesQuery(courseId, { skip: !courseId });

  const semesterRegistrationOptions = semesterRegistrationData?.data?.map(
    (item) => ({
      value: item._id,
      label: `${item.academicSemester.name} ${item.academicSemester.year}`,
    })
  );

  const academicFacultyOptions = academicFacultyData?.data?.map((item) => ({
    value: item._id,
    label: item.name,
  }));

  const academicDepartmentOptions = academicDepartmentData?.data?.map(
    (item) => ({
      value: item._id,
      label: item.name,
    })
  );

  const courseOptions = coursesData?.data?.result?.map((item) => ({
    value: item._id,
    label: item.title,
  }));

  const facultiesOptions = facultiesData?.data?.faculties?.map((item) => ({
    value: item._id,
    label: item.fullName,
  }));

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const offeredCourseData = {
      ...data,
      maxCapacity: Number(data.maxCapacity),
      section: Number(data.section),
      startTime: moment(new Date(data.startTime)).format("HH:mm"),
      endTime: moment(new Date(data.endTime)).format("HH:mm"),
    };

    const res = await addOfferedCourse(offeredCourseData);
    console.log(res);
  };

  return (
    <Flex justify="center" align="center">
      <Col span={6}>
        <Uniform onSubmit={onSubmit}>
          <UniSelect
            name="semesterRegistration"
            label="Semester Registrations"
            options={semesterRegistrationOptions}
            disabled={false}
          />
          <UniSelect
            name="academicFaculty"
            label="Academic Faculty"
            options={academicFacultyOptions}
            disabled={false}
          />
          <UniSelect
            name="academicDepartment"
            label="Academic Department"
            options={academicDepartmentOptions}
            disabled={false}
          />
          <UniSelectWithWatch
            onValueChange={setCourseId}
            options={courseOptions}
            name="course"
            label="Course"
          />
          <UniSelect
            disabled={!courseId || fetchingFaculties}
            name="faculty"
            label="Faculty"
            options={facultiesOptions}
          />
          <UniInput type="text" name="section" label="Section" />
          <UniInput type="text" name="maxCapacity" label="Max Capacity" />
          <UniSelect
            mode="multiple"
            options={weekDaysOptions}
            name="days"
            label="Days"
            disabled={false}
          />
          <UniTimePicker name="startTime" label="Start Time" />
          <UniTimePicker name="endTime" label="End Time" />

          <Button htmlType="submit">Submit</Button>
        </Uniform>
      </Col>
    </Flex>
  );
};

export default OfferCourse;
