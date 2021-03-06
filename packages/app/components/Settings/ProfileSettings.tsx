import { API } from "@koh/api-client";
import { UpdateProfileParams } from "@koh/common";
import { Button, Form, Input, message } from "antd";
import { pick } from "lodash";
import React, { ReactElement } from "react";
import useSWR from "swr";

export default function ProfileSettings(): ReactElement {
  const { data: profile, mutate } = useSWR(`api/v1/profile`, async () =>
    API.profile.index()
  );

  const [form] = Form.useForm();
  const editProfile = async (updateProfile: UpdateProfileParams) => {
    const newProfile = { ...profile, ...updateProfile };
    mutate(newProfile, false);
    await API.profile.patch(pick(newProfile, ["firstName", "lastName"]));
    mutate();
    return newProfile;
  };

  const handleOk = async () => {
    const value = await form.validateFields();
    const newProfile = await editProfile(value);
    form.setFieldsValue(newProfile);
    message.success("Your profile settings have been sucsessfully updated");
  };

  return profile ? (
    <div style={{ paddingTop: "50px" }}>
      <Form form={form} initialValues={profile}>
        <Form.Item
          label="First Name"
          name="firstName"
          data-cy="firstNameInput"
          rules={[
            {
              required: true,
              message: "Your name can't be empty!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Last Name"
          name="lastName"
          data-cy="lastNameInput"
          rules={[
            {
              required: true,
              message: "Your name can't be empty!",
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
      <Button key="submit" type="primary" onClick={handleOk}>
        Ok
      </Button>
    </div>
  ) : null;
}
