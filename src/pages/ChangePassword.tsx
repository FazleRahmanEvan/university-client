import { Button, Row } from "antd";
import UniInput from "../components/form/UniInput";
import Uniform from "../components/form/Uniform";
import { logout } from "../redux/features/auth/authSlice";
import { TResponse } from "../types";
import { FieldValues, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../redux/hooks";
import { useChangePasswordMutation } from "../redux/features/admin/userManagement.api";

const ChangePassword = () => {
  const [changePassword] = useChangePasswordMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    console.log(data);

    const res = (await changePassword(data)) as TResponse<any>;
    console.log(res?.data?.success);
    if (res?.data?.success) {
      dispatch(logout());
      navigate("/login");
    }
  };

  return (
    <Row justify="center" align="middle" style={{ height: "100vh" }}>
      <Uniform onSubmit={onSubmit}>
        <UniInput type="text" name="oldPassword" label="Old Password" />
        <UniInput type="text" name="newPassword" label="New Password" />
        <Button htmlType="submit">Login</Button>
      </Uniform>
    </Row>
  );
};

export default ChangePassword;
