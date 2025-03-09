import { useSocket } from "@/context/SocketContext"
import { apiClient } from "@/lib/api-client"
import { useAppStore } from "@/store"
import { UPLOAD_FILE_ROUTE } from "@/utils/constants"
import EmojiPicker from "emoji-picker-react"
import { useEffect, useRef, useState } from "react"
import { GrAttachment } from 'react-icons/gr'
import { IoSend } from "react-icons/io5"
import { RiEmojiStickerLine } from "react-icons/ri"

const MessageBar = () => {
    const emojiRef=useRef()
    const fileInputRef=useRef()
    const socket=useSocket()
    const {selectedChatType, selectedChatData,userInfo,setIsUploading,setFileUploadingProgress} =useAppStore()
    const [message , setMessage] = useState("")
    const [emojiPickerOpen, setEmojiPickerOpen] = useState(false)

    useEffect(() => {
      function handleClickOutside(event){
        if(emojiRef.current && !emojiRef.current.contains(event.target)){
            setEmojiPickerOpen(false)
        }
      }
      document.addEventListener("mousedown",handleClickOutside)
      return ()=>{
        document.removeEventListener("mousedown",handleClickOutside)
      }
    }, [emojiRef])
    

    const handleAddEmoji=(emoji)=>{
        setMessage((msg)=>msg + emoji.emoji)
    }

    const handleSendMessage=async()=>{
      if(selectedChatType==="contact"){
        socket.emit("sendMessage",{
          sender:userInfo.id,
          content:message,
          recipient:selectedChatData._id,
          messageType:"text",
          fileUrl:undefined,
        })
    }else if(selectedChatType==="channel"){
      socket.emit("send-channel-message",{
        sender:userInfo.id,
        content:message,
        messageType:"text",
        fileUrl:undefined,
        channelId:selectedChatData._id,
      })
    }
    setMessage("")
  }

 const handleAttachmentClick=()=>{
  if(fileInputRef.current){
    fileInputRef.current.click()
  }
 }

 const handleAttachmentChange=async (event)=>{
  try{
    const file= event.target.files[0]
    if(file){
      const formData=new FormData()
      formData.append("file",file)
      setIsUploading(true)
      const res=await apiClient.post(UPLOAD_FILE_ROUTE,formData,{
        withCredentials:true,
        onUploadProgress:data=>{
          setFileUploadingProgress(Math.round((100*data.loaded)/data.total))
        }
      })
      if(res.status==200 && res.data){
        setIsUploading(false)
        if(selectedChatType==="contact"){
          socket.emit("sendMessage",{
          sender:userInfo.id,
          content:undefined,
          recipient:selectedChatData._id,
          messageType:"file",
          fileUrl:res.data.filePath,
        })
        }else if(selectedChatType==="channel"){
          socket.emit("send-channel-message",{
          sender:userInfo.id,
          content:undefined,
          messageType:"file",
          fileUrl:res.data.filePath,
          channelId:selectedChatData._id,
          })
        }
      }
    }
  
  }catch(err){
    setIsUploading(false)
    console.log({err})
  }
 }

  return (
      <div className="h-[10vh] bg-[#1c1d25] gap-6 mb-6 flex items-center justify-center px-8">
        <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5">
          <input onChange={e=>setMessage(e.target.value)} value={message} placeholder="Enter Message" type="text" className="flex-1 focus:border-none focus:outline-none p-5 bg-transparent rounded-md" />

          <button className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all'onClick={handleAttachmentClick}>
            <GrAttachment className="text-2xl"/>
          </button>

          <input type="file" className="hidden" ref={fileInputRef} onChange={handleAttachmentChange} />
 
        
          <div className="relative">

            <button className='text-neutral-500 focus:border-nonefocus:outline-none focus:text-white duration-300 transition-all' onClick={()=>setEmojiPickerOpen(true)} >
            <RiEmojiStickerLine className="text-2xl"/>
            </button>

            <div className="absolute bottom-16 right-0 " ref={emojiRef}>
            <EmojiPicker 
            theme="dark"
            open={emojiPickerOpen}
            onEmojiClick={handleAddEmoji}
            autoFocusSearch={false}
            />
            </div>

          </div>

        </div>

        <button className='bg-[#8417ff] rounded-md flex items-center justify-center p-5 hover:bg-[#741bda]  focus:bg-[#741bda] focus:border-none focus:outline-none focus:text-white duration-300 transition-all' onClick={handleSendMessage}>
          <IoSend className="text-2xl"/>
        </button>

      </div>
  )
}

export default MessageBar