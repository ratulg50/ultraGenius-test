import {
  CopyFilled,
  DislikeFilled,
  EditFilled,
  LikeFilled,
  SendOutlined,
  MessageFilled,
  CheckOutlined,
} from "@ant-design/icons"
import { Button, Input, Modal, Tooltip, message } from "antd"
import axios from "axios"
import React, { useEffect, useState } from "react"
import "./style.css"
const Home = () => {
  const [discussionSummary, setDiscussionSummary] = useState("")
  const [editable, setEditable] = useState(false)
  // eslint-disable-next-line no-unused-vars
  const [inputField, setInputField] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [likeDislike, setLikeDislike] = useState("")

  const handleSaveDiscussionError = (error) => {
    if (error.response && error.response.status === 401) {
      // Unauthorized error, clear local storage and redirect to login
      localStorage.removeItem("token")
      window.location.href = "/login"
    } else {
      console.error("Error saving discussion summary:", error)
      // Handle other errors (e.g., show error message)
    }
  }

  useEffect(() => {
    // Fetch discussion summary data when component mounts
    fetchDiscussionSummary()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Empty dependency array to run only once on mount

  const fetchDiscussionSummary = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(
        "http://127.0.0.1:8000/discussion-summary",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      setDiscussionSummary(response.data.discussion_summary)
    } catch (error) {
      handleSaveDiscussionError(error)
    }
  }
  const fetchRandomText = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get("http://127.0.0.1:8000/random-text", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setDiscussionSummary(response.data.random_text)
    } catch (error) {
      handleSaveDiscussionError(error)
    }
  }
  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }
  const handleEditButton = () => {
    if (!editable) {
      message.success("Edit mode on")
    }
    if (editable) {
      message.success("Edit mode off")
    }
    setEditable(!editable)
  }

  const handleCopyToClipboard = () => {
    // Implement logic to copy text to clipboard
    navigator.clipboard.writeText(discussionSummary)
    message.success("Text copied to clipboard")
  }

  const handleCopyToInput = () => {
    setInputField(discussionSummary)
    message.success("Text copied to Input")
  }

  const handleConfirmDiscussion = () => {
    try {
      const token = localStorage.getItem("token")

      // Implement logic to save discussion
      var data = JSON.stringify({
        summary_text: discussionSummary,
      })

      var config = {
        method: "post",
        url: "http://127.0.0.1:8000/save-discussion-summary",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: data,
      }

      axios(config)
        .then(function (response) {
          message.success(response.data.message)

          console.log(JSON.stringify(response.data))
        })
        .catch(function (error) {
          console.log(error)
        })
    } catch (error) {
      handleSaveDiscussionError(error)
    }
  }

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.post("http://127.0.0.1:8000/logout", null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      message.success(response.data.message)
      localStorage.removeItem("token")
      setTimeout(() => {
        window.location.href = "/login"
      }, 1000)
    } catch (error) {
      handleSaveDiscussionError(error)
    }
  }
  const handleLike = () => {
    setLikeDislike("LIKE")
  }
  const handleDislike = () => {
    setLikeDislike("DISLIKE")
  }
  return (
    <div style={{ padding: 20 }}>
      <h1>Home</h1>
      <Button onClick={showModal}>Trigger Button</Button>
      <Modal
        title={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid #80808038",
              paddingBottom: "10px",
            }}
          >
            <div style={{ fontSize: "20px" }}>
              Discussion Summary
              <Tooltip title='Generate Random Text'>
                <MessageFilled
                  style={{ marginLeft: 10, color: "orange", cursor: "pointer" }}
                  onClick={fetchRandomText}
                />
              </Tooltip>
            </div>
            <div
              style={{
                padding: "3px 10px",
                background: "#3e3e3e",
                borderRadius: "8px",
              }}
            >
              {" "}
              <Tooltip title='Edit'>
                <EditFilled
                  onClick={handleEditButton}
                  style={{ cursor: "pointer", marginRight: 10, color: "white" }}
                />
              </Tooltip>
              <Tooltip title='Copy to clipboard'>
                <CopyFilled
                  onClick={handleCopyToClipboard}
                  style={{ cursor: "pointer", marginRight: 10, color: "white" }}
                />
              </Tooltip>
              <Tooltip title='Copy to Input'>
                <SendOutlined
                  onClick={handleCopyToInput}
                  style={{ cursor: "pointer", color: "white" }}
                />
              </Tooltip>
            </div>
          </div>
        }
        visible={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={
          <div style={{ textAlign: "right" }}>
            <Button
              key='confirm'
              type='primary'
              style={{
                height: "40px",
                background: "black",
                borderRadius: "8px",
                fontWeight: "600",
                paddingTop: "5px",
                paddingBottom: "5px",
              }}
              onClick={handleConfirmDiscussion}
            >
              <span
                style={{
                  color: "white",
                  marginRight: "5px",
                  background: "#a7de41",
                  paddingLeft: "2px",
                  paddingRight: "2px",
                }}
              >
                <CheckOutlined />
              </span>
              Confirm Discussion
            </Button>
          </div>
        }
        closeIcon={null}
        wrapClassName='custom-modal'
      >
        <Input.TextArea
          value={discussionSummary}
          onChange={(e) => setDiscussionSummary(e.target.value)}
          readOnly={!editable}
          style={{
            margin: "10px 0",
            borderRadius: 10,
            backgroundColor: "#f0f2f5",
          }}
          rows={5}
        />
        <div style={{ position: "relative" }}>
          <div
            style={{
              position: "absolute",
              top: "-20px",
              left: "20px",
              display: "flex",
            }}
          >
            <div
              style={{
                marginRight: "10px",
                padding: "2px 10px",
                boxShadow:
                  "rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px",
                background: likeDislike === "LIKE" ? "#13b313" : "white",
                borderRadius: "15px",
                cursor: "pointer",
              }}
              onClick={handleLike}
            >
              <LikeFilled style={{ color: "#ffaa46" }} />
            </div>
            <div
              style={{
                marginRight: "10px",
                padding: "2px 10px",
                boxShadow:
                  "rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px",
                background: likeDislike === "DISLIKE" ? "red" : "white",
                borderRadius: "15px",
                cursor: "pointer",
              }}
              onClick={handleDislike}
            >
              <DislikeFilled style={{ color: "#ffaa46" }} />
            </div>
          </div>
        </div>
      </Modal>
      <Button
        type='danger'
        onClick={handleLogout}
        style={{ position: "absolute", top: 10, right: 10 }}
      >
        Logout
      </Button>
    </div>
  )
}

export default Home
