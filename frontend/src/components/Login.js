import { Button, Form, Input, message } from "antd"
// import "antd/dist/antd.css"
import axios from "axios"
import React from "react"
import { useNavigate } from "react-router-dom"

const Login = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()

  const handleLogin = async () => {
    try {
      const values = await form.validateFields()

      const formData = new FormData()
      formData.append("username", values.username)
      formData.append("password", values.password)

      const response = await axios.post(
        "http://127.0.0.1:8000/login",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )

      const { access_token } = response.data
      localStorage.setItem("token", access_token)
      navigate("/home")
    } catch (error) {
      console.error("Login error:", error)
      message.error("Login failed. Please check your credentials.")
    }
  }

  return (
    <div style={{ width: 300, margin: "auto", marginTop: 100 }}>
      <h1>Login</h1>
      <Form form={form} onFinish={handleLogin}>
        <Form.Item
          label='Username'
          name='username'
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label='Password'
          name='password'
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType='submit'>
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default Login
