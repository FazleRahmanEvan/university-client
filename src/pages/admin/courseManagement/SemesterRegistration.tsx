import { FieldValues, SubmitHandler } from "react-hook-form";
import Uniform from "../../../components/form/Uniform";
import UniSelect from "../../../components/form/UniSelect";
import { Button, Col, Flex } from "antd";

import { toast } from "sonner";
import { semesterStatusOptions } from "../../../constants/semester";
import { TResponse } from "../../../types";
import UniDatePicker from "../../../components/form/UniDatePicker";
import UniInput from "../../../components/form/UniInput";
import { useGetAllSemestersQuery } from "../../../redux/features/admin/academicManagement.api";
import { useAddRegisteredSemesterMutation } from "../../../redux/features/admin/courseManagement";

const SemesterRegistration = () => {
  const [addSemester] = useAddRegisteredSemesterMutation();

  const { data: academicSemester } = useGetAllSemestersQuery([
    { name: "sort", value: "year" },
  ]);

  const academicSemesterOptions = academicSemester?.data?.map((item) => ({
    value: item._id,
    label: `${item.name} ${item.year}`,
  }));

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const toastId = toast.loading("Creating...");

    const semesterData = {
      ...data,
      minCredit: Number(data.minCredit),
      maxCredit: Number(data.maxCredit),
    };

    console.log(semesterData);

    try {
      const res = (await addSemester(semesterData)) as TResponse<any>;
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
    // <Flex justify="center" align="center">
    //   <Col span={6}>
    //     <Uniform
    //       onSubmit={onSubmit}
    //       resolver={zodResolver(academicSemesterSchema)}
    //     >
    //       <UniSelect label="Name" name="name" options={academicSemesterOptions } disabled={false} />

    //       <UniSelect
    //         label="Start Month"
    //         name="startMonth"
    //         options={monthOptions} disabled={false}          />
    //       <UniSelect label="End Month" name="endMonth" options={monthOptions} disabled={false} />
    //       <Button htmlType="submit">Submit</Button>
    //     </Uniform>
    //   </Col>
    // </Flex>
    <Flex justify="center" align="center">
      <Col span={6}>
        <Uniform onSubmit={onSubmit}>
          <UniSelect
            label="Academic Semester"
            name="academicSemester"
            options={academicSemesterOptions}
            disabled={false}
          />

          <UniSelect
            name="status"
            label="Status"
            options={semesterStatusOptions}
            disabled={false}
          />
          <UniDatePicker name="startDate" label="Start Date" />
          <UniDatePicker name="endDate" label="End Date" />
          <UniInput type="text" name="minCredit" label="Min Credit" />
          <UniInput type="text" name="maxCredit" label="Max Credit" />

          <Button htmlType="submit">Submit</Button>
        </Uniform>
      </Col>
    </Flex>
  );
};

export default SemesterRegistration;
