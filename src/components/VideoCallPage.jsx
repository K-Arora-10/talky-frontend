import React, { useCallback, useEffect, useState } from 'react';
import { Video, Mic, MicOff, VideoOff, Phone, MessageSquare, Users, Share, MoreVertical } from 'lucide-react';
import { useSocket } from '../context/SocketProvider';
import peer from '../sevice/peer';

const VideoCallPage = () => {

    const socket = useSocket()


    const [remoteSocketId,setRemoteSocketId] = useState(null)
    const [myStream,setMyStream] = useState(null)
    const [remoteStream,setRemoteStream] = useState(null)

  // Color scheme from the provided image
  const colors = {
    darkBlue: '#212A31',
    navyBlue: '#2E3944',
    teal: '#124E66', 
    grayTeal: '#748D92',
    lightGray: '#D3D9D4'
  };

  const handleCallUser = useCallback(async()=>{
    const stream = await navigator.mediaDevices.getUserMedia({audio:true , video:true})
    const offer = await peer.getOffer()
    socket.emit('user-call',{to:remoteSocketId,offer})
    setMyStream(stream)
  },[remoteSocketId,socket])

  const handleUserJoin = useCallback((data)=>{
    const {name,id} = data
    console.log(`${data.name} joined the room with id ${data.id}`)
    setRemoteSocketId(data.id)
  },[setRemoteSocketId])

  const handleIncomingCall = useCallback(async ({from,offer})=>{
    setRemoteSocketId(from)
    console.log("Incoming Call from",from,offer)
    const stream = await navigator.mediaDevices.getUserMedia({audio:true , video:true})
    setMyStream(stream)
    const ans = await peer.getAnswer(offer)
    socket.emit('call-accepted',{to:from,ans})
  },[socket,setRemoteSocketId])



  const sendStreams = useCallback(()=>{
    for(const track of myStream.getTracks())
      {
        peer.peer.addTrack(track,myStream)
      }
  },[myStream])

  const handleCallAccepted = useCallback(({from,ans})=>{
    peer.setLocalDescription(ans)
    console.log("Call Accepted",from,ans)
    sendStreams()
  },[sendStreams])


  const handleNegoNeeded = useCallback(async()=>{
    const offer=await peer.getOffer()
    socket.emit('peer-nego-needed',{to:remoteSocketId,offer})
  })

  const handleNegoNeedIncoming = useCallback(async({from,offer})=>{
    const ans = await peer.getAnswer(offer);
    socket.emit('peer-nego-done',{to:from,ans})
  },[socket])


  const handleNegoFinal = useCallback(async({ans})=>{
    await peer.setLocalDescription(ans)
  },[])


  useEffect(()=>{
    peer.peer.addEventListener('negotiationneeded',handleNegoNeeded)

    return()=>{
      peer.peer.removeEventListener('negotiationneeded',handleNegoNeeded)
    }
  },[handleNegoNeeded])



  useEffect(()=>{
    peer.peer.addEventListener('track',async ev=>{
      const remotestream=ev.streams
      setRemoteStream(remotestream[0])
    })
  },[setRemoteStream])


  useEffect(()=>{
    socket.on("user-joined",handleUserJoin)
    socket.on("incoming-call",handleIncomingCall)
    socket.on("call-accepted",handleCallAccepted)
    socket.on('peer-nego-needed',handleNegoNeedIncoming)
    socket.on('peer-nego-final',handleNegoFinal)
    return()=>{
        socket.off("user-joined",handleUserJoin)
        socket.off("incoming-call",handleIncomingCall)
        socket.off("call-accepted",handleCallAccepted)
        socket.off('peer-nego-needed',handleNegoNeedIncoming)
        socket.off('peer-nego-final',handleNegoFinal)
    }
  },[socket,handleUserJoin,handleIncomingCall,handleCallAccepted,handleNegoNeedIncoming,handleNegoFinal])
  
  const [micMuted, setMicMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  
  // Sample user data - would come from props or context in real app
  const currentUser = {
    name: "Sarah Johnson",
    isHost: true
  };

  
  
  const otherUser = {
    name: "Michael Chen",
    isHost: false
  };

  return (
    <div className="flex flex-col h-screen" style={{ backgroundColor: colors.darkBlue }}>
      {/* Header */}
      <div className="flex justify-between items-center p-4" style={{ backgroundColor: colors.navyBlue }}>
        <div className="flex items-center">
          <h1 className="text-xl font-bold" style={{ color: colors.lightGray }}>Video Meeting</h1>
          <span className="ml-3 px-2 py-1 text-xs rounded-full" style={{ backgroundColor: colors.teal, color: colors.lightGray }}>
            Live
          </span>
        </div>
        <div className="flex items-center">
          <span className="mr-4 text-sm" style={{ color: colors.grayTeal }}>{remoteSocketId?
          'Connected':'No one else in the room'}</span>
          <button className="flex items-center justify-center rounded-full p-2" style={{ backgroundColor: colors.teal }}>
            <Users size={18} color={colors.lightGray} />
          </button>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="flex-grow flex flex-col md:flex-row p-4 gap-4 relative">
        {/* Large Video (Other Person) */}
        <h3>Remote Stream</h3>
        {remoteStream && (
          <video
          ref={(video) => {
          if (video) {
            video.srcObject = remoteStream;
            video.play();
            }
          }}
          width={300}
          
          autoPlay
          />
        )}

        
        {/* Self Video (Smaller) */}
        <h3>My Stream</h3>
        {myStream && (
          <video
          ref={(video) => {
          if (video) {
            video.srcObject = myStream;
            video.play();
            }
          }}
          muted
          width={300}
          
          autoPlay
          />
        )}

      </div>
      
      {/* Controls */}
      <div className="p-4" style={{ backgroundColor: colors.navyBlue }}>
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <button 
              className="flex items-center justify-center rounded-full p-3 transition-colors"
              style={{ 
                backgroundColor: micMuted ? colors.teal : 'rgba(116, 141, 146, 0.2)',
                color: colors.lightGray
              }}
              onClick={() => setMicMuted(!micMuted)}
            >
              {micMuted ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
            
            <button 
              className="flex items-center justify-center rounded-full p-3 transition-colors"
              style={{ 
                backgroundColor: videoOff ? colors.teal : 'rgba(116, 141, 146, 0.2)',
                color: colors.lightGray
              }}
              onClick={() => setVideoOff(!videoOff)}
            >
              {videoOff ? <VideoOff size={20} /> : <Video size={20} />}
            </button>
            
            <button 
              className="flex items-center justify-center rounded-full p-3"
              style={{ backgroundColor: 'rgba(116, 141, 146, 0.2)', color: colors.lightGray }}
            >
              <Share size={20} />
            </button>
            
            <button 
              className="flex items-center justify-center rounded-full p-3"
              style={{ backgroundColor: 'rgba(116, 141, 146, 0.2)', color: colors.lightGray }}
            >
              <MessageSquare size={20} />
            </button>
            
            <button 
              className="flex items-center justify-center rounded-full p-3"
              style={{ backgroundColor: 'rgba(116, 141, 146, 0.2)', color: colors.lightGray }}
            >
              <MoreVertical size={20} />
            </button>
          </div>
          
          {remoteSocketId?<button 
            onClick={handleCallUser}
            className="flex items-center justify-center rounded-full p-3 px-6"
            style={{ backgroundColor: 'black', color: 'white' }}
          >
            <Phone size={20} />
            <span className="ml-2 font-medium">Call</span>
          </button>:''}


          {myStream?<button 
            onClick={sendStreams}
            className="flex items-center justify-center rounded-full p-3 px-6"
            style={{ backgroundColor: 'black', color: 'white' }}
          >
            <Phone size={20} />
            <span className="ml-2 font-medium">Send Streams</span>
          </button>:''}
        </div>
      </div>
    </div>
  );
};

export default VideoCallPage;