import { FieldValues, SubmitHandler } from "react-hook-form";
import Uniform from "../../../components/form/Uniform";
import UniSelect from "../../../components/form/UniSelect";
import { Button, Col, Flex } from "antd";
import { zodResolver } from "@hookform/resolvers/zod";
import { academicSemesterSchema } from "../../../schemas/academicManagement.schema";
import { monthOptions } from "../../../constants/global";
import { useAddAcademicSemesterMutation } from "../../../redux/features/admin/academicManagement.api";
import { toast } from "sonner";
import { semesterOptions } from "../../../constants/semester";
import { TResponse } from "../../../types";

const currentYear = new Date().getFullYear();
const yearOptions = [0, 1, 2, 3, 4].map((number) => ({
  value: String(currentYear + number),
  label: String(currentYear + number),
}));

const CreateAcademicSemester = () => {
  const [addAcademicSemester] = useAddAcademicSemesterMutation();

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const toastId = toast.loading("Creating...");

    const name = semesterOptions[Number(data?.name) - 1]?.label;

    const semesterData = {
      name,
      code: data.name,
      year: data.year,
      startMonth: data.startMonth,
      endMonth: data.endMonth,
    };

    try {
      const res = (await addAcademicSemester(
        semesterData
      )) as TResponse<string>;
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
        <Uniform
          onSubmit={onSubmit}
          resolver={zodResolver(academicSemesterSchema)}
        >
          <UniSelect
            label="Name"
            name="name"
            options={semesterOptions}
            disabled={false}
          />
          <UniSelect
            label="Year"
            name="year"
            options={yearOptions}
            disabled={false}
          />
          <UniSelect
            label="Start Month"
            name="startMonth"
            options={monthOptions}
            disabled={false}
          />
          <UniSelect
            label="End Month"
            name="endMonth"
            options={monthOptions}
            disabled={false}
          />
          <Button htmlType="submit">Submit</Button>
        </Uniform>
      </Col>
    </Flex>
  );
};

export default CreateAcademicSemester;
